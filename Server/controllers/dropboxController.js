const {
  downloadFileFromDropbox,
  uploadFileToDropbox,
  editDescriptionInDropbox,
  buildProjectStructure,
} = require("../services/dropboxService");

exports.getProjects = async (req, res) => {
  try {
    const projectStructure = await buildProjectStructure("/LabWise"); // Path to your root Dropbox folder
    console.log(JSON.stringify(projectStructure, null, 2));
    res.status(200).json(projectStructure);
  } catch (error) {
    console.error("Error fetching projects from Dropbox:", error);
    res.status(500).json({ error: "Failed to retrieve projects" });
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
