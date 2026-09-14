const Notification = require("../models/Notification");

// Create notification
exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notifications - staff can see all, everyone else only their own
exports.getNotifications = async (req, res) => {
  try {
    const isStaff = ["admin", "manager", "receptionist", "housekeeping"].includes(req.user.role);
    const filter = isStaff ? {} : { user: req.user._id };
    const notifications = await Notification.find(filter).populate("user").sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isStaffRole = (role) => ["admin", "manager", "receptionist", "housekeeping"].includes(role);

// Update notification (e.g. mark as read) - owner or staff only
exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (!isStaffRole(req.user.role) && String(notification.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    Object.assign(notification, req.body);
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notification - owner or staff only
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (!isStaffRole(req.user.role) && String(notification.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    await notification.deleteOne();
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};