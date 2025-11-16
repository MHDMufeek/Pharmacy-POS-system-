const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = async function seedAdmin() {
  try {
    const existing = await User.findOne({ email: 'admin@local' });
    if (existing) {
      console.log('Admin user already exists');
      return;
    }
    const hashed = await bcrypt.hash('Admin123!', 10);
    const admin = new User({ name: 'Administrator', email: 'admin@local', password: hashed, role: 'admin', capabilities: ['manage_users', 'manage_items'] });
    await admin.save();
    console.log('Seeded admin user: admin@local / Admin123!');
  } catch (err) {
    console.error('Failed to seed admin', err);
  }
};
