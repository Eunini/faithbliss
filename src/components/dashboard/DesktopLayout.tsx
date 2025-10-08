import { ReactNode } from 'react';
import { SidePanel } from './SidePanel';
import { TopBar } from './TopBar';

interface DesktopLayoutProps {
  userName: string;
  showFilters: boolean;
  showSidePanel: boolean;
  onToggleFilters: () => void;
  onToggleSidePanel: () => void;
  children: ReactNode;
}

export const DesktopLayout = ({
  userName,
  showFilters,
  showSidePanel,
  onToggleFilters,
  onToggleSidePanel,
  children
}: DesktopLayoutProps) => {
  return (
    <div className="hidden lg:flex min-h-screen">
      <div className="w-80 flex-shrink-0">
        <SidePanel userName={userName} onClose={() => {}} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <TopBar
          userName={userName}
          showFilters={showFilters}
          showSidePanel={showSidePanel}
          onToggleFilters={onToggleFilters}
          onToggleSidePanel={onToggleSidePanel}
        />
        
        {/* Main Profile Display */}
        <div className="flex-1 flex justify-center items-center px-4 py-6 overflow-hidden">
          <div className="w-full max-w-lg h-full max-h-[calc(100vh-120px)] relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};