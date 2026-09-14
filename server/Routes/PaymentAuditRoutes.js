const express = require("express");
const router = express.Router();
const paymentAuditController = require("../Controller/PaymentAuditController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("admin", "manager"));

router.post("/", paymentAuditController.createAudit);
router.get("/", paymentAuditController.getAllAudits);

module.exports = router;
