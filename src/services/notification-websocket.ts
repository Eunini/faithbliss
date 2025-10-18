import { io, Socket } from 'socket.io-client';

export interface NotificationPayload {
  type: 'NEW_MESSAGE' | 'PROFILE_LIKED' | 'NEW_MATCH';
  message: string;
  senderId?: string;
  senderName?: string;
  matchId?: string;
  otherUser?: {
    id: string;
    name: string;
  };
}

class NotificationWebSocketService {
  private socket: Socket | null = null;
  private readonly WEBSOCKET_URL: string;

  constructor(token?: string) {
    this.WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
    if (token) {
      this.connect(token).catch(err => console.error('Notification WebSocket connect error:', err));
    }
  }

  public connect(token?: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket && this.socket.connected) {
        return resolve();
      }

      this.socket = io(`${this.WEBSOCKET_URL}/notifications`, { // Connect to /notifications endpoint
        auth: token ? { token } : undefined,
        transports: ['websocket'],
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to Notification WebSocket server');
        resolve();
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from Notification WebSocket server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Notification WebSocket connection error:', error?.message || error);
        resolve();
      });
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public subscribeToNotifications(): void {
    this.socket?.emit('subscribeToNotifications');
  }

  public onNotification(callback: (payload: NotificationPayload) => void): void {
    this.socket?.on('notification', callback);
  }

  public onError(callback: (err: unknown) => void): void {
    this.socket?.on('connect_error', callback);
    this.socket?.on('error', callback);
  }

  public get connected(): boolean {
    return this.socket?.connected || false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public off(event?: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;
    if (!event) {
      this.socket.removeAllListeners();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (callback) this.socket.off(event, callback);
    else this.socket.off(event);
  }
}

export default NotificationWebSocketService;
