import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Chat can work with or without auth (anonymous users can also chat)
router.post('/message', (req, res, next) => {
  // Optional auth - try to authenticate but don't fail if no token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, next);
  }
  req.user = null;
  next();
}, sendMessage);

router.get('/history/:session_id', authMiddleware, getChatHistory);

export default router;
