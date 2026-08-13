import api from './api';

// User service functions
const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user profile';
    }
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update user profile';
    }
  },

  // Update user password
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update password';
    }
  },

  // Add delivery address
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/users/addresses', addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add address';
    }
  },

  // Update delivery address
  updateAddress: async (id, addressData) => {
    try {
      const response = await api.put(`/users/addresses/${id}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update address';
    }
  },

  // Delete delivery address
  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/users/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete address';
    }
  },

  // Update user preferences
  updatePreferences: async (preferencesData) => {
    try {
      const response = await api.put('/users/preferences', preferencesData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update preferences';
    }
  },
  
  // Delete user account
  deleteAccount: async () => {
    try {
      const response = await api.delete('/users/account');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete account';
    }
  },
};

export default userService;