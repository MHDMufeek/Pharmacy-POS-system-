const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const capabilityRoutes = require('./routes/capabilities');
const usersRoutes = require('./routes/users');
const itemsRoutes = require('./routes/items');
const salesRoutes = require('./routes/sales');
const customerReturnsRoutes = require('./routes/customerReturns');
const reportsRoutes = require('./routes/reports');
const notificationsRoutes = require('./routes/notifications');
const suppliersRoutes = require('./routes/suppliers');
const invoicesRoutes = require('./routes/invoices');
const expensesRoutes = require('./routes/expenses');
const creditorsRoutes = require('./routes/creditors');
const stockHistoryRoutes = require('./routes/stockHistories');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(morgan('dev'));

  app.use('/api/auth', authRoutes);
  app.use('/api/capabilities', capabilityRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/items', itemsRoutes);
  app.use('/api/sales', salesRoutes);
  app.use('/api/customer-returns', customerReturnsRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/suppliers', suppliersRoutes);
  app.use('/api/invoices', invoicesRoutes);
  app.use('/api/creditors', creditorsRoutes);
  app.use('/api/expenses', expensesRoutes);
  app.use('/api', stockHistoryRoutes);

  app.get('/health', (req, res) => res.json({ ok: true }));

  // centralized error handler (must be after routes)
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
