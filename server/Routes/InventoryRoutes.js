const express = require("express");
const router = express.Router();
const inventoryController = require("../Controller/inventoryController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("admin", "manager", "housekeeping"));

router.post("/", inventoryController.addInventory);
router.get("/", inventoryController.getInventory);
router.put("/:id", inventoryController.updateInventory);
router.delete("/:id", authorizeRoles("admin", "manager"), inventoryController.deleteInventory);

module.exports = router;
