'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  ArrowLeft, Send, Phone, Video, Info, Smile, Camera, Heart, Check, CheckCheck, Flag, UserX
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { EmojiPicker } from '@/components/chat/EmojiPicker';
import { useConversationMessages, useMessaging, useWebSocket } from '@/hooks/useAPI';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

const ChatPage = () => {
  const params = useParams();
  const chatId = params.chatId as string;
  const { data: session } = useSession();
  const [newMessage, setNewMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch real conversation data from backend
  const { data: messages, loading: messagesLoading, error: messagesError } = useConversationMessages(chatId);
  const { sendMessage } = useMessaging();
  const { connected, sendTyping, onTyping } = useWebSocket();
  const [isTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Set up typing indicators
    if (onTyping) {
      onTyping((data) => {
        // Handle typing indicator updates
        console.log('Typing indicator:', data);
      });
    }
  }, [onTyping]);

  const handleTyping = (value: string) => {
    setNewMessage(value);
    if (sendTyping) {
      sendTyping({
        matchId: chatId,
        userId: session?.user?.id || '',
        isTyping: value.length > 0
      });
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(chatId, newMessage.trim());
        setNewMessage('');
        scrollToBottom();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };



  // Show loading state
  if (messagesLoading) {
    return <HeartBeatLoader message="Loading conversation..." />;
  }

  // Handle error state
  if (messagesError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center p-8">
          <p className="text-red-400 mb-4">Failed to load conversation: {messagesError}</p>
          <Link 
            href="/messages"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  // Use real conversation data
  const realMessages = messages || [];
  
  // Get conversation partner info from messages
  const otherUserMessage = realMessages.find(msg => msg.senderId !== session?.user?.id);
  const otherUser = otherUserMessage?.sender;
  
  const conversation = {
    id: chatId,
    name: otherUser?.name || 'Chat User',
    photo: otherUser?.profilePhotos?.photo1 || '/default-avatar.png',
    age: otherUser?.age || 0,
    location: otherUser?.location?.address || 'Unknown',
    online: connected,
    lastSeen: connected ? 'Active now' : 'Last seen recently',
    messages: realMessages
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex flex-col no-horizontal-scroll dashboard-main">
      {/* Chat Header */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/messages">
              <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
                <ArrowLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
            </Link>
            
            <div className="relative">
              <Image
                src={conversation.photo}
                alt={conversation.name}
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-full ring-2 ring-pink-500/30"
              />
              {conversation.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-white">{conversation.name}</h3>
              <p className="text-xs text-gray-400">
                {conversation.online ? 'Active now' : conversation.lastSeen}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
              <Phone className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
              <Video className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
            </button>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group"
            >
              <Info className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Match Notification */}
            <div className="text-center py-6">
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-3">
                  <Heart className="w-8 h-8 text-pink-400 fill-current animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">You matched with {conversation.name}!</h3>
                <p className="text-gray-400 text-sm">Start the conversation with a friendly message</p>
              </div>
            </div>

            {messages && messages.map((message) => {
              const isMyMessage = message.senderId === session?.user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}
                >
                  <div className={`max-w-xs lg:max-w-md group ${
                    isMyMessage ? 'ml-16' : 'mr-16'
                  }`}>
                    <div className={`px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                      isMyMessage
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-md shadow-lg shadow-pink-500/25'
                        : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-bl-md hover:bg-white/15'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    
                    <div className={`flex items-center mt-1 space-x-1 ${
                      isMyMessage ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMyMessage && (
                        <div>
                          {message.isRead ? (
                            <CheckCheck className="w-3 h-3 text-pink-400" />
                          ) : (
                            <Check className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex justify-start animate-in slide-in-from-bottom duration-300">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-3 rounded-2xl rounded-bl-md mr-16">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-gray-900/90 backdrop-blur-xl border-t border-gray-700/50 p-4">
            <div className="flex items-end space-x-3">
              <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
                <Camera className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 transition-all duration-300 resize-none"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  <Smile className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>
              
              <button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  newMessage.trim()
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-lg shadow-pink-500/25'
                    : 'bg-white/10 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* Emoji Picker */}
            <EmojiPicker
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onEmojiSelect={(emoji) => setNewMessage(prev => prev + emoji)}
            />
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="w-80 bg-gray-900/50 backdrop-blur-xl border-l border-gray-700/50 p-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <Image
                src={conversation.photo}
                alt={conversation.name}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4 ring-4 ring-pink-500/30"
              />
              <h3 className="text-xl font-bold text-white mb-1">{conversation.name}</h3>
              <p className="text-gray-400">{conversation.age} years old</p>
              <p className="text-gray-400 text-sm">{conversation.location}</p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 hover:from-pink-500/30 hover:to-purple-600/30 border border-pink-500/30 text-white py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                View Full Profile
              </button>
              
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 text-gray-300 hover:text-white py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                <Flag className="w-5 h-5" />
                Report User
              </button>
              
              <button className="w-full bg-red-500/20 hover:bg-red-500/30 backdrop-blur-xl border border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                <UserX className="w-5 h-5" />
                Block User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProtectedChat() {
  return (
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  );
}