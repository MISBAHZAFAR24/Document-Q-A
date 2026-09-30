const Document = require("../models/Document");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");
const { createDocument, removeDocumentFile } = require("../services/documentService");
const { indexDocument } = require("../services/aiService");

async function getDashboardStats(req, res, next) {
  try {
    const [totalDocuments, totalQuestions] = await Promise.all([
      Document.countDocuments({ owner: req.user.userId }),
      Chat.countDocuments({ user: req.user.userId }),
    ]);

    return res.json({
      totalDocuments,
      totalQuestions,
      aiAnswers: totalQuestions,
    });
  } catch (error) {
    return next(error);
  }
}

async function listDocuments(req, res, next) {
  try {
    const documents = await Document.find({ owner: req.user.userId }).sort({ createdAt: -1 });
    return res.json(documents);
  } catch (error) {
    return next(error);
  }
}

async function uploadDocument(req, res, next) {
  let document;
  try {
    if (!req.file) return res.status(400).json({ message: "A PDF file is required" });
    document = await createDocument(req.file, req.user.userId);
    await indexDocument(document);
    return res.status(201).json(document);
  } catch (error) {
    if (document) {
      await Document.deleteOne({ _id: document._id }).catch(() => {});
      await removeDocumentFile(document).catch(() => {});
    }
    error.statusCode = error.statusCode || 503;
    error.message = `Document upload or AI indexing failed: ${error.message}`;
    return next(error);
  }
}

async function getDocument(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    const document = await Document.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!document) return res.status(404).json({ message: "Document not found" });
    return res.json(document);
  } catch (error) {
    return next(error);
  }
}

async function deleteDocument(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    const document = await Document.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!document) return res.status(404).json({ message: "Document not found" });
    await removeDocumentFile(document);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { getDashboardStats, listDocuments, uploadDocument, getDocument, deleteDocument };
