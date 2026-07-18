const Payment = require("../models/Payment");

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("guest booking");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};