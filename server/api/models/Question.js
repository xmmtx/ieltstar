import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  title: { type: String, required: "Question Title is required" },
  description: { type: String, default: "" },
  options: { type: Array, default: [] },
  questionType: { type: String, default: "multiple-choice" }, // multiple-choice | true-false-ng | fill-blank | matching
  answer: { type: String, default: "" },
  marks: { type: Number, required: "Marks is required" },
});

export default Schema;
