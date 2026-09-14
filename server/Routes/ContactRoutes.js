const express = require("express");
const router = express.Router();
const contactController = require("../Controller/ContactController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Anyone can send an enquiry; only staff read the inbox.
router.post("/", contactController.createMessage);
router.get("/", authMiddleware, authorizeRoles("admin", "manager", "receptionist"), contactController.getMessages);
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager", "receptionist"), contactController.updateMessage);

module.exports = router;
