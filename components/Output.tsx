
import React, { useState, useEffect } from 'react';
import { ExecutionResult, HtmlElement } from '../types';
import { RefreshCw, Globe, ArrowLeft, ArrowRight, Lock } from 'lucide-react';

interface OutputProps {
  result: ExecutionResult | null;
  isLoading: boolean;
}

const VideoPlayer: React.FC<{ frames: string[], prompt: string }> = ({ frames, prompt }) => {
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % frames.length);
        }, 500); // 2 FPS
        return () => clearInterval(interval);
    }, [frames.length]);

    return (
        <div className="border border-slate-700 rounded-lg p-2 bg-slate-900 mt-2">
            <div className="text-xs text-emerald-400 mb-1 flex justify-between">
                <span>محاكاة فيديو (AI)</span>
                <span>{prompt}</span>
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded bg-black">
                <img src={frames[index]} alt="Video Frame" className="w-full h-full object-cover animate-fade" />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 rounded">
                    إطار {index + 1}/{frames.length}
                </div>
            </div>
        </div>
    );
};

// Helper to convert CSS string (e.g., "color: red; margin-top: 10px") to React Style Object
const parseStyleString = (styleString?: string): React.CSSProperties => {
    if (!styleString) return {};
    const style: any = {};
    styleString.split(';').forEach(rule => {
        const [key, value] = rule.split(':');
        if (key && value) {
            // Convert kebab-case (background-color) to camelCase (backgroundColor)
            const prop = key.trim().replace(/-./g, c => c.substr(1).toUpperCase());
            style[prop] = value.trim();
        }
    });
    return style;
};

const WebPreview: React.FC<{ elements: HtmlElement[] }> = ({ elements }) => {
    return (
        <div className="mt-4 rounded-lg bg-slate-100 overflow-hidden border border-slate-700 relative text-slate-900 shadow-xl flex flex-col">
             {/* Browser Toolbar Simulation */}
             <div className="bg-slate-200 px-3 py-2 border-b border-slate-300 flex items-center gap-3">
                 <div className="flex gap-1.5">
                     <span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-500/50"></span>
                     <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-500/50"></span>
                     <span className="w-2.5 h-2.5 rounded-full bg-green-400 border border-green-500/50"></span>
                 </div>
                 <div className="flex gap-2 text-slate-400">
                    <ArrowLeft size={14} />
                    <ArrowRight size={14} />
                    <RefreshCw size={14} />
                 </div>
                 <div className="flex-1 bg-white rounded-md border border-slate-300 px-2 py-1 flex items-center gap-2 text-xs text-slate-500 font-sans shadow-inner">
                    <Lock size={10} className="text-green-600" />
                    <span className="opacity-50">https://</span>
                    <span className="text-slate-700">localhost:3000/index.html</span>
                 </div>
             </div>

             {/* Content Area */}
             <div className="p-6 font-sans space-y-4 min-h-[200px] bg-white text-right" dir="rtl">
                 {elements.map((el, idx) => {
                     const inlineStyle = parseStyleString(el.style);
                     
                     if (el.tag === 'title') return null; // Titles are handled in metadata usually

                     if (el.tag === 'h1') return (
                        <h1 key={idx} id={el.id} style={inlineStyle} className="text-3xl font-bold text-slate-800 border-b pb-2 mb-4">
                            {el.content}
                        </h1>
                     );
                     
                     if (el.tag === 'p') return (
                        <p key={idx} id={el.id} style={inlineStyle} className="text-base text-slate-700 leading-relaxed mb-2">
                            {el.content}
                        </p>
                     );
                     
                     if (el.tag === 'button') return (
                        <button 
                            key={idx} 
                            id={el.id}
                            style={inlineStyle}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow transition-colors font-medium ml-2 mb-2"
                            onClick={() => alert(`Button Clicked: ${el.content}`)}
                        >
                            {el.content}
                        </button>
                     );
                     
                     if (el.tag === 'input') return (
                        <input 
                            key={idx} 
                            id={el.id} 
                            style={inlineStyle}
                            placeholder={el.content} 
                            className="border border-slate-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 ml-2 mb-2 w-64" 
                        />
                     );
                     
                     if (el.tag === 'img') return (
                        <img 
                            key={idx} 
                            id={el.id} 
                            style={inlineStyle}
                            src={el.content} 
                            alt="Generated" 
                            className="max-w-full h-auto rounded-lg shadow-sm mb-4 border border-slate-200" 
                        />
                     );
                     
                     // Generic Fallback
                     return (
                        <div key={idx} id={el.id} style={inlineStyle} className="text-sm text-slate-500 mb-2">
                            {el.content}
                        </div>
                     );
                 })}
                 {elements.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-slate-300 py-10">
                        <Globe size={48} className="mb-2 opacity-20" />
                        <span className="italic">الصفحة فارغة</span>
                     </div>
                 )}
             </div>
        </div>
    );
};

const Output: React.FC<OutputProps> = ({ result, isLoading }) => {
  return (
    <div className="w-full h-full bg-black rounded-lg border border-slate-800 flex flex-col shadow-2xl overflow-hidden font-mono text-sm relative">
      <div className="bg-slate-900 px-4 py-2 text-xs text-slate-400 border-b border-slate-800 flex justify-between items-center">
        <span className="font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            المخرجات (Console & Preview)
        </span>
        {isLoading && <span className="text-blue-400 animate-pulse text-[10px]">جاري التنفيذ...</span>}
      </div>

      <div className="flex-1 p-4 overflow-auto space-y-2 text-right custom-scrollbar" dir="rtl">
        {!result && !isLoading && (
          <div className="text-slate-600 italic text-center mt-20 flex flex-col items-center">
            <div className="w-16 h-1 bg-slate-800 rounded mb-2"></div>
            اضغط على "تشغيل" لرؤية النتائج
          </div>
        )}

        {isLoading && (
            <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2 animate-pulse"></div>
            </div>
        )}
        
        {/* Render Generated HTML Elements first if any */}
        {result?.generatedHtmlElements && result.generatedHtmlElements.length > 0 && (
            <WebPreview elements={result.generatedHtmlElements} />
        )}

        {/* Standard Console Logs */}
        {result?.output.map((log, idx) => (
          <div key={idx} className="text-green-400 font-mono border-b border-slate-800/50 pb-1 break-words whitespace-pre-wrap">
            <span className="text-slate-600 mr-2 select-none">$</span>
            {log}
          </div>
        ))}

        {result?.generatedImages && result.generatedImages.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4">
            {result.generatedImages.map((img, idx) => (
              <div key={idx} className="border border-slate-700 rounded-lg p-2 bg-slate-900">
                <div className="text-xs text-slate-400 mb-2">الصورة المولدة #{idx + 1}</div>
                <img src={img} alt="Generated AI" className="w-full h-auto rounded" />
              </div>
            ))}
          </div>
        )}
        
        {result?.generatedVideos && result.generatedVideos.map((video, idx) => (
             <VideoPlayer key={idx} frames={video.frames} prompt={video.prompt} />
        ))}

        {result?.error && (
          <div className="text-red-400 mt-2 p-3 bg-red-950/30 rounded border border-red-900/50 flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <div>
                <div className="font-bold underline mb-1">خطأ (Error):</div>
                {result.error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;
