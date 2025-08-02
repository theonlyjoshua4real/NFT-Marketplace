# NFT Marketplace Backend Setup Guide

## 📁 **Project Structure**

```
nft-marketplace-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── multer.js            # File upload configuration
│   │   └── web3.js              # Web3 configuration
│   │
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Collection.js        # Collection model
│   │   ├── NFT.js               # NFT model
│   │   └── Transaction.js       # Transaction model
│   │
│   ├── controllers/
│   │   ├── auth/
│   │   │   └── authController.js # Wallet authentication
│   │   ├── user/
│   │   │   ├── userController.js
│   │   │   ├── collectionController.js
│   │   │   └── nftController.js
│   │   └── marketplace/
│   │       └── transactionController.js
│   │
│   ├── services/
│   │   ├── blockchainService.js # Web3 operations
│   │   ├── fileService.js       # Server file storage
│   │   └── emailService.js      # Email notifications
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── upload.js            # File upload middleware
│   │   └── validation.js        # Request validation
│   │
│   ├── routes/
│   │   ├── auth/
│   │   │   └── authRoutes.js    # Authentication routes
│   │   ├── user/
│   │   │   ├── userRoutes.js
│   │   │   ├── collectionRoutes.js
│   │   │   └── nftRoutes.js
│   │   └── marketplace/
│   │       └── transactionRoutes.js
│   │
│   └── utils/
│       ├── logger.js             # Logging utility
│       └── helpers.js            # Helper functions
│
├── uploads/                      # File storage directory
│   ├── nfts/                    # NFT images/videos
│   ├── collections/              # Collection banners
│   └── avatars/                 # User avatars
│
├── .env                          # Environment variables
├── .gitignore
├── package.json
├── server.js                     # Main server file
└── README.md
```

## 📦 **Step 1: Initialize Project**

```bash
# Create backend directory
mkdir nft-marketplace-backend
cd nft-marketplace-backend

# Initialize npm project
npm init -y

# Create directory structure
mkdir -p src/{config,models,controllers/{auth,user,marketplace},services,middleware,routes/{auth,user,marketplace},utils}
mkdir -p uploads/{nfts,collections,avatars}
```

## 📦 **Step 2: Install Dependencies**

```bash
# Core dependencies
npm install express cors helmet morgan

# Database
npm install mongoose

# Authentication
npm install jsonwebtoken

# File upload
npm install multer

# Blockchain
npm install web3

# Validation
npm install joi

# Utilities
npm install dayjs

# Development dependencies
npm install -D nodemon
```

## 📦 **Step 3: Package.json Configuration**

```json
{
  "name": "nft-marketplace-backend",
  "version": "1.0.0",
  "description": "NFT Marketplace Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "mongoose": "^8.0.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "web3": "^4.3.0",
    "joi": "^17.11.0",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

## 🔧 **Step 4: Environment Variables (.env)**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nft-marketplace

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Ethereum Configuration
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
ETHEREUM_NETWORK=mainnet

# File Upload Configuration
MAX_FILE_SIZE=200000000
UPLOAD_PATH=./uploads

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 🚀 **Step 5: Main Server File (server.js)**

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/auth/authRoutes');
const userRoutes = require('./src/routes/user/userRoutes');
const collectionRoutes = require('./src/routes/user/collectionRoutes');
const nftRoutes = require('./src/routes/user/nftRoutes');
const transactionRoutes = require('./src/routes/marketplace/transactionRoutes');

// Import database connection
const connectDB = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
```

## 🗄️ **Step 6: Database Configuration (src/config/database.js)**

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 📁 **Step 7: File Upload Configuration (src/config/multer.js)**

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    './uploads/nfts',
    './uploads/collections', 
    './uploads/avatars'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage for different file types
const getStorage = (uploadType) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const date = new Date();
      const uploadPath = path.join(`./uploads/${uploadType}`, 
        `${date.getFullYear()}/${date.getMonth() + 1}`);
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
};

// File filter for different upload types
const getFileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
    }
  };
};

// Configure uploads for different purposes
const nftUpload = multer({
  storage: getStorage('nfts'),
  fileFilter: getFileFilter([
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
    'video/mp4', 'video/webm'
  ]),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 200 * 1024 * 1024 // 200MB
  }
});

const collectionUpload = multer({
  storage: getStorage('collections'),
  fileFilter: getFileFilter(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

const avatarUpload = multer({
  storage: getStorage('avatars'),
  fileFilter: getFileFilter(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = {
  nftUpload,
  collectionUpload,
  avatarUpload
};
```

## 🔐 **Step 8: Authentication Middleware (src/middleware/auth.js)**

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

module.exports = { auth, adminAuth };
```

## 📋 **Step 9: Models**

### **User Model (src/models/User.js)**
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  avatarUrl: String,
  bio: {
    type: String,
    maxlength: 500
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastSeen on login
userSchema.methods.updateLastSeen = function() {
  this.lastSeen = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
```

### **Collection Model (src/models/Collection.js)**
```javascript
const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 2000
  },
  imageUrl: String,
  bannerUrl: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['Art', 'Music', 'Sports', 'Gaming', 'Digital', 'Photography', 'Other'],
    default: 'Other'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  floorPrice: {
    type: Number,
    default: 0
  },
  totalVolume: {
    type: Number,
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
  },
  releaseDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Collection', collectionSchema);
```

### **NFT Model (src/models/NFT.js)**
```javascript
const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 2000
  },
  imageUrl: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'ETH'
  },
  isListed: {
    type: Boolean,
    default: false
  },
  isMinted: {
    type: Boolean,
    default: false
  },
  mintTransactionHash: String,
  releaseDate: Date,
  royalties: {
    type: Number,
    default: 20,
    min: 0,
    max: 50
  },
  copies: {
    type: Number,
    default: 1,
    min: 1
  },
  currentCopy: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NFT', nftSchema);
```

## 🚀 **Step 10: Start Development**

```bash
# Install dependencies
npm install

# Create .env file with your configuration
# Start development server
npm run dev
```

## 📊 **API Endpoints Overview**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/connect-wallet` | Connect wallet & get JWT |
| `GET` | `/api/auth/profile` | Get user profile |
| `POST` | `/api/collections` | Create collection |
| `GET` | `/api/collections` | Get all collections |
| `POST` | `/api/nfts` | Create NFT |
| `GET` | `/api/nfts` | Get all NFTs |
| `POST` | `/api/transactions/validate` | Validate ETH transfer |

## 🔧 **Next Steps**

1. **Set up MongoDB** (local or MongoDB Atlas)
2. **Configure environment variables**
3. **Test the health endpoint**
4. **Implement controllers and routes**
5. **Add blockchain integration**
6. **Test file uploads**

This gives you a solid foundation to build your NFT marketplace backend with server-side file storage! 