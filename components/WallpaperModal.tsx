
import React, { useState } from 'react';
import { X, Image, Link as LinkIcon } from 'lucide-react';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  currentWallpaper: string;
}

const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentWallpaper,
}) => {
  const [url, setUrl] = useState(currentWallpaper);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Image size={20} className="text-blue-500" />
            设置壁纸 (Set Wallpaper)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500 font-medium flex items-center gap-1">
              图片链接 (Image URL)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LinkIcon size={16} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center relative group">
             {url ? (
                 <img src={url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
             ) : (
                 <div className="text-gray-400 text-sm">Preview</div>
             )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-gray-200 text-gray-600 text-sm hover:bg-gray-100 transition-colors"
          >
            取消 (Cancel)
          </button>
          <button 
            onClick={() => { onSave(url); onClose(); }}
            className="px-6 py-2 rounded-full bg-blue-500 text-white text-sm hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            保存 (Save)
          </button>
        </div>

      </div>
    </div>
  );
};

export default WallpaperModal;
