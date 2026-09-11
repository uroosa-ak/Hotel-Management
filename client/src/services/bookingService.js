import api from './api';

const bookingService = {
  getAll: async () => {
    const { data } = await api.get('/booking');
    return Array.isArray(data) ? data : [];
  },

  getMyBookings: async () => {
    const { data } = await api.get('/booking/my/bookings');
    return Array.isArray(data) ? data : [];
  },

  getById: async (id) => {
    const { data } = await api.get(`/booking/${id}`);
    return data;
  },

  create: async (bookingData) => {
    const { data } = await api.post('/booking', bookingData);
    return data;
  },

  update: async (id, bookingData) => {
    const { data } = await api.put(`/booking/${id}`, bookingData);
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/booking/${id}/status`, { status });
    return data;
  },

  cancel: async (id) => {
    const { data } = await api.patch(`/booking/${id}/cancel`);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/booking/${id}`);
    return data;
  },
};

export default bookingService;