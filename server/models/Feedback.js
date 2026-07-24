const { Schema, default: mongoose } = require("mongoose");

const feedbackSchema = new Schema({
    guest: { type: Schema.Types.ObjectId, ref: "guest", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "booking" },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("feedback", feedbackSchema);