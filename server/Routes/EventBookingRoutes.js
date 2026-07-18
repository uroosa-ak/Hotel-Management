const express = require("express");
const router = express.Router();
const eventController = require("../controllers/EventBookingController");

router.post("/", eventController.createEventBooking);
router.get("/", eventController.getAllEventBookings);
router.put("/:id", eventController.updateEventBooking);
router.delete("/:id", eventController.deleteEventBooking);

module.exports = router;