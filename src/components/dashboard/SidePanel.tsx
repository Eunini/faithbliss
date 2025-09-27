'use client';

import Link from 'next/link';
import { 
  X, User, Heart, MessageCircle, Users, Star, Settings, 
  HelpCircle, LogOut 
} from 'lucide-react';

interface SidePanelProps {
  userName: string;
  onClose: () => void;
}

export const SidePanel = ({ userName, onClose }: SidePanelProps) => {
  return (
    <div className="h-screen flex flex-col bg-gray-900 lg:bg-gray-800/50 lg:backdrop-blur-sm lg:border-r lg:border-gray-700/30">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{userName}</h3>
              <p className="text-gray-400 text-sm">Passionate Believer</p>
            </div>
          </div>
          {/* Close button only on mobile */}
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Navigation Menu - Custom Inner Scroll */}
      <div className="flex-1 min-h-0 p-6 space-y-2 overflow-y-auto side-panel-scroll">
        <Link href="/profile" onClick={onClose}>
          <div className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer group">
            <div className="p-2 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">My Profile</h4>
              <p className="text-gray-400 text-sm">Edit your profile & photos</p>
            </div>
          </div>
        </Link>

        <Link href="/matches" onClick={onClose}>
          <div className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer group">
            <div className="p-2 bg-pink-500/20 rounded-xl group-hover:bg-pink-500/30 transition-colors">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">My Matches</h4>
              <p className="text-gray-400 text-sm">See who liked you back</p>
            </div>
          </div>
        </Link>

        <Link href="/messages" onClick={onClose}>
          <div className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer group">
            <div className="p-2 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Messages</h4>
              <p className="text-gray-400 text-sm">Chat with your connections</p>
            </div>
          </div>
        </Link>

        <div className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer group">
          <div className="p-2 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-white font-semibold">Faith Community</h4>
            <p className="text-gray-400 text-sm">Connect with local churches</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer group">
          <div className="p-2 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 transition-colors">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-white font-semibold">Premium Features</h4>
            <p className="text-gray-400 text-sm">Unlock advanced matching</p>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-4 mt-4">
          <Link href="/settings" onClick={onClose}>
            <div className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer group">
              <div className="p-2 bg-gray-500/20 rounded-xl group-hover:bg-gray-500/30 transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Settings</h4>
                <p className="text-gray-400 text-sm">Privacy & preferences</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer group">
            <div className="p-2 bg-gray-500/20 rounded-xl group-hover:bg-gray-500/30 transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Help & Support</h4>
              <p className="text-gray-400 text-sm">FAQs and contact us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-6 border-t border-gray-700/50">
        <div className="flex items-center space-x-4 p-4 hover:bg-red-500/10 rounded-2xl transition-colors cursor-pointer group">
          <div className="p-2 bg-red-500/20 rounded-xl group-hover:bg-red-500/30 transition-colors">
            <LogOut className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-red-400 font-semibold">Sign Out</h4>
            <p className="text-gray-500 text-sm">See you later!</p>
          </div>
        </div>
      </div>
    </div>
  );
};