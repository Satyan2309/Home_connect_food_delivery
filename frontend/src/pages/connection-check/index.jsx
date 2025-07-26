import React from 'react';
import ConnectionStatus from '../../components/ConnectionStatus';

const ConnectionCheckPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">API Connection Check</h1>
      
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-gray-700">
          This page demonstrates how to check if your frontend application is properly connected to the backend API server.
          The connection status is determined by making a request to the <code>/api/health</code> endpoint.
        </p>
        
        <ConnectionStatus />
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">How it works:</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>The frontend makes a request to the backend's <code>/api/health</code> endpoint</li>
            <li>If the request succeeds, the connection is established</li>
            <li>If the request fails, there might be an issue with the backend server or network</li>
          </ol>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Troubleshooting:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ensure the backend server is running</li>
            <li>Check that the API URL in your environment variables is correct</li>
            <li>Verify network connectivity between frontend and backend</li>
            <li>Check for CORS issues in the browser console</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCheckPage;