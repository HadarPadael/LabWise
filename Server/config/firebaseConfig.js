const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require("./serviceAccountKey.json");

const connectDB = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    console.log("Firebase connected successfully.");
  } catch (err) {
    console.error("Error initializing Firebase:", err.message);
  }

  return admin.firestore();
};

module.exports = connectDB;
