# JWT Implementation Guide - NFT Marketplace

## 🔐 **JWT Service (src/services/jwtService.js)**

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class JWTService {
  // Generate JWT token
  generateToken(user) {
    const payload = {
      userId: user._id,
      walletAddress: user.walletAddress,
      username: user.username,
      isAdmin: user.isAdmin
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d', // Token expires in 7 days
      issuer: 'nft-marketplace',
      audience: 'nft-users'
    });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { valid: true, payload: decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Refresh token (optional)
  refreshToken(user) {
    return this.generateToken(user);
  }

  // Decode token without verification (for reading payload)
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new JWTService();
```

## 🔐 **Enhanced Authentication Middleware**

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtService = require('../services/jwtService');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const { valid, payload, error } = jwtService.verifyToken(token);
    
    if (!valid) {
      return res.status(401).json({ 
        error: 'Invalid token.',
        details: error 
      });
    }

    // Find user
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    // Check if user is still active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account deactivated.' });
    }

    // Add user to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
};

// Admin authentication
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        error: 'Access denied. Admin only.' 
      });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Admin authentication failed.' });
  }
};

// Optional authentication (for public routes that can show user info if logged in)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { valid, payload } = jwtService.verifyToken(token);
      
      if (valid) {
        const user = await User.findById(payload.userId);
        if (user) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = { auth, adminAuth, optionalAuth };
```

## 🔐 **Enhanced Auth Controller**

```javascript
// src/controllers/auth/authController.js
const User = require('../../models/User');
const jwtService = require('../../services/jwtService');
const blockchainService = require('../../services/blockchainService');

class AuthController {
  // Connect wallet and get JWT
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
          username: `User_${walletAddress.slice(2, 8)}`,
          isActive: true
        });
        await user.save();
      }

      // Update last seen
      await user.updateLastSeen();

      // Generate JWT token
      const token = jwtService.generateToken(user);

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
          isAdmin: user.isAdmin,
          isActive: user.isActive
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

  // Get user profile (requires JWT)
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
          isActive: user.isActive,
          balance: balance,
          lastSeen: user.lastSeen
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

  // Update user profile (requires JWT)
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
          isAdmin: user.isAdmin,
          isActive: user.isActive
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

  // Logout (optional - frontend handles token removal)
  async logout(req, res) {
    try {
      // Update last seen
      await req.user.updateLastSeen();

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        error: 'Logout failed',
        message: error.message 
      });
    }
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate new token
      const newToken = jwtService.generateToken(user);

      res.json({
        success: true,
        token: newToken,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          isActive: user.isActive
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ 
        error: 'Token refresh failed',
        message: error.message 
      });
    }
  }
}

module.exports = new AuthController();
```

## 🔐 **Frontend JWT Integration**

### **JWT Service (Frontend)**
```javascript
// src/services/authService.js
class AuthService {
  // Store token
  setToken(token) {
    localStorage.setItem('nft_token', token);
  }

  // Get token
  getToken() {
    return localStorage.getItem('nft_token');
  }

  // Remove token
  removeToken() {
    localStorage.removeItem('nft_token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  // Get user data
  getUser() {
    const userStr = localStorage.getItem('nft_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set user data
  setUser(user) {
    localStorage.setItem('nft_user', JSON.stringify(user));
  }

  // Remove user data
  removeUser() {
    localStorage.removeItem('nft_user');
  }

  // Logout
  logout() {
    this.removeToken();
    this.removeUser();
  }

  // Connect wallet
  async connectWallet(walletAddress) {
    try {
      const response = await fetch('/api/auth/connect-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress })
      });

      const data = await response.json();

      if (data.success) {
        this.setToken(data.token);
        this.setUser(data.user);
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Connect wallet error:', error);
      throw error;
    }
  }

  // Make authenticated API calls
  async authenticatedRequest(url, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    };

    const response = await fetch(url, config);
    
    // Handle token expiration
    if (response.status === 401) {
      this.logout();
      throw new Error('Token expired. Please reconnect your wallet.');
    }

    return response;
  }
}

export default new AuthService();
```

### **React Hook for Authentication**
```javascript
// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = authService.getToken();
    const userData = authService.getUser();
    
    if (token && userData) {
      setUser(userData);
    }
    
    setLoading(false);
  }, []);

  const connectWallet = async (walletAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.connectWallet(walletAddress);
      setUser(result.user);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return {
    user,
    loading,
    error,
    connectWallet,
    logout,
    isAuthenticated
  };
};
```

## 🔐 **Protected Route Component**

```javascript
// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, fallback = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return fallback || <div>Please connect your wallet to continue.</div>;
  }

  return children;
};

export default ProtectedRoute;
```

## 🔐 **Usage Examples**

### **Connect Wallet (Frontend)**
```javascript
import { useAuth } from '../hooks/useAuth';

const ConnectWallet = () => {
  const { connectWallet, loading, error } = useAuth();

  const handleConnect = async () => {
    try {
      // Get wallet address from MetaMask or other wallet
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const walletAddress = accounts[0];
      await connectWallet(walletAddress);
      
      console.log('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <button onClick={handleConnect} disabled={loading}>
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};
```

### **Protected API Call**
```javascript
import authService from '../services/authService';

const createCollection = async (collectionData) => {
  try {
    const response = await authService.authenticatedRequest('/api/collections', {
      method: 'POST',
      body: JSON.stringify(collectionData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to create collection:', error);
    throw error;
  }
};
```

## 🔐 **Security Best Practices**

### **1. Environment Variables**
```env
# .env
JWT_SECRET=your-super-long-random-secret-key-here-make-it-at-least-32-characters
JWT_EXPIRES_IN=7d
JWT_ISSUER=nft-marketplace
JWT_AUDIENCE=nft-users
```

### **2. Token Expiration**
```javascript
// Short expiration for sensitive operations
const shortToken = jwt.sign(payload, secret, { expiresIn: '1h' });

// Longer expiration for general use
const longToken = jwt.sign(payload, secret, { expiresIn: '7d' });
```

### **3. Token Refresh Strategy**
```javascript
// Check token expiration before API calls
const isTokenExpired = (token) => {
  const decoded = jwt.decode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
```

### **4. Secure Storage**
```javascript
// Use secure storage in production
const secureStorage = {
  set: (key, value) => {
    if (process.env.NODE_ENV === 'production') {
      // Use secure storage (httpOnly cookies, etc.)
    } else {
      localStorage.setItem(key, value);
    }
  }
};
```

## 🔐 **Complete Flow Summary**

1. **User connects wallet** → Frontend gets wallet address
2. **Frontend sends address** → Backend validates and creates user
3. **Backend generates JWT** → Sends token to frontend
4. **Frontend stores JWT** → Uses for all authenticated requests
5. **Backend validates JWT** → Middleware checks token on protected routes
6. **Token expires** → Frontend handles re-authentication

This JWT system provides secure, stateless authentication perfect for your NFT marketplace! 