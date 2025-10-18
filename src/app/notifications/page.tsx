/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  Heart, 
  MessageCircle, 
  Bell,
  Settings,
} from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { useNotifications } from '@/hooks/useAPI';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';
import { NotificationPayload } from '@/services/notification-websocket';

const NotificationsPage = () => {
  const { data: notifications, loading, error } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'likes' | 'messages' | 'matches'>('all');

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

  const getNotificationIcon = (type: NotificationPayload['type']) => {
    switch (type) {
      case 'PROFILE_LIKED':
        return <Heart className="w-5 h-5 text-pink-400" />;
      case 'NEW_MESSAGE':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'NEW_MATCH':
        return <Heart className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getFilteredNotifications = () => {
    if (!notifications) return [];
    switch (activeTab) {
      case 'likes':
        return notifications.filter(n => n.type === 'PROFILE_LIKED');
      case 'messages':
        return notifications.filter(n => n.type === 'NEW_MESSAGE');
      case 'matches':
        return notifications.filter(n => n.type === 'NEW_MATCH');
      case 'all':
      default:
        return notifications;
    }
  };

  // Assuming all incoming notifications are unread until explicitly marked as read (which is not implemented yet)
  const unreadCount = notifications ? notifications.length : 0;

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
            { id: 'likes', label: 'Likes', count: notifications.filter(n => n.type === 'PROFILE_LIKED').length },
            { id: 'messages', label: 'Messages', count: notifications.filter(n => n.type === 'NEW_MESSAGE').length },
            { id: 'matches', label: 'Matches', count: notifications.filter(n => n.type === 'NEW_MATCH').length }
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
            getFilteredNotifications().map((notification, index) => (
              <div
                key={index} // Using index as key for now, ideally notification.id from backend
                className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 hover:bg-gray-700/50 border-pink-500/30 bg-gradient-to-r from-pink-500/5 to-purple-500/5`} // All new notifications are "unread" visually
              >
                <div className="flex items-start space-x-4">
                  {/* Profile Picture or Icon */}
                  <div className="flex-shrink-0">
                    {notification.otherUser?.id || notification.senderId ? ( // Check if there's an associated user
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        {/* Placeholder for profile picture, as NotificationPayload doesn't have it directly */}
                        <Image
                          src={'/default-avatar.png'} // Placeholder
                          alt={notification.otherUser?.name || notification.senderName || 'Profile'}
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
                          {notification.type === 'NEW_MESSAGE' && `New Message from ${notification.senderName || 'Unknown'}`}
                          {notification.type === 'PROFILE_LIKED' && `${notification.senderName || 'Someone'} liked your profile!`}
                          {notification.type === 'NEW_MATCH' && `New Match with ${notification.otherUser?.name || 'Someone'}`}
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {notification.message}
                        </p>
                        {/* NotificationPayload doesn't have timestamp directly, assuming it's part of the message or derived */}
                        {/* <p className="text-xs text-gray-500 mt-2">
                          {notification.timestamp}
                        </p> */}
                      </div>

                      {/* Actions */}
                      {/* No explicit isRead in NotificationPayload, so no mark as read button */}
                    </div>

                    {/* Action Buttons for Interactive Notifications */}
                    {(notification.type === 'PROFILE_LIKED' || notification.type === 'NEW_MATCH') && notification.otherUser?.id && (
                      <div className="flex items-center space-x-3 mt-3">
                        <Link href={`/profile/${notification.otherUser.id}`}>
                          <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl text-sm transition-colors">
                            View Profile
                          </button>
                        </Link>
                        
                        {notification.type === 'NEW_MATCH' && notification.matchId && notification.otherUser?.name && (
                          <Link href={`/messages?profileId=${notification.otherUser.id}&profileName=${encodeURIComponent(notification.otherUser.name)}`}>
                            <button className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-400 hover:text-pink-300 border border-pink-500/30 rounded-xl text-sm transition-colors">
                              Send Message
                            </button>
                          </Link>
                        )}
                      </div>
                    )}
                    {notification.type === 'NEW_MESSAGE' && notification.senderId && notification.senderName && (
                      <div className="flex items-center space-x-3 mt-3">
                        <Link href={`/messages?profileId=${notification.senderId}&profileName=${encodeURIComponent(notification.senderName)}`}>
                          <button className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-400 hover:text-pink-300 border border-pink-500/30 rounded-xl text-sm transition-colors">
                            View Message
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Unread Indicator - all are considered unread for now */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-pink-500 rounded-full"></div>
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