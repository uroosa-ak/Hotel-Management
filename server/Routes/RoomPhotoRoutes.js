const express = require("express");
const router = express.Router();
const roomPhotoController = require("../Controller/RoomPhotoController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Photos are public (shown on room listing/detail pages); only staff manage them.
router.get("/", roomPhotoController.getAllPhotos);
router.post("/", authMiddleware, authorizeRoles("admin", "manager"), roomPhotoController.addPhoto);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "manager"), roomPhotoController.deletePhoto);

module.exports = router;
