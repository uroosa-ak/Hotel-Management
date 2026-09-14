const express = require("express");
const router = express.Router();
const roleController = require("../Controller/RoleController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Role/permission definitions are the most sensitive data in the system - admin only.
router.use(authMiddleware, authorizeRoles("admin"));

router.post("/", roleController.createRole);
router.get("/", roleController.getAllRoles);
router.put("/:id", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

module.exports = router;
