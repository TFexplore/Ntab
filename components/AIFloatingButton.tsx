import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface AIFloatingButtonProps {
  onClick: () => void;
}

const AIFloatingButton: React.FC<AIFloatingButtonProps> = ({ onClick }) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight / 2 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Initialize default position to right side vertically centered (approximately)
  useEffect(() => {
    setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 120 });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false); // Reset drag state initially
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragRef.current.startX;
      const deltaY = moveEvent.clientY - dragRef.current.startY;
      
      // If moved more than a few pixels, consider it a drag
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        setIsDragging(true);
      }

      setPosition({
        x: dragRef.current.initialX + deltaX,
        y: dragRef.current.initialY + deltaY
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleClick = () => {
    if (!isDragging) {
      onClick();
    }
  };

  return (
    <div
      ref={buttonRef}
      style={{
        left: position.x,
        top: position.y,
        position: 'fixed',
        zIndex: 100,
      }}
      className="cursor-pointer select-none touch-none"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="w-14 h-14 rounded-full glass-panel flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/30 bg-blue-600/20 hover:bg-blue-600/40 hover:scale-110 active:scale-95 transition-all duration-200 group">
        <Sparkles size={24} className="text-blue-300 group-hover:text-white animate-pulse" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black/50 shadow-sm animate-bounce"></div>
      </div>
    </div>
  );
};

export default AIFloatingButton;