const express = require("express");
const router = express.Router();
const paymentController = require("../Controller/PaymentController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("admin", "manager", "receptionist"));

router.post("/", paymentController.createPayment);
router.get("/", paymentController.getPayments);

module.exports = router;
