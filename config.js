const mongoose = require("mongoose");
require("dotenv").config();  // Ensure dotenv is loaded

console.log("MONGO_URI:", process.env.MONGO_URI);  // Debug line

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is undefined. Check .env file.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
