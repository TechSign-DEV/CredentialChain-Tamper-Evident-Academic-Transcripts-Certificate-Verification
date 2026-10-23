
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const auditRoutes = require("./routes/auditRoutes");
const revocationRoutes = require("./routes/revocationRoutes");
const institutionRoutes = require("./routes/institutionRoutes");
const app = express();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Set a secure JWT_SECRET in the .env file");
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in .env");
}

app.disable("x-powered-by");
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "20kb" }));

// Authentication routes — rate limiting removed
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/certificates", revocationRoutes);
app.use("/api/institutions", institutionRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CredentialChain API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

async function startServer() {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`CredentialChain server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
