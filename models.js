const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const TaskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
});

const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);

module.exports = { User, Task };
