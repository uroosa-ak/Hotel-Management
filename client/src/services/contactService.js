import api from './api';

const contactService = {
  send: async (payload) => {
    const { data } = await api.post('/contact', payload);
    return data;
  },

  getAll: async (params = {}) => {
    const { data } = await api.get('/contact', { params });
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await api.put(`/contact/${id}`, { status });
    return data;
  },
};

export default contactService;
