const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  // Required fields
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Collection image is required'],
    validate: {
      validator: function(value) {
        return /^https?:\/\/.+/.test(value);
      },
      message: 'Please provide a valid image URL'
    }
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },

  // Volume and ownership fields
  totalVolume: {
    type: Number,
    default: 0,
    min: [0, 'Total volume cannot be negative']
  },
  owners: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Additional metadata
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: {
      values: ['art', 'music', 'gaming', 'collectibles', 'photography', 'sports', 'fashion', 'other'],
      message: 'Please select a valid category'
    }
  },
  
  // Status fields
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statistics fields
  totalNFTs: {
    type: Number,
    default: 0,
    min: [0, 'Total NFTs cannot be negative']
  },
  floorPrice: {
    type: Number,
    default: 0,
    min: [0, 'Floor price cannot be negative']
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

// Virtual field for unique owners count
collectionSchema.virtual('uniqueOwnersCount').get(function() {
  return this.owners.length;
});

// Virtual field for average price
collectionSchema.virtual('averagePrice').get(function() {
  if (this.totalNFTs === 0) return 0;
  return this.totalVolume / this.totalNFTs;
});

// Indexes for better query performance
collectionSchema.index({ creator: 1 });
collectionSchema.index({ category: 1 });
collectionSchema.index({ totalVolume: -1 });
collectionSchema.index({ totalNFTs: -1 });
collectionSchema.index({ isActive: 1 });
collectionSchema.index({ createdAt: -1 });

// Instance methods
collectionSchema.methods.addNFT = function(nftPrice) {
  this.totalVolume += nftPrice;
  this.totalNFTs += 1;
  
  // Update floor price if this is the first NFT or if price is lower
  if (this.totalNFTs === 1 || nftPrice < this.floorPrice) {
    this.floorPrice = nftPrice;
  }
  
  return this.save();
};

collectionSchema.methods.removeNFT = function(nftPrice) {
  this.totalVolume = Math.max(0, this.totalVolume - nftPrice);
  this.totalNFTs = Math.max(0, this.totalNFTs - 1);
  
  // Note: Floor price would need to be recalculated by querying all NFTs
  // This is a simplified version
  return this.save();
};

collectionSchema.methods.addOwner = function(userId) {
  if (!this.owners.includes(userId)) {
    this.owners.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

collectionSchema.methods.removeOwner = function(userId) {
  this.owners = this.owners.filter(owner => owner.toString() !== userId.toString());
  return this.save();
};

collectionSchema.methods.updateFloorPrice = async function() {
  // This method would need to query all NFTs in the collection
  // and find the minimum price
  const NFT = mongoose.model('NFT');
  const minPriceNFT = await NFT.findOne({ 
    collection: this._id,
    isActive: true 
  }).sort({ price: 1 });
  
  this.floorPrice = minPriceNFT ? minPriceNFT.price : 0;
  return this.save();
};

// Static methods
collectionSchema.statics.findByCreator = function(creatorId) {
  return this.find({ creator: creatorId }).populate('creator', 'name email');
};

collectionSchema.statics.findTopCollections = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ totalVolume: -1 })
    .limit(limit)
    .populate('creator', 'name email');
};

collectionSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category: category,
    isActive: true 
  }).populate('creator', 'name email');
};

collectionSchema.statics.findByOwner = function(userId) {
  return this.find({ 
    owners: userId,
    isActive: true 
  }).populate('creator', 'name email');
};

// Pre-save middleware to update timestamps
collectionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to validate total volume
collectionSchema.pre('save', function(next) {
  if (this.totalVolume < 0) {
    return next(new Error('Total volume cannot be negative'));
  }
  if (this.totalNFTs < 0) {
    return next(new Error('Total NFTs cannot be negative'));
  }
  next();
});

module.exports = mongoose.model('Collection', collectionSchema); 