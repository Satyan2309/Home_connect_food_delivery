import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketIO = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketIO.on('connect', () => {
      console.log('✅ Socket connected:', socketIO.id);
      setConnected(true);
    });

    socketIO.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    socketIO.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socketIO);

    return () => socketIO.close();
  }, []);

  const value = {
    socket,
    connected
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
