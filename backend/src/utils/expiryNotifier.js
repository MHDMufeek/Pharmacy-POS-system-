const Item = require('../models/Item');

/**
 * Find items that have an expiry alert date on or before today (or a provided date).
 * @param {Object} opts
 * @param {Date|string} opts.before - date to compare alert against (inclusive). Defaults to today.
 * @param {number} opts.limit - max items to return
 * @returns {Promise<{items: Array, count: number}>}
 */
async function checkExpiryAlerts({ before = null, limit = 50 } = {}) {
  const max = Number(limit) || 50;
  const compareDate = before ? new Date(before) : new Date();
  // normalize to start of day for inclusive comparison
  compareDate.setHours(23, 59, 59, 999);

  // metadata.expiryAlertDate may be stored as ISO date string (YYYY-MM-DD) or full Date
  // We'll filter in-memory after fetching a reasonable set, since Mongo querying nested string dates
  // can be fragile depending on storage format. Limit the candidate set to items that have metadata.expiryAlertDate.
  const candidates = await Item.find({ 'metadata.expiryAlertDate': { $exists: true } })
    .select('name sku stock category metadata')
    .limit(500)
    .lean();

  const items = [];
  for (const it of candidates) {
    const alertVal = it.metadata && it.metadata.expiryAlertDate;
    if (!alertVal) continue;
    const d = new Date(alertVal);
    if (isNaN(d.getTime())) continue;
    if (d <= compareDate) {
      items.push({
        _id: it._id,
        id: it._id,
        name: it.name,
        sku: it.sku,
        stock: it.stock,
        category: it.category,
        expiryDate: it.metadata && it.metadata.expiryDate,
        expiryAlertDate: alertVal
      });
      if (items.length >= max) break;
    }
  }

  return { items, count: items.length };
}

module.exports = { checkExpiryAlerts };
