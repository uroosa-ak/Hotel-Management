const Booking = require("../models/Booking");
const Guest = require("../models/Guest");
const Room = require("../models/Room");
const User = require("../models/User");

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
        const totalAmount = roomDoc.price * nights;

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

        // The room's status tracks its physical state (occupied/cleaning), which
        // changes at check-in and check-out. A future reservation must not make
        // the room unbookable for other dates - overlapping stays are rejected
        // by the conflict check above.

        const populated = await Booking.findById(booking._id).populate('guest room');
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

        if (booking.room) {
            if (normalized === 'checked-in' || normalized === 'checked_in') {
                await Room.findByIdAndUpdate(booking.room, { status: 'occupied', availability: false });
            } else if (normalized === 'checked-out' || normalized === 'checked_out') {
                await Room.findByIdAndUpdate(booking.room, { status: 'cleaning', availability: false });
            } else if (normalized === 'cancelled') {
                await Room.findByIdAndUpdate(booking.room, { status: 'available', availability: true });
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