
import React, { useState } from 'react';
import { X, Layout } from 'lucide-react';
import { AVAILABLE_ICONS, ICON_MAP } from '../constants';

interface AddDesktopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string) => void;
}

const AddDesktopModal: React.FC<AddDesktopModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name, selectedIcon);
    setName('');
    setSelectedIcon(AVAILABLE_ICONS[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Layout size={20} className="text-blue-500" />
            新建桌面 (New Desktop)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500 font-medium">名称 (Name)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Workspace"
              autoFocus
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500 font-medium">图标 (Icon)</label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((iconKey) => {
                const IconComp = ICON_MAP[iconKey];
                return (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => setSelectedIcon(iconKey)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      selectedIcon === iconKey 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                    title={iconKey}
                  >
                    <IconComp size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-sm"
            >
              取消
            </button>
            <button 
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all"
            >
              创建
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddDesktopModal;
