const Notification = require("../models/Notification");

// Fire-and-forget notification creation — never throws, so a notification
// failure can never break the booking/payment/maintenance flow that triggered it.

// Notify a specific user (e.g. the guest who owns a booking).
const notifyUser = (userId, message, type = "info") => {
  if (!userId) return;
  Notification.create({ user: userId, message, type }).catch((err) =>
    console.error("Failed to create notification:", err.message)
  );
};

// Notify the staff inbox (all admin/manager/receptionist/housekeeping accounts
// see any notification with no specific `user`, per NotificationController).
const notifyStaff = (message, type = "info") => {
  Notification.create({ user: null, message, type }).catch((err) =>
    console.error("Failed to create notification:", err.message)
  );
};

module.exports = { notifyUser, notifyStaff };
