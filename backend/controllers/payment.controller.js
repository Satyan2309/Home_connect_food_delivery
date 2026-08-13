import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { order_id } = req.body;

  try {
    const order = await Order.findOne({ id: order_id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role !== 'admin' && order.customer_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const existing = await Payment.findOne({ order_id, payment_status: { $in: ['paid', 'initiated'] } });
    if (existing) return res.status(400).json({ message: 'Payment already initiated or complete' });

    const origin = req.headers.origin || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Order ${order.id.slice(0, 8)}`,
            description: `HomeCook Order - ${order.items.length} item(s)`,
          },
          unit_amount: Math.round(order.total_amount * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${origin}/orders?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?payment=cancelled`,
      metadata: {
        order_id: order.id,
        customer_id: order.customer_id,
        chef_id: order.chef_id
      }
    });

    const payment = new Payment({
      id: uuidv4(),
      order_id: order.id,
      user_id: req.user.id,
      user_email: req.user.email,
      session_id: session.id,
      amount: order.total_amount,
      currency: 'inr',
      payment_status: 'initiated',
      metadata: session.metadata
    });
    await payment.save();

    res.json({ url: session.url, session_id: session.id, order_id: order.id });
  } catch (err) {
    res.status(500).json({ message: 'Stripe session failed', error: err.message });
  }
};

export const getCheckoutStatus = async (req, res) => {
  const { session_id } = req.params;

  try {
    const payment = await Payment.findOne({ session_id });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    if (req.user.role !== 'admin' && payment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const update = {
      stripe_status: session.status,
      updated_at: new Date()
    };

    if (session.payment_status === 'paid') {
      update.payment_status = 'paid';
      await Order.updateOne({ id: payment.order_id }, { status: 'confirmed', updated_at: new Date() });
    } else if (session.status === 'expired') {
      update.payment_status = 'expired';
    } else if (session.status === 'cancelled') {
      update.payment_status = 'cancelled';
    }

    await Payment.updateOne({ session_id }, { $set: update });

    res.json({
      session_id,
      payment_status: update.payment_status || payment.payment_status,
      stripe_status: session.status,
      amount: session.amount_total / 100,
      currency: session.currency,
      order_id: payment.order_id
    });
  } catch (err) {
    res.status(500).json({ message: 'Status check failed', error: err.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user_id: req.user.id };
    const history = await Payment.find(query).sort({ created_at: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

export const refundPayment = async (req, res) => {
  const { order_id } = req.body;

  try {
    const payment = await Payment.findOne({ order_id, payment_status: 'paid' });
    if (!payment) return res.status(404).json({ message: 'No paid payment found for this order' });

    if (req.user.role !== 'admin' && payment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Process Stripe refund
    const session = await stripe.checkout.sessions.retrieve(payment.session_id);
    const paymentIntent = session.payment_intent;

    if (paymentIntent) {
      await stripe.refunds.create({ payment_intent: paymentIntent });
    }

    payment.payment_status = 'refunded';
    payment.updated_at = new Date();
    await payment.save();

    res.json({ message: 'Refund processed successfully', payment });
  } catch (err) {
    res.status(500).json({ message: 'Refund failed', error: err.message });
  }
};
