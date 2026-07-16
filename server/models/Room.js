const { Schema, default: mongoose } = require("mongoose");

const roomSchema = new Schema(
{
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },

    roomType: {
        type: String,
        enum: [
            "single",
            "double",
            "deluxe",
            "suite"
        ],
        required: true
    },

    floor: {
        type: Number,
        required: true
    },

    capacity: {
        type: Number,
        required: true,
        default: 1
    },

    price: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "available",
            "occupied",
            "cleaning",
            "maintenance",
            "reserved"
        ],
        default: "available"
    },

    availability: {
        type: Boolean,
        default: true
    },

    description: {
        type: String,
        default: "No description available"
    },

    amenities: [
        {
            type: String
        }
    ],

    image: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}
);

module.exports = mongoose.model("Room", roomSchema);