const mongoose = require('mongoose');
const config = require('../src/config');
const User = require('../src/models/User');
const Item = require('../src/models/Item');
const CustomerReturn = require('../src/models/CustomerReturn');

async function clear() {
  console.log('Using MONGO_URI:', config.MONGO_URI);

  // safety: refuse to run against non-local DB unless FORCE=true
  const uri = String(config.MONGO_URI || '');
  if (!uri.includes('localhost') && !uri.includes('127.0.0.1') && !process.env.FORCE) {
    console.error('Refusing to run: MONGO_URI does not look local. Set FORCE=true to override.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // remove seeded admin user
    const userRes = await User.deleteOne({ email: 'admin@local' });
    console.log('Deleted admin@local:', userRes.deletedCount || 0);

    // remove sample items with sku MED-
    const itemsRes = await Item.deleteMany({ sku: { $regex: '^MED-' } });
    console.log('Deleted sample items count:', itemsRes.deletedCount || 0);

    // remove seeded customer returns (saleRef SEED- or customer Seed Customer)
    const crRes = await CustomerReturn.deleteMany({ $or: [{ saleRef: { $regex: '^SEED' } }, { customer: 'Seed Customer' }] });
    console.log('Deleted sample customer returns count:', crRes.deletedCount || 0);

    await mongoose.connection.close();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Failed to clear sample data', err);
    process.exit(1);
  }
}

clear();
