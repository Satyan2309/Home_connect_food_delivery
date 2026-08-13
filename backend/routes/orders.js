import express from 'express';
import { requireRole } from '../middlewares/auth.middleware.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/order.controller.js';

const router = express.Router();

// Create order (customers only)
router.post('/', requireRole('customer'), createOrder);

// Get user's orders (role-based)
router.get('/my', getMyOrders);

// Get order by ID
router.get('/:orderId', getOrderById);

// Update order status (chef/admin only)
router.put('/:orderId/status', requireRole('chef', 'admin'), updateOrderStatus);

// Cancel order (customers only)
router.put('/:orderId/cancel', requireRole('customer'), cancelOrder);

export default router;
