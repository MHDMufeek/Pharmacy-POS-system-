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

// GET /api/reports/overview?lowStock=10&months=1
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const lowStock = parseInt(req.query.lowStock, 10) || 10;
    const months = parseInt(req.query.months, 10) || 1; // last N months (default 1)

    // total items
    const totalItems = await Item.countDocuments();

    // low stock items (list top 10)
    const lowStockItems = await Item.find({ stock: { $lte: lowStock } })
      .select('name sku stock')
      .sort({ stock: 1 })
      .limit(10)
      .lean();

    // monthly sales (sum of totals in last `months` months)
    // Use a simple 30-day window per month to avoid month boundary issues
    const since = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000);
    const Sale = require('../models/Sale');
    const salesAgg = await Sale.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: null, totalSales: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);
    const monthlySales = salesAgg[0] ? salesAgg[0].totalSales : 0;
    const salesCount = salesAgg[0] ? salesAgg[0].count : 0;

    // active users = distinct users who created sales in last `months` months
    const activeUsersAgg = await Sale.aggregate([
      { $match: { createdAt: { $gte: since }, createdBy: { $exists: true } } },
      { $group: { _id: '$createdBy' } },
      { $count: 'activeUsers' }
    ]);
    const activeUsers = activeUsersAgg[0] ? activeUsersAgg[0].activeUsers : 0;

    return res.json({
      totalItems,
      lowStockThreshold: lowStock,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      monthlySales,
      salesCount,
      activeUsers
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
