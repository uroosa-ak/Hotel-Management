const TaxConfiguration = require("../models/TaxConfiguration");

exports.createTax = async (req, res) => {
    try {
        const tax = await TaxConfiguration.create(req.body);
        res.status(201).json(tax);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTaxes = async (req, res) => {
    try {
        const taxes = await TaxConfiguration.find();
        res.json(taxes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTax = async (req, res) => {
    try {
        const updated = await TaxConfiguration.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTax = async (req, res) => {
    try {
        await TaxConfiguration.findByIdAndDelete(req.params.id);
        res.json({ message: "Tax configuration deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};