import api from './api';

const DEFAULT_ROOMS = [
  {
    _id: 'room-101',
    name: 'Deluxe Ocean View King',
    roomNumber: '101',
    type: 'Deluxe',
    roomType: 'deluxe',
    pricePerNight: 249,
    price: 249,
    capacity: 2,
    size: 42,
    bedType: 'King',
    view: 'Ocean',
    status: 'available',
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 38,
    description: 'Breathtaking panoramic ocean views, private balcony, plush king bed, marble bathroom with rainfall shower and soaking tub.',
    amenities: ['High-speed Wi-Fi', 'Balcony', 'Ocean View', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', '24/7 Room Service'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop'
    ],
  },
  {
    _id: 'room-205',
    name: 'Executive Garden Suite',
    roomNumber: '205',
    type: 'Suite',
    roomType: 'suite',
    pricePerNight: 389,
    price: 389,
    capacity: 3,
    size: 65,
    bedType: 'King + Sofa Bed',
    view: 'Garden',
    status: 'available',
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 29,
    description: 'Spacious suite featuring a separate living room, botanical garden patio, designer furnishings, and dedicated butler service.',
    amenities: ['Free Wi-Fi', 'Private Patio', 'Living Room', 'Work Desk', 'Mini Bar', 'Bathtub', 'Smart TV'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop'
    ],
  },
  {
    _id: 'room-310',
    name: 'Presidential Penthouse Suite',
    roomNumber: '310',
    type: 'Suite',
    roomType: 'suite',
    pricePerNight: 799,
    price: 799,
    capacity: 4,
    size: 120,
    bedType: 'Master King + 2 Queens',
    view: 'Panoramic Coast & Skyline',
    status: 'available',
    isAvailable: true,
    rating: 5.0,
    reviewsCount: 17,
    description: 'Top-tier luxury with wrap-around terrace, private infinity plunge pool, personal chef dining area, and VIP concierge privileges.',
    amenities: ['Private Plunge Pool', 'Wrap-around Terrace', 'Personal Butler', 'Kitchenette', 'Espresso Bar', 'Wine Cooler'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop'
    ],
  }
];

const roomService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/rooms', { params });
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return DEFAULT_ROOMS;
    } catch (err) {
      console.warn('Backend rooms unreachable, using catalog fallback', err);
      return DEFAULT_ROOMS;
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/rooms/${id}`);
      if (data) return data;
      return DEFAULT_ROOMS.find((r) => r._id === id || String(r.roomNumber) === String(id)) || DEFAULT_ROOMS[0];
    } catch {
      return DEFAULT_ROOMS.find((r) => r._id === id || String(r.roomNumber) === String(id)) || DEFAULT_ROOMS[0];
    }
  },

  create: async (roomData) => {
    const { data } = await api.post('/rooms', roomData);
    return data;
  },

  update: async (id, roomData) => {
    const { data } = await api.put(`/rooms/${id}`, roomData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/rooms/${id}`);
    return data;
  },
};

export default roomService;