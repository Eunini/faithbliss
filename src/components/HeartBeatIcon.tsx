import { Heart } from 'lucide-react';

interface HeartBeatIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const HeartBeatIcon = ({ size = 'md', className = '' }: HeartBeatIconProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  return (
    <>
      <style jsx global>{`
        @keyframes mini-heartbeat {
          0%, 70%, 100% { 
            transform: scale(1);
          }
          20%, 50% { 
            transform: scale(1.2);
          }
        }
        .mini-heartbeat {
          animation: mini-heartbeat 1.5s ease-in-out infinite;
        }
      `}</style>
      <Heart 
        className={`${sizeClasses[size]} text-current mini-heartbeat ${className}`}
        fill="currentColor"
      />
    </>
  );
};