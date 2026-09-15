const express = require("express");
const router = express.Router();
const feedbackController = require("../Controller/FeedController");
const authMiddleware = require("../Middleware/authMiddleware");
const { authorizeRoles } = require("../Middleware/roleMiddleware");

// Any authenticated guest can leave feedback; only staff moderate it.
router.post("/", authMiddleware, feedbackController.createFeedback);
router.get("/mine", authMiddleware, feedbackController.getMyFeedback);
router.get("/", authMiddleware, authorizeRoles("admin", "manager"), feedbackController.getFeedbacks);
router.get("/:id", authMiddleware, authorizeRoles("admin", "manager"), feedbackController.getFeedbackById);
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager"), feedbackController.updateFeedback);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "manager"), feedbackController.deleteFeedback);

module.exports = router;
