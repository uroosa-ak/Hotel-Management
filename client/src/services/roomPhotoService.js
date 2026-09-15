import api from './api';

const roomPhotoService = {
  getAll: async (roomId) => {
    const { data } = await api.get('/roomphotos', { params: roomId ? { room: roomId } : {} });
    return Array.isArray(data) ? data : data?.photos || [];
  },
  create: async (payload) => {
    const { data } = await api.post('/roomphotos', payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/roomphotos/${id}`);
    return data;
  },
};

export default roomPhotoService;
