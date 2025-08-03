const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/auth');

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.id}` });
});

module.exports = router;