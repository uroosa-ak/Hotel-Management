const express = require("express");
const router = express.Router();
const roomPhotoController = require("../Controller/RoomPhotoController");

router.post("/", roomPhotoController.addPhoto);
router.get("/", roomPhotoController.getAllPhotos);
router.delete("/:id", roomPhotoController.deletePhoto);

module.exports = router;