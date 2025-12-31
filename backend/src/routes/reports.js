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

// GET /api/reports/drug-movement?start=YYYY-MM-DD&end=YYYY-MM-DD&lowStock=10
router.get('/drug-movement', authMiddleware, async (req, res) => {
  try {
    const lowStock = parseInt(req.query.lowStock, 10) || 10;
    const start = req.query.start ? new Date(req.query.start) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = req.query.end ? new Date(req.query.end) : new Date();

    const Sale = require('../models/Sale');
    const StockHistory = require('../models/StockHistory');

    // Sales aggregates
    const salesAgg = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, totalSales: { $sum: '$total' }, salesCount: { $sum: 1 } } }
    ]);
    const totalRevenue = salesAgg[0] ? salesAgg[0].totalSales : 0;
    const totalSalesCount = salesAgg[0] ? salesAgg[0].salesCount : 0;

    // Items sold and top selling drugs
    const topSelling = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: '$items' },
      { $group: {
        _id: '$items.item',
        name: { $first: '$items.name' },
        quantity: { $sum: '$items.qty' },
        revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } }
      } },
      { $sort: { quantity: -1 } },
      { $limit: 10 }
    ]);

    const itemsSoldAgg = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: '$items' },
      { $group: { _id: null, totalQty: { $sum: '$items.qty' } } }
    ]);
    const itemsSold = itemsSoldAgg[0] ? itemsSoldAgg[0].totalQty : 0;

    // Inventory status
    const totalItems = await Item.countDocuments();
    const lowStockCount = await Item.countDocuments({ stock: { $lte: lowStock } });
    const outOfStock = await Item.countDocuments({ stock: { $lte: 0 } });

    // Stock history (purchases/adjustments)
    const stockHistMatch = { createdAt: { $gte: start, $lte: end } };
    const stockHistory = await StockHistory.find(stockHistMatch).sort({ createdAt: -1 }).limit(50).lean();

    // Estimate total purchases using item.cost * qty for 'add' type entries
    const itemIds = stockHistory.map((s) => s.itemId).filter(Boolean);
    const itemsMap = {};
    if (itemIds.length) {
      const items = await Item.find({ _id: { $in: itemIds } }).select('cost name stock category').lean();
      items.forEach((it) => { itemsMap[it._id.toString()] = it; });
    }

    let totalPurchases = 0;
    let itemsMovedFromHistory = 0;
    const recentMovements = stockHistory.map((s) => {
      const it = itemsMap[s.itemId?.toString()] || {};
      if (s.type === 'add') totalPurchases += (it.cost || 0) * Math.abs(s.quantity);
      itemsMovedFromHistory += Math.abs(s.quantity || 0);
      return {
        id: s._id,
        drugName: it.name || 'Unknown',
        type: s.type,
        quantity: s.quantity,
        newStock: it.stock || null,
        date: s.date || s.createdAt
      };
    });

    // Build transactions list: itemized sales (as negative qty) and stock history entries
    const transactions = [];
    // Sales -> itemized
    const salesDocs = await Sale.find({ createdAt: { $gte: start, $lte: end } }).select('items total createdAt').lean();
    salesDocs.forEach((sale) => {
      (sale.items || []).forEach((it, idx) => {
        transactions.push({
          id: `${sale._id.toString()}_${idx}`,
          drugName: it.name || 'Unknown',
          type: 'sale',
          quantity: -Math.abs(it.qty || 0),
          amount: (it.price || 0) * (it.qty || 0),
          date: sale.createdAt,
          status: 'completed'
        });
      });
    });

    // Stock history entries
    stockHistory.forEach((s) => {
      const it = itemsMap[s.itemId?.toString()] || {};
      // keep quantity sign as recorded in stock history
      transactions.push({
        id: s._id,
        drugName: it.name || 'Unknown',
        type: s.type,
        quantity: s.quantity,
        amount: 0,
        date: s.date || s.createdAt,
        status: 'completed'
      });
    });

    // Sort transactions by date desc and limit to recent 200
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    const transactionsLimited = transactions.slice(0, 200);

    // Movement activity
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);

    const todaySalesCount = await Sale.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } });
    const todayStockCount = await StockHistory.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } });
    const todayTransactions = todaySalesCount + todayStockCount;

    const movementActivity = {
      todayTransactions,
      itemsMoved: itemsSold + itemsMovedFromHistory,
      avgDailySales: (() => {
        const days = Math.max(1, Math.ceil((end - start) / (24*60*60*1000)));
        return Math.round((itemsSold / days) * 100) / 100;
      })()
    };

    // Top selling drugs - add category if available
    const topSellingDetailed = await Promise.all(topSelling.map(async (t) => {
      const item = await Item.findById(t._id).select('category').lean();
      return { id: t._id, name: t.name, category: item?.category || 'Uncategorized', quantity: t.quantity, revenue: t.revenue };
    }));

    // Category sales
    const categoryAgg = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: '$items' },
      { $lookup: { from: 'items', localField: 'items.item', foreignField: '_id', as: 'itemObj' } },
      { $unwind: { path: '$itemObj', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$itemObj.category', amount: { $sum: { $multiply: ['$items.qty', '$items.price'] } } } },
      { $sort: { amount: -1 } }
    ]);

    const totalSalesAmount = totalRevenue || 0;
    const categorySales = categoryAgg.map((c) => ({ name: c._id || 'Uncategorized', amount: c.amount, percentage: Math.round((c.amount / (totalSalesAmount || 1)) * 100) }));

    // Performance metrics (basic)
    const performanceMetrics = [
      { name: 'Sales Growth', description: 'Compared to previous period', value: 'N/A', trend: 0 },
      { name: 'Inventory Turnover', description: 'Items sold vs stocked', value: `${(itemsSold / Math.max(1, totalItems)).toFixed(2)}x`, trend: 0 },
      { name: 'Avg Daily Sales', description: 'Average items sold per day', value: `${movementActivity.avgDailySales}`, trend: 0 },
      { name: 'Net Revenue', description: 'Total revenue in range', value: `Rs.${totalSalesAmount.toFixed(2)}`, trend: 0 }
    ];

    // Assemble response
    return res.json({
      totalTransactions: totalSalesCount + stockHistory.length,
      itemsSold,
      totalRevenue: totalSalesAmount,
      lowStockItems: lowStockCount,
      topSellingDrugs: topSellingDetailed,
      salesSummary: { totalSales: totalSalesAmount, totalPurchases: totalPurchases, netProfit: totalSalesAmount - totalPurchases },
      inventoryStatus: { totalItems, lowStock: lowStockCount, outOfStock },
      movementActivity,
      stockAlerts: await Item.find({ stock: { $lte: lowStock } }).select('name stock').limit(10).lean(),
      recentMovements,
      transactions: transactionsLimited,
      performanceMetrics,
      categorySales,
      availableReports: [
        { id: 1, title: 'Sales Report', description: 'Detailed sales analysis by product and category', icon: 'point_of_sale', lastGenerated: 'N/A' },
        { id: 2, title: 'Inventory Report', description: 'Current stock levels and movement analysis', icon: 'inventory', lastGenerated: 'N/A' }
      ]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});
