const express = require("express");
const router = express.Router();

const checkInOutController = require("../Controller/CheckInOutController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("admin", "manager", "receptionist"));

// Create Check In / Out
router.post("/", checkInOutController.createCheckInOut);

// Get All
router.get("/", checkInOutController.getAllCheckInOuts);

// Search by date
router.get("/search/date", checkInOutController.getByDate);

// Active check-ins
router.get("/active/list", checkInOutController.getActiveCheckIns);

// Get by Guest
router.get("/guest/:guestId", checkInOutController.getByGuest);

// Get by Booking
router.get("/booking/:bookingId", checkInOutController.getByBooking);
// Get single record
router.get("/:id", checkInOutController.getCheckInOutById);

// Update
router.put("/:id", checkInOutController.updateCheckInOut);

// Checkout guest
router.put("/:id/checkout", checkInOutController.checkOutGuest);

// Delete
router.delete("/:id", authorizeRoles("admin", "manager"), checkInOutController.deleteCheckInOut);

module.exports = router;
