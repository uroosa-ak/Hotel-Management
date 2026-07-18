const PaymentAudit = require("../models/PaymentAudit");

exports.createAudit = async (req, res) => {
    try {
        const audit = await PaymentAudit.create(req.body);
        res.status(201).json(audit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllAudits = async (req, res) => {
    try {
        const audits = await PaymentAudit.find().populate("payment performedBy");
        res.json(audits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};