const { Schema, default: mongoose } = require("mongoose");

// Generic system-wide audit trail (distinct from the payment-only PaymentAudit).
const auditLogSchema = new Schema({
  actor: { type: Schema.Types.ObjectId, ref: "User" },
  actorName: { type: String, default: "" },
  action: { type: String, required: true }, // e.g. "booking.cancelled", "room.updated"
  entityType: { type: String, default: "" },
  entityId: { type: String, default: "" },
  details: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
