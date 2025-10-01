'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Heart,
  Users,
  Calendar,
  MessageCircle,
  Sparkles,
  Bell
} from 'lucide-react';

const CommunityPage = () => {
  const router = useRouter();

  const comingFeatures = [
    {
      icon: Users,
      title: 'Community Feed',
      description: 'Share testimonies, verses, and connect with fellow believers'
    },
    {
      icon: Heart,
      title: 'Prayer Wall',
      description: 'Request prayers and support from the community'
    },
    {
      icon: Calendar,
      title: 'Faith Events',
      description: 'Discover and join Bible studies, prayer meetings, and fellowship events'
    },
    {
      icon: MessageCircle,
      title: 'Discussion Groups',
      description: 'Join topic-based discussions about faith, relationships, and life'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Header with Back Button */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 z-30">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Faith Hub
          </h1>
          
          <div className="w-12"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex flex-col items-center justify-center px-4 py-12 min-h-[80vh]">
        <div className="text-center max-w-md mx-auto mb-12">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Bell className="w-4 h-4 text-gray-900" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Coming Soon!
          </h2>
          
          <p className="text-gray-400 text-lg mb-8">
            We&apos;re building something amazing for our faith community. 
            Connect, share, and grow together in faith.
          </p>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          {comingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/60 transition-all duration-300 hover:border-purple-500/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notification Signup */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-white mb-2">
              Be the first to know!
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              We&apos;ll notify you when Faith Hub launches
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-400">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">Notifications enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;