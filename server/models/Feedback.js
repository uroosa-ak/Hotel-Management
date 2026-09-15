const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Backward compatibility alias
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      sparse: true,
      index: true,
    },
    // Backward compatibility alias
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
    },
    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // Backward compatibility alias
    rating: {
      type: Number,
      default: function () {
        return this.overallRating || 5;
      },
    },
    ratings: {
      cleanliness: { type: Number, min: 1, max: 5, default: 5 },
      hospitality: { type: Number, min: 1, max: 5, default: 5 },
      amenities: { type: Number, min: 1, max: 5, default: 5 },
      dining: { type: Number, min: 1, max: 5, default: 5 },
      valueForMoney: { type: Number, min: 1, max: 5, default: 5 },
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1200,
    },
    // Backward compatibility alias
    comments: {
      type: String,
      default: function () {
        return this.comment;
      },
    },
    managerResponse: {
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: { type: String },
      respondedAt: { type: Date },
    },
    isPubliclyDisplayed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

feedbackSchema.pre('save', function (next) {
  if (this.guestId && !this.guest) this.guest = this.guestId;
  if (this.guest && !this.guestId) this.guestId = this.guest;

  if (this.reservationId && !this.booking) this.booking = this.reservationId;
  if (this.booking && !this.reservationId) this.reservationId = this.booking;

  if (this.overallRating && !this.rating) this.rating = this.overallRating;
  if (this.rating && !this.overallRating) this.overallRating = this.rating;

  if (this.comment && !this.comments) this.comments = this.comment;
  if (this.comments && !this.comment) this.comment = this.comments;

  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);