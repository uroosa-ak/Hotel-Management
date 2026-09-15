const ServiceRequest = require("../models/ServiceRequest");

// Guest creates a request against their own active/upcoming booking
exports.createRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.create({
      ...req.body,
      guestId: req.user._id,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Guest views only their own requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ guestId: req.user._id })
      .populate("roomId reservationId")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Staff views all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("guestId roomId reservationId")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Staff updates status (received -> in_preparation -> dispatched -> fulfilled/cancelled)
exports.updateStatus = async (req, res) => {
  try {
    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Service request not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
