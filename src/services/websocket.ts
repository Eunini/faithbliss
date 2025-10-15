// services/websocket.ts - WebSocket service for real-time messaging
import { getSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://faithbliss-backend.fly.dev';

import { Message, Notification, TypingEventSent, TypingEventReceived } from '@/types/chat';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    try {
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        console.warn('No auth token available for WebSocket connection');
        return;
      }

      this.socket = io(WS_URL, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        withCredentials: true, // Important for cookies (refreshToken)
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.reconnectAttempts++;
      });

    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a match conversation
  joinMatch(matchId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('joinMatch', { matchId });
    }
  }

  // Leave a match conversation
  leaveMatch(matchId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leaveMatch', { matchId });
    }
  }

  // Send a real-time message
  sendMessage(messageData: Pick<Message, 'matchId' | 'content'>): void {
    if (this.socket?.connected) {
      this.socket.emit('sendMessage', messageData);
    }
  }

  // Send typing indicator
  sendTyping(typingData: TypingEventSent): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', typingData);
    }
  }

  // Listen for new messages
  onMessage(callback: (message: Message) => void): void {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  // Listen for typing indicators
  onTyping(callback: (data: TypingEventReceived) => void): void {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  // Listen for unread count updates
  onUnreadCount(callback: (data: { count: number }) => void): void {
    if (this.socket) {
      this.socket.on('unreadCount', callback);
    }
  }

  // Listen for general notifications
  onNotification(callback: (notification: Notification) => void): void {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Listen for WebSocket errors
  onError(callback: (error: { message: string }) => void): void {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // Remove event listeners
  off(event: string, callback?: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create a singleton instance
const wsService = new WebSocketService();

export default wsService;