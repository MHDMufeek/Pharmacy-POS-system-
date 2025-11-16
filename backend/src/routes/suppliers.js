const express = require('express');
const Supplier = require('../models/Supplier');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/suppliers - paginated
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
    const q = req.query.q ? req.query.q.trim() : null;
    const filter = {};
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: re }, { contactName: re }, { email: re }];
    }
    const total = await Supplier.countDocuments(filter);
    const suppliers = await Supplier.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean();
    return res.json({ data: suppliers, meta: { total, page, limit } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/suppliers/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const s = await Supplier.findById(req.params.id).lean();
    if (!s) return res.status(404).json({ message: 'Supplier not found' });
    return res.json(s);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/suppliers
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, contactName, email, phone, address, notes } = req.body;
    if (!name) return res.status(400).json({ message: 'Missing supplier name' });
    const supplier = await Supplier.create({ name, contactName, email, phone, address, notes });
    return res.status(201).json(supplier);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/suppliers/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const s = await Supplier.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ message: 'Supplier not found' });
    return res.json(s);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/suppliers/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const s = await Supplier.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: 'Supplier not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
