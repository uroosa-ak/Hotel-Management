import api from './api';

const notificationService = {
  getAll: async () => {
    const { data } = await api.get('/notifications');
    return Array.isArray(data) ? data : data?.notifications || [];
  },
  create: async (payload) => {
    const { data } = await api.post('/notifications', payload);
    return data;
  },
  markRead: async (id) => {
    const { data } = await api.put(`/notifications/${id}`, { read: true });
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },
};

export default notificationService;
