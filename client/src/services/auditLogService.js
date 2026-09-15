import api from './api';

const auditLogService = {
  getAll: async (params = {}) => (await api.get('/audit-logs', { params })).data,
};

export default auditLogService;
