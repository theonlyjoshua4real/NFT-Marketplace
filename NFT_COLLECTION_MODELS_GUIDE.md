# NFT & Collection Models Guide

## Overview

This guide explains the complete NFT and Collection models implementation, including their relationship, timer logic for limited editions, and automatic volume tracking.

## 🎯 **NFT Model Features**

### **Core Fields (Required)**
```javascript
{
  name: String,           // NFT name (max 100 chars)
  description: String,    // NFT description (max 1000 chars)
  category: String,       // art, music, gaming, collectibles, etc.
  quantity: Number,       // Total quantity available
  remainder: Number,      // Remaining quantity for sale
  creator: ObjectId,      // Reference to User model
  collection: ObjectId,   // Reference to Collection model
  price: Number,          // Price per NFT
  imageUrl: String,       // NFT image URL
}
```

### **Timer/Sale Fields (Optional)**
```javascript
{
  isLimitedEdition: Boolean,    // true = has timer, false = always available
  saleStartDate: Date,          // When sale starts
  saleEndDate: Date,            // When sale ends
  currency: String,             // ETH, USD, BTC, SOL
  maxPurchasePerUser: Number,   // Purchase limit per user
}
```

### **Virtual Fields (Computed)**
- ✅ `isCurrentlyOnSale` - Real-time sale status
- ✅ `timeRemaining` - Time left in milliseconds
- ✅ `timeRemainingFormatted` - Human-readable time (e.g., "2d 5h 30m")
- ✅ `saleStatus` - Status enum (always_available, upcoming, on_sale, expired)
- ✅ `percentageSold` - Percentage of NFTs sold

## 🎯 **Collection Model Features**

### **Core Fields (Required)**
```javascript
{
  name: String,           // Collection name (max 100 chars)
  image: String,          // Collection image URL
  creator: ObjectId,      // Reference to User model
}
```

### **Volume & Statistics Fields**
```javascript
{
  totalVolume: Number,    // Total value of all NFTs (auto-updated)
  totalNFTs: Number,      // Count of NFTs in collection (auto-updated)
  floorPrice: Number,     // Lowest price NFT in collection
  owners: [ObjectId],     // Array of User references who own NFTs
}
```

### **Virtual Fields (Computed)**
- ✅ `uniqueOwnersCount` - Number of unique owners
- ✅ `averagePrice` - Average price of NFTs in collection

## 🔄 **NFT Types & Timer Logic**

### **1. Regular NFTs**
```javascript
{
  name: "My Art Piece",
  isLimitedEdition: false,
  // No timer fields needed
  // Always available for purchase
}
```

### **2. Limited Edition NFTs (with Timer)**
```javascript
{
  name: "Limited Art Piece",
  isLimitedEdition: true,
  saleStartDate: "2024-01-15T10:00:00Z",
  saleEndDate: "2024-01-20T10:00:00Z",
  // Computed: isCurrentlyOnSale = true (if current time is between dates)
}
```

### **3. Expired Timer**
```javascript
{
  name: "Expired Limited Art",
  isLimitedEdition: true,
  saleStartDate: "2024-01-01T10:00:00Z",
  saleEndDate: "2024-01-05T10:00:00Z",
  // Computed: isCurrentlyOnSale = false (timer expired)
  // Can be re-activated by updating saleEndDate
}
```

## 🔗 **NFT-Collection Relationship**

### **One-to-Many Relationship**
- One Collection can have many NFTs
- Each NFT must belong to exactly one Collection
- Collection statistics are automatically updated when NFTs are added/removed

### **Automatic Volume Tracking**
```javascript
// When NFT is created
const nft = new NFT({
  name: "My NFT",
  price: 0.1,
  collection: collectionId,
  // ... other fields
});

await nft.save();

// Update collection volume automatically
await collection.addNFT(nft.price);
```

## 📊 **Collection Volume Calculation**

### **Initial State**
```javascript
{
  name: "My Art Collection",
  totalVolume: 0,
  totalNFTs: 0,
  floorPrice: 0
}
```

### **After Adding NFTs**
```javascript
// After adding NFT with price 0.1 ETH
{
  totalVolume: 0.1,        // ← Updated
  totalNFTs: 1,            // ← Updated
  floorPrice: 0.1          // ← Updated (first NFT)
}

// After adding second NFT with price 0.05 ETH
{
  totalVolume: 0.15,       // ← Updated (0.1 + 0.05)
  totalNFTs: 2,            // ← Updated
  floorPrice: 0.05         // ← Updated (lower price)
}
```

## 🛠️ **Helper Methods**

### **NFT Instance Methods**
```javascript
// Check if NFT can be purchased
nft.canBePurchased() // Returns boolean

// Update sale timer
await nft.updateSaleTimer(startDate, endDate)

// Remove timer (make always available)
await nft.removeTimer()

// Decrease available quantity
await nft.decreaseRemainder(amount)

// Increase available quantity
await nft.increaseRemainder(amount)
```

### **Collection Instance Methods**
```javascript
// Add NFT to collection (updates volume)
await collection.addNFT(nftPrice)

// Remove NFT from collection
await collection.removeNFT(nftPrice)

// Add owner to collection
await collection.addOwner(userId)

// Remove owner from collection
await collection.removeOwner(userId)

// Update floor price
await collection.updateFloorPrice()
```

### **Static Methods**
```javascript
// NFT Static Methods
await NFT.findAvailable()           // Get all available NFTs
await NFT.findExpired()            // Get NFTs with expired timers
await NFT.findByCreator(userId)    // Get NFTs by creator
await NFT.findByCollection(collectionId) // Get NFTs by collection

// Collection Static Methods
await Collection.findByCreator(userId)     // Get collections by creator
await Collection.findTopCollections(10)    // Get top collections by volume
await Collection.findByCategory('art')     // Get collections by category
await Collection.findByOwner(userId)       // Get collections owned by user
```

## 🔄 **Complete Workflow Example**

### **1. Create Collection**
```javascript
const collection = new Collection({
  name: "Digital Art Collection",
  image: "https://example.com/collection.jpg",
  creator: userId,
  description: "Beautiful digital art pieces"
});

await collection.save();
```

### **2. Create NFT and Add to Collection**
```javascript
const nft = new NFT({
  name: "Sunset Art",
  description: "Beautiful sunset digital art",
  category: "art",
  quantity: 50,
  price: 0.2,
  currency: "ETH",
  imageUrl: "https://example.com/sunset.jpg",
  creator: userId,
  collection: collection._id,  // ← Link to collection
  isLimitedEdition: true,
  saleStartDate: new Date('2024-01-15T10:00:00Z'),
  saleEndDate: new Date('2024-01-20T10:00:00Z')
});

await nft.save();

// Update collection volume
await collection.addNFT(nft.price);
```

### **3. Query and Display**
```javascript
// Get all NFTs in collection
const collectionNFTs = await NFT.findByCollection(collectionId);

// Get collection with statistics
const collectionWithStats = await Collection.findById(collectionId)
  .populate('creator', 'name email');

console.log(`Collection: ${collectionWithStats.name}`);
console.log(`Total Volume: ${collectionWithStats.totalVolume} ETH`);
console.log(`Total NFTs: ${collectionWithStats.totalNFTs}`);
console.log(`Floor Price: ${collectionWithStats.floorPrice} ETH`);
```

## 🎯 **Timer Management**

### **Adding Timer to Existing NFT**
```javascript
await nft.updateSaleTimer(
  new Date('2024-02-01T10:00:00Z'),
  new Date('2024-02-05T10:00:00Z')
);
```

### **Removing Timer**
```javascript
await nft.removeTimer(); // Makes NFT always available
```

### **Checking Sale Status**
```javascript
if (nft.isCurrentlyOnSale) {
  console.log(`Sale ends in: ${nft.timeRemainingFormatted}`);
} else {
  console.log(`Sale status: ${nft.saleStatus}`);
}
```

## 📈 **Collection Statistics**

### **Volume Tracking**
- ✅ Automatic volume updates when NFTs are added
- ✅ Volume decreases when NFTs are removed
- ✅ Real-time statistics

### **Floor Price Calculation**
- ✅ Updates when first NFT is added
- ✅ Updates when lower-priced NFT is added
- ✅ Can be manually recalculated

### **Owner Tracking**
- ✅ Automatic owner addition when NFTs are purchased
- ✅ Owner removal when NFTs are sold
- ✅ Unique owner count calculation

## 🔍 **Query Examples**

### **Get Available NFTs**
```javascript
const availableNFTs = await NFT.findAvailable();
// Returns NFTs that are currently on sale
```

### **Get Collections by Category**
```javascript
const artCollections = await Collection.findByCategory('art');
// Returns all art collections
```

### **Get Top Collections**
```javascript
const topCollections = await Collection.findTopCollections(5);
// Returns top 5 collections by volume
```

### **Get User's Collections**
```javascript
const userCollections = await Collection.findByCreator(userId);
// Returns collections created by user
```

## 🚨 **Important Notes**

### **1. Collection Must Exist First**
```javascript
// ❌ Wrong - Collection doesn't exist
const nft = new NFT({
  collection: "non-existent-id"
});

// ✅ Correct - Create collection first
const collection = await Collection.create({...});
const nft = new NFT({
  collection: collection._id
});
```

### **2. Volume Updates**
```javascript
// ✅ Always update collection when NFT is created
await collection.addNFT(nft.price);

// ✅ Update when NFT is removed
await collection.removeNFT(nft.price);
```

### **3. Timer Validation**
```javascript
// ✅ Valid timer
{
  isLimitedEdition: true,
  saleStartDate: "2024-01-15T10:00:00Z",
  saleEndDate: "2024-01-20T10:00:00Z"  // After start date
}

// ❌ Invalid timer
{
  isLimitedEdition: true,
  saleStartDate: "2024-01-20T10:00:00Z",
  saleEndDate: "2024-01-15T10:00:00Z"  // Before start date
}
```

## 🎯 **Benefits of This Implementation**

### **1. Flexible NFT Types**
- Regular NFTs (always available)
- Limited edition NFTs (time-restricted)
- Easy timer management

### **2. Automatic Statistics**
- Collection volume updates automatically
- Floor price calculation
- Owner tracking

### **3. Performance Optimized**
- Indexed fields for fast queries
- Virtual fields for computed values
- Efficient relationship queries

### **4. Data Integrity**
- Required relationships
- Validation rules
- Automatic updates

This implementation provides a robust foundation for an NFT marketplace with flexible timer logic and automatic collection management! 🚀 