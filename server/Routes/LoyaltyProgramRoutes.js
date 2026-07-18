const express = require("express");
const router = express.Router();
const loyaltyController = require("../controllers/LoyaltyProgramController");

router.post("/", loyaltyController.createLoyalty);
router.get("/", loyaltyController.getAllLoyalty);
router.put("/:id", loyaltyController.updateLoyalty);
router.delete("/:id", loyaltyController.deleteLoyalty);

module.exports = router;