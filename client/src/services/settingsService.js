import api from './api';

const settingsService = {
  get: async () => (await api.get('/settings')).data,
  update: async (payload) => (await api.put('/settings', payload)).data,
};

export default settingsService;
