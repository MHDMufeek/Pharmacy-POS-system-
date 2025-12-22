const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Change password for a user
// - If the authenticated user is changing their own password, require currentPassword
// - If changing another user's password, require admin role or 'manage_users' capability
router.post('/:id/password', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword, currentPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password is required (min 6 chars)' });
    }

    // find target user (include password for verification when needed)
    const target = await User.findById(userId).select('+password');
    if (!target) return res.status(404).json({ message: 'User not found' });

    const requesterId = req.user && (req.user.id || req.user._id) ? (req.user.id || req.user._id).toString() : null;

    // If requester is changing own password
    if (requesterId && requesterId === userId.toString()) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required' });
      const ok = await bcrypt.compare(currentPassword, target.password);
      if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

      target.password = await bcrypt.hash(newPassword, 10);
      await target.save();

      // generate a fresh token so the user can remain signed in
      const token = jwt.sign({ id: target._id, role: target.role }, config.JWT_SECRET, { expiresIn: '8h' });
      const userObj = { id: target._id, name: target.name, email: target.email, role: target.role, capabilities: target.capabilities };
      return res.json({ message: 'Password changed successfully', token, user: userObj });
    }

    // Otherwise, only admin or users with manage_users capability can change others' passwords
    const isAdmin = req.user && (req.user.role === 'admin' || (Array.isArray(req.user.capabilities) && req.user.capabilities.includes('manage_users')));
    if (!isAdmin) return res.status(403).json({ message: 'Forbidden' });

    target.password = await bcrypt.hash(newPassword, 10);
    await target.save();
    return res.json({ message: 'Password changed successfully' });

  } catch (err) {
    console.error('Error in change-password route', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
