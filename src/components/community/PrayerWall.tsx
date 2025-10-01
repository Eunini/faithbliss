'use client';

import { Send, Heart } from 'lucide-react';

interface PrayerRequest {
  id: number;
  user: string;
  request: string;
  timestamp: string;
  prayers: number;
  supporters: string[];
}

interface PrayerWallProps {
  requests: PrayerRequest[];
}

export const PrayerWall = ({ requests }: PrayerWallProps) => {
  return (
    <div className="space-y-4">
      {/* Prayer Request Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-400" />
          Share a Prayer Request
        </h3>
        <textarea
          className="w-full bg-gray-700/50 rounded-xl p-3 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
          rows={3}
          placeholder="What can we pray for you about?"
        />
        <div className="flex justify-between items-center mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" className="rounded" />
            Post anonymously
          </label>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2">
            <Send className="w-4 h-4" />
            Share Request
          </button>
        </div>
      </div>

      {/* Prayer Requests */}
      {requests.map((request) => (
        <div key={request.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-white">{request.user}</span>
                <span className="text-sm text-gray-500">{request.timestamp}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">{request.request}</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-3 py-2 rounded-xl text-sm hover:scale-105 transition-transform">
                <Heart className="w-4 h-4" />
                Pray ({request.prayers})
              </button>
            </div>
            <div className="flex -space-x-2">
              {request.supporters.slice(0, 3).map((supporter, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-xs text-white border-2 border-gray-800"
                >
                  {supporter.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};