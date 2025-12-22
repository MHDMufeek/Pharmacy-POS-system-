const express = require('express');
const Item = require('../models/Item');
const CustomerReturn = require('../models/CustomerReturn');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create a customer return — restock items and record refund
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items: incomingItems = [], customer, saleRef, refundMethod, notes } = req.body;
    if (!Array.isArray(incomingItems) || incomingItems.length === 0) return res.status(400).json({ message: 'No items provided' });

    const updatedItems = [];
    let totalRefund = 0;

    for (const it of incomingItems) {
      const itemId = it.itemId || it.item;
      const qty = parseInt(it.qty, 10) || 0;
      if (!itemId || qty <= 0) {
        for (const ui of updatedItems) await Item.findByIdAndUpdate(ui.item, { $inc: { stock: -ui.qty } });
        return res.status(400).json({ message: 'Invalid item or quantity' });
      }

      const itemDoc = await Item.findById(itemId).lean();
      if (!itemDoc) {
        for (const ui of updatedItems) await Item.findByIdAndUpdate(ui.item, { $inc: { stock: -ui.qty } });
        return res.status(404).json({ message: `Item not found: ${itemId}` });
      }

      // restock
      await Item.findByIdAndUpdate(itemId, { $inc: { stock: qty } });

      updatedItems.push({ item: itemId, qty });
      totalRefund += (itemDoc.price || 0) * qty;
    }

    const returnItems = [];
    for (const ui of updatedItems) {
      const doc = await Item.findById(ui.item).lean();
      const reason = (incomingItems.find(x => (x.itemId||x.item).toString() === ui.item.toString()) || {}).reason;
      returnItems.push({ item: ui.item, name: doc.name, qty: ui.qty, price: doc.price || 0, reason });
    }

    const customerReturn = await CustomerReturn.create({
      saleRef,
      items: returnItems,
      totalRefund,
      customer,
      refundMethod,
      notes,
      createdBy: req.user ? req.user._id : undefined,
      status: 'Completed'
    });

    return res.status(201).json(customerReturn);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// list
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
    const total = await CustomerReturn.countDocuments(filter);
    const data = await CustomerReturn.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    return res.json({ data, meta: { total, page, limit } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// get by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const cr = await CustomerReturn.findById(req.params.id).lean();
    if (!cr) return res.status(404).json({ message: 'Return not found' });
    return res.json(cr);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
