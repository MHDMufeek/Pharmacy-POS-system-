const mongoose = require('mongoose');

const StockHistorySchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
  type: { type: String, required: true }, // add, subtract, set, restocked
  quantity: { type: Number, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  expiryDate: { type: String },
  expiryAlertDate: { type: String },
  performedBy: { type: String },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('StockHistory', StockHistorySchema);
