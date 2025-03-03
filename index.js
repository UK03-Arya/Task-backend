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
connectDB();

// Mount routes
app.use("/api", routes); // Ensure routes are mounted under /api

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
