import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['customer', 'chef', 'admin'], required: true },
  phone: String,
  address: String,
  avatar: String,
  bio: String,
  specialties: [String],
  location: {
    lat: Number,
    lng: Number,
  },
  favorites: [String],
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
