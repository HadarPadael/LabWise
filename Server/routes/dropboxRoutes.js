const express = require("express");
const {
  getProjects,
  loadToDB,
  addFile,
  updateDescription,
} = require("../controllers/dropboxController");

const router = express.Router();

// List all projects
router.post("/loadToDB", loadToDB); // POST to load data to DB
router.get("/projects", getProjects); // GET projects from the DB

// Add a new file or folder to Dropbox
router.post("/add", addFile);

// Update the description.txt file
router.post("/updateDescription", updateDescription);

module.exports = router;
