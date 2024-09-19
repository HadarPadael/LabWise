const connectDB = require("../config/firebaseConfig");
const {
  updateDescriptionInDropbox,
  uploadFileToDropbox,
  buildProjectStructure,
} = require("../services/dropboxService");

const db = connectDB();

exports.loadToDB = async (req, res) => {
  try {
    // Fetch existing projects
    const existingProjects = await db.collection("projects").get();

    // Only load data from Dropbox if there are no projects in Firestore
    if (!existingProjects.empty) {
      return res.status(200).send("Projects already exist in the database.");
    }

    // Fetch projects from Dropbox
    const projects = await buildProjectStructure("/LabWise");

    // Add each project to Firestore
    for (const project of projects) {
      await db.collection("projects").add({
        project_name: project.project_name,
        description: project.description,
        path: project.path,
        research_questions: project.research_questions.map((rq) => ({
          question: rq.question,
          description: rq.description,
          path: rq.path,
          experiments: rq.experiments.map((exp) => ({
            experiment_id: exp.experiment_id,
            description: exp.description,
            path: exp.path,
            samples: exp.samples.map((sample) => ({
              sample_id: sample.sample_id,
              description: sample.description,
              path: sample.path,
              results: sample.results.map((result) => ({
                file_name: result.file_name,
                file_path: result.file_path,
              })),
            })),
          })),
        })),
      });
    }

    res.status(200).send("Data successfully loaded to Firebase.");
  } catch (error) {
    console.error("Error loading data to Firebase:", error);
    res.status(500).send("Error loading data to Firebase.");
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projectsSnapshot = await db.collection("projects").get();
    const projects = [];
    projectsSnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects from Firebase:", error);
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
  const { path, description } = req.body;

  try {
    await updateDescriptionInDropbox(path, description);
    res.status(200).json({ message: "Description updated successfully." });
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({ message: "Error updating description." });
  }
};
