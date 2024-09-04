const express = require("express");
const {
  getProjects,
  downloadFile,
  addFile,
  editDescription,
} = require("../controllers/dropboxController");

const router = express.Router();

// List all projects
router.get("/projects", getProjects);

// Download a specific file from Dropbox
router.get("/download/:filePath", downloadFile);

// Add a new file or folder to Dropbox
router.post("/add", addFile);

// Edit the description.txt file
router.put("/edit", editDescription);

module.exports = router;
