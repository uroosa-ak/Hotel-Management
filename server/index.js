// server/index.js

// Imports
const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./config/db');
const session = require('express-session');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
ConnectDB();

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'hotel-secret',
    resave: false,
    saveUninitialized: false
  })
);

// Routes
app.use('/api/user', require('./Routes/UserRoutes'));
app.use('/api/service', require('./Routes/ServiceRoutes'));
app.use('/api/booking', require('./Routes/BookingRoutes'));
app.use('/api/rooms', require('./Routes/RoomsRoutes'));
app.use('/api/guest', require('./Routes/GuestRoutes'));
app.use('/api/payment', require('./Routes/PaymentRoutes'));
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
app.use('/api/auth', require('./Routes/AuthRoutes'));

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));