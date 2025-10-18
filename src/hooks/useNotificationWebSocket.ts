import { useEffect, useState, useRef } from 'react';
import NotificationWebSocketService from '../services/notification-websocket';
import { useAuth } from './useAuth';
import type NotificationWebSocketServiceClass from '../services/notification-websocket';

type NotificationWebSocketServiceInstance = InstanceType<typeof NotificationWebSocketServiceClass>;

export function useNotificationWebSocket() {
  const { accessToken, isAuthenticated } = useAuth();
  const [notificationWebSocketService, setNotificationWebSocketService] = useState<NotificationWebSocketServiceInstance | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (isAuthenticated && accessToken && !initialized.current) {
      console.log('Initializing Notification WebSocketService...');
      const service = new NotificationWebSocketService(accessToken);
      setNotificationWebSocketService(service);
      initialized.current = true;

      return () => {
        console.log('Disconnecting Notification WebSocketService...');
        service.disconnect();
        initialized.current = false;
      };
    } else if (!isAuthenticated && notificationWebSocketService) {
      // If user logs out, disconnect WebSocket
      console.log('User logged out, disconnecting Notification WebSocketService...');
      notificationWebSocketService.disconnect();
      setNotificationWebSocketService(null);
      initialized.current = false;
    }
  }, [accessToken, isAuthenticated, notificationWebSocketService]);

  return notificationWebSocketService;
}
