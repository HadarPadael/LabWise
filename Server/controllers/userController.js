const userService = require("../services/userService");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Log in a user (with Firebase token verification)
exports.loginUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Firebase token from Bearer
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Step 1: Verify Firebase token
    const decodedToken = await userService.verifyFirebaseToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Step 2: Generate a custom JWT (for server-side use)
    const customJWT = await userService.createCustomJWT(decodedToken.uid);

    res.status(200).json({
      message: "Login successful",
      customToken: customJWT, // Send custom JWT to the client
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};
