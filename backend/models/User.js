// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    status: {
      type: String,
      enum: ['active', 'hold', 'locked'],
      default: 'hold',
    },
    profilePhoto: {
      type: String,
      default: '', // Optional default avatar URL
    },
    walletAddress: {
      type: String,
      default: '', // Optional field, not required
    },
    followers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('User', userSchema);