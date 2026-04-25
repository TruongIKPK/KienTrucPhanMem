import api from './api';

export const foodService = {
  getAll: () => api.get('/foods'),
  
  getById: (id) => api.get(`/foods/${id}`),
  
  create: (data) => api.post('/foods', data),
  
  update: (id, data) => api.put(`/foods/${id}`, data),
  
  delete: (id) => api.delete(`/foods/${id}`),
};

export default foodService;
