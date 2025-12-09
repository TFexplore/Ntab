
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';
import WidgetGrid from './components/WidgetGrid';
import QuoteFooter from './components/QuoteFooter';
import AIChat from './components/AIChat';
import AIFloatingButton from './components/AIFloatingButton';
import WallpaperModal from './components/WallpaperModal';
import AddDesktopModal from './components/AddDesktopModal';
import IframeWindow from './components/IframeWindow';
import { Desktop, Widget, WindowState } from './types';
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

  // Windows State
  const [windows, setWindows] = useState<WindowState[]>([]);
  
  // Ref for scroll debouncing
  const lastScrollTime = useRef(0);

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

  const handleWheel = (e: React.WheelEvent) => {
    // Only switch desktops if no windows are open and no modals are active
    if (windows.length > 0 || isChatOpen || isWallpaperModalOpen || isAddDesktopModalOpen) return;

    // Debounce scroll events
    const now = Date.now();
    if (now - lastScrollTime.current < 500) return;

    const direction = e.deltaY > 0 ? 1 : -1;
    const currentIndex = desktops.findIndex(d => d.id === activeDesktopId);
    
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + direction;

    // Check bounds (prevent scrolling past first or last desktop)
    if (nextIndex >= 0 && nextIndex < desktops.length) {
      setActiveDesktopId(desktops[nextIndex].id);
      lastScrollTime.current = now;
    }
  };

  // Window Management Handlers
  const handleOpenWindow = (widget: Widget) => {
    setWindows(prev => {
        const existing = prev.find(w => w.id === widget.id);
        // Base z-index for windows is 60 (above desktop content which is ~10-50)
        const maxZ = Math.max(60, ...prev.map(w => w.zIndex), 60) + 1;

        if (existing) {
            // Bring to front and restore if minimized
            return prev.map(w => w.id === widget.id ? { ...w, isMinimized: false, zIndex: maxZ } : w);
        }
        
        // Create new window
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const widthPercent = widget.windowConfig?.widthPercent || 60;
        const heightPercent = widget.windowConfig?.heightPercent || 70;
        
        const w = (screenW * widthPercent) / 100;
        const h = (screenH * heightPercent) / 100;

        return [...prev, {
            id: widget.id,
            url: widget.url || '',
            title: widget.title || 'Window',
            icon: widget.icon,
            iconText: widget.iconText,
            backgroundColor: widget.backgroundColor,
            position: { x: (screenW - w) / 2, y: (screenH - h) / 2 },
            size: { width: w, height: h },
            isMinimized: false,
            isMaximized: false,
            zIndex: maxZ
        }];
    });
  };

  const handleCloseWindow = (id: string) => {
      setWindows(prev => prev.filter(w => w.id !== id));
  };

  const handleMinimizeWindow = (id: string) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const handleMaximizeWindow = (id: string) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const handleFocusWindow = (id: string) => {
      setWindows(prev => {
        const maxZ = Math.max(60, ...prev.map(w => w.zIndex), 60) + 1;
        // Ensure we un-minimize the window when focusing it via dock/click
        return prev.map(w => w.id === id ? { ...w, zIndex: maxZ, isMinimized: false } : w);
      });
  };

  const handleUpdateWindow = (id: string, updates: Partial<WindowState>) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };


  const bgStyle = {
    backgroundImage: `url(${wallpaper})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden flex transition-all duration-500" 
      style={bgStyle}
      onWheel={handleWheel}
    >
      {/* Dark Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
      
      {/* Left Sidebar */}
      <Sidebar 
        desktops={desktops}
        activeDesktopId={activeDesktopId} 
        activeWindows={windows} 
        onSwitchDesktop={handleSwitchDesktop} 
        onAddDesktop={() => setIsAddDesktopModalOpen(true)}
        onRestoreWindow={(id) => handleFocusWindow(id)}
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
                    onOpenWindow={handleOpenWindow}
                />
            </div>

        </div>

        {/* Footer */}
        <QuoteFooter />
      </main>

      {/* Render Active Windows */}
      {windows.map(win => (
          <IframeWindow
            key={win.id}
            windowState={win}
            onClose={handleCloseWindow}
            onMinimize={handleMinimizeWindow}
            onMaximize={handleMaximizeWindow}
            onFocus={handleFocusWindow}
            onUpdate={handleUpdateWindow}
          />
      ))}

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
