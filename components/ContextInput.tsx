import React from 'react';
import { Info } from 'lucide-react';

interface ContextInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}

const ContextInput: React.FC<ContextInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="bg-white">
      <div className="relative">
        <textarea
            className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400 text-slate-800 shadow-sm"
            rows={4}
            placeholder="请输入产品关键参数（如：材质、防水等级、使用场景）以提升生成精准度..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
        />
        <div className="absolute bottom-2 right-2">
             <span className={`text-[9px] font-mono font-medium transition-colors ${value.length > 400 ? 'text-amber-500' : 'text-slate-300'}`}>
                {value.length}/500
             </span>
        </div>
      </div>
      
      <div className="mt-2 flex items-start gap-1.5 px-1">
        <Info size={12} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-[10px] text-slate-400 leading-relaxed">
            建议填写：核心材质 (如 100% 羊毛)、技术参数 (如 IP68)、目标人群或特定场景 (如冬季露营)。
        </p>
      </div>
    </div>
  );
};

export default ContextInput;