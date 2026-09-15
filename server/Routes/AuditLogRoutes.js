const express = require("express");
const router = express.Router();
const auditLogController = require("../Controller/AuditLogController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("admin"));

router.get("/", auditLogController.getAuditLogs);
router.post("/", auditLogController.createAuditLog);

module.exports = router;
