const { Schema, default: mongoose } = require("mongoose");

const taxSchema = new Schema({
    taxName: { type: String, required: true },
    rate: { type: Number, required: true },
    type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("TaxConfiguration", taxSchema);