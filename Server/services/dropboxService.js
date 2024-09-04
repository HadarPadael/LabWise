const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");

// Initialize Dropbox SDK
const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN, // Use your Dropbox access token
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

// Download a specific file from Dropbox
const downloadFileFromDropbox = async (filePath) => {
  try {
    const response = await dbx.filesDownload({ path: filePath });
    return response.result.fileBinary; // Return the file content
  } catch (error) {
    console.error("Error downloading file:", error);
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

// Edit the description.txt file for a given folder
const editDescriptionInDropbox = async (folderPath, descriptionContent) => {
  const descriptionFilePath = `${folderPath}/description.txt`;
  return await uploadFileToDropbox(descriptionFilePath, descriptionContent);
};

// Function to list and build the project structure
const buildProjectStructure = async (rootFolder) => {
  try {
    const projects = await listDropboxFolder(rootFolder);
    let projectStructure = [];

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
      if (project[".tag"] === "folder") {
        // Get the description for the project
        const projectDescription = await getDescription(project.path_lower);

        // For each project folder
        const researchQuestions = await listDropboxFolder(project.path_lower);
        let researchQuestionsArr = [];

        for (const question of researchQuestions) {
          if (question[".tag"] === "folder") {
            // Get the description for the research question
            const questionDescription = await getDescription(
              question.path_lower
            );

            // For each research question folder
            const experiments = await listDropboxFolder(question.path_lower);
            let experimentsArr = [];

            for (const experiment of experiments) {
              if (experiment[".tag"] === "folder") {
                // Get the description for the experiment
                const experimentDescription = await getDescription(
                  experiment.path_lower
                );

                // For each experiment folder
                const samples = await listDropboxFolder(experiment.path_lower);
                let samplesArr = [];

                for (const sample of samples) {
                  if (sample[".tag"] === "folder") {
                    // Get the description for the sample
                    const sampleDescription = await getDescription(
                      sample.path_lower
                    );

                    // For each sample folder
                    const sampleFiles = await listDropboxFolder(
                      sample.path_lower
                    );
                    let resultFilesArr = [];

                    // Store files separately from description.txt
                    for (const file of sampleFiles) {
                      if (file[".tag"] === "file") {
                        // Skip description.txt and add the other files as results
                        if (file.name !== "description.txt") {
                          resultFilesArr.push({
                            file_name: file.name,
                            file_path: file.path_lower,
                          });
                        }
                      }
                    }

                    // Push the sample folder with its results and description
                    samplesArr.push({
                      sample_id: sample.name,
                      description: sampleDescription,
                      results: resultFilesArr, // Use results instead of generic files
                    });
                  }
                }

                // Push the experiment folder with its samples and description
                experimentsArr.push({
                  experiment_id: experiment.name,
                  description: experimentDescription,
                  samples: samplesArr,
                });
              }
            }

            // Push the research question folder with its experiments and description
            researchQuestionsArr.push({
              question: question.name,
              description: questionDescription,
              experiments: experimentsArr,
            });
          }
        }

        // Push the project folder with its research questions and description
        projectStructure.push({
          project_name: project.name,
          description: projectDescription,
          research_questions: researchQuestionsArr,
        });
      }
    }

    return projectStructure; // This structure matches the JSON format
  } catch (error) {
    console.error("Error building project structure:", error);
    throw error;
  }
};

// Export the function
module.exports = {
  buildProjectStructure,
  listDropboxFolder,
  downloadFileFromDropbox,
  uploadFileToDropbox,
  editDescriptionInDropbox,
};
