const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {

  // Register User
  register: async (req, res) => {
    try {
      const { username, email, password, role, contact, age } = req.body;

      if (!username || !email || !password) {
        return res.json({ message: "Required fields are missing", status: false });
      }

      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ message: "Account already exists with this email", status: false });
      }

      let hashPass = await bcrypt.hash(password, 10);

      let newUser = await User.create({
        username,
        email,
        password: hashPass,
        role,
        contact,
        age
      });

      return res.json({ message: "Account created", status: true, newUser });

    } catch (error) {
      res.json({ message: error.message, status: false });
    }
  },

  // Login User
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({ message: "Required fields missing", status: false });
      }

      let existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.json({ message: "No account exists", status: false });
      }

      let isPassMatch = await bcrypt.compare(password, existingUser.password);
      if (!isPassMatch) {
        return res.json({ message: "Invalid password", status: false });
      }

      const token = jwt.sign(
        { id: existingUser._id, role: existingUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.cookie("token",token)

      return res.json({ message: "Login successful", status: true, user: existingUser, token });

    } catch (error) {
      res.json({ message: error.message, status: false });
    }
  },

  // Get all users
  getUsers: async (req, res) => {
    try {
      const users = await User.find({});
      if (users.length>0) {
         return res.json({
          message: "user get successfully",
          status: true,
          users
        })
      } else {
         res.json({
          message: " no user  in DB",
          status: false
        })
      }
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

};

module.exports = userController;