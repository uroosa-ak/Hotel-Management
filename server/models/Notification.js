const { Schema, default: mongoose } = require("mongoose");

const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "alert", "reminder"], default: "info" },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("notification", notificationSchema);