const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Meal = require('../models/mealModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        deliveryAddress,
        paymentMethod,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // In a real app, you would group items by chef and create separate orders.
    // For simplicity, this example assumes all items are from one chef.
    const firstItem = await Meal.findById(orderItems[0].meal);
    const chefId = firstItem.chef;

    const order = new Order({
        user: req.user.id,
        chef: chefId,
        items: orderItems,
        deliveryAddress,
        paymentMethod,
        totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'fullName email').populate('chef', 'fullName email');

    if (order) {
        // Ensure only the user who placed the order or the chef can view it
        if (order.user._id.toString() !== req.user.id.toString() && order.chef._id.toString() !== req.user.id.toString()) {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate('chef', 'fullName');
    res.json(orders);
});

// @desc    Get logged in chef's orders
// @route   GET /api/orders/chef-orders
// @access  Private/Chef
const getChefOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ chef: req.user.id }).populate('user', 'fullName');
    res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Chef
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.chef.toString() !== req.user.id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this order');
        }

        order.status = req.body.status || order.status;
        
        if(req.body.status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getChefOrders,
    updateOrderStatus,
};
