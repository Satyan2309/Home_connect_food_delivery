import api from './api';

// Connection service to check API connectivity
const connectionService = {
  // Check if the API server is connected
  checkConnection: async () => {
    try {
      // Make a simple request to the server health endpoint
      // This endpoint is implemented on the backend
      const response = await api.get('/health');
      return {
        connected: true,
        status: response.status,
        message: response.data.message || 'Connected to server'
      };
    } catch (error) {
      // If there's a network error or the server is down
      if (!error.response) {
        return {
          connected: false,
          status: 'network_error',
          message: 'Cannot connect to server. Please check your internet connection.'
        };
      }
      
      // If there's a response but with an error status
      return {
        connected: false,
        status: error.response.status,
        message: error.response?.data?.message || 'Server error'
      };
    }
  },
  
  // A simpler version that just returns a boolean
  isConnected: async () => {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      console.error('API connection error:', error);
      return false;
    }
  }
};

export default connectionService;