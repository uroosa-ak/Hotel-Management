const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    contact: {
      type: String,
      default: '',
    },
    cnic: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'receptionist', 'housekeeping', 'guest'],
      default: 'guest',
      index: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zipCode: { type: String, default: '' },
    },
    identityProof: {
      idType: {
        type: String,
        enum: ['passport', 'national_id', 'driving_license', 'none'],
        default: 'none',
      },
      idNumber: { type: String, sparse: true, trim: true },
    },
    preferences: {
      dietary: [{ type: String }],
      smokingAllowed: { type: Boolean, default: false },
      floorPreference: { type: String, enum: ['low', 'high', 'any'], default: 'any' },
      specialRequests: { type: String, default: '' },
    },
    department: {
      type: String,
      enum: ['management', 'front_desk', 'housekeeping', 'maintenance', 'f_and_b', 'none'],
      default: 'none',
    },
    shiftSchedule: {
      shiftName: {
        type: String,
        enum: ['morning', 'evening', 'night', 'rotational'],
        default: 'morning',
      },
      daysOn: [{ type: String }],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
    imgUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Pre-save hook: sync name and hash password safely
userSchema.pre('save', async function () {
  if (this.firstName || this.lastName) {
    if (!this.name || this.name.trim() === '') {
      this.name = `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }
  } else if (this.name) {
    const parts = this.name.trim().split(' ');
    this.firstName = parts[0] || '';
    this.lastName = parts.slice(1).join(' ') || '';
  }

  // Only hash password if modified and not already hashed
  if (!this.isModified('password')) return;
  if (
    typeof this.password === 'string' &&
    (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))
  ) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to verify password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);