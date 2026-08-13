import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Stripe from 'stripe';

import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import Order from './models/order.model.js';
import Payment from './models/payment.model.js';

const app = express();
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Set security HTTP headers
app.use(helmet());

// Strict CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting - Auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Rate limiting - Payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many payment requests, please try again later.',
});

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

// Stripe webhook - must be before express.json()
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.warn('⚠️ STRIPE_WEBHOOK_SECRET not configured');
    return res.status(400).send('Webhook endpoint secret is not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle webhook events
  try {
    const io = req.app.get('io');

    switch (event.type) {
      case 'checkout.session.completed':
        {
          const session = event.data.object;
          console.log('✅ Checkout session completed:', session.id);

          // Update payment status idempotently
          const paymentRecord = await Payment.findOneAndUpdate(
            { session_id: session.id },
            {
              payment_status: 'paid',
              stripe_status: session.payment_status,
              updated_at: new Date()
            },
            { new: true }
          );

          if (paymentRecord) {
            // Update order status
            const order = await Order.findByIdAndUpdate(
              paymentRecord.order_id,
              { status: 'confirmed', updated_at: new Date() },
              { new: true }
            );

            if (order && io) {
              io.to(`order:track:${order._id}`).emit('order_status_update', {
                orderId: order._id,
                status: 'confirmed',
                message: 'Payment received! Order confirmed.'
              });
            }
          }
        }
        break;

      case 'charge.refunded':
        {
          const charge = event.data.object;
          console.log('💰 Refund processed:', charge.id);

          const payment = await Payment.findOneAndUpdate(
            { stripe_status: charge.id },
            {
              payment_status: 'refunded',
              updated_at: new Date()
            },
            { new: true }
          );

          if (payment) {
            const order = await Order.findByIdAndUpdate(
              payment.order_id,
              { status: 'cancelled', updated_at: new Date() },
              { new: true }
            );

            if (order && io) {
              io.to(`order:track:${order._id}`).emit('order_status_update', {
                orderId: order._id,
                status: 'cancelled',
                message: 'Order cancelled and refund processed.'
              });
            }
          }
        }
        break;

      case 'charge.failed':
        {
          const charge = event.data.object;
          console.log('❌ Charge failed:', charge.id);

          await Payment.findOneAndUpdate(
            { stripe_status: charge.id },
            {
              payment_status: 'failed',
              updated_at: new Date()
            }
          );
        }
        break;

      default:
        console.log(`ℹ️ Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Regular JSON and URL-encoded body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// LOGGING & MONITORING
// ============================================
app.use(morgan('combined'));

// ============================================
// RATE LIMITING APPLICATION
// ============================================
app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/payments/', paymentLimiter);

// ============================================
// ROUTES
// ============================================
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use(errorHandler);

export default app;
