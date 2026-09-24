require("dotenv").config();
const { createApp } = require("./src/app");
const { connectDatabase } = require("./src/config/database");

const app = createApp();

// Start the database connection without blocking Vercel's serverless handler.
// The API remains usable when MongoDB is unavailable; results simply are not saved.
connectDatabase().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
});

function startServer() {
  const port = Number(process.env.PORT) || 3000;
  const server = app.listen(port, () => console.log(`Classification API listening on http://localhost:${port}`));
  return server;
}

if (require.main === module) {
  startServer();
}

// Vercel detects this CommonJS export and runs the Express app as one Function.
module.exports = app;
module.exports.startServer = startServer;
