
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';
import WidgetGrid from './components/WidgetGrid';
import QuoteFooter from './components/QuoteFooter';
import AIChat from './components/AIChat';
import AIFloatingButton from './components/AIFloatingButton';
import WallpaperModal from './components/WallpaperModal';
import AddDesktopModal from './components/AddDesktopModal';
import { Desktop } from './types';
import { DEFAULT_BACKGROUND } from './constants';

const App: React.FC = () => {
  // Desktops State
  const [desktops, setDesktops] = useState<Desktop[]>(() => {
    const saved = localStorage.getItem('nbtab_desktops');
    if (saved) {
        return JSON.parse(saved);
    }
    // Migration: Check if there was an old wallpaper saved
    const legacyWallpaper = localStorage.getItem('nbtab_wallpaper') || 'https://oss.nbtab.com/public/xxoo/d9727495-e303-4081-b0f0-73268b05dcf8.png?imageView2/2/w/1920';
    return [{ id: 'home', label: 'Home', icon: 'Home', wallpaper: legacyWallpaper }];
  });

  const [activeDesktopId, setActiveDesktopId] = useState<string>(() => {
      return localStorage.getItem('nbtab_active_desktop') || 'home';
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isAddDesktopModalOpen, setIsAddDesktopModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('nbtab_desktops', JSON.stringify(desktops));
  }, [desktops]);

  useEffect(() => {
    localStorage.setItem('nbtab_active_desktop', activeDesktopId);
  }, [activeDesktopId]);

  // Derived state
  const currentDesktop = desktops.find(d => d.id === activeDesktopId) || desktops[0];
  const wallpaper = currentDesktop?.wallpaper || DEFAULT_BACKGROUND;

  // Handlers
  const handleSwitchDesktop = (id: string) => {
    setActiveDesktopId(id);
    setIsChatOpen(false);
  };

  const handleAddDesktop = (name: string, icon: string) => {
      const newId = `desktop-${Date.now()}`;
      const newDesktop: Desktop = {
          id: newId,
          label: name,
          icon: icon,
          wallpaper: DEFAULT_BACKGROUND
      };
      setDesktops(prev => [...prev, newDesktop]);
      setActiveDesktopId(newId);
  };

  const handleWallpaperSave = (url: string) => {
      setDesktops(prev => prev.map(d => 
          d.id === activeDesktopId ? { ...d, wallpaper: url } : d
      ));
  };

  const bgStyle = {
    backgroundImage: `url(${wallpaper})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex transition-all duration-500" style={bgStyle}>
      {/* Dark Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
      
      {/* Left Sidebar */}
      <Sidebar 
        desktops={desktops}
        activeDesktopId={activeDesktopId} 
        onSwitchDesktop={handleSwitchDesktop} 
        onAddDesktop={() => setIsAddDesktopModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center h-full pt-[10vh]">
        
        {/* Animated Entry Container */}
        {/* Key forces re-animation on desktop switch */}
        <div key={activeDesktopId} className="flex flex-col items-center w-full h-full animate-in fade-in zoom-in-95 duration-500">
            
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
                <WidgetGrid 
                    desktopId={activeDesktopId}
                    onSetWallpaperRequest={() => setIsWallpaperModalOpen(true)} 
                />
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
        onSave={handleWallpaperSave}
        currentWallpaper={wallpaper}
      />

      {/* Add Desktop Modal */}
      <AddDesktopModal
        isOpen={isAddDesktopModalOpen}
        onClose={() => setIsAddDesktopModalOpen(false)}
        onSave={handleAddDesktop}
      />

    </div>
  );
};

export default App;
