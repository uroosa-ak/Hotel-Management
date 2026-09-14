const ContactMessage = require("../models/ContactMessage");
const { validateEmail, validatePhone } = require("../utils/validators");

// Submit an enquiry from the public contact form
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required." });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ message: "Please provide a valid contact number." });
    }

    await ContactMessage.create({
      name: String(name).trim(),
      email: email.toLowerCase().trim(),
      phone: phone || "",
      subject: subject || "General Enquiry",
      message: String(message).trim()
    });

    res.status(201).json({ message: "Thank you for contacting us. Our team will respond shortly." });
  } catch (error) {
    res.status(500).json({ message: error.message || "Your message could not be sent." });
  }
};

// Staff inbox
exports.getMessages = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [messages, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      ContactMessage.countDocuments(filter)
    ]);

    res.json({
      data: messages,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark an enquiry as read / responded
exports.updateMessage = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "read", "responded"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const updated = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
