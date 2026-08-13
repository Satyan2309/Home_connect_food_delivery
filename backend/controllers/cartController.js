const Cart = require('../models/cartModel');
const Meal = require('../models/mealModel');
const asyncHandler = require('express-async-handler');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId }).populate({
        path: 'items.meal',
        select: 'name image chef',
        populate: {
            path: 'chef',
            select: 'fullName'
        }
    });

    if (!cart) {
        // If no cart exists, create an empty one
        cart = await Cart.create({
            user: userId,
            items: []
        });
    }

    // Format the response to match the frontend expectations
    const formattedCart = {
        items: cart.items.map(item => ({
            id: item._id,
            mealId: item.meal._id,
            name: item.meal.name,
            chefName: item.meal.chef.fullName,
            price: item.price,
            quantity: item.quantity,
            image: item.meal.image,
            specialInstructions: item.specialInstructions || ''
        })),
        totalPrice: cart.totalPrice,
        promoCode: cart.promoCode
    };

    res.status(200).json(formattedCart);
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { mealId, quantity } = req.body;
    const userId = req.user._id;

    console.log('Add to cart request:', { mealId, quantity, userId });

    if (!mealId || !quantity || quantity < 1) {
        res.status(400);
        throw new Error('Please provide a valid meal ID and quantity');
    }

    // Find the meal to get its details
    console.log('Finding meal with ID:', mealId);
    let meal;
    try {
        meal = await Meal.findById(mealId).populate('chef', 'fullName');
        if (!meal) {
            console.log('Meal not found with ID:', mealId);
            res.status(404);
            throw new Error('Meal not found');
        }
        console.log('Meal found:', meal.name);
    } catch (error) {
        console.error('Error finding meal:', error.message);
        res.status(400);
        throw new Error(`Invalid meal ID format: ${error.message}`);
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: []
        });
    }

    // Check if the meal is already in the cart
    const existingItemIndex = cart.items.findIndex(
        item => item.meal.toString() === mealId
    );

    if (existingItemIndex > -1) {
        // Update quantity if item already exists
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.items.push({
            meal: mealId,
            quantity,
            price: meal.price
        });
    }

    // Save the updated cart
    await cart.save();

    // Return the updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.meal',
        select: 'name image chef',
        populate: {
            path: 'chef',
            select: 'fullName'
        }
    });

    // Format the response
    const formattedCart = {
        items: updatedCart.items.map(item => ({
            id: item._id,
            mealId: item.meal._id,
            name: item.meal.name,
            chefName: item.meal.chef.fullName,
            price: item.price,
            quantity: item.quantity,
            image: item.meal.image,
            specialInstructions: item.specialInstructions || ''
        })),
        totalPrice: updatedCart.totalPrice,
        promoCode: updatedCart.promoCode
    };

    res.status(200).json({
        message: 'Item added to cart successfully',
        cart: formattedCart
    });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:cartItemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity, specialInstructions } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
        res.status(400);
        throw new Error('Please provide a valid quantity');
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    // Find the item in the cart
    const cartItem = cart.items.id(cartItemId);
    if (!cartItem) {
        res.status(404);
        throw new Error('Cart item not found');
    }

    // Update the item
    cartItem.quantity = quantity;
    if (specialInstructions !== undefined) {
        cartItem.specialInstructions = specialInstructions;
    }

    // Save the updated cart
    await cart.save();

    // Return the updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.meal',
        select: 'name image chef',
        populate: {
            path: 'chef',
            select: 'fullName'
        }
    });

    // Format the response
    const formattedCart = {
        items: updatedCart.items.map(item => ({
            id: item._id,
            mealId: item.meal._id,
            name: item.meal.name,
            chefName: item.meal.chef.fullName,
            price: item.price,
            quantity: item.quantity,
            image: item.meal.image,
            specialInstructions: item.specialInstructions || ''
        })),
        totalPrice: updatedCart.totalPrice,
        promoCode: updatedCart.promoCode
    };

    res.status(200).json({
        message: 'Cart item updated successfully',
        cart: formattedCart
    });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:cartItemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
    const { cartItemId } = req.params;
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    // Find the item in the cart
    const cartItem = cart.items.id(cartItemId);
    if (!cartItem) {
        res.status(404);
        throw new Error('Cart item not found');
    }

    // Remove the item
    cartItem.remove();

    // Save the updated cart
    await cart.save();

    // Return the updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.meal',
        select: 'name image chef',
        populate: {
            path: 'chef',
            select: 'fullName'
        }
    });

    // Format the response
    const formattedCart = {
        items: updatedCart.items.map(item => ({
            id: item._id,
            mealId: item.meal._id,
            name: item.meal.name,
            chefName: item.meal.chef.fullName,
            price: item.price,
            quantity: item.quantity,
            image: item.meal.image,
            specialInstructions: item.specialInstructions || ''
        })),
        totalPrice: updatedCart.totalPrice,
        promoCode: updatedCart.promoCode
    };

    res.status(200).json({
        message: 'Cart item removed successfully',
        cart: formattedCart
    });
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    // Clear all items
    cart.items = [];
    cart.promoCode = null;

    // Save the updated cart
    await cart.save();

    res.status(200).json({
        message: 'Cart cleared successfully',
        cart: {
            items: [],
            totalPrice: 0,
            promoCode: null
        }
    });
});

// @desc    Apply promo code
// @route   POST /api/cart/promo
// @access  Private
const applyPromoCode = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
        res.status(400);
        throw new Error('Please provide a promo code');
    }

    // TODO: Validate promo code against a database of valid codes
    // For now, we'll use a mock validation
    const validPromoCodes = {
        'WELCOME10': { discount: 10, expiryDate: new Date('2023-12-31') },
        'SUMMER20': { discount: 20, expiryDate: new Date('2023-09-30') }
    };

    if (!validPromoCodes[code]) {
        res.status(400);
        throw new Error('Invalid promo code');
    }

    const promoDetails = validPromoCodes[code];
    if (new Date() > promoDetails.expiryDate) {
        res.status(400);
        throw new Error('Promo code has expired');
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    // Apply the promo code
    cart.promoCode = {
        code,
        discount: promoDetails.discount,
        expiryDate: promoDetails.expiryDate
    };

    // Save the updated cart
    await cart.save();

    // Return the updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.meal',
        select: 'name image chef',
        populate: {
            path: 'chef',
            select: 'fullName'
        }
    });

    // Calculate discount amount
    const subtotal = updatedCart.totalPrice;
    const discountAmount = (subtotal * promoDetails.discount) / 100;

    // Format the response
    const formattedCart = {
        items: updatedCart.items.map(item => ({
            id: item._id,
            mealId: item.meal._id,
            name: item.meal.name,
            chefName: item.meal.chef.fullName,
            price: item.price,
            quantity: item.quantity,
            image: item.meal.image,
            specialInstructions: item.specialInstructions || ''
        })),
        totalPrice: subtotal,
        promoCode: {
            code: updatedCart.promoCode.code,
            discount: updatedCart.promoCode.discount,
            discountAmount: discountAmount,
            finalPrice: subtotal - discountAmount
        }
    };

    res.status(200).json({
        message: 'Promo code applied successfully',
        cart: formattedCart
    });
});

// @desc    Remove promo code
// @route   DELETE /api/cart/promo
// @access  Private
const removePromoCode = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    // Remove the promo code
    cart.promoCode = null;

    // Save the updated cart
    await cart.save();

    // Return the updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.meal',
        select: 'name image chef',
        populate: {
            path: 'chef',
            select: 'fullName'
        }
    });

    // Format the response
    const formattedCart = {
        items: updatedCart.items.map(item => ({
            id: item._id,
            mealId: item.meal._id,
            name: item.meal.name,
            chefName: item.meal.chef.fullName,
            price: item.price,
            quantity: item.quantity,
            image: item.meal.image,
            specialInstructions: item.specialInstructions || ''
        })),
        totalPrice: updatedCart.totalPrice,
        promoCode: null
    };

    res.status(200).json({
        message: 'Promo code removed successfully',
        cart: formattedCart
    });
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode
};