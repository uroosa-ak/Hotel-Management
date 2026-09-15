import api from './api';

const promotionService = {
  getAll: async () => {
    const { data } = await api.get('/promotions');
    return Array.isArray(data) ? data : data?.promotions || [];
  },
  create: async (payload) => {
    const { data } = await api.post('/promotions', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/promotions/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/promotions/${id}`);
    return data;
  },
};

export default promotionService;
