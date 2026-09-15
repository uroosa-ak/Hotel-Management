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

  assign: async (id, assignedTo) => {
    const { data } = await api.patch(`/maintenance/${id}/assign`, { assignedTo });
    return data;
  },

  resolve: async (id, resolutionNotes) => {
    const { data } = await api.patch(`/maintenance/${id}/resolve`, { resolutionNotes });
    return data;
  },
};

export default maintenanceService;
