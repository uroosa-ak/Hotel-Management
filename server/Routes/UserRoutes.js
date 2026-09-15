const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Auth endpoints (register/login/me) live at /api/auth - see AuthRoutes.js.

// Authenticated User Endpoints
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateUser);
router.put("/change-password", authMiddleware, userController.changePassword);

// Staff & User Management (Admin & Manager only)
router.post("/staff", authMiddleware, authorizeRoles("admin", "manager"), userController.createStaff);
router.get("/all", authMiddleware, authorizeRoles("admin", "manager"), userController.getUsers);
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager"), userController.updateUser);
router.patch("/:id/toggle-status", authMiddleware, authorizeRoles("admin", "manager"), userController.toggleUserStatus);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), userController.deleteUser);

module.exports = router;