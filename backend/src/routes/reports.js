const express = require('express');
const Item = require('../models/Item');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports/inventory-summary?lowStock=10
router.get('/inventory-summary', authMiddleware, async (req, res) => {
  try {
    const lowStock = parseInt(req.query.lowStock, 10) || 10;
    const items = await Item.find({}).select('name sku stock price').lean();
    const totalItems = items.length;
    const low = items.filter((i) => i.stock <= lowStock);
    return res.json({ totalItems, lowStockThreshold: lowStock, lowStock: low, itemsCount: totalItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
