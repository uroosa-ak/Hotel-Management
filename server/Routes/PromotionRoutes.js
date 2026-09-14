const express = require("express");
const router = express.Router();
const promotionController = require("../Controller/PromotionController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Active promotions are readable by anyone (shown at booking time); only staff manage them.
router.get("/", promotionController.getAllPromotions);
router.post("/", authMiddleware, authorizeRoles("admin", "manager"), promotionController.createPromotion);
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager"), promotionController.updatePromotion);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "manager"), promotionController.deletePromotion);

module.exports = router;
