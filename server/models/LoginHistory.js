const { Schema, default: mongoose } = require("mongoose");

const loginHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  email: { type: String, default: "" },
  success: { type: Boolean, default: true },
  ip: { type: String, default: "" },
  userAgent: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LoginHistory", loginHistorySchema);
