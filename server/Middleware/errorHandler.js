// Centralized Express error handler. Controllers largely catch their own
// errors and respond directly, but this is the safety net for anything
// that throws synchronously, calls next(err), or bubbles up unexpectedly
// (bad JSON body, uncaught DB errors, etc.).
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'Origin not allowed' });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Internal server error' : err.message
  });
};

module.exports = errorHandler;
