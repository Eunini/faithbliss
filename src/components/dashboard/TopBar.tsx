'use client';

import { Bell, Filter, Sparkles, ArrowLeft } from 'lucide-react';

interface TopBarProps {
  userName: string;
  showFilters?: boolean;
  showSidePanel?: boolean;
  onToggleFilters?: () => void;
  onToggleSidePanel?: () => void;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const TopBar = ({ 
  userName, 
  showFilters = false, 
  showSidePanel = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  onToggleFilters, 
  onToggleSidePanel,
  title,
  showBackButton = false,
  onBack
}: TopBarProps) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-4 py-4 sticky top-0 z-50">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5"></div>
      
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        {/* Left - Brand & Greeting */}
        <div className="flex items-center space-x-4">
          {/* Back Button or Mobile Hamburger Menu */}
          {showBackButton ? (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-2xl transition-all hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </button>
          ) : (
            <button 
              onClick={onToggleSidePanel}
              className="p-2 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 lg:hidden"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-300 rounded"></div>
                <div className="w-full h-0.5 bg-gray-300 rounded"></div>
                <div className="w-full h-0.5 bg-gray-300 rounded"></div>
              </div>
            </button>
          )}
          
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-2xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {title || 'FaithBliss'}
            </h1>
            <p className="text-sm text-gray-400 hidden md:block">
              {title ? `Edit your profile, ${userName}` : `Discover meaningful connections, ${userName} ✨`}
            </p>
          </div>
        </div>

        {/* Right - Action Icons */}
        <div className="flex items-center space-x-2">
          <button className="relative p-3 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 group">
            <Bell className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">3</span>
            </span>
          </button>
          
          {/* Mobile Profile Button */}
          <button 
            onClick={onToggleSidePanel}
            className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 group lg:hidden"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
          </button>
          
          <button 
            onClick={onToggleFilters}
            className={`p-3 rounded-2xl transition-all hover:scale-105 ${
              showFilters 
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <Filter className="w-6 h-6 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};