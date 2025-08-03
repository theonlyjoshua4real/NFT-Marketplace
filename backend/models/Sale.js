const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  // Required fields
  nft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
    required: [true, 'NFT is required']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required']
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer is required']
  },
  price: {
    type: Number,
    required: [true, 'Sale price is required'],
    min: [0, 'Sale price cannot be negative']
  },
  currency: {
    type: String,
    default: 'ETH',
    enum: {
      values: ['ETH', 'USD', 'BTC', 'SOL'],
      message: 'Please select a valid currency'
    }
  },

  // Sale details
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },

  // Transaction details
  transactionHash: {
    type: String,
    trim: true
  },

  // Sale type
  saleType: {
    type: String,
    enum: {
      values: ['direct', 'auction', 'offer'],
      message: 'Please select a valid sale type'
    },
    default: 'direct'
  },

  // Status fields
  status: {
    type: String,
    enum: {
      values: ['pending', 'completed', 'cancelled', 'failed'],
      message: 'Please select a valid sale status'
    },
    default: 'pending'
  },

  // Additional fields
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
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

// Virtual field for total value
saleSchema.virtual('totalValue').get(function() {
  return this.price * this.quantity;
});

// Virtual field for formatted price
saleSchema.virtual('formattedPrice').get(function() {
  return `${this.price} ${this.currency}`;
});

// Virtual field for formatted total value
saleSchema.virtual('formattedTotalValue').get(function() {
  return `${this.totalValue} ${this.currency}`;
});

// Virtual field for sale age
saleSchema.virtual('saleAge').get(function() {
  const now = new Date();
  const ageInMs = now - this.createdAt;
  const ageInHours = Math.floor(ageInMs / (1000 * 60 * 60));
  const ageInDays = Math.floor(ageInHours / 24);
  
  if (ageInDays > 0) return `${ageInDays} day${ageInDays > 1 ? 's' : ''}`;
  if (ageInHours > 0) return `${ageInHours} hour${ageInHours > 1 ? 's' : ''}`;
  return 'Just now';
});

// Indexes for better query performance
saleSchema.index({ nft: 1 });
saleSchema.index({ seller: 1 });
saleSchema.index({ buyer: 1 });
saleSchema.index({ status: 1 });
saleSchema.index({ saleType: 1 });
saleSchema.index({ createdAt: -1 });
saleSchema.index({ price: -1 });

// Instance methods
saleSchema.methods.complete = function() {
  this.status = 'completed';
  return this.save();
};

saleSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

saleSchema.methods.fail = function() {
  this.status = 'failed';
  return this.save();
};

// Static methods
saleSchema.statics.findByNFT = function(nftId) {
  return this.find({ nft: nftId })
    .populate('seller', 'name email')
    .populate('buyer', 'name email')
    .populate('nft', 'name imageUrl')
    .sort({ createdAt: -1 });
};

saleSchema.statics.findBySeller = function(sellerId) {
  return this.find({ seller: sellerId })
    .populate('buyer', 'name email')
    .populate('nft', 'name imageUrl')
    .sort({ createdAt: -1 });
};

saleSchema.statics.findByBuyer = function(buyerId) {
  return this.find({ buyer: buyerId })
    .populate('seller', 'name email')
    .populate('nft', 'name imageUrl')
    .sort({ createdAt: -1 });
};

saleSchema.statics.findCompleted = function() {
  return this.find({ status: 'completed' })
    .populate('seller', 'name email')
    .populate('buyer', 'name email')
    .populate('nft', 'name imageUrl')
    .sort({ createdAt: -1 });
};

saleSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  })
    .populate('seller', 'name email')
    .populate('buyer', 'name email')
    .populate('nft', 'name imageUrl')
    .sort({ createdAt: -1 });
};

saleSchema.statics.getTotalVolume = function(startDate, endDate) {
  const matchStage = {
    status: 'completed'
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: startDate,
      $lte: endDate
    };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalVolume: { $sum: '$price' },
        totalSales: { $sum: 1 },
        averagePrice: { $avg: '$price' }
      }
    }
  ]);
};

saleSchema.statics.getTopSellers = function(limit = 10) {
  return this.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: '$seller',
        totalSales: { $sum: 1 },
        totalVolume: { $sum: '$price' },
        averagePrice: { $avg: '$price' }
      }
    },
    { $sort: { totalVolume: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'seller'
      }
    },
    { $unwind: '$seller' },
    {
      $project: {
        seller: { name: 1, email: 1 },
        totalSales: 1,
        totalVolume: 1,
        averagePrice: 1
      }
    }
  ]);
};

saleSchema.statics.getTopBuyers = function(limit = 10) {
  return this.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: '$buyer',
        totalPurchases: { $sum: 1 },
        totalSpent: { $sum: '$price' },
        averagePrice: { $avg: '$price' }
      }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'buyer'
      }
    },
    { $unwind: '$buyer' },
    {
      $project: {
        buyer: { name: 1, email: 1 },
        totalPurchases: 1,
        totalSpent: 1,
        averagePrice: 1
      }
    }
  ]);
};

// Pre-save middleware to update timestamps
saleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to validate sale
saleSchema.pre('save', function(next) {
  if (this.price <= 0) {
    return next(new Error('Sale price must be greater than 0'));
  }
  if (this.quantity <= 0) {
    return next(new Error('Quantity must be greater than 0'));
  }
  if (this.seller.toString() === this.buyer.toString()) {
    return next(new Error('Seller and buyer cannot be the same'));
  }
  next();
});

module.exports = mongoose.model('Sale', saleSchema); 