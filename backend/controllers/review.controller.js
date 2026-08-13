import Review from '../models/review.model.js';
import Order from '../models/order.model.js';
import { v4 as uuidv4 } from 'uuid';

export const createReview = async (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Only customers can leave reviews' });
  }

  const { menu_item_id, chef_id, order_id, rating, comment } = req.body;

  try {
    // Verify the customer has a delivered order for this chef
    if (order_id) {
      const order = await Order.findOne({ 
        id: order_id, 
        customer_id: req.user.id, 
        status: 'delivered' 
      });
      if (!order) {
        return res.status(400).json({ message: 'You can only review delivered orders' });
      }
    }

    const review = new Review({
      id: uuidv4(),
      customer_id: req.user.id,
      customer_name: req.user.name,
      menu_item_id,
      chef_id,
      order_id,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
};

export const getReviewsByChef = async (req, res) => {
  const { chefId } = req.params;
  try {
    const reviews = await Review.find({ chef_id: chefId }).sort({ created_at: -1 });
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
    res.json({ reviews, average_rating: parseFloat(avgRating), total_reviews: reviews.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

export const getReviewsByItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const reviews = await Review.find({ menu_item_id: itemId }).sort({ created_at: -1 });
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
    res.json({ reviews, average_rating: parseFloat(avgRating), total_reviews: reviews.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};
