const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, index: true },
    description: { type: String },
    category: { type: String },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, required: true, default: 0 },
    cost: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);
