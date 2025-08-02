# Backend Dependencies Guide - NFT Marketplace

## 📋 Table of Contents
1. [Core Dependencies](#core-dependencies)
2. [Database Dependencies](#database-dependencies)
3. [Authentication & Security](#authentication--security)
4. [File Upload & Storage](#file-upload--storage)
5. [Blockchain Integration](#blockchain-integration)
6. [Email Notifications](#email-notifications)
7. [Validation & Sanitization](#validation--sanitization)
8. [Utility Libraries](#utility-libraries)
9. [Development Dependencies](#development-dependencies)
10. [Minimal Setup](#minimal-setup)
11. [Recommended Starting Stack](#recommended-starting-stack)

## 🔧 Core Dependencies (Essential)

### Express.js Ecosystem
```bash
npm install express cors helmet morgan
```

#### **`express`**
- **Purpose**: Main web framework for Node.js
- **Why needed**: Creates your API server, handles HTTP requests/responses
- **Your use case**: All your API endpoints (NFT creation, user auth, marketplace)
- **Example**: `app.get('/api/nfts', nftController.getAllNfts)`

#### **`cors`**
- **Purpose**: Cross-Origin Resource Sharing middleware
- **Why needed**: Allows your React frontend to communicate with your backend
- **Your use case**: Frontend (localhost:3000) → Backend (localhost:5000)
- **Example**: Enables API calls from your React app

#### **`helmet`**
- **Purpose**: Security middleware
- **Why needed**: Adds security headers to prevent common attacks
- **Your use case**: Protects your API from XSS, clickjacking, etc.
- **Example**: Automatically sets security headers on all responses

#### **`morgan`**
- **Purpose**: HTTP request logger
- **Why needed**: Logs all API requests for debugging/monitoring
- **Your use case**: See which endpoints are being called, track errors
- **Example**: Logs `GET /api/nfts 200 15ms` for each request

## 🗄️ Database Dependencies

### MongoDB (Primary Database)
```bash
npm install mongoose
```

#### **`mongoose`**
- **Purpose**: MongoDB object modeling for Node.js
- **Why needed**: Write database queries in JavaScript, define schemas
- **Your use case**: Store users, collections, NFTs, transactions
- **Example**: 
```javascript
const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  username: String,
  email: String
});
```

### Redis (Caching/Sessions) - Optional
```bash
npm install redis
```

#### **`redis`**
- **Purpose**: Fast in-memory storage for sessions, caching
- **Why needed**: User sessions, cache NFT data, rate limiting
- **Your use case**: Store user sessions, cache frequently accessed data
- **Example**: Cache collection data to reduce database queries

## 🔐 Authentication & Security

```bash
npm install jsonwebtoken bcryptjs
```

#### **`jsonwebtoken`**
- **Purpose**: JWT (JSON Web Tokens)
- **Why needed**: Secure way to authenticate users without storing sessions
- **Your use case**: User login, API authentication, wallet verification
- **Example**: Generate token when user connects wallet

#### **`bcryptjs`**
- **Purpose**: Password hashing
- **Why needed**: Securely hash passwords before storing in database
- **Your use case**: If you add email/password auth alongside wallet auth
- **Example**: Hash user passwords for additional security

## 📁 File Upload & Storage

### Choose ONE of these options:

**Option A: AWS S3**
```bash
npm install aws-sdk multer
```

#### **`aws-sdk`**
- **Purpose**: AWS SDK for Node.js
- **Why needed**: Upload files to AWS S3 cloud storage
- **Your use case**: Store NFT images/videos in the cloud
- **Example**: Upload NFT image to S3 bucket

#### **`multer`**
- **Purpose**: File upload middleware
- **Why needed**: Handle file uploads from frontend forms
- **Your use case**: NFT image upload, collection banner upload
- **Example**: Process multipart form data from file uploads

**Option B: Cloudinary**
```bash
npm install cloudinary multer
```

#### **`cloudinary`**
- **Purpose**: Cloudinary SDK
- **Why needed**: Upload and optimize images/videos
- **Your use case**: Same as S3, but with built-in image optimization
- **Example**: Upload image and get optimized URL back

## ⛓️ Blockchain Integration

```bash
npm install web3 ethers
```

#### **`web3`**
- **Purpose**: Ethereum JavaScript API
- **Why needed**: Interact with Ethereum blockchain
- **Your use case**: Connect wallet, transfer ETH, read wallet balance
- **Example**: 
```javascript
const web3 = new Web3(Web3.givenProvider);
const balance = await web3.eth.getBalance(walletAddress);
```

#### **`ethers`**
- **Purpose**: Alternative to web3 (more modern)
- **Why needed**: Same as web3, but with better TypeScript support
- **Your use case**: You can use either web3 OR ethers (not both)
- **Example**: More modern API for blockchain interactions

## ✉️ Email Notifications

```bash
npm install nodemailer
```

#### **`nodemailer`**
- **Purpose**: Email sending library
- **Why needed**: Send email notifications to users
- **Your use case**: Welcome emails, NFT sale notifications, admin alerts
- **Example**: Send confirmation email when user creates account

## ✅ Validation & Sanitization

```bash
npm install joi express-validator
```

#### **`joi`**
- **Purpose**: Schema validation library
- **Why needed**: Validate data before processing
- **Your use case**: Validate NFT metadata, user input, API requests
- **Example**: 
```javascript
const schema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required()
});
```

#### **`express-validator`**
- **Purpose**: Express middleware for validation
- **Why needed**: Validate request data in Express routes
- **Your use case**: Same as joi, but integrated with Express
- **Example**: Validate request body in route handlers

## 🛠️ Utility Libraries

```bash
npm install dayjs lodash uuid
```

#### **`dayjs`**
- **Purpose**: Date/time manipulation (Moment.js alternative)
- **Why needed**: Handle dates, timestamps, countdowns
- **Your use case**: NFT release dates, transaction timestamps
- **Example**: Format dates, calculate time differences
- **Advantage**: 98% smaller than Moment.js, actively maintained

#### **`lodash`**
- **Purpose**: JavaScript utility library
- **Why needed**: Helper functions for arrays, objects, strings
- **Your use case**: Data manipulation, filtering, sorting
- **Example**: Deep clone objects, filter arrays, debounce functions

#### **`uuid`**
- **Purpose**: Generate unique identifiers
- **Why needed**: Create unique IDs for database records
- **Your use case**: Generate IDs for NFTs, transactions, etc.
- **Example**: Create unique identifiers for database documents

## 🧪 Development Dependencies

```bash
npm install -D nodemon jest supertest
```

#### **`nodemon`**
- **Purpose**: Auto-restart server during development
- **Why needed**: Automatically restart server when you make changes
- **Your use case**: Development workflow
- **Example**: Server restarts when you save a file

#### **`jest`**
- **Purpose**: Testing framework
- **Why needed**: Write and run tests for your API
- **Your use case**: Test authentication, NFT creation, etc.
- **Example**: Unit tests for your controllers and services

#### **`supertest`**
- **Purpose**: HTTP testing library
- **Why needed**: Test your API endpoints
- **Your use case**: Integration tests for your routes
- **Example**: Test API endpoints with HTTP requests

## 📦 Minimal Setup (Start Here)

If you want to start simple and add more later:

```bash
# Essential for basic API
npm install express cors helmet morgan

# Database (MongoDB)
npm install mongoose

# Authentication
npm install jsonwebtoken

# File upload (choose one)
npm install multer aws-sdk
# OR
npm install multer cloudinary

# Blockchain (choose one)
npm install web3
# OR
npm install ethers

# Development
npm install -D nodemon
```

## 🎯 What You DON'T Need Initially

- **`bcryptjs`** - Only if you add email/password auth
- **`nodemailer`** - Only if you want email notifications
- **`redis`** - Only if you need caching/sessions
- **`dayjs`** - You can use native JavaScript Date objects
- **`lodash`** - You can write your own utility functions
- **`jest/supertest`** - Only if you want to write tests
- **`uuid`** - MongoDB generates IDs automatically

## 🚀 Recommended Starting Stack

```bash
# Core API
npm install express cors helmet morgan

# Database (MongoDB)
npm install mongoose

# Authentication
npm install jsonwebtoken

# File upload
npm install multer cloudinary

# Blockchain
npm install web3

# Validation
npm install joi

# Development
npm install -D nodemon
```

## 📊 Dependency Categories Summary

| Category | Essential | Optional | Development |
|----------|-----------|----------|-------------|
| **Core** | express, cors, helmet, morgan | - | nodemon |
| **Database** | mongoose | redis | - |
| **Auth** | jsonwebtoken | bcryptjs | - |
| **File Upload** | multer + (aws-sdk OR cloudinary) | - | - |
| **Blockchain** | web3 OR ethers | - | - |
| **Email** | - | nodemailer | - |
| **Validation** | joi | express-validator | - |
| **Utilities** | - | dayjs, lodash, uuid | - |
| **Testing** | - | - | jest, supertest |

## 🔄 Migration Path

1. **Start with Minimal Setup** - Get basic API working
2. **Add Database** - Implement MongoDB with Mongoose
3. **Add Authentication** - JWT for wallet-based auth
4. **Add File Upload** - Handle NFT image uploads
5. **Add Blockchain** - Wallet connection and ETH transfers
6. **Add Validation** - Validate all inputs
7. **Add Utilities** - As needed for specific features
8. **Add Testing** - When ready to write tests

This approach lets you build incrementally and only add dependencies when you actually need them! 