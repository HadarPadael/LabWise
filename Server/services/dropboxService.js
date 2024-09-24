const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");
const admin = require("firebase-admin");
const db = require("../config/firebaseConfig");

// Initialize Dropbox SDK
const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN, // Dropbox access token
  fetch: fetch,
});

// Function to list files and folders at a given path
const listDropboxFolder = async (folderPath) => {
  try {
    const response = await dbx.filesListFolder({ path: folderPath });
    return response.result.entries; // Return files and folders in the directory
  } catch (error) {
    console.error("Error listing folder:", error);
    throw error;
  }
};

// Service function to update the description.txt file in Dropbox
const updateDescriptionInDropbox = async (path, description) => {
  try {
    // Upload new content to description.txt in Dropbox
    const response = await dbx.filesUpload({
      path: `${path}/description.txt`, 
      mode: { ".tag": "overwrite" }, // Overwrite the current description.txt file
      contents: description, // updated description content
    });
    return response;
  } catch (error) {
    console.error("Error in Dropbox API:", error.message || error);
    throw error; 
  }
};

// Function to list and build the project structure
const buildProjectStructure = async (rootFolder) => {
  try {
    const projects = await listDropboxFolder(rootFolder);
    let projectStructure = [];
    const processedProjects = new Set(); // Track processed project names

    // Helper function to retrieve description
    const getDescription = async (folderPath) => {
      try {
        const descriptionFilePath = `${folderPath}/description.txt`;
        const response = await dbx.filesDownload({ path: descriptionFilePath });
        return response.result.fileBinary.toString(); // Return the content of description.txt as a string
      } catch (error) {
        console.log(`No description found in ${folderPath}`);
        return ""; // If no description found, return an empty string
      }
    };

    for (const project of projects) {
      if (
        project[".tag"] === "folder" &&
        !processedProjects.has(project.name)
      ) {
        processedProjects.add(project.name);

        // Get the description and path for the project
        const projectDescription = await getDescription(project.path_lower);
        const projectPath = project.path_lower;

        const researchQuestions = await listDropboxFolder(project.path_lower);
        let researchQuestionsArr = [];

        for (const question of researchQuestions) {
          if (question[".tag"] === "folder") {
            const questionDescription = await getDescription(
              question.path_lower
            );
            const questionPath = question.path_lower; 

            const experiments = await listDropboxFolder(question.path_lower);
            let experimentsArr = [];

            for (const experiment of experiments) {
              if (experiment[".tag"] === "folder") {
                const experimentDescription = await getDescription(
                  experiment.path_lower
                );
                const experimentPath = experiment.path_lower; 

                const samples = await listDropboxFolder(experiment.path_lower);
                let samplesArr = [];

                for (const sample of samples) {
                  if (sample[".tag"] === "folder") {
                    const sampleDescription = await getDescription(
                      sample.path_lower
                    );
                    const samplePath = sample.path_lower; 

                    const sampleFiles = await listDropboxFolder(
                      sample.path_lower
                    );
                    let resultFilesArr = [];

                    for (const file of sampleFiles) {
                      if (
                        file[".tag"] === "file" &&
                        file.name !== "description.txt"
                      ) {
                        resultFilesArr.push({
                          name: file.name.toLocaleLowerCase(),
                          path: file.path_lower,
                        });
                      }
                    }

                    samplesArr.push({
                      name: sample.name.toLocaleLowerCase(),
                      description: sampleDescription,
                      path: samplePath, 
                      results: resultFilesArr,
                    });
                  }
                }

                experimentsArr.push({
                  name: experiment.name.toLocaleLowerCase(),
                  description: experimentDescription,
                  path: experimentPath, 
                  samples: samplesArr,
                });
              }
            }

            researchQuestionsArr.push({
              name: question.name.toLocaleLowerCase(),
              description: questionDescription,
              path: questionPath, 
              experiments: experimentsArr,
            });
          }
        }

        projectStructure.push({
          name: project.name.toLowerCase(),
          description: projectDescription,
          path: projectPath, 
          research_questions: researchQuestionsArr,
        });
      } else {
        console.log(
          `Project "${project.name}" has already been processed, skipping.`
        );
      }
    }

    console.log(projectStructure);
    return projectStructure; 
  } catch (error) {
    console.error("Error building project structure:", error);
    throw error;
  }
};

// Function to create a shareable link
async function getShareableLinkService(filePath) {
  try {
    // Step 1: Check if a shared link already exists for the file
    const listResponse = await dbx.sharingListSharedLinks({
      path: filePath,
      direct_only: true, // Only return direct shared links for the exact file
    });

    // Step 2: If an existing link is found, return it
    if (listResponse.result.links.length > 0) {
      const existingLink = listResponse.result.links[0].url;
      console.log("Existing shareable link found:", existingLink);
      return existingLink;
    }

    // Step 3: If no existing link, create a new shared link
    const response = await dbx.sharingCreateSharedLinkWithSettings({
      path: filePath,
    });

    // Step 4: Return the newly created shared link
    return response.result.url;
  } catch (error) {
    console.error("Error generating shareable link:", error);
    throw error;
  }
}

// Helper to create or update project in Firestore
const addNewProject = async (metadata) => {
  try {
    const projectRef = db.collection("projects").doc(metadata.name);
    await projectRef.set({
      name: metadata.name,
      description: metadata.description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`New project added with ID: ${metadata.name}`);
  } catch (error) {
    console.error("Error adding new project:", error);
  }
};

// Helper to find an item by name
const findByName = (arr, name) => arr.find((item) => item.name === name);

// Helper to get the project document
const getProjectData = async (projectName) => {
  console.log(projectName);
  const projectRef = db.collection("projects").doc(projectName);
  const projectDoc = await projectRef.get();
  if (!projectDoc.exists) {
    throw new Error(`Project ${projectName} does not exist.`);
  }
  return { projectRef, projectData: projectDoc.data() };
};

// Helper to prepare metadata based on the level
const prepareMetadata = (
  level,
  name,
  description,
  parentPath,
  fileName = null
) => {
  const metadata = {
    description,
    path: `${parentPath}/${fileName || name}`, // Use fileName for results, otherwise use name
    ...(fileName && { file: fileName }), // Add the file if it exists
  };

  // Special handling for results: fileName becomes the name
  if (level === "results") {
    if (!fileName) throw new Error("File name is required for results.");
    metadata.name = fileName;
  } else {
    metadata.name = name;
  }

  return metadata;
};

// Helper to get the project data
const getProject = async (projectName) => {
  const { projectRef, projectData } = await getProjectData(projectName);
  if (!projectRef || !projectData)
    throw new Error(`Project ${projectName} does not exist.`);
  return { projectRef, projectData };
};

// Helper to determine the update data based on the level
const buildUpdateData = (level, metadata, pathSegments, projectData) => {
  switch (level) {
    case "research_questions":
      return handleResearchQuestionUpdate(metadata, projectData);
    case "experiments":
      return handleExperimentUpdate(metadata, pathSegments, projectData);
    case "samples":
      return handleSampleUpdate(metadata, pathSegments, projectData);
    case "results":
      return handleResultUpdate(metadata, pathSegments, projectData);
    default:
      throw new Error(`Invalid level: ${level}`);
  }
};

// Main function to add metadata to Firebase
const addMetadataToFirebase = async (
  level,
  name,
  description,
  parentPath,
  fileName = null
) => {
  try {
    // Normalize the level (replace spaces with underscore)
    level = level.toLowerCase().replace(/\s+/g, "_");

    // For projects, set the parentPath to /labwise
    if (level === "projects") parentPath = "/labwise";

    // Prepare metadata
    const metadata = prepareMetadata(
      level,
      name,
      description,
      parentPath,
      fileName
    );

    // Handle adding a new project
    if (level === "projects") {
      await addNewProject(metadata, parentPath);
      return;
    }

    // Get the project data
    console.log("service:", parentPath);
    const pathSegments = parentPath.split("/");
    const projectName = pathSegments[2]; 
    const { projectRef, projectData } = await getProject(projectName);

    // Build the update data based on the level
    const updateData = buildUpdateData(
      level,
      metadata,
      pathSegments,
      projectData
    );

    // Update Firestore with the new metadata
    await projectRef.update(updateData);
    console.log(
      `Metadata for ${metadata.name} added to Firebase under ${parentPath}`
    );
  } catch (error) {
    console.error("Error in addMetadataToFirebase:", error);
    throw new Error(`Error adding ${level} metadata to Firebase`);
  }
};


const handleResearchQuestionUpdate = (metadata, projectData) => {
  projectData.research_questions = projectData.research_questions || [];
  const existingQuestion = findByName(
    projectData.research_questions,
    metadata.name
  );

  if (existingQuestion) {
    throw new Error(
      `Research question with name ${metadata.name} already exists.`
    );
  }

  return {
    research_questions: admin.firestore.FieldValue.arrayUnion(metadata),
  };
};

const handleExperimentUpdate = (metadata, pathSegments, projectData) => {
  const researchQuestion = findByName(
    projectData.research_questions,
    pathSegments[3]
  );
  if (!researchQuestion) {
    throw new Error(`Research question ${pathSegments[3]} not found.`);
  }

  researchQuestion.experiments = researchQuestion.experiments || [];
  const existingExperiment = findByName(
    researchQuestion.experiments,
    metadata.name
  );
  if (existingExperiment) {
    throw new Error(`Experiment with name ${metadata.name} already exists.`);
  }

  researchQuestion.experiments.push(metadata);
  return { research_questions: projectData.research_questions };
};

const handleSampleUpdate = (metadata, pathSegments, projectData) => {
  const researchQuestion = findByName(
    projectData.research_questions,
    pathSegments[3]
  );
  const experiment = findByName(researchQuestion.experiments, pathSegments[4]);
  if (!experiment) {
    throw new Error(`Experiment ${pathSegments[4]} not found.`);
  }

  experiment.samples = experiment.samples || [];
  const existingSample = findByName(experiment.samples, metadata.name);
  if (existingSample) {
    throw new Error(`Sample with name ${metadata.name} already exists.`);
  }

  experiment.samples.push(metadata);
  return { research_questions: projectData.research_questions };
};

const handleResultUpdate = (metadata, pathSegments, projectData) => {
  const researchQuestion = findByName(
    projectData.research_questions,
    pathSegments[3]
  );
  const experiment = findByName(researchQuestion.experiments, pathSegments[4]);
  const sample = findByName(experiment.samples, pathSegments[5]);
  if (!sample) {
    throw new Error(`Sample ${pathSegments[5]} not found.`);
  }

  sample.results = sample.results || [];
  const existingResult = findByName(sample.results, metadata.name);
  if (existingResult) {
    throw new Error(`Result with name ${metadata.name} already exists.`);
  }

  sample.results.push(metadata);
  return { research_questions: projectData.research_questions };
};

// Main function to remove metadata from Firebase
const removeItemFromFirebase = async (level, path, itemName) => {
  try {
    // Normalize level
    level = level.toLowerCase().replace(/\s+/g, "_");

    // If at the "projects" level, delete the entire document
    if (level === "projects") {
      const { projectRef } = await getProjectData(itemName);
      await projectRef.delete();
      console.log(`Project ${itemName} deleted from Firebase successfully.`);
      return;
    } else {
      // Split path and get project name
      const pathSegments = path.split("/");
      const projectName = pathSegments[2]; 

      // Retrieve the project data
      const { projectRef, projectData } = await getProjectData(projectName);

      // Handle the removal based on the level
      const updateData = buildRemoveData(
        level,
        itemName,
        pathSegments,
        projectData
      );

      // Update Firestore by rebuilding the array without the removed item
      await projectRef.update(updateData);
    }
    console.log(`Metadata for ${itemName} removed from Firebase under ${path}`);
  } catch (error) {
    console.error("Error in removeItemFromFirebase:", error);
    throw new Error(`Error removing ${level} metadata from Firebase`);
  }
};

// Helper to determine the removal data based on the level
const buildRemoveData = (level, itemName, pathSegments, projectData) => {
  switch (level) {
    case "research_questions":
      return handleResearchQuestionRemove(itemName, projectData);
    case "experiments":
      return handleExperimentRemove(itemName, pathSegments, projectData);
    case "samples":
      return handleSampleRemove(itemName, pathSegments, projectData);
    case "results":
      return handleResultRemove(itemName, pathSegments, projectData);
    default:
      throw new Error(`Invalid level: ${level}`);
  }
};

const handleResearchQuestionRemove = (itemName, projectData) => {
  const researchQuestions = projectData.research_questions || [];
  const questionToRemove = findByName(researchQuestions, itemName);
  if (!questionToRemove) {
    throw new Error(`Research question ${itemName} not found.`);
  }

  return {
    research_questions: researchQuestions.filter(
      (question) => question.name !== itemName
    ),
  };
};

const handleExperimentRemove = (itemName, pathSegments, projectData) => {
  const researchQuestion = findByName(
    projectData.research_questions,
    pathSegments[3]
  );
  if (!researchQuestion) {
    throw new Error(`Research question ${pathSegments[3]} not found.`);
  }

  const experiments = researchQuestion.experiments || [];
  const experimentToRemove = findByName(experiments, itemName);
  if (!experimentToRemove) {
    throw new Error(`Experiment ${itemName} not found.`);
  }

  researchQuestion.experiments = experiments.filter(
    (experiment) => experiment.name !== itemName
  );
  return { research_questions: projectData.research_questions };
};

const handleSampleRemove = (itemName, pathSegments, projectData) => {
  const researchQuestion = findByName(
    projectData.research_questions,
    pathSegments[3]
  );
  const experiment = findByName(researchQuestion.experiments, pathSegments[4]);
  if (!experiment) {
    throw new Error(`Experiment ${pathSegments[4]} not found.`);
  }

  const samples = experiment.samples || [];
  const sampleToRemove = findByName(samples, itemName);
  if (!sampleToRemove) {
    throw new Error(`Sample ${itemName} not found.`);
  }

  experiment.samples = samples.filter((sample) => sample.name !== itemName);
  return { research_questions: projectData.research_questions };
};

const handleResultRemove = (itemName, pathSegments, projectData) => {
  const researchQuestion = findByName(
    projectData.research_questions,
    pathSegments[3]
  );
  const experiment = findByName(researchQuestion.experiments, pathSegments[4]);
  const sample = findByName(experiment.samples, pathSegments[5]);
  if (!sample) {
    throw new Error(`Sample ${pathSegments[5]} not found.`);
  }

  const results = sample.results || [];
  const resultToRemove = findByName(results, itemName);
  if (!resultToRemove) {
    throw new Error(`Result ${itemName} not found.`);
  }

  sample.results = results.filter((result) => result.name !== itemName);
  return { research_questions: projectData.research_questions };
};

module.exports = {
  buildProjectStructure,
  listDropboxFolder,
  updateDescriptionInDropbox,
  getShareableLinkService,
  addMetadataToFirebase,
  removeItemFromFirebase,
  dbx,
};
