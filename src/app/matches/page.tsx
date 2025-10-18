'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, User, ArrowLeft, Filter, Search, MapPin, Church, Users, Clock, Check, X } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { TopBar } from '@/components/dashboard/TopBar';
import { useMatches } from '@/hooks/useAPI';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';
import { Match } from '@/services/api';



const MatchesPage = () => {
  const [activeTab, setActiveTab] = useState('mutual');
  const router = useRouter();
  
  // Fetch real matches data from backend
  const { data: matchesData, loading, error, refetch } = useMatches();

  // Show loading state
  if (loading) {
    return <HeartBeatLoader message="Loading your matches..." />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <TopBar userName="User" title="Matches" showBackButton onBack={() => router.push('/dashboard')} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center p-8">
            <p className="text-red-600 mb-4">Failed to load matches: {error}</p>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use real matches data or empty arrays
  const mutualMatches = matchesData || [];
  const sentRequests: Match[] = []; // This would come from a different API endpoint
  const receivedRequests: Match[] = []; // This would also come from a different API endpoint

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white no-horizontal-scroll dashboard-main">
      {/* Header */}
      <TopBar 
        userName="Believer"
        showBackButton={true}
        onBack={() => window.history.back()}
      />

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link href="/dashboard">
                <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
                  <ArrowLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </button>
              </Link>
              
              <div className="flex items-center gap-3">
                <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
                  <Filter className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105 group">
                  <Search className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Your Matches
              </h1>
              <p className="text-gray-400 text-lg">
                Connections made in faith and love
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'mutual', label: 'Mutual', count: mutualMatches.length, icon: Heart },
                  { key: 'sent', label: 'Sent', count: sentRequests.length, icon: Clock },
                  { key: 'received', label: 'Received', count: receivedRequests.length, icon: Users }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative py-4 px-6 rounded-2xl transition-all duration-300 ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        activeTab === tab.key
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-gray-400'
                      }`}>
                        {tab.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'mutual' && (
              <div className="space-y-4">
                {mutualMatches.length > 0 ? (
                  mutualMatches.map((match: Match) => (
                    <div key={match.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <Image
                            src={match.matchedUser?.profilePhoto1 || '/default-avatar.png'}
                            alt={match.matchedUser?.name || 'User'}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-full ring-2 ring-pink-500/30"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-900 bg-gray-500`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white group-hover:text-pink-200 transition-colors">
                              {match.matchedUser?.name || 'Unknown'}, {match.matchedUser?.age || 0}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-emerald-400">
                                95% Match
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{match.matchedUser?.location || 'Location not specified'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Church className="w-4 h-4" />
                            <span>{match.matchedUser?.denomination || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <Link href={`/messages/${match.id}`} className="flex-1">
                          <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white py-3 rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-2 group">
                            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            Message
                          </button>
                        </Link>
                        <Link href={`/profile/${match.matchedUserId}`} className="flex-1">
                          <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 text-gray-300 hover:text-white py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group">
                            <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            View Profile
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-8 max-w-md mx-auto">
                      <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No mutual matches yet</h3>
                      <p className="text-gray-400">Keep exploring to find your perfect match!</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div className="space-y-4">
                {sentRequests.map((request: Match) => {
                  const matchedUser = request.matchedUser;
                  return (
                    <div key={request.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <Image
                          src={matchedUser?.profilePhoto1 || '/default-avatar.png'}
                          alt={matchedUser?.name || 'User'}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-full ring-2 ring-blue-500/30"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white">
                              {matchedUser?.name || 'Unknown'}, {matchedUser?.age || 'N/A'}
                            </h3>
                            <span className="text-sm font-medium text-blue-400">
                              95% Match
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{matchedUser?.location || 'Location unknown'}</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <p className="text-sm text-yellow-300 font-medium">
                            Connection request pending...
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'received' && (
              <div className="space-y-4">
                {receivedRequests.map((request: Match) => {
                  const matchedUser = request.matchedUser;
                  return (
                    <div key={request.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <Image
                          src={matchedUser?.profilePhoto1 || '/default-avatar.png'}
                          alt={matchedUser?.name || 'User'}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-full ring-2 ring-purple-500/30"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white">
                              {matchedUser?.name || 'Unknown'}, {matchedUser?.age || 'N/A'}
                            </h3>
                            {/* Compatibility was part of mock data, removing for now */}
                            {/* <span className="text-sm font-medium text-purple-400">
                              {request.compatibility}% Match
                            </span> */}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{matchedUser?.location || 'Location unknown'}</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Received {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white py-3 rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 group">
                          <Check className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          Accept
                        </button>
                        <button className="flex-1 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-xl border border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group">
                          <X className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProtectedMatches() {
  return (
    <ProtectedRoute>
      <MatchesPage />
    </ProtectedRoute>
  );
}