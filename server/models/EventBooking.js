const { Schema, default: mongoose } = require("mongoose");

const eventSchema = new Schema({
    eventName: { type: String, required: true },
    guest: { type: Schema.Types.ObjectId, ref: "guest" },
    room: { type: Schema.Types.ObjectId, ref: "room" }, // e.g., conference room
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: String, enum: ["booked", "completed", "cancelled"], default: "booked" }
});

module.exports = mongoose.model("eventbooking", eventSchema);