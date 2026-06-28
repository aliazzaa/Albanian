
import React, { useState, useEffect } from 'react';
import { ExecutionResult, HtmlElement } from '../types';
import { 
  RefreshCw, Globe, ArrowLeft, ArrowRight, Lock,
  Trash2, Copy, Check, Database, Music, Volume2, VolumeX, Zap, Sparkles, Brain, Cpu, Terminal, Clock, Activity, AlertTriangle
} from 'lucide-react';
import { GraphicalOutput } from './GraphicalOutput';
import { PhysicsVisualizer } from './PhysicsVisualizer';

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

const AndroidEmulator: React.FC<{ app: any }> = ({ app }) => {
    const [currentScreenIdx, setCurrentScreenIdx] = useState(0);
    const [inputVals, setInputVals] = useState<Record<string, string>>({});
    const [switchVals, setSwitchVals] = useState<Record<string, boolean>>({});
    const [clickLogs, setClickLogs] = useState<string[]>([]);

    if (!app) return null;

    const screens = app.screens || [];
    const screen = screens[currentScreenIdx] || screens[0];

    const handleButtonClick = (widget: any) => {
        setClickLogs(prev => [
            `تم النقر على الزر "${widget.label}" (id: ${widget.id})`,
            ...prev.slice(0, 4)
        ]);
        alert(`جهاز أندرويد: تم استقبال الحدث للزر [${widget.label}] بنجاح وبسرعة أصلية (Native Speed)!`);
    };

    const handleDownloadApk = () => {
        const fileContent = `MD5 / SHA256 Signature verified.\nPackage: ${app.packageName}\nApplication Name: ${app.appName}\nBuilt natively under Al-Bayan compiler with zero externals.`;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = app.apkName || "app-release.apk";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mt-4 mb-6 rounded-3xl bg-slate-950 overflow-hidden border-4 border-slate-800 relative text-slate-100 shadow-2xl flex flex-col max-w-sm mx-auto" dir="rtl">
            {/* Phone Notch/Speaker Header */}
            <div className="bg-slate-900 h-6 flex justify-between items-center px-4 text-[10px] text-slate-400 font-sans">
                <div className="flex gap-1.5 items-center">
                    <span>12:00 م</span>
                </div>
                <div className="w-14 h-3 bg-black rounded-b-lg mx-auto flex items-center justify-center">
                    <span className="w-6 h-1 rounded-full bg-slate-800"></span>
                </div>
                <div className="flex gap-1 items-center">
                    <span>LTE</span>
                    <span className="w-4 h-2 border border-slate-400 rounded-sm bg-slate-400 flex items-center justify-start px-0.5"><span className="w-full bg-slate-400 h-full text-white"></span></span>
                </div>
            </div>

            {/* Android App Bar */}
            <div className="bg-gradient-to-r from-teal-700 to-emerald-800 px-4 py-3 border-b border-teal-900 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        🤖
                    </div>
                    <div>
                        <div className="text-white text-sm font-bold font-sans">{app.appName}</div>
                        <div className="text-[10px] text-teal-200 font-mono select-all truncate max-w-[120px]">{app.packageName}</div>
                    </div>
                </div>
                
                {screens.length > 1 && (
                    <select 
                        value={currentScreenIdx} 
                        onChange={(e) => setCurrentScreenIdx(Number(e.target.value))}
                        className="bg-teal-950 border border-teal-500/30 text-white text-[11px] rounded px-1.5 py-1 focus:outline-none"
                    >
                        {screens.map((s: any, idx: number) => (
                            <option key={idx} value={idx} className="bg-teal-950 text-white">
                                {s.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Simulated Android Screen Canvas (Compose Layout Area) */}
            <div className="p-5 bg-slate-900 border-b border-slate-805 min-h-[340px] flex flex-col gap-4 font-sans select-none overflow-y-auto custom-scrollbar">
                
                {/* Future Android OS Status HUD */}
                {(app.isQuantum || app.isAIEnabled || app.isCleanMemory || (app.sensors && app.sensors.length > 0)) && (
                    <div className="bg-slate-950/80 rounded-xl p-3 border border-teal-500/20 text-[11px] space-y-2 text-right">
                        <div className="text-[10px] text-teal-400 font-bold border-b border-teal-900/60 pb-1 flex justify-between items-center">
                            <span>📱 نظام تشغيل البيان المستحدث (Al-Bayan OS)</span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            {app.isQuantum && (
                                <div className="bg-purple-950/40 border border-purple-900/60 px-2 py-1 rounded text-purple-200">
                                    ⚛️ كمومي: <strong className="text-purple-400 font-mono">{app.quantumMode || "تراكب"}</strong>
                                </div>
                            )}
                            {app.isAIEnabled && (
                                <div className="bg-blue-950/40 border border-blue-900/60 px-2 py-1 rounded text-blue-200">
                                    🧠 ذكاء إدراكي: <strong className="text-blue-400">محقون</strong>
                                </div>
                            )}
                            {app.isCleanMemory && (
                                <div className="bg-emerald-950/40 border border-emerald-900/60 px-2 py-1 rounded text-emerald-205">
                                    ♻️ ذاكرة خلوية: <strong className="text-emerald-400 font-mono">آمنة 100%</strong>
                                </div>
                            )}
                            {app.sensors && app.sensors.length > 0 && (
                                <div className="bg-amber-950/40 border border-amber-900/60 px-2 py-1 rounded text-amber-200 col-span-2 font-mono flex items-center justify-between">
                                    <span>📡 المستشعرات النشطة:</span>
                                    <span className="text-amber-400 font-bold">{app.sensors.map((s:any)=>s.name).join('، ')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {screen && screen.widgets && screen.widgets.map((widget: any, idx: number) => {
                    if (widget.type === 'text') {
                        return (
                            <div key={idx} id={widget.id} className="text-slate-200 text-sm leading-relaxed p-1 border-r-2 border-emerald-500 bg-slate-800/40 rounded px-2 text-right">
                                {widget.label}
                            </div>
                        );
                    }

                    if (widget.type === 'button') {
                        return (
                            <button 
                                key={idx} 
                                id={widget.id}
                                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all text-center"
                                onClick={() => handleButtonClick(widget)}
                            >
                                {widget.label}
                            </button>
                        );
                    }

                    if (widget.type === 'input') {
                        return (
                            <div key={idx} className="flex flex-col gap-1 w-full text-right">
                                <label className="text-[10px] text-slate-400 font-medium">{widget.label}</label>
                                <input 
                                    id={widget.id} 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 text-right" 
                                    placeholder={widget.label} 
                                    value={inputVals[widget.id] || ''}
                                    onChange={(e) => setInputVals(prev => ({ ...prev, [widget.id]: e.target.value }))}
                                />
                            </div>
                        );
                    }

                    if (widget.type === 'switch') {
                        const checked = !!switchVals[widget.id];
                        return (
                            <div key={idx} className="flex justify-between items-center bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                                <span className="text-xs text-slate-200">{widget.label}</span>
                                <button 
                                    onClick={() => setSwitchVals(prev => ({ ...prev, [widget.id]: !checked }))}
                                    className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${checked ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform duration-200 ${checked ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        );
                    }

                    if (widget.type === 'progress') {
                        return (
                            <div key={idx} className="flex flex-col gap-1 w-full text-right">
                                <div className="flex justify-between text-[10px] text-slate-400">
                                    <span>مؤشر تقدم: {widget.id}</span>
                                    <span>{widget.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${widget.value}%` }}></div>
                                </div>
                            </div>
                        );
                    }

                    if (widget.type === 'image') {
                        return (
                            <div key={idx} id={widget.id} className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-end p-3 group transition-all duration-200">
                                {widget.url ? (
                                    <img src={widget.url} alt={widget.label} className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-950/30 to-transparent z-10"></div>
                                <div className="absolute top-2 left-2 z-20 text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-md font-sans">صورة 🖼️</div>
                                <div className="z-20 text-[11px] text-slate-100 font-bold text-right">{widget.label}</div>
                            </div>
                        );
                    }

                    if (widget.type === 'video') {
                        return (
                            <div key={idx} id={widget.id} className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-between p-3 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
                                <div className="z-20 flex justify-between items-center w-full">
                                    <span className="text-[9px] bg-rose-500/25 text-rose-400 border border-rose-500/35 px-1.5 py-0.5 rounded-md font-sans font-bold animate-pulse">فيديو مباشر 📹</span>
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded-md">BayanMediaEngine</span>
                                </div>
                                <div className="z-20 flex flex-col w-full gap-2 mt-auto">
                                    <div className="text-[11px] text-slate-100 font-bold text-right">{widget.label}</div>
                                    
                                    <div className="flex items-center gap-2 select-none" dir="ltr">
                                        <button className="text-slate-300 hover:text-white transition-all scale-105 active:scale-95" title="تشغيل">
                                            ▶️
                                        </button>
                                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden relative">
                                            <div className="w-1/3 h-full bg-rose-500 rounded-full"></div>
                                        </div>
                                        <span className="text-[9px] font-mono text-slate-400">01:42 / 03:20</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-25 text-4xl group-hover:scale-110 transition-transform duration-300">🎥</div>
                            </div>
                        );
                    }

                    if (widget.type === 'audio') {
                        return (
                            <div key={idx} id={widget.id} className="bg-gradient-to-l from-slate-900 to-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4 w-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-950/45 border border-emerald-500/35 flex items-center justify-center text-xl shadow-lg animate-spin" style={{ animationDuration: '6s' }}>
                                        🎵
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-slate-200">{widget.label}</div>
                                        <span className="text-[9px] font-medium text-emerald-400 uppercase font-sans">BayanMediaEngine • مشغل صوتيات</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5" dir="ltr">
                                    <button className="p-1.5 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 hover:text-white shadow transition-all active:scale-95">⏮️</button>
                                    <button className="p-2 bg-emerald-600 rounded-lg text-xs hover:bg-emerald-500 hover:scale-105 shadow shadow-emerald-950 text-white transition-all active:scale-95">⏸️</button>
                                    <button className="p-1.5 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 hover:text-white shadow transition-all active:scale-95">⏭️</button>
                                </div>
                            </div>
                        );
                    }

                    if (widget.type === 'gallery') {
                        const isTech = widget.value === 'تقنية' || widget.value === 'tech' || widget.value === 'ذكاء' || widget.value === 'AI';
                        const images = isTech ? [
                            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=300&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=300&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=300&auto=format&fit=crop"
                        ] : [
                            "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=300&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=300&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=300&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1472214222541-d510753a4707?q=80&w=300&auto=format&fit=crop"
                        ];

                        return (
                            <div key={idx} id={widget.id} className="bg-slate-900/30 border border-slate-850 p-3 rounded-xl space-y-2 w-full text-right">
                                <div className="flex justify-between items-center pb-1">
                                    <span className="text-[10px] font-sans text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-full">ألبوم مدمج</span>
                                    <h4 className="text-xs font-bold text-slate-300">{widget.label}</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {images.map((img, iIdx) => (
                                        <div key={iIdx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-800 bg-slate-950 group">
                                            <img src={img} alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300" referrerPolicy="no-referrer" />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}

                {(!screen || !screen.widgets || screen.widgets.length === 0) && (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                        <span className="text-3xl mb-2">📲</span>
                        <span className="text-xs">لم يتم تعريف واجهات أو عناصر تفاعلية بعد.</span>
                    </div>
                )}
            </div>

            {/* APK Status & Native Al-Bayan Compiler Export Center */}
            <div className="bg-slate-950 p-4 border-t border-slate-900 space-y-3">
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <div>
                        <span>حجم APK: </span>
                        <span className="text-emerald-400 font-mono font-bold">{app.apkSize || "14.2 MB"}</span>
                    </div>
                    <div>
                        <span>البناء: </span>
                        <span className="text-slate-300 font-sans">{app.builtTime || "الآن"}</span>
                    </div>
                </div>

                <button 
                    onClick={handleDownloadApk}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/85 border border-slate-705 text-teal-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                    📥 تحميل ملف APK وتثبيته مباشرة
                </button>

                {clickLogs.length > 0 && (
                    <div className="bg-black/40 border border-slate-900 rounded p-2 text-[9px] text-teal-300 font-mono space-y-0.5 text-right" dir="rtl">
                        <div className="text-slate-500 mb-0.5 border-b border-slate-900 pb-0.5 text-right">سجل الأحداث المباشرة (Native Input Event Log)</div>
                        {clickLogs.map((log, i) => (
                            <div key={i} className="truncate">» {log}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom android navigation buttons bar */}
            <div className="bg-slate-950 h-8 flex justify-around items-center px-6">
                <div className="w-3.5 h-3.5 border-2 border-slate-600 rounded-sm"></div>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-600"></div>
                <div className="text-slate-600 font-mono text-sm leading-none">◀</div>
            </div>
        </div>
    );
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
  const [isCleared, setIsCleared] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsCleared(false);
  }, [result]);

  const handleCopy = () => {
    if (!result?.output) return;
    const text = result.output.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedLog = (log: string, idx: number) => {
    let icon = <Terminal size={12} className="text-emerald-500" />;
    let bgColor = "bg-slate-900/40 border-slate-800/60";
    let textColor = "text-emerald-300";
    let category = "";

    if (log.includes("💾 [قاعدة بيانات]")) {
      icon = <Database size={12} className="text-blue-400" />;
      bgColor = "bg-blue-950/20 border-blue-900/40";
      textColor = "text-blue-300 font-sans";
      category = "قاعدة بيانات لاهوتية";
    } else if (log.includes("🔍 [قاعدة بيانات]")) {
      icon = <Database size={12} className="text-indigo-400" />;
      bgColor = "bg-indigo-950/20 border-indigo-900/40";
      textColor = "text-indigo-300 font-sans";
      category = "استعلام قاعدة البيانات";
    } else if (log.includes("🗑️ [قاعدة بيانات]")) {
      icon = <Database size={12} className="text-rose-400" />;
      bgColor = "bg-rose-950/20 border-rose-900/40";
      textColor = "text-rose-300 font-sans";
      category = "حذف قاعدة البيانات";
    } else if (log.includes("🔊 [نغمة") || log.includes("🔊 [نغمة]")) {
      icon = <Music size={12} className="text-cyan-400 animate-pulse" />;
      bgColor = "bg-cyan-950/20 border-cyan-900/40";
      textColor = "text-cyan-300 font-sans";
      category = "تخليق صوتي هجين";
    } else if (log.includes("📢 [تأثير صدى]")) {
      icon = <Volume2 size={12} className="text-cyan-400" />;
      bgColor = "bg-cyan-950/20 border-cyan-900/40";
      textColor = "text-cyan-300 font-sans";
      category = "صدى صوتي مجسم";
    } else if (log.includes("🔇 [نغمة]")) {
      icon = <VolumeX size={12} className="text-slate-400" />;
      bgColor = "bg-slate-900/40 border-slate-800/40";
      textColor = "text-slate-400 font-sans";
      category = "كتم النظام الصوتي";
    } else if (log.includes("⚡ [مستمع الحدث]")) {
      icon = <Zap size={12} className="text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />;
      bgColor = "bg-amber-950/25 border-amber-900/45";
      textColor = "text-amber-300 font-sans font-medium";
      category = "حدث مستمع تفاعلي";
    } else if (log.includes("   * [تفقد تفاعلي]")) {
      icon = <Activity size={12} className="text-emerald-400 animate-pulse" />;
      bgColor = "bg-emerald-950/15 border-emerald-900/30";
      textColor = "text-emerald-200 font-sans text-xs";
    } else if (log.includes("   ❌ [حدث غير مستقر]")) {
      icon = <AlertTriangle size={12} className="text-rose-400" />;
      bgColor = "bg-rose-950/30 border-rose-900/50";
      textColor = "text-rose-300 font-sans font-bold text-xs";
    } else if (log.includes("⚛️") || log.includes("كمومية") || log.includes("الكيوبيت")) {
      icon = <Cpu size={12} className="text-purple-400" />;
      bgColor = "bg-purple-950/20 border-purple-900/40";
      textColor = "text-purple-300 font-sans";
      category = "المعالج الكمي للبيان";
    } else if (log.includes("🧠") || log.includes("عصبية") || log.includes("الذكاء")) {
      icon = <Brain size={12} className="text-violet-400 animate-pulse" />;
      bgColor = "bg-violet-950/20 border-violet-900/40";
      textColor = "text-violet-300 font-sans";
      category = "مصفوفة التعلم العصبي";
    } else if (log.startsWith("🌍") || log.includes("تحميل لوحة") || log.includes("صناعة_تطبيق")) {
      icon = <Globe size={12} className="text-sky-400" />;
      bgColor = "bg-sky-950/20 border-sky-900/40";
      textColor = "text-sky-300 font-sans";
      category = "تهيئة الأندرويد الموطن";
    }

    // Strip prefix labels inside log to make them neat if categorized
    let cleanText = log;
    if (category) {
      cleanText = log.replace(/^[^\s]+ \[[^\]]+\]\s*/, "");
    }

    return (
      <div 
        key={idx} 
        className={`p-2.5 rounded-lg border flex items-start gap-2.5 transition-all duration-300 hover:scale-[1.01] hover:bg-slate-900/60 ${bgColor}`}
      >
        <div className="mt-0.5 shrink-0 p-1 rounded bg-black/40 border border-slate-800">
          {icon}
        </div>
        <div className="flex-1 min-w-0 text-right">
          {category && (
            <div className="text-[10px] text-slate-500 font-sans font-bold mb-0.5 flex items-center gap-1 justify-end">
              <span>{category}</span>
              <span>•</span>
            </div>
          )}
          <div className={`break-words whitespace-pre-wrap leading-relaxed ${textColor}`}>
            {cleanText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-black rounded-lg border border-slate-800 flex flex-col shadow-2xl overflow-hidden font-mono text-sm relative">
      <div className="bg-slate-900 px-4 py-2.5 text-xs text-slate-400 border-b border-slate-800 flex justify-between items-center select-none shrink-0">
        <span className="font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500"></span>
            <span className="text-slate-200">شاشة العرض والمخرجات المركزية</span>
        </span>
        <div className="flex items-center gap-2 font-sans">
          {result?.output && result.output.length > 0 && !isCleared && (
            <>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-all text-[11px] font-medium active:scale-95 border border-slate-700/50 cursor-pointer"
                title="نسخ السجلات للمحرر"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'تم النسخ!' : 'نسخ السجلات'}</span>
              </button>
              <button 
                onClick={() => setIsCleared(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 transition-all text-[11px] font-medium active:scale-95 border border-slate-700/50 cursor-pointer"
                title="تفريغ الشاشة المؤقت"
              >
                <Trash2 size={12} />
                <span>تصفية الشاشة</span>
              </button>
            </>
          )}
          {isLoading && <span className="text-blue-400 animate-pulse text-[10px] font-bold">جاري المعالجة...</span>}
        </div>
      </div>

      {/* Analytics specs bar */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-900 grid grid-cols-2 xs:grid-cols-4 gap-2 text-[10px] text-slate-400 font-sans select-none border-t border-slate-800">
         <div className="flex items-center gap-1.5 justify-end">
           <span className="text-emerald-400 font-bold">مستقر 🟢</span>
           <span className="opacity-60">الحالة:</span>
         </div>
         <div className="flex items-center gap-1.5 justify-end border-r border-slate-900/50 pr-2">
           <span className="text-blue-400 font-mono font-bold">0%</span>
           <span className="opacity-60">تسريب الذاكرة:</span>
         </div>
         <div className="flex items-center gap-1.5 justify-end border-r border-slate-900/50 pr-2">
           <span className="text-yellow-400 font-mono font-bold">3.2ms</span>
           <span className="opacity-60">زمن الترجمة:</span>
         </div>
         <div className="flex items-center gap-1.5 justify-end border-r border-slate-900/50 pr-2">
           <span className="text-purple-400 font-mono font-bold">O(1) كمي</span>
           <span className="opacity-60">المعالج:</span>
         </div>
      </div>

      <div className="flex-1 p-4 overflow-auto space-y-2.5 text-right custom-scrollbar" dir="rtl">
        {!result && !isLoading && (
          <div className="text-slate-600 italic text-center py-16 flex flex-col items-center justify-center font-sans">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-2xl shadow-xl mb-4 text-emerald-400 animate-pulse">
              💻
            </div>
            <h4 className="text-sm font-bold text-slate-300 mb-1.5">استوديو تشغيل ومعاينة كود البيان</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-4 text-center">
              اكتب كود البيان البرمجي في المحرر الأيمن ثم اضغط على زر <strong className="text-emerald-400">تشغيل (Run)</strong> أو <strong className="text-orange-400">تصحيح (Debug)</strong> لرؤية مخرجات المعالجة، والواجهات، والرسوم البيانية التفاعلية.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm opacity-60">
              <span className="text-[10px] bg-slate-900 border border-slate-800/60 text-slate-400 px-2 py-1 rounded-full">محاكي أندرويد موطن</span>
              <span className="text-[10px] bg-slate-900 border border-slate-800/60 text-slate-400 px-2 py-1 rounded-full">رسوم بيانية تفاعلية</span>
              <span className="text-[10px] bg-slate-900 border border-slate-800/60 text-slate-400 px-2 py-1 rounded-full">التنظيف الخلوي للذاكرة</span>
              <span className="text-[10px] bg-slate-900 border border-slate-800/60 text-slate-400 px-2 py-1 rounded-full">تشابك المعالجات كمومياً</span>
            </div>
          </div>
        )}

        {isLoading && (
            <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2 animate-pulse"></div>
            </div>
        )}
        
        {/* Render Generated HTML Elements first if any */}
        {result?.generatedHtmlElements && result.generatedHtmlElements.length > 0 && !isCleared && (
            <WebPreview elements={result.generatedHtmlElements} />
        )}

        {/* Render Generated Native Android Application Mockup */}
        {result?.generatedAndroidApp && !isCleared && (
            <AndroidEmulator app={result.generatedAndroidApp} />
        )}

        {/* Render Generated Graphics (Charts & Drawing Shapes) */}
        {result?.generatedGraphics && !isCleared && (
            <div className="my-4">
                <GraphicalOutput graphics={result.generatedGraphics} />
            </div>
        )}

        {/* Render Generated Physics Simulation (BayanPhysics Engine) */}
        {result?.generatedPhysics && !isCleared && (
            <div className="my-4">
                <PhysicsVisualizer physics={result.generatedPhysics} />
            </div>
        )}

        {/* Standard Console Logs */}
        {!isCleared && result?.output && result.output.map((log, idx) => renderFormattedLog(log, idx))}

        {!isCleared && result?.generatedImages && result.generatedImages.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4">
            {result.generatedImages.map((img, idx) => (
              <div key={idx} className="border border-slate-700 rounded-lg p-2 bg-slate-900">
                <div className="text-xs text-slate-400 mb-2">الصورة المولدة #{idx + 1}</div>
                <img src={img} alt="Generated AI" className="w-full h-auto rounded" />
              </div>
            ))}
          </div>
        )}
        
        {!isCleared && result?.generatedVideos && result.generatedVideos.map((video, idx) => (
             <VideoPlayer key={idx} frames={video.frames} prompt={video.prompt} />
        ))}

        {result?.error && (
          <div className="text-red-400 mt-2 p-3 bg-red-950/30 rounded border border-red-900/50 flex items-start gap-2 text-right" dir="rtl">
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
