import api from './api';

const taxService = {
  getAll: async () => {
    const { data } = await api.get('/taxes');
    return Array.isArray(data) ? data : data?.taxes || [];
  },
  create: async (payload) => {
    const { data } = await api.post('/taxes', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/taxes/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/taxes/${id}`);
    return data;
  },
};

export default taxService;
