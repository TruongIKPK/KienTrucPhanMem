import api from './api';

export const userService = {
  register: (data) => api.post('/users/register', data),
  
  login: (data) => api.post('/users/login', data),
  
  getUsers: () => api.get('/users'),
  
  getUserById: (id) => api.get(`/users/${id}`),
};

export default userService;
