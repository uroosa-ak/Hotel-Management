const mongoose = require('mongoose');

const LineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  serviceType: {
    type: String,
    enum: ['room_charge', 'restaurant', 'laundry', 'minibar', 'spa', 'late_checkout', 'damage_fee', 'other'],
    required: true,
  },
  unitPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: function () {
        return 'INV-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
      },
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true,
      index: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lineItems: [LineItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    taxPercent: { type: Number, default: 16.0 },
    taxAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['draft', 'pending', 'paid', 'void'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'cash', 'stripe', 'wire_transfer'],
      default: 'cash',
    },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Method to atomically recalculate folio totals and balance
InvoiceSchema.methods.recalculateTotals = function () {
  this.subtotal = this.lineItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  this.taxAmount = parseFloat(((this.subtotal * (this.taxPercent || 16)) / 100).toFixed(2));
  this.grandTotal = parseFloat((this.subtotal + this.taxAmount - (this.discountAmount || 0)).toFixed(2));
  this.balanceDue = parseFloat(Math.max(0, this.grandTotal - (this.amountPaid || 0)).toFixed(2));

  if (this.balanceDue <= 0 && this.grandTotal > 0) {
    this.paymentStatus = 'paid';
    this.paidAt = this.paidAt || new Date();
  }
};

InvoiceSchema.pre('save', function (next) {
  this.recalculateTotals();
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
