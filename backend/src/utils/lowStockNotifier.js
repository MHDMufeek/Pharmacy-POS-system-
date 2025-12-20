const Item = require('../models/Item');

/**
 * Check for low stock items and optionally send notifications.
 * @param {Object} opts
 * @param {number} opts.lowStock - threshold (inclusive)
 * @param {number} opts.limit - max items to return
 * @param {boolean} opts.sendNotifications - whether to 'send' notifications (currently logs)
 * @returns {Promise<{items: Array, count: number, notified: number}>}
 */
async function checkLowStock({ lowStock = 10, limit = 50, sendNotifications = false } = {}) {
  const threshold = Number(lowStock) || 10;
  const max = Number(limit) || 50;

  const items = await Item.find({ stock: { $lte: threshold } })
    .select('name sku stock price category')
    .sort({ stock: 1 })
    .limit(max)
    .lean();

  let notified = 0;
    if (sendNotifications && items.length) {
    // TODO: wire a real notification system (email, websocket, push)
    for (const it of items) {
      // simple console notification for now (include category)
      console.log(`LOW STOCK ALERT: Item "${it.name}" (Category: ${it.category || 'N/A'}) (SKU: ${it.sku || 'N/A'}) has stock=${it.stock}`);
      notified++;
    }
  }

  return { items, count: items.length, notified };
}

module.exports = { checkLowStock };
