const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { listDocuments, uploadDocument, getDocument, deleteDocument } = require("../controllers/documentController");

const router = express.Router();
router.use(authenticate);
router.get("/", listDocuments);
router.post("/upload", upload.single("file"), uploadDocument);
router.get("/:id", getDocument);
router.delete("/:id", deleteDocument);

module.exports = router;
