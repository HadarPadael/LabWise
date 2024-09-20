const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

// Register a new user using Firebase Authentication
exports.registerUser = async ({ username, email, password }) => {
  try {
    // Create user in Firebase directly
    const user = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
    });

    console.log("User created successfully:", user);

    return { message: "User registered successfully", user };
  } catch (error) {
    // Handle Firebase errors (e.g., auth/email-already-exists)
    console.error("Error during registration:", {
      message: error.message,
      code: error.code || "No error code",
      stack: error.stack || "No stack trace",
    });
    
    // Customize the error message based on Firebase error code
    if (error.code === 'auth/email-already-exists') {
      throw new Error("Email is already in use.");
    } else {
      throw new Error("Registration failed: " + error.message);
    }
  }
};

// Verify Firebase token and generate a JWT
exports.verifyFirebaseToken = async (token) => {
  console.log("Starting token verification...");
  console.log(`Token received for verification: ${token}`);

  try {
    // Verify Firebase ID token using the Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token successfully decoded:", decodedToken);

    // At this point, you have the user's Firebase UID
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    console.log("User record retrieved successfully:", userRecord);

    // Return a success message without creating a custom JWT
    return { message: "Login successful", decodedToken };
  } catch (error) {
    console.error("Error verifying Firebase token:", {
      message: error.message,
      stack: error.stack || "No stack trace",
    });
    throw new Error("Login failed: " + error.message);
  }
};