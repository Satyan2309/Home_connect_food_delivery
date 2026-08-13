import express from 'express';
import authRoutes from './auth.routes.js';
import menuRoutes from './menu.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import reviewRoutes from './review.routes.js';
import chatRoutes from './chat.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reviews', reviewRoutes);
router.use('/chat', chatRoutes);

export default router;
