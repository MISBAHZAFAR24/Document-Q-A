const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    citation: { text: String, page: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
