const fs = require("fs/promises");
const Document = require("../models/Document");

async function removeDocumentFile(document) {
  try {
    await fs.unlink(document.path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function createDocument(file, userId) {
  return Document.create({
    name: file.originalname,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    owner: userId,
  });
}

module.exports = { createDocument, removeDocumentFile };
