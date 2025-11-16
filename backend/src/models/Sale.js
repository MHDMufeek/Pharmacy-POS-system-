const mongoose = require('mongoose');

const SaleItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
});

const SaleSchema = new mongoose.Schema(
  {
    items: { type: [SaleItemSchema], required: true },
    total: { type: Number, required: true },
    customer: { type: String },
    paymentMethod: { type: String, default: 'cash' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', SaleSchema);
