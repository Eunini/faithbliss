'use client';

import { useState } from 'react';
import { 
  Heart, Star, MessageCircle, User, ArrowLeft, Edit3, Settings, Camera, MapPin, 
  Church, BookOpen, Calendar, Briefcase, LogOut, Plus, X, Check, Upload,
  Sparkles, Target, Shield, Globe, Phone, Mail, Instagram, Twitter
} from 'lucide-react';
import Link from 'next/link';
import { TopBar } from '@/components/dashboard/TopBar';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('photos');
  const [profileData, setProfileData] = useState({
    name: 'Blessing',
    age: 25,
    location: 'Lagos, Nigeria',
    profession: 'Product Designer',
    denomination: 'Pentecostal',
    favoriteVerse: 'Jeremiah 29:11 - For I know the plans I have for you, declares the Lord...',
    bio: 'Faith-centered creative passionate about designing for good and building meaningful relationships. Love worship, art, and deep conversations about life and faith.',
    hobbies: ['Design', 'Worship', 'Art', 'Photography', 'Reading', 'Cooking'],
    values: ['Faith', 'Creativity', 'Kindness', 'Authenticity', 'Growth'],
    faithJourney: 'Passionate Believer 🔥',
    lookingFor: 'Life Partner 💍',
    churchRole: 'Creative Team Lead',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop'
    ],
    prompts: [
      {
        question: "My simple pleasures",
        answer: "Sunday morning worship, coffee dates, and designing something beautiful"
      },
      {
        question: "I'm looking for",
        answer: "Someone who loves God, makes me laugh, and dreams of changing the world together"
      },
      {
        question: "My love language is",
        answer: "Quality time and words of affirmation - deep conversations over everything else"
      }
    ],
    lifestyle: {
      drinking: 'Never',
      smoking: 'Never',
      workout: 'Sometimes',
      diet: 'Anything',
    },
    passions: ['Faith & Spirituality', 'Design & Creativity', 'Social Impact', 'Travel', 'Music & Worship'],
    basics: {
      height: "5'6\"",
      education: 'University Graduate',
      jobTitle: 'Senior Product Designer',
      company: 'Tech Startup'
    }
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileData(prev => ({ 
          ...prev, 
          photos: [...prev.photos, result]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <TopBar 
        userName={profileData.name}
        title="Edit Profile"
        showBackButton={true}
        onBack={() => window.history.back()}
      />

      {/* Navigation Tabs */}
      <div className="bg-gray-800/50 border-b border-gray-700/50 sticky top-20 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'photos', label: 'Photos', icon: Camera },
              { id: 'basics', label: 'Basic Info', icon: User },
              { id: 'prompts', label: 'About Me', icon: MessageCircle },
              { id: 'lifestyle', label: 'Lifestyle', icon: Sparkles },
              { id: 'passions', label: 'Passions', icon: Heart },
              { id: 'faith', label: 'Faith Journey', icon: Church }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 rounded-t-2xl font-medium transition-all whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'bg-gray-900 text-pink-400 border-t-2 border-pink-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pb-20">
        {activeSection === 'photos' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Your Photos</h2>
                <p className="text-gray-400">Add up to 9 photos that show your personality</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profileData.photos.map((photo, index) => (
                  <div key={index} className="relative group aspect-[3/4] bg-gray-700 rounded-2xl overflow-hidden">
                    <img
                      src={photo}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removePhoto(index)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        MAIN
                      </div>
                    )}
                  </div>
                ))}
                
                {profileData.photos.length < 9 && (
                  <label className="aspect-[3/4] bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-gray-700 transition-all group">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-pink-500 mb-2" />
                    <span className="text-sm font-medium text-gray-400 group-hover:text-pink-500">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl border border-pink-500/20">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-pink-300 mb-1">Photo Tips</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Use recent photos that clearly show your face</li>
                      <li>• Include variety - close-ups, full body, doing activities you love</li>
                      <li>• Smile naturally and let your personality shine</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'basics' && (
          <BasicInfoSection profileData={profileData} setProfileData={setProfileData} />
        )}

        {activeSection === 'prompts' && (
          <PromptsSection profileData={profileData} setProfileData={setProfileData} />
        )}

        {activeSection === 'lifestyle' && (
          <LifestyleSection profileData={profileData} setProfileData={setProfileData} />
        )}

        {activeSection === 'passions' && (
          <PassionsSection profileData={profileData} setProfileData={setProfileData} />
        )}

        {activeSection === 'faith' && (
          <FaithSection profileData={profileData} setProfileData={setProfileData} />
        )}
      </div>
    </div>
  );
};

// Basic Info Section Component
const BasicInfoSection = ({ profileData, setProfileData }: any) => (
  <div className="space-y-6">
    <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50">
      <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">First Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Age</label>
          <input
            type="number"
            value={profileData.age}
            onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value)})}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="25"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Job Title</label>
          <input
            type="text"
            value={profileData.basics.jobTitle}
            onChange={(e) => setProfileData({
              ...profileData, 
              basics: {...profileData.basics, jobTitle: e.target.value}
            })}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Product Designer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Company</label>
          <input
            type="text"
            value={profileData.basics.company}
            onChange={(e) => setProfileData({
              ...profileData, 
              basics: {...profileData.basics, company: e.target.value}
            })}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Tech Startup"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Height</label>
          <select
            value={profileData.basics.height}
            onChange={(e) => setProfileData({
              ...profileData, 
              basics: {...profileData.basics, height: e.target.value}
            })}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white focus:border-pink-500 focus:outline-none transition-colors"
          >
            <option value="">Select height</option>
            {Array.from({length: 24}, (_, i) => {
              const feet = Math.floor((60 + i) / 12);
              const inches = (60 + i) % 12;
              return (
                <option key={i} value={`${feet}'${inches}"`}>
                  {feet}'{inches}"
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Education</label>
          <select
            value={profileData.basics.education}
            onChange={(e) => setProfileData({
              ...profileData, 
              basics: {...profileData.basics, education: e.target.value}
            })}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white focus:border-pink-500 focus:outline-none transition-colors"
          >
            <option value="">Select education</option>
            <option value="High School">High School</option>
            <option value="Some College">Some College</option>
            <option value="University Graduate">University Graduate</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-300 mb-3">Location</label>
        <input
          type="text"
          value={profileData.location}
          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
          className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
          placeholder="Lagos, Nigeria"
        />
      </div>
    </div>
  </div>
);

// Prompts Section Component
const PromptsSection = ({ profileData, setProfileData }: any) => {
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
          {profileData.prompts.map((prompt: any, index: number) => (
            <div key={index} className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
              <select
                value={prompt.question}
                onChange={(e) => {
                  const newPrompts = [...profileData.prompts];
                  newPrompts[index].question = e.target.value;
                  setProfileData({...profileData, prompts: newPrompts});
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
                  const newPrompts = [...profileData.prompts];
                  newPrompts[index].answer = e.target.value;
                  setProfileData({...profileData, prompts: newPrompts});
                }}
                rows={3}
                className="w-full p-4 bg-gray-600/30 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 resize-none focus:border-pink-500 focus:outline-none transition-colors"
                placeholder="Share your thoughts..."
              />
            </div>
          ))}
          
          {profileData.prompts.length < 3 && (
            <button
              onClick={() => {
                const newPrompt = { question: availablePrompts[0], answer: '' };
                setProfileData({...profileData, prompts: [...profileData.prompts, newPrompt]});
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

// Lifestyle Section Component  
const LifestyleSection = ({ profileData, setProfileData }: any) => (
  <div className="space-y-6">
    <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50">
      <h2 className="text-2xl font-bold text-white mb-6">Lifestyle</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries({
          drinking: { label: 'Drinking', options: ['Never', 'Sometimes', 'Socially', 'Regularly'] },
          smoking: { label: 'Smoking', options: ['Never', 'Sometimes', 'Socially', 'Regularly'] },
          workout: { label: 'Workout', options: ['Never', 'Sometimes', 'Often', 'Daily'] },
          diet: { label: 'Diet', options: ['Anything', 'Vegetarian', 'Vegan', 'Kosher', 'Halal'] }
        }).map(([key, config]) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-300 mb-4">{config.label}</label>
            <div className="grid grid-cols-2 gap-3">
              {config.options.map(option => (
                <button
                  key={option}
                  onClick={() => setProfileData({
                    ...profileData, 
                    lifestyle: {...profileData.lifestyle, [key]: option}
                  })}
                  className={`p-3 rounded-2xl font-medium transition-all ${
                    profileData.lifestyle[key as keyof typeof profileData.lifestyle] === option
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Passions Section Component
const PassionsSection = ({ profileData, setProfileData }: any) => {
  const availablePassions = [
    'Faith & Spirituality', 'Design & Creativity', 'Social Impact', 'Travel', 'Music & Worship',
    'Reading', 'Fitness & Health', 'Cooking', 'Photography', 'Technology', 'Art', 'Sports',
    'Volunteering', 'Nature & Outdoors', 'Fashion', 'Dancing', 'Movies & TV', 'Gaming'
  ];

  const togglePassion = (passion: string) => {
    const newPassions = profileData.passions.includes(passion)
      ? profileData.passions.filter((p: string) => p !== passion)
      : [...profileData.passions, passion];
    setProfileData({...profileData, passions: newPassions});
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Passions</h2>
          <p className="text-gray-400">Select up to 5 things you're passionate about</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availablePassions.map(passion => (
            <button
              key={passion}
              onClick={() => togglePassion(passion)}
              className={`p-4 rounded-2xl font-medium transition-all text-center ${
                profileData.passions.includes(passion)
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-105'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              {passion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Faith Section Component
const FaithSection = ({ profileData, setProfileData }: any) => (
  <div className="space-y-6">
    <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50">
      <h2 className="text-2xl font-bold text-white mb-6">Faith Journey</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Denomination</label>
          <select
            value={profileData.denomination}
            onChange={(e) => setProfileData({...profileData, denomination: e.target.value})}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white focus:border-pink-500 focus:outline-none transition-colors"
          >
            <option value="Pentecostal">Pentecostal</option>
            <option value="Baptist">Baptist</option>
            <option value="Catholic">Catholic</option>
            <option value="Anglican">Anglican</option>
            <option value="Methodist">Methodist</option>
            <option value="Presbyterian">Presbyterian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Faith Journey Stage</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Exploring Faith 🌱',
              'Growing in Faith 🌿',
              'Rooted & Steady 🪴',
              'Passionate Believer 🔥'
            ].map(stage => (
              <button
                key={stage}
                onClick={() => setProfileData({...profileData, faithJourney: stage})}
                className={`p-4 rounded-2xl font-medium transition-all ${
                  profileData.faithJourney === stage
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Church Role</label>
          <input
            type="text"
            value={profileData.churchRole}
            onChange={(e) => setProfileData({...profileData, churchRole: e.target.value})}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Creative Team Lead"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Favorite Bible Verse</label>
          <textarea
            value={profileData.favoriteVerse}
            onChange={(e) => setProfileData({...profileData, favoriteVerse: e.target.value})}
            rows={3}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 resize-none focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Share a verse that speaks to your heart..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Looking For</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              'Christian Friendship 💫',
              'Dating with Purpose 💕',
              'Life Partner 💍'
            ].map(goal => (
              <button
                key={goal}
                onClick={() => setProfileData({...profileData, lookingFor: goal})}
                className={`p-4 rounded-2xl font-medium transition-all ${
                  profileData.lookingFor === goal
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePage;