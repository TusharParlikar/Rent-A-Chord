const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  purchases: [
    {
      itemName: { type: String, required: true },
      price: { type: Number, required: true },
      days: { type: Number },
      type: { type: String, required: true },
      date: { type: Date, default: Date.now }
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Initialize purchases array if null or undefined
UserSchema.pre('save', function(next) {
  if (!this.purchases) {
    this.purchases = [];
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);