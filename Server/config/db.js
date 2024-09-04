const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process if there's a connection error
  }
};

module.exports = connectDB;
