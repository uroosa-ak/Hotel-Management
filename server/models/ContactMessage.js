const { Schema, default: mongoose } = require("mongoose");

const contactMessageSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "General Enquiry" },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ["new", "read", "responded"],
        default: "new"
    },
    createdAt: { type: Date, default: Date.now }
});

contactMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
