import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth endpoints
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/me')
};

// Menu endpoints
export const menuAPI = {
  getItems: (page = 1, limit = 20, filters = {}) =>
    apiClient.get('/menu/items', { params: { page, limit, ...filters } }),
  getMyItems: () => apiClient.get('/menu/items/my'),
  createItem: (data) => apiClient.post('/menu/items', data),
  updateItem: (itemId, data) => apiClient.put(`/menu/items/${itemId}`, data),
  deleteItem: (itemId) => apiClient.delete(`/menu/items/${itemId}`)
};

// Order endpoints
export const orderAPI = {
  createOrder: (data) => apiClient.post('/orders', data),
  getMyOrders: () => apiClient.get('/orders/my'),
  getOrderById: (orderId) => apiClient.get(`/orders/${orderId}`),
  updateOrderStatus: (orderId, status) => apiClient.put(`/orders/${orderId}/status`, { status }),
  cancelOrder: (orderId) => apiClient.put(`/orders/${orderId}/cancel`, {})
};

// Payment endpoints
export const paymentAPI = {
  createCheckoutSession: (orderId) => apiClient.post('/payments/checkout/session', { order_id: orderId }),
  getCheckoutStatus: (sessionId) => apiClient.get(`/payments/checkout/status/${sessionId}`),
  getPaymentHistory: () => apiClient.get('/payments/history'),
  refundPayment: (orderId) => apiClient.post('/payments/refund', { order_id: orderId })
};

// Review endpoints
export const reviewAPI = {
  createReview: (data) => apiClient.post('/reviews', data),
  getChefReviews: (chefId) => apiClient.get(`/reviews/chef/${chefId}`),
  getItemReviews: (itemId) => apiClient.get(`/reviews/item/${itemId}`)
};

// Chat endpoints
export const chatAPI = {
  sendMessage: (data) => apiClient.post('/chat/message', data),
  getChatHistory: (sessionId) => apiClient.get(`/chat/history/${sessionId}`)
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard/stats')
};

export default apiClient;
