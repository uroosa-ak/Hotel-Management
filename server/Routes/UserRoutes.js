const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Public Auth Endpoints
router.post("/register", userController.register);
router.post("/login", userController.login);

// Authenticated User Endpoints
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateUser);

// Staff & User Management (Admin & Manager only)
router.get("/all", authMiddleware, authorizeRoles("admin", "manager"), userController.getUsers);
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager"), userController.updateUser);
router.patch("/:id/toggle-status", authMiddleware, authorizeRoles("admin", "manager"), userController.toggleUserStatus);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), userController.deleteUser);

module.exports = router;