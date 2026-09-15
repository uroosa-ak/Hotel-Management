const express = require("express");
const router = express.Router();
const securityController = require("../Controller/SecurityController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("admin"));

router.get("/login-history", securityController.getLoginHistory);
router.get("/locked-accounts", securityController.getLockedAccounts);
router.patch("/unlock/:id", securityController.unlockAccount);

module.exports = router;
