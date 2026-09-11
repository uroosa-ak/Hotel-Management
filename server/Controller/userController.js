const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateEmail, validatePassword, validatePhone } = require("../utils/validators");

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

      // Only existing admin/manager can assign non-guest roles; defaults to guest
      const assignedRole = (role && ["admin", "manager", "receptionist", "housekeeping"].includes(role)) ? role : "guest";

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
        process.env.JWT_SECRET || "hotel-secret",
        { expiresIn: "7d" }
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

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      if (user.isActive === false) {
        return res.status(403).json({ message: "This account has been deactivated. Please contact hotel administration." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "hotel-secret",
        { expiresIn: "7d" }
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