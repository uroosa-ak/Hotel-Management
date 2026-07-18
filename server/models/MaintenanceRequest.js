const { Schema, default: mongoose } = require("mongoose");

const maintenanceSchema = new Schema({
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User" },
    issue: { type: String, required: true },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

module.exports = mongoose.model("MaintenanceRequest", maintenanceSchema);