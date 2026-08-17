const express = require("express");
const routes = express.Router();

const bookingController = require("../Controller/BookingController");

// Create new booking
routes.post("/", bookingController.createBooking);

// Get all bookings
routes.get("/", bookingController.getAllBookings);

// Get booking by ID
routes.get("/:id", bookingController.getBookingById);

// Update booking
routes.put("/:id", bookingController.updateBooking);

// Delete booking
routes.delete("/:id", bookingController.deleteBooking);


// Booking status APIs
routes.patch("/:id/status", bookingController.updateBookingStatus);


// User specific bookings
routes.get("/user/:userId", bookingController.getUserBookings);


// Cancel booking
routes.patch("/:id/cancel", bookingController.cancelBooking);


module.exports = routes;