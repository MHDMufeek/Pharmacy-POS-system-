const express = require('express');
const router = express.Router();
const StockHistory = require('../models/StockHistory');
const { authMiddleware } = require('../middleware/auth');

// POST /api/items/:id/history - create history entry for an item
router.post('/items/:id/history', authMiddleware, async (req, res) => {
  try {
    const itemId = req.params.id;
    const { type, quantity, date, expiryDate, expiryAlertDate, performedBy, note } = req.body;
    const entry = new StockHistory({
      itemId,
      type: (type || 'add'),
      quantity: Number(quantity) || 0,
      date: date || new Date().toISOString().slice(0,10),
      expiryDate: expiryDate || null,
      expiryAlertDate: expiryAlertDate || null,
      performedBy: performedBy || null,
      note: note || null
    });
    await entry.save();
    return res.json(entry);
  } catch (err) {
    console.error('Failed to save stock history', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
});

// GET /api/items/:id/history - list history for item
router.get('/items/:id/history', authMiddleware, async (req, res) => {
  try {
    const itemId = req.params.id;
    const entries = await StockHistory.find({ itemId }).sort({ date: -1, createdAt: -1 }).lean();
    return res.json(entries);
  } catch (err) {
    console.error('Failed to fetch stock history', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
