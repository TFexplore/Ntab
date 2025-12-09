
import React, { useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Maximize, Image } from 'lucide-react';
import { ContextMenuState } from '../types';

interface ContextMenuProps {
  state: ContextMenuState;
  onClose: () => void;
  onAction: (action: string, targetId?: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ state, onClose, onAction }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!state.visible) return null;

  const isWidget = !!state.targetId;

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-48 bg-white/90 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 py-1.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ top: state.y, left: state.x }}
    >
      <div className="flex flex-col text-sm text-gray-700">
        {!isWidget && (
          <>
            <button
                onClick={() => onAction('add')}
                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors text-left"
            >
                <Plus size={14} />
                <span>添加应用 (Add App)</span>
            </button>
            <div className="h-px bg-gray-200 my-1 mx-2"></div>
            <button
                onClick={() => onAction('setWallpaper')}
                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors text-left"
            >
                <Image size={14} />
                <span>设置壁纸 (Wallpaper)</span>
            </button>
          </>
        )}

        {isWidget && (
          <>
             <button
              onClick={() => onAction('edit', state.targetId)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors text-left"
            >
              <Edit2 size={14} />
              <span>编辑 (Edit)</span>
            </button>
            <button
              onClick={() => onAction('resize', state.targetId)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors text-left"
            >
              <Maximize size={14} />
              <span>调整大小 (Resize)</span>
            </button>
            <div className="h-px bg-gray-200 my-1 mx-2"></div>
            <button
              onClick={() => onAction('delete', state.targetId)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-500 hover:text-white text-red-500 transition-colors text-left"
            >
              <Trash2 size={14} />
              <span>删除 (Delete)</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContextMenu;
