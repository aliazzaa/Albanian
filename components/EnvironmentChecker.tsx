import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, AlertCircle, Terminal, Copy, Check, 
  Download, RefreshCw, Cpu, Sparkles, Monitor, 
  Smartphone, Apple, Play, Info, AlertTriangle, FileCode
} from 'lucide-react';

interface EnvironmentCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OSInfo {
  name: string;
  key: 'windows' | 'android' | 'macos' | 'linux';
  icon: React.ReactNode;
}

export const EnvironmentChecker: React.FC<EnvironmentCheckerProps> = ({ isOpen, onClose }) => {
  const [selectedOS, setSelectedOS] = useState<'windows' | 'android' | 'macos' | 'linux'>('windows');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [diagnosticInput, setDiagnosticInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  // Scanned states
  const [nodeState, setNodeState] = useState<{
    status: 'idle' | 'success' | 'warning' | 'error';
    version?: string;
    message?: string;
  }>({ status: 'idle' });

  const [jdkState, setJdkState] = useState<{
    status: 'idle' | 'success' | 'warning' | 'error';
    version?: string;
    message?: string;
  }>({ status: 'idle' });

  // Auto-detect OS on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator) {
      const ua = navigator.userAgent;
      if (ua.indexOf('Win') !== -1) {
        setSelectedOS('windows');
      } else if (ua.indexOf('Android') !== -1) {
        setSelectedOS('android');
      } else if (ua.indexOf('Mac') !== -1) {
        setSelectedOS('macos');
      } else if (ua.indexOf('Linux') !== -1) {
        setSelectedOS('linux');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const osList: OSInfo[] = [
    { name: 'ويندوز (Windows)', key: 'windows', icon: <Monitor size={18} /> },
    { name: 'أندرويد (Android)', key: 'android', icon: <Smartphone size={18} /> },
    { name: 'ماك (macOS)', key: 'macos', icon: <Apple size={18} /> },
    { name: 'لينكس (Linux)', key: 'linux', icon: <Cpu size={18} /> },
  ];

  // Download links database
  const DOWNLOADS = {
    windows: {
      node: {
        title: 'Node.js v20.11.1 LTS (64-bit)',
        url: 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi',
        guide: 'حمل ملف التثبيت .msi وقم بتشغيله، ثم تأكد من تفعيل خيار "Add to PATH" أثناء التثبيت.'
      },
      jdk: {
        title: 'Oracle JDK 17 LTS (64-bit)',
        url: 'https://download.oracle.com/java/17/latest/jdk-17_windows-x64_bin.exe',
        guide: 'شغّل ملف التثبيت .exe. لتأكيد التثبيت، أضف مسار التثبيت (مثل C:\\Program Files\\Java\\jdk-17) إلى متغير البيئة JAVA_HOME.'
      }
    },
    android: {
      node: {
        title: 'Termux Terminal App (عبر F-Droid)',
        url: 'https://github.com/termux/termux-app/releases/latest/download/termux-app_universal.apk',
        guide: 'تطبيق Termux هو بيئة محاكاة لينكس للأندرويد. ننصح بتحميله من الرابط وتثبيت Node.js عبر أمر: pkg install nodejs-lts'
      },
      jdk: {
        title: 'OpenJDK 17 for Termux',
        url: '#',
        guide: 'داخل تطبيق Termux، قم بتشغيل الأمر التالي لتثبيت جافا 17 مباشرة: pkg install openjdk-17 -y'
      }
    },
    macos: {
      node: {
        title: 'Node.js v20.11.1 LTS (.pkg)',
        url: 'https://nodejs.org/dist/v20.11.1/node-v20.11.1.pkg',
        guide: 'قم بتحميل الحزمة وتثبيتها بشكل اعتيادي. أو استخدم Homebrew: brew install node'
      },
      jdk: {
        title: 'Oracle JDK 17 (Apple Silicon / Intel)',
        url: 'https://download.oracle.com/java/17/latest/jdk-17_macos-aarch64_bin.dmg', // Default silicon, can mention intel too
        guide: 'لأجهزة M1/M2/M3 حمل نسخة ARM64. لأجهزة Intel القديمة استخدم الرابط: https://download.oracle.com/java/17/latest/jdk-17_macos-x64_bin.dmg'
      }
    },
    linux: {
      node: {
        title: 'Node.js via Package Manager',
        url: 'https://nodejs.org/en/download/package-manager',
        guide: 'تثبيت عبر الطرفية (Debian/Ubuntu): curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs'
      },
      jdk: {
        title: 'OpenJDK 17 (Debian/Ubuntu)',
        url: '#',
        guide: 'قم بتشغيل الأمر التالي في الطرفية للتثبيت مباشرة: sudo apt update && sudo apt install openjdk-17-jdk -y'
      }
    }
  };

  // Commands to scan
  const SCAN_COMMANDS = {
    windows: {
      cmd: 'node -v ; java -version',
      desc: 'انسخ الأمر التالي وشغله في واجهة PowerShell أو CMD على جهازك، ثم ألصق المخرجات بالأسفل للتحليل الذكي:'
    },
    android: {
      cmd: 'echo "Node:" $(node -v 2>&1) " | Java:" $(java -version 2>&1 | head -n 1)',
      desc: 'شغل الأمر التالي داخل تطبيق Termux على هاتفك، ثم الصق المخرج هنا للتحقق:'
    },
    macos: {
      cmd: 'echo "Node: $(node -v)" && echo "Java: $(java -version 2>&1 | head -n 1)"',
      desc: 'افتح تطبيق الـ Terminal على جهاز الماك وشغّل هذا الأمر، ثم انسخ المخرج وألصقه هنا:'
    },
    linux: {
      cmd: 'echo "Node: $(node -v)" && echo "Java: $(java -version 2>&1 | head -n 1)"',
      desc: 'افتح الطرفية (Terminal) على نظام لينكس، شغل الأمر التالي، ثم ضع مخرجات الفحص بالأسفل:'
    }
  };

  const handleCopy = (text: string, type: 'script' | 'guide') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const analyzeLog = () => {
    if (!diagnosticInput.trim()) return;
    setIsScanning(true);
    
    setTimeout(() => {
      const text = diagnosticInput.toLowerCase();
      
      // Node checking
      let foundNode = false;
      let nodeVerStr = '';
      
      // Look for patterns like v18.12.0 or node: v20.x
      const nodeMatch = text.match(/(v|node[:\s]*)(\d+)\.(\d+)\.(\d+)/);
      if (nodeMatch) {
        foundNode = true;
        nodeVerStr = nodeMatch[0].replace('node:', '').trim();
        const major = parseInt(nodeMatch[2], 10);
        
        if (major >= 18) {
          setNodeState({
            status: 'success',
            version: nodeVerStr,
            message: `ممتاز! تم رصد Node.js بالإصدار ${nodeVerStr} وهو متوافق تماماً (يتطلب 18+).`
          });
        } else {
          setNodeState({
            status: 'warning',
            version: nodeVerStr,
            message: `تحذير: تم رصد إصدار قديم (${nodeVerStr}). ننصح بالتحديث إلى الإصدار 18 أو أعلى لتجنب المشاكل.`
          });
        }
      } else if (text.includes('not found') || text.includes('not recognized') || text.includes('command') || text.includes('غير مثبت') || text.includes('error')) {
        setNodeState({
          status: 'error',
          message: 'لم يتم رصد Node.js! يرجى تثبيته أولاً باستخدام رابط التحميل المباشر بالأسفل.'
        });
      } else {
        // Try simple number match if they pasted just "18" or "20"
        const simpleMatch = text.match(/\b(18|19|20|21|22)\b/);
        if (simpleMatch) {
          setNodeState({
            status: 'success',
            version: `v${simpleMatch[1]}.x`,
            message: `تم رصد إصدار Node.js تقريبي v${simpleMatch[1]}.x متوافق مع البيئة.`
          });
        } else {
          setNodeState({
            status: 'error',
            message: 'لم نتمكن من تحديد إصدار Node.js من المخرجات المنسوخة. يرجى التأكد من تشغيل الأمر بشكل صحيح.'
          });
        }
      }

      // JDK checking
      let foundJdk = false;
      let javaVerStr = '';
      
      // Look for patterns like version "17" or "17.0.2" or openjdk 17 or "21.0.1" or "1.8" (Java 8)
      const javaMatch = text.match(/(openjdk|java|version)\s*(version)?\s*"?(\d+)(\.(\d+))?(\.(\d+))?/);
      if (javaMatch) {
        foundJdk = true;
        const major = parseInt(javaMatch[3], 10);
        
        // Handle Java 8 which appears as 1.8
        if (major === 1) {
          const subVersion = parseInt(javaMatch[5], 10);
          javaVerStr = `1.${subVersion}`;
          setJdkState({
            status: 'warning',
            version: javaVerStr,
            message: 'تحذير: تم رصد إصدار Java 8 (1.8). يتطلب بناء تطبيقات البيان للأندرويد إصدار JDK 17+.'
          });
        } else {
          javaVerStr = `${major}.x`;
          if (major >= 17) {
            setJdkState({
              status: 'success',
              version: javaVerStr,
              message: `رائع! تم التحقق من وجود JDK بالإصدار ${major} متوافق تماماً لتصنيفات الأندرويد.`
            });
          } else {
            setJdkState({
              status: 'warning',
              version: javaVerStr,
              message: `تحذير: تم رصد إصدار JDK ${major}. لغة البيان تتطلب JDK 17+ لتصدير تطبيقات الأندرويد بنجاح.`
            });
          }
        }
      } else if (text.includes('java') && (text.includes('17') || text.includes('21') || text.includes('18') || text.includes('22'))) {
        // Fallback guess
        const matchedVer = text.match(/\b(17|18|19|20|21|22)\b/);
        const verNum = matchedVer ? matchedVer[1] : '17';
        setJdkState({
          status: 'success',
          version: `${verNum}.x`,
          message: `تم التحقق من تثبيت JDK بالإصدار المتوافق ${verNum}.`
        });
      } else if (text.includes('not found') || text.includes('not recognized') || text.includes('command') || text.includes('غير مثبت') || text.includes('error')) {
        setJdkState({
          status: 'error',
          message: 'لم يتم العثور على JDK! هذا مطلوب لبناء وتصدير ملفات APK للأندرويد.'
        });
      } else {
        setJdkState({
          status: 'error',
          message: 'لم نتمكن من تحديد إصدار JDK. يرجى تثبيت JDK 17 وتأكيد ضبطه بمتغيرات النظام.'
        });
      }

      setIsScanning(false);
    }, 800);
  };

  const handleReset = () => {
    setNodeState({ status: 'idle' });
    setJdkState({ status: 'idle' });
    setDiagnosticInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200" id="env-checker-modal">
      <div className="bg-[#0f172a] w-full max-w-3xl h-full sm:h-[90vh] rounded-none sm:rounded-2xl border-0 sm:border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative text-slate-100" dir="rtl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-lg border border-slate-700/50">
              <Terminal className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">فاحص ومساعد بيئة التشغيل للبيان</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">تحقق من جاهزية الحاسوب/الهاتف لتطوير وترجمة لغات الأندرويد والويب بلغة البيان</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all active:scale-95"
            id="close-env-checker-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          {/* OS Selector */}
          <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/60">
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <Info size={14} className="text-blue-400" />
              اختر نظام التشغيل الحالي (الذي تبرمج منه):
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {osList.map((os) => (
                <button
                  key={os.key}
                  onClick={() => setSelectedOS(os.key)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg text-xs font-bold transition-all border ${
                    selectedOS === os.key 
                      ? 'bg-gradient-to-l from-emerald-500/10 to-blue-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-950/20' 
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                  id={`os-tab-${os.key}`}
                >
                  {os.icon}
                  <span>{os.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Diagnostic Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Step 1: Automated Script Checker */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-emerald-900/30 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-bold">الخطوة الأولى: الفحص السريع</span>
                <h4 className="font-bold text-sm text-slate-200 mt-2">تشغيل مخرجات الفحص اللحظي</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {SCAN_COMMANDS[selectedOS].desc}
                </p>

                {/* Script Box */}
                <div className="mt-3 bg-black/40 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between font-mono text-[11px] text-slate-300 overflow-hidden">
                  <span className="truncate select-all" dir="ltr">{SCAN_COMMANDS[selectedOS].cmd}</span>
                  <button 
                    onClick={() => handleCopy(SCAN_COMMANDS[selectedOS].cmd, 'script')}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-colors shrink-0 mr-2"
                    title="نسخ الأمر"
                  >
                    {copiedScript ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Input Logger / Paste Area */}
              <div className="mt-4">
                <textarea 
                  value={diagnosticInput}
                  onChange={(e) => setDiagnosticInput(e.target.value)}
                  placeholder="ألصق مخرجات شاشة الطرفية/الترمينال هنا، مثل: v18.12.0 java version '17'..."
                  className="w-full h-24 bg-slate-950/75 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none custom-scrollbar"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={analyzeLog}
                    disabled={isScanning || !diagnosticInput.trim()}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white py-2 px-3 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/10"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>جاري التحليل...</span>
                      </>
                    ) : (
                      <>
                        <Play size={12} fill="currentColor" />
                        <span>حلل المخرجات الآن ⚡</span>
                      </>
                    )}
                  </button>
                  {diagnosticInput && (
                    <button
                      onClick={handleReset}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg text-xs transition-colors"
                    >
                      إعادة ضبط
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Live Diagnostic Results */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-blue-900/30 text-blue-400 border border-blue-900 px-2 py-0.5 rounded-full font-bold">الخطوة الثانية: لوحة تقرير السلامة</span>
                <h4 className="font-bold text-sm text-slate-200 mt-2">نتائج التحقق والمطابقة</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  هنا تظهر حالة توافق البرمجيات المثبتة لتشغيل لغة البيان على البيئة المحلية:
                </p>
              </div>

              <div className="space-y-3 my-4 flex-1 flex flex-col justify-center">
                {/* Node.js Status Card */}
                <div className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                  nodeState.status === 'success' 
                    ? 'bg-emerald-950/10 border-emerald-900/40 text-emerald-300' 
                    : nodeState.status === 'warning'
                      ? 'bg-amber-950/10 border-amber-900/40 text-amber-300'
                      : nodeState.status === 'error'
                        ? 'bg-red-950/10 border-red-900/40 text-red-300'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                }`}>
                  <div className="mt-0.5 shrink-0">
                    {nodeState.status === 'success' && <CheckCircle size={16} className="text-emerald-400 animate-pulse" />}
                    {nodeState.status === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
                    {nodeState.status === 'error' && <AlertCircle size={16} className="text-red-400" />}
                    {nodeState.status === 'idle' && <Terminal size={16} className="text-slate-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-slate-200">بيئة تشغيل Node.js 18+</h5>
                      {nodeState.version && (
                        <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-300 px-1 py-0.2 rounded font-mono">{nodeState.version}</span>
                      )}
                    </div>
                    <p className="text-[10px] mt-1 leading-relaxed">
                      {nodeState.message || 'في انتظار تشغيل أو لصق مخرجات فحص Node.js من جهازك للتحقق.'}
                    </p>
                  </div>
                </div>

                {/* JDK 17 Status Card */}
                <div className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                  jdkState.status === 'success' 
                    ? 'bg-emerald-950/10 border-emerald-900/40 text-emerald-300' 
                    : jdkState.status === 'warning'
                      ? 'bg-amber-950/10 border-amber-900/40 text-amber-300'
                      : jdkState.status === 'error'
                        ? 'bg-red-950/10 border-red-900/40 text-red-300'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                }`}>
                  <div className="mt-0.5 shrink-0">
                    {jdkState.status === 'success' && <CheckCircle size={16} className="text-emerald-400 animate-pulse" />}
                    {jdkState.status === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
                    {jdkState.status === 'error' && <AlertCircle size={16} className="text-red-400" />}
                    {jdkState.status === 'idle' && <FileCode size={16} className="text-slate-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-slate-200">حزمة تطوير جافا JDK 17+</h5>
                      {jdkState.version && (
                        <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-300 px-1 py-0.2 rounded font-mono">{jdkState.version}</span>
                      )}
                    </div>
                    <p className="text-[10px] mt-1 leading-relaxed">
                      {jdkState.message || 'في انتظار لصق مخرجات جافا. (مطلوب لتصدير أكواد البيان إلى أندرويد APK).'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status footer success or warning hint */}
              {nodeState.status === 'success' && jdkState.status === 'success' && (
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg text-emerald-400 text-[10.5px] flex items-center gap-2 animate-bounce">
                  <Sparkles size={14} className="text-yellow-400 shrink-0" />
                  <span>تهانينا! بيئتك الحالية مهيأة بالكامل للبدء في تشغيل وبناء برمجيات الأندرويد والويب بلغة البيان.</span>
                </div>
              )}
            </div>

          </div>

          {/* Interactive Downloader & Config Guides */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Download size={18} className="text-emerald-400 animate-bounce" />
              روابط التحميل المباشرة لـ {osList.find(o => o.key === selectedOS)?.name} ودليل التهيئة:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Node.js Card */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-emerald-400">محرك تشغيل الويب والترجمة</h4>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-900 font-mono">Node.js</span>
                  </div>
                  <h5 className="font-bold text-slate-200 text-sm mt-1.5">{DOWNLOADS[selectedOS].node.title}</h5>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {DOWNLOADS[selectedOS].node.guide}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">حالة التحميل: آمن ومباشر</span>
                  {DOWNLOADS[selectedOS].node.url !== '#' ? (
                    <a 
                      href={DOWNLOADS[selectedOS].node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-emerald-500/10"
                    >
                      <Download size={13} />
                      <span>تحميل مباشر</span>
                    </a>
                  ) : (
                    <button 
                      onClick={() => handleCopy('pkg install nodejs-lts', 'guide')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedCode === 'pkg install nodejs-lts' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>نسخ الأمر</span>
                    </button>
                  )}
                </div>
              </div>

              {/* JDK Card */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-blue-400">مترجم وراسم الأندرويد</h4>
                    <span className="text-[9px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full border border-blue-900 font-mono">JDK 17+</span>
                  </div>
                  <h5 className="font-bold text-slate-200 text-sm mt-1.5">{DOWNLOADS[selectedOS].jdk.title}</h5>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {DOWNLOADS[selectedOS].jdk.guide}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">مطلوب لبناء الـ APK</span>
                  {DOWNLOADS[selectedOS].jdk.url !== '#' ? (
                    <a 
                      href={DOWNLOADS[selectedOS].jdk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-blue-500/10"
                    >
                      <Download size={13} />
                      <span>تحميل مباشر</span>
                    </a>
                  ) : (
                    <button 
                      onClick={() => handleCopy('pkg install openjdk-17 -y', 'guide')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedCode === 'pkg install openjdk-17 -y' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>نسخ الأمر</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help / Environment Variables Tips */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              نصائح متقدمة لتهيئة متغيرات البيئة (PATH & Variables):
            </h4>
            <ul className="text-[11px] text-slate-400 mt-2 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>في <span className="text-slate-200 font-bold">ويندوز</span>: تأكد من إضافة مسار جافا الثنائي <code className="bg-slate-800 px-1 py-0.2 rounded text-amber-400 font-mono">bin</code> إلى متغير <code className="text-slate-200 font-mono">PATH</code> لكي تتمكن من تشغيل الأمر <code className="text-slate-200 font-mono">javac</code> من أي مكان.</li>
              <li>للتأكد من ربط الأندرويد استوديو، أضف متغير بيئة جديد باسم <code className="text-slate-200 font-mono">JAVA_HOME</code> يشير إلى المجلد الرئيسي لتثبيت JDK (مثلاً: <code className="bg-slate-800 px-1 py-0.2 text-emerald-400 font-mono">C:\Program Files\Java\jdk-17</code>).</li>
              <li>إذا كنت تستخدم <span className="text-slate-200 font-bold">macOS</span>، يمكنك التحقق من مسارات جافا النشطة بتشغيل الأمر: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono">/usr/libexec/java_home -V</code>.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>مساعد البيئة الرقمي - استوديو البيان v2.2.0</span>
          <span className="text-emerald-400 font-bold">صنع بذكاء لتمكين المبرمج العربي 🌍</span>
        </div>
      </div>
    </div>
  );
};
