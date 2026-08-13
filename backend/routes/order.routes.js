
import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/:orderId', authMiddleware, getOrderById);
router.put('/:orderId/status', authMiddleware, updateOrderStatus);
router.put('/:orderId/cancel', authMiddleware, cancelOrder);

export default router;