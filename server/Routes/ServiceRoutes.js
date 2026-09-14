const express = require("express");
const router = express.Router();
const serviceController = require("../Controller/ServiceController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Any authenticated guest can request a service; only staff manage/close them.
router.post("/", authMiddleware, serviceController.createService);
router.get("/", authMiddleware, authorizeRoles("admin", "manager", "receptionist", "housekeeping"), serviceController.getServices);
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager", "receptionist", "housekeeping"), serviceController.updateService);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "manager"), serviceController.deleteService);

module.exports = router;
