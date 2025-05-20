const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat')); // Add the chat route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Purchases route logic
const router = express.Router();
const authMiddleware = require('./middleware/authMiddleware.js');
const User = require('./models/User');

// GET purchases - add more logging
router.get('/', authMiddleware, async (req, res) => {
  console.log("GET /api/purchases - Request received");
  console.log("Token user ID:", req.user);
  
  try {
    console.log('Finding user in database...');
    const user = await User.findById(req.user);
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found:', user._id.toString());
    console.log('User purchases:', user.purchases || 'No purchases array');
    
    // Send back an empty array if purchases is undefined
    res.json(user.purchases || []);
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add purchase
router.post('/', authMiddleware, async (req, res) => {
  console.log("Processing purchase for User ID:", req.user);
  console.log("Purchase details:", req.body);

  const { itemName, price, days, type } = req.body;

  // Validate required fields
  if (!itemName || price === undefined) {
    console.log("Missing required fields:", {
      itemName: !!itemName,
      price: !!price,
    });
    return res.status(400).json({ error: 'Item name and price are required' });
  }

  try {
    const user = await User.findById(req.user);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    if (!Array.isArray(user.purchases)) {
      console.log("Initializing purchases array");
      user.purchases = [];
    }

    // Create the purchase object
    const purchaseItem = {
      itemName,
      price,
      days,
      type,
      date: new Date(),
    };

    console.log("Before pushing to purchases:", user.purchases);

    // Push the purchase object into the purchases array
    user.purchases.push(purchaseItem);

    console.log("After pushing to purchases (before save):", user.purchases);

    // Save the user document
    await user.save();

    console.log("After save, purchases:", user.purchases);

    res.json({ message: 'Purchase added successfully', purchase: purchaseItem });
  } catch (err) {
    console.error('Error adding purchase:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Sample item route
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
    
    try {
      await user.save();
    } catch (err) {
      if (err.name === 'ValidationError') {
        console.error('Validation error:', err);
        return res.status(400).json({ error: 'Validation error', details: err.message });
      }
      throw err; // Re-throw other errors
    }
    
    res.json({ 
      message: 'Sample item added successfully', 
      purchase: { itemName: "Sample Guitar", price: 1999 } 
    });
  } catch (err) {
    console.error('Error adding sample purchase:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear purchases
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    console.log('Clearing purchases for user ID:', req.user);
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Before clearing, purchases:', user.purchases);
    // Clear all purchases
    user.purchases = [];
    
    console.log('After clearing, purchases (before save):', user.purchases);
    try {
      await user.save();
    } catch (err) {
      if (err.name === 'ValidationError') {
        console.error('Validation error:', err);
        return res.status(400).json({ error: 'Validation error', details: err.message });
      }
      throw err; // Re-throw other errors
    }
    
    // Verify after save
    const updatedUser = await User.findById(req.user);
    console.log('After save, purchases:', updatedUser.purchases);
    
    res.json({ message: 'All purchases cleared successfully' });
  } catch (err) {
    console.error('Error clearing purchases:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove sample items
router.delete('/remove-sample', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Filter out any "Sample Guitar" items
    if (user.purchases && user.purchases.length > 0) {
      user.purchases = user.purchases.filter(item => item.itemName !== "Sample Guitar");
      try {
        await user.save();
      } catch (err) {
        if (err.name === 'ValidationError') {
          console.error('Validation error:', err);
          return res.status(400).json({ error: 'Validation error', details: err.message });
        }
        throw err; // Re-throw other errors
      }
    }
    
    res.json({ message: 'Sample items removed successfully' });
  } catch (err) {
    console.error('Error removing sample items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a specific purchase
router.delete('/:itemId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemId = req.params.itemId;

    // Filter out the item to be removed
    user.purchases = user.purchases.filter((item, index) => index.toString() !== itemId);

    // Save the updated user document
    await user.save();

    res.json({ message: 'Item removed successfully', purchases: user.purchases });
  } catch (err) {
    console.error('Error removing item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Debug route
router.get('/debug', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json({
      userId: req.user,
      userExists: !!user,
      purchasesArray: user ? !!user.purchases : false,
      purchasesCount: user && user.purchases ? user.purchases.length : 0
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ error: 'Debug error' });
  }
});

// Add this special route for testing
router.post('/force-add', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize purchases array if needed
    if (!user.purchases) {
      user.purchases = [];
    }
    
    // Add a test item
    user.purchases.push({
      itemName: "Test Guitar",
      price: 799,
      days: 5,
      type: "rent",
      date: new Date()
    });
    
    try {
      await user.save();
    } catch (err) {
      if (err.name === 'ValidationError') {
        console.error('Validation error:', err);
        return res.status(400).json({ error: 'Validation error', details: err.message });
      }
      throw err; // Re-throw other errors
    }
    
    res.json({ 
      message: 'Test item added successfully',
      purchases: user.purchases 
    });
  } catch (err) {
    console.error('Error adding test item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.use('/api/purchases', router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});