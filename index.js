require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config");
const routes = require("./routes"); 

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("🚀 Server is running! Use /api for API routes.");
});

app.use("/api", routes); 
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
