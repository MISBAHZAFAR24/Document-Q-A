const Document = require("../models/Document");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");
const { answerQuestion } = require("../services/aiService");

async function askQuestion(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.documentId)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    const { question } = req.body;
    if (!question?.trim()) return res.status(400).json({ message: "Question is required" });

    const document = await Document.findOne({ _id: req.params.documentId, owner: req.user.userId });
    if (!document) return res.status(404).json({ message: "Document not found" });

    const result = await answerQuestion({ question: question.trim(), document });
    const chat = await Chat.create({ document: document.id, user: req.user.userId, question: question.trim(), ...result });
    return res.status(201).json(chat);
  } catch (error) {
    return next(error);
  }
}

async function listChats(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.documentId)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    const chats = await Chat.find({ document: req.params.documentId, user: req.user.userId }).sort({ createdAt: 1 });
    return res.json(chats);
  } catch (error) {
    return next(error);
  }
}

module.exports = { askQuestion, listChats };
