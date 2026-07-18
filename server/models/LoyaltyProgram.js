const { Schema, default: mongoose } = require("mongoose");

const loyaltySchema = new Schema({
    guest: { type: Schema.Types.ObjectId, ref: "Guest" },
    points: { type: Number, default: 0 },
    tier: { type: String, enum: ["Silver", "Gold", "Platinum"], default: "Silver" },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LoyaltyProgram", loyaltySchema);