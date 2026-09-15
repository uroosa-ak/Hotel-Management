const LoginHistory = require("../models/LoginHistory");
const User = require("../models/User");

exports.getLoginHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { user: userId } : {};
    const history = await LoginHistory.find(filter).populate("user", "firstName lastName email role").sort({ createdAt: -1 }).limit(200);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLockedAccounts = async (req, res) => {
  try {
    const locked = await User.find({ lockUntil: { $gt: new Date() } }).select("firstName lastName email role lockUntil failedLoginAttempts");
    res.json(locked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unlockAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { lockUntil: null, failedLoginAttempts: 0 },
      { new: true }
    ).select("firstName lastName email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Account unlocked", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
