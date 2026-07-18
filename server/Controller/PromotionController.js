const Promotion = require("../models/Promotion");

exports.createPromotion = async (req, res) => {
    try {
        const promo = await Promotion.create(req.body);
        res.status(201).json(promo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPromotions = async (req, res) => {
    try {
        const promos = await Promotion.find();
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePromotion = async (req, res) => {
    try {
        const updated = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePromotion = async (req, res) => {
    try {
        await Promotion.findByIdAndDelete(req.params.id);
        res.json({ message: "Promotion deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};