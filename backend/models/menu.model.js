import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  chef_id: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  ingredients: [String],
  dietary_info: [String],
  available_quantity: { type: Number, default: 0 },
  preparation_time: Number,
  is_available: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('MenuItem', menuItemSchema);