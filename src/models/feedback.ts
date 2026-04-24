import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String },
  title: { type: String, required: true }, 
  text: { type: String, required: true },
  imageUrl: { type: String },
  type: { type: String, enum: ["issue", "feedback"] }, 
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

// Explicit collection names: 'issues' and 'feedbacks'
export const Issue = mongoose.models.Issue || mongoose.model("Issue", FeedbackSchema, "issues");
export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema, "feedbacks");