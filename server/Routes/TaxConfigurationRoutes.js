const express = require("express");
const router = express.Router();
const taxController = require("../Controller/TaxConfigurationController");

router.post("/", taxController.createTax);
router.get("/", taxController.getAllTaxes);
router.put("/:id", taxController.updateTax);
router.delete("/:id", taxController.deleteTax);

module.exports = router;