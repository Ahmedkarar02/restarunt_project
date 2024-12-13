const express = require('express');
const { connectDB } = require('./config/db');
require('dotenv').config();
const errorHandler = require('./config/errorHandler');
const authRoutes = require('./routes/authRoutes');
const { authenticate, authorize } = require('./middlewares/authMiddleware');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
// Import the order expiry scheduler
require('./scheduler/orderExpiryScheduler');


const app = express();
// Middleware for error handling
app.use(errorHandler);

// Middleware
app.use(express.json());

// Connect to the database
connectDB();

// Authentication routes
app.use('/api/auth', authRoutes);

// Example protected route
app.get('/api/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({ success: true, message: 'Welcome, Admin!' });
});


// Menu routes
app.use('/api/menus', menuRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Analytics routes
app.use('/api/analytics', analyticsRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
