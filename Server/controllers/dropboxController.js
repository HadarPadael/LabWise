const {
  downloadFileFromDropbox,
  uploadFileToDropbox,
  editDescriptionInDropbox,
  buildProjectStructure,
} = require("../services/dropboxService");

const Project = require("../models/Project");

exports.loadToDB = async (req, res) => {
  try {
    // Check if there are any projects in the database
    const existingProjects = await Project.find({});

    if (existingProjects.length > 0) {
      console.log("Projects already exist in the database.");
      return res.status(200).send("Projects already exist in the database.");
    }

    // If no projects exist, proceed to load the data
    const projects = await buildProjectStructure("/LabWise");

    for (const project of projects) {
      await Project.create({
        project_name: project.project_name,
        description: project.description,
        research_questions: project.research_questions.map((rq) => ({
          question: rq.question,
          description: rq.description,
          experiments: rq.experiments.map((exp) => ({
            experiment_id: exp.experiment_id,
            description: exp.description,
            samples: exp.samples.map((sample) => ({
              sample_id: sample.sample_id,
              description: sample.description,
              results: sample.results.map((result) => ({
                file_name: result.file_name,
                file_path: result.file_path,
              })),
            })),
          })),
        })),
      });
    }

    res.status(200).send("Data successfully loaded to the database.");
  } catch (error) {
    console.error("Error loading data to the database:", error);
    res.status(500).send("Error loading data to the database.");
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Download a file from Dropbox
exports.downloadFile = async (req, res) => {
  const filePath = `/LabWise/${req.params.filePath}`;
  try {
    const file = await downloadFileFromDropbox(filePath);
    res.status(200).send(file);
  } catch (error) {
    res.status(500).json({ error: "Error downloading file from Dropbox" });
  }
};

// Add a new file or folder to Dropbox
exports.addFile = async (req, res) => {
  const { folderPath, fileName, fileContent } = req.body;
  try {
    const filePath = `${folderPath}/${fileName}`;
    const result = await uploadFileToDropbox(filePath, fileContent);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error adding new file to Dropbox" });
  }
};

// Edit a description file in Dropbox
exports.editDescription = async (req, res) => {
  const { folderPath, descriptionContent } = req.body;
  try {
    await editDescriptionInDropbox(folderPath, descriptionContent);
    res.status(200).json({ message: "Description updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating description" });
  }
};
