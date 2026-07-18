const { Schema, default: mongoose } = require("mongoose");

const paymentAuditSchema = new Schema({
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    action: { type: String, enum: ["created", "updated", "deleted", "refund"], required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now },
    details: { type: String }
});

module.exports = mongoose.model("PaymentAudit", paymentAuditSchema);