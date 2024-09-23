const db = require("../config/firebaseConfig");
const {
  updateDescriptionInDropbox,
  addMetadataToFirebase,
  buildProjectStructure,
  getShareableLinkService,
  removeItemFromFirebase,
  dbx,
} = require("../services/dropboxService");

exports.loadToDB = async (req, res) => {
  try {
    // Fetch projects from Dropbox
    const projects = await buildProjectStructure("/LabWise");

    let newProjectCount = 0;

    // Add each project to Firestore if it doesn't already exist
    for (const project of projects) {
      const projectRef = db.collection("projects").doc(project.name);
      const doc = await projectRef.get();

      if (!doc.exists) {
        // Add the full structure (including research questions, experiments, etc.)
        await projectRef.set({
          name: project.name,
          description: project.description,
          path: project.path,
          research_questions: project.research_questions.map((rq) => ({
            name: rq.name,
            description: rq.description,
            path: rq.path,
            experiments: rq.experiments.map((exp) => ({
              name: exp.name,
              description: exp.description,
              path: exp.path,
              samples: exp.samples.map((sample) => ({
                name: sample.name,
                description: sample.description,
                path: sample.path,
                results: sample.results.map((result) => ({
                  name: result.name,
                  file_path: result.file_path,
                })),
              })),
            })),
          })),
        });
        newProjectCount++;
      } else {
        console.log(
          `Project "${project.project_name}" already exists, skipping.`
        );
      }
    }

    res
      .status(200)
      .send(`${newProjectCount} new projects successfully loaded to Firebase.`);
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

// Controller to handle updating the description
exports.updateDescription = async (req, res) => {
  const { path, description } = req.body;

  try {
    // Step 1: Update the description in Dropbox
    await updateDescriptionInDropbox(path, description);

    // Step 2: Parse the path segments
    const pathSegments = path.split("/").filter(Boolean);

    // Map the path segments to Firestore document references
    const projectName = pathSegments[1]; // Project name
    const researchQuestionName = pathSegments[2]; // Research question name (optional)
    const experimentName = pathSegments[3]; // Experiment name (optional)
    const sampleName = pathSegments[4]; // Sample name (optional)

    // Step 3: Reference the project document
    const projectRef = db
      .collection("projects")
      .where("name", "==", projectName);
    const projectSnapshot = await projectRef.get();

    if (projectSnapshot.empty) {
      return res.status(404).send("Project not found.");
    }

    const projectDoc = projectSnapshot.docs[0];

    // Step 4: Handle the nested field updates
    if (!researchQuestionName) {
      // Update the project description (at the project level)
      await projectDoc.ref.update({
        description: description,
      });
    } else if (!experimentName) {
      // Update the research question description (nested field)
      let researchQuestions = projectDoc.data().research_questions || [];
      researchQuestions = researchQuestions.map((rq) => {
        if (rq.name === researchQuestionName) {
          rq.description = description;
        }
        return rq;
      });
      await projectDoc.ref.update({ research_questions: researchQuestions });
    } else if (!sampleName) {
      // Update the experiment description (nested field)
      let researchQuestions = projectDoc.data().research_questions || [];
      researchQuestions = researchQuestions.map((rq) => {
        if (rq.name === researchQuestionName) {
          rq.experiments = rq.experiments.map((exp) => {
            if (exp.name === experimentName) {
              exp.description = description;
            }
            return exp;
          });
        }
        return rq;
      });
      await projectDoc.ref.update({ research_questions: researchQuestions });
    } else {
      // Update the sample description (nested field)
      let researchQuestions = projectDoc.data().research_questions || [];
      researchQuestions = researchQuestions.map((rq) => {
        if (rq.name === researchQuestionName) {
          rq.experiments = rq.experiments.map((exp) => {
            if (exp.name === experimentName) {
              exp.samples = exp.samples.map((sample) => {
                if (sample.name === sampleName) {
                  sample.description = description;
                }
                return sample;
              });
            }
            return exp;
          });
        }
        return rq;
      });
      await projectDoc.ref.update({ research_questions: researchQuestions });
    }

    res.status(200).send("Description updated successfully in Firestore.");
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).send("Error updating description.");
  }
};

// Controller to get a shareable link for a Dropbox file
exports.getShareableLink = async (req, res) => {
  console.log("Request received:", req.body); // Add this line to log the request
  const { filePath } = req.body;

  try {
    const shareableUrl = await getShareableLinkService(filePath);
    res.status(200).json({ url: shareableUrl });
  } catch (error) {
    console.error("Error generating shareable link:", error);
    res.status(500).send("Error generating shareable link.");
  }
};

// Add a new item (file/folder)
exports.addNew = async (req, res) => {
    const { level, name, description, parentPath } = req.body;
    let folderPath = '';

    try {
        // Construct the Dropbox path based on parentPath and name
        if (level === 'results') {
            // Results - handle as a file
            const file = req.file;  // Get the uploaded file
            const filePath = `${parentPath}/${file.originalname}`;

            // Upload the file to Dropbox
            await dbx.filesUpload({
                path: filePath,
                contents: file.buffer, // File contents from Multer
            });

            // Add metadata to Firebase
            await addMetadataToFirebase(level, name, description, parentPath, file.originalname);

        } else {
            // Folder structure for Projects, Research Questions, Experiments, Samples
            folderPath = `${parentPath}/${name}`;

            // Create folder in Dropbox
            await dbx.filesCreateFolderV2({ path: folderPath });

            // Add description.txt file in the folder
            await dbx.filesUpload({
                path: `${folderPath}/description.txt`,
                contents: Buffer.from(description), // Write description as a file
            });

            // Add metadata to Firebase
            await addMetadataToFirebase(level, name, description, parentPath);
        }

        res.status(200).json({ message: `${name} added successfully!` });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ message: "Error adding item", error: error.message });
    }
};

exports.removeItem = async (req, res) => {
  try {
    const { level, path, itemName } = req.body;

    // Call the service to remove the item from Firebase
    await removeItemFromFirebase(level, path, itemName);

    res.status(200).json({ message: `${level} removed successfully` });
  } catch (error) {
    console.error("Error in removeItem:", error);
    res.status(500).json({ error: "Failed to remove item from Firebase" });
  }
};
