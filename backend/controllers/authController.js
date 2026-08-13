const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
// OAuth packages would be required in production
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, userType } = req.body;

    if (!fullName || !email || !password || !userType) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        userType,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
    const { code, profile } = req.body;
    
    // Log the request for debugging
    console.log('Google auth request received:', { 
        hasCode: !!code, 
        hasProfile: !!profile,
        profileData: profile ? { 
            id: profile.id,
            hasEmail: !!profile.email,
            hasName: !!profile.name 
        } : null
    });
    
    // Validate required data
    if (!profile || !profile.email) {
        console.error('Missing required profile data for Google auth');
        res.status(400);
        throw new Error('Invalid Google authentication data. Missing profile information.');
    }
    
    try {
        // In production, you would verify the code with Google OAuth API
        // For example, exchange the code for tokens using Google's OAuth API
        // const tokenResponse = await exchangeCodeForTokens(code);
        // const verifiedProfile = await verifyGoogleTokenAndGetProfile(tokenResponse.id_token);
        
        // For now, we'll trust the client-provided profile data
        
        // Check if user exists
        let user = await User.findOne({ email: profile.email });
        
        if (!user) {
            console.log(`Creating new user with Google auth: ${profile.email}`);
            // Create new user if doesn't exist
            user = await User.create({
                fullName: profile.name,
                email: profile.email,
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
                userType: 'customer',
                profileImage: profile.picture || '/assets/images/no_image.png',
                googleId: profile.id
            });
        } else {
            console.log(`Existing user logging in with Google: ${profile.email}`);
            // Update existing user with Google ID if not already set
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
        }
        
        // Generate JWT token
        const token = generateToken(user._id);
        
        // Send successful response
        res.json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
            token: token,
        });
    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(400);
        throw new Error(`Google authentication failed: ${error.message}`);
    }
});

// @desc    Facebook OAuth login/register
// @route   POST /api/auth/facebook
// @access  Public
const facebookAuth = asyncHandler(async (req, res) => {
    const { token, profile } = req.body;
    
    // In production, verify the token with Facebook OAuth API
    // For now, we'll trust the client-provided profile data
    
    try {
        // Check if user exists
        let user = await User.findOne({ email: profile.email });
        
        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                fullName: profile.name,
                email: profile.email,
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
                userType: 'customer',
                profileImage: profile.picture || '/assets/images/no_image.png',
                facebookId: profile.id
            });
        } else {
            // Update existing user with Facebook ID if not already set
            if (!user.facebookId) {
                user.facebookId = profile.id;
                await user.save();
            }
        }
        
        res.json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(400);
        throw new Error('Facebook authentication failed');
    }
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    googleAuth,
    facebookAuth
};
