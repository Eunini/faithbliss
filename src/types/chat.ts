export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  sender: {
    id: string;
    name: string;
  };
}

export interface Notification {
  type: 'profile_liked' | 'new_match' | 'other_types_as_they_are_added';
  message: string;
  senderId?: string;
  senderName?: string;
  matchId?: string;
  otherUser?: {
    id: string;
    name: string;
  };
}
export interface ConversationSummary {
  id: string; // match ID
  otherUser: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  lastMessage: string | null;
  unreadCount: number;
  updatedAt: string;
}


export interface TypingEventSent {
  matchId: string;
  isTyping: boolean;
}

export interface TypingEventReceived {
  userId: string;
  isTyping: boolean;
}
