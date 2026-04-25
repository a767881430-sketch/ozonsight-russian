import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="flex items-center gap-3 select-none">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-md shadow-slate-200">
            <ShoppingBag size={16} className="text-white stroke-[2.5px]" />
        </div>
        <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black text-slate-900 leading-none tracking-tight">
                    OzonSight
                </h1>
                <span className="text-[8px] bg-slate-900 text-white px-1 py-0.5 rounded-sm font-black uppercase tracking-tighter">Expert</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 tracking-wider uppercase opacity-80">
                Visual Analytics Engine
            </p>
        </div>
    </div>
  );
};

export default Header;