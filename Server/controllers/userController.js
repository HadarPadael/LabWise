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
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const result = await userService.verifyFirebaseToken(token);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};
