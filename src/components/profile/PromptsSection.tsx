import { Plus } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface PromptsSectionProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>;
}

const PromptsSection = ({ profileData, setProfileData }: PromptsSectionProps) => {
  const availablePrompts = [
    "My simple pleasures",
    "I'm looking for",
    "My love language is",
    "I'm overly competitive about",
    "A perfect Sunday for me",
    "I'm weirdly attracted to",
    "My biggest fear is",
    "I want someone who",
    "My ideal first date"
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">About Me</h2>
          <p className="text-gray-400">Share what makes you unique with thoughtful prompts</p>
        </div>

        <div className="space-y-6">
          {profileData.prompts && profileData.prompts.map((prompt: { question: string; answer: string }, index: number) => (
            <div key={index} className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
              <select
                value={prompt.question}
                onChange={(e) => {
                  const newPrompts = [...(profileData.prompts || [])];
                  newPrompts[index] = { ...newPrompts[index], question: e.target.value };
                  setProfileData(prev => prev ? ({...prev, prompts: newPrompts}) : null);
                }}
                className="w-full p-3 bg-gray-600/50 border border-gray-500/50 rounded-xl text-white font-medium mb-4 focus:border-pink-500 focus:outline-none transition-colors"
              >
                {availablePrompts.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              
              <textarea
                value={prompt.answer}
                onChange={(e) => {
                  const newPrompts = [...(profileData.prompts || [])];
                  newPrompts[index] = { ...newPrompts[index], answer: e.target.value };
                  setProfileData(prev => prev ? ({...prev, prompts: newPrompts}) : null);
                }}
                rows={3}
                className="w-full p-4 bg-gray-600/30 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 resize-none focus:border-pink-500 focus:outline-none transition-colors"
                placeholder="Share your thoughts..."
              />
            </div>
          ))}
          
          {(!profileData.prompts || profileData.prompts.length < 3) && (
            <button
              onClick={() => {
                const newPrompt = { question: availablePrompts[0], answer: '' };
                setProfileData(prev => prev ? ({...prev, prompts: [...(prev.prompts || []), newPrompt]}) : null);
              }}
              className="w-full p-6 border-2 border-dashed border-gray-600 rounded-2xl text-gray-400 hover:border-pink-500 hover:text-pink-400 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another Prompt</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptsSection;
