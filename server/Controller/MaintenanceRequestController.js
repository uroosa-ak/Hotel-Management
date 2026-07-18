const MaintenanceRequest = require("../models/MaintenanceRequest");

exports.createRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.create(req.body);
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find().populate("room requestedBy assignedTo");
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRequest = async (req, res) => {
    try {
        const updated = await MaintenanceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        await MaintenanceRequest.findByIdAndDelete(req.params.id);
        res.json({ message: "Maintenance request deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};