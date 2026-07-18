const { Schema, default: mongoose } = require("mongoose");

const roomPhotoSchema = new Schema({
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    url: { type: String, required: true },
    description: { type: String },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RoomPhoto", roomPhotoSchema);