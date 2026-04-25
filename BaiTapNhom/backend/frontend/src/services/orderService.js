import api from './api';

export const orderService = {
  create: (data) => api.post('/orders', data),
  
  getAll: (userId) => {
    const params = userId ? { userId } : {};
    return api.get('/orders', { params });
  },
  
  getById: (id) => api.get(`/orders/${id}`),
  
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default orderService;
