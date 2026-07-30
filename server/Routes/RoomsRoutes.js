const express = require("express");
const router = express.Router();
const roomController = require("../Controller/RoomController");

router.post("/create", roomController.createRoom);
router.get("/all", roomController.getRooms);
router.put("/update/:id", roomController.updateRoom);
router.delete("/delete/:id", roomController.deleteRoom);

module.exports = router;