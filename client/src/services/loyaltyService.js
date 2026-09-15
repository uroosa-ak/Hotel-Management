import api from './api';

const loyaltyService = {
  getAll: async () => {
    const { data } = await api.get('/loyalty');
    return Array.isArray(data) ? data : data?.records || [];
  },
  create: async (payload) => {
    const { data } = await api.post('/loyalty', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/loyalty/${id}`, payload);
    return data;
  },
};

export default loyaltyService;
