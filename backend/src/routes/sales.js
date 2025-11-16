const express = require('express');
const Item = require('../models/Item');
const Sale = require('../models/Sale');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create a sale — atomic-ish stock decrement with compensation on failure
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items: incomingItems = [], customer, paymentMethod } = req.body;
    if (!Array.isArray(incomingItems) || incomingItems.length === 0) return res.status(400).json({ message: 'No items provided' });

    const updatedItems = [];
    let total = 0;

    // For each requested item, fetch price and attempt to decrement stock atomically
    for (const it of incomingItems) {
      const itemId = it.itemId || it.item;
      const qty = parseInt(it.qty, 10) || 0;
      if (!itemId || qty <= 0) {
        // rollback any previous updates
        for (const ui of updatedItems) await Item.findByIdAndUpdate(ui.item, { $inc: { stock: ui.qty } });
        return res.status(400).json({ message: 'Invalid item or quantity' });
      }

      // fetch item to get price and ensure exists
      const itemDoc = await Item.findById(itemId).lean();
      if (!itemDoc) {
        for (const ui of updatedItems) await Item.findByIdAndUpdate(ui.item, { $inc: { stock: ui.qty } });
        return res.status(404).json({ message: `Item not found: ${itemId}` });
      }

      // attempt atomic decrement only if enough stock
      const updated = await Item.findOneAndUpdate({ _id: itemId, stock: { $gte: qty } }, { $inc: { stock: -qty } }, { new: true });
      if (!updated) {
        // rollback previous
        for (const ui of updatedItems) await Item.findByIdAndUpdate(ui.item, { $inc: { stock: ui.qty } });
        return res.status(400).json({ message: `Insufficient stock for item ${itemDoc.name}` });
      }

      updatedItems.push({ item: itemId, qty });
      total += (itemDoc.price || 0) * qty;
    }

    // build sale items snapshot
    const saleItems = [];
    for (const ui of updatedItems) {
      const doc = await Item.findById(ui.item).lean();
      saleItems.push({ item: ui.item, name: doc.name, qty: ui.qty, price: doc.price || 0 });
    }

    const sale = await Sale.create({ items: saleItems, total, customer, paymentMethod, createdBy: req.user ? req.user._id : undefined });
    return res.status(201).json(sale);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/sales - list with pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
    const filter = {};
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }
    const total = await Sale.countDocuments(filter);
    const sales = await Sale.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    return res.json({ data: sales, meta: { total, page, limit } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/sales/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).lean();
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    return res.json(sale);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
