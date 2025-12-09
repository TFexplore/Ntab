
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface IframeWindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WindowState>) => void;
}

const IframeWindow: React.FC<IframeWindowProps> = ({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdate,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string>('');
  
  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, winX: 0, winY: 0, w: 0, h: 0 });

  // Handle Drag (Title Bar)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized) return;
    e.preventDefault(); // Prevent text selection
    onFocus(windowState.id);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      winX: windowState.position.x,
      winY: windowState.position.y,
      w: windowState.size.width,
      h: windowState.size.height,
    };
  };

  // Handle Resize (Edges)
  const handleResizeStart = (e: React.MouseEvent, dir: string) => {
    if (windowState.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus(windowState.id);
    setIsResizing(true);
    setResizeDir(dir);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      winX: windowState.position.x,
      winY: windowState.position.y,
      w: windowState.size.width,
      h: windowState.size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        
        onUpdate(windowState.id, {
          position: {
            x: dragStartRef.current.winX + deltaX,
            y: dragStartRef.current.winY + deltaY,
          }
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        
        let newW = dragStartRef.current.w;
        let newH = dragStartRef.current.h;
        let newX = dragStartRef.current.winX;
        let newY = dragStartRef.current.winY;

        if (resizeDir.includes('e')) newW = Math.max(300, dragStartRef.current.w + deltaX);
        if (resizeDir.includes('s')) newH = Math.max(200, dragStartRef.current.h + deltaY);
        if (resizeDir.includes('w')) {
            const proposedW = Math.max(300, dragStartRef.current.w - deltaX);
            newX = dragStartRef.current.winX + (dragStartRef.current.w - proposedW);
            newW = proposedW;
        }
        if (resizeDir.includes('n')) {
            const proposedH = Math.max(200, dragStartRef.current.h - deltaY);
            newY = dragStartRef.current.winY + (dragStartRef.current.h - proposedH);
            newH = proposedH;
        }

        onUpdate(windowState.id, {
          size: { width: newW, height: newH },
          position: { x: newX, y: newY }
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDir, windowState.id, onUpdate]);

  if (windowState.isMinimized) return null;

  // Styles
  const containerStyle: React.CSSProperties = windowState.isMaximized ? {
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    transform: 'none',
    borderRadius: 0,
  } : {
    left: windowState.position.x,
    top: windowState.position.y,
    width: windowState.size.width,
    height: windowState.size.height,
  };

  return (
    <div
      ref={windowRef}
      className={`fixed flex flex-col bg-white shadow-2xl overflow-hidden border border-gray-200/50 backdrop-blur-md transition-shadow duration-200 ${windowState.isMaximized ? '' : 'rounded-lg'}`}
      style={{
        ...containerStyle,
        zIndex: windowState.zIndex,
      }}
      onMouseDown={() => onFocus(windowState.id)}
    >
      {/* Resizers */}
      {!windowState.isMaximized && (
        <>
            <div className="absolute top-0 left-0 w-full h-1 cursor-n-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'n')} />
            <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize z-50" onMouseDown={(e) => handleResizeStart(e, 's')} />
            <div className="absolute top-0 left-0 w-1 h-full cursor-w-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'w')} />
            <div className="absolute top-0 right-0 w-1 h-full cursor-e-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'e')} />
            {/* Corners */}
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'se')} />
        </>
      )}

      {/* Header (Title Bar) */}
      <div 
        className={`h-9 flex items-center justify-between px-3 select-none ${windowState.isMaximized ? 'bg-gray-100' : 'bg-gray-100 cursor-grab active:cursor-grabbing'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(windowState.id)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
            {windowState.icon ? (
                 <img src={windowState.icon} alt="" className="w-4 h-4 rounded-full" />
            ) : (
                <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                    style={{ background: windowState.backgroundColor || '#2563eb' }}
                >
                    {windowState.iconText || 'A'}
                </div>
            )}
            <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">{windowState.title}</span>
        </div>

        <div className="flex items-center gap-1.5" onMouseDown={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onMinimize(windowState.id)} 
            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={() => onMaximize(windowState.id)} 
            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-800 transition-colors"
          >
            {windowState.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
          </button>
          <button 
            onClick={() => onClose(windowState.id)} 
            className="p-1 hover:bg-red-500 rounded text-gray-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative bg-white w-full h-full">
         {/* Mouse trap overlay to prevent iframe stealing events during drag/resize */}
         {(isDragging || isResizing) && <div className="absolute inset-0 z-50 bg-transparent" />}
         
         <iframe 
            src={windowState.url} 
            className="w-full h-full border-none"
            title={windowState.title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
         />
      </div>
    </div>
  );
};

export default IframeWindow;
