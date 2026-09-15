const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: function () {
        return `${this.roomType || 'Deluxe'} Room ${this.roomNumber || ''}`.trim();
      },
    },
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      trim: true,
      index: true,
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required'],
      min: 0,
    },
    basePricePerNight: {
      type: Number,
      required: [true, 'Base price per night is required'],
      min: [0, 'Price must be non-negative'],
    },
    // Backward compatibility for existing code querying price
    price: {
      type: Number,
      default: function () {
        return this.basePricePerNight;
      },
    },
    maxOccupancy: {
      adults: {
        type: Number,
        required: true,
        default: 2,
        min: 1,
        max: 8,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
        max: 6,
      },
    },
    capacity: {
      type: Number,
      default: function () {
        return (this.maxOccupancy?.adults || 2) + (this.maxOccupancy?.children || 0);
      },
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    currentStatus: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'cleaning', 'maintenance', 'out_of_order'],
      default: 'available',
      index: true,
    },
    // Backward compatibility for status
    status: {
      type: String,
      default: function () {
        return this.currentStatus || 'available';
      },
    },
    cleaningPriority: {
      type: String,
      enum: ['routine', 'high', 'urgent_vip', 'checkout_turnaround'],
      default: 'routine',
      index: true,
    },
    assignedHousekeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    lastCleanedAt: {
      type: Date,
      default: null,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String,
      default: function () {
        return Array.isArray(this.images) && this.images.length > 0 ? this.images[0] : '';
      },
    },
    description: {
      type: String,
      default: 'No description available',
    },
    features: {
      bedType: {
        type: String,
        enum: ['King', 'Queen', 'Twin', 'Double-Double', 'Master King + Queen'],
        default: 'King',
      },
      squareMeters: {
        type: Number,
        default: 35,
      },
      smoking: {
        type: Boolean,
        default: false,
      },
    },
    size: {
      type: Number,
      default: function () {
        return this.features?.squareMeters || 35;
      },
    },
    bedType: {
      type: String,
      default: function () {
        return this.features?.bedType || 'King';
      },
    },
    view: {
      type: String,
      default: 'City',
    },
    availability: {
      type: Boolean,
      default: true,
    },
    pricingRules: {
      weekendMultiplier: { type: Number, default: 1 }, // e.g. 1.2 = +20% Fri/Sat nights
      seasonalMultiplier: { type: Number, default: 1 },
      holidayMultiplier: { type: Number, default: 1 },
      extraGuestFee: { type: Number, default: 0 }, // per extra guest, per night
      extraBedFee: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Compound index for optimal availability and category lookups
roomSchema.index({ currentStatus: 1, roomType: 1 });
roomSchema.index({ status: 1, isAvailable: 1 });

// Synchronize status and currentStatus before save
roomSchema.pre('save', function (next) {
  if (this.isModified('currentStatus') && !this.isModified('status')) {
    this.status = this.currentStatus;
  } else if (this.isModified('status') && !this.isModified('currentStatus')) {
    this.currentStatus = this.status;
  }

  if (this.isModified('basePricePerNight') && !this.isModified('price')) {
    this.price = this.basePricePerNight;
  } else if (this.isModified('price') && !this.isModified('basePricePerNight')) {
    this.basePricePerNight = this.price;
  }

  this.availability = this.currentStatus === 'available';
  next();
});

module.exports = mongoose.model('Room', roomSchema);