const express = require("express");
const router = express.Router();
const taxController = require("../Controller/TaxConfigurationController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Tax rates are readable by anyone (needed to compute a quote); only staff manage them.
router.get("/", taxController.getAllTaxes);
router.post("/", authMiddleware, authorizeRoles("admin", "manager"), taxController.createTax);
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager"), taxController.updateTax);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "manager"), taxController.deleteTax);

module.exports = router;
