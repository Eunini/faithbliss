'use client';

interface ProfileCompletionProps {
  completionPercentage: number;
  className?: string;
}

export const ProfileCompletion = ({ completionPercentage, className = '' }: ProfileCompletionProps) => {
  const getCompletionColor = () => {
    if (completionPercentage >= 80) return 'from-green-500 to-emerald-500';
    if (completionPercentage >= 60) return 'from-yellow-500 to-amber-500';
    return 'from-pink-500 to-purple-500';
  };

  const getCompletionMessage = () => {
    if (completionPercentage >= 90) return 'Amazing! Your profile is complete 🌟';
    if (completionPercentage >= 70) return 'Great progress! Almost there 🚀';
    if (completionPercentage >= 50) return 'Good start! Keep going 💪';
    return 'Let\'s complete your profile 📝';
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">Profile Completion</h3>
        <span className="text-sm font-bold text-white bg-gradient-to-r from-gray-600 to-gray-500 px-2 py-1 rounded-full">
          {completionPercentage}%
        </span>
      </div>
      
      <div className="mb-3">
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${getCompletionColor()} h-3 rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-sm text-gray-300">{getCompletionMessage()}</p>
      
      {completionPercentage < 100 && (
        <button className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-xl text-sm font-medium hover:scale-105 transition-transform duration-200">
          Complete Profile
        </button>
      )}
    </div>
  );
};