const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    addAddress,
    deleteAddress
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/addresses')
    .post(protect, addAddress);

router.route('/addresses/:id')
    .delete(protect, deleteAddress);

module.exports = router;
