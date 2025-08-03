const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  // Required fields
  nft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
    required: [true, 'NFT is required']
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bidder is required']
  },
  price: {
    type: Number,
    required: [true, 'Bid price is required'],
    min: [0, 'Bid price cannot be negative']
  },
  currency: {
    type: String,
    default: 'ETH',
    enum: {
      values: ['ETH', 'USD', 'BTC', 'SOL'],
      message: 'Please select a valid currency'
    }
  },

  // Status fields
  status: {
    type: String,
    enum: {
      values: ['active', 'accepted', 'rejected', 'expired', 'cancelled'],
      message: 'Please select a valid bid status'
    },
    default: 'active'
  },

  // Additional fields
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for bid age
bidSchema.virtual('bidAge').get(function() {
  const now = new Date();
  const ageInMs = now - this.createdAt;
  const ageInHours = Math.floor(ageInMs / (1000 * 60 * 60));
  const ageInDays = Math.floor(ageInHours / 24);
  
  if (ageInDays > 0) return `${ageInDays} day${ageInDays > 1 ? 's' : ''}`;
  if (ageInHours > 0) return `${ageInHours} hour${ageInHours > 1 ? 's' : ''}`;
  return 'Just now';
});

// Virtual field for formatted price
bidSchema.virtual('formattedPrice').get(function() {
  return `${this.price} ${this.currency}`;
});

// Indexes for better query performance
bidSchema.index({ nft: 1 });
bidSchema.index({ bidder: 1 });
bidSchema.index({ status: 1 });
bidSchema.index({ createdAt: -1 });
bidSchema.index({ price: -1 });

// Instance methods
bidSchema.methods.accept = function() {
  this.status = 'accepted';
  return this.save();
};

bidSchema.methods.reject = function() {
  this.status = 'rejected';
  return this.save();
};

bidSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

bidSchema.methods.expire = function() {
  this.status = 'expired';
  return this.save();
};

// Static methods
bidSchema.statics.findByNFT = function(nftId) {
  return this.find({ nft: nftId })
    .populate('bidder', 'name email')
    .populate('nft', 'name imageUrl')
    .sort({ price: -1, createdAt: -1 });
};

bidSchema.statics.findActiveByNFT = function(nftId) {
  return this.find({ 
    nft: nftId, 
    status: 'active' 
  })
    .populate('bidder', 'name email')
    .sort({ price: -1, createdAt: -1 });
};

bidSchema.statics.findByBidder = function(bidderId) {
  return this.find({ bidder: bidderId })
    .populate('nft', 'name imageUrl creator')
    .populate('bidder', 'name email')
    .sort({ createdAt: -1 });
};

bidSchema.statics.findHighestBid = function(nftId) {
  return this.findOne({ 
    nft: nftId, 
    status: 'active' 
  })
    .populate('bidder', 'name email')
    .sort({ price: -1 });
};

bidSchema.statics.findAcceptedByNFT = function(nftId) {
  return this.find({ 
    nft: nftId, 
    status: 'accepted' 
  })
    .populate('bidder', 'name email')
    .sort({ createdAt: -1 });
};

// Pre-save middleware to update timestamps
bidSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to validate bid
bidSchema.pre('save', function(next) {
  if (this.price <= 0) {
    return next(new Error('Bid price must be greater than 0'));
  }
  next();
});

module.exports = mongoose.model('Bid', bidSchema); 