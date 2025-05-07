require("dotenv").config();
const express = require("express");
const {
  connectToDB,
  getDB,
  closeConnection,
  checkConnection,
} = require("./connect");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Middleware Setup
// ======================
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ======================
// Database Middleware
// ======================
app.use(async (req, res, next) => {
  try {
    req.db = getDB();
    next();
  } catch (err) {
    console.log("⚠️ Attempting database reconnection...");
    try {
      await connectToDB();
      req.db = getDB();
      next();
    } catch (error) {
      res.status(503).json({ error: "Service unavailable" });
    }
  }
});

// ======================
// Routes
// ======================
app.use("/api/auth", authRoutes);

// Health endpoint
app.get("/health", async (req, res) => {
  const dbStatus = await checkConnection();
  res.status(dbStatus ? 200 : 503).json({
    status: dbStatus ? "healthy" : "unhealthy",
    database: dbStatus ? "connected" : "disconnected",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ======================
// Server Initialization
// ======================
async function startServer() {
  try {
    await connectToDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `🔗 MongoDB connected to: ${
          process.env.ATLAS_URI.split("@")[1]?.split("/")[0] || "Atlas cluster"
        }`
      );
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n🛑 Shutting down gracefully...");
      await closeConnection();
      server.close(() => {
        console.log("🔴 Server terminated");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Fatal startup error:", error.message);
    process.exit(1);
  }
}

startServer();
