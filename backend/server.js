// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('✅ NFT Marketplace Backend is running');
});

// Connect to DB and Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB Atlas
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(`❌ Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();