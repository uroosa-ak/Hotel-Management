const express = require("express");
const router = express.Router();
const guestController = require("../Controller/GuestController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Guest CRM records are staff-facing (created as a side effect of bookings).
router.use(authMiddleware, authorizeRoles("admin", "manager", "receptionist"));

router.post("/", guestController.createGuest);
router.get("/", guestController.getGuests);
router.put("/:id", guestController.updateGuest);
router.delete("/:id", authorizeRoles("admin", "manager"), guestController.deleteGuest);

module.exports = router;
