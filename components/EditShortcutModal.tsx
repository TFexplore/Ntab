import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Edit2 } from 'lucide-react';
import { Widget } from '../types';
import { WIDGET_COLORS } from '../constants';

interface EditShortcutModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: Widget;
  onClose: () => void;
  onSave: (data: Partial<Widget>) => void;
}

const EditShortcutModal: React.FC<EditShortcutModalProps> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    iconText: '',
    backgroundColor: WIDGET_COLORS[1].value, // Default Blue
    icon: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          url: initialData.url || '',
          title: initialData.title || '',
          iconText: initialData.iconText || '',
          backgroundColor: initialData.backgroundColor || WIDGET_COLORS[1].value,
          icon: initialData.icon || '',
        });
      } else {
        // Reset for add
        setFormData({
          url: '',
          title: '',
          iconText: '',
          backgroundColor: WIDGET_COLORS[1].value,
          icon: '',
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const fetchFavicon = () => {
    if (!formData.url) return;
    try {
      const url = new URL(formData.url);
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
      setFormData(prev => ({ ...prev, icon: faviconUrl, iconText: '' }));
    } catch (e) {
      // Invalid URL, ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === 'add' ? '添加图标' : '编辑图标'} (Edit Icon)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Link Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <span className="text-red-500">*</span> 链接 (Link)
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <LinkIcon size={16} />
                </div>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <button 
                onClick={fetchFavicon}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                获取图标 (Get Icon)
              </button>
            </div>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <span className="text-red-500">*</span> 名称 (Name)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Edit2 size={16} />
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Shortcut Name"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="flex flex-col gap-2">
             <label className="text-sm text-gray-500 font-medium">
               背景颜色 (Background Color)
            </label>
            <div className="flex gap-3">
              {WIDGET_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setFormData({ ...formData, backgroundColor: color.value })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.backgroundColor === color.value 
                      ? 'border-blue-500 scale-110' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ background: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Icon Text Input */}
           <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500 font-medium">
               图标文字 (Icon Text)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Edit2 size={16} />
              </div>
              <input
                type="text"
                value={formData.iconText}
                maxLength={2}
                onChange={(e) => setFormData({ ...formData, iconText: e.target.value, icon: '' })} // Clear icon if text is typed manually
                placeholder="Input icon text (e.g. AB)"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          
          {/* Preview */}
          <div className="flex items-center gap-4 mt-2">
             <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-all"
                style={{ 
                    background: formData.backgroundColor,
                    backgroundImage: formData.icon ? `url(${formData.icon})` : formData.backgroundColor,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
             >
                {!formData.icon && formData.iconText}
             </div>
             <div className="text-sm text-gray-400">
                 示例 (Preview)
             </div>
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
            onClick={handleSave}
            className="px-6 py-2 rounded-full bg-blue-500 text-white text-sm hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            保存 (Save)
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditShortcutModal;
