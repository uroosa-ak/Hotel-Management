import api from './api';

const INITIAL_BOOKINGS = [
  {
    _id: 'book-1',
    room: {
      _id: 'room-1',
      name: 'Deluxe Ocean View King',
      roomNumber: '101',
      type: 'Deluxe',
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop'],
    },
    user: {
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@example.com',
      phone: '+1 555 234 5678',
    },
    checkIn: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    guests: 2,
    totalAmount: 747,
    status: 'confirmed',
    paymentStatus: 'paid',
    specialRequests: 'High floor preferred and early check-in at 1:00 PM if possible.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'book-2',
    room: {
      _id: 'room-2',
      name: 'Executive Garden Suite',
      roomNumber: '205',
      type: 'Suite',
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop'],
    },
    user: {
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarah@example.com',
      phone: '+1 555 987 6543',
    },
    checkIn: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    guests: 3,
    totalAmount: 1556,
    status: 'pending',
    paymentStatus: 'unpaid',
    specialRequests: 'Extra pillows and airport pickup.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const getStoredBookings = () => {
  const stored = localStorage.getItem('grand_hotel_bookings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_BOOKINGS;
    }
  }
  localStorage.setItem('grand_hotel_bookings', JSON.stringify(INITIAL_BOOKINGS));
  return INITIAL_BOOKINGS;
};

const saveBookings = (bookings) => {
  localStorage.setItem('grand_hotel_bookings', JSON.stringify(bookings));
};

const bookingService = {
  getAll: async () => {
    try {
      const { data } = await api.get('/booking');
      if (Array.isArray(data) && data.length > 0) return data;
      return getStoredBookings();
    } catch {
      return getStoredBookings();
    }
  },

  getMyBookings: async () => {
    try {
      const { data } = await api.get('/booking/my');
      if (Array.isArray(data)) return data;
      return getStoredBookings();
    } catch {
      return getStoredBookings();
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/booking/${id}`);
      if (data) return data;
      const bookings = getStoredBookings();
      return bookings.find((b) => b._id === id);
    } catch {
      const bookings = getStoredBookings();
      return bookings.find((b) => b._id === id);
    }
  },

  create: async (bookingData) => {
    try {
      const { data } = await api.post('/booking', bookingData);
      return data;
    } catch {
      const bookings = getStoredBookings();
      const newBooking = {
        ...bookingData,
        _id: 'book-' + Date.now(),
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };
      const updated = [newBooking, ...bookings];
      saveBookings(updated);
      return newBooking;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const { data } = await api.put(`/booking/${id}/status`, { status });
      return data;
    } catch {
      const bookings = getStoredBookings();
      const updated = bookings.map((b) => (b._id === id ? { ...b, status } : b));
      saveBookings(updated);
      return updated.find((b) => b._id === id);
    }
  },

  cancel: async (id) => {
    try {
      const { data } = await api.put(`/booking/${id}/cancel`);
      return data;
    } catch {
      const bookings = getStoredBookings();
      const updated = bookings.map((b) =>
        b._id === id ? { ...b, status: 'cancelled' } : b
      );
      saveBookings(updated);
      return updated.find((b) => b._id === id);
    }
  },

  delete: async (id) => {
    try {
      const { data } = await api.delete(`/booking/${id}`);
      return data;
    } catch {
      const bookings = getStoredBookings();
      const updated = bookings.filter((b) => b._id !== id);
      saveBookings(updated);
      return { success: true };
    }
  },
};

export default bookingService;