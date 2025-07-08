import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket(url, events = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Conectar WebSocket
    socketRef.current = io(url, {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('access')
      }
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('WebSocket conectado');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket desconectado');
      setIsConnected(false);
    });

    // Registrar eventos personalizados
    Object.entries(events).forEach(([eventName, handler]) => {
      socket.on(eventName, handler);
    });

    return () => {
      Object.keys(events).forEach(eventName => {
        socket.off(eventName);
      });
      socket.disconnect();
    };
  }, [url]);

  const emit = (eventName, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(eventName, data);
    }
  };

  return { isConnected, emit };
}
