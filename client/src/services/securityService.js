import api from './api';

const securityService = {
  getLoginHistory: async (userId) => (await api.get('/security/login-history', { params: userId ? { userId } : {} })).data,
  getLockedAccounts: async () => (await api.get('/security/locked-accounts')).data,
  unlockAccount: async (id) => (await api.patch(`/security/unlock/${id}`)).data,
};

export default securityService;
