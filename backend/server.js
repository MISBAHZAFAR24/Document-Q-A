require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((error, _req, res, _next) => {
  const status = error.statusCode || 500;
  res.status(status).json({ message: error.message || "Internal server error" });
});

async function startServer() {
  await connectDatabase();
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });
}

module.exports = app;
