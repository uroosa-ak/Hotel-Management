import api from './api';

const feedbackService = {
  getMine: async () => {
    const { data } = await api.get('/feedback/mine');
    return Array.isArray(data) ? data : [];
  },
  getAll: async (params = {}) => {
    const { data } = await api.get('/feedback', { params });
    return Array.isArray(data) ? data : data?.feedbacks || [];
  },
  getById: async (id) => {
    const { data } = await api.get(`/feedback/${id}`);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/feedback/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/feedback/${id}`);
    return data;
  },
};

export default feedbackService;
