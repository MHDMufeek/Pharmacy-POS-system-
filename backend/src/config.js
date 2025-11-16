const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/pharmacy_pos_dev',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_to_a_strong_secret'
};
