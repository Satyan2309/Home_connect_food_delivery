const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/save-payment-method', protect, (req, res) => {
  // This is a placeholder for saving payment methods
  // In a production environment, you would implement this functionality
  res.status(200).json({ success: true, message: 'Payment method saved successfully' });
});

module.exports = router;
