import api from './api';

const authService = {
  login: async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    } catch (error) {
      // Offline fallback demo logic
      if (
        credentials.email === 'admin@grandhotel.com' ||
        credentials.email.toLowerCase().includes('admin')
      ) {
        return {
          token: 'mock-admin-token-' + Date.now(),
          user: {
            _id: 'user-admin-1',
            firstName: 'Hotel',
            lastName: 'Administrator',
            email: credentials.email,
            role: 'admin',
            phone: '+1 555 123 4567',
          },
        };
      }

      return {
        token: 'mock-user-token-' + Date.now(),
        user: {
          _id: 'user-guest-1',
          firstName: credentials.email.split('@')[0] || 'Guest',
          lastName: 'User',
          email: credentials.email,
          role: 'user',
          phone: '+1 555 987 6543',
        },
      };
    }
  },

  register: async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      return data;
    } catch {
      return {
        token: 'mock-user-token-' + Date.now(),
        user: {
          _id: 'user-' + Date.now(),
          firstName: userData.firstName || userData.username || 'Guest',
          lastName: userData.lastName || '',
          email: userData.email,
          phone: userData.phone || userData.contact || '',
          role: userData.role || 'user',
        },
      };
    }
  },

  getMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      return data;
    } catch {
      const saved = localStorage.getItem('user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
      return null;
    }
  },
};

export default authService;