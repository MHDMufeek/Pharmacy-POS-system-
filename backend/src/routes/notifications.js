const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { checkLowStock } = require('../utils/lowStockNotifier');

const router = express.Router();

// GET /api/notifications/low-stock?lowStock=10&limit=20&notify=true
router.get('/low-stock', authMiddleware, async (req, res) => {
  try {
    const lowStock = parseInt(req.query.lowStock, 10) || 10;
    const limit = parseInt(req.query.limit, 10) || 50;
    const notify = req.query.notify === 'true' || req.query.notify === '1';

    const result = await checkLowStock({ lowStock, limit, sendNotifications: notify });

    return res.json({
      lowStockThreshold: lowStock,
      count: result.count,
      items: result.items,
      notified: result.notified
    });
  } catch (err) {
    console.error('Low stock notifications failed', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
