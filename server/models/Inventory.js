const { Schema, default: mongoose } = require("mongoose");

const inventorySchema = new Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    category: { type: String },
    status: { type: String, enum: ["available", "low", "out-of-stock"], default: "available" },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("inventory", inventorySchema);