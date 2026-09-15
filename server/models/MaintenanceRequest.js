const { Schema, default: mongoose } = require("mongoose");

const maintenanceSchema = new Schema({
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User" },
    issue: { type: String, required: true },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high", "emergency"], default: "medium" },
    notes: { type: String, default: "" },
    resolutionNotes: { type: String, default: "" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    completedAt: { type: Date }
});

module.exports = mongoose.model("MaintenanceRequest", maintenanceSchema);