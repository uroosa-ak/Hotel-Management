const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    default: ""
  },
  lastName: {
    type: String,
    trim: true,
    default: ""
  },
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "manager", "receptionist", "housekeeping", "guest"],
    default: "guest"
  },
  phone: {
    type: String,
    default: ""
  },
  contact: {
    type: String,
    default: ""
  },
  cnic: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imgUrl: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);