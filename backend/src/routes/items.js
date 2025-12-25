const express = require('express');
const Item = require('../models/Item');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/items - list with pagination and optional search
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
    const q = req.query.q ? req.query.q.trim() : null;
    const filter = {};
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: re }, { sku: re }, { category: re }];
    }
    const total = await Item.countDocuments(filter);
    const items = await Item.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return res.json({ data: items, meta: { total, page, limit } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/items/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Item not found' });
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/items - create
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, sku, code, description, genericName, category, price, cost, stock, supplier, metadata, image } = req.body;
    if (!name || price == null) return res.status(400).json({ message: 'Missing required fields (name, price)' });
    // accept either `sku` or `code` from client
    const finalSku = sku || code || undefined;
    const itemData = { name, sku: finalSku, description, genericName, category, price, cost: cost || 0, stock: stock || 0, supplier, metadata };
    if (image) itemData.image = image;
    // If no SKU supplied, generate a sequential one
    if (!itemData.sku) {
      // find matching SKUs like MED-0001 and compute max
      const rows = await Item.find({ sku: { $regex: '^MED-\\d+$' } }).select('sku').lean();
      let max = 0;
      for (const r of rows) {
        const m = r.sku && r.sku.match(/^MED-(\d+)$/);
        if (m) {
          const n = parseInt(m[1], 10);
          if (!isNaN(n) && n > max) max = n;
        }
      }
      const next = max + 1;
      itemData.sku = `MED-${String(next).padStart(4, '0')}`;
    }
    const item = new Item(itemData);
    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/items/next-code - return next sequential SKU
router.get('/next-code', authMiddleware, async (req, res) => {
  try {
    const rows = await Item.find({ sku: { $regex: '^MED-\\d+$' } }).select('sku').lean();
    let max = 0;
    for (const r of rows) {
      const m = r.sku && r.sku.match(/^MED-(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!isNaN(n) && n > max) max = n;
      }
    }
    const next = max + 1;
    const code = `MED-${String(next).padStart(4, '0')}`;
    return res.json({ code });
  } catch (err) {
    console.error('Failed to compute next code', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/items/:id - update
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const item = await Item.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/items/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
