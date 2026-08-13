import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createCheckoutSession,
  getCheckoutStatus,
  getPaymentHistory
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/checkout/session', authMiddleware, createCheckoutSession);
router.get('/checkout/status/:session_id', authMiddleware, getCheckoutStatus);
router.get('/history', authMiddleware, getPaymentHistory);

export default router;