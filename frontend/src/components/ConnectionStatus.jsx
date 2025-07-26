import React, { useState, useEffect } from 'react';
import connectionService from '../utils/connectionService';

const ConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    status: 'checking',
    message: 'Checking connection...',
    loading: true
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const status = await connectionService.checkConnection();
        setConnectionStatus({
          ...status,
          loading: false
        });
      } catch (error) {
        setConnectionStatus({
          connected: false,
          status: 'error',
          message: 'Error checking connection',
          loading: false
        });
      }
    };

    checkConnection();
  }, []);

  const handleRetry = async () => {
    setConnectionStatus({
      ...connectionStatus,
      loading: true,
      message: 'Checking connection...'
    });
    
    try {
      const status = await connectionService.checkConnection();
      setConnectionStatus({
        ...status,
        loading: false
      });
    } catch (error) {
      setConnectionStatus({
        connected: false,
        status: 'error',
        message: 'Error checking connection',
        loading: false
      });
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-md max-w-md mx-auto my-4">
      <h2 className="text-xl font-semibold mb-4">API Connection Status</h2>
      
      <div className={`p-3 rounded-md ${connectionStatus.connected 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'}`}>
        
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${connectionStatus.loading 
            ? 'bg-yellow-500' 
            : connectionStatus.connected 
              ? 'bg-green-500' 
              : 'bg-red-500'}`}>
          </div>
          
          <span className="font-medium">
            {connectionStatus.loading 
              ? 'Checking...' 
              : connectionStatus.connected 
                ? 'Connected' 
                : 'Disconnected'}
          </span>
        </div>
        
        <p className="mt-2">{connectionStatus.message}</p>
        
        {!connectionStatus.connected && !connectionStatus.loading && (
          <button 
            onClick={handleRetry}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry Connection
          </button>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Status code: {connectionStatus.status}</p>
        <p className="mt-1">API URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</p>
      </div>
    </div>
  );
};

export default ConnectionStatus;