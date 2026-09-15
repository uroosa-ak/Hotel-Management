// server/index.js

// Imports
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ConnectDB = require('./config/db');
const cookieparser = require('cookie-parser');
const errorHandler = require('./Middleware/errorHandler');

dotenv.config();

// Fail fast if required secrets are missing instead of silently falling back
// to an insecure default.
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI', 'DBURI'];
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in the environment. Refusing to start.');
  process.exit(1);
}
if (!process.env.MONGO_URI && !process.env.DBURI) {
  console.error('FATAL: MONGO_URI/DBURI is not set in the environment. Refusing to start.');
  process.exit(1);
}

ConnectDB();

const app = express();

app.set('trust proxy', 1);

// CORS: allow configured client origin(s) and any local dev server port.
const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || configuredOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

// Rate limit auth endpoints to slow down credential-stuffing/brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' }
});
app.use('/api/auth', authLimiter);
app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);

// Routes
app.use('/api/user', require('./Routes/UserRoutes'));
app.use('/api/service', require('./Routes/ServiceRoutes'));
app.use('/api/booking', require('./Routes/BookingRoutes'));
app.use('/api/rooms', require('./Routes/RoomsRoutes'));
app.use('/api/guest', require('./Routes/guestRoutes'));
app.use('/api/payment', require('./Routes/paymentRoutes'));
app.use('/api/checkinout', require('./Routes/CheckInOutRoutes'));
app.use('/api/roles', require('./Routes/RoleRoutes'));
app.use('/api/promotions', require('./Routes/PromotionRoutes'));
app.use('/api/loyalty', require('./Routes/LoyaltyProgramRoutes'));
app.use('/api/roomphotos', require('./Routes/RoomPhotoRoutes'));
app.use('/api/taxes', require('./Routes/TaxConfigurationRoutes'));
app.use('/api/paymentaudit', require('./Routes/PaymentAuditRoutes'));
app.use('/api/maintenance', require('./Routes/MaintenanceRequestRoutes'));
app.use('/api/eventbookings', require('./Routes/EventBookingRoutes'));
app.use('/api/notifications', require('./Routes/NotificationRoutes'));
app.use('/api/inventory', require('./Routes/InventoryRoutes'));
app.use('/api/feedback', require('./Routes/FeedbackRoutes'));
app.use('/api/reports', require('./Routes/ReportRoutes'));
app.use('/api/settings', require('./Routes/SettingsRoutes'));
app.use('/api/audit-logs', require('./Routes/AuditLogRoutes'));
app.use('/api/security', require('./Routes/SecurityRoutes'));
app.use('/api/servicerequests', require('./Routes/ServiceRequestRoutes'));
app.use('/api/contact', require('./Routes/ContactRoutes'));
app.use('/api/auth', require('./Routes/AuthRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is operational' });
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Central error handler (must be last)
app.use(errorHandler);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
