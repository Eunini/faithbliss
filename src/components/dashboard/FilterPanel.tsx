'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel = ({ onClose }: FilterPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center">
              <Filter className="w-6 h-6 text-pink-400 mr-3" />
              Find Your Match
            </h3>
            <p className="text-gray-400 text-sm mt-1">Customize your discovery preferences</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(236, 72, 153, 0.4) transparent'
        }}
      >
        {/* Distance Filter */}
        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-5 border border-pink-500/20">
          <label className="block text-sm font-bold text-pink-300 mb-3 uppercase tracking-wide">Distance Range</label>
          <input
            type="range"
            min="1"
            max="50"
            defaultValue="25"
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>1 km</span>
            <span className="text-pink-400 font-semibold">25 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Age Range */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-5 border border-blue-500/20">
          <label className="block text-sm font-bold text-blue-300 mb-3 uppercase tracking-wide">Age Range</label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              placeholder="18"
              min="18"
              max="100"
              className="w-20 p-3 bg-gray-800/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors text-center"
            />
            <span className="text-gray-400 text-sm font-medium">to</span>
            <input
              type="number"
              placeholder="35"
              min="18"
              max="100"
              className="w-20 p-3 bg-gray-800/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors text-center"
            />
            <span className="text-gray-400 text-xs">years old</span>
          </div>
        </div>

        {/* Faith Journey */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-5 border border-emerald-500/20">
          <label className="block text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wide">Faith Journey</label>
          <select className="w-full p-3 bg-gray-800/50 border border-emerald-500/30 rounded-xl text-white focus:border-emerald-400 focus:outline-none transition-colors">
            <option value="">All faith levels</option>
            <option value="exploring">🌱 Exploring Faith</option>
            <option value="growing">🌿 Growing in Faith</option>
            <option value="rooted">🌳 Rooted in Faith</option>
            <option value="passionate">🔥 Passionate Believer</option>
          </select>
        </div>

        {/* Relationship Goals */}
        <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-2xl p-5 border border-rose-500/20">
          <label className="block text-sm font-bold text-rose-300 mb-3 uppercase tracking-wide">Looking For</label>
          <select className="w-full p-3 bg-gray-800/50 border border-rose-500/30 rounded-xl text-white focus:border-rose-400 focus:outline-none transition-colors">
            <option value="">Any relationship type</option>
            <option value="friendship">💫 Christian Friendship</option>
            <option value="dating">💕 Dating with Purpose</option>
            <option value="marriage">💍 Marriage-Minded</option>
          </select>
        </div>

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-2xl text-white transition-all flex items-center justify-between group"
        >
          <span className="font-semibold">Advanced Filters</span>
          <ChevronDown className={`w-5 h-5 transition-transform group-hover:scale-110 ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 animate-in slide-in-from-top duration-300">
            <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-2xl p-5 border border-purple-500/20">
              <label className="block text-sm font-bold text-purple-300 mb-3 uppercase tracking-wide">Denomination</label>
              <select className="w-full p-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white text-sm focus:border-purple-400 focus:outline-none transition-colors">
                <option value="">Any denomination</option>
                <option value="pentecostal">⛪ Pentecostal</option>
                <option value="catholic">✝️ Catholic</option>
                <option value="anglican">🏛️ Anglican</option>
                <option value="baptist">🙏 Baptist</option>
                <option value="methodist">📖 Methodist</option>
                <option value="presbyterian">🕊️ Presbyterian</option>
              </select>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-5 border border-yellow-500/20">
              <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wide">Prayer Life</label>
              <select className="w-full p-3 bg-gray-800/50 border border-yellow-500/30 rounded-xl text-white text-sm focus:border-yellow-400 focus:outline-none transition-colors">
                <option value="">Any frequency</option>
                <option value="daily">🌅 Daily Prayer</option>
                <option value="weekly">📅 Weekly Prayer</option>
                <option value="learning">📚 Learning to Pray</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-pink-500" />
                <span className="text-gray-300 font-medium">✅ Verified profiles only</span>
              </label>
              
              <label className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-emerald-500" />
                <span className="text-gray-300 font-medium">🟢 Active in last 7 days</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-700/50 space-y-3">
        <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white py-2 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg">
          Apply Filters
        </button>
        <button className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 py-2 rounded-2xl font-medium transition-colors">
          Reset All
        </button>
      </div>
    </div>
  );
};