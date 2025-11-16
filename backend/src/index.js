const mongoose = require('mongoose');
const config = require('./config');
const createApp = require('./app');
const seedAdmin = require('./utils/seedAdmin');

async function start() {
  await mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const app = createApp();
  const port = config.PORT || 3000;
  app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await seedAdmin();
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
