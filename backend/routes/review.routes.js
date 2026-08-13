import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createReview, getReviewsByChef, getReviewsByItem } from '../controllers/review.controller.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/chef/:chefId', getReviewsByChef);
router.get('/item/:itemId', getReviewsByItem);

export default router;
