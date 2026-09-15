const Payment = require("../models/Payment");
const Guest = require("../models/Guest");
const User = require("../models/User");
const { notifyUser, notifyStaff } = require("../utils/notify");

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

// Refund a completed payment
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.paymentStatus === "refunded") {
      return res.status(400).json({ message: "Payment already refunded" });
    }
    payment.paymentStatus = "refunded";
    await payment.save();

    try {
      const guestDoc = await Guest.findById(payment.guest);
      if (guestDoc) {
        const guestUser = await User.findOne({ email: guestDoc.email });
        if (guestUser) notifyUser(guestUser._id, `A refund of $${payment.amount.toFixed(2)} has been processed.`, "info");
      }
    } catch (notifyErr) {
        // Non-critical
    }
    notifyStaff(`Refund of $${payment.amount.toFixed(2)} processed for payment ${payment._id}.`, "alert");

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};