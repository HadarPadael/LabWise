const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ message: "No authorization header provided" });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next(); // Pass control to the next handler
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ message: "Unauthorized access" });
  }
};

module.exports = verifyToken;
