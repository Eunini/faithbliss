'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  MessageCircle, ArrowLeft, Search, Send, Phone, Video, 
  Smile, Paperclip, Info, Check, CheckCheck
} from 'lucide-react';
import Link from 'next/link';
import { TopBar } from '@/components/dashboard/TopBar';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400',
      lastMessage: 'That verse really speaks to me too! 🙏',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      typing: false,
      messages: [
        { 
          id: 1, 
          text: 'Hi! I loved your favorite verse - Proverbs 31:25 is so beautiful!', 
          sender: 'me', 
          time: '2:30 PM',
          status: 'read'
        },
        { 
          id: 2, 
          text: 'Thank you! It\'s been my anchor through many seasons. What drew you to share Philippians 4:13?', 
          sender: 'them', 
          time: '2:32 PM'
        },
        { 
          id: 3, 
          text: 'I\'ve always found strength in that verse, especially during challenging times in my career and faith journey.', 
          sender: 'me', 
          time: '2:35 PM',
          status: 'read'
        },
        { 
          id: 4, 
          text: 'That verse really speaks to me too! 🙏', 
          sender: 'them', 
          time: '2:38 PM'
        }
      ]
    },
    {
      id: 2,
      name: 'Grace Adebayo',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      lastMessage: 'Would love to know more about your church ministry!',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      typing: false,
      messages: [
        { 
          id: 1, 
          text: 'Hello! I noticed we both serve in our churches. That\'s wonderful!', 
          sender: 'them', 
          time: '1:15 PM'
        },
        { 
          id: 2, 
          text: 'Yes! I see you\'re in the youth ministry. I\'m part of the worship team at my church.', 
          sender: 'me', 
          time: '1:18 PM',
          status: 'delivered'
        },
        { 
          id: 3, 
          text: 'Would love to know more about your church ministry!', 
          sender: 'them', 
          time: '1:20 PM'
        }
      ]
    },
    {
      id: 3,
      name: 'David Emmanuel',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      lastMessage: 'Hope you\'re having a blessed week!',
      timestamp: '2 days ago',
      unread: 0,
      online: false,
      typing: false,
      messages: [
        { 
          id: 1, 
          text: 'Hope you\'re having a blessed week!', 
          sender: 'them', 
          time: 'Monday'
        }
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the API
      setNewMessage('');
      scrollToBottom();
    }
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <TopBar 
        userName="Believer"
        showFilters={false}
        showSidePanel={false}
        onToggleFilters={() => {}}
        onToggleSidePanel={() => {}}
      />

      <div className="pt-20 h-screen flex">
        {/* Conversations List */}
        <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-96 bg-gray-900/50 backdrop-blur-xl border-r border-gray-700/50`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <Link href="/dashboard">
                <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
                  <ArrowLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                </button>
              </Link>
              
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Messages
              </h1>
              
              <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
                <Search className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConversations.map((conversation) => (
              <Link
                href={`/messages/${conversation.id}`}
                key={conversation.id}
                className={`block w-full p-4 rounded-2xl transition-all duration-300 hover:bg-white/10 ${
                  selectedChat === conversation.id 
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src={conversation.photo}
                      alt={conversation.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-full ring-2 ring-pink-500/30"
                    />
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
                    )}
                    {conversation.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{conversation.unread}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                    </div>
                    <p className={`text-sm truncate ${
                      conversation.unread > 0 ? 'text-white font-medium' : 'text-gray-400'
                    }`}>
                      {conversation.typing ? (
                        <span className="flex items-center space-x-1">
                          <span>typing</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </span>
                      ) : (
                        conversation.lastMessage
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  <div className="relative">
                    <Image
                      src={selectedConversation?.photo || ''}
                      alt={selectedConversation?.name || ''}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-full ring-2 ring-pink-500/30"
                    />
                    {selectedConversation?.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white">{selectedConversation?.name}</h3>
                    <p className="text-xs text-gray-400">
                      {selectedConversation?.online ? 'Active now' : 'Last seen recently'}
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
                  <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
                    <Info className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-md'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-bl-md'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center justify-between mt-1 ${
                      message.sender === 'me' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className={`text-xs ${
                        message.sender === 'me' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {message.time}
                      </span>
                      {message.sender === 'me' && (
                        <div className="ml-2">
                          {message.status === 'read' ? (
                            <CheckCheck className="w-3 h-3 text-white/70" />
                          ) : message.status === 'delivered' ? (
                            <CheckCheck className="w-3 h-3 text-white/50" />
                          ) : (
                            <Check className="w-3 h-3 text-white/50" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {selectedConversation?.typing && (
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-3 rounded-2xl rounded-bl-md">
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
            <div className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 p-4">
              <div className="flex items-center space-x-3">
                <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
                  <Paperclip className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 transition-all duration-300"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-all duration-300">
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
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-8 max-w-md">
                <MessageCircle className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Conversation</h3>
                <p className="text-gray-400">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;