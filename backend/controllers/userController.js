const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.profileImage = req.body.profileImage || user.profileImage;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        // Update nested chef profile if user is a chef
        if (user.userType === 'chef' && req.body.chefProfile) {
            user.chefProfile = {
                ...user.chefProfile,
                ...req.body.chefProfile
            };
        }
        
        // Update nested preferences
        if (req.body.preferences) {
            user.preferences = {
                ...user.preferences,
                ...req.body.preferences
            };
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            userType: updatedUser.userType,
            token: req.headers.authorization.split(' ')[1], // Send back the same token
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Add a delivery address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        const { type, label, street, apartment, city, state, zipCode, instructions, isPrimary } = req.body;

        const address = { type, label, street, apartment, city, state, zipCode, instructions, isPrimary };

        // If this new address is primary, set others to not primary
        if (isPrimary) {
            user.addresses.forEach(addr => addr.isPrimary = false);
        }
        
        user.addresses.push(address);
        await user.save();
        res.status(201).json(user.addresses);

    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete a delivery address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
        await user.save();
        res.json({ message: 'Address removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    addAddress,
    deleteAddress,
};
