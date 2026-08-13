import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  session_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('ChatMessage', chatMessageSchema);
