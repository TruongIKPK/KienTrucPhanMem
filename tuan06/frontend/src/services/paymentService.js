import api from './api';

export const paymentService = {
  processPayment: (data) => api.post('/payments', data),
  
  getByOrderId: (orderId) => api.get(`/payments/${orderId}`),
};

export default paymentService;
