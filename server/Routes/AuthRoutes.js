const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", authMiddleware, userController.getProfile);

module.exports = router;
