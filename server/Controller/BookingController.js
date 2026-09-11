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

// Create new booking
exports.createBooking = async (req, res) => {
    try {
        const { room, user, checkIn, checkOut, guests, totalAmount, specialRequests, status, paymentStatus } = req.body;

        if (!room || !user || !checkIn || !checkOut) {
            return res.status(400).json({ message: "Required booking fields are missing" });
        }

        // Find or create Guest profile by email
        let guestDoc = await Guest.findOne({ email: user.email });
        if (!guestDoc) {
            guestDoc = await Guest.create({
                firstName: user.firstName || 'Guest',
                lastName: user.lastName || 'User',
                email: user.email,
                contact: user.phone || 'no contact'
            });
        } else {
            // Update total visits or details if needed
            guestDoc.totalVisits = (guestDoc.totalVisits || 0) + 1;
            await guestDoc.save();
        }

        const roomId = room._id || room;

        const booking = await Booking.create({
            guest: guestDoc._id,
            room: roomId,
            checkInDate: new Date(checkIn),
            checkOutDate: new Date(checkOut),
            numberOfGuests: guests || 1,
            totalAmount: totalAmount || 0,
            bookingStatus: status || 'pending',
            paymentStatus: paymentStatus || 'pending',
            specialRequest: specialRequests || ''
        });

        // Update room status
        await Room.findByIdAndUpdate(roomId, { status: 'reserved' });

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

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('guest room');
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
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

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
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