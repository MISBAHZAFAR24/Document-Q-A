const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/documentController");

const router = express.Router();
router.use(authenticate);
router.get("/stats", getDashboardStats);

module.exports = router;