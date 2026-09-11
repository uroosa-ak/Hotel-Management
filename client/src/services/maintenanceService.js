import api from './api';

const maintenanceService = {
  getAll: async () => {
    try {
      const { data } = await api.get('/maintenance');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  create: async (requestData) => {
    const { data } = await api.post('/maintenance', requestData);
    return data;
  },

  update: async (id, updateData) => {
    const { data } = await api.put(`/maintenance/${id}`, updateData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/maintenance/${id}`);
    return data;
  },
};

export default maintenanceService;
