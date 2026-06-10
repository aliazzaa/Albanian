
import React from 'react';
import { Play, SkipForward, Square, Bug } from 'lucide-react';
import { DebugState } from '../types';

interface DebuggerProps {
  debugState: DebugState;
  onContinue: () => void;
  onStep: () => void;
  onStop: () => void;
}

const Debugger: React.FC<DebuggerProps> = ({ debugState, onContinue, onStep, onStop }) => {
  if (!debugState.isDebugging) return null;

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4 flex flex-col lg:flex-row gap-4 h-64 lg:h-48 overflow-hidden animate-slide-up">
      {/* Controls */}
      <div className="flex flex-col gap-2 min-w-[150px]">
        <div className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-1">
             <Bug size={14} className="text-orange-500" />
             أدوات التصحيح
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={onContinue}
                disabled={!debugState.isPaused}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded flex justify-center items-center gap-2 text-xs font-bold transition-colors"
                title="استمرار (Continue)"
            >
                <Play size={14} fill="currentColor" />
                استمرار
            </button>
            <button 
                onClick={onStep}
                disabled={!debugState.isPaused}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded flex justify-center items-center gap-2 text-xs font-bold transition-colors"
                title="خطوة (Step Over)"
            >
                <SkipForward size={14} />
                خطوة
            </button>
        </div>
        <button 
            onClick={onStop}
            className="w-full bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900 p-2 rounded flex justify-center items-center gap-2 text-xs font-bold transition-colors"
            title="إيقاف (Stop)"
        >
            <Square size={14} fill="currentColor" />
            إنهاء التصحيح
        </button>
        
        <div className="mt-2 text-center">
            {debugState.isPaused ? (
                <span className="text-yellow-400 text-xs animate-pulse">● متوقف عند السطر {debugState.currentLine}</span>
            ) : (
                <span className="text-emerald-400 text-xs">● جاري التشغيل...</span>
            )}
        </div>
      </div>

      {/* Variables Inspector */}
      <div className="flex-1 bg-black/30 rounded border border-slate-700 overflow-hidden flex flex-col">
          <div className="bg-slate-800 px-3 py-1.5 text-xs text-slate-400 font-bold border-b border-slate-700">
             مراقبة المتغيرات (Variables)
          </div>
          <div className="flex-1 overflow-auto p-0">
             <table className="w-full text-right text-sm">
                <thead className="bg-slate-800/50 text-slate-500 text-xs">
                    <tr>
                        <th className="p-2 font-normal">المتغير</th>
                        <th className="p-2 font-normal border-r border-slate-700">القيمة</th>
                        <th className="p-2 font-normal border-r border-slate-700">النوع</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {Object.keys(debugState.variables).length === 0 ? (
                        <tr>
                            <td colSpan={3} className="p-4 text-center text-slate-600 italic text-xs">
                                لا توجد متغيرات معرفة حالياً
                            </td>
                        </tr>
                    ) : (
                        Object.entries(debugState.variables).map(([key, val]) => (
                            <tr key={key} className="hover:bg-slate-800/30 font-mono text-xs">
                                <td className="p-2 text-purple-400">{key}</td>
                                <td className="p-2 border-r border-slate-800 text-emerald-300 break-all">
                                    {val === undefined ? 'undefined' : JSON.stringify(val)}
                                </td>
                                <td className="p-2 border-r border-slate-800 text-slate-500">
                                    {typeof val}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );
};

export default Debugger;
