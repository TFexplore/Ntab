import React from 'react';
import { SidebarTab } from '../types';
import { SIDEBAR_ITEMS, BOTTOM_SIDEBAR_ITEMS } from '../constants';

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="h-screen w-16 glass-panel flex flex-col items-center py-6 z-50 text-white/70 shadow-2xl">
      
      {/* Logo Area */}
      <div className="mb-8 p-2 rounded-xl bg-blue-600 text-white font-bold text-xl cursor-pointer hover:scale-110 transition-transform">
        N
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 flex flex-col gap-6 w-full items-center">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div 
              key={item.id}
              className="group relative flex items-center justify-center w-full cursor-pointer"
              onClick={() => onTabChange(item.id)}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-md shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              )}
              <div className={`p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10 ${isActive ? 'text-blue-400 bg-white/5' : ''}`}>
                <item.icon size={22} strokeWidth={1.5} />
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-2 py-1 bg-black/80 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm z-[60]">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Nav Items */}
      <div className="flex flex-col gap-6 w-full items-center mb-4">
        {BOTTOM_SIDEBAR_ITEMS.map((item) => (
           <div 
           key={item.id}
           className="group relative flex items-center justify-center w-full cursor-pointer"
           onClick={() => onTabChange(item.id)}
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