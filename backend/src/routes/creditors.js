const express = require('express');
const Creditor = require('../models/Creditor');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/creditors
router.get('/', authMiddleware, async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : null;
    const filter = {};
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: re }, { contact: re }, { email: re }];
    }
    const creditors = await Creditor.find(filter).sort({ name: 1 }).lean();
    return res.json({ data: creditors });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/creditors/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const c = await Creditor.findById(req.params.id).lean();
    if (!c) return res.status(404).json({ message: 'Creditor not found' });
    return res.json(c);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/creditors
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.name) return res.status(400).json({ message: 'Missing creditor name' });
    const created = await Creditor.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/creditors/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const c = await Creditor.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!c) return res.status(404).json({ message: 'Creditor not found' });
    return res.json(c);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/creditors/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const c = await Creditor.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ message: 'Creditor not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
