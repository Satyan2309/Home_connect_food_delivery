import api from './api';

// Order service functions
const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create order';
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch order details';
    }
  },

  // Get user's orders (for customers)
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders/myorders');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch your orders';
    }
  },

  // Get chef's orders (for chefs)
  getChefOrders: async () => {
    try {
      const response = await api.get('/orders/chef');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch chef orders';
    }
  },

  // Update order status (for chefs)
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update order status';
    }
  },

  // Cancel order (for customers)
  cancelOrder: async (id, reason) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to cancel order';
    }
  },
};

export default orderService;