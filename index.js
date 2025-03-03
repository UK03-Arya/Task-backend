require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config");
const routes = require("./routes"); // Import the corrected routes file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  });

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running! Use /api for API routes.");
});

// Mount routes
app.use("/api", routes); // Ensure routes are mounted under /api

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
