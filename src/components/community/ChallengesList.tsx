'use client';

import { Award } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  participants: number;
  daysLeft: number;
  reward: string;
  progress: number;
}

interface ChallengesListProps {
  challenges: Challenge[];
}

export const ChallengesList = ({ challenges }: ChallengesListProps) => {
  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <div key={challenge.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{challenge.title}</h3>
              <p className="text-sm text-gray-400 mb-2">{challenge.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{challenge.participants} participants</span>
                <span>{challenge.daysLeft} days left</span>
              </div>
            </div>
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-amber-400">{challenge.progress}/7</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                style={{ width: `${(challenge.progress / 7) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-amber-400">Reward: {challenge.reward}</span>
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-transform">
              Continue Challenge
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};