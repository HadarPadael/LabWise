const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");

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

// Upload a new file to Dropbox
const uploadFileToDropbox = async (filePath, fileContents) => {
  try {
    await dbx.filesUpload({
      path: filePath,
      contents: fileContents,
      mode: { ".tag": "overwrite" },
    });
    console.log("File uploaded successfully.");
  } catch (error) {
    console.error("Error uploading file:", error);
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

// Export the function
module.exports = {
  buildProjectStructure,
  listDropboxFolder,
  uploadFileToDropbox,
  updateDescriptionInDropbox,
  getShareableLinkService,
};
