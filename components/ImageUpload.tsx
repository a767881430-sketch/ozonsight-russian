import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Plus, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImagesSelect: (files: File[]) => void;
  selectedImages: File[];
  persistedPreviews?: string[];
  onClear: () => void;
  isAnalyzing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
    onImagesSelect, 
    selectedImages, 
    persistedPreviews = [],
    onClear, 
    isAnalyzing 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // If we have actual file objects, use them
    if (selectedImages.length > 0) {
        const newPreviews = selectedImages.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
        return () => {
          newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    } 
    // Fallback to persisted base64 previews if available (e.g. after reload)
    else if (persistedPreviews && persistedPreviews.length > 0) {
        setPreviews(persistedPreviews.map(b64 => b64.startsWith('data:') ? b64 : `data:image/jpeg;base64,${b64}`));
    }
    else {
        setPreviews([]);
    }
  }, [selectedImages, persistedPreviews]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert("请上传有效的图片文件。");
      return;
    }
    onImagesSelect([...selectedImages, ...validFiles]);
  };

  const removeImage = (index: number) => {
    const newFiles = selectedImages.filter((_, i) => i !== index);
    onImagesSelect(newFiles);
    if (newFiles.length === 0) {
        onClear();
    }
  };

  const triggerClick = () => {
    inputRef.current?.click();
  };

  // State: Images Selected
  if (previews.length > 0) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-3 gap-2">
            {previews.map((url, idx) => (
                <div key={idx} className="group relative aspect-square rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={url} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                    {!isAnalyzing && selectedImages.length > 0 && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                className="text-white hover:text-red-400 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
            ))}
            
            {!isAnalyzing && selectedImages.length > 0 && (
                <button 
                    onClick={triggerClick}
                    className="aspect-square flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-md hover:border-slate-500 hover:bg-slate-50 transition-all group"
                >
                    <Plus size={18} className="text-slate-400 group-hover:text-slate-600" />
                </button>
            )}
        </div>

        {!isAnalyzing && (
             <div className="flex justify-between items-center mt-3 px-1">
                <span className="text-[10px] font-medium text-slate-400">已分析 {previews.length} 张图片</span>
                <button 
                    onClick={onClear}
                    className="text-[10px] text-slate-400 hover:text-red-600 transition-colors font-medium"
                >
                    清空并重置
                </button>
             </div>
        )}
        <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept="image/*" multiple />
      </div>
    );
  }

  // State: Empty
  return (
    <div 
      className={`relative h-32 flex flex-col items-center justify-center p-4 border border-dashed rounded-lg transition-all duration-300 cursor-pointer overflow-hidden group
        ${dragActive 
            ? "border-indigo-500 bg-indigo-50/50" 
            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 bg-white"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={triggerClick}
    >
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept="image/*" multiple />
      
      <div className="flex flex-col items-center gap-2">
          <div className="p-2 rounded-full bg-slate-50 border border-slate-100 text-slate-400 group-hover:scale-110 transition-transform">
            <ImageIcon size={20} />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700">点击或拖拽上传</p>
            <p className="text-[10px] text-slate-400 mt-0.5">支持 PNG, JPG</p>
          </div>
      </div>
    </div>
  );
};

export default ImageUpload;