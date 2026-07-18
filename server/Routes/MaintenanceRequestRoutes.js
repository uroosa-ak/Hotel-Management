const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/MaintenanceRequestController");

router.post("/", maintenanceController.createRequest);
router.get("/", maintenanceController.getAllRequests);
router.put("/:id", maintenanceController.updateRequest);
router.delete("/:id", maintenanceController.deleteRequest);

module.exports = router;