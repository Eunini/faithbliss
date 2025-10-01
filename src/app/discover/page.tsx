'use client';

import { useRouter } from 'next/navigation';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft,
  MapPin, 
  Heart, 
  BookOpen, 
  Music, 
  Mountain, 
  Zap, 
  Calendar,
  Star,
  Flame
} from 'lucide-react';

const DiscoverPage = () => {
  const router = useRouter();
  const { loading } = useAuth();

  if (loading) {
    return <HeartBeatLoader message="Discovering faithful connections..." />;
  }

  const discoverSections = [
    {
      id: 'nearby',
      title: 'Nearby Christians',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-500',
      count: '12 people within 5 miles'
    },
    {
      id: 'active',
      title: 'Most Active Today',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      count: '8 people online now'
    },
    {
      id: 'verses',
      title: 'Shared Verses',
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-500',
      count: '5 people love Jeremiah 29:11'
    },
    {
      id: 'interests',
      title: 'Interest Tags',
      icon: Music,
      color: 'from-pink-500 to-rose-500',
      count: '15 worship music lovers'
    },
    {
      id: 'adventures',
      title: 'Sunday Adventures',
      icon: Mountain,
      color: 'from-green-500 to-emerald-500',
      count: '6 mountain over beach lovers'
    },
    {
      id: 'live',
      title: 'Active Now',
      icon: Zap,
      color: 'from-yellow-500 to-amber-500',
      count: '3 people just joined'
    }
  ];

  const dailyChallenge = {
    title: "Today's Challenge",
    description: "Send your favorite verse to 3 new people",
    progress: "2/3 completed",
    reward: "Unlock 'Verse Champion' badge"
  };

  const communitySpotlight = [
    {
      title: 'Prayer Champions',
      subtitle: 'Users who prayed for others today',
      participants: ['Sarah M.', 'David K.', 'Grace L.'],
      icon: Heart
    },
    {
      title: 'Verse Sharers',
      subtitle: 'Engaged with today\'s reflection',
      participants: ['Michael R.', 'Joy A.', 'Paul S.'],
      icon: BookOpen
    },
    {
      title: 'Most Encouraging',
      subtitle: 'Gave the most Bless reactions',
      participants: ['Faith N.', 'Hope C.', 'Love T.'],
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 z-30">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Discover
            </h1>
          </div>
          
          <div className="w-12"></div> {/* Spacer for centering */}
        </div>
        <p className="text-center text-gray-400 text-sm pb-4">
          Explore faithful connections beyond your feed
        </p>
      </div>

      {/* Daily Challenge Card */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-2xl p-6 border border-pink-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">{dailyChallenge.title}</h3>
              <p className="text-sm text-gray-300">{dailyChallenge.description}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-pink-300">{dailyChallenge.progress}</span>
            <span className="text-xs bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-3 py-1 rounded-full text-purple-300">
              {dailyChallenge.reward}
            </span>
          </div>
        </div>
      </div>

      {/* Discover Sections Grid */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Explore by Category</h2>
        <div className="grid grid-cols-2 gap-4">
          {discoverSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1 text-left">
                  {section.title}
                </h3>
                <p className="text-xs text-gray-400 text-left">
                  {section.count}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Highlights */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Community Highlights</h2>
        <div className="space-y-3">
          {communitySpotlight.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{highlight.title}</h3>
                    <p className="text-sm text-gray-400">{highlight.subtitle}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {highlight.participants.map((participant, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-700/50 px-3 py-1 rounded-full text-xs text-gray-300"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events & Groups Preview */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-2xl p-6 border border-indigo-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Upcoming Events</h3>
              <p className="text-sm text-gray-300">Join faith-based gatherings</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-800/30 rounded-xl p-3">
              <h4 className="font-semibold text-white text-sm">Virtual Bible Study</h4>
              <p className="text-xs text-gray-400">Tonight 7 PM • 15 attending</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-3">
              <h4 className="font-semibold text-white text-sm">Prayer Circle</h4>
              <p className="text-xs text-gray-400">Tomorrow 6 AM • 8 attending</p>
            </div>
          </div>
          
          <button className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 rounded-xl font-medium hover:scale-105 transition-transform duration-200">
            View All Events
          </button>
        </div>
      </div>

      {/* Bless Wall Preview */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Bless Wall 🙏</h2>
        <div className="space-y-3">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-semibold text-pink-400">Sarah</span> blessed 
              <span className="font-semibold text-blue-400"> John</span> with Psalm 23 today
            </p>
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-xs italic text-gray-400">
                &ldquo;The Lord is my shepherd, I lack nothing...&rdquo;
              </p>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-semibold text-green-400">David</span> sent encouragement to 
              <span className="font-semibold text-purple-400"> Grace</span>
            </p>
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-xs italic text-gray-400">
                &ldquo;God has amazing plans for your life! 🌟&rdquo;
              </p>
            </div>
          </div>
        </div>
        
        <button className="w-full mt-4 border border-gray-600 text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-800/50 transition-colors duration-200">
          View Full Bless Wall
        </button>
      </div>
    </div>
  );
};

export default DiscoverPage;