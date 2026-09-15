const Booking = require("../models/Booking");
const Guest = require("../models/Guest");
const Room = require("../models/Room");
const User = require("../models/User");
const { notifyUser, notifyStaff } = require("../utils/notify");

// Mapping helper to translate MongoDB schema structure to client expected structure
function mapBookingToClient(booking) {
    if (!booking) return null;
    const b = booking.toObject ? booking.toObject() : booking;
    
    // Map room
    let clientRoom = null;
    if (b.room) {
        clientRoom = {
            _id: b.room._id,
            name: b.room.name || `Room ${b.room.roomNumber}`,
            roomNumber: b.room.roomNumber,
            type: b.room.roomType ? (b.room.roomType.charAt(0).toUpperCase() + b.room.roomType.slice(1)) : 'Deluxe',
            images: b.room.image ? [b.room.image] : ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop'],
            pricePerNight: b.room.price,
            capacity: b.room.capacity,
            description: b.room.description,
            amenities: b.room.amenities
        };
    }
    
    // Map guest/user
    let clientUser = null;
    if (b.guest) {
        clientUser = {
            firstName: b.guest.firstName,
            lastName: b.guest.lastName,
            email: b.guest.email,
            phone: b.guest.contact
        };
    }

    return {
        _id: b._id,
        room: clientRoom,
        user: clientUser,
        checkIn: b.checkInDate ? b.checkInDate.toISOString().split('T')[0] : null,
        checkOut: b.checkOutDate ? b.checkOutDate.toISOString().split('T')[0] : null,
        guests: b.numberOfGuests,
        totalAmount: b.totalAmount,
        status: b.bookingStatus,
        paymentStatus: b.paymentStatus,
        specialRequests: b.specialRequest,
        createdAt: b.createdAt
    };
}

// Create new booking. Guest identity always comes from the authenticated
// user (never trusted from the request body) so one account can't book
// under another guest's name.
exports.createBooking = async (req, res) => {
    try {
        const { room, checkIn, checkOut, guests, specialRequests } = req.body;

        if (!room || !checkIn || !checkOut) {
            return res.status(400).json({ message: "Room, check-in and check-out dates are required" });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (isNaN(checkInDate) || isNaN(checkOutDate) || checkOutDate <= checkInDate) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" });
        }

        const roomId = room._id || room;
        const roomDoc = await Room.findById(roomId);
        if (!roomDoc) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Reject overlapping bookings for the same room (any status except cancelled blocks it).
        const overlap = await Booking.findOne({
            room: roomId,
            bookingStatus: { $ne: 'cancelled' },
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate }
        });
        if (overlap) {
            return res.status(409).json({ message: "Room is not available for the selected dates" });
        }

        // Find or create the Guest CRM record tied to the logged-in user's email.
        let guestDoc = await Guest.findOne({ email: req.user.email });
        if (!guestDoc) {
            guestDoc = await Guest.create({
                firstName: req.user.firstName || req.user.username || 'Guest',
                lastName: req.user.lastName || 'User',
                email: req.user.email,
                contact: req.user.phone || req.user.contact || 'no contact'
            });
        } else {
            guestDoc.totalVisits = (guestDoc.totalVisits || 0) + 1;
            await guestDoc.save();
        }

        const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));

        // Apply weekend/seasonal/holiday multipliers per-night, plus extra-guest fees.
        const rules = roomDoc.pricingRules || {};
        let roomCharge = 0;
        for (let i = 0; i < nights; i++) {
            const night = new Date(checkInDate);
            night.setDate(night.getDate() + i);
            const isWeekend = night.getDay() === 5 || night.getDay() === 6; // Fri/Sat
            let nightlyRate = roomDoc.price;
            if (isWeekend && rules.weekendMultiplier) nightlyRate *= rules.weekendMultiplier;
            if (rules.seasonalMultiplier) nightlyRate *= rules.seasonalMultiplier;
            roomCharge += nightlyRate;
        }

        const baseCapacity = (roomDoc.maxOccupancy?.adults || 0) + (roomDoc.maxOccupancy?.children || 0) || roomDoc.capacity || 2;
        const extraGuests = Math.max(0, (guests || 1) - baseCapacity);
        const extraGuestCharge = extraGuests * (rules.extraGuestFee || 0) * nights;

        const totalAmount = parseFloat((roomCharge + extraGuestCharge).toFixed(2));

        const booking = await Booking.create({
            guest: guestDoc._id,
            room: roomId,
            checkInDate,
            checkOutDate,
            numberOfGuests: guests || 1,
            totalAmount,
            bookingStatus: 'pending',
            paymentStatus: 'pending',
            specialRequest: specialRequests || ''
        });

        // Auto-generate itemized folio invoice matching Blueprint Section 4.4 & 6
        try {
            const Invoice = require('../models/Invoice');
            const createdInvoice = await Invoice.create({
                reservationId: booking._id,
                guestId: req.user?._id || guestDoc._id,
                lineItems: [{
                    serviceType: 'room_charge',
                    description: `Room ${roomDoc.roomNumber} (${roomDoc.roomType}) - ${nights} night(s)`,
                    unitPrice: roomDoc.price,
                    quantity: nights,
                    totalPrice: totalAmount,
                    recordedBy: req.user?._id || null
                }],
                subtotal: totalAmount,
                grandTotal: totalAmount,
                balanceDue: totalAmount,
                paymentStatus: 'pending'
            });

            // Send HTML invoice email directly to guest email
            const targetEmail = guestDoc.email || req.user?.email;
            if (targetEmail) {
                const { sendEmail } = require('../utils/emailService');
                const { generateInvoiceEmailHtml } = require('../utils/invoiceEmailTemplate');
                const html = generateInvoiceEmailHtml(createdInvoice, guestDoc || req.user);
                sendEmail({
                    to: targetEmail,
                    subject: `Reservation & Invoice Confirmation - Room ${roomDoc.roomNumber} (LuxuryStay)`,
                    html
                }).catch((eErr) => console.error('Booking confirmation email error:', eErr.message));
            }
        } catch (invErr) {
            // Safe fallback if invoice fails
        }

        const populated = await Booking.findById(booking._id).populate('guest room');

        notifyUser(req.user._id, `Your reservation for Room ${roomDoc.roomNumber} (${checkIn} to ${checkOut}) has been received and is pending confirmation.`, "info");
        notifyStaff(`New reservation: Room ${roomDoc.roomNumber} for ${guestDoc.firstName} ${guestDoc.lastName}, ${checkIn} to ${checkOut}.`, "alert");

        res.status(201).json(mapBookingToClient(populated));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('guest room').sort({ createdAt: -1 });
        res.json(bookings.map(mapBookingToClient));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const isStaffRole = (role) => ["admin", "manager", "receptionist"].includes(role);

// Get booking by ID - staff can view any booking, guests only their own
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('guest room');
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (!isStaffRole(req.user.role) && booking.guest?.email !== req.user.email) {
            return res.status(403).json({ message: "Access denied" });
        }
        res.json(mapBookingToClient(booking));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update booking
exports.updateBooking = async (req, res) => {
    try {
        const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('guest room');
        if (!updated) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(mapBookingToClient(updated));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        // Make room available again
        if (booking.room) {
            await Room.findByIdAndUpdate(booking.room, { status: 'available' });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Booking status APIs
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const normalized = status ? status.toLowerCase() : 'pending';
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.bookingStatus = normalized;
        await booking.save();

        // Best-effort: resolve the Guest record's matching User account to notify them.
        try {
            const guestDoc = await Guest.findById(booking.guest);
            if (guestDoc) {
                const guestUser = await User.findOne({ email: guestDoc.email });
                if (guestUser) {
                    notifyUser(guestUser._id, `Your reservation status has been updated to "${normalized.replace(/_/g, ' ')}".`, "info");
                }
            }
        } catch (notifyErr) {
            // Non-critical — never block the status update on a notification failure.
        }

        if (booking.room) {
            const socketService = require('../services/socketService');
            const staffName = req.user?.firstName || 'Staff';

            if (normalized === 'checked-in' || normalized === 'checked_in') {
                await Room.findByIdAndUpdate(booking.room, { status: 'occupied', currentStatus: 'occupied', availability: false });
                socketService.emitRoomStatus(booking.room, 'occupied', staffName);
            } else if (normalized === 'checked-out' || normalized === 'checked_out') {
                await Room.findByIdAndUpdate(booking.room, { 
                    status: 'cleaning', 
                    currentStatus: 'cleaning', 
                    cleaningPriority: 'checkout_turnaround',
                    availability: false 
                });
                socketService.emitRoomStatus(booking.room, 'cleaning', staffName);
                socketService.emitMaintenanceAlert({
                    roomId: booking.room,
                    taskType: 'routine_cleaning',
                    priority: 'checkout_turnaround',
                    description: 'Checkout turnaround cleaning needed immediately.',
                    reportedBy: req.user?._id,
                    timestamp: new Date()
                });
            } else if (normalized === 'cancelled') {
                await Room.findByIdAndUpdate(booking.room, { status: 'available', currentStatus: 'available', availability: true });
                socketService.emitRoomStatus(booking.room, 'available', staffName);
            }
        }

        const populated = await Booking.findById(booking._id).populate('guest room');
        res.json(mapBookingToClient(populated));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel booking - staff can cancel any booking, guests only their own
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('guest');
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (!isStaffRole(req.user.role) && booking.guest?.email !== req.user.email) {
            return res.status(403).json({ message: "Access denied" });
        }

        booking.bookingStatus = 'cancelled';
        await booking.save();

        if (booking.room) {
            await Room.findByIdAndUpdate(booking.room, { status: 'available', availability: true });
        }

        notifyStaff(`Reservation for ${booking.guest?.firstName || 'a guest'} was cancelled.`, "alert");

        const populated = await Booking.findById(booking._id).populate('guest room');
        res.json(mapBookingToClient(populated));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reassign an existing booking to a different room, re-validating availability
exports.reassignRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        if (!roomId) {
            return res.status(400).json({ message: "roomId is required" });
        }
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const newRoom = await Room.findById(roomId);
        if (!newRoom) {
            return res.status(404).json({ message: "Target room not found" });
        }

        const overlap = await Booking.findOne({
            _id: { $ne: booking._id },
            room: roomId,
            bookingStatus: { $ne: 'cancelled' },
            checkInDate: { $lt: booking.checkOutDate },
            checkOutDate: { $gt: booking.checkInDate }
        });
        if (overlap) {
            return res.status(409).json({ message: "Target room is not available for this booking's dates" });
        }

        const previousRoom = booking.room;
        booking.room = roomId;
        await booking.save();

        // Free up the previous room, occupy the new one, if this booking is currently active.
        if (booking.bookingStatus === 'checked-in') {
            if (previousRoom) await Room.findByIdAndUpdate(previousRoom, { status: 'cleaning', currentStatus: 'cleaning' });
            await Room.findByIdAndUpdate(roomId, { status: 'occupied', currentStatus: 'occupied', availability: false });
        }

        const populated = await Booking.findById(booking._id).populate('guest room');
        res.json(mapBookingToClient(populated));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Extend or shorten an existing booking's stay dates, re-validating availability & totals
exports.updateStayDates = async (req, res) => {
    try {
        const { checkIn, checkOut } = req.body;
        if (!checkIn || !checkOut) {
            return res.status(400).json({ message: "checkIn and checkOut are required" });
        }
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (isNaN(checkInDate) || isNaN(checkOutDate) || checkOutDate <= checkInDate) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" });
        }

        const booking = await Booking.findById(req.params.id).populate('room');
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const overlap = await Booking.findOne({
            _id: { $ne: booking._id },
            room: booking.room?._id,
            bookingStatus: { $ne: 'cancelled' },
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate }
        });
        if (overlap) {
            return res.status(409).json({ message: "Room is not available for the requested dates" });
        }

        const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
        booking.checkInDate = checkInDate;
        booking.checkOutDate = checkOutDate;
        if (booking.room?.price) {
            booking.totalAmount = booking.room.price * nights;
        }
        await booking.save();

        const populated = await Booking.findById(booking._id).populate('guest room');
        res.json(mapBookingToClient(populated));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User specific bookings by userId path param
exports.getUserBookings = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const guest = await Guest.findOne({ email: user.email });
        if (!guest) {
            return res.json([]);
        }

        const bookings = await Booking.find({ guest: guest._id }).populate('guest room').sort({ createdAt: -1 });
        res.json(bookings.map(mapBookingToClient));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get current logged-in user's bookings (my bookings)
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const guest = await Guest.findOne({ email: user.email });
        if (!guest) {
            return res.json([]);
        }

        const bookings = await Booking.find({ guest: guest._id }).populate('guest room').sort({ createdAt: -1 });
        res.json(bookings.map(mapBookingToClient));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};