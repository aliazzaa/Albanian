
import React, { useState, useEffect, useRef } from 'react';
import { Play, Code2, FileJson, Menu, Layers, FileCode, FileText, Bug, Puzzle, Globe, Square, Sparkles, Cpu, Brain } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import AICopilot from './components/AICopilot';
import Sidebar from './components/Sidebar';
import Documentation from './components/Documentation';
import Debugger from './components/Debugger';
import ProjectModal from './components/ProjectModal';
import ExtensionsModal from './components/ExtensionsModal';
import { AndroidTemplatesLibrary } from './components/AndroidTemplatesLibrary';
import { BayanToAndroidOptimizer } from './components/BayanToAndroidOptimizer';
import { BayanAIToolkit } from './components/BayanAIToolkit';
import { AlBayanCompiler } from './services/compiler';
import { runAlBayanCode, DebugController } from './services/runtime';
import { ExecutionResult, TranspilationResult, CodeMode, DebugState, FileSystemItem } from './types';
import { EXAMPLES } from './constants';

function App() {
  const [code, setCode] = useState<string>(EXAMPLES[0].code);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [transpilation, setTranspilation] = useState<TranspilationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<CodeMode>(CodeMode.EDITOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isExtModalOpen, setIsExtModalOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isAIToolkitOpen, setIsAIToolkitOpen] = useState(false);
  const [transpiledTab, setTranspiledTab] = useState<'python' | 'js' | 'java' | 'html' | 'cpp' | 'csharp' | 'go' | 'rust' | 'php'>('python');
  const [rightActiveTab, setRightActiveTab] = useState<'output' | 'ai'>('output');

  // Project Structure State
  const [projectStructure, setProjectStructure] = useState<FileSystemItem[]>([
    { 
        id: 'root-1', 
        name: 'المصدر (src)', 
        type: 'folder', 
        isOpen: true,
        children: [
            { id: 'file-1', name: 'main.byn', type: 'file', content: EXAMPLES[0].code },
            { id: 'file-2', name: 'utils.byn', type: 'file', content: '// دوال مساعدة هنا' }
        ] 
    },
    { id: 'root-2', name: 'README.txt', type: 'file', content: 'مشروع البيان الافتراضي' }
  ]);

  // Debugger State
  const [debugMode, setDebugMode] = useState(false);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const [debugState, setDebugState] = useState<DebugState>({
    isDebugging: false,
    isPaused: false,
    currentLine: null,
    variables: {}
  });
  
  // Ref to hold the controller so we can call methods on it without re-rendering issues
  const debugControllerRef = useRef<DebugController | null>(null);

  const handleToggleBreakpoint = (line: number) => {
    setBreakpoints(prev => 
      prev.includes(line) ? prev.filter(l => l !== line) : [...prev, line]
    );
  };

  const handleRun = async (withDebug: boolean = false) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setResult(null);
    setTranspilation(null);
    setMode(CodeMode.EDITOR); 
    setDebugMode(withDebug);
    
    // Reset Debug State
    setDebugState({
        isDebugging: withDebug,
        isPaused: false,
        currentLine: null,
        variables: {}
    });

    if (withDebug) {
        debugControllerRef.current = new DebugController();
    }

    try {
      // 1. Compile locally (Pass debug flag if needed)
      const compiler = new AlBayanCompiler(code);
      // We enable debug instrumentation if the user clicked "Debug"
      const transResult = compiler.compile(withDebug); 
      setTranspilation(transResult);

      // 2. Define Callbacks for Runtime
      const runtimeCallbacks = {
          onOutput: (log: string) => {
               // We can use this to stream logs if needed, but Output component handles result state
          },
          onDebugPause: async (line: number, scope: any) => {
               setDebugState(prev => ({
                   ...prev,
                   isPaused: true,
                   currentLine: line,
                   variables: scope
               }));
          }
      };

      // 3. Run locally (Browser Runtime)
      const execResult = await runAlBayanCode(
          transResult.javascript, 
          breakpoints, 
          runtimeCallbacks,
          withDebug ? debugControllerRef.current! : undefined
      );
      
      setResult(execResult);

    } catch (error: any) {
      console.error(error);
      setResult({ output: [], error: "خطأ في النظام: " + error.message });
    } finally {
      setIsProcessing(false);
      setDebugState(prev => ({ ...prev, isDebugging: false, isPaused: false, currentLine: null }));
    }
  };

  const handleStop = () => {
    setIsProcessing(false);
    setDebugMode(false);
    if (debugControllerRef.current) {
        debugControllerRef.current.resume();
    }
  };

  const handleDebugStep = () => {
    if (debugControllerRef.current) {
        setDebugState(prev => ({ ...prev, isPaused: false }));
        debugControllerRef.current.step();
    }
  };

  const handleDebugContinue = () => {
    if (debugControllerRef.current) {
        setDebugState(prev => ({ ...prev, isPaused: false }));
        debugControllerRef.current.continue();
    }
  };

  const handleDebugStop = () => {
      if (debugControllerRef.current) {
        debugControllerRef.current.resume(); // Unblock promise
      }
      setDebugState(prev => ({ ...prev, isDebugging: false }));
  };

  // Live compilation effect
  useEffect(() => {
    const timer = setTimeout(() => {
        try {
            const compiler = new AlBayanCompiler(code);
            const transResult = compiler.compile(false); // No debug info for live preview
            setTranspilation(transResult);
        } catch (e) {
            // silent fail during typing
        }
    }, 500);
    return () => clearTimeout(timer);
  }, [code]);

  const handleGenerateDocs = () => {
     const lines = code.split('\n');
     const functions = lines.filter(l => l.includes('مهمة')).map(l => l.trim().replace(':', ''));
     const classes = lines.filter(l => l.includes('صنف')).map(l => l.trim().replace(':', ''));
     
     const docOutput = [
         "--- تقرير التوثيق التلقائي ---",
         `تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}`,
         `ملف: main.byn`,
         "",
         "📌 ملخص الهيكلية:",
         `• عدد الأسطر: ${lines.length}`,
         `• عدد الأصناف (Classes): ${classes.length}`,
         `• عدد الدوال (Functions): ${functions.length}`,
         "",
         "📂 التفاصيل:",
     ];
     if (classes.length > 0) {
         docOutput.push("الأصناف المعرفة:");
         classes.forEach(c => docOutput.push(`  - ${c}`));
     }
     if (functions.length > 0) {
         docOutput.push("الدوال المعرفة:");
         functions.forEach(f => docOutput.push(`  - ${f}`));
     }
     docOutput.push("");
     docOutput.push("✅ حالة الكود: جاهز للتنفيذ");

     setResult({ output: docOutput });
     setMode(CodeMode.EDITOR); 
  };

  const handleDownloadExtension = () => {
      const packageJson = { name: "albayan", version: "1.0.0" };
      setResult({ output: ["Extension Manifest Generated.", JSON.stringify(packageJson)] });
  };

  const handleDownloadCode = () => {
      if (!transpilation) return;
      let content = "";
      let filename = "";
      
      switch(transpiledTab) {
          case 'python': content = transpilation.python; filename = "app.py"; break;
          case 'java': content = transpilation.java; filename = "Main.java"; break;
          case 'html': content = transpilation.html; filename = "index.html"; break;
          case 'cpp': content = transpilation.cpp || ''; filename = "main.cpp"; break;
          case 'csharp': content = transpilation.csharp || ''; filename = "Program.cs"; break;
          case 'go': content = transpilation.go || ''; filename = "main.go"; break;
          case 'rust': content = transpilation.rust || ''; filename = "main.rs"; break;
          case 'php': content = transpilation.php || ''; filename = "index.php"; break;
          case 'kotlin': content = transpilation.kotlin || ''; filename = "MainActivity.kt"; break;
          case 'js': default: content = transpilation.javascript; filename = "script.js"; break;
      }
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
  };

  const handleLoadFileFromProject = (content: string) => {
      setCode(content);
      setMode(CodeMode.EDITOR);
  };

  const handlePrintPDF = () => {
     window.print();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex overflow-hidden">
      
      <Documentation 
        isOpen={isDocsOpen} 
        onClose={() => setIsDocsOpen(false)}
        onPrintPDF={handlePrintPDF} 
      />
      
      <ProjectModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectStructure={projectStructure}
        setProjectStructure={setProjectStructure}
        onLoadFile={handleLoadFileFromProject}
      />

      <ExtensionsModal
        isOpen={isExtModalOpen}
        onClose={() => setIsExtModalOpen(false)}
      />

      <BayanToAndroidOptimizer
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
        code={code}
        onUpdateCode={setCode}
      />

      <BayanAIToolkit
        isOpen={isAIToolkitOpen}
        onClose={() => setIsAIToolkitOpen(false)}
        code={code}
        onUpdateCode={setCode}
        onInstantRun={(newCode) => {
          setCode(newCode);
          setRightActiveTab('output');
          setTimeout(() => {
            handleRun(false);
          }, 100);
        }}
      />

      <AndroidTemplatesLibrary 
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onLoadTemplate={setCode}
        onInstantRun={(newCode) => {
          setCode(newCode);
          setRightActiveTab('output');
          setTimeout(() => {
            handleRun(false);
          }, 100);
        }}
      />

      <Sidebar 
        onLoadExample={setCode} 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(false)} 
        onOpenDocs={() => setIsDocsOpen(true)}
        onDownloadExtension={handleDownloadExtension}
        onOpenProjectManager={() => setIsProjectModalOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
             <button 
              className="lg:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="font-bold text-lg">Al-Bayan Studio | استوديو البيان</h2>
              <div className="flex gap-2">
                <span className="text-[10px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-900">.byn</span>
                <span className="text-[10px] text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-900">Auto-Docs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={() => setMode(CodeMode.EDITOR)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === CodeMode.EDITOR 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 size={18} />
              <span className="hidden sm:inline">المحرر</span>
            </button>
            
            <button
              onClick={() => setMode(CodeMode.TRANSPILED)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === CodeMode.TRANSPILED 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe size={18} />
              <span className="hidden sm:inline">الترجمات والأكواد</span>
            </button>

            <button
              onClick={handleGenerateDocs}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="توثيق الكود تلقائياً"
            >
              <FileText size={18} />
              <span className="hidden sm:inline">توثيق</span>
            </button>

            <button
              onClick={() => setIsExtModalOpen(!isExtModalOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isExtModalOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="الإضافات"
            >
              <Puzzle size={18} />
              <span className="hidden sm:inline">الإضافات</span>
            </button>

            <button
              onClick={() => setIsAIToolkitOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-300 transition-all shadow-md active:scale-95"
              title="بوابة توطين وأدوات الذكاء الاصطناعي بلغة البيان"
            >
              <Brain size={18} className="animate-pulse" />
              <span>توطين الذكاء 🧠</span>
            </button>

            <button
              onClick={() => setIsOptimizerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 hover:border-amber-500/40 hover:text-amber-300 transition-all shadow-md active:scale-95"
              title="معزز الأكواد للأندرويد"
            >
              <Cpu size={18} className="animate-pulse" />
              <span>معزز الأداء ⚡</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden bg-[#0f172a]">
          
          {/* Left Panel (Editor / Transpiled) */}
          <div className="flex-1 h-1/2 lg:h-full flex flex-col min-h-0 gap-4">
            <div className="flex-1 flex flex-col min-h-0">
                {mode === CodeMode.EDITOR ? (
                <CodeEditor 
                    code={code} 
                    onChange={setCode} 
                    disabled={isProcessing && !debugMode} 
                    breakpoints={breakpoints}
                    onToggleBreakpoint={handleToggleBreakpoint}
                    activeLine={debugState.currentLine}
                />
                ) : (
                <div className="w-full h-full bg-[#1e293b] rounded-lg border border-slate-700 overflow-hidden flex flex-col shadow-inner">
                    <div className="flex bg-slate-800 border-b border-slate-700 overflow-x-auto shrink-0 justify-between items-center pr-2">
                        <div className="flex custom-scrollbar overflow-x-auto">
                            {['python', 'js', 'java', 'html', 'cpp', 'csharp', 'go', 'rust', 'php', 'kotlin'].map(lang => (
                                <button 
                                key={lang}
                                onClick={() => setTranspiledTab(lang as any)}
                                className={`px-4 py-3 text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${transpiledTab === lang ? 'border-yellow-400 text-white bg-slate-700/50' : 'border-transparent text-slate-400 hover:bg-slate-700/30'}`}
                            >
                                {lang === 'python' && <FileJson size={14} />}
                                {lang === 'js' && <FileCode size={14} />}
                                {lang === 'html' && <Globe size={14} />}
                                {lang === 'kotlin' && <FileCode size={14} />}
                                {['java', 'cpp', 'csharp', 'go', 'rust', 'php'].includes(lang) && <Layers size={14} />}
                                {lang.toUpperCase()}
                            </button>
                            ))}
                        </div>
                        {transpilation && (
                            <div className="flex items-center gap-2 shrink-0">
                                <button 
                                    onClick={handleDownloadCode}
                                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded flex items-center gap-1 transition-colors ml-2"
                                >
                                    <FileCode size={12} />
                                    تحميل
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-auto bg-black/30 p-4 custom-scrollbar">
                        <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed" dir="ltr">
                            {transpiledTab === 'python' && (transpilation?.python || "# الانتظار...")}
                            {transpiledTab === 'js' && (transpilation?.javascript || "// الانتظار...")}
                            {transpiledTab === 'java' && (transpilation?.java || "// الانتظار...")}
                            {transpiledTab === 'html' && (transpilation?.html || "<!-- الانتظار... -->")}
                            {transpiledTab === 'cpp' && (transpilation?.cpp || "// الانتظار...")}
                            {transpiledTab === 'csharp' && (transpilation?.csharp || "// الانتظار...")}
                            {transpiledTab === 'go' && (transpilation?.go || "// الانتظار...")}
                            {transpiledTab === 'rust' && (transpilation?.rust || "// الانتظار...")}
                            {transpiledTab === 'php' && (transpilation?.php || "// الانتظار...")}
                            {transpiledTab === 'kotlin' && (transpilation?.kotlin || "// الانتظار...")}
                        </pre>
                    </div>
                </div>
                )}
            </div>
            
            {/* Debugger Panel (Only visible when debugging) */}
            {debugState.isDebugging && (
                <Debugger 
                    debugState={debugState} 
                    onContinue={handleDebugContinue} 
                    onStep={handleDebugStep}
                    onStop={handleDebugStop}
                />
            )}
          </div>

          {/* Center Control Bar */}
          <div className="flex lg:flex-col justify-center items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800 shrink-0 z-20 shadow-xl lg:h-full">
               
               {/* Main Run Button */}
               <button
                  onClick={() => handleRun(false)}
                  disabled={isProcessing && !debugMode}
                  className={`relative group flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                    isProcessing && !debugMode
                      ? 'bg-slate-700 cursor-wait text-slate-400' 
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-110 active:scale-95'
                  }`}
                  title="تشغيل البرنامج (Run)"
                >
                   {isProcessing && !debugMode ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                      <Play size={28} fill="currentColor" className="ml-1" />
                   )}
                   
                   {/* Tooltip */}
                   <span className="absolute right-full mr-3 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden lg:block">
                      تشغيل
                   </span>
               </button>

               {/* Debug Button */}
               <button
                  onClick={() => handleRun(true)}
                  disabled={isProcessing}
                  className={`relative group flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                    debugMode
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 animate-pulse'
                      : 'bg-slate-800 text-orange-400 hover:bg-slate-700 hover:text-orange-300'
                  }`}
                  title="تصحيح الكود (Debug)"
                >
                   <Bug size={24} />
                   <span className="absolute right-full mr-3 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden lg:block">
                      تصحيح
                   </span>
               </button>

               {/* Stop Button (Conditional) */}
               {(isProcessing || debugMode) && (
                   <button 
                      onClick={handleStop}
                      className="group flex items-center justify-center p-3 rounded-xl bg-red-900/80 text-red-200 hover:bg-red-600 hover:text-white transition-all duration-300 animate-in fade-in zoom-in"
                      title="إيقاف إجباري"
                   >
                       <Square size={24} fill="currentColor" />
                   </button>
               )}
          </div>

          {/* Right Panel (Output & AI Copilot Tabs) */}
          <div className="flex-1 lg:w-[40%] h-1/2 lg:h-full min-h-0 flex flex-col gap-3">
            <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl self-start gap-1 shrink-0 select-none">
              <button
                onClick={() => setRightActiveTab('output')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  rightActiveTab === 'output' 
                    ? 'bg-gradient-to-l from-emerald-500 to-teal-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                شاشة النتائج والمعاينة
              </button>
              <button
                onClick={() => setRightActiveTab('ai')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  rightActiveTab === 'ai' 
                    ? 'bg-gradient-to-l from-purple-600 to-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Sparkles size={13} className={rightActiveTab === 'ai' ? 'animate-pulse text-yellow-300' : 'text-purple-400'} />
                رفيق البرمجة الذكي
              </button>
            </div>

            <div className="flex-1 min-h-0">
              {rightActiveTab === 'output' ? (
                <Output result={result} isLoading={isProcessing && !debugState.isDebugging} />
              ) : (
                <AICopilot
                  currentCode={code}
                  onApplyCode={(newCode) => {
                    setCode(newCode);
                    setRightActiveTab('output');
                  }}
                  onInstantRun={(newCode) => {
                    setCode(newCode);
                    setRightActiveTab('output');
                    setTimeout(() => {
                      handleRun(false); // directly run the code
                    }, 100);
                  }}
                  compilationError={result?.error}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
