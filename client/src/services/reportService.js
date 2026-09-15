import api from './api';

const reportService = {
  occupancy: async () => (await api.get('/reports/occupancy')).data,
  revenue: async (params = {}) => (await api.get('/reports/revenue', { params })).data,
  reservations: async (params = {}) => (await api.get('/reports/reservations', { params })).data,
  guests: async () => (await api.get('/reports/guests')).data,
  staff: async () => (await api.get('/reports/staff')).data,
  housekeeping: async () => (await api.get('/reports/housekeeping')).data,
  maintenance: async () => (await api.get('/reports/maintenance')).data,
  services: async () => (await api.get('/reports/services')).data,
  feedback: async () => (await api.get('/reports/feedback')).data,
  trends: async () => (await api.get('/reports/trends')).data,
  popular: async () => (await api.get('/reports/popular')).data,
};

export default reportService;
