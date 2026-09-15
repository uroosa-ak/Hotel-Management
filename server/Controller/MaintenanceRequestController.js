const MaintenanceRequest = require("../models/MaintenanceRequest");
const { notifyStaff, notifyUser } = require("../utils/notify");

exports.createRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.create(req.body);
        notifyStaff(`New maintenance ticket: ${request.issue}${request.priority ? ` (${request.priority} priority)` : ''}.`, "alert");
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

exports.assignRequest = async (req, res) => {
    try {
        const assignedTo = req.body.assignedTo || req.user._id;
        const updated = await MaintenanceRequest.findByIdAndUpdate(
            req.params.id,
            { assignedTo, status: "in-progress", startedAt: new Date() },
            { new: true }
        ).populate("room requestedBy assignedTo");
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resolveRequest = async (req, res) => {
    try {
        const updated = await MaintenanceRequest.findByIdAndUpdate(
            req.params.id,
            { status: "completed", resolutionNotes: req.body.resolutionNotes || "", completedAt: new Date() },
            { new: true }
        ).populate("room requestedBy assignedTo");
        if (updated?.requestedBy) {
            notifyUser(updated.requestedBy._id || updated.requestedBy, `Your maintenance report ("${updated.issue}") has been resolved.`, "info");
        }
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