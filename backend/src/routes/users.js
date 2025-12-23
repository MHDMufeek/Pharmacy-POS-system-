const express = require('express');
const User = require('../models/User');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Delete a user (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.deleteOne({ _id: id });
    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Change password for a user
router.post('/:id/password', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, currentPassword } = req.body;

    if (!newPassword) return res.status(400).json({ message: 'New password is required' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isSelf = req.user && (String(req.user._id) === String(id));

    const bcrypt = require('bcryptjs');

    if (isSelf) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required' });
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    } else {
      // Only admins may change other users' passwords
      if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Error updating password:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
