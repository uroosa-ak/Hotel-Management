const Feedback = require("../models/Feedback");

// Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all feedbacks
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("guest booking");
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};