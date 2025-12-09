
import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Edit2, Layout, Monitor } from 'lucide-react';
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
  const [formData, setFormData] = useState<Partial<Widget>>({
    url: '',
    title: '',
    iconText: '',
    backgroundColor: WIDGET_COLORS[1].value, // Default Blue
    icon: '',
    openMethod: 'tab',
    windowConfig: { widthPercent: 60, heightPercent: 70 },
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
          openMethod: initialData.openMethod || 'tab',
          windowConfig: initialData.windowConfig || { widthPercent: 60, heightPercent: 70 },
        });
      } else {
        // Reset for add
        setFormData({
          url: '',
          title: '',
          iconText: '',
          backgroundColor: WIDGET_COLORS[1].value,
          icon: '',
          openMethod: 'tab',
          windowConfig: { widthPercent: 60, heightPercent: 70 },
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white z-10">
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
                获取图标
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

          {/* Open Method Selection */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
             <label className="text-sm text-gray-500 font-medium">
               打开方式 (Open Method)
            </label>
            <div className="flex p-1 bg-gray-100 rounded-lg">
                <button 
                    onClick={() => setFormData({...formData, openMethod: 'tab'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${formData.openMethod === 'tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Layout size={16} />
                    新标签页 (Tab)
                </button>
                <button 
                    onClick={() => setFormData({...formData, openMethod: 'window'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${formData.openMethod === 'window' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Monitor size={16} />
                    窗口模式 (Window)
                </button>
            </div>
          </div>

          {/* Window Configuration (Only if Window is selected) */}
          {formData.openMethod === 'window' && (
              <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                       <label className="text-sm text-gray-500 font-medium">初始宽度: {formData.windowConfig?.widthPercent}%</label>
                       <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        value={formData.windowConfig?.widthPercent || 60} 
                        onChange={(e) => setFormData(prev => ({
                            ...prev, 
                            windowConfig: { 
                                heightPercent: prev.windowConfig?.heightPercent || 60,
                                widthPercent: parseInt(e.target.value) 
                            }
                        }))}
                        className="w-48 accent-blue-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                       />
                  </div>
                  <div className="flex items-center justify-between">
                       <label className="text-sm text-gray-500 font-medium">初始高度: {formData.windowConfig?.heightPercent}%</label>
                       <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        value={formData.windowConfig?.heightPercent || 70} 
                        onChange={(e) => setFormData(prev => ({
                            ...prev, 
                            windowConfig: { 
                                widthPercent: prev.windowConfig?.widthPercent || 60,
                                heightPercent: parseInt(e.target.value) 
                            }
                        }))}
                        className="w-48 accent-blue-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                       />
                  </div>
                  <p className="text-xs text-gray-400">注意：部分网站可能会拒绝在 iframe 窗口中显示。</p>
              </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-100 bg-gray-50/50 sticky bottom-0 z-10">
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
