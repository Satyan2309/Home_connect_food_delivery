const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getChefOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect, chef } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems);

router.route('/my-orders').get(protect, getMyOrders);
router.route('/chef-orders').get(protect, chef, getChefOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .put(protect, chef, updateOrderStatus);

module.exports = router;
