const Room = require("../models/Room");
const { validateRoomNumber, validatePrice } = require("../utils/validators");

function mapRoomToClient(room) {
  if (!room) return null;
  const r = room.toObject ? room.toObject() : room;
  return {
    _id: r._id,
    name: r.name || `Room ${r.roomNumber}`,
    roomNumber: r.roomNumber,
    type: r.roomType ? (r.roomType.charAt(0).toUpperCase() + r.roomType.slice(1)) : 'Deluxe',
    roomType: r.roomType || 'deluxe',
    pricePerNight: r.price,
    price: r.price,
    floor: r.floor || 1,
    capacity: r.capacity || 2,
    size: r.size || (r.roomType === 'suite' ? 65 : r.roomType === 'deluxe' ? 42 : 28),
    bedType: r.bedType || (r.roomType === 'suite' ? 'King' : r.roomType === 'deluxe' ? 'King' : 'Queen'),
    view: r.view || (r.roomType === 'suite' ? 'Skyline & Ocean' : r.roomType === 'deluxe' ? 'Ocean' : 'City'),
    status: r.status || 'available',
    isAvailable: r.status === 'available' && (r.availability !== undefined ? r.availability : true),
    rating: r.rating || 4.8,
    reviewsCount: r.reviewsCount || 24,
    description: r.description || 'Luxurious accommodations with premium amenities.',
    amenities: r.amenities || ['High-speed Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar'],
    images: (r.images && r.images.length > 0) ? r.images : (r.image ? [r.image] : ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop'])
  };
}

// Create room
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, type, price, pricePerNight, floor, capacity, description, amenities, status, images } = req.body;

    const finalRoomNumber = roomNumber ? String(roomNumber).trim() : null;
    if (!validateRoomNumber(finalRoomNumber)) {
      return res.status(400).json({ message: "Invalid room number format." });
    }

    const finalPrice = price !== undefined ? price : pricePerNight;
    if (!validatePrice(finalPrice)) {
      return res.status(400).json({ message: "Valid room price is required." });
    }

    const existing = await Room.findOne({ roomNumber: finalRoomNumber });
    if (existing) {
      return res.status(409).json({ message: `Room number ${finalRoomNumber} already exists.` });
    }

    const rawType = (roomType || type || 'deluxe').toLowerCase();
    const validTypes = ['single', 'double', 'deluxe', 'suite'];
    const finalType = validTypes.includes(rawType) ? rawType : 'deluxe';

    const newRoom = await Room.create({
      roomNumber: finalRoomNumber,
      roomType: finalType,
      floor: floor || 1,
      capacity: capacity || 2,
      price: Number(finalPrice),
      status: status || 'available',
      availability: status ? status === 'available' : true,
      description: description || 'Luxurious accommodations with premium amenities.',
      amenities: Array.isArray(amenities) ? amenities : ['High-speed Wi-Fi', 'Air Conditioning'],
      image: (Array.isArray(images) && images.length > 0) ? images[0] : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop'
    });

    res.status(201).json(mapRoomToClient(newRoom));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const { type, status, available } = req.query;
    const filter = {};

    if (type) {
      filter.roomType = type.toLowerCase();
    }
    if (status) {
      filter.status = status.toLowerCase();
    }
    if (available === 'true') {
      filter.status = 'available';
    }

    const rooms = await Room.find(filter).sort({ roomNumber: 1 });
    res.json(rooms.map(mapRoomToClient));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    res.json(mapRoomToClient(room));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, type, price, pricePerNight, floor, capacity, description, amenities, status } = req.body;
    const update = {};

    if (roomNumber !== undefined) {
      if (!validateRoomNumber(roomNumber)) {
        return res.status(400).json({ message: "Invalid room number format." });
      }
      update.roomNumber = String(roomNumber).trim();
    }

    const finalPrice = price !== undefined ? price : pricePerNight;
    if (finalPrice !== undefined) {
      if (!validatePrice(finalPrice)) {
        return res.status(400).json({ message: "Invalid room price." });
      }
      update.price = Number(finalPrice);
    }

    if (roomType || type) {
      const rawType = (roomType || type).toLowerCase();
      update.roomType = ['single', 'double', 'deluxe', 'suite'].includes(rawType) ? rawType : 'deluxe';
    }

    if (floor !== undefined) update.floor = floor;
    if (capacity !== undefined) update.capacity = capacity;
    if (description !== undefined) update.description = description;
    if (amenities !== undefined) update.amenities = amenities;

    if (status !== undefined) {
      update.status = status;
      update.availability = status === 'available';
    }

    const updated = await Room.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Room not found." });
    }

    res.json(mapRoomToClient(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Room not found." });
    }
    res.json({ message: "Room removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};