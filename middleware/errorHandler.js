function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  console.error(
    `[ERROR] ${status} ${req.method} ${req.originalUrl} - ${err.message}`
  );
  if (status === 500 && err.stack) {
    console.error(err.stack);
  }

  const payload = {
    error: {
      status,
      message: status === 500 ? "Internal Server Error" : err.message
    }
  };

  if (err.details) {
    payload.error.details = err.details;
  }

  res.status(status).json(payload);
}

module.exports = errorHandler;