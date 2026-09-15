const { Schema, default: mongoose } = require("mongoose");

// Singleton document holding hotel-wide configuration.
const systemSettingsSchema = new Schema(
  {
    hotelName: { type: String, default: "LuxuryStay Hotel" },
    logoUrl: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "" },
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "12:00" },
    currency: { type: String, default: "USD" },
    cancellationPolicy: { type: String, default: "Free cancellation up to 24 hours before check-in." },
    bookingPolicy: { type: String, default: "Valid ID required at check-in." },
    invoiceFooterNote: { type: String, default: "Thank you for staying with us." },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);
