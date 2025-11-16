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
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  wrap(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    return res.status(201).json({ id: user._id, name: user.name, email: user.email });
  })
);

// login
router.post(
  '/login',
  [body('password').notEmpty()],
  wrap(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    // Accept either email or username (frontend sends the value in `email` currently)
    const provided = req.body.email || req.body.username || req.body.identifier;
    const password = req.body.password;
    if (!provided || !password) return res.status(400).json({ message: 'Validation failed', errors: [{ msg: 'Missing identifier or password' }] });

    // determine whether identifier looks like an email
    let user;
    if (String(provided).includes('@')) {
      user = await User.findOne({ email: String(provided).toLowerCase() });
    } else {
      // perform case-insensitive name lookup to avoid failing when users type different case
      // escape RegExp special chars to avoid injection
      const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const nameRegex = new RegExp('^' + escapeRegExp(String(provided)) + '$', 'i');
      user = await User.findOne({ name: nameRegex });
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, capabilities: user.capabilities } });
  })
);

module.exports = router;

// verify token / current user
router.get('/me', authMiddleware, wrap(async (req, res) => {
  // req.user is set by authMiddleware (password omitted)
  return res.json({ user: req.user });
}));
