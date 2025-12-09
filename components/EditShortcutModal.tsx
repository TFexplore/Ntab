
import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Edit2, Layout, Monitor, Image as ImageIcon, Sparkles, Type } from 'lucide-react';
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
      // Handle URLs without protocol
      let urlStr = formData.url;
      if (!urlStr.startsWith('http')) {
          urlStr = 'https://' + urlStr;
      }
      const url = new URL(urlStr);
      // Use Google Favicon service with larger size
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
      
      // Also try to guess a title if empty
      const updates: Partial<Widget> = { icon: faviconUrl, iconText: '' };
      if (!formData.title) {
          updates.title = url.hostname.split('.')[0]; // Simple guess
      }
      
      setFormData(prev => ({ ...prev, ...updates }));
    } catch (e) {
      // Invalid URL, ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white z-20">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-500" />
            {mode === 'add' ? '添加图标' : '编辑图标'} (Edit Icon)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Live Preview Section */}
          <div className="flex flex-col items-center justify-center gap-3 py-2">
              <div 
                className="w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center text-white overflow-hidden border border-gray-100 transition-all duration-300"
                style={{ 
                    background: formData.backgroundColor,
                    backgroundImage: formData.icon ? `url(${formData.icon})` : formData.backgroundColor,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
              >
                 {!formData.icon && (
                    <span className="text-4xl font-bold drop-shadow-md select-none">
                        {formData.iconText || formData.title?.charAt(0) || 'A'}
                    </span>
                 )}
              </div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Preview</span>
          </div>

          <div className="space-y-4">
            {/* Link Input */}
            <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium flex items-center gap-1.5">
                    <LinkIcon size={14} className="text-blue-500"/>
                    链接 (URL)
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://example.com"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                    <button 
                        onClick={fetchFavicon}
                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors whitespace-nowrap"
                    >
                        自动获取
                    </button>
                </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium flex items-center gap-1.5">
                    <Edit2 size={14} className="text-blue-500"/>
                    名称 (Name)
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Website Name"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Icon URL Input */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600 font-medium flex items-center gap-1.5">
                        <ImageIcon size={14} className="text-gray-400"/>
                        图标地址 (Icon URL)
                    </label>
                    <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                </div>

                {/* Icon Text Input */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600 font-medium flex items-center gap-1.5">
                        <Type size={14} className="text-gray-400"/>
                        图标文字 (Text)
                    </label>
                    <input
                        type="text"
                        value={formData.iconText}
                        maxLength={2}
                        onChange={(e) => setFormData({ ...formData, iconText: e.target.value, icon: '' })}
                        placeholder="Ab"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">
                    背景颜色 (Background)
                </label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {WIDGET_COLORS.map((color) => (
                    <button
                    key={color.name}
                    onClick={() => setFormData({ ...formData, backgroundColor: color.value })}
                    className={`flex-shrink-0 w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                        formData.backgroundColor === color.value 
                        ? 'border-blue-500 scale-110 shadow-md' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ background: color.value }}
                    title={color.label}
                    >
                        {formData.backgroundColor === color.value && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
                    </button>
                ))}
                </div>
            </div>

            {/* Open Method Selection */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-sm text-gray-600 font-medium">
                打开方式 (Open Method)
                </label>
                <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button 
                        onClick={() => setFormData({...formData, openMethod: 'tab'})}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${formData.openMethod === 'tab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Layout size={16} />
                        新标签页
                    </button>
                    <button 
                        onClick={() => setFormData({...formData, openMethod: 'window'})}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${formData.openMethod === 'window' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Monitor size={16} />
                        窗口模式
                    </button>
                </div>
            </div>

            {/* Window Configuration */}
            {formData.openMethod === 'window' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-500 font-medium">宽度 (Width): {formData.windowConfig?.widthPercent}%</label>
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
                            className="w-40 accent-blue-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-500 font-medium">高度 (Height): {formData.windowConfig?.heightPercent}%</label>
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
                            className="w-40 accent-blue-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky bottom-0 z-20">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          >
            保存配置
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditShortcutModal;
