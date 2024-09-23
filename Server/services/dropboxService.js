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
      path: `${path}/description.txt`, // Ensure the correct file path is provided
      mode: { ".tag": "overwrite" }, // Overwrite the current description.txt file
      contents: description, // Pass the updated description content
    });
    return response;
  } catch (error) {
    console.error("Error in Dropbox API:", error.message || error);
    throw error; // Throw error to be caught by the controller
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
            const questionPath = question.path_lower; // Add path

            const experiments = await listDropboxFolder(question.path_lower);
            let experimentsArr = [];

            for (const experiment of experiments) {
              if (experiment[".tag"] === "folder") {
                const experimentDescription = await getDescription(
                  experiment.path_lower
                );
                const experimentPath = experiment.path_lower; // Add path

                const samples = await listDropboxFolder(experiment.path_lower);
                let samplesArr = [];

                for (const sample of samples) {
                  if (sample[".tag"] === "folder") {
                    const sampleDescription = await getDescription(
                      sample.path_lower
                    );
                    const samplePath = sample.path_lower; // Add path

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
                          file_path: file.path_lower,
                        });
                      }
                    }

                    samplesArr.push({
                      name: sample.name.toLocaleLowerCase(),
                      description: sampleDescription,
                      path: samplePath, // Add path
                      results: resultFilesArr,
                    });
                  }
                }

                experimentsArr.push({
                  name: experiment.name.toLocaleLowerCase(),
                  description: experimentDescription,
                  path: experimentPath, // Add path
                  samples: samplesArr,
                });
              }
            }

            researchQuestionsArr.push({
              name: question.name.toLocaleLowerCase(),
              description: questionDescription,
              path: questionPath, // Add path
              experiments: experimentsArr,
            });
          }
        }

        projectStructure.push({
          name: project.name.toLowerCase(),
          description: projectDescription,
          path: projectPath, // Add path
          research_questions: researchQuestionsArr,
        });
      } else {
        console.log(
          `Project "${project.name}" has already been processed, skipping.`
        );
      }
    }

    console.log(projectStructure);
    return projectStructure; // This structure matches the JSON format
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
  const projectRef = db.collection("projects").doc(projectName);
  const projectDoc = await projectRef.get();
  if (!projectDoc.exists) {
    throw new Error(`Project ${projectName} does not exist.`);
  }
  return { projectRef, projectData: projectDoc.data() };
};

// Helper to ensure metadata is valid
const prepareMetadata = (level, name, description, fileName, parentPath) => {
  let metadata = { name, description };
  
  if (level === "results") {
    if (!fileName) {
      throw new Error("File name is required for results.");
    }
    metadata.name = fileName;
    metadata.file = fileName;
    metadata.path = `${parentPath}/${fileName}`;
  }

  if (!metadata.name || !metadata.description) {
    throw new Error(`Missing name or description for ${level}`);
  }

  return metadata;
};

// Helper to handle each level update
const handleLevelUpdate = (level, metadata, pathSegments, projectData) => {
  const levelFieldMap = {
    research_questions: "research_questions",
    experiments: "experiments",
    samples: "samples",
    results: "results",
  };

  const field = levelFieldMap[level];
  if (!field) {
    throw new Error(`Invalid level: ${level}`);
  }

  let updateData = {};

  if (level === "research_questions") {
    projectData.research_questions = projectData.research_questions || [];
    const existingQuestion = findByName(projectData.research_questions, metadata.name);
    if (existingQuestion) {
      throw new Error(`Research question with name ${metadata.name} already exists.`);
    }
    updateData[`research_questions`] = admin.firestore.FieldValue.arrayUnion(metadata);

  } else if (level === "experiments") {
    updateData = handleExperimentUpdate(metadata, pathSegments, projectData);

  } else if (level === "samples") {
    updateData = handleSampleUpdate(metadata, pathSegments, projectData);

  } else if (level === "results") {
    updateData = handleResultUpdate(metadata, pathSegments, projectData);
  }

  return updateData;
};

// Helper for experiment level
const handleExperimentUpdate = (metadata, pathSegments, projectData) => {
  const researchQuestionName = pathSegments[3];
  const researchQuestion = findByName(projectData.research_questions, researchQuestionName);
  if (!researchQuestion) {
    throw new Error(`Research question ${researchQuestionName} not found.`);
  }

  researchQuestion.experiments = researchQuestion.experiments || [];
  const existingExperiment = findByName(researchQuestion.experiments, metadata.name);
  if (existingExperiment) {
    throw new Error(`Experiment with name ${metadata.name} already exists.`);
  }

  researchQuestion.experiments.push(metadata);
  return { "research_questions": projectData.research_questions };
};

// Helper for sample level
const handleSampleUpdate = (metadata, pathSegments, projectData) => {
  const researchQuestionName = pathSegments[3];
  const experimentName = pathSegments[4];
  const researchQuestion = findByName(projectData.research_questions, researchQuestionName);
  if (!researchQuestion) {
    throw new Error(`Research question ${researchQuestionName} not found.`);
  }

  const experiment = findByName(researchQuestion.experiments, experimentName);
  if (!experiment) {
    throw new Error(`Experiment ${experimentName} not found.`);
  }

  experiment.samples = experiment.samples || [];
  const existingSample = findByName(experiment.samples, metadata.name);
  if (existingSample) {
    throw new Error(`Sample with name ${metadata.name} already exists.`);
  }

  experiment.samples.push(metadata);
  return { "research_questions": projectData.research_questions };
};

// Helper for result level
const handleResultUpdate = (metadata, pathSegments, projectData) => {
  const researchQuestionName = pathSegments[3];
  const experimentName = pathSegments[4];
  const sampleName = pathSegments[5];
  const researchQuestion = findByName(projectData.research_questions, researchQuestionName);
  if (!researchQuestion) {
    throw new Error(`Research question ${researchQuestionName} not found.`);
  }

  const experiment = findByName(researchQuestion.experiments, experimentName);
  if (!experiment) {
    throw new Error(`Experiment ${experimentName} not found.`);
  }

  const sample = findByName(experiment.samples, sampleName);
  if (!sample) {
    throw new Error(`Sample ${sampleName} not found.`);
  }

  sample.results = sample.results || [];
  const existingResult = findByName(sample.results, metadata.name);
  if (existingResult) {
    throw new Error(`Result with name ${metadata.name} already exists.`);
  }

  sample.results.push(metadata);
  return { "research_questions": projectData.research_questions };
};

// Main function to add metadata
const addMetadataToFirebase = async (level, name, description, parentPath, fileName = null) => {
  try {
    // Normalize level and prepare metadata
    level = level.toLowerCase().replace(/\s+/g, "_");
    const metadata = prepareMetadata(level, name, description, fileName, parentPath);

    if (level === "projects") {
      await addNewProject(metadata);
      return;
    }

    const pathSegments = parentPath.split("/");
    const projectName = pathSegments[2]; // Assuming path starts with /projects/project_name
    const { projectRef, projectData } = await getProjectData(projectName);

    const updateData = handleLevelUpdate(level, metadata, pathSegments, projectData);

    // Update the document with the modified data
    await projectRef.update(updateData);

    console.log(`Metadata for ${name} added to Firebase under ${parentPath}`);
  } catch (error) {
    console.error("Error in addMetadataToFirebase:", error);
    throw new Error(`Error adding ${level} metadata to Firebase`);
  }
};

// Export the function
module.exports = {
  buildProjectStructure,
  listDropboxFolder,
  updateDescriptionInDropbox,
  getShareableLinkService,
  addMetadataToFirebase,
  dbx,
};
