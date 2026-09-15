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
    description: r.description || 'Luxurious accommodations with premium amenities.',
    amenities: r.amenities || ['High-speed Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar'],
    images: (r.images && r.images.length > 0) ? r.images : (r.image ? [r.image] : ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop'])
  };
}

// Create room
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, name, roomType, type, price, pricePerNight, floor, capacity, size, bedType, view, description, amenities, status, images } = req.body;

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

    const imageList = Array.isArray(images) ? images : (images ? [images] : []);

    const newRoom = await Room.create({
      roomNumber: finalRoomNumber,
      name: (name && name.trim()) || `${finalType.charAt(0).toUpperCase() + finalType.slice(1)} Room ${finalRoomNumber}`,
      roomType: finalType,
      floor: floor || 1,
      capacity: capacity || 2,
      size: size || 30,
      bedType: bedType || 'Queen',
      view: view || 'City',
      price: Number(finalPrice),
      status: status || 'available',
      availability: status ? status === 'available' : true,
      description: description || 'Luxurious accommodations with premium amenities.',
      amenities: Array.isArray(amenities) ? amenities : ['High-speed Wi-Fi', 'Air Conditioning'],
      images: imageList,
      image: imageList[0] || '/images/rooms/room-01.jpg'
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
    const { roomNumber, name, roomType, type, price, pricePerNight, floor, capacity, size, bedType, view, description, amenities, status, images } = req.body;
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

    if (name !== undefined) update.name = name;
    if (floor !== undefined) update.floor = floor;
    if (capacity !== undefined) update.capacity = capacity;
    if (size !== undefined) update.size = size;
    if (bedType !== undefined) update.bedType = bedType;
    if (view !== undefined) update.view = view;
    if (description !== undefined) update.description = description;
    if (amenities !== undefined) update.amenities = amenities;
    if (images !== undefined) {
      const imageList = Array.isArray(images) ? images : (images ? [images] : []);
      update.images = imageList;
      if (imageList[0]) update.image = imageList[0];
    }

    if (status !== undefined) {
      update.status = status;
      update.currentStatus = status;
      update.availability = status === 'available';
      try {
        const socketService = require('../services/socketService');
        socketService.emitRoomStatus(req.params.id, status, req.user?.firstName || 'Staff');
      } catch (sockErr) {
        // Socket broadcast fallback
      }
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