require("dotenv").config();
const { createApp } = require("./src/app");
const { connectDatabase } = require("./src/config/database");

async function startServer() {
  await connectDatabase();
  const port = Number(process.env.PORT) || 3000;
  const server = createApp().listen(port, () => console.log(`Classification API listening on http://localhost:${port}`));
  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exitCode = 1;
  });
}
module.exports = { startServer };
