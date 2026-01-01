const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { wrap } = require('../middleware/asyncHandler');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// register (for testing)
router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').notEmpty(), body('username').notEmpty()],
  wrap(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    const { name, email, password, role, username } = req.body;
    // Normalize
    const normalizedEmail = String(email).toLowerCase();
    const normalizedUsername = String(username).trim();

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) return res.status(400).json({ message: 'Email already in use' });
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) return res.status(400).json({ message: 'Username already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username: normalizedUsername, email: normalizedEmail, password: hashed, role: role || 'user' });
    return res.status(201).json({ id: user._id, name: user.name, username: user.username, email: user.email });
  })
);

// login
router.post(
  '/login',
  [body('password').notEmpty()],
  wrap(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    // Accept either email or username; tolerate different field names and whitespace
    const providedRaw = req.body.identifier || req.body.email || req.body.username || '';
    const provided = String(providedRaw || '').trim();
    const password = req.body.password;
    if (!provided || !password) return res.status(400).json({ message: 'Validation failed', errors: [{ msg: 'Missing identifier or password' }] });

    // helper to escape regex
    const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let user;
    if (provided.includes('@')) {
      user = await User.findOne({ email: provided.toLowerCase() });
    } else {
      const nameRegex = new RegExp('^' + escapeRegExp(provided) + '$', 'i');
      // search common fields: name, username (if present), or email (case-insensitive)
      user = await User.findOne({ $or: [{ name: nameRegex }, { username: nameRegex }, { email: new RegExp('^' + escapeRegExp(provided) + '$', 'i') }] });
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role, capabilities: user.capabilities } });
  })
);

// verify token / current user
router.get('/me', authMiddleware, wrap(async (req, res) => {
  // req.user is set by authMiddleware (password omitted)
  const u = req.user
  const userObj = { id: u._id, name: u.name, username: u.username, email: u.email, role: u.role, capabilities: u.capabilities }
  return res.json({ user: userObj });
}));

module.exports = router;
