import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');

  if (!isOpen) return null;

  const handlePress = (val: string) => {
    // If we have a result and user types a number, start fresh. 
    // If operator, continue with result.
    if (result && !isNaN(Number(val))) {
        setResult('');
        setDisplay(val);
        return;
    }
    if (result && isNaN(Number(val))) {
        // If operation, continue using the result as base
        setResult(''); // Clear result flag
    }
    
    setDisplay(prev => prev + val);
  };

  const handleClear = () => {
    setDisplay('');
    setResult('');
  };

  const handleDelete = () => {
    setDisplay(prev => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      // Replace visual operators with JS operators
      const expr = display.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-new-func
      const res = new Function('return ' + expr)();
      
      // limit decimals
      const final = String(Math.round(res * 100000000) / 100000000);
      
      setResult(final);
      setDisplay(final);
    } catch (e) {
      setResult('Error');
    }
  };

  const btnClass = "h-10 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 font-bold transition-colors shadow-sm active:translate-y-0.5";
  const opClass = "h-10 bg-slate-600 hover:bg-slate-500 rounded text-emerald-400 font-bold transition-colors shadow-sm active:translate-y-0.5";

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-64 overflow-hidden font-mono select-none ring-1 ring-slate-700/50">
      <div className="bg-slate-900 px-3 py-2 flex justify-between items-center border-b border-slate-700">
        <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            آلة حاسبة
        </span>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={14} /></button>
      </div>
      
      <div className="p-4 bg-slate-900/50 text-right">
        <div className="text-slate-500 text-xs h-4 mb-1 overflow-hidden">{result ? 'Result' : 'Input'}</div>
        <div className="text-2xl text-white font-bold tracking-widest overflow-x-auto scrollbar-hide whitespace-nowrap pb-1">
          {display || '0'}
        </div>
      </div>

      <div className="p-3 grid grid-cols-4 gap-2 bg-slate-800/50">
        <button onClick={handleClear} className="col-span-2 h-10 bg-red-900/30 hover:bg-red-900/50 text-red-200 rounded text-xs font-bold transition-colors border border-red-900/30">مسح</button>
        <button onClick={handleDelete} className={btnClass}><Delete size={16} className="mx-auto"/></button>
        <button onClick={() => handlePress('/')} className={opClass}>÷</button>

        <button onClick={() => handlePress('7')} className={btnClass}>7</button>
        <button onClick={() => handlePress('8')} className={btnClass}>8</button>
        <button onClick={() => handlePress('9')} className={btnClass}>9</button>
        <button onClick={() => handlePress('*')} className={opClass}>×</button>

        <button onClick={() => handlePress('4')} className={btnClass}>4</button>
        <button onClick={() => handlePress('5')} className={btnClass}>5</button>
        <button onClick={() => handlePress('6')} className={btnClass}>6</button>
        <button onClick={() => handlePress('-')} className={opClass}>-</button>

        <button onClick={() => handlePress('1')} className={btnClass}>1</button>
        <button onClick={() => handlePress('2')} className={btnClass}>2</button>
        <button onClick={() => handlePress('3')} className={btnClass}>3</button>
        <button onClick={() => handlePress('+')} className={opClass}>+</button>

        <button onClick={() => handlePress('0')} className="col-span-2 h-10 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 font-bold shadow-sm active:translate-y-0.5">0</button>
        <button onClick={() => handlePress('.')} className={btnClass}>.</button>
        <button onClick={handleCalculate} className="h-10 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-bold shadow-sm active:translate-y-0.5 border-b-2 border-emerald-800">=</button>
      </div>
    </div>
  );
};

export default Calculator;