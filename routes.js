const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Task } = require("./models");

const router = express.Router();

// Signup Route
router.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Login Route
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Middleware for Protected Routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized - No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Auth Error:", err.message);
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

// Task CRUD Routes (Protected)
router.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const task = new Task({ userId: req.user._id, ...req.body });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Task Creation Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res.json(tasks);
  } catch (error) {
    console.error("Task Fetch Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task updated", task });
  } catch (error) {
    console.error("Task Update Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "Task ID is required" });

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Task Deletion Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
