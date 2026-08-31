const Room = require("../models/Room");

// Mapping helper to translate MongoDB Room schema to client expected structure
function mapRoomToClient(room) {
    if (!room) return null;
    const r = room.toObject ? room.toObject() : room;
    return {
        _id: r._id,
        name: r.name || `Room ${r.roomNumber}`,
        roomNumber: r.roomNumber,
        type: r.roomType ? (r.roomType.charAt(0).toUpperCase() + r.roomType.slice(1)) : 'Deluxe',
        pricePerNight: r.price,
        capacity: r.capacity,
        size: r.size || (r.roomType === 'suite' ? 65 : r.roomType === 'deluxe' ? 42 : 28),
        bedType: r.bedType || (r.roomType === 'suite' ? 'King' : r.roomType === 'deluxe' ? 'King' : 'Queen'),
        view: r.view || (r.roomType === 'suite' ? 'Skyline & Ocean' : r.roomType === 'deluxe' ? 'Ocean' : 'City'),
        isAvailable: r.availability !== undefined ? r.availability : true,
        rating: r.rating || 4.8,
        reviewsCount: r.reviewsCount || 24,
        description: r.description || 'No description available',
        amenities: r.amenities || [],
        images: r.image ? [r.image] : ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop']
    };
}

// Create room
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(mapRoomToClient(room));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
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
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(mapRoomToClient(room));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(mapRoomToClient(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};