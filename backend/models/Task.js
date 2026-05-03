import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: String,
  time: Date,
});

export default mongoose.model("Task", taskSchema);