const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:7070',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes')); // Payment routes for Stripe integration
app.use('/api/cart', require('./routes/cartRoutes')); // Cart routes for shopping cart functionality

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API server is running and healthy',
        timestamp: new Date().toISOString()
    });
});

// After API routes, handle any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 7071;

app.listen(PORT, () => console.log(`Server running on port ${PORT}, serving both API and frontend`));
