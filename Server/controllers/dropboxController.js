const connectDB = require("../config/firebaseConfig");
const {
  updateDescriptionInDropbox,
  uploadFileToDropbox,
  buildProjectStructure,
  listDropboxFolder,
} = require("../services/dropboxService");

const db = connectDB();

exports.loadToDB = async (req, res) => {
  try {
    // Fetch projects from Dropbox
    const projects = await buildProjectStructure("/LabWise");

    let newProjectCount = 0;

    // Add each project to Firestore if it doesn't already exist
    for (const project of projects) {
      const projectRef = db.collection("projects").doc(project.project_name);
      const doc = await projectRef.get();

      if (!doc.exists) {
        // Add the full structure (including research questions, experiments, etc.)
        await projectRef.set({
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
    // Step 1: Update the description in Dropbox
    await updateDescriptionInDropbox(path, description);

    // Step 2: Parse the path to determine what needs to be updated
    const pathSegments = path.split("/").filter(Boolean); // Remove empty elements
    console.log(pathSegments[0]);
    console.log(pathSegments[1]);

    // The first segment is the root folder (e.g., "LabWise")
    // The second segment is the project name
    const projectName = pathSegments[1];

    // If there are more segments, it means we're updating a sub-collection
    const researchQuestionName = pathSegments[2]; // Optional
    const experimentName = pathSegments[3]; // Optional
    const sampleName = pathSegments[4]; // Optional
    const resultFileName = pathSegments[5]; // Optional

    // Step 3: Query Firestore based on the path structure
    const projectSnapshot = await db
      .collection("projects")
      .where("project_name", "==", projectName)
      .get();

    if (projectSnapshot.empty) {
      return res.status(404).send("Project not found.");
    }

    const projectDoc = projectSnapshot.docs[0];
    const projectId = projectDoc.id; // Get the project's document ID

    // Step 4: Depending on how many segments there are, navigate to the correct sub-collection
    if (!researchQuestionName) {
      // Update the project description
      await projectDoc.ref.update({
        description: description,
      });
    } else if (!experimentName) {
      // Update the research question description
      const researchQuestionSnapshot = await projectDoc.ref
        .collection("research_questions")
        .where("name", "==", researchQuestionName)
        .get();

      if (researchQuestionSnapshot.empty) {
        return res.status(404).send("Research question not found.");
      }

      const researchQuestionDoc = researchQuestionSnapshot.docs[0];
      await researchQuestionDoc.ref.update({
        description: description,
      });
    } else if (!sampleName) {
      // Update the experiment description
      const experimentSnapshot = await projectDoc.ref
        .collection("research_questions")
        .doc(researchQuestionName) // Assuming you store research question ID in the document
        .collection("experiments")
        .where("name", "==", experimentName)
        .get();

      if (experimentSnapshot.empty) {
        return res.status(404).send("Experiment not found.");
      }

      const experimentDoc = experimentSnapshot.docs[0];
      await experimentDoc.ref.update({
        description: description,
      });
    } else if (!resultFileName) {
      // Update the sample description
      const sampleSnapshot = await projectDoc.ref
        .collection("research_questions")
        .doc(researchQuestionName) // Assuming you store research question ID in the document
        .collection("experiments")
        .doc(experimentName) // Assuming you store experiment ID in the document
        .collection("samples")
        .where("name", "==", sampleName)
        .get();

      if (sampleSnapshot.empty) {
        return res.status(404).send("Sample not found.");
      }

      const sampleDoc = sampleSnapshot.docs[0];
      await sampleDoc.ref.update({
        description: description,
      });
    } else {
      // Update the result description (for a specific file in the sample's results folder)
      const resultSnapshot = await projectDoc.ref
        .collection("research_questions")
        .doc(researchQuestionName)
        .collection("experiments")
        .doc(experimentName)
        .collection("samples")
        .doc(sampleName)
        .collection("results")
        .where("file_name", "==", resultFileName)
        .get();

      if (resultSnapshot.empty) {
        return res.status(404).send("Result file not found.");
      }

      const resultDoc = resultSnapshot.docs[0];
      await resultDoc.ref.update({
        description: description,
      });
    }

    res.status(200).send("Description updated successfully in Firestore.");
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).send("Error updating description.");
  }
};