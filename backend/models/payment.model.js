import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  order_id: String,
  user_id: String,
  user_email: String,
  session_id: String,
  amount: Number,
  currency: { type: String, default: 'usd' },
  payment_status: {
    type: String,
    enum: ['pending', 'initiated', 'paid', 'failed', 'cancelled', 'expired'],
    default: 'pending'
  },
  stripe_status: String,
  metadata: Object,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);