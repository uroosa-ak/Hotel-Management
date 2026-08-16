import api from './api';

// Initial mock rooms for offline/development fallback
const INITIAL_ROOMS = [
  {
    _id: 'room-1',
    name: 'Deluxe Ocean View King',
    roomNumber: '101',
    type: 'Deluxe',
    pricePerNight: 249,
    capacity: 2,
    size: 42,
    bedType: 'King',
    view: 'Ocean',
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 38,
    description: 'Breathtaking panoramic ocean views, private balcony, plush king bed, marble bathroom with rainfall shower and soaking tub.',
    amenities: ['High-speed Wi-Fi', 'Balcony', 'Ocean View', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Espresso Machine', '24/7 Room Service'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop',
    ],
  },
  {
    _id: 'room-2',
    name: 'Executive Garden Suite',
    roomNumber: '205',
    type: 'Suite',
    pricePerNight: 389,
    capacity: 3,
    size: 65,
    bedType: 'King + Sofa Bed',
    view: 'Garden',
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 29,
    description: 'Spacious suite featuring a separate living room, botanical garden patio, designer furnishings, and dedicated butler service.',
    amenities: ['Free High-Speed Wi-Fi', 'Private Garden Patio', 'Living Room Area', 'Work Desk', 'Mini Bar', 'Bathtub', 'Smart TV', 'Luxury Toiletries'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop',
    ],
  },
  {
    _id: 'room-3',
    name: 'Royal Presidential Suite',
    roomNumber: '501',
    type: 'Presidential',
    pricePerNight: 799,
    capacity: 4,
    size: 120,
    bedType: '2 King Beds',
    view: 'Skyline & Ocean',
    isAvailable: true,
    rating: 5.0,
    reviewsCount: 52,
    description: 'The pinnacle of luxury. Penthouse level with private jacuzzi on expansive terrace, dining room for 8, grand piano, and airport limo transfer included.',
    amenities: ['Private Jacuzzi', 'Terrace', 'VIP Airport Transfer', 'Complimentary Champagne', 'Chef On Request', '24/7 Butler', 'High-speed Wi-Fi', 'Home Theater'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop',
    ],
  },
  {
    _id: 'room-4',
    name: 'Classic Urban Standard',
    roomNumber: '108',
    type: 'Standard',
    pricePerNight: 149,
    capacity: 2,
    size: 28,
    bedType: 'Queen',
    view: 'City',
    isAvailable: true,
    rating: 4.6,
    reviewsCount: 44,
    description: 'Modern and quiet room equipped with premium bedding, smart climate control, ergonomic workstation, and walk-in rain shower.',
    amenities: ['Free Wi-Fi', 'Smart TV', 'Ergonomic Desk', 'Coffee Maker', 'In-room Safe', 'Air Conditioning', 'Soundproofing'],
    images: [
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
    ],
  },
  {
    _id: 'room-5',
    name: 'Family Deluxe Two-Bedroom',
    roomNumber: '302',
    type: 'Family',
    pricePerNight: 420,
    capacity: 5,
    size: 78,
    bedType: '1 King + 2 Twins',
    view: 'Pool',
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 31,
    description: 'Ideal for families traveling with children. Interconnecting bedrooms, kitchenette, gaming console, and direct access to pool promenade.',
    amenities: ['Two Bedrooms', 'Kitchenette', 'Gaming Console', 'Pool Access', 'Kids Amenities', 'Free Wi-Fi', 'Washing Machine'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop',
    ],
  },
  {
    _id: 'room-6',
    name: 'Panorama Suite Corner View',
    roomNumber: '404',
    type: 'Suite',
    pricePerNight: 340,
    capacity: 2,
    size: 52,
    bedType: 'King',
    view: 'Ocean & Sunset',
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 22,
    description: 'Floor-to-ceiling corner glass windows offering unforgettable sunset vistas over the coastline, automated black-out blinds, and cocktail bar.',
    amenities: ['Corner Sunset View', 'Cocktail Bar', 'Free Wi-Fi', 'Smart Lighting', 'Bathrobe & Slippers', 'Bose Sound System'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
    ],
  },
];

const getStoredRooms = () => {
  const stored = localStorage.getItem('grand_hotel_rooms');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ROOMS;
    }
  }
  localStorage.setItem('grand_hotel_rooms', JSON.stringify(INITIAL_ROOMS));
  return INITIAL_ROOMS;
};

const saveRooms = (rooms) => {
  localStorage.setItem('grand_hotel_rooms', JSON.stringify(rooms));
};

const roomService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/rooms', { params });
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return getStoredRooms();
    } catch {
      let rooms = getStoredRooms();
      if (params.type && params.type !== '') {
        rooms = rooms.filter((r) => r.type.toLowerCase() === params.type.toLowerCase());
      }
      if (params.guests) {
        rooms = rooms.filter((r) => r.capacity >= parseInt(params.guests, 10));
      }
      if (params.available === 'true') {
        rooms = rooms.filter((r) => r.isAvailable);
      }
      return rooms;
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/rooms/${id}`);
      if (data) return data;
      const rooms = getStoredRooms();
      return rooms.find((r) => r._id === id || String(r.roomNumber) === String(id)) || rooms[0];
    } catch {
      const rooms = getStoredRooms();
      return rooms.find((r) => r._id === id || String(r.roomNumber) === String(id)) || rooms[0];
    }
  },

  create: async (roomData) => {
    try {
      const { data } = await api.post('/rooms', roomData);
      return data;
    } catch {
      const rooms = getStoredRooms();
      const newRoom = {
        ...roomData,
        _id: 'room-' + Date.now(),
        rating: 5.0,
        reviewsCount: 0,
        images: roomData.images && roomData.images.length > 0 ? roomData.images : [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop'
        ],
      };
      const updated = [newRoom, ...rooms];
      saveRooms(updated);
      return newRoom;
    }
  },

  update: async (id, roomData) => {
    try {
      const { data } = await api.put(`/rooms/${id}`, roomData);
      return data;
    } catch {
      const rooms = getStoredRooms();
      const updated = rooms.map((r) => (r._id === id ? { ...r, ...roomData } : r));
      saveRooms(updated);
      return updated.find((r) => r._id === id);
    }
  },

  delete: async (id) => {
    try {
      const { data } = await api.delete(`/rooms/${id}`);
      return data;
    } catch {
      const rooms = getStoredRooms();
      const updated = rooms.filter((r) => r._id !== id);
      saveRooms(updated);
      return { success: true };
    }
  },
};

export default roomService;