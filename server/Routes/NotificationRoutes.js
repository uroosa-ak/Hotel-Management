const express = require("express");
const router = express.Router();
const notificationController = require("../Controller/NotificationController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware);

router.post("/", authorizeRoles("admin", "manager"), notificationController.createNotification);
// Non-staff only ever see their own notifications (enforced in the controller).
router.get("/", notificationController.getNotifications);
router.put("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
