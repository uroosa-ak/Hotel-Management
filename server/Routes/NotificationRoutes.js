const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/NotificationController");

router.post("/", notificationController.createNotification);
router.get("/", notificationController.getNotifications);
router.put("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;