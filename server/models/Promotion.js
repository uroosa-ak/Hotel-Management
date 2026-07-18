const { Schema, default: mongoose } = require("mongoose");

const promotionSchema = new Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountPercentage: { type: Number, required: true },
    validFrom: { type: Date },
    validTo: { type: Date },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Promotion", promotionSchema);