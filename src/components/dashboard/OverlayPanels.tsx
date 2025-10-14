/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterPanel } from './FilterPanel';
import { SidePanel } from './SidePanel';

interface OverlayPanelsProps {
  showFilters: boolean;
  showSidePanel: boolean;
  userName: string;
  userImage?: string;
  user?: any;
  onCloseFilters: () => void;
  onCloseSidePanel: () => void;
}

export const OverlayPanels = ({
  showFilters,
  showSidePanel,
  userName,
  userImage,
  user,
  onCloseFilters,
  onCloseSidePanel
}: OverlayPanelsProps) => {
  return (
    <>
      {/* Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
          <FilterPanel onClose={onCloseFilters} />
        </div>
      )}

      {/* Mobile Side Navigation Panel */}
      {showSidePanel && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onCloseSidePanel}
          />
          
          <div className="fixed inset-y-0 left-0 w-80 bg-gray-900/98 backdrop-blur-xl border-r border-gray-700/50 shadow-2xl z-50 transform transition-transform duration-300 lg:hidden">
            <SidePanel userName={userName} userImage={userImage} user={user} onClose={onCloseSidePanel} />
          </div>
        </>
      )}
    </>
  );
};