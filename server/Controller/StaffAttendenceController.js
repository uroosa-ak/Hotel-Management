const StaffAttendance = require("../models/StaffAttandence");

// Add attendance
exports.addAttendance = async (req, res) => {
  try {
    const attendance = await StaffAttendance.create(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance
exports.getAttendance = async (req, res) => {
  try {
    const records = await StaffAttendance.find().populate("staff");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};