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
} from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { useNotifications } from '@/hooks/useAPI';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

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
  const { data: conversationsData, loading, error } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'likes' | 'messages' | 'matches'>('all');

  const notifications: Notification[] = conversationsData ? conversationsData.map(conv => ({
    id: parseInt(conv.matchId), // Assuming matchId can be parsed to a number for Notification ID
    type: 'message', // All these are message notifications
    title: `New Message from ${conv.match.matchedUser?.name || 'Unknown'}`,
    message: conv.lastMessage?.content || 'No messages yet.',
    timestamp: conv.lastMessage?.createdAt || conv.match.createdAt,
    isRead: conv.unreadCount === 0,
    profilePicture: conv.match.matchedUser?.profilePhotos?.photo1,
    profileName: conv.match.matchedUser?.name,
    profileId: parseInt(conv.match.matchedUser?.id || '0'), // Assuming matchedUser.id can be parsed
  })) : [];

  // Show loading state
  if (loading) {
    return <HeartBeatLoader message="Loading your notifications..." />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <TopBar userName="User" title="Notifications" showBackButton onBack={() => window.history.back()} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center p-8">
            <p className="text-red-600 mb-4">Failed to load notifications: {error}</p>
            {/* No refetch for now, as useNotifications doesn't expose it directly */}
          </div>
        </div>
      </div>
    );
  }

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
    return notifications;
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
                            className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
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