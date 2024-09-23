const express = require("express");
const upload = require("../middleware/multerConfig");
const {
  getProjects,
  loadToDB,
  addNew,
  updateDescription,
  getShareableLink,
  removeItem,
} = require("../controllers/dropboxController");

const router = express.Router();

// List all projects
router.post("/loadToDB", loadToDB); // POST to load data to DB
router.get("/projects", getProjects); // GET projects from the DB

// Add a new file or folder to Dropbox
router.post("/addNew", upload.single("file"), addNew);

// Convert to shareable link
router.post("/getShareableLink", getShareableLink);

// Update the description.txt file
router.post("/updateDescription", updateDescription);

//remove item from firebase only
router.post("/removeItem", removeItem);

module.exports = router;
