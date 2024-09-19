const admin = require("firebase-admin");

// Verify Firebase ID Token middleware
exports.verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decodedToken = await admin
      .auth()
      .verifyIdToken(token.replace("Bearer ", ""));
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};
