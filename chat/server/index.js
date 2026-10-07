import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { connectDb } from './db.js';
import userRoutes from './route.js';
import { configureSocket } from './socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

configureSocket(httpServer);

const startServer = async () => {
  try {
    await connectDb();
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
