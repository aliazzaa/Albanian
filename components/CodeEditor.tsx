
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Play, Box, Variable, Code2, Type, FunctionSquare } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  disabled?: boolean;
  breakpoints?: number[];
  onToggleBreakpoint?: (line: number) => void;
  activeLine?: number | null;
}

// --- Constants for Syntax Highlighting & Autocomplete ---

const KEYWORDS = [
  "مهمة", "عرف", "لو", "وإلا", "لكل", "في", "المجال", "كرر", "نهاية", 
  "حاول", "التقط", "استورد", "ارجع"
];

const OOP_KEYWORDS = [
  "صنف", "بناء", "جديد", "هذا", "يرث"
];

const AI_MEDIA_COMMANDS = [
  "اسأل_الذكاء", "ترجم", "لخص", "أنشئ_صورة", "أنشئ_فيديو", "أنشئ_صوت", "اعزف"
];

const BUILT_IN_FUNCTIONS = [
  "اطبع", "اكتب_ملف", "اقرأ_ملف", "أنشئ_صفحة", "عنوان", "فقرة", "زر", "مدخل", "صورة"
];

const STD_LIBS = [
  "رياضيات", "نصوص", "قوائم", "وقت"
];

const STD_LIB_MEMBERS: Record<string, string[]> = {
  "رياضيات": ["جذر", "أس", "عشوائي", "تقريب", "ط", "سقف", "أرضية"],
  "نصوص": ["طول", "بحث", "استبدال", "تكبير", "تصغير", "جزء"],
  "قوائم": ["أضف", "احذف", "رتب", "اعكس", "طول", "نص"],
  "وقت": ["الآن", "تاريخ", "انتظر"]
};

// --- Helper Types for Suggestions ---

type SuggestionType = 'keyword' | 'function' | 'class' | 'variable' | 'module';

interface Suggestion {
  label: string;
  type: SuggestionType;
  detail?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  onChange, 
  disabled, 
  breakpoints = [], 
  onToggleBreakpoint,
  activeLine
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  
  // Autocomplete State
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [currentWordStart, setCurrentWordStart] = useState(0);

  // Sync scrolling between textarea and pre
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
     handleScroll();
  }, [code]);

  // Scroll to active line when debugger steps
  useEffect(() => {
    if (activeLine && textareaRef.current) {
      const lineHeight = 24; 
      const scrollPos = (activeLine - 1) * lineHeight;
      textareaRef.current.scrollTop = scrollPos - (textareaRef.current.clientHeight / 2);
      handleScroll();
    }
  }, [activeLine]);

  // --- Syntax Highlighter ---
  const highlightCode = (input: string) => {
    if (!input) return '';

    const escapeHtml = (unsafe: string) => {
      return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    };

    let html = '';
    let i = 0;

    while (i < input.length) {
      const char = input[i];

      // 1. Comments
      if (char === '/' && input[i + 1] === '/') {
        let comment = '';
        while (i < input.length && input[i] !== '\n') {
          comment += input[i++];
        }
        html += `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
        continue;
      }

      // 2. Strings
      if (char === '"' || char === "'") {
        const quote = char;
        let stringVal = quote;
        i++;
        while (i < input.length) {
          stringVal += input[i];
          if (input[i] === quote && input[i - 1] !== '\\') {
            i++;
            break;
          }
          i++;
        }
        html += `<span class="text-yellow-400">${escapeHtml(stringVal)}</span>`;
        continue;
      }

      // 3. Numbers
      if (/[0-9]/.test(char)) {
        let num = '';
        while (i < input.length && /[0-9.]/.test(input[i])) {
          num += input[i++];
        }
        html += `<span class="text-red-400 font-bold">${num}</span>`;
        continue;
      }

      // 4. Words
      if (/[\u0600-\u06FFa-zA-Z_]/.test(char)) {
        let word = '';
        while (i < input.length && /[\u0600-\u06FFa-zA-Z0-9_.]/.test(input[i])) {
          word += input[i++];
        }
        
        const parts = word.split('.');
        const processedParts = parts.map((part, idx) => {
           if (KEYWORDS.includes(part)) return `<span class="text-purple-400 font-bold">${part}</span>`;
           if (OOP_KEYWORDS.includes(part)) return `<span class="text-emerald-400 font-bold">${part}</span>`;
           if (AI_MEDIA_COMMANDS.includes(part)) return `<span class="text-pink-400 font-bold">${part}</span>`;
           if (BUILT_IN_FUNCTIONS.includes(part)) return `<span class="text-blue-400 font-bold">${part}</span>`;
           if (STD_LIBS.includes(part)) return `<span class="text-orange-400 font-bold">${part}</span>`;
           if (idx > 0 && STD_LIBS.includes(parts[0])) return `<span class="text-cyan-300">${part}</span>`;
           return escapeHtml(part);
        });

        html += processedParts.join('.');
        continue;
      }

      html += escapeHtml(char);
      i++;
    }

    return html;
  };

  // --- Autocomplete Logic ---

  // 1. Helper to get caret coordinates (Mirror Div Technique)
  const getCaretCoordinates = () => {
    const element = textareaRef.current;
    if (!element) return { top: 0, left: 0 };

    const { selectionStart } = element;
    
    // Create a mirror div to replicate the textarea's layout
    const div = document.createElement('div');
    const style = window.getComputedStyle(element);
    
    // Copy relevant styles
    ['fontFamily', 'fontSize', 'fontWeight', 'wordWrap', 'whiteSpace', 'borderLeftWidth', 'borderTopWidth', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'lineHeight', 'direction'].forEach(prop => {
        (div.style as any)[prop] = (style as any)[prop];
    });

    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = `${element.clientWidth}px`;
    div.style.height = 'auto';
    div.textContent = code.substring(0, selectionStart);

    // Create a span for the caret position
    const span = document.createElement('span');
    span.textContent = '.';
    div.appendChild(span);

    document.body.appendChild(div);
    
    const { offsetLeft, offsetTop } = span;
    const { scrollTop, scrollLeft } = element;
    
    document.body.removeChild(div);

    return {
        top: offsetTop - scrollTop + 24, // 24px buffer for line height
        left: offsetLeft - scrollLeft
    };
  };

  // 2. Extract user variables from code
  const getUserDefinedVariables = useMemo(() => {
     const vars = new Set<string>();
     // Match 'عرف x', 'مهمة y', 'صنف z'
     const regex = /(?:عرف|مهمة|صنف)\s+([\u0600-\u06FFa-zA-Z_][\u0600-\u06FFa-zA-Z0-9_]*)/g;
     let match;
     while ((match = regex.exec(code)) !== null) {
         if (match[1]) vars.add(match[1]);
     }
     return Array.from(vars);
  }, [code]);

  // 3. Handle Text Change & Trigger Suggestions
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);

    const selectionStart = e.target.selectionStart;
    
    // Find the word being typed
    const textBeforeCaret = val.slice(0, selectionStart);
    // Regex matches the last word segment (supporting dots for library access like رياضيات.جذر)
    const match = textBeforeCaret.match(/([\u0600-\u06FFa-zA-Z_][\u0600-\u06FFa-zA-Z0-9_.]*)$/);
    
    if (match) {
        const currentWord = match[1];
        const wordStart = selectionStart - currentWord.length;
        
        let filtered: Suggestion[] = [];
        const lowerWord = currentWord.toLowerCase();

        // Check for Dot Notation (Module access)
        if (currentWord.includes('.')) {
            const [moduleName, memberPart] = currentWord.split('.');
            if (STD_LIBS.includes(moduleName)) {
                 const members = STD_LIB_MEMBERS[moduleName] || [];
                 filtered = members
                    .filter(m => m.startsWith(memberPart))
                    .map(m => ({ label: m, type: 'function', detail: `وحدة ${moduleName}` }));
            }
        } else {
            // Standard filtering
            const addMatch = (list: string[], type: SuggestionType, detail?: string) => {
                list.forEach(item => {
                    if (item.toLowerCase().startsWith(lowerWord) && item !== currentWord) {
                        filtered.push({ label: item, type, detail });
                    }
                });
            };

            addMatch(KEYWORDS, 'keyword');
            addMatch(OOP_KEYWORDS, 'class', 'كلمة محجوزة');
            addMatch(BUILT_IN_FUNCTIONS, 'function', 'دالة داخلية');
            addMatch(AI_MEDIA_COMMANDS, 'function', 'أمر ذكاء اصطناعي');
            addMatch(STD_LIBS, 'module', 'مكتبة قياسية');
            addMatch(getUserDefinedVariables, 'variable', 'متغير مستخدم');
        }

        if (filtered.length > 0) {
            const coordinates = getCaretCoordinates();
            setCoords(coordinates);
            setSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
            setSuggestionIndex(0);
            setShowSuggestions(true);
            setCurrentWordStart(wordStart);
        } else {
            setShowSuggestions(false);
        }
    } else {
        setShowSuggestions(false);
    }
  };

  // 4. Insert Suggestion
  const insertSuggestion = (suggestion: Suggestion) => {
    if (!suggestion) return;
    
    const beforeWord = code.slice(0, currentWordStart);
    const afterCursor = code.slice(textareaRef.current!.selectionStart);
    
    // Check if we are inserting a property (after dot) or full word
    let insertion = suggestion.label;
    
    // If we were typing 'رياضيات.ج', currentWordStart points to 'ر'. 
    // We need to verify if the original text includes the module prefix.
    const textUntilCursor = code.slice(0, textareaRef.current!.selectionStart);
    const wordBeingTyped = textUntilCursor.slice(currentWordStart);
    
    if (wordBeingTyped.includes('.')) {
         // We are completing the part after dot
         const [moduleName, ] = wordBeingTyped.split('.');
         insertion = `${moduleName}.${suggestion.label}`;
    }

    const newCode = beforeWord + insertion + afterCursor;
    onChange(newCode);
    setShowSuggestions(false);
    
    // Restore focus and move cursor
    setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            const newCursorPos = currentWordStart + insertion.length;
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
    }, 0);
  };

  // 5. Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSuggestionIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            insertSuggestion(suggestions[suggestionIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    }
  };

  const getIcon = (type: SuggestionType) => {
      switch(type) {
          case 'keyword': return <Code2 size={14} className="text-purple-400" />;
          case 'class': return <Box size={14} className="text-emerald-400" />;
          case 'function': return <FunctionSquare size={14} className="text-blue-400" />;
          case 'module': return <Type size={14} className="text-orange-400" />;
          case 'variable': return <Variable size={14} className="text-slate-400" />;
      }
  };

  return (
    <div className="relative w-full h-full bg-[#1e293b] rounded-lg border border-slate-700 overflow-hidden flex flex-col shadow-inner">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 border-b border-slate-700 flex justify-between items-center select-none z-20">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="font-mono text-emerald-400 font-bold">main.byn</span>
        </span>
        <span>UTF-8 | Arabic</span>
      </div>
      
      <div className="flex-1 relative flex overflow-hidden group">
        {/* Line Numbers & Breakpoints Gutter */}
        <div className="w-12 bg-[#1e293b] text-right pr-2 pt-4 font-mono text-sm leading-6 border-l border-slate-700 select-none z-20 flex flex-col items-end">
          {code.split('\n').map((_, i) => {
            const lineNum = i + 1;
            const hasBreakpoint = breakpoints.includes(lineNum);
            const isActive = activeLine === lineNum;

            return (
              <div 
                key={i} 
                className="relative w-full pr-1 h-6 cursor-pointer hover:bg-slate-800 transition-colors flex justify-end items-center group"
                onClick={() => onToggleBreakpoint && onToggleBreakpoint(lineNum)}
              >
                 {isActive && (
                    <div className="absolute left-1 text-yellow-400 animate-pulse">
                         <Play size={10} fill="currentColor" className="rotate-180" />
                    </div>
                 )}
                 {hasBreakpoint && (
                    <div className="w-2 h-2 rounded-full bg-red-500 absolute left-3"></div>
                 )}
                 <span className={`text-xs ${isActive ? 'text-yellow-400 font-bold' : 'text-slate-600'}`}>
                    {lineNum}
                 </span>
              </div>
            );
          })}
        </div>
        
        {/* Editor Container */}
        <div className="relative flex-1 h-full">
            {/* Active Line Highlighter Layer */}
            {activeLine && (
                <div 
                    className="absolute w-full bg-yellow-500/10 border-t border-b border-yellow-500/20 pointer-events-none z-0"
                    style={{ top: `${(activeLine - 1) * 24 + 16}px`, height: '24px' }}
                />
            )}

            {/* Syntax Highlight Layer */}
            <pre
                ref={preRef}
                className="absolute inset-0 p-4 font-mono text-sm leading-6 whitespace-pre-wrap break-words pointer-events-none text-slate-100 z-0"
                style={{ fontFamily: "'Fira Code', 'Cairo', monospace" }}
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: highlightCode(code) + '<br/>' }} 
            />

            {/* Input Layer */}
            <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                onScroll={handleScroll}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-6 bg-transparent text-transparent caret-white resize-none focus:outline-none z-10"
                placeholder="اكتب كود البيان هنا..."
                spellCheck={false}
                dir="rtl"
                disabled={disabled}
                style={{ fontFamily: "'Fira Code', 'Cairo', monospace" }}
            />

            {/* Suggestion Popup */}
            {showSuggestions && (
                <div 
                    className="absolute bg-slate-800 border border-slate-600 rounded-md shadow-2xl z-50 w-56 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100"
                    style={{ 
                        top: coords.top, 
                        // For RTL, we might want to align differently, but simple absolute positioning usually works relative to parent if offsetLeft is correct
                        left: coords.left 
                    }}
                >
                    {suggestions.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => insertSuggestion(item)}
                            className={`w-full text-right px-3 py-2 text-sm font-mono flex items-center gap-3 transition-colors ${
                                idx === suggestionIndex ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {getIcon(item.type)}
                            <div className="flex flex-col items-start flex-1">
                                <span className="font-bold">{item.label}</span>
                                {item.detail && <span className="text-[10px] opacity-70 font-sans">{item.detail}</span>}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
