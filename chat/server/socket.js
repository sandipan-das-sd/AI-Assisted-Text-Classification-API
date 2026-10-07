import { Server } from 'socket.io';
import Message from './messagemodel.js';

export const configureSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (userId) => {
      if (typeof userId === 'string' && userId.trim()) {
        socket.join(userId);
      }
    });

    socket.on('send_message', async (payload, acknowledge) => {
      try {
        const { sender, receiver, content } = payload ?? {};
        if (!sender || !receiver || typeof content !== 'string' || !content.trim()) {
          throw new Error('Sender, receiver, and message content are required');
        }

        const message = await Message.create({
          sender,
          receiver,
          content: content.trim(),
        });

        io.to(receiver).emit('receive_message', message);
        acknowledge?.({ ok: true, message });
      } catch (error) {
        acknowledge?.({ ok: false, error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};
