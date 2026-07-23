const express = require("express");
const router = express.Router();
const promotionController = require("../Controller/PromotionController");

router.post("/", promotionController.createPromotion);
router.get("/", promotionController.getAllPromotions);
router.put("/:id", promotionController.updatePromotion);
router.delete("/:id", promotionController.deletePromotion);

module.exports = router;