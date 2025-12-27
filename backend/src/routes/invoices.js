const express = require('express');
const Invoice = require('../models/Invoice');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/invoices - list with pagination and optional filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, parseInt(req.query.limit, 10) || 100);
    const filter = {};

    if (req.query.supplier) filter.supplierId = req.query.supplier;
    if (req.query.status) filter.status = req.query.status;

    if (req.query.startDate) {
      const start = new Date(req.query.startDate);
      filter.date = Object.assign(filter.date || {}, { $gte: start });
    }
    if (req.query.endDate) {
      const end = new Date(req.query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.date = Object.assign(filter.date || {}, { $lte: end });
    }

    if (req.query.q) {
      const q = req.query.q.trim();
      const re = new RegExp(q.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ supplierName: re }, { 'items.description': re }];
    }

    const total = await Invoice.countDocuments(filter);
    const items = await Invoice.find(filter)
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

// GET /api/invoices/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id).lean();
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });
    return res.json(inv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/invoices - create
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { supplierId, supplierName, date, dueDate, status, items = [], subtotal = 0, tax = 0, discount = 0, totalAmount = 0, notes } = req.body;
    if (!supplierId || !date) return res.status(400).json({ message: 'Missing required fields (supplierId, date)' });

    const invoice = new Invoice({
      supplierId,
      supplierName,
      date: new Date(date),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: status || 'pending',
      items,
      subtotal: Number(subtotal || 0),
      tax: Number(tax || 0),
      discount: Number(discount || 0),
      totalAmount: Number(totalAmount || 0),
      notes,
      createdBy: req.user ? req.user._id : undefined
    });

    await invoice.save();
    return res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/invoices/:id - update
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.date) updates.date = new Date(updates.date);
    if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
    if (updates.subtotal != null) updates.subtotal = Number(updates.subtotal);
    if (updates.tax != null) updates.tax = Number(updates.tax);
    if (updates.discount != null) updates.discount = Number(updates.discount);
    if (updates.totalAmount != null) updates.totalAmount = Number(updates.totalAmount);

    const inv = await Invoice.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });
    return res.json(inv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/invoices/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const inv = await Invoice.findByIdAndDelete(req.params.id);
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
