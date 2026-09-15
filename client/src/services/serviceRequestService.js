import api from './api';

const serviceRequestService = {
  getCatalog: async () => {
    const { data } = await api.get('/service/catalog');
    return Array.isArray(data) ? data : [];
  },
  getMine: async () => {
    const { data } = await api.get('/servicerequests/mine');
    return Array.isArray(data) ? data : [];
  },
  create: async (payload) => {
    const { data } = await api.post('/servicerequests', payload);
    return data;
  },
};

export default serviceRequestService;
