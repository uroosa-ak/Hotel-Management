const express = require("express");
const router = express.Router();
const roomController = require("../Controller/RoomController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Browsing rooms is public; managing inventory is admin/manager only.
router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomById);
router.post("/", authMiddleware, authorizeRoles("admin", "manager"), roomController.createRoom);
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager", "housekeeping"), roomController.updateRoom);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "manager"), roomController.deleteRoom);

module.exports = router;
