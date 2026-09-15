import api from './api';

const guestService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/guest', { params });
    return Array.isArray(data) ? data : data?.guests || [];
  },
  create: async (guestData) => {
    const { data } = await api.post('/guest', guestData);
    return data;
  },
  update: async (id, guestData) => {
    const { data } = await api.put(`/guest/${id}`, guestData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/guest/${id}`);
    return data;
  },
};

export default guestService;
