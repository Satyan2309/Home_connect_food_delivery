import express from 'express';
import {
  createMenuItem,
  getMenuItems,
  getMyMenuItems,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menu.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/items', authMiddleware, createMenuItem);
router.get('/items', getMenuItems);
router.get('/items/my', authMiddleware, getMyMenuItems);
router.put('/items/:itemId', authMiddleware, updateMenuItem);
router.delete('/items/:itemId', authMiddleware, deleteMenuItem);

export default router;