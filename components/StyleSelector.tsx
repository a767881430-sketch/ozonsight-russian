import React from 'react';
import { Layout, Sun, Cpu, Home, Diamond, Sparkles, PenTool } from 'lucide-react';
import { ImageStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: ImageStyle;
  onSelect: (style: ImageStyle) => void;
  customStyleDesc: string;
  onCustomStyleChange: (desc: string) => void;
  disabled: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  selectedStyle, 
  onSelect, 
  customStyleDesc,
  onCustomStyleChange,
  disabled 
}) => {
  const styles: { id: ImageStyle; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'auto', 
      label: '智能推荐', 
      icon: <Sparkles size={16} /> 
    },
    { 
      id: 'minimalist', 
      label: '极简棚拍', 
      icon: <Layout size={16} /> 
    },
    { 
      id: 'lifestyle', 
      label: '户外生活', 
      icon: <Sun size={16} /> 
    },
    { 
      id: 'home', 
      label: '温馨家居', 
      icon: <Home size={16} /> 
    },
    { 
      id: 'tech', 
      label: '硬核科技', 
      icon: <Cpu size={16} /> 
    },
    { 
      id: 'luxury', 
      label: '高端奢华', 
      icon: <Diamond size={16} /> 
    },
    {
      id: 'custom',
      label: '自定义',
      icon: <PenTool size={16} />
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-1">
      <div className="grid grid-cols-2 gap-1">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            disabled={disabled}
            className={`
              flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-all duration-200 group text-left
              ${selectedStyle === style.id 
                ? 'bg-slate-100 text-slate-900 font-semibold ring-1 ring-slate-200' 
                : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className={`
               ${selectedStyle === style.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
            `}>
               {style.icon}
            </span>
            <span className="text-xs">{style.label}</span>
            {selectedStyle === style.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
          </button>
        ))}
      </div>

      {selectedStyle === 'custom' && (
        <div className="p-2 mt-1 animate-fade-in border-t border-slate-100">
             <textarea
                value={customStyleDesc}
                onChange={(e) => onCustomStyleChange(e.target.value)}
                placeholder="例如：赛博朋克风格，霓虹灯光效，雨天街道背景..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all placeholder:text-slate-400 text-slate-800"
                rows={3}
                disabled={disabled}
                autoFocus
            />
        </div>
      )}
    </div>
  );
};

export default StyleSelector;