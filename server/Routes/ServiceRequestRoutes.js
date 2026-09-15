const express = require("express");
const router = express.Router();
const serviceRequestController = require("../Controller/ServiceRequestController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware);

router.post("/", serviceRequestController.createRequest);
router.get("/mine", serviceRequestController.getMyRequests);
router.get("/", authorizeRoles("admin", "manager", "receptionist", "housekeeping"), serviceRequestController.getAllRequests);
router.patch("/:id/status", authorizeRoles("admin", "manager", "receptionist", "housekeeping"), serviceRequestController.updateStatus);

module.exports = router;
