// Database connection is handled in server.js
// This file is kept for potential future use (e.g., seeding, migrations)
import mongoose from 'mongoose';

export const isConnected = () => mongoose.connection.readyState === 1;