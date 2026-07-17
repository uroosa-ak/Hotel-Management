const { Schema, default: mongoose } = require("mongoose");
const guestSchema = new Schema(
{
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    contact: {
        type: String,
        required: true
    },

    cnic: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    nationality: {
        type: String,
        default: ""
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "male"
    },

    dateOfBirth: {
        type: Date
    },

    preferences: {
        type: String,
        default: "No preferences"
    },

    totalVisits: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}
);


module.exports = mongoose.model("Guest", guestSchema);