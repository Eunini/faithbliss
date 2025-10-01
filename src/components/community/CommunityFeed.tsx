/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { Heart, MessageCircle, Share2, Book, Award } from 'lucide-react';

interface CommunityPost {
  id: number;
  user: {
    name: string;
    profilePicture: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  type: 'post' | 'verse' | 'testimony';
  verse?: string;
}

interface CommunityFeedProps {
  posts: CommunityPost[];
  userProfile?: any;
}

export const CommunityFeed = ({ posts, userProfile }: CommunityFeedProps) => {
  return (
    <div className="space-y-4">
      {/* Post Creation */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {userProfile?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <button className="flex-1 bg-gray-700/50 rounded-xl px-4 py-3 text-left text-gray-400 hover:bg-gray-700 transition-colors">
            Share your faith journey...
          </button>
          <button className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Community Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image 
                src={post.user.profilePicture} 
                alt={post.user.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{post.user.name}</span>
                {post.user.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-400">{post.timestamp}</span>
            </div>
          </div>

          {post.type === 'verse' && (
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-3 mb-3 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Book className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">{post.verse}</span>
              </div>
            </div>
          )}

          {post.type === 'testimony' && (
            <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-3 mb-3 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-300">Testimony</span>
              </div>
            </div>
          )}

          <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>

          <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
            <button className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">{post.shares}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};