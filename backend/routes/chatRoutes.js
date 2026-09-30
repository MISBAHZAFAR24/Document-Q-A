const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { askQuestion, listChats } = require("../controllers/chatController");

const router = express.Router();
router.use(authenticate);
router.get("/:documentId", listChats);
router.post("/:documentId", askQuestion);

module.exports = router;
