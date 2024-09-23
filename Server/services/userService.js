const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

// Register a new user using Firebase Authentication
exports.registerUser = async ({ username, email, password }) => {
  try {
    const user = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
    });

    console.log("User created successfully:", user);
    return { message: "User registered successfully", user };
  } catch (error) {
    console.error("Error during registration:", {
      message: error.message,
      code: error.code || "No error code",
      stack: error.stack || "No stack trace",
    });

    if (error.code === "auth/email-already-exists") {
      throw new Error("Email is already in use.");
    } else {
      throw new Error("Registration failed: " + error.message);
    }
  }
};

// Verify Firebase token and return the decoded token
exports.verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token successfully decoded:", decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    throw new Error("Login failed: " + error.message);
  }
};

// Generate a custom JWT for server-side use
exports.createCustomJWT = (uid) => {
  // Use a secret key from environment variables 
  const secretKey = process.env.JWT_SECRET;

  // token payload 
  const payload = {
    uid,
    role: "user", 
  };

  // options for the token
  const options = {
    expiresIn: "1h", // Token expiration time
  };

  // Generate and return the token
  return jwt.sign(payload, secretKey, options);
};

// Revoke tokens for a user
exports.revokeTokens = async (uid) => {
  try {
    await admin.auth().revokeRefreshTokens(uid);
    console.log(`Tokens revoked for user: ${uid}`);
  } catch (error) {
    console.error("Error revoking tokens:", error);
    throw new Error("Failed to revoke tokens: " + error.message);
  }
};
