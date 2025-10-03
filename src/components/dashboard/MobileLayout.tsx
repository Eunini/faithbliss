import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface MobileLayoutProps {
  userName: string;
  showFilters: boolean;
  showSidePanel: boolean;
  onToggleFilters: () => void;
  onToggleSidePanel: () => void;
  children: ReactNode;
}

export const MobileLayout = ({
  userName,
  showFilters,
  showSidePanel,
  onToggleFilters,
  onToggleSidePanel,
  children
}: MobileLayoutProps) => {
  return (
    <div className="lg:hidden min-h-screen no-horizontal-scroll dashboard-main">
      {/* Mobile Top Bar */}
      <TopBar
        userName={userName}
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        onToggleFilters={onToggleFilters}
        onToggleSidePanel={onToggleSidePanel}
      />
      
      {/* Mobile Profile Display */}
      <div className="px-4 py-6 h-[calc(100vh-80px)] flex flex-col">
        <div className="flex-1 relative">
          {children}
        </div>
      </div>
    </div>
  );
};