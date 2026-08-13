import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customer_id: { type: String, required: true },
  customer_name: { type: String, required: true },
  menu_item_id: String,
  chef_id: { type: String, required: true },
  order_id: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('Review', reviewSchema);
