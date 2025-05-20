const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const app = express();
const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// First registration at line 21
app.use('/api/purchases', require('./routes/purchases'));

// Get Purchases (Cart Items)
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('User ID:', req.user);
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User purchases:', user.purchases);
    res.json(user.purchases || []);
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add Purchase
router.post('/', authMiddleware, async (req, res) => {
  const { itemName, price } = req.body;

  if (!itemName || !price) {
    return res.status(400).json({ error: 'Item name and price are required' });
  }

  try {
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize purchases array if it doesn't exist
    if (!user.purchases) {
      user.purchases = [];
    }
    
    user.purchases.push({ itemName, price });
    await user.save();
    
    res.json({ message: 'Purchase added successfully', purchase: { itemName, price } });
  } catch (err) {
    console.error('Error adding purchase:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to add a sample item to the cart (for testing)
router.post('/sample', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize purchases array if it doesn't exist
    if (!user.purchases) {
      user.purchases = [];
    }
    
    // Add a sample item
    user.purchases.push({ 
      itemName: "Sample Guitar", 
      price: 1999 
    });
    
    await user.save();
    
    res.json({ 
      message: 'Sample item added successfully', 
      purchase: { itemName: "Sample Guitar", price: 1999 } 
    });
  } catch (err) {
    console.error('Error adding sample purchase:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Second registration at line 59 (overrides the first one)
app.use('/api/purchases', router);

module.exports = router;