const express = require("express");
const {
  getProjects,
  downloadFile,
  loadToDB,
  addFile,
  editDescription,
} = require("../controllers/dropboxController");

const router = express.Router();

// List all projects
router.post("/loadToDB", loadToDB); // POST to load data to DB
router.get("/projects", getProjects); // GET projects from the DB

// Download a specific file from Dropbox
router.get("/download/:filePath", downloadFile);

// Add a new file or folder to Dropbox
router.post("/add", addFile);

// Edit the description.txt file
router.put("/edit", editDescription);

module.exports = router;
