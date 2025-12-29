const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { checkLowStock } = require('../utils/lowStockNotifier');
const { checkExpiryAlerts } = require('../utils/expiryNotifier');

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

// GET /api/notifications/alerts?lowStock=10&limit=20
// returns both low-stock and expiry-alert items
router.get('/alerts', authMiddleware, async (req, res) => {
  try {
    const lowStock = parseInt(req.query.lowStock, 10) || 10;
    const limit = parseInt(req.query.limit, 10) || 50;

    const low = await checkLowStock({ lowStock, limit, sendNotifications: false });
    const expiry = await checkExpiryAlerts({ limit });

    // Mark types so frontend can render differently
    const items = [];
    (low.items || []).forEach(i => items.push(Object.assign({}, i, { _type: 'low-stock' })));
    (expiry.items || []).forEach(i => items.push(Object.assign({}, i, { _type: 'expiry-alert' })));

    return res.json({ count: items.length, items });
  } catch (err) {
    console.error('Notifications alerts failed', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
