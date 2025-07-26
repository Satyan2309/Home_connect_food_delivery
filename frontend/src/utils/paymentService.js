import api from './api';

// Payment service functions
const paymentService = {
  // Create payment intent (for Stripe)
  createPaymentIntent: async (orderData) => {
    try {
      const response = await api.post('/api/payment/create-payment-intent', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create payment intent';
    }
  },

  // Confirm payment
  confirmPayment: async (paymentData) => {
    try {
      const response = await api.post('/api/payment/confirm', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to confirm payment';
    }
  },

  // Get payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/api/payment/methods');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch payment methods';
    }
  },

  // Add payment method
  addPaymentMethod: async (paymentMethodData) => {
    try {
      const response = await api.post('/api/payment/methods', paymentMethodData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add payment method';
    }
  },

  // Delete payment method
  deletePaymentMethod: async (id) => {
    try {
      const response = await api.delete(`/api/payment/methods/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete payment method';
    }
  },
};

export default paymentService;