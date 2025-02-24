const express = require('express');
const User = require('../models/user.model');

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
});

// Approve an agent
router.put('/approve-agent/:id', async (req, res) => {
  try {
    const agent = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json({ message: 'Agent approved', agent });
  } catch (error) {
    res.status(500).json({ message: 'Approval failed', error });
  }
});

module.exports = router;
