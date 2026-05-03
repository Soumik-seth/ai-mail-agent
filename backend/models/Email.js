import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  to: String,
  subject: String,
  body: String,

  status: {
    type: String,
    enum: ["draft", "scheduled", "sent"],
    default: "draft",
  },

  sendAt: Date,
}, { timestamps: true });

export default mongoose.model("Email", emailSchema);