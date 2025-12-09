
import React, { useState, useEffect, useRef } from 'react';
import MemoWidget from './MemoWidget';
import { Widget, ContextMenuState } from '../types';
import { INITIAL_WIDGETS } from '../constants';
import ContextMenu from './ContextMenu';
import EditShortcutModal from './EditShortcutModal';

interface WidgetGridProps {
    onSetWallpaperRequest: () => void;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ onSetWallpaperRequest }) => {
  // Load widgets from local storage or use default
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = localStorage.getItem('nbtab_widgets');
    return saved ? JSON.parse(saved) : INITIAL_WIDGETS;
  });

  // Save widgets to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('nbtab_widgets', JSON.stringify(widgets));
  }, [widgets]);
  
  // Dragging State
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    widgetId: string | null;
    startX: number;
    startY: number;
    initialWidgetX: number;
    initialWidgetY: number;
  }>({
    isDragging: false,
    widgetId: null,
    startX: 0,
    startY: 0,
    initialWidgetX: 0,
    initialWidgetY: 0,
  });

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
  });

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    widgetId?: string;
  }>({
    isOpen: false,
    mode: 'add',
  });

  const gridRef = useRef<HTMLDivElement>(null);

  // --- Drag Handlers ---

  const handleMouseDown = (e: React.MouseEvent, widgetId: string) => {
    // Only left click triggers drag
    if (e.button !== 0) return;
    
    e.stopPropagation();
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    // Bring to front
    const maxZ = Math.max(...widgets.map(w => w.zIndex || 1));
    setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, zIndex: maxZ + 1 } : w));

    setDragState({
      isDragging: true,
      widgetId,
      startX: e.clientX,
      startY: e.clientY,
      initialWidgetX: widget.position.x,
      initialWidgetY: widget.position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.widgetId) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      setWidgets(prev => prev.map(w => {
        if (w.id === dragState.widgetId) {
          return {
            ...w,
            position: {
              x: dragState.initialWidgetX + deltaX,
              y: dragState.initialWidgetY + deltaY,
            }
          };
        }
        return w;
      }));
    };

    const handleMouseUp = () => {
      if (dragState.isDragging) {
        setDragState(prev => ({ ...prev, isDragging: false, widgetId: null }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);


  // --- Context Menu Handlers ---

  const handleContextMenu = (e: React.MouseEvent, widgetId?: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetId: widgetId,
    });
  };

  const handleContextAction = (action: string, targetId?: string) => {
    setContextMenu({ ...contextMenu, visible: false });

    switch (action) {
      case 'add':
        setModal({ isOpen: true, mode: 'add' });
        break;
      case 'setWallpaper':
        onSetWallpaperRequest();
        break;
      case 'edit':
        if (targetId) setModal({ isOpen: true, mode: 'edit', widgetId: targetId });
        break;
      case 'delete':
        if (targetId) setWidgets(prev => prev.filter(w => w.id !== targetId));
        break;
      case 'resize':
        if (targetId) {
            setWidgets(prev => prev.map(w => {
                if(w.id === targetId) {
                   const nextSize = w.size === 'small' ? 'medium' : w.size === 'medium' ? 'large' : 'small';
                   return { ...w, size: nextSize };
                }
                return w;
            }))
        }
        break;
    }
  };

  // --- Modal Handlers ---

  const handleSaveWidget = (data: Partial<Widget>) => {
    if (modal.mode === 'add') {
      const newWidget: Widget = {
        id: Date.now().toString(),
        type: 'shortcut',
        size: 'small',
        position: { x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50 }, // Center
        zIndex: 10,
        ...data,
      } as Widget;
      setWidgets(prev => [...prev, newWidget]);
    } else if (modal.mode === 'edit' && modal.widgetId) {
      setWidgets(prev => prev.map(w => 
        w.id === modal.widgetId ? { ...w, ...data } : w
      ));
    }
  };

  const handleGridClick = (e: React.MouseEvent) => {
     // Close context menu if clicking on grid background
     if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
  }


  // --- Render Helpers ---

  const getWidgetStyle = (widget: Widget): React.CSSProperties => {
    const baseSize = 80; // Base unit
    let width = baseSize;
    let height = baseSize;

    if (widget.type === 'memo') {
      width = 288; // w-72
      height = 256; // h-64
    } else {
      // Shortcuts
      if (widget.size === 'medium') { width = baseSize * 1.5; height = baseSize * 1.5; }
      if (widget.size === 'large') { width = baseSize * 2; height = baseSize * 2; }
    }

    return {
      position: 'absolute',
      left: widget.position.x,
      top: widget.position.y,
      width: `${width}px`,
      height: `${height}px`,
      zIndex: widget.zIndex,
      cursor: dragState.isDragging && dragState.widgetId === widget.id ? 'grabbing' : 'grab',
    };
  };

  return (
    <>
      <div 
        ref={gridRef}
        className="w-full h-full relative"
        onContextMenu={(e) => handleContextMenu(e)}
        onClick={handleGridClick}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            style={getWidgetStyle(widget)}
            onMouseDown={(e) => handleMouseDown(e, widget.id)}
            onContextMenu={(e) => {
                e.stopPropagation();
                handleContextMenu(e, widget.id);
            }}
            className="group transition-transform hover:scale-[1.02] active:scale-95"
          >
            {widget.type === 'memo' && (
              <div className="w-full h-full pointer-events-none">
                 <div className="pointer-events-auto w-full h-full">
                    <MemoWidget />
                 </div>
              </div>
            )}

            {widget.type === 'shortcut' && (
              <a 
                href={widget.url} 
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                    if (dragState.isDragging || (dragState.startX !== e.clientX)) e.preventDefault();
                }}
                className="w-full h-full block"
                draggable={false}
              >
                <div 
                    className="w-full h-full rounded-2xl shadow-lg flex flex-col items-center justify-center text-white overflow-hidden border border-white/10 hover:border-white/30 transition-all"
                    style={{ 
                        background: widget.backgroundColor,
                        backgroundImage: widget.icon ? `url(${widget.icon})` : widget.backgroundColor,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {!widget.icon && (
                        <span className="text-2xl font-bold drop-shadow-md">
                            {widget.iconText || widget.title?.charAt(0) || 'A'}
                        </span>
                    )}
                </div>
                 <div className="absolute -bottom-6 w-full text-center text-xs text-white/80 font-medium drop-shadow-md truncate px-1">
                    {widget.title}
                 </div>
              </a>
            )}
          </div>
        ))}
      </div>

      <ContextMenu 
        state={contextMenu} 
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        onAction={handleContextAction}
      />

      <EditShortcutModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        initialData={modal.widgetId ? widgets.find(w => w.id === modal.widgetId) : undefined}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onSave={handleSaveWidget}
      />
    </>
  );
};

export default WidgetGrid;
