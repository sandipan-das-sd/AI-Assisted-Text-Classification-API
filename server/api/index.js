const { createApp } = require("../src/app");
const { connectDatabase } = require("../src/config/database");

const app = createApp();

connectDatabase().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
});

module.exports = app;
