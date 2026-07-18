const express = require("express");
const router = express.Router();
const paymentAuditController = require("../controllers/PaymentAuditController");

router.post("/", paymentAuditController.createAudit);
router.get("/", paymentAuditController.getAllAudits);

module.exports = router;