const { Schema, default: mongoose } = require("mongoose");

const checkInOutSchema = new Schema({
    booking: { type: Schema.Types.ObjectId, ref: "booking", required: true }, // Link to Booking
    guest: { type: Schema.Types.ObjectId, ref: "guest", required: true },     // Link to Guest
    room: { type: Schema.Types.ObjectId, ref: "room", required: true },       // Link to Room
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date }, // Can be updated on check-out
    actualCheckOutDate: { type: Date }, // When guest actually leaves
    status: { 
        type: String, 
        enum: ["checked-in", "checked-out", "no-show"], 
        default: "checked-in" 
    },
    notes: { type: String }, // Optional notes for staff
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("checkinout", checkInOutSchema);