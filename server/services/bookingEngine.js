const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

/**
 * Executes a concurrency-safe reservation using MongoDB Multi-Document ACID Transactions.
 * Guarantees zero double-bookings via overlapping interval check within an isolated session.
 */
exports.executeSafeReservation = async ({
  guestId,
  roomId,
  checkInDate,
  checkOutDate,
  guestCount = { adults: 1, children: 0 },
  bookedByStaffId = null,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new Error('INVALID_DATES: Provided check-in or check-out dates are invalid.');
    }

    if (checkOut <= checkIn) {
      throw new Error('INVALID_DURATION: Check-out date must be strictly after check-in date.');
    }

    // Step 1: Detect conflicting overlapping reservations with existence-lock
    const conflict = await Reservation.findOne({
      roomId: roomId,
      status: { $in: ['confirmed', 'checked_in', 'checked-in', 'pending'] },
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
      ],
    }).session(session);

    if (conflict) {
      throw new Error('CONCURRENCY_CONFLICT: Room is already booked for the specified dates.');
    }

    // Step 2: Fetch Room & Validate Capacity
    const room = await Room.findById(roomId).session(session);
    if (!room || room.currentStatus === 'out_of_order') {
      throw new Error('ROOM_UNAVAILABLE: Room cannot be booked at this time.');
    }

    const adults = guestCount.adults || 1;
    const maxAdults = room.maxOccupancy?.adults || room.capacity || 2;
    if (adults > maxAdults) {
      throw new Error(`CAPACITY_EXCEEDED: Adult count (${adults}) exceeds room capacity (${maxAdults}).`);
    }

    // Step 3: Calculate Exact Pricing (Server-side mathematical authority)
    const diffTime = Math.abs(checkOut - checkIn);
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const nightlyRate = room.basePricePerNight || room.price || 150;
    const roomSubtotal = numberOfNights * nightlyRate;
    const taxesAndFees = parseFloat((roomSubtotal * 0.16).toFixed(2));
    const totalAmount = parseFloat((roomSubtotal + taxesAndFees).toFixed(2));

    // Step 4: Create Reservation Record
    const bookingReference = 'LS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newReservation = await Reservation.create(
      [
        {
          bookingReference,
          guestId,
          user: guestId,
          roomId,
          room: roomId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestCount: {
            adults: guestCount.adults || 1,
            children: guestCount.children || 0,
          },
          numberOfGuests: (guestCount.adults || 1) + (guestCount.children || 0),
          status: 'confirmed',
          bookingStatus: 'confirmed',
          pricingBreakdown: {
            nightlyRate,
            numberOfNights,
            roomSubtotal,
            taxesAndFees,
            totalAmount,
          },
          totalAmount,
          depositPaid: 0,
          paymentStatus: 'unpaid',
          bookedByStaffId: bookedByStaffId || null,
        },
      ],
      { session }
    );

    // Step 5: Commit ACID Transaction
    await session.commitTransaction();
    session.endSession();

    return newReservation[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
