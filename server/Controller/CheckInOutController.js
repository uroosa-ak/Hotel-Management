const CheckInOut = require("../models/CheckInOut");

exports.createCheckInOut = async (req, res) => {
    try {
        const checkInOut = await CheckInOut.create(req.body);
        res.status(201).json(checkInOut);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCheckInOuts = async (req, res) => {
    try {
        const data = await CheckInOut.find().populate("guest room booking");
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCheckInOutById = async (req, res) => {
    try {
        const data = await CheckInOut.findById(req.params.id).populate("guest room booking");
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCheckInOut = async (req, res) => {
    try {
        const updated = await CheckInOut.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCheckInOut = async (req, res) => {
    try {
        await CheckInOut.findByIdAndDelete(req.params.id);
        res.json({ message: "CheckInOut record deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};