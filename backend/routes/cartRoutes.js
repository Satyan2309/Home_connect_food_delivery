const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(protect);

// Get cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Update cart item
router.put('/update/:cartItemId', updateCartItem);

// Remove item from cart
router.delete('/remove/:cartItemId', removeFromCart);

// Clear cart
router.delete('/clear', clearCart);

// Apply promo code
router.post('/promo', applyPromoCode);

// Remove promo code
router.delete('/promo', removePromoCode);

module.exports = router;