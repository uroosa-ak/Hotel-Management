const express = require("express");
const router = express.Router();
const reportController = require("../Controller/ReportController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("admin", "manager"));

router.get("/occupancy", reportController.getOccupancyReport);
router.get("/revenue", reportController.getRevenueReport);
router.get("/reservations", reportController.getReservationReport);
router.get("/guests", reportController.getGuestReport);
router.get("/staff", reportController.getStaffReport);
router.get("/housekeeping", reportController.getHousekeepingReport);
router.get("/maintenance", reportController.getMaintenanceReport);
router.get("/services", reportController.getServicesReport);
router.get("/feedback", reportController.getFeedbackReport);
router.get("/trends", reportController.getTrends);
router.get("/popular", reportController.getPopularItems);

module.exports = router;
