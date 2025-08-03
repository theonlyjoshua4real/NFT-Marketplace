const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  // Required fields
  name: {
    type: String,
    required: [true, 'NFT name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'NFT description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'NFT category is required'],
    enum: {
      values: ['art', 'music', 'gaming', 'collectibles', 'photography', 'sports', 'fashion', 'other'],
      message: 'Please select a valid category'
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    validate: {
      validator: function(value) {
        return value >= this.remainder;
      },
      message: 'Quantity cannot be less than remainder'
    }
  },
  remainder: {
    type: Number,
    required: [true, 'Remainder is required'],
    min: [0, 'Remainder cannot be negative'],
    default: function() {
      return this.quantity;
    }
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },

  // Collection reference
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: [true, 'Collection is required']
  },

  // Timer/Sale fields
  isLimitedEdition: {
    type: Boolean,
    default: false
  },
  saleStartDate: {
    type: Date,
    validate: {
      validator: function(value) {
        if (this.isLimitedEdition && !value) {
          return false;
        }
        return true;
      },
      message: 'Sale start date is required for limited edition NFTs'
    }
  },
  saleEndDate: {
    type: Date,
    validate: {
      validator: function(value) {
        if (this.isLimitedEdition && !value) {
          return false;
        }
        if (this.isLimitedEdition && this.saleStartDate && value <= this.saleStartDate) {
          return false;
        }
        return true;
      },
      message: 'Sale end date must be after start date for limited edition NFTs'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'ETH',
    enum: {
      values: ['ETH', 'USD', 'BTC', 'SOL'],
      message: 'Please select a valid currency'
    }
  },
  maxPurchasePerUser: {
    type: Number,
    default: 1,
    min: [1, 'Max purchase per user must be at least 1']
  },

  // Metadata fields
  imageUrl: {
    type: String,
    required: [true, 'NFT image is required'],
    validate: {
      validator: function(value) {
        return /^https?:\/\/.+/.test(value);
      },
      message: 'Please provide a valid image URL'
    }
  },
  metadata: {
    type: Object,
    default: {}
  },
  
  // Status fields
  isActive: {
    type: Boolean,
    default: true
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

// Virtual field for current sale status
nftSchema.virtual('isCurrentlyOnSale').get(function() {
  if (!this.isLimitedEdition) return true; // Regular NFT always available
  
  const now = new Date();
  return now >= this.saleStartDate && now <= this.saleEndDate;
});

// Virtual field for time remaining (in milliseconds)
nftSchema.virtual('timeRemaining').get(function() {
  if (!this.isLimitedEdition || !this.isCurrentlyOnSale) return null;
  
  const now = new Date();
  return this.saleEndDate - now;
});

// Virtual field for time remaining in human readable format
nftSchema.virtual('timeRemainingFormatted').get(function() {
  if (!this.timeRemaining) return null;
  
  const days = Math.floor(this.timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((this.timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((this.timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
});

// Virtual field for sale status
nftSchema.virtual('saleStatus').get(function() {
  if (!this.isLimitedEdition) return 'always_available';
  
  const now = new Date();
  if (now < this.saleStartDate) return 'upcoming';
  if (now >= this.saleStartDate && now <= this.saleEndDate) return 'on_sale';
  return 'expired';
});

// Virtual field for percentage sold
nftSchema.virtual('percentageSold').get(function() {
  if (this.quantity === 0) return 0;
  return Math.round(((this.quantity - this.remainder) / this.quantity) * 100);
});

// Indexes for better query performance
nftSchema.index({ creator: 1 });
nftSchema.index({ category: 1 });
nftSchema.index({ collection: 1 });
nftSchema.index({ isLimitedEdition: 1 });
nftSchema.index({ saleEndDate: 1 });
nftSchema.index({ isActive: 1 });
nftSchema.index({ createdAt: -1 });

// Instance methods
nftSchema.methods.canBePurchased = function() {
  return this.remainder > 0 && this.isCurrentlyOnSale && this.isActive;
};

nftSchema.methods.updateSaleTimer = function(startDate, endDate) {
  this.saleStartDate = startDate;
  this.saleEndDate = endDate;
  this.isLimitedEdition = true;
  return this.save();
};

nftSchema.methods.removeTimer = function() {
  this.isLimitedEdition = false;
  this.saleStartDate = undefined;
  this.saleEndDate = undefined;
  return this.save();
};

nftSchema.methods.decreaseRemainder = function(amount = 1) {
  if (this.remainder >= amount) {
    this.remainder -= amount;
    return this.save();
  }
  throw new Error('Insufficient quantity available');
};

nftSchema.methods.increaseRemainder = function(amount = 1) {
  if (this.remainder + amount <= this.quantity) {
    this.remainder += amount;
    return this.save();
  }
  throw new Error('Cannot exceed original quantity');
};

// Static methods
nftSchema.statics.findAvailable = function() {
  return this.find({
    remainder: { $gt: 0 },
    isActive: true,
    $or: [
      { isLimitedEdition: false },
      {
        isLimitedEdition: true,
        saleStartDate: { $lte: new Date() },
        saleEndDate: { $gte: new Date() }
      }
    ]
  }).populate('creator', 'name email').populate('collection', 'name image');
};

nftSchema.statics.findExpired = function() {
  return this.find({
    isLimitedEdition: true,
    saleEndDate: { $lt: new Date() },
    isActive: true
  });
};

nftSchema.statics.findByCreator = function(creatorId) {
  return this.find({ creator: creatorId }).populate('creator', 'name email').populate('collection', 'name image');
};

nftSchema.statics.findByCollection = function(collectionId) {
  return this.find({ collection: collectionId }).populate('creator', 'name email').populate('collection', 'name image');
};

// Pre-save middleware to update timestamps
nftSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to validate timer fields
nftSchema.pre('save', function(next) {
  if (this.isLimitedEdition) {
    if (!this.saleStartDate || !this.saleEndDate) {
      return next(new Error('Sale start and end dates are required for limited edition NFTs'));
    }
    if (this.saleEndDate <= this.saleStartDate) {
      return next(new Error('Sale end date must be after start date'));
    }
  }
  next();
});

module.exports = mongoose.model('NFT', nftSchema); 