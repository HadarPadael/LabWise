const {
  updateDescriptionInDropbox,
  uploadFileToDropbox,
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
      const existingProject = await Project.findOne({
        project_name: project.project_name,
      });
      if (!existingProject) {
        await Project.create({
          project_name: project.project_name,
          description: project.description,
          path: project.path, // Add the path field
          research_questions: project.research_questions.map((rq) => ({
            question: rq.question,
            description: rq.description,
            path: rq.path, // Add the path field
            experiments: rq.experiments.map((exp) => ({
              experiment_id: exp.experiment_id,
              description: exp.description,
              path: exp.path, // Add the path field
              samples: exp.samples.map((sample) => ({
                sample_id: sample.sample_id,
                description: sample.description,
                path: sample.path, // Add the path field
                results: sample.results.map((result) => ({
                  file_name: result.file_name,
                  file_path: result.file_path,
                })),
              })),
            })),
          })),
        });
      } else {
        console.log(
          `Project "${project.project_name}" already exists, skipping.`
        );
      }
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

// Controller to handle updating the description
exports.updateDescription = async (req, res) => {
  const { path, description } = req.body; // Get path and description from request body

  try {
    // Call the service to update the description
    await updateDescriptionInDropbox(path, description);
    res.status(200).json({ message: "Description updated successfully." });
  } catch (error) {
    console.error("Error updating description:", error.message || error);
    res.status(500).json({ message: "Error updating description." });
  }
};