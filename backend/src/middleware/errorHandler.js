function errorHandler(err, req, res, next) {
  // default status
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // log the error server-side (avoid leaking stack to clients in production)
  console.error(err);

  const payload = { error: true, message };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}

module.exports = errorHandler;
