const express = require('express');
const Expense = require('../models/Expense');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/expenses - list with pagination and optional search / filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, parseInt(req.query.limit, 10) || 100);
    const q = req.query.q ? req.query.q.trim() : null;
    const filter = {};

    // search
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: re }, { category: re }, { description: re }];
    }

    // category filter
    if (req.query.category) filter.category = req.query.category;

    // date range
    if (req.query.startDate) {
      const start = new Date(req.query.startDate);
      filter.date = Object.assign(filter.date || {}, { $gte: start });
    }

    if (req.query.endDate) {
      const end = new Date(req.query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.date = Object.assign(filter.date || {}, { $lte: end });
    }

    const total = await Expense.countDocuments(filter);
    const items = await Expense.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({ data: items, meta: { total, page, limit } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/expenses/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const exp = await Expense.findById(req.params.id).lean();
    if (!exp) return res.status(404).json({ message: 'Expense not found' });
    return res.json(exp);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/expenses - create
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, category, amount, date, description } = req.body;
    if (!name || amount == null || !date) return res.status(400).json({ message: 'Missing required fields (name, amount, date)' });

    const expense = new Expense({
      name,
      category,
      amount: parseFloat(amount),
      date: new Date(date),
      description,
      createdBy: req.user ? req.user._id : undefined
    });

    await expense.save();
    return res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/expenses/:id - update
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.amount != null) updates.amount = parseFloat(updates.amount);
    if (updates.date) updates.date = new Date(updates.date);

    const exp = await Expense.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!exp) return res.status(404).json({ message: 'Expense not found' });
    return res.json(exp);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const exp = await Expense.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Expense not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
