
import React from 'react';
import { SidebarTab, Desktop } from '../types';
import { BOTTOM_SIDEBAR_ITEMS, ICON_MAP } from '../constants';
import { Plus } from 'lucide-react';

interface SidebarProps {
  desktops: Desktop[];
  activeDesktopId: string;
  onSwitchDesktop: (id: string) => void;
  onAddDesktop: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ desktops, activeDesktopId, onSwitchDesktop, onAddDesktop }) => {
  return (
    <div className="h-screen w-16 glass-panel flex flex-col items-center py-6 z-50 text-white/70 shadow-2xl">
      
      {/* Logo Area */}
      <div className="mb-8 p-2 rounded-xl bg-blue-600 text-white font-bold text-xl cursor-pointer hover:scale-110 transition-transform">
        N
      </div>

      {/* Main Desktops */}
      <div className="flex-1 flex flex-col gap-4 w-full items-center overflow-y-auto overflow-x-hidden no-scrollbar pb-4">
        {desktops.map((desktop) => {
          const isActive = activeDesktopId === desktop.id;
          const IconComponent = ICON_MAP[desktop.icon] || ICON_MAP['Home'];
          
          return (
            <div 
              key={desktop.id}
              className="group relative flex items-center justify-center w-full cursor-pointer"
              onClick={() => onSwitchDesktop(desktop.id)}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-md shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              )}
              <div className={`p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10 ${isActive ? 'text-blue-400 bg-white/5' : ''}`}>
                <IconComponent size={22} strokeWidth={1.5} />
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-2 py-1 bg-black/80 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm z-[60]">
                {desktop.label}
              </div>
            </div>
          );
        })}

        {/* Add Button */}
        <div 
           className="group relative flex items-center justify-center w-full cursor-pointer mt-2"
           onClick={onAddDesktop}
        >
          <div className="p-3 rounded-xl transition-all duration-200 bg-white/5 hover:bg-white/15 text-white/50 hover:text-white border border-dashed border-white/20 hover:border-white/50">
            <Plus size={20} strokeWidth={1.5} />
          </div>
          
           {/* Tooltip */}
           <div className="absolute left-full ml-4 px-2 py-1 bg-black/80 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm z-[60]">
               添加桌面 (Add Desktop)
            </div>
        </div>

      </div>

      {/* Bottom Nav Items */}
      <div className="flex flex-col gap-6 w-full items-center mb-4 pt-4 border-t border-white/5">
        {BOTTOM_SIDEBAR_ITEMS.map((item) => (
           <div 
           key={item.id}
           className="group relative flex items-center justify-center w-full cursor-pointer"
         >
           <div className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10 hover:text-white">
             <item.icon size={22} strokeWidth={1.5} />
           </div>
           
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-2 py-1 bg-black/80 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm z-[60]">
                {item.label}
              </div>
         </div>
        ))}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 cursor-pointer hover:scale-110 transition-transform"></div>
      </div>
    </div>
  );
};

export default Sidebar;