import api from './api';

const bookingService = {
  getAll: async () => {
    const { data } = await api.get('/booking');
    return data;
  },
  getMyBookings: async () => {
    const { data } = await api.get('/booking/my');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/booking/${id}`);
    return data;
  },
  create: async (bookingData) => {
    const { data } = await api.post('/booking', bookingData);
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await api.put(`/booking/${id}/status`, { status });
    return data;
  },
  cancel: async (id) => {
    const { data } = await api.put(`/booking/${id}/cancel`);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/booking/${id}`);
    return data;
  },
};

export default bookingService;