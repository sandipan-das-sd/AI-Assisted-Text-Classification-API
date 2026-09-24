const express = require("express");
const cors = require("cors");
const classificationRoutes = require("./routes/classificationRoutes");

function createApp(options = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.locals.classificationService = options.classificationService;
  app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
  app.use(express.json({ limit: "50kb" }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api", classificationRoutes);
  app.use((_req, res) => res.status(404).json({ error: "Route not found" }));
  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(error.status || 500).json({ error: error.status ? error.message : "Unable to classify text" });
  });
  return app;
}
module.exports = { createApp };
