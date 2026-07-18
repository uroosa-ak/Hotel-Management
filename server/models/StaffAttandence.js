const { Schema, default: mongoose } = require("mongoose");

const attendanceSchema = new Schema({
    staff: { type: Schema.Types.ObjectId, ref: "user" },
    date: { type: Date, required: true },
    shift: { type: String }, // e.g., "morning", "night"
    checkInTime: { type: String },
    checkOutTime: { type: String },
    status: { type: String, enum: ["present", "absent", "leave"], default: "present" }
});

module.exports = mongoose.model("staffattendance", attendanceSchema);