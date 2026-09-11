const express = require("express");
const routes = express.Router();
const bookingController = require("../Controller/BookingController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Create new booking (guests or staff)
routes.post("/", bookingController.createBooking);

// Get current logged-in user's bookings
routes.get("/my/bookings", authMiddleware, bookingController.getMyBookings);

// Get all bookings (staff only)
routes.get("/", authMiddleware, authorizeRoles("admin", "manager", "receptionist"), bookingController.getAllBookings);

// Get booking by ID
routes.get("/:id", authMiddleware, bookingController.getBookingById);

// Update booking
routes.put("/:id", authMiddleware, authorizeRoles("admin", "manager", "receptionist"), bookingController.updateBooking);

// Delete booking (Admin only)
routes.delete("/:id", authMiddleware, authorizeRoles("admin"), bookingController.deleteBooking);

// Update booking status (Check-in, Check-out, etc.)
routes.patch("/:id/status", authMiddleware, authorizeRoles("admin", "manager", "receptionist"), bookingController.updateBookingStatus);

// Cancel booking
routes.patch("/:id/cancel", authMiddleware, bookingController.cancelBooking);

// User specific bookings
routes.get("/user/:userId", authMiddleware, authorizeRoles("admin", "manager", "receptionist"), bookingController.getUserBookings);

module.exports = routes;