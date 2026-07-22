const express = require("express");
const router = express.Router();

const checkInOutController = require("../Controller/CheckInOutController");

router.post("/", checkInOutController.createCheckInOut);
router.get("/", checkInOutController.getAllCheckInOuts);
router.get("/:id", checkInOutController.getCheckInOutById);
router.put("/:id", checkInOutController.updateCheckInOut);
router.delete("/:id", checkInOutController.deleteCheckInOut);

module.exports = router;