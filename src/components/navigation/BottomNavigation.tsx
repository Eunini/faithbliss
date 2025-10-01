'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Search, MessageCircle, Users, User } from 'lucide-react';

export const BottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: Home, 
      path: '/dashboard',
      color: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'discover', 
      label: 'Explore', 
      icon: Search, 
      path: '/discover',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageCircle, 
      path: '/messages',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'community', 
      label: 'Faith Hub', 
      icon: Users, 
      path: '/community',
      color: 'from-amber-500 to-orange-500'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      path: '/profile',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 z-40">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center p-2 min-w-0 flex-1 group"
              >
                <div className={`
                  p-2 rounded-xl transition-all duration-300 mb-1
                  ${active 
                    ? `bg-gradient-to-r ${item.color} shadow-lg scale-110` 
                    : 'hover:bg-gray-800/50 group-hover:scale-105'
                  }
                `}>
                  <Icon 
                    size={20} 
                    className={`
                      transition-colors duration-300
                      ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                    `} 
                  />
                </div>
                <span className={`
                  text-xs font-medium transition-colors duration-300
                  ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};