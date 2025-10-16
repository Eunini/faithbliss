/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Calendar,
  Bell,
  Settings,
  Check,
  X
} from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';

interface Notification {
  id: number;
  type: 'like' | 'message' | 'bless' | 'match' | 'event' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  profilePicture?: string;
  profileName?: string;
  profileId?: number;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'like',
      title: 'New Like!',
      message: 'Grace liked your profile',
      timestamp: '2 minutes ago',
      isRead: false,
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400&h=600&fit=crop',
      profileName: 'Grace',
      profileId: 1
    },
    {
      id: 2,
      type: 'bless',
      title: 'You received a blessing!',
      message: 'Sarah sent you a blessing with a message',
      timestamp: '15 minutes ago',
      isRead: false,
      profilePicture: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
      profileName: 'Sarah',
      profileId: 2
    },
    {
      id: 3,
      type: 'match',
      title: 'It\'s a Match! 💕',
      message: 'You and David both liked each other',
      timestamp: '1 hour ago',
      isRead: false,
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      profileName: 'David',
      profileId: 3
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'Joy: "Hello! I loved your favorite Bible verse..."',
      timestamp: '3 hours ago',
      isRead: true,
      profilePicture: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
      profileName: 'Joy',
      profileId: 4
    },
    {
      id: 5,
      type: 'event',
      title: 'Community Event',
      message: 'New Christian Singles Meetup in Lagos this Sunday',
      timestamp: '1 day ago',
      isRead: true
    },
    {
      id: 6,
      type: 'system',
      title: 'Profile Boost',
      message: 'Your profile was shown to 50+ new believers today!',
      timestamp: '2 days ago',
      isRead: true
    }
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'likes' | 'messages' | 'matches'>('all');

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-pink-400" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'bless':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'match':
        return <Heart className="w-5 h-5 text-purple-400" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-green-400" />;
      case 'system':
        return <Bell className="w-5 h-5 text-gray-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'likes':
        return notifications.filter(n => n.type === 'like' || n.type === 'bless');
      case 'messages':
        return notifications.filter(n => n.type === 'message');
      case 'matches':
        return notifications.filter(n => n.type === 'match');
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white no-horizontal-scroll dashboard-main">
      {/* Header */}
      <TopBar 
        userName="Blessing"
        title="Notifications"
        showBackButton={true}
        onBack={() => window.history.back()}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-20">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm">Mark all read</span>
              </button>
            )}
            
            <Link href="/notifications">
              <button className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 rounded-2xl p-1 mb-6">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'likes', label: 'Likes', count: notifications.filter(n => n.type === 'like' || n.type === 'bless').length },
            { id: 'messages', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
            { id: 'matches', label: 'Matches', count: notifications.filter(n => n.type === 'match').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-pink-500/30' : 'bg-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {getFilteredNotifications().length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No notifications</h3>
              <p className="text-gray-500">You&apos;re all caught up!</p>
            </div>
          ) : (
            getFilteredNotifications().map((notification) => (
              <div
                key={notification.id}
                className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 hover:bg-gray-700/50 ${
                  notification.isRead 
                    ? 'border-gray-700/50' 
                    : 'border-pink-500/30 bg-gradient-to-r from-pink-500/5 to-purple-500/5'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Profile Picture or Icon */}
                  <div className="flex-shrink-0">
                    {notification.profilePicture ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={notification.profilePicture}
                          alt={notification.profileName || 'Profile'}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-800">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.timestamp}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons for Interactive Notifications */}
                    {(notification.type === 'like' || notification.type === 'bless' || notification.type === 'match') && notification.profileId && (
                      <div className="flex items-center space-x-3 mt-3">
                        <Link href={`/profile/${notification.profileId}`}>
                          <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl text-sm transition-colors">
                            View Profile
                          </button>
                        </Link>
                        
                        {notification.type === 'match' && (
                          <Link href={`/messages?profileId=${notification.profileId}&profileName=${encodeURIComponent(notification.profileName || '')}`}>
                            <button className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-400 hover:text-pink-300 border border-pink-500/30 rounded-xl text-sm transition-colors">
                              Send Message
                            </button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-pink-500 rounded-full"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProtectedNotifications() {
  return (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  );
}