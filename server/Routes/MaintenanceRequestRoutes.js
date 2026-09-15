const express = require("express");
const router = express.Router();
const maintenanceController = require("../Controller/MaintenanceRequestController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Guests and staff can both report issues; only staff manage/resolve them.
router.post("/", authMiddleware, maintenanceController.createRequest);
router.get("/", authMiddleware, authorizeRoles("admin", "manager", "housekeeping"), maintenanceController.getAllRequests);
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager", "housekeeping"), maintenanceController.updateRequest);
router.patch("/:id/assign", authMiddleware, authorizeRoles("admin", "manager", "housekeeping"), maintenanceController.assignRequest);
router.patch("/:id/resolve", authMiddleware, authorizeRoles("admin", "manager", "housekeeping"), maintenanceController.resolveRequest);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "manager"), maintenanceController.deleteRequest);

module.exports = router;
