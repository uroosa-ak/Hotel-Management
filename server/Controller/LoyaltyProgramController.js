const LoyaltyProgram = require("../models/LoyaltyProgram");

exports.createLoyalty = async (req, res) => {
    try {
        const loyalty = await LoyaltyProgram.create(req.body);
        res.status(201).json(loyalty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllLoyalty = async (req, res) => {
    try {
        const data = await LoyaltyProgram.find().populate("guest");
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLoyalty = async (req, res) => {
    try {
        const updated = await LoyaltyProgram.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteLoyalty = async (req, res) => {
    try {
        await LoyaltyProgram.findByIdAndDelete(req.params.id);
        res.json({ message: "Loyalty program deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};