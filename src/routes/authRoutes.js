const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
  
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already in use' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, role });
  
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
  });
  
// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ success: true, token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
});

module.exports = router;
