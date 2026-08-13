import api from './api';

const roomService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/rooms', { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/rooms/${id}`);
    return data;
  },
  create: async (roomData) => {
    const { data } = await api.post('/rooms', roomData);
    return data;
  },
  update: async (id, roomData) => {
    const { data } = await api.put(`/rooms/${id}`, roomData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/rooms/${id}`);
    return data;
  },
};

export default roomService;