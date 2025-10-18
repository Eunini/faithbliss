/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/chat';

export interface UnreadCountPayload {
  count: number;
}

export interface NotificationPayload {
  type: string;
  message: string;
  matchId?: string;
  otherUser?: { id: string; name: string };
  senderId?: string;
  senderName?: string;
  // Add other notification properties as needed
}

export interface UserTypingPayload {
  userId: string;
  isTyping: boolean;
}

class WebSocketService {
  private socket: Socket | null = null;
  private readonly WEBSOCKET_URL: string;

  // Allow optional token at construction for convenience
  constructor(token?: string) {
    this.WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001'; // Default to localhost for dev
    // If token is provided, attempt immediate connect
    if (token) {
      // ignore promise here; callers can still rely on connect() if they want
      this.connect(token).catch(err => console.error('WebSocket connect error:', err));
    }
  }

  /**
   * Connects to the websocket server. Token is optional and may be provided
   * when calling connect from the client after authentication.
   */
  public connect(token?: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket && this.socket.connected) {
        // already connected
        return resolve();
      }

      this.socket = io(this.WEBSOCKET_URL, {
        auth: token ? { token } : undefined,
        transports: ['websocket'],
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        resolve();
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error?.message || error);
        // resolve anyway so callers won't hang; they can listen for errors via onError
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

  public onNewMessage(callback: (message: Message) => void): void {
    this.socket?.on('newMessage', callback);
  }

  // Backwards-compatible alias expected by consumers
  public onMessage(callback: (message: Message) => void): void {
    this.onNewMessage(callback);
  }

  public onUnreadCount(callback: (payload: UnreadCountPayload) => void): void {
    this.socket?.on('unreadCount', callback);
  }

  public onNotification(callback: (payload: NotificationPayload) => void): void {
    this.socket?.on('notification', callback);
  }

  public onUserTyping(callback: (payload: UserTypingPayload) => void): void {
    this.socket?.on('userTyping', callback);
  }

  // Backwards-compatible alias expected by consumers
  public onTyping(callback: (payload: UserTypingPayload) => void): void {
    this.onUserTyping(callback);
  }

  public joinMatch(matchId: string): void {
    this.socket?.emit('joinRoom', { matchId });
  }

  public leaveMatch(matchId: string): void {
    this.socket?.emit('leaveRoom', { matchId });
  }

  public sendMessage(receiverId: string, content: string): void {
    this.socket?.emit('sendMessage', { receiverId, content });
  }

  public emitTyping(receiverId: string, isTyping: boolean): void {
    this.socket?.emit('userTyping', { receiverId, isTyping });
  }

  // Backwards-compatible name expected by hooks
  public sendTyping(receiverId: string, isTyping: boolean): void {
    this.emitTyping(receiverId, isTyping);
  }

  /** Returns true if socket is currently connected */
  // Backwards-compatible function
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Expose a `connected` getter property so consumers can access `service.connected`
  public get connected(): boolean {
    return this.isConnected();
  }

  /**
   * Listen for errors from the underlying socket (connect_error / error)
   */
  public onError(callback: (err: any) => void): void {
    this.socket?.on('connect_error', callback);
    this.socket?.on('error', callback);
  }

  /**
   * Remove listeners. If event is omitted, remove all listeners.
   */
  public off(event?: string, callback?: any): void {
    if (!this.socket) return;
    if (!event) {
      this.socket.removeAllListeners();
      return;
    }
    if (callback) this.socket.off(event, callback);
    else this.socket.off(event);
  }
}

export default WebSocketService;
