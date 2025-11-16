const express = require('express');
const User = require('../models/User');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Return list of users (id, name, email)
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, 'name email capabilities role');
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Return assignments — users with capabilities
router.get('/assignments', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ capabilities: { $exists: true, $ne: [] } }, 'name email capabilities role');
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Assign a capability to a user (admin only)
router.post('/assign', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { userId, capability } = req.body;
    if (!userId || !capability) return res.status(400).json({ message: 'Missing userId or capability' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.capabilities.includes(capability)) {
      user.capabilities.push(capability);
      await user.save();
    }
    return res.json({ message: 'Capability assigned', user: { id: user._id, capabilities: user.capabilities } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
