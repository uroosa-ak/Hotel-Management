const AuditLog = require("../models/AuditLog");

exports.getAuditLogs = async (req, res) => {
  try {
    const { action, from, to } = req.query;
    const filter = {};
    if (action) filter.action = new RegExp(action, "i");
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.create({
      ...req.body,
      actor: req.user?._id,
      actorName: req.user?.firstName || req.user?.username || req.user?.email,
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper for other controllers to record an action without an HTTP round-trip.
exports.record = async ({ actor, actorName, action, entityType, entityId, details }) => {
  try {
    await AuditLog.create({ actor, actorName, action, entityType, entityId, details });
  } catch (err) {
    console.error("Failed to record audit log:", err.message);
  }
};
