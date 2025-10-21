/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import WebSocketService from '../services/websocket';
import { useAuth } from './useAuth';

export function useWebSocket() {
  const { accessToken, isAuthenticated } = useAuth();
  const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (isAuthenticated && accessToken && !initialized.current) {
      console.log('Initializing WebSocketService...');
      const service = new WebSocketService(accessToken);
      setWebSocketService(service);
      initialized.current = true;

      return () => {
        console.log('Disconnecting WebSocketService...');
        service.disconnect();
        initialized.current = false;
      };
    } else if (!isAuthenticated && webSocketService) {
      // If user logs out, disconnect WebSocket
      console.log('User logged out, disconnecting WebSocketService...');
      webSocketService.disconnect();
      setWebSocketService(null);
      initialized.current = false;
    }
  }, [accessToken, isAuthenticated]);

  return webSocketService;
}
