
import React, { useState, useEffect, useRef } from 'react';
import { Play, Code2, FileJson, Menu, Layers, FileCode, FileText, Bug, Puzzle, Globe, Square, Sparkles, Cpu, Brain, ChevronDown, Terminal, Wand2, AlertTriangle, AlertCircle, CheckCircle, Info, MessageSquare, Grid } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import AICopilot from './components/AICopilot';
import Sidebar from './components/Sidebar';
import Documentation from './components/Documentation';
import Debugger from './components/Debugger';
import ProjectModal from './components/ProjectModal';
import ExtensionsModal from './components/ExtensionsModal';
import { EnvironmentChecker } from './components/EnvironmentChecker';
import { BayanLibraryManager } from './components/BayanLibraryManager';
import { AuthModal } from './components/AuthModal';
import { AndroidTemplatesLibrary } from './components/AndroidTemplatesLibrary';
import { BayanToAndroidOptimizer } from './components/BayanToAndroidOptimizer';
import { BayanAIToolkit } from './components/BayanAIToolkit';
import { BayanAppGenerator } from './components/BayanAppGenerator';
import { BayanVmVisualizer } from './components/BayanVmVisualizer';
import { BayanWasmVisualizer } from './components/BayanWasmVisualizer';
import { BayanRoadmapWithArchitecture } from './components/BayanRoadmapWithArchitecture';
import { BayanInteractiveReport } from './components/BayanInteractiveReport';
import { BayanAcademy } from './components/BayanAcademy';
import { BayanCommunity } from './components/BayanCommunity';
import { AlBayanCompiler } from './services/compiler';
import { AlBayanLexer, AlBayanParser, AlBayanSemanticAnalyzer } from './services/parser';
import { AlBayanBytecodeCompiler, AlBayanVMInterpreter } from './services/vm';
import { AlBayanWasmCompiler } from './services/wasm';
import { runAlBayanCode, DebugController } from './services/runtime';
import { ExecutionResult, TranspilationResult, CodeMode, DebugState, FileSystemItem, Diagnostic } from './types';
import { EXAMPLES } from './constants';

function App() {
  const [code, setCode] = useState<string>(EXAMPLES[0].code);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [transpilation, setTranspilation] = useState<TranspilationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<CodeMode>(CodeMode.EDITOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; tier: string } | null>(null);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isExtModalOpen, setIsExtModalOpen] = useState(false);
  const [isEnvCheckerOpen, setIsEnvCheckerOpen] = useState(false);
  const [isLibraryManagerOpen, setIsLibraryManagerOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isAIToolkitOpen, setIsAIToolkitOpen] = useState(false);
  const [isAppGeneratorOpen, setIsAppGeneratorOpen] = useState(false);
  const [transpiledTab, setTranspiledTab] = useState<'python' | 'js' | 'java' | 'html' | 'cpp' | 'csharp' | 'go' | 'rust' | 'php' | 'kotlin' | 'swift' | 'ast' | 'vm' | 'wasm' | 'roadmap' | 'report'>('python');
  const [rightActiveTab, setRightActiveTab] = useState<'output' | 'ai'>('output');
  
  // Mobile UI Responsive States
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'transpiled' | 'output' | 'ai'>('editor');
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

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
    
    // Switch to output tab automatically to view simulation
    setRightActiveTab('output');
    setActiveMobileTab('output');
    
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

  // Load existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('bayan_platform_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error loading user in main App:", e);
      }
    }
  }, []);

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
          case 'ast': {
              try {
                  const lexer = new AlBayanLexer(code);
                  const tokens = lexer.tokenize();
                  const parser = new AlBayanParser(tokens);
                  content = JSON.stringify(parser.parse(), null, 2);
              } catch(e: any) {
                  content = e.message || "Error generating AST";
              }
              filename = "ast.json";
              break;
          }
          case 'vm': {
              try {
                  const lexer = new AlBayanLexer(code);
                  const tokens = lexer.tokenize();
                  const parser = new AlBayanParser(tokens);
                  const ast = parser.parse();
                  const compiler = new AlBayanBytecodeCompiler();
                  content = JSON.stringify(compiler.compile(ast), null, 2);
              } catch(e: any) {
                  content = e.message || "Error generating Bytecode";
              }
              filename = "bytecode.json";
              break;
          }
          case 'wasm': {
              try {
                  const lexer = new AlBayanLexer(code);
                  const tokens = lexer.tokenize();
                  const parser = new AlBayanParser(tokens);
                  const ast = parser.parse();
                  const compiler = new AlBayanWasmCompiler();
                  content = compiler.compile(ast);
              } catch(e: any) {
                  content = e.message || "Error generating WebAssembly";
              }
              filename = "bayan.wat";
              break;
          }
          case 'roadmap': {
              content = "خارطة طريق تطوير لغة البيان الهيكلية كبديل ريادي كامل للترجمة الحرفية";
              filename = "roadmap.txt";
              break;
          }
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

  const handleApplyDiagnosticFix = (lineNum: number, fixText: string, diagnosticMessage: string) => {
      const lines = code.split('\n');
      if (lines[lineNum - 1] === undefined) return;
      
      const originalLine = lines[lineNum - 1];
      
      if (diagnosticMessage.includes('الكلمة') || diagnosticMessage.includes('ددت كتابة')) {
          const match = diagnosticMessage.match(/'([^']+)'/);
          const wrongWord = match ? match[1] : '';
          
          if (wrongWord && originalLine.includes(wrongWord)) {
              lines[lineNum - 1] = originalLine.replace(wrongWord, fixText);
          } else {
              lines[lineNum - 1] = fixText;
          }
      } else if (diagnosticMessage.includes('إسناد مباشر')) {
          lines[lineNum - 1] = originalLine.replace(/^(\s*)/, `$1عرف `);
      } else {
          lines[lineNum - 1] = fixText;
      }
      
      setCode(lines.join('\n'));
  };

  const handleLoadFileFromProject = (content: string) => {
      setCode(content);
      setMode(CodeMode.EDITOR);
  };

  const handleSaveGeneratedApp = (appName: string, generatedCode: string) => {
    const fileName = `${appName.trim() || 'تطبيق_مولد'}.byn`;
    
    setProjectStructure(prev => {
      const folderName = 'التطبيقات المولدة';
      let folderIndex = prev.findIndex(item => item.type === 'folder' && item.name === folderName);
      
      let updated = [...prev];
      let targetFolder: FileSystemItem;
      
      if (folderIndex === -1) {
        // Create the folder if it doesn't exist
        targetFolder = {
          id: `gen-folder-${Date.now()}`,
          name: folderName,
          type: 'folder',
          isOpen: true,
          children: []
        };
        updated.push(targetFolder);
        folderIndex = updated.length - 1;
      } else {
        // Create a copy of the folder to modify it safely
        targetFolder = { 
          ...updated[folderIndex], 
          children: [...(updated[folderIndex].children || [])],
          isOpen: true 
        };
        updated[folderIndex] = targetFolder;
      }
      
      // Check if the file already exists in that folder to avoid duplicates (overwrite or rename)
      const existingFileIndex = targetFolder.children!.findIndex(f => f.name === fileName);
      const newFile: FileSystemItem = {
        id: `gen-file-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: fileName,
        type: 'file',
        content: generatedCode
      };
      
      if (existingFileIndex !== -1) {
        // Overwrite existing file
        targetFolder.children![existingFileIndex] = newFile;
      } else {
        // Append new file
        targetFolder.children!.push(newFile);
      }
      
      return updated;
    });
  };

  const isAnyModalOpen = isDocsOpen || isAcademyOpen || isCommunityOpen || isProjectModalOpen || isExtModalOpen || isEnvCheckerOpen || isLibraryManagerOpen || isTemplatesOpen || isOptimizerOpen || isAIToolkitOpen || isAppGeneratorOpen || isAuthOpen || isSidebarOpen;

  const handlePrintPDF = () => {
     window.print();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex overflow-hidden">
      
      <Sidebar 
        onLoadExample={setCode} 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(false)} 
        onOpenDocs={() => setIsDocsOpen(true)}
        onDownloadExtension={handleDownloadExtension}
        onOpenProjectManager={() => setIsProjectModalOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenAcademy={() => setIsAcademyOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCommunity={() => setIsCommunityOpen(true)}
        onOpenEnvChecker={() => setIsEnvCheckerOpen(true)}
        onOpenLibraryManager={() => setIsLibraryManagerOpen(true)}
        currentUser={user}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 bg-slate-900/50 backdrop-blur-sm z-40 shrink-0">
          <div className="flex items-center gap-3">
             <button 
              className="lg:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
              id="sidebar-toggle-btn"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-blue-400">استوديو البيان</h2>
              <div className="flex gap-1.5 mt-0.5">
                <span className="text-[9px] text-emerald-400 bg-emerald-900/30 px-1.5 py-0.2 rounded border border-emerald-900 font-mono">.byn</span>
                <span className="hidden xs:inline-block text-[9px] text-blue-400 bg-blue-900/30 px-1.5 py-0.2 rounded border border-blue-900">Auto-Docs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
             {/* Desktop Navigation Switchers */}
             <button
              onClick={() => setMode(CodeMode.EDITOR)}
              className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === CodeMode.EDITOR 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
              id="desktop-editor-tab"
            >
              <Code2 size={18} />
              <span>المحرر</span>
            </button>
            
            <button
              onClick={() => setMode(CodeMode.TRANSPILED)}
              className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === CodeMode.TRANSPILED 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
              id="desktop-transpiled-tab"
            >
              <Globe size={18} />
              <span>الترجمات والأكواد</span>
            </button>

            <button
              onClick={handleGenerateDocs}
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="توثيق الكود تلقائياً"
              id="desktop-docs-btn"
            >
              <FileText size={18} />
              <span>توثيق</span>
            </button>

            <button
              onClick={() => setIsExtModalOpen(!isExtModalOpen)}
              className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isExtModalOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="الإضافات"
              id="desktop-extensions-btn"
            >
              <Puzzle size={18} />
              <span>الإضافات</span>
            </button>

            <button
              onClick={() => setIsAIToolkitOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-300 transition-all shadow-md active:scale-95"
              title="بوابة توطين وأدوات الذكاء الاصطناعي بلغة البيان"
              id="desktop-ai-toolkit-btn"
            >
              <Brain size={18} className="animate-pulse" />
              <span>توطين الذكاء 🧠</span>
            </button>

            <button
              onClick={() => setIsAppGeneratorOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 hover:bg-sky-500/20 hover:border-sky-500/40 hover:text-sky-300 transition-all shadow-md active:scale-95"
              title="مولد وتطوير تطبيقات ومواقع أندرويد بالبيان"
              id="desktop-app-generator-btn"
            >
              <Wand2 size={18} className="animate-pulse text-sky-400" />
              <span>مولد التطبيقات 🚀</span>
            </button>

            <button
              onClick={() => setIsOptimizerOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 hover:border-amber-500/40 hover:text-amber-300 transition-all shadow-md active:scale-95"
              title="معزز الأكواد للأندرويد"
              id="desktop-performance-btn"
            >
              <Cpu size={18} className="animate-pulse" />
              <span>معزز الأداء ⚡</span>
            </button>

            {/* Subscription Button in Header */}
            {user ? (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-95 transition-all shadow-md shrink-0"
                title="الملف الشخصي والعضوية السيادية"
                id="header-profile-btn"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-[10px] shrink-0">
                  {user.name[0]?.toUpperCase()}
                </div>
                <span>{user.name} 🏅</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white via-purple-100 to-purple-300 bg-purple-500/10 border border-purple-500/35 hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5 active:scale-95 transition-all shadow-md shrink-0"
                title="اشترك في المنصة للحصول على المزايا الكاملة"
                id="header-subscribe-btn"
              >
                <Sparkles size={13} className="text-purple-400 animate-pulse" />
                <span>الاشتراك بالمنصة 🌟</span>
              </button>
            )}

            {/* Premium Header Run & Debug Button Group (Always Visible on all sizes!) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  handleRun(false);
                  setRightActiveTab('output');
                  setActiveMobileTab('output');
                }}
                disabled={isProcessing && !debugMode}
                className={`relative group flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isProcessing && !debugMode
                    ? 'bg-slate-700 text-slate-400 cursor-wait'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/45 hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/20'
                }`}
                title="تشغيل المترجم والمعاينة فورياً (Run)"
                id="header-global-run-btn"
              >
                {isProcessing && !debugMode ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
                <span>تشغيل الكود 💻</span>
              </button>

              <button
                onClick={() => {
                  handleRun(true);
                  setRightActiveTab('output');
                  setActiveMobileTab('output');
                }}
                disabled={isProcessing}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  debugMode
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/25 hover:bg-orange-500/20 hover:text-orange-300 active:scale-95'
                }`}
                title="تصحيح الكود خطوة بخطوة (Debug)"
                id="header-global-debug-btn"
              >
                <Bug size={14} />
                <span>تصحيح</span>
              </button>
            </div>

            {/* Mobile Actions Dropdown menu */}
            <div className="relative lg:hidden z-40">
              <button
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 active:scale-95 transition-all shadow-sm"
                id="mobile-tools-dropdown-btn"
              >
                <span>أدوات البيان ⚙️</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180': ''}`} />
              </button>

              {isToolsMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsToolsMenuOpen(false)} />
                  <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => {
                        setIsAuthOpen(true);
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-purple-400 hover:bg-purple-500/10 transition-colors text-right font-extrabold border-b border-slate-800 pb-2"
                      id="mobile-tool-subscription"
                    >
                      <span>{user ? `الملف: ${user.name} 🏅` : "الاشتراك بالمنصة 🌟"}</span>
                      <Sparkles size={15} className="text-purple-400 animate-pulse" />
                    </button>

                    <button
                      onClick={() => {
                        setIsCommunityOpen(true);
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-purple-300 hover:bg-purple-500/10 transition-colors text-right font-bold border-b border-slate-800 pb-2"
                      id="mobile-tool-community"
                    >
                      <span>مجتمع المشتركين 💬</span>
                      <MessageSquare size={14} className="text-purple-400" />
                    </button>

                    <button
                      onClick={() => {
                        handleGenerateDocs();
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-right"
                      id="mobile-tool-docs"
                    >
                      <span className="font-semibold">التوثيق التلقائي للملف</span>
                      <FileText size={15} className="text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setIsExtModalOpen(true);
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-right"
                      id="mobile-tool-extensions"
                    >
                      <span className="font-semibold">إضافات المتصفح والمحرر</span>
                      <Puzzle size={15} className="text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setIsAppGeneratorOpen(true);
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-sky-400 hover:bg-sky-500/10 transition-colors text-right font-bold"
                      id="mobile-tool-generator"
                    >
                      <span>مولد التطبيقات والمواقع 🚀</span>
                      <Wand2 size={15} className="text-sky-400 animate-pulse" />
                    </button>

                    <button
                      onClick={() => {
                        setIsAIToolkitOpen(true);
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors text-right font-bold"
                      id="mobile-tool-ai"
                    >
                      <span>توطين وأدوات الذكاء</span>
                      <Brain size={15} className="text-emerald-400 animate-pulse" />
                    </button>

                    <button
                      onClick={() => {
                        setIsOptimizerOpen(true);
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-amber-400 hover:bg-amber-500/10 transition-colors text-right font-bold"
                      id="mobile-tool-performance"
                    >
                      <span>معزز الأداء وتقليل الوزن</span>
                      <Cpu size={15} className="text-amber-400" />
                    </button>

                    <button
                      onClick={() => {
                        setIsEnvCheckerOpen(true);
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors text-right font-bold border-t border-slate-800/80 pt-2"
                      id="mobile-tool-env-checker"
                    >
                      <span>فحص بيئة التشغيل 🛠️</span>
                      <Terminal size={15} className="text-emerald-400 animate-pulse" />
                    </button>

                    <button
                      onClick={() => {
                        setIsLibraryManagerOpen(true);
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-blue-400 hover:bg-blue-500/10 transition-colors text-right font-bold border-t border-slate-800/80 pt-2"
                      id="mobile-tool-library-manager"
                    >
                      <span>مستودع المكتبات 📦</span>
                      <Grid size={15} className="text-blue-400 animate-pulse" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden bg-[#0f172a]">
          
          {/* Left Panel (Editor / Transpiled) */}
          <div className={`flex-1 flex flex-col min-h-0 gap-4 h-full ${
            ['output', 'ai'].includes(activeMobileTab) ? 'hidden lg:flex' : 'flex'
          }`}>
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
                            {['python', 'js', 'java', 'html', 'cpp', 'csharp', 'go', 'rust', 'php', 'kotlin', 'swift', 'ast', 'vm', 'wasm', 'roadmap', 'report'].map(lang => (
                                <button 
                                key={lang}
                                onClick={() => setTranspiledTab(lang as any)}
                                className={`px-4 py-3 text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${transpiledTab === lang ? 'border-yellow-400 text-white bg-slate-700/50' : 'border-transparent text-slate-400 hover:bg-slate-700/30'}`}
                            >
                                {lang === 'python' && <FileJson size={14} />}
                                {lang === 'js' && <FileCode size={14} />}
                                {lang === 'html' && <Globe size={14} />}
                                {lang === 'kotlin' && <FileCode size={14} />}
                                {lang === 'swift' && <FileCode size={14} className="text-orange-400" />}
                                {['java', 'cpp', 'csharp', 'go', 'rust', 'php'].includes(lang) && <Layers size={14} />}
                                {lang === 'ast' && <Cpu size={14} className="text-emerald-400" />}
                                {lang === 'vm' && <Terminal size={14} className="text-cyan-405 animate-spin" style={{ animationDuration: '6s' }} />}
                                {lang === 'wasm' && <Sparkles size={14} className="text-emerald-300" />}
                                {lang === 'roadmap' && <Wand2 size={14} className="text-amber-400" />}
                                {lang === 'report' && <FileText size={14} className="text-yellow-400" />}
                                {lang === 'ast' ? 'شجرة الإعراب AST' : lang === 'vm' ? 'الآلة الافتراضية للبيان ⚡' : lang === 'wasm' ? 'مترجم الويب WebAssembly 🚀' : lang === 'roadmap' ? 'خارطة التطور المتقدمة 🗺️' : lang === 'report' ? 'التقرير الشامل 🎓' : lang === 'swift' ? 'SWIFT (iOS) 🍎' : lang.toUpperCase()}
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
                        {!['ast', 'vm', 'wasm', 'roadmap', 'report'].includes(transpiledTab) ? (
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
                                {transpiledTab === 'swift' && (transpilation?.swift || "// الانتظار...")}
                            </pre>
                        ) : transpiledTab === 'vm' ? (
                            <BayanVmVisualizer code={code} />
                        ) : transpiledTab === 'wasm' ? (
                            <BayanWasmVisualizer code={code} />
                        ) : transpiledTab === 'report' ? (
                            <BayanInteractiveReport />
                        ) : transpiledTab === 'ast' ? (() => {
                            try {
                                const lexer = new AlBayanLexer(code);
                                const tokens = lexer.tokenize();
                                const parser = new AlBayanParser(tokens);
                                const ast = parser.parse();
                                
                                const analyzer = new AlBayanSemanticAnalyzer();
                                const diagnostics = analyzer.analyze(ast);

                                const errors = diagnostics.filter(d => d.severity === 'error');
                                const warnings = diagnostics.filter(d => d.severity === 'warning');
                                const infos = diagnostics.filter(d => d.severity === 'info');

                                return (
                                    <div className="flex flex-col gap-6 text-slate-200 h-full animate-fade-in" dir="rtl">
                                        {/* Dynamic Diagnostics Hub */}
                                        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-3 shadow-md">
                                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center border-b border-slate-800 pb-3 justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Brain className="text-yellow-400 w-5 h-5 shrink-0 animate-pulse" />
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-100">فاحص السلامة الدلالي والتشخيص الذكي (Semantic & Style Diagnostics Scan)</h4>
                                                        <p className="text-[10px] text-slate-400">تحليل معجمي لغوي نشط يفحص توافق المتغيرات، التدفقات، الأخطاء الإملائية، والعمليات الاستباقية لتسهيل التطوير العربي.</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 text-[10px]">
                                                    <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full border border-red-500/20 font-bold">{errors.length} أخطاء نقض</span>
                                                    <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20 font-bold">{warnings.length} تحذيرات</span>
                                                    <span className="bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-500/20 font-bold">{infos.length} ملاحظات إرشاد</span>
                                                </div>
                                            </div>

                                            {/* Report Result Status */}
                                            {diagnostics.length === 0 ? (
                                                <div className="flex gap-3 items-center bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl text-emerald-300">
                                                    <CheckCircle className="text-emerald-400 w-8 h-8 shrink-0" />
                                                    <div className="text-right">
                                                        <h5 className="text-xs font-bold text-emerald-200">التقرير: كود نظيف وخالٍ تماماً من المزالق (Clean Compile!)</h5>
                                                        <p className="text-[10px] text-emerald-400/80 mt-0.5 leading-relaxed">لم يرصد المحلل الدلالي أي متغيرات غير معرّفة، عمليات قسمة على الصفر، أو تكرارات غير فعّالة في ملفك الحالي. الكود ممتثل لأمان الحوسبة الهيكلية.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2.5 max-h-[220px] overflow-auto custom-scrollbar pr-1">
                                                    {diagnostics.map((diag, index) => {
                                                        const isError = diag.severity === 'error';
                                                        const isValueWarn = diag.severity === 'warning';
                                                        
                                                        return (
                                                            <div 
                                                                key={index} 
                                                                className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-3 rounded-lg border text-right transition-all ${
                                                                    isError 
                                                                        ? 'bg-red-950/10 border-red-900/40 hover:bg-red-950/25' 
                                                                        : isValueWarn 
                                                                            ? 'bg-amber-950/10 border-amber-900/40 hover:bg-amber-950/25' 
                                                                            : 'bg-cyan-950/10 border-cyan-900/40 hover:bg-cyan-950/25'
                                                                }`}
                                                            >
                                                                <div className="flex gap-2.5 items-start">
                                                                    <div className="mt-0.5 shrink-0">
                                                                        {isError ? (
                                                                            <AlertCircle className="text-red-400 w-4 h-4" />
                                                                        ) : isValueWarn ? (
                                                                            <AlertTriangle className="text-amber-400 w-4 h-4" />
                                                                        ) : (
                                                                            <Info className="text-cyan-400 w-4 h-4" />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex flex-wrap gap-2 items-center">
                                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                                                                isError 
                                                                                    ? 'bg-red-950 text-red-400 border border-red-900/40' 
                                                                                    : isValueWarn 
                                                                                        ? 'bg-amber-950 text-amber-400 border border-amber-900/40' 
                                                                                        : 'bg-cyan-950 text-cyan-400 border border-cyan-900/40'
                                                                            }`}>
                                                                                السطر {diag.line}
                                                                            </span>
                                                                            <span className="text-[11px] text-slate-300 leading-normal font-sans font-medium">
                                                                                {diag.message}
                                                                            </span>
                                                                        </div>
                                                                        {diag.fixSuggestion && (
                                                                            <p className="text-[10px] text-slate-400 mt-1 mr-6">
                                                                                💡 مقترح السلامة: {diag.fixSuggestion.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {diag.fixSuggestion && (
                                                                    <button
                                                                        onClick={() => handleApplyDiagnosticFix(diag.line, diag.fixSuggestion!.text, diag.message)}
                                                                        className="text-[10px] bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-all shadow"
                                                                    >
                                                                        <Sparkles size={11} className="shrink-0 animate-bounce" />
                                                                        تطبيق الإصلاح التلقائي 🩹
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {/* Tokens Side */}
                                            <div className="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                                <h5 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 mb-1 flex justify-between">
                                                    <span>الرموز المعجمية الناتجة (Lexer Tokens)</span>
                                                    <span className="text-[10px] bg-slate-800 px-2 rounded font-mono text-slate-300">{tokens.length} رمزاً</span>
                                                </h5>
                                                <div className="flex-1 overflow-auto max-h-[220px] space-y-1.5 custom-scrollbar pr-1" dir="ltr">
                                                    {tokens.map((t, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-slate-950 px-2.5 py-1.5 rounded border border-slate-900 text-xs font-mono">
                                                            <span className="text-slate-500 font-semibold">س {t.line}</span>
                                                            <span className="text-yellow-400 font-bold">"{t.value || '\\n'}"</span>
                                                            <span className="text-emerald-400 text-[9px] bg-emerald-950 px-1.5 py-0.5 rounded uppercase font-bold">{t.type}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* AST Side */}
                                            <div className="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                                <h5 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 mb-1">
                                                    شجرة الإعراب المجردة الناتجة (Abstract Syntax Tree - AST JSON)
                                                </h5>
                                                <div className="flex-1 overflow-auto max-h-[220px] custom-scrollbar" dir="ltr">
                                                    <pre className="text-[11px] text-emerald-300 font-mono bg-slate-950/80 p-3 rounded border border-slate-900 whitespace-pre overflow-x-auto select-all">
                                                        {JSON.stringify(ast, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } catch (e: any) {
                                return (
                                    <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-right animate-shake" dir="rtl">
                                        <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
                                            <AlertCircle className="text-red-400 w-5 h-5 shrink-0" />
                                            خطأ في التحليل اللغوي والهيكلي للغة البيان:
                                        </h4>
                                        <pre className="mt-2 text-xs bg-slate-950 p-3 rounded text-red-300 font-mono" dir="ltr">
                                            {e.message || e.toString()}
                                        </pre>
                                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">يرجى فحص كود البيان المدخل في المحرر النمطي. يلتزم المفسر الهيكلي الصارم بالقواعد النحوية المكتوبة بشكل صحيح دون أي تجاوزات.</p>
                                    </div>
                                );
                            }
                        })() : (
                            <BayanRoadmapWithArchitecture code={code} />
                        )}
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

          {/* Center Control Bar (Desktop Only) */}
          <div className="hidden lg:flex lg:flex-col justify-center items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800 shrink-0 z-20 shadow-xl lg:h-full">
               
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
                  id="desktop-main-run-btn"
                >
                   {isProcessing && !debugMode ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                      <Play size={28} fill="currentColor" className="ml-1" />
                   )}
                   
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
                  id="desktop-main-debug-btn"
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
                      id="desktop-main-stop-btn"
                   >
                       <Square size={24} fill="currentColor" />
                   </button>
               )}
          </div>

          {/* Right Panel (Output & AI Copilot Tabs) */}
          <div className={`flex-1 lg:w-[40%] flex flex-col gap-3 min-h-0 h-full ${
            ['editor', 'transpiled'].includes(activeMobileTab) ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Desktop Tabs Header */}
            <div className="hidden lg:flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl self-start gap-1 shrink-0 select-none">
              <button
                onClick={() => setRightActiveTab('output')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  rightActiveTab === 'output' 
                    ? 'bg-gradient-to-l from-emerald-500 to-teal-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
                id="desktop-right-output-tab"
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
                id="desktop-right-ai-tab"
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
                    setActiveMobileTab('output');
                  }}
                  onInstantRun={(newCode) => {
                    setCode(newCode);
                    setRightActiveTab('output');
                    setActiveMobileTab('output');
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

        {/* Floating Actions on Mobile (Run & Debug Overlay) */}
        {!isAnyModalOpen && activeMobileTab === 'editor' && (
          <div className="lg:hidden fixed bottom-20 left-4 z-50 flex flex-col gap-2.5 pointer-events-auto">
            {activeMobileTab === 'editor' && !isProcessing && (
              <button
                onClick={() => {
                  handleRun(true);
                  setActiveMobileTab('output');
                  setRightActiveTab('output');
                }}
                className="w-11 h-11 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-orange-400 shadow-xl active:scale-95 hover:bg-slate-800 transition-all font-bold cursor-pointer"
                title="تصحيح برمجيات البيان"
                id="mobile-floating-debug-btn"
              >
                <Bug size={18} />
              </button>
            )}

            {/* Main Play / Stop Button on Mobile */}
            <button
              onClick={() => {
                if (isProcessing || debugMode) {
                  handleStop();
                } else {
                  handleRun(false);
                  setActiveMobileTab('output');
                  setRightActiveTab('output');
                }
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-95 hover:opacity-90 transition-all cursor-pointer ${
                isProcessing || debugMode
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-900/50'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-950/40'
              }`}
              id="mobile-floating-run-btn"
            >
              {isProcessing && !debugMode ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isProcessing || debugMode ? (
                <Square size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-1" />
              )}
            </button>
          </div>
        )}

        {/* Mobile Navigation Tab Bar */}
        {!isAnyModalOpen && (
          <div className="lg:hidden h-16 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex justify-around items-center px-2 shrink-0 z-30 select-none pb-safe">
              <button
                onClick={() => {
                  setActiveMobileTab('editor');
                  setMode(CodeMode.EDITOR);
                }}
                className={`flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeMobileTab === 'editor' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
                }`}
                id="mobile-tab-editor"
              >
                <Code2 size={20} />
                <span className="text-[10px]">المحرر</span>
              </button>

              <button
                onClick={() => {
                  setActiveMobileTab('transpiled');
                  setMode(CodeMode.TRANSPILED);
                }}
                className={`flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeMobileTab === 'transpiled' ? 'text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
                }`}
                id="mobile-tab-transpiled"
              >
                <Globe size={20} />
                <span className="text-[10px]">الترجمات</span>
              </button>

              <button
                onClick={() => {
                  setActiveMobileTab('output');
                  setRightActiveTab('output');
                }}
                className={`flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all relative ${
                  activeMobileTab === 'output' ? 'text-sky-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
                }`}
                id="mobile-tab-output"
              >
                <Terminal size={20} />
                <span className="text-[10px]">المخرجات</span>
              </button>

              <button
                onClick={() => {
                  setActiveMobileTab('ai');
                  setRightActiveTab('ai');
                }}
                className={`flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeMobileTab === 'ai' ? 'text-purple-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
                }`}
                id="mobile-tab-ai"
              >
                <Sparkles size={20} className={activeMobileTab === 'ai' ? 'text-purple-400 animate-pulse' : 'text-slate-400'} />
                <span className="text-[10px]">الرفيق والذكاء</span>
              </button>
          </div>
        )}

      </main>

      {/* Full-Screen Overlay Modals (Rendered last to guarantee correct z-index on all browsers) */}
      <Documentation 
        isOpen={isDocsOpen} 
        onClose={() => setIsDocsOpen(false)}
        onPrintPDF={handlePrintPDF} 
      />

      <BayanAcademy
        isOpen={isAcademyOpen}
        onClose={() => setIsAcademyOpen(false)}
        onLoadExample={(exampleCode) => {
          setCode(exampleCode);
          setIsAcademyOpen(false);
          setMode(CodeMode.EDITOR);
        }}
        onOpenDocs={() => {
          setIsAcademyOpen(false);
          setIsDocsOpen(true);
        }}
        onOpenCommunity={() => {
          setIsAcademyOpen(false);
          setIsCommunityOpen(true);
        }}
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
          setActiveMobileTab('output');
          setTimeout(() => {
            handleRun(false);
          }, 100);
        }}
      />

      <BayanAppGenerator
        isOpen={isAppGeneratorOpen}
        onClose={() => setIsAppGeneratorOpen(false)}
        onApplyCode={setCode}
        onInstantRun={(newCode) => {
          setCode(newCode);
          setRightActiveTab('output');
          setActiveMobileTab('output');
          setTimeout(() => {
            handleRun(false);
          }, 100);
        }}
        onSaveToFiles={handleSaveGeneratedApp}
      />

      <AndroidTemplatesLibrary 
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onLoadTemplate={setCode}
        onInstantRun={(newCode) => {
          setCode(newCode);
          setRightActiveTab('output');
          setActiveMobileTab('output');
          setTimeout(() => {
            handleRun(false);
          }, 100);
        }}
      />

      <EnvironmentChecker 
        isOpen={isEnvCheckerOpen}
        onClose={() => setIsEnvCheckerOpen(false)}
      />

      <BayanLibraryManager 
        isOpen={isLibraryManagerOpen}
        onClose={() => setIsLibraryManagerOpen(false)}
        onLoadExample={setCode}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userEmailFromMetadata="aliazzaa@gmail.com"
        onAuthSuccess={(userData) => {
          setUser(userData);
        }}
      />

      <BayanCommunity
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
        currentUser={user}
        onOpenAuth={() => {
          setIsCommunityOpen(false);
          setIsAuthOpen(true);
        }}
        onOpenAcademy={() => {
          setIsCommunityOpen(false);
          setIsAcademyOpen(true);
        }}
        onOpenDocs={() => {
          setIsCommunityOpen(false);
          setIsDocsOpen(true);
        }}
      />
    </div>
  );
}

export default App;
