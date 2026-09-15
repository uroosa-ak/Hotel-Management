const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
      default: function () {
        return 'LS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      },
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    // Compatibility aliases
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    checkInDate: {
      type: Date,
      required: true,
      index: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
      index: true,
    },
    actualCheckIn: {
      type: Date,
      default: null,
    },
    actualCheckOut: {
      type: Date,
      default: null,
    },
    guestCount: {
      adults: { type: Number, required: true, min: 1, default: 1 },
      children: { type: Number, default: 0 },
    },
    numberOfGuests: {
      type: Number,
      default: function () {
        return (this.guestCount?.adults || 1) + (this.guestCount?.children || 0);
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked_in', 'checked-in', 'checked_out', 'checked-out', 'cancelled', 'no_show'],
      default: 'pending',
      index: true,
    },
    bookingStatus: {
      type: String,
      default: function () {
        return this.status;
      },
    },
    pricingBreakdown: {
      nightlyRate: { type: Number, required: true, default: 0 },
      numberOfNights: { type: Number, required: true, default: 1 },
      roomSubtotal: { type: Number, required: true, default: 0 },
      taxesAndFees: { type: Number, required: true, default: 0 },
      totalAmount: { type: Number, required: true, default: 0 },
    },
    totalAmount: {
      type: Number,
      default: function () {
        return this.pricingBreakdown?.totalAmount || 0;
      },
    },
    depositPaid: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partially_paid', 'paid', 'refunded'],
      default: 'unpaid',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['stripe_online', 'cash_at_counter', 'credit_card_pos', 'bank_wire', 'cash', 'card'],
      default: 'cash_at_counter',
    },
    keyCardNumber: {
      type: String,
      default: null,
    },
    specialRequests: {
      type: String,
      default: '',
    },
    bookedByStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Synchronize aliases before saving
ReservationSchema.pre('save', function (next) {
  if (this.guestId && !this.user) this.user = this.guestId;
  if (this.user && !this.guestId) this.guestId = this.user;

  if (this.roomId && !this.room) this.room = this.roomId;
  if (this.room && !this.roomId) this.roomId = this.room;

  if (this.status && !this.bookingStatus) this.bookingStatus = this.status;
  if (this.bookingStatus && !this.status) this.status = this.bookingStatus;

  if (this.pricingBreakdown?.totalAmount) {
    this.totalAmount = this.pricingBreakdown.totalAmount;
  } else if (this.totalAmount && !this.pricingBreakdown?.totalAmount) {
    if (!this.pricingBreakdown) this.pricingBreakdown = {};
    this.pricingBreakdown.totalAmount = this.totalAmount;
  }

  next();
});

// Compound Index for lightning fast double-booking conflict prevention
ReservationSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1 });

module.exports = mongoose.model('Reservation', ReservationSchema);
