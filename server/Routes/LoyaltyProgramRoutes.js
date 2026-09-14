const express = require("express");
const router = express.Router();
const loyaltyController = require("../Controller/LoyaltyProgramController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("admin", "manager", "receptionist"));

router.post("/", loyaltyController.createLoyalty);
router.get("/", loyaltyController.getAllLoyalty);
router.put("/:id", loyaltyController.updateLoyalty);
router.delete("/:id", authorizeRoles("admin", "manager"), loyaltyController.deleteLoyalty);

module.exports = router;
