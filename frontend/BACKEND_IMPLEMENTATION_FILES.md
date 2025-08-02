# Backend Implementation Files

## 🔧 **Step 1: Create .gitignore**

```bash
# .gitignore
node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# Uploads directory (optional - you might want to track this)
uploads/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

## 🔧 **Step 2: Authentication Controller**

```javascript
// src/controllers/auth/authController.js
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const blockchainService = require('../../services/blockchainService');

class AuthController {
  // Connect wallet and authenticate user
  async connectWallet(req, res) {
    try {
      const { walletAddress, signature, message } = req.body;

      // Validate wallet address
      if (!blockchainService.validateWalletAddress(walletAddress)) {
        return res.status(400).json({ 
          error: 'Invalid wallet address' 
        });
      }

      // Find or create user
      let user = await User.findOne({ 
        walletAddress: walletAddress.toLowerCase() 
      });
      
      if (!user) {
        // Create new user
        user = new User({
          walletAddress: walletAddress.toLowerCase(),
          username: `User_${walletAddress.slice(2, 8)}` // Generate username from address
        });
        await user.save();
      }

      // Update last seen
      await user.updateLastSeen();

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          walletAddress: user.walletAddress 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      console.error('Connect wallet error:', error);
      res.status(500).json({ 
        error: 'Authentication failed',
        message: error.message 
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get wallet balance
      const balance = await blockchainService.getBalance(user.walletAddress);

      res.json({
        success: true,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          balance: balance
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        error: 'Failed to get profile',
        message: error.message 
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { username, email, bio } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update fields if provided
      if (username) user.username = username;
      if (email) user.email = email;
      if (bio !== undefined) user.bio = bio;

      await user.save();

      res.json({
        success: true,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ 
        error: 'Failed to update profile',
        message: error.message 
      });
    }
  }
}

module.exports = new AuthController();
```

## 🔧 **Step 3: Authentication Routes**

```javascript
// src/routes/auth/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');
const { auth } = require('../../middleware/auth');

// Connect wallet
router.post('/connect-wallet', authController.connectWallet);

// Get user profile (requires authentication)
router.get('/profile', auth, authController.getProfile);

// Update user profile (requires authentication)
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
```

## 🔧 **Step 4: Blockchain Service**

```javascript
// src/services/blockchainService.js
const Web3 = require('web3');

class BlockchainService {
  constructor() {
    // Connect to Ethereum network
    this.web3 = new Web3(process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID');
  }

  // Validate wallet address
  validateWalletAddress(address) {
    try {
      return this.web3.utils.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  // Get wallet balance
  async getBalance(address) {
    try {
      const balance = await this.web3.eth.getBalance(address);
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Get balance error:', error);
      throw new Error('Failed to get wallet balance');
    }
  }

  // Validate ETH transfer
  async validateTransfer(fromAddress, toAddress, amount) {
    try {
      // Validate addresses
      if (!this.web3.utils.isAddress(fromAddress) || !this.web3.utils.isAddress(toAddress)) {
        throw new Error('Invalid wallet addresses');
      }

      // Validate amount
      if (amount <= 0) {
        throw new Error('Invalid transfer amount');
      }

      // Check if sender has enough balance
      const balance = await this.getBalance(fromAddress);
      if (parseFloat(balance) < parseFloat(amount)) {
        throw new Error('Insufficient balance');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Verify transaction hash
  async verifyTransaction(txHash) {
    try {
      const transaction = await this.web3.eth.getTransaction(txHash);
      return transaction && transaction.blockNumber !== null;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new BlockchainService();
```

## 🔧 **Step 5: File Service**

```javascript
// src/services/fileService.js
const fs = require('fs');
const path = require('path');

class FileService {
  constructor() {
    this.uploadDir = process.env.UPLOAD_PATH || './uploads';
    this.ensureUploadDirs();
  }

  ensureUploadDirs() {
    const dirs = [
      path.join(this.uploadDir, 'nfts'),
      path.join(this.uploadDir, 'collections'),
      path.join(this.uploadDir, 'avatars')
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Get file URL
  getFileUrl(filePath) {
    if (!filePath) return null;
    
    // Remove the uploads directory from the path
    const relativePath = filePath.replace(this.uploadDir, '');
    return `/uploads${relativePath}`;
  }

  // Delete file
  deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // Get file size
  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  // Check if file exists
  fileExists(filePath) {
    return fs.existsSync(filePath);
  }
}

module.exports = new FileService();
```

## 🔧 **Step 6: Collection Controller**

```javascript
// src/controllers/user/collectionController.js
const Collection = require('../../models/Collection');
const fileService = require('../../services/fileService');

class CollectionController {
  // Create collection
  async createCollection(req, res) {
    try {
      const { name, description, category } = req.body;
      const imageFile = req.file;

      // Validate required fields
      if (!name) {
        return res.status(400).json({ error: 'Collection name is required' });
      }

      // Create collection
      const collection = new Collection({
        name,
        description,
        category: category || 'Other',
        creator: req.user._id,
        imageUrl: imageFile ? fileService.getFileUrl(imageFile.path) : null
      });

      await collection.save();

      res.status(201).json({
        success: true,
        collection: {
          id: collection._id,
          name: collection.name,
          description: collection.description,
          imageUrl: collection.imageUrl,
          category: collection.category,
          creator: collection.creator,
          isVerified: collection.isVerified,
          itemCount: collection.itemCount,
          floorPrice: collection.floorPrice,
          totalVolume: collection.totalVolume,
          createdAt: collection.createdAt
        }
      });
    } catch (error) {
      console.error('Create collection error:', error);
      res.status(500).json({ 
        error: 'Failed to create collection',
        message: error.message 
      });
    }
  }

  // Get all collections
  async getAllCollections(req, res) {
    try {
      const { page = 1, limit = 20, category, search } = req.query;
      
      const query = {};
      
      // Filter by category
      if (category) {
        query.category = category;
      }
      
      // Search by name
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const collections = await Collection.find(query)
        .populate('creator', 'username walletAddress avatarUrl')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Collection.countDocuments(query);

      res.json({
        success: true,
        collections,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get collections error:', error);
      res.status(500).json({ 
        error: 'Failed to get collections',
        message: error.message 
      });
    }
  }

  // Get collection by ID
  async getCollectionById(req, res) {
    try {
      const { id } = req.params;
      
      const collection = await Collection.findById(id)
        .populate('creator', 'username walletAddress avatarUrl');

      if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
      }

      res.json({
        success: true,
        collection
      });
    } catch (error) {
      console.error('Get collection error:', error);
      res.status(500).json({ 
        error: 'Failed to get collection',
        message: error.message 
      });
    }
  }

  // Update collection
  async updateCollection(req, res) {
    try {
      const { id } = req.params;
      const { name, description, category } = req.body;
      const imageFile = req.file;

      const collection = await Collection.findById(id);

      if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
      }

      // Check if user is the creator
      if (collection.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to update this collection' });
      }

      // Update fields
      if (name) collection.name = name;
      if (description !== undefined) collection.description = description;
      if (category) collection.category = category;
      if (imageFile) {
        // Delete old image if exists
        if (collection.imageUrl) {
          const oldPath = collection.imageUrl.replace('/uploads', './uploads');
          fileService.deleteFile(oldPath);
        }
        collection.imageUrl = fileService.getFileUrl(imageFile.path);
      }

      await collection.save();

      res.json({
        success: true,
        collection
      });
    } catch (error) {
      console.error('Update collection error:', error);
      res.status(500).json({ 
        error: 'Failed to update collection',
        message: error.message 
      });
    }
  }
}

module.exports = new CollectionController();
```

## 🔧 **Step 7: Collection Routes**

```javascript
// src/routes/user/collectionRoutes.js
const express = require('express');
const router = express.Router();
const collectionController = require('../../controllers/user/collectionController');
const { auth } = require('../../middleware/auth');
const { collectionUpload } = require('../../config/multer');

// Create collection (requires auth)
router.post('/', auth, collectionUpload.single('image'), collectionController.createCollection);

// Get all collections (public)
router.get('/', collectionController.getAllCollections);

// Get collection by ID (public)
router.get('/:id', collectionController.getCollectionById);

// Update collection (requires auth)
router.put('/:id', auth, collectionUpload.single('image'), collectionController.updateCollection);

module.exports = router;
```

## 🔧 **Step 8: Transaction Model**

```javascript
// src/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  toAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ETH'
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  nftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  gasUsed: Number,
  gasPrice: Number,
  blockNumber: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
```

## 🔧 **Step 9: Transaction Controller**

```javascript
// src/controllers/marketplace/transactionController.js
const Transaction = require('../../models/Transaction');
const blockchainService = require('../../services/blockchainService');

class TransactionController {
  // Validate ETH transfer
  async validateTransfer(req, res) {
    try {
      const { fromAddress, toAddress, amount } = req.body;

      // Validate the transfer
      await blockchainService.validateTransfer(fromAddress, toAddress, amount);

      res.json({ 
        success: true,
        valid: true, 
        message: 'Transfer validation successful' 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        valid: false, 
        error: error.message 
      });
    }
  }

  // Record transaction after frontend completes transfer
  async recordTransaction(req, res) {
    try {
      const { fromAddress, toAddress, amount, txHash, nftId } = req.body;

      // Verify transaction hash
      const isValid = await blockchainService.verifyTransaction(txHash);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid transaction hash' });
      }

      // Check if transaction already exists
      const existingTx = await Transaction.findOne({ transactionHash: txHash });
      if (existingTx) {
        return res.status(400).json({ error: 'Transaction already recorded' });
      }

      // Create transaction record
      const transaction = new Transaction({
        fromAddress: fromAddress.toLowerCase(),
        toAddress: toAddress.toLowerCase(),
        amount,
        transactionHash: txHash,
        nftId,
        status: 'completed'
      });

      await transaction.save();

      res.json({ 
        success: true,
        transaction: {
          id: transaction._id,
          fromAddress: transaction.fromAddress,
          toAddress: transaction.toAddress,
          amount: transaction.amount,
          transactionHash: transaction.transactionHash,
          status: transaction.status,
          createdAt: transaction.createdAt
        }
      });
    } catch (error) {
      console.error('Record transaction error:', error);
      res.status(500).json({ 
        error: 'Failed to record transaction',
        message: error.message 
      });
    }
  }

  // Get transaction history
  async getTransactionHistory(req, res) {
    try {
      const { page = 1, limit = 20, address } = req.query;
      
      const query = {};
      
      // Filter by address if provided
      if (address) {
        query.$or = [
          { fromAddress: address.toLowerCase() },
          { toAddress: address.toLowerCase() }
        ];
      }

      const transactions = await Transaction.find(query)
        .populate('nftId', 'name imageUrl')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Transaction.countDocuments(query);

      res.json({
        success: true,
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get transaction history error:', error);
      res.status(500).json({ 
        error: 'Failed to get transaction history',
        message: error.message 
      });
    }
  }
}

module.exports = new TransactionController();
```

## 🔧 **Step 10: Transaction Routes**

```javascript
// src/routes/marketplace/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/marketplace/transactionController');
const { auth } = require('../../middleware/auth');

// Validate ETH transfer
router.post('/validate', auth, transactionController.validateTransfer);

// Record transaction
router.post('/record', auth, transactionController.recordTransaction);

// Get transaction history
router.get('/history', auth, transactionController.getTransactionHistory);

module.exports = router;
```

## 🚀 **Step 11: Start the Server**

Now you can start your backend:

```bash
# Install dependencies
npm install

# Create .env file with your configuration
# Start development server
npm run dev
```

## 📊 **Test Your API**

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test wallet connection (POST request)
curl -X POST http://localhost:5000/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x1234567890123456789012345678901234567890"}'
```

Your backend is now ready with:
- ✅ **MongoDB** database connection
- ✅ **JWT authentication** for wallet-based auth
- ✅ **File uploads** to server storage
- ✅ **Collection management** (CRUD operations)
- ✅ **Transaction validation** and recording
- ✅ **Web3 integration** for blockchain operations

The next step would be to implement the NFT controller and routes, then connect your React frontend to these APIs! 