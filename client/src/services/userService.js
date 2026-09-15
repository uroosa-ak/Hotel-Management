import api from './api';

const userService = {
  getAll: async (role) => {
    const params = role ? { role } : {};
    const { data } = await api.get('/user/all', { params });
    return Array.isArray(data) ? data : [];
  },

  getProfile: async () => {
    const { data } = await api.get('/user/profile');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/user/profile', profileData);
    return data;
  },

  changePassword: async (passwordData) => {
    const { data } = await api.put('/user/change-password', passwordData);
    return data;
  },

  createStaff: async (staffData) => {
    const { data } = await api.post('/user/staff', staffData);
    return data;
  },

  updateUser: async (id, updateData) => {
    const { data } = await api.put(`/user/${id}`, updateData);
    return data;
  },

  toggleStatus: async (id) => {
    const { data } = await api.patch(`/user/${id}/toggle-status`);
    return data;
  },

  deleteUser: async (id) => {
    const { data } = await api.delete(`/user/${id}`);
    return data;
  },
};

export default userService;
