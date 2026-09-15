const express = require("express");
const router = express.Router();
const settingsController = require("../Controller/SettingsController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("admin"));

router.get("/", settingsController.getSettings);
router.put("/", settingsController.updateSettings);

module.exports = router;
