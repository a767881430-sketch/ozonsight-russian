import React from 'react';
import { AnalysisResponse } from '../types';
import { Copy, Check, Box, Layers, Monitor, Camera, LayoutTemplate, Info, Sparkles, TrendingUp, Tag, ShieldCheck, Zap } from 'lucide-react';

interface AnalysisResultProps {
  data: AnalysisResponse;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-24">
      
      {/* 1. PRODUCT INTELLIGENCE & STRATEGY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <div className="flex items-center gap-2 mb-2">
                <Box size={20} className="text-slate-800" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">核心视觉情报</h2>
            </div>
          </div>

          <div className="lg:col-span-7 premium-card p-8 bg-gradient-to-br from-white to-slate-50/50">
             <div className="space-y-6">
                 <div>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-1">AI 识别结果</span>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">{data.product_info.category}</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {data.product_info.identified_features.map((feature, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-white text-xs font-semibold text-slate-600 border border-slate-200/60 shadow-sm">
                            {feature}
                        </span>
                        ))}
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">专家视觉策略建议</span>
                    </div>
                    <p className="text-lg font-medium text-slate-700 leading-relaxed italic border-l-4 border-slate-200 pl-4 py-1">
                        "{data.product_info.recommended_visual_style}"
                    </p>
                 </div>
             </div>
          </div>

          <div className="lg:col-span-5 premium-card p-0 overflow-hidden bg-slate-900 text-white border-none shadow-2xl">
             <div className="p-6 border-b border-white/10 bg-white/5 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">市场准则</span>
                <h3 className="text-sm font-bold">俄罗斯市场高转化要素</h3>
             </div>
             <div className="p-6 space-y-4">
                {data.market_usps.top_3_russian_selling_points.map((usp, idx) => (
                    <div key={idx} className="flex gap-4 group">
                        <span className="text-2xl font-black text-white/20 group-hover:text-amber-400/80 transition-colors duration-500 italic">0{idx + 1}</span>
                        <div>
                            <div className="text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors uppercase">{usp.ru}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{usp.zh}</div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
      </section>

      {/* 2. 2026 OZON TRENDING TAGS & DESCRIPTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tags */}
          <div className="premium-card p-8 bg-slate-50/50 border border-slate-200">
              <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-4">
                  <div className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-pink-600" />
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">Ozon 热搜推荐标签</h3>
                  </div>
                  {data.market_usps.trending_tags && data.market_usps.trending_tags.length > 0 && (
                      <button 
                        onClick={() => navigator.clipboard.writeText(data.market_usps.trending_tags.join(' '))}
                        className="text-xs font-bold text-pink-700 hover:text-pink-900 flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-md"
                      >
                          <Copy size={12} /> 一键复制全部
                      </button>
                  )}
              </div>
              <div className="flex flex-wrap gap-3">
                  {data.market_usps.trending_tags && data.market_usps.trending_tags.length > 0 ? (
                      data.market_usps.trending_tags.map((tag, idx) => (
                          <span key={idx} className="cursor-pointer text-sm font-bold text-pink-700 bg-pink-100 hover:bg-pink-200 hover:text-pink-800 transition-colors px-4 py-2 rounded-lg border border-pink-200/50 shadow-sm">
                              {tag}
                          </span>
                      ))
                  ) : (
                      <span className="text-sm text-slate-400">标签未生成，请重新提交检测</span>
                  )}
              </div>
          </div>

          {/* Description */}
          <div className="premium-card p-8 bg-indigo-50/30 border border-indigo-100 relative group overflow-hidden">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => data.market_usps.product_description?.ru && navigator.clipboard.writeText(data.market_usps.product_description.ru)} className="p-2 bg-white rounded-md shadow hover:bg-indigo-50 text-indigo-600 transition-colors" title="Copy Russian Description">
                     <Copy size={16} />
                  </button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                  <LayoutTemplate size={20} className="text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">高转化商品描述语</h3>
              </div>
              
              {data.market_usps.product_description ? (
                  <div className="space-y-4">
                     <div className="text-sm font-bold text-slate-800 leading-relaxed font-sans mt-2 whitespace-pre-wrap">
                        {data.market_usps.product_description.ru}
                     </div>
                     <div className="text-xs text-slate-500 border-t border-indigo-200/50 pt-4 mt-4 leading-relaxed">
                        <span className="font-bold text-indigo-400 uppercase tracking-wider mb-1 block">翻译：</span>
                        {data.market_usps.product_description.zh}
                     </div>
                  </div>
              ) : (
                  <span className="text-sm text-slate-400">描述语未生成</span>
              )}
          </div>
      </section>

      {/* 3. PROMPT GENERATION ENGINE */}
      <div className="space-y-16">
        
         {/* Main Product Cards (3:4) */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Studio */}
             <div>
                 <SectionHeader 
                    icon={<Camera size={20} className="text-slate-800" />} 
                    title="核心主图 (Studio)" 
                    subtitle="格式：3:4 竖屏 | 场景：纯净/专业棚拍/平铺" 
                 />
                 <div className="grid grid-cols-1 gap-4 mt-6">
                    {data.gemini_image_prompts.map((item, idx) => (
                        <CodeBlock 
                            key={`studio-${idx}`}
                            title={item.title}
                            purpose={item.purpose}
                            code={item.prompt}
                            index={idx}
                            compact
                        />
                    ))}
                 </div>
             </div>
             
             {/* Lifestyle */}
             <div>
                 <SectionHeader 
                    icon={<Tag size={20} className="text-slate-800" />} 
                    title="场景主图 (Lifestyle)" 
                    subtitle="格式：3:4 竖屏 | 场景：真实使用环境/生活方式" 
                 />
                 <div className="grid grid-cols-1 gap-4 mt-6">
                    {data.gemini_lifestyle_prompts?.map((item, idx) => (
                        <CodeBlock 
                            key={`lifestyle-${idx}`}
                            title={item.title}
                            purpose={item.purpose}
                            code={item.prompt}
                            index={idx}
                            compact
                        />
                    ))}
                 </div>
             </div>
         </div>

         {/* Rich Content (16:9) */}
         {data.gemini_rich_content_prompts?.length > 0 && (
            <div className="pt-8 border-t border-slate-100">
                <SectionHeader 
                    icon={<Monitor size={20} className="text-slate-800" />} 
                    title="A+ 详情页横幅 (Rich Content)" 
                    subtitle="格式：16:9 横屏 | 场景：品牌故事与氛围" 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {data.gemini_rich_content_prompts.map((item, idx) => (
                        <CodeBlock 
                            key={`rich-${idx}`}
                            title={item.title}
                            purpose={item.purpose}
                            code={item.prompt}
                            index={idx}
                            compact
                        />
                    ))}
                </div>
            </div>
         )}
         
         {/* Video Details (9:16) */}
         {data.gemini_video_prompts?.length > 0 && (
            <div className="pt-8 border-t border-slate-100">
                <SectionHeader 
                    icon={<Camera size={20} className="text-slate-800" />} 
                    title="短视频指令 (Moments/Video)" 
                    subtitle="格式：9:16 竖屏 | 场景：动态展示" 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {data.gemini_video_prompts.map((item, idx) => (
                        <CodeBlock 
                            key={`video-${idx}`}
                            title={item.title}
                            purpose={item.purpose}
                            code={item.prompt}
                            index={idx}
                            compact
                        />
                    ))}
                </div>
            </div>
         )}
      </div>

    </div>
  );
};

// --- Helper Components ---

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({icon, title, subtitle}) => (
    <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{subtitle}</p>
            </div>
        </div>
    </div>
);

interface CodeBlockProps {
    title: string;
    purpose: string;
    code: string;
    index: number;
    highlight?: boolean;
    compact?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({title, purpose, code, index, highlight = false, compact = false}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`
            rounded-2xl border transition-all duration-500 overflow-hidden group
            ${highlight 
                ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-100/50 ring-1 ring-indigo-50' 
                : 'bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-lg'}
        `}>
            {/* Header */}
            <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${highlight ? 'bg-indigo-50/30' : 'bg-slate-50/30'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-inner ${highlight ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                        {index + 1}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{title}</span>
                            {highlight && <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">Featured</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{purpose}</span>
                    </div>
                </div>
                <button 
                    onClick={handleCopy}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95
                        ${copied 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200'}
                    `}
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? '已复制' : '复制提示词'}
                </button>
            </div>
            
            {/* Code Content */}
            <div className={`p-6 relative ${compact ? 'max-h-40 overflow-y-auto custom-scrollbar' : ''}`}>
                <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 leading-none">Prompt Instructions</span>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed font-mono selection:bg-slate-900 selection:text-white">
                        {code}
                    </p>
                </div>
                
                {/* Meta details to address "texture" feedback */}
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">8K Photoreal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">3:4 Vertical</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AnalysisResult;
