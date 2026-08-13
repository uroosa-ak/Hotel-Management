import api from './api';

const userService = {
  getAll: async () => {
    const { data } = await api.get('/user');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/user/${id}`);
    return data;
  },
  updateProfile: async (profileData) => {
    const { data } = await api.put('/user/profile/update', profileData);
    return data;
  },
  changePassword: async (passwordData) => {
    const { data } = await api.put('/user/profile/password', passwordData);
    return data;
  },
  updateUser: async (id, userData) => {
    const { data } = await api.put(`/user/${id}`, userData);
    return data;
  },
  deleteUser: async (id) => {
    const { data } = await api.delete(`/user/${id}`);
    return data;
  },
};

export default userService;