import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import ContextInput from './components/ContextInput';
import StyleSelector from './components/StyleSelector';
import AnalysisResult from './components/AnalysisResult';
import { analyzeProductImage, fileToBase64 } from './services/geminiService';
import { AnalysisResponse, AppState, ImageStyle } from './types';
import { AlertCircle, Sparkles, ArrowRight, Loader2, Zap, Globe, Command, Key } from 'lucide-react';

const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [contextText, setContextText] = useState<string>("");
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isApiKeySaved, setIsApiKeySaved] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('auto');
  const [customStyleDesc, setCustomStyleDesc] = useState<string>("");
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [persistedPreviews, setPersistedPreviews] = useState<string[]>([]);

  // Restore state on mount
  React.useEffect(() => {
    const savedKey = localStorage.getItem('ozonsight_gemini_api_key');
    if (savedKey) {
        setApiKeyInput(savedKey);
        setIsApiKeySaved(true);
    }

    const savedData = sessionStorage.getItem('ozonsight_last_result');
    const savedPreviews = sessionStorage.getItem('ozonsight_last_previews');
    
    if (savedData) {
      try {
        setAnalysisData(JSON.parse(savedData));
        setAppState(AppState.SUCCESS);
        if (savedPreviews) {
            setPersistedPreviews(JSON.parse(savedPreviews));
        }
      } catch (e) {
        sessionStorage.removeItem('ozonsight_last_result');
        sessionStorage.removeItem('ozonsight_last_previews');
      }
    }
  }, []);

  const handleImagesSelect = (files: File[]) => {
    setSelectedFiles(files);
    setPersistedPreviews([]); // Reset persisted previews when user selects new files
    setAppState(AppState.IDLE);
    setAnalysisData(null);
    setErrorMsg(null);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setPersistedPreviews([]);
    setContextText("");
    setCustomStyleDesc("");
    setSelectedStyle('auto');
    setAppState(AppState.IDLE);
    setAnalysisData(null);
    setErrorMsg(null);
    sessionStorage.removeItem('ozonsight_last_result');
    sessionStorage.removeItem('ozonsight_last_previews');
  };

  const handleSaveApiKey = () => {
      if (apiKeyInput.trim()) {
          localStorage.setItem('ozonsight_gemini_api_key', apiKeyInput.trim());
          setIsApiKeySaved(true);
      } else {
          localStorage.removeItem('ozonsight_gemini_api_key');
          setIsApiKeySaved(false);
      }
  };

  const startAnalysis = async () => {
    if (selectedFiles.length === 0) return;

    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    setLoadingProgress(5);
    setLoadingStep("正在准备素材...");
    
    let progressInterval: any = null;

    try {
      // 1. Process images in parallel
      setLoadingStep("正在深度优化图片素材...");
      const base64Promises = selectedFiles.map(async (file) => {
        const b64 = await fileToBase64(file);
        setLoadingProgress(prev => Math.min(45, prev + (40 / selectedFiles.length)));
        return b64;
      });
      
      const base64Images = await Promise.all(base64Promises);

      // Save processed images for persistence (using thumbnails/resizes)
      sessionStorage.setItem('ozonsight_last_previews', JSON.stringify(base64Images));
      setPersistedPreviews(base64Images);

      // 2. Request analysis
      setLoadingStep("正在连接 AI 视觉实验室 (极速模式)...");
      setLoadingProgress(50);
      
      // Use a more robust progress simulation
      const startTime = Date.now();
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        // Progress from 50 to 95 over 20 seconds
        const simulated = 50 + Math.min(45, Math.floor(elapsed / 400));
        setLoadingProgress(simulated);
        
        const hints = [
          "正在识别产品视觉特征...",
          "正在分析俄罗斯市场趋势...",
          "正在生成高转化率营销方案...",
          "正在翻译并优化俄语内容...",
          "正在整理最终视觉蓝图..."
        ];
        const stepIdx = Math.min(Math.floor((simulated - 50) / 10), hints.length - 1);
        setLoadingStep(hints[stepIdx]);
      }, 500);

      const mimeTypes = selectedFiles.map(file => file.type);
      const result = await analyzeProductImage(
        base64Images, 
        mimeTypes, 
        contextText, 
        selectedStyle, 
        customStyleDesc
      );
      
      // Save result to persist through reloads/refreshes
      sessionStorage.setItem('ozonsight_last_result', JSON.stringify(result));
      
      setAnalysisData(result);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      // Check if the error is due to abortion or unmount (optional)
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "分析失败，请检查网络连接或尝试减少图片数量。");
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      setLoadingProgress(0);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* === LEFT SIDEBAR: CONTROLS === */}
      <aside className="w-full lg:w-[400px] bg-slate-50/50 border-r border-slate-200 flex flex-col shrink-0 z-30 relative">
        
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
           <Header />
        </div>

        {/* Scrollable Inputs */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-10">
           
           <div className="space-y-3">
              <SectionLabel number="01" title="产品素材" subtitle="Product Source" />
              <ImageUpload 
                  onImagesSelect={handleImagesSelect}
                  selectedImages={selectedFiles}
                  persistedPreviews={persistedPreviews}
                  onClear={handleClear}
                  isAnalyzing={appState === AppState.ANALYZING}
               />
           </div>

           <div className="space-y-3">
              <SectionLabel number="02" title="视觉策略" subtitle="Visual Strategy" />
              <StyleSelector 
                  selectedStyle={selectedStyle}
                  onSelect={setSelectedStyle}
                  customStyleDesc={customStyleDesc}
                  onCustomStyleChange={setCustomStyleDesc}
                  disabled={appState === AppState.ANALYZING}
              />
           </div>

           <div className="space-y-3">
              <SectionLabel number="03" title="补充信息 (选填)" subtitle="Context" />
              <ContextInput 
                  value={contextText}
                  onChange={setContextText}
                  disabled={appState === AppState.ANALYZING}
              />
           </div>

           <div className="space-y-3">
              <SectionLabel number="04" title="API 设置" subtitle="Settings" />
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                     <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer select-none">
                         <Key size={14} className="text-slate-400" />
                         Gemini API Key
                     </label>
                  </div>
                  <div className="flex items-center gap-2">
                     <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={apiKeyInput}
                        onChange={(e) => {
                            setApiKeyInput(e.target.value);
                            setIsApiKeySaved(false);
                        }}
                        disabled={appState === AppState.ANALYZING}
                        className="flex-1 w-full text-sm placeholder:text-slate-300 border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                     />
                     <button
                        onClick={handleSaveApiKey}
                        disabled={appState === AppState.ANALYZING || (!apiKeyInput && !isApiKeySaved)}
                        className={`px-3 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${isApiKeySaved ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                     >
                        {isApiKeySaved ? '已保存' : '保存'}
                     </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                     Key 仅保存在您的浏览器本地，不会上传到任何服务器。
                  </p>
              </div>
           </div>
        </div>

        {/* Fixed Footer Action Area */}
        <div className="p-6 border-t border-slate-200 bg-white flex-shrink-0 z-10">
            {appState === AppState.ERROR && (
               <div className="mb-4 bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                 <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                 <div>{errorMsg}</div>
               </div>
            )}

            <button
              onClick={startAnalysis}
              disabled={selectedFiles.length === 0 || appState === AppState.ANALYZING}
              className={`
                 group w-full relative overflow-hidden text-sm font-semibold py-4 px-6 rounded-lg transition-all duration-300
                 ${selectedFiles.length === 0 || appState === AppState.ANALYZING 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-900/20 hover:-translate-y-0.5'}
              `}
            >
               {appState === AppState.ANALYZING ? (
                 <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-slate-400" />
                    <span className="text-slate-300">正在解析视觉结构...</span>
                 </div>
               ) : (
                 <div className="flex items-center justify-center gap-2">
                    <Sparkles size={16} className={selectedFiles.length > 0 ? "text-indigo-400 fill-indigo-400" : ""} />
                    <span>生成视觉营销方案</span>
                    {selectedFiles.length > 0 && <ArrowRight size={16} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                 </div>
               )}
            </button>
        </div>
      </aside>

      {/* === RIGHT MAIN STAGE: RESULTS === */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative bg-white">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none fixed"></div>

        {/* Top Status Bar */}
        <div className="sticky top-0 z-20 px-8 py-4 flex justify-end items-center gap-3 bg-white/80 backdrop-blur-md pointer-events-none border-b border-transparent transition-all">
           <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200/60 shadow-sm text-[10px] font-medium text-slate-500 pointer-events-auto tracking-tight">
              <Globe size={12} className="text-indigo-600" />
              <span>跨境视觉优化</span>
           </div>
           <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200/60 shadow-sm text-[10px] font-medium text-slate-500 pointer-events-auto tracking-tight">
              <Zap size={12} className="text-amber-500 fill-amber-500" />
              <span>Gemini 1.5 Pro (Expert)</span>
           </div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-5xl mx-auto px-8 pb-24 pt-4 min-h-full">
           {appState === AppState.SUCCESS && analysisData ? (
             <AnalysisResult data={analysisData} />
           ) : appState === AppState.ANALYZING ? (
             <div className="flex flex-col items-center justify-center min-h-[75vh]">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                            <Loader2 size={32} className="animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{loadingStep}</h3>
                        <p className="text-slate-500 text-sm">正在深度解析 {selectedFiles.length} 张产品原图，请稍候...</p>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                                style={{ width: `${loadingProgress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Initializing</span>
                            <span>{loadingProgress}%</span>
                            <span>Complete</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processing</span>
                            <div className="text-sm font-medium text-slate-700 capitalize">High-Res Textures</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Optimization</span>
                            <div className="text-sm font-medium text-slate-700 capitalize">Ozon Style Guide</div>
                        </div>
                    </div>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center min-h-[75vh]">
                <div className="relative mb-8 group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                   <div className="relative w-24 h-24 bg-white rounded-full border border-slate-100 shadow-xl flex items-center justify-center">
                      <Command size={40} className="text-slate-300 group-hover:text-slate-800 transition-colors duration-500" />
                   </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">准备就绪</h2>
                <p className="text-slate-500 mt-2 max-w-sm text-center text-sm leading-relaxed">
                   在左侧上传产品原图，AI 将为您生成<br/>针对俄罗斯市场的高转化率视觉方案。
                </p>
                
                {/* Visual Steps */}
                <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-md opacity-40">
                   <div className="text-center space-y-3">
                      <div className="h-px w-full bg-slate-300 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-slate-400"></div>
                      </div>
                      <span className="text-xs font-medium text-slate-900">1. 上传</span>
                   </div>
                   <div className="text-center space-y-3">
                      <div className="h-px w-full bg-slate-300 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-slate-300 border border-white"></div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">2. 分析</span>
                   </div>
                   <div className="text-center space-y-3">
                      <div className="h-px w-full bg-slate-300 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-slate-300 border border-white"></div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">3. 结果</span>
                   </div>
                </div>
             </div>
           )}
        </div>

      </main>
    </div>
  );
};

const SectionLabel = ({number, title, subtitle}: {number: string, title: string, subtitle: string}) => (
    <div className="flex items-baseline justify-between mb-1">
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">{number}</span>
            <h3 className="text-xs font-bold text-slate-800 tracking-wide">{title}</h3>
        </div>
        <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">{subtitle}</span>
    </div>
);

export default App;