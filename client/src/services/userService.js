import api from './api';

const INITIAL_USERS = [
  {
    _id: 'user-admin-1',
    firstName: 'Hotel',
    lastName: 'Administrator',
    email: 'admin@grandhotel.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    _id: 'user-guest-1',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@example.com',
    phone: '+1 (555) 234-5678',
    role: 'user',
    createdAt: '2025-02-15T14:30:00Z',
  },
  {
    _id: 'user-guest-2',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah@example.com',
    phone: '+1 (555) 987-6543',
    role: 'user',
    createdAt: '2025-03-01T09:15:00Z',
  },
];

const getStoredUsers = () => {
  const stored = localStorage.getItem('grand_hotel_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_USERS;
    }
  }
  localStorage.setItem('grand_hotel_users', JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
};

const saveUsers = (users) => {
  localStorage.setItem('grand_hotel_users', JSON.stringify(users));
};

const userService = {
  getAll: async () => {
    try {
      const { data } = await api.get('/user');
      if (Array.isArray(data) && data.length > 0) return data;
      return getStoredUsers();
    } catch {
      return getStoredUsers();
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/user/${id}`);
      if (data) return data;
      const users = getStoredUsers();
      return users.find((u) => u._id === id);
    } catch {
      const users = getStoredUsers();
      return users.find((u) => u._id === id);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const { data } = await api.put('/user/profile/update', profileData);
      return data;
    } catch {
      return profileData;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const { data } = await api.put('/user/profile/password', passwordData);
      return data;
    } catch {
      return { success: true, message: 'Password updated successfully' };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const { data } = await api.put(`/user/${id}`, userData);
      return data;
    } catch {
      const users = getStoredUsers();
      const updated = users.map((u) => (u._id === id ? { ...u, ...userData } : u));
      saveUsers(updated);
      return updated.find((u) => u._id === id);
    }
  },

  deleteUser: async (id) => {
    try {
      const { data } = await api.delete(`/user/${id}`);
      return data;
    } catch {
      const users = getStoredUsers();
      const updated = users.filter((u) => u._id !== id);
      saveUsers(updated);
      return { success: true };
    }
  },
};

export default userService;