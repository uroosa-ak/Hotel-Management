const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema(
  {
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
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    serviceCategory: {
      type: String,
      enum: [
        'in_room_dining',
        'wake_up_call',
        'luggage_assistance',
        'airport_transfer',
        'extra_linen',
        'laundry_pickup',
        'other',
      ],
      required: true,
    },
    requestDetails: {
      type: String,
      required: [true, 'Request details are required'],
      trim: true,
    },
    deliverySchedule: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['received', 'in_preparation', 'dispatched', 'fulfilled', 'cancelled'],
      default: 'received',
      index: true,
    },
    chargesAddedToFolio: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
