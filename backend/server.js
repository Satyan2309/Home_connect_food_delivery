import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
const requiredEnvVars = ['MONGO_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Create HTTP server with Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Attach io to app for use in controllers
app.set('io', io);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`📱 User connected: ${socket.id}`);

  // Join order tracking room
  socket.on('join_order', (orderId) => {
    socket.join(`order:track:${orderId}`);
    console.log(`✅ Socket joined order room: order:track:${orderId}`);
  });

  // Join kitchen room
  socket.on('join_kitchen', (kitchenId) => {
    socket.join(`kitchen:${kitchenId}`);
    console.log(`✅ Socket joined kitchen room: kitchen:${kitchenId}`);
  });

  // Join delivery tracking
  socket.on('join_delivery', (deliveryId) => {
    socket.join(`delivery:${deliveryId}`);
    console.log(`✅ Socket joined delivery room: delivery:${deliveryId}`);
  });

  socket.on('disconnect', () => {
    console.log(`📴 User disconnected: ${socket.id}`);
  });
});

// Database connection
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} [${NODE_ENV}]`);
      console.log(`📡 Socket.io listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close().then(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
