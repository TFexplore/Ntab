
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';
import WidgetGrid from './components/WidgetGrid';
import QuoteFooter from './components/QuoteFooter';
import AIChat from './components/AIChat';
import AIFloatingButton from './components/AIFloatingButton';
import WallpaperModal from './components/WallpaperModal';
import { SidebarTab } from './types';
import { DEFAULT_BACKGROUND } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.HOME);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Wallpaper State with persistence
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem('nbtab_wallpaper') || 'https://oss.nbtab.com/public/xxoo/d9727495-e303-4081-b0f0-73268b05dcf8.png?imageView2/2/w/1920';
  });
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);

  // Background style
  const bgStyle = {
    backgroundImage: `url(${wallpaper})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  // Save wallpaper when it changes
  useEffect(() => {
    localStorage.setItem('nbtab_wallpaper', wallpaper);
  }, [wallpaper]);

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    setIsChatOpen(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex transition-all duration-500" style={bgStyle}>
      {/* Dark Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
      
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center h-full pt-[10vh]">
        
        {/* Animated Entry Container - Absolute layer for widgets needs full size */}
        <div className="flex flex-col items-center w-full h-full animate-in fade-in zoom-in-95 duration-700">
            
            {/* Clock */}
            <div className="mb-10 flex-shrink-0">
                <Clock />
            </div>

            {/* Search */}
            <div className="w-full flex justify-center px-4 mb-8 flex-shrink-0">
                <SearchBar />
            </div>

            {/* Widgets Grid - Fills remaining space */}
            <div className="flex-1 w-full relative">
                <WidgetGrid onSetWallpaperRequest={() => setIsWallpaperModalOpen(true)} />
            </div>

        </div>

        {/* Footer */}
        <QuoteFooter />
      </main>

      {/* Floating AI Button */}
      <AIFloatingButton onClick={() => setIsChatOpen(!isChatOpen)} />

      {/* AI Chat Overlay (Right Side) */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Wallpaper Modal */}
      <WallpaperModal 
        isOpen={isWallpaperModalOpen} 
        onClose={() => setIsWallpaperModalOpen(false)} 
        onSave={setWallpaper}
        currentWallpaper={wallpaper}
      />

    </div>
  );
};

export default App;