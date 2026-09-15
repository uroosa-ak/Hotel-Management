const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateEmail, validatePassword, validatePhone } = require("../utils/validators");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const recordLogin = (user, email, success, req) => {
  LoginHistory.create({
    user: user?._id,
    email,
    success,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  }).catch((err) => console.error("Failed to record login history:", err.message));
};

const userController = {
  // Register user
  register: async (req, res) => {
    try {
      const { firstName, lastName, username, email, password, phone, contact, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email address." });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
      }

      const userPhone = phone || contact || "";
      if (userPhone && !validatePhone(userPhone)) {
        return res.status(400).json({ message: "Please provide a valid contact number (10-15 digits)." });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: "An account with this email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const computedUsername = username || (firstName ? `${firstName}_${lastName || ''}`.trim().toLowerCase() : email.split('@')[0]);

      // Public self-registration can NEVER grant a staff role — this endpoint has
      // no authenticated caller to check, so any role from the request body is
      // ignored. Staff accounts are created only via the admin-only createStaff
      // endpoint below.
      void role;
      const assignedRole = "guest";

      const newUser = await User.create({
        firstName: firstName || "",
        lastName: lastName || "",
        username: computedUsername,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: userPhone,
        contact: userPhone,
        role: assignedRole,
        isActive: true
      });

      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).json({
        message: "Account created successfully.",
        user: userResponse,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message || "Registration failed." });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        recordLogin(null, email, false, req);
        return res.status(401).json({ message: "Invalid email or password." });
      }

      if (user.isActive === false) {
        recordLogin(user, email, false, req);
        return res.status(403).json({ message: "This account has been deactivated. Please contact hotel administration." });
      }

      if (user.lockUntil && user.lockUntil > Date.now()) {
        recordLogin(user, email, false, req);
        const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
        return res.status(423).json({ message: `Account temporarily locked due to failed login attempts. Try again in ${minutesLeft} minute(s).` });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
          user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
          user.failedLoginAttempts = 0;
        }
        await user.save();
        recordLogin(user, email, false, req);
        return res.status(401).json({ message: "Invalid email or password." });
      }

      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
      recordLogin(user, email, true, req);

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        message: "Login successful.",
        user: userResponse,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message || "Login failed." });
    }
  },

  // Admin/Manager-only: create a staff account with an explicit role.
  createStaff: async (req, res) => {
    try {
      const { firstName, lastName, username, email, password, phone, contact, role, department } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email address." });
      }
      if (!validatePassword(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
      }
      const allowedStaffRoles = ["manager", "receptionist", "housekeeping"];
      // Only a Super Admin may grant the admin role itself; managers may create
      // any other staff role but not another admin.
      if (role === "admin" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only a Super Admin can create another admin account." });
      }
      if (!allowedStaffRoles.includes(role) && role !== "admin") {
        return res.status(400).json({ message: "Invalid staff role." });
      }

      const userPhone = phone || contact || "";
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: "An account with this email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const computedUsername = username || (firstName ? `${firstName}_${lastName || ''}`.trim().toLowerCase() : email.split('@')[0]);

      const newUser = await User.create({
        firstName: firstName || "",
        lastName: lastName || "",
        username: computedUsername,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: userPhone,
        contact: userPhone,
        role,
        department: department || "none",
        isActive: true
      });

      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).json({ message: "Staff account created successfully.", user: userResponse });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to create staff account." });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all users (Admin & Managers)
  getUsers: async (req, res) => {
    try {
      const { role } = req.query;
      const query = {};
      if (role) query.role = role;

      const users = await User.find(query).select("-password").sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user profile or role
  updateUser: async (req, res) => {
    try {
      const targetId = req.params.id || req.user._id;
      const { firstName, lastName, phone, role, isActive } = req.body;

      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (phone !== undefined) {
        if (phone && !validatePhone(phone)) {
          return res.status(400).json({ message: "Invalid phone number." });
        }
        updateData.phone = phone;
        updateData.contact = phone;
      }

      // Only admin can change roles or toggle active status
      if (req.user.role === "admin") {
        if (role && ["admin", "manager", "receptionist", "housekeeping", "guest"].includes(role)) {
          updateData.role = role;
        }
        if (isActive !== undefined) {
          updateData.isActive = isActive;
        }
      }

      const updated = await User.findByIdAndUpdate(targetId, updateData, { new: true }).select("-password");
      if (!updated) {
        return res.status(404).json({ message: "User not found." });
      }

      res.json({ message: "User updated successfully.", user: updated });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Toggle staff / user activation status (Deactivate / Reactivate)
  toggleUserStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.isActive = !user.isActive;
      await user.save();

      res.json({
        message: `Account has been ${user.isActive ? "activated" : "deactivated"} successfully.`,
        isActive: user.isActive
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Change own password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required." });
      }
      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          message: "New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
      }

      const user = await User.findById(req.user._id).select('+password');
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: "Password changed successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to change password." });
    }
  },

  // Delete user account
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json({ message: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;