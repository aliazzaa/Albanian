import React, { useState } from 'react';
import { 
  X, Sparkles, Smartphone, Globe, Cpu, Wand2, RefreshCw, Check, Copy, Play, 
  HelpCircle, AlertCircle, Zap, Settings, AppWindow, Layers, Activity, 
  CheckCircle2, Terminal, ChevronRight, Palette, Layout, ShieldAlert,
  Database, Volume2, Shield, BookOpen, Info
} from 'lucide-react';

interface BayanAppGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCode: (code: string) => void;
  onInstantRun: (code: string) => void;
}

interface GenerationOptions {
  appName: string;
  developerName: string;
  appType: 'android' | 'web' | 'hybrid';
  description: string;
  colorTheme: 'emerald' | 'indigo' | 'gold' | 'cosmic' | 'rose';
  uiStyle: 'cards' | 'minimal' | 'mono' | 'royal' | 'sand';
  enableLocalDb: boolean;
  enableVoice: boolean;
  enableOfflinePwa: boolean;
  enableHaptic: boolean;
}

export const BayanAppGenerator: React.FC<BayanAppGeneratorProps> = ({
  isOpen,
  onClose,
  onApplyCode,
  onInstantRun
}) => {
  const [options, setOptions] = useState<GenerationOptions>({
    appName: 'تطبيق الروضة الذكي',
    developerName: 'دار البيان للتقنية',
    appType: 'android',
    description: 'تطبيق أندرويد لتعليم وتلاوة القرآن الكريم والأذكار مع حساب الإحصائيات وتشغيل منبه صوتي يومي.',
    colorTheme: 'emerald',
    uiStyle: 'cards',
    enableLocalDb: true,
    enableVoice: true,
    enableOfflinePwa: true,
    enableHaptic: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState<number>(0);
  const [genLogs, setGenLogs] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'generator' | 'education'>('generator');
  const [selectedEduTemplate, setSelectedEduTemplate] = useState<string>('android_azkar');
  const [eduCopied, setEduCopied] = useState(false);

  // -- SIMULATOR STATE VARIABLES --
  const [simTab, setSimTab] = useState<'code' | 'simulator'>('simulator');
  const [simulatorState, setSimulatorState] = useState<'idle' | 'splash' | 'app'>('idle');
  const [simButtonClicks, setSimButtonClicks] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simModalText, setSimModalText] = useState<string | null>(null);
  const [isQuantumAccelerated, setIsQuantumAccelerated] = useState<boolean>(true);
  const [simVibrateWiggle, setSimVibrateWiggle] = useState<boolean>(false);
  const [simIsOffline, setSimIsOffline] = useState<boolean>(false);
  const [simDbRecords, setSimDbRecords] = useState<string[]>([]);

  if (!isOpen) return null;

  // Modern browser frequency sound synthesizer mimicking Al-Bayan compiler instructions
  const playSimTone = (frequency: number = 440, duration: number = 0.15, type: OscillatorType = 'sine') => {
    try {
      if (!options.enableVoice) return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.value = frequency;
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported in preview frame", e);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenStep(0);
    setGenLogs([]);
    setGeneratedCode(null);
    setSimulatorState('idle');

    const steps = [
      { text: `🔮 [الذكاء الصرف] جاري تحليل واقتراح البنية التحتية لتطبيق "${options.appName}"...`, duration: 700 },
      { text: `📐 [محلل الهياكل] مطابقة الكيانات البرمجية وتخطيط واجهة (${options.uiStyle === 'cards' ? 'البطاقات الحديثة' : options.uiStyle === 'royal' ? 'الملكية الفاخرة' : 'الهيكلية الدقيقة'})...`, duration: 600 },
      { text: `🎨 [المعالج اللوني] توليد لوحة الألوان وتجهيز أكواد النمط السداسي عشر لثيم (${options.colorTheme === 'emerald' ? 'رونق الزمرد' : options.colorTheme === 'gold' ? 'بريق الذهب' : 'الفضاء السديمي'})...`, duration: 600 },
      { text: `💻 [مصمم العتاد] تجميع واجهات الاستدعاء السريع (${options.enableLocalDb ? 'قاعدة بيانات SQLite المحلية' : ''} ${options.enableVoice ? '، ومستشعرات الصوت والـ Audio' : ''})...`, duration: 700 },
      { text: `⚙️ [مترجم الأندرويد والويب] ربط توثيقات الأندرويد والـ PWA السريعة لضمان تصفح مثالي دون اتصال...`, duration: 800 },
      { text: `🚀 [السيادة الرقمية] تجميع الشيفرة البرمجية متكاملة الأطراف (Bayan Compiled Code) ونسب انبعاث طاقة صفرية...`, duration: 900 }
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenStep(i + 1);
      setGenLogs(prev => [...prev, steps[i].text]);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }

    // Process options to yield custom Bayan dynamic code based on selection
    const generatedBayanCode = getCustomBayanCode(options);
    setGeneratedCode(generatedBayanCode);
    setIsGenerating(false);

    // Bootstrap physical device simulation parameters
    setSimButtonClicks(0);
    setSimTab('simulator');
    setSimulatorState('splash');
    setSimIsOffline(false);
    setSimDbRecords([]);

    // Boot cycle simulations
    setTimeout(() => {
      if (options.enableVoice) {
        playSimTone(523, 0.08, 'sine'); // C5
        setTimeout(() => playSimTone(659, 0.08, 'sine'), 80); // E5
        setTimeout(() => playSimTone(784, 0.12, 'sine'), 160); // G5
      }
      setSimulatorState('app');

      const bootTime = new Date().toLocaleTimeString('ar-EG');
      const startLogs = [
        `[${bootTime}] 🚀 جاري بدء تشغيل: ${options.appName}`,
        `[${bootTime}] 💎 النظائر والطبقات الهيكلية محمَّلة ومستقرة تماماً.`,
        `[${bootTime}] 🔋 مؤشر استهلاك الطاقة: 0% كفاءة الصفر الخلوي.`
      ];
      if (options.enableLocalDb) {
        startLogs.push(`[${bootTime}] 💾 تم تسجيل قاعدة بيانات SQLite الموطنة وتشغيل النواة!`);
      }
      if (options.enableVoice) {
        startLogs.push(`[${bootTime}] 📢 مكثّفات نطق الصوت وتخليق النغمات مفعّلة بنجاح.`);
      }
      setSimLogs(startLogs);
    }, 1300);
  };

  const getCustomBayanCode = (opt: GenerationOptions) => {
    const isAndroid = opt.appType === 'android';
    const isWeb = opt.appType === 'web';
    
    let dbCode = '';
    if (opt.enableLocalDb) {
      dbCode = `
    // الكيان التخزيني لقاعدة البيانات المحلية
    قاعدة_بيانات.تهيئة("سجل_تطبيق_البيان")
    قاعدة_بيانات.تحديث_أو_إضافة("البيانات_الأساسية"، "المطور"، "${opt.developerName}")
    قاعدة_بيانات.تحديث_أو_إضافة("سجل_التقدم"، "التاريخ_اليومي"، "١")
    اطبع("💾 تم تسجيل قاعدة بيانات SQLite الموطنة وتشغيل النواة!")
    `;
    }

    let voiceCode = '';
    if (opt.enableVoice) {
      voiceCode = `
    // محرك الصوت المدمج
    نغمة.تشغيل_مسار("C4", "8n")
    نغمة.تأثير_صدى("قاعة_صوتية")
    أندرويد.رسالة_منبثقة("📢 تم تشغيل التنبيه الصوتي بنجاح!")
    `;
    }

    let hapticCode = '';
    if (opt.enableHaptic) {
      hapticCode = `
    // استشعار الحركة والاهتزاز اللمسي لتأكيد نقرة المستخدم
    أندرويد.اهتزاز_لمسي("نقرة_خفيفة")
    `;
    }

    let layoutElements = '';
    if (opt.uiStyle === 'royal') {
      layoutElements = `
    أندرويد.إضافة_واجهة("الذهبية_الملكية")
    أندرويد.نمط_الواجهة("إطار_ذهبي_فاخر")
    أندرويد.عنوان_رئيسي("👑 ${opt.appName}")
      `;
    } else if (opt.uiStyle === 'mono') {
      layoutElements = `
    أندرويد.إضافة_واجهة("التقنية_أحادية_اللون")
    أندرويد.نمط_الواجهة("خطوط_تكنولوجية_أحادية")
    أندرويد.عنوان_رئيسي("💻 ${opt.appName}")
      `;
    } else {
      layoutElements = `
    أندرويد.إضافة_واجهة("واجهة_البطاقات_المتجاوبة")
    أندرويد.نمط_الواجهة("مظهر_مظلم_حديث")
    أندرويد.عنوان_رئيسي("📱 ${opt.appName}")
      `;
    }

    return `// ==========================================================
// 🚀 تم توليده تلقائياً بفضل "مستكشف ومولد تطبيقات البيان عام ٢٠٢٦"
// المطور: ${opt.developerName}
// عنوان التطبيق: ${opt.appName}
// نوع النظام: ${isAndroid ? 'تطبيق أندرويد موطّن' : isWeb ? 'موقع ويب تقدمي مستقل PWA' : 'منظومة هجينة فائقة الجودة'}
// ==========================================================

مهمة رئيسية():
    اطبع("🚀 جاري بدء تشغيل: ${opt.appName}")
    اطبع("🏢 تم التطوير بواسطة: ${opt.developerName}")

    // تهيئة الهوية البصرية اللمسية والمرئية
    أندرويد.صناعة_تطبيق("com.bayan.generated.${Math.floor(Math.random() * 90000 + 10000)}", "${opt.appName}")
    أندرويد.لوح_الألوان("${opt.colorTheme === 'emerald' ? 'زمردي_فاخر' : opt.colorTheme === 'gold' ? 'ذهبي_ملكي' : 'فضاء_سديمي'}")
    
    ${layoutElements}

    // تفاصيل وتوصيف المنظومة الذكية
    أندرويد.نص("الوصف"، "📝 ${opt.description}")
    
    ${dbCode}
    ${voiceCode}
    
    ${isAndroid ? `
    // تكوين برامج الاندرويد لتوافق عتاد الجوالات بالكامل
    أندرويد.رخصة_الوصول("الاهتزاز")
    أندرويد.رخصة_الوصول("الإنترنت_المحلي")
    أندرويد.زر_تفاعلي("تأكيد الدخول وفتح الدليل")
    ` : ''}

    ${isWeb ? `
    // تفعيل بيئة الروابط والموقع التقدمي PWA ليعمل بالكامل دون اتصال بالإنترنت
    أندرويد.تهيئة_موقع_ويب("https://bayan.studio/${opt.appName.replace(/\s+/g, '_')}")
    أندرويد.رخصة_الوصول("التخزين_المؤقت_للخدمة")
    أندرويد.زر_تفاعلي("تثبيت التطبيق على الشاشة الرئيسية")
    ` : ''}

    // دالة تفاعلية لمعالجة نقرات واجهة التطبيق
    تعلم.عند_النقر("زر_الدخول"):
        ${hapticCode}
        اطبع("✅ تم تفعيل زر تفاعل بنجاح دون الحاجة لسيرفر خارجي!")
        أندرويد.رسالة_منبثقة("مرحباً بك في \${opt.appName}! تم التشغيل بموثوقية كاملة.")
    نهاية

    // تجميع وبناء ملفات حزمة التوزيع
    أندرويد.بناء_APK()
    اطبع("🏁 اكتمل تجميع وبناء التطبيق والملفات بنجاح 100%")
نهاية
`;
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'emerald': return 'from-emerald-500 to-teal-500';
      case 'indigo': return 'from-indigo-500 to-blue-500';
      case 'gold': return 'from-amber-400 to-yellow-500';
      case 'rose': return 'from-rose-500 to-pink-500';
      default: return 'from-sky-500 to-indigo-500';
    }
  };

  const getThemeText = (theme: string) => {
    switch (theme) {
      case 'emerald': return 'text-emerald-400';
      case 'indigo': return 'text-indigo-400';
      case 'gold': return 'text-amber-400';
      case 'rose': return 'text-rose-400';
      default: return 'text-sky-400';
    }
  };

  const getThemeBg = (theme: string) => {
    switch (theme) {
      case 'emerald': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'indigo': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      case 'gold': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'rose': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default: return 'bg-sky-500/10 border-sky-500/20 text-sky-400';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-950 border border-slate-900 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-900/40 gap-4 shrink-0" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Wand2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-sky-400 via-slate-100 to-emerald-400">
                مستكشف ومولد تطبيقات ومواقع البيان 🚀
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                تجميع وتوطين الأنظمة المستقلة فائقة السرعة وعالية الأمان لعام ٢٠٢٦
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Nav subtabs */}
            <div className="bg-slate-900/85 p-1 rounded-xl border border-slate-805 flex gap-1 text-[11px]">
              <button
                onClick={() => setActiveSubTab('generator')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  activeSubTab === 'generator'
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings size={12} />
                <span>أداة البناء وتوليد التطبيقات</span>
              </button>
              <button
                onClick={() => setActiveSubTab('education')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  activeSubTab === 'education'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers size={12} />
                <span>دليل وموسوعة لغة البيان البرمجية 📚</span>
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
              id="app-gen-close-btn"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal content body split depending on subtab */}
        {activeSubTab === 'generator' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Controls Input Sidebar Panel */}
            <div className="w-full md:w-[45%] border-l border-slate-900 overflow-y-auto p-5 space-y-5 bg-slate-900/20">
              
              {/* Input App Name */}
              <div className="space-y-1.5 animate-in fade-in duration-300">
                <label className="text-xs font-bold text-slate-300 block">اسم التطبيق / المشروع:</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={options.appName}
                    onChange={(e) => setOptions({...options, appName: e.target.value})}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/80 transition-all font-sans"
                    placeholder="مثال: ذكاء رصد التربة والطقس"
                    id="gen-app-name-input"
                  />
                  <Smartphone size={14} className="absolute left-3.5 top-3.5 text-slate-600" />
                </div>
              </div>

              {/* Input Developer / Corporate Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">اسم المطور أو المالك الاستراتيجي:</label>
                <input 
                  type="text"
                  value={options.developerName}
                  onChange={(e) => setOptions({...options, developerName: e.target.value})}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500/80 transition-all font-sans"
                  placeholder="اسم الكيان المسؤول عن البرنامج"
                  id="gen-developer-input"
                />
              </div>

              {/* System Platform Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">نوع ومحدد منصة التطبيق:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setOptions({...options, appType: 'android'})}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      options.appType === 'android'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-lg shadow-emerald-950/20'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-slate-300'
                    }`}
                    id="gen-platform-android-btn"
                  >
                    <Smartphone size={18} />
                    <span className="text-[10px]">برنامج أندرويد (APK)</span>
                  </button>

                  <button
                    onClick={() => setOptions({...options, appType: 'web'})}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      options.appType === 'web'
                        ? 'border-sky-500 bg-sky-500/10 text-sky-400 font-bold shadow-lg shadow-sky-950/20'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-slate-300'
                    }`}
                    id="gen-platform-web-btn"
                  >
                    <Globe size={18} />
                    <span className="text-[10px]">موقع ويب (PWA)</span>
                  </button>

                  <button
                    onClick={() => setOptions({...options, appType: 'hybrid'})}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      options.appType === 'hybrid'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 font-bold shadow-lg shadow-purple-950/20'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-slate-300'
                    }`}
                    id="gen-platform-hybrid-btn"
                  >
                    <Layers size={18} />
                    <span className="text-[10px]">منظومة هجينة فائقة</span>
                  </button>
                </div>
              </div>

              {/* Application Description & Required functions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">وصف التطبيق والخصائص والميزات العامة:</label>
                <textarea 
                  value={options.description}
                  onChange={(e) => setOptions({...options, description: e.target.value})}
                  rows={3}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/80 transition-all font-sans leading-relaxed resize-none"
                  placeholder="اكتب بالتفصيل ما ترغب في تضمينه داخل أسطر كود التطبيق المولد..."
                  id="gen-desc-textarea"
                ></textarea>
              </div>

              {/* Styling Configurations (Visual Palette / UI Style) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Palette size={13} className="text-slate-450" />
                    <span>لوحة الألوان:</span>
                  </span>
                  <select
                    value={options.colorTheme}
                    onChange={(e) => setOptions({...options, colorTheme: e.target.value as any})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none font-bold"
                    id="gen-color-theme-select"
                  >
                    <option value="emerald">💚 رونق الزمرد (أخضر)</option>
                    <option value="indigo">💙 نسيج الياقوت (أزرق)</option>
                    <option value="gold">💛 وهج الذهب (ذهبي)</option>
                    <option value="rose">💖 عبير الورد (وردي)</option>
                    <option value="cosmic">💜 السديم المظلم (أرجواني)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Layout size={13} className="text-slate-450" />
                    <span>طراز المظهر:</span>
                  </span>
                  <select
                    value={options.uiStyle}
                    onChange={(e) => setOptions({...options, uiStyle: e.target.value as any})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none font-bold"
                    id="gen-ui-style-select"
                  >
                    <option value="cards">📱 واجهة بطاقات حديثة</option>
                    <option value="royal">👑 واجهة ملكية راقية</option>
                    <option value="mono">💻 مظهر تقني أحادي</option>
                    <option value="minimal">🍃 مظهر ناصع بسيط</option>
                    <option value="sand">🏜️ طابع الرمال الدافئ</option>
                  </select>
                </div>
              </div>

              {/* Feature Integrations Switchers */}
              <div className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
                <h3 className="text-xs font-bold text-slate-400">تكاملات ومكونات العتاد المطلوبة:</h3>
                
                <div className="space-y-3 pt-1">
                  {/* SQlite DB option */}
                  <div 
                    onClick={() => setOptions({...options, enableLocalDb: !options.enableLocalDb})}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-200 block">قاعدة بيانات محلية SQLite</span>
                      <span className="text-[10px] text-slate-500 block">تخزين آمن للأهواء والإحصائيات على الجوال والمستكشف</span>
                    </div>
                    <div className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 ${options.enableLocalDb ? 'bg-sky-500' : 'bg-slate-850'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-all transform duration-200 ${options.enableLocalDb ? '-translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>

                  {/* Tone.js Voice Engine option */}
                  <div 
                    onClick={() => setOptions({...options, enableVoice: !options.enableVoice})}
                    className="flex items-center justify-between cursor-pointer select-none border-t border-slate-900/65 pt-2.5"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-200 block">منظومة تنبيه ونطق صوتي النغمة</span>
                      <span className="text-[10px] text-slate-500 block">تخليق رنات وصوتيات ذكية باستخدام Tone.js</span>
                    </div>
                    <div className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 ${options.enableVoice ? 'bg-indigo-500' : 'bg-slate-850'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-all transform duration-200 ${options.enableVoice ? '-translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>

                  {/* Service Worker PWA layout option */}
                  <div 
                    onClick={() => setOptions({...options, enableOfflinePwa: !options.enableOfflinePwa})}
                    className="flex items-center justify-between cursor-pointer select-none border-t border-slate-900/65 pt-2.5"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-200 block">التخزين الفوري للخدمة (Offline SW)</span>
                      <span className="text-[10px] text-slate-500 block">تخزين محلي تقدمي لفتح واستجابة الملفات 100% بلا شبكة</span>
                    </div>
                    <div className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 ${options.enableOfflinePwa ? 'bg-emerald-500' : 'bg-slate-850'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-all transform duration-200 ${options.enableOfflinePwa ? '-translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>

                  {/* Haptic vibration feedback option */}
                  <div 
                    onClick={() => setOptions({...options, enableHaptic: !options.enableHaptic})}
                    className="flex items-center justify-between cursor-pointer select-none border-t border-slate-900/65 pt-2.5"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-200 block">الاستشعار والاهتزاز النبضي</span>
                      <span className="text-[10px] text-slate-500 block">توليد نبضات اهتزاز لمسية في شاشة الهواتف</span>
                    </div>
                    <div className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 ${options.enableHaptic ? 'bg-pink-500' : 'bg-slate-850'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-all transform duration-200 ${options.enableHaptic ? '-translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Launch Build Generation Engine Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !options.appName}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  isGenerating 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                    : 'bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98]'
                }`}
                id="gen-launch-build-btn"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={15} className="animate-spin text-sky-400" />
                    <span>جاري توليد وصقل شفرة ومكونات تطبيقك...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={15} className="animate-pulse" />
                    <span>توليد البرنامج وتطبيقه بالبيان 🚀</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Viewer & Interactive Mockup Preview Side Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              
              {/* Show compiler build status logs when isGenerating */}
              {isGenerating && (
                <div className="flex-1 flex flex-col justify-center items-center p-8 space-y-6 bg-slate-950 overflow-y-auto">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-900 border-t-sky-500 animate-spin" />
                    <Cpu className="absolute inset-0 m-auto text-sky-400 animate-pulse" size={24} />
                  </div>
                  
                  <div className="space-y-1 text-center">
                    <h4 className="text-sm font-bold text-slate-200">الوكيل ومحرر الكومبايلر نشطان</h4>
                    <p className="text-xs text-sky-400 font-bold">جاري تخليق منظومة السيادة في {genStep}/6 خطوات</p>
                  </div>

                  <div className="w-full max-w-md bg-slate-900 border border-slate-850 p-4 rounded-xl font-mono text-[10px] text-right space-y-2 max-h-56 overflow-y-auto">
                    {genLogs.map((log, index) => (
                      <div key={index} className="text-slate-300 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-500 shrink-0">✓</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850/60 mt-2">
                      <div 
                        className="bg-gradient-to-r from-sky-500 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(genStep / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Default state when nothing generated yet */}
              {!isGenerating && !generatedCode && (
                <div className="flex-1 flex flex-col justify-center items-center p-8 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <AppWindow size={28} />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-sm font-bold text-slate-200">صنع برامج عتاد ومواقع البيان الذكية</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      قم بملء البيانات في لوحة الإعدادات الجانبية، ثم انقر على "توليد البرنامج" لبناء وتجهيز شيفرتك البرمجية المستقلة بنبض الـ PWA ومعززات الأندرويد.
                    </p>
                  </div>
                </div>
              )}

              {/* Generated Code & Beautiful Mockup Screen Preview */}
              {!isGenerating && generatedCode && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Top Segmented Controls & Primary Action Buttons */}
                  <div className="bg-slate-900/60 p-3.5 px-5 border-b border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0" dir="rtl">
                    <div className="flex items-center gap-2.5">
                      <Terminal size={14} className="text-emerald-400 shrink-0" />
                      
                      {/* Segmented Controls */}
                      <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 flex gap-1">
                        <button
                          onClick={() => {
                            setSimTab('simulator');
                            playSimTone(440, 0.05, 'sine');
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-[10.5px] font-extrabold transition-all flex items-center gap-1.5 ${
                            simTab === 'simulator'
                              ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-extrabold shadow-lg shadow-sky-950/40'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                          id="tab-btn-simulator"
                        >
                          <Smartphone size={12} />
                          <span>محاكاة التطبيق فوريًا 📱</span>
                        </button>
                        <button
                          onClick={() => {
                            setSimTab('code');
                            playSimTone(480, 0.05, 'sine');
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-[10.5px] font-extrabold transition-all flex items-center gap-1.5 ${
                            simTab === 'code'
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-lg shadow-emerald-950/40'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                          id="tab-btn-code"
                        >
                          <Terminal size={12} />
                          <span>أكواد لغة البيان (.byn) 💻</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Copy code button */}
                      <button
                        onClick={handleCopy}
                        className="h-9 px-3.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-820 transition-all flex items-center gap-2 text-[10.5px] font-bold"
                        id="gen-copy-btn"
                      >
                        {copied ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-400">تم نسخ الرمز!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>نسخ الكود</span>
                          </>
                        )}
                      </button>

                      {/* Apply to editor button */}
                      <button
                        onClick={() => {
                          onApplyCode(generatedCode);
                          onClose();
                        }}
                        className="h-9 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all flex items-center gap-1.5 text-[10.5px] font-extrabold shadow-md shadow-sky-950/20"
                        id="gen-apply-editor-btn"
                      >
                        <CheckCircle2 size={12} />
                        <span>تطبيق في المحرر</span>
                      </button>

                      {/* Instant Run button */}
                      <button
                        onClick={() => {
                          onInstantRun(generatedCode);
                          onClose();
                        }}
                        className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white transition-all flex items-center gap-1.5 text-[10.5px] font-extrabold shadow-md shadow-emerald-950/20"
                        id="gen-instant-run-btn"
                      >
                        <Play size={10} fill="currentColor" />
                        <span>تشغيل المشروع ⚡</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Workspace Container */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950" dir="rtl">
                    
                    {/* ====== SOURCE CODE MODE ====== */}
                    {simTab === 'code' && (
                      <div className="space-y-4 animate-in fade-in duration-200 text-right">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-400">شيفرة المصدر المترجمة بلغة البيان المقاومة للثغرات:</h4>
                          <span className="p-1 px-2.2 rounded bg-slate-900 border border-slate-805 text-[8px] font-mono text-emerald-400">0% MEMORY LEAKS</span>
                        </div>
                        <div className="bg-[#030712] rounded-2xl border border-slate-900 p-4.5 relative overflow-hidden group">
                          <div className="absolute top-3 left-3 bg-slate-900 border border-slate-805 text-slate-500 text-[8px] px-2 py-0.5 rounded font-mono select-none">
                            BYN COMPILER V1.4
                          </div>
                          <pre className="text-[10px] leading-relaxed text-slate-200 font-mono text-right overflow-x-auto whitespace-pre select-all pt-2" dir="ltr">
                            {generatedCode}
                          </pre>
                        </div>
                        <div className="bg-slate-900/35 border border-slate-900 p-4 rounded-xl flex items-start gap-3">
                          <Info size={14} className="text-sky-400 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            <strong>توثيق النقل:</strong> هذه الأكواد البرمجية متوافقة بالكامل مع قواعد ومحددات مترجم البيئة التوليدية. الضغط على زر "تطبيق في المحرر" سيقوم بنقلها تلقائياً وإتاحتها للإصدار وبناء حزم الأندرويد والـ WebApp بشكل نهائي.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ====== INTERACTIVE SIMULATOR MODE ====== */}
                    {simTab === 'simulator' && (
                      <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center animate-in fade-in duration-200">
                        
                        {/* Column 1: Physical Phone Wrapper */}
                        <div className="flex flex-col items-center shrink-0">
                          
                          {/* Bezel frame container */}
                          <div 
                            className={`w-72 sm:w-[290px] rounded-[38px] border-[7px] border-slate-800 bg-slate-900 p-3 shadow-2xl relative select-none flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                              simVibrateWiggle ? 'animate-bounce' : ''
                            }`}
                            style={simVibrateWiggle ? { transform: 'translateX(4px) rotate(1deg)' } : {}}
                          >
                            {/* Camera Notch and Speaker Grid */}
                            <div className="w-20 h-4.5 bg-slate-900 rounded-b-2xl mx-auto -mt-3.5 pb-2.5 flex items-center justify-center gap-1.5 z-20 shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                              <div className="w-8 h-1 bg-slate-800 rounded-full" />
                            </div>

                            {/* Outer Glass Side Buttons mockup */}
                            <div className="absolute right-[-10px] top-24 w-[3px] h-10 bg-slate-755 rounded-l" />
                            <div className="absolute left-[-10px] top-20 w-[3px] h-7 bg-slate-755 rounded-r" />
                            <div className="absolute left-[-10px] top-30 w-[3px] h-7 bg-slate-755 rounded-r" />

                            {/* Inner Screen Surface */}
                            <div className="w-full bg-[#040712] rounded-[30px] aspect-[9/18] overflow-hidden flex flex-col relative border border-slate-950 shadow-inner">
                              
                              {/* Screen Status bar */}
                              <div className="flex justify-between items-center text-[8.5px] text-slate-400 px-3.5 py-1.5 bg-[#03060f]/80 backdrop-blur z-25">
                                <span className="font-bold text-slate-300">١٢:٣٠ م</span>
                                <div className="flex gap-1.2 items-center">
                                  {simIsOffline ? (
                                    <span className="text-amber-500 font-bold text-[8px] flex items-center gap-0.5">
                                      ✈️ وب مستقر دون اتصال
                                    </span>
                                  ) : (
                                    <span className="text-emerald-500 text-[8px] flex items-center gap-0.5">
                                      📶 5G السيادة
                                    </span>
                                  )}
                                  <div className="w-5.5 h-2.5 border border-slate-600 rounded px-0.5 flex items-center bg-slate-900/60 font-sans text-[7.5px] text-slate-350">
                                    <span className="font-bold text-[7.5px] block w-full text-center">🔋</span>
                                  </div>
                                </div>
                              </div>

                              {/* Splash loader and booting state */}
                              {simulatorState === 'splash' && (
                                <div className="flex-1 flex flex-col items-center justify-center p-5 text-center space-y-5 bg-[#03060d] relative">
                                  {/* Dynamic spinning core */}
                                  <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-sky-500 animate-spin flex items-center justify-center">
                                      <Wand2 size={24} className="text-sky-400 animate-pulse" />
                                    </div>
                                    <div className="absolute inset-0 border border-indigo-500/20 rounded-full scale-110 animate-ping duration-1000" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <h5 className="text-[11px] font-extrabold text-[#edf2f7] block">تطبيق الـ APK والـ PWA يتكوّن</h5>
                                    <p className="text-[8px] text-slate-500 leading-relaxed px-4">
                                      ربط أندرويد.تنظيف_ذاكرة_تلقائي() وتفعيل التوازي دون خوادم...
                                    </p>
                                  </div>
                                  <div className="w-24 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-850 mx-auto mt-2">
                                    <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full animate-pulse transition-all duration-1000" style={{ width: '80%' }} />
                                  </div>
                                </div>
                              )}

                              {/* Interactive Active App State */}
                              {simulatorState === 'app' && (
                                <div className="flex-1 flex flex-col justify-between overflow-y-auto relative p-3 pb-4" dir="rtl">
                                  
                                  {/* Inline Quantum Acceleration glowing ribbon wave */}
                                  {isQuantumAccelerated && (
                                    <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none animate-pulse overflow-hidden">
                                      <div className="w-[150%] h-12 bg-sky-500/10 rounded-full blur-xl animate-spin mx-auto -translate-y-6 opacity-30" />
                                    </div>
                                  )}

                                  {/* Top Navigation element */}
                                  <div className="space-y-2 relative z-10 pt-1 text-center shrink-0">
                                    <div className="mx-auto w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
                                      <Wand2 size={16} className={`${
                                        options.colorTheme === 'emerald' ? 'text-emerald-400' :
                                        options.colorTheme === 'indigo' ? 'text-indigo-400' :
                                        options.colorTheme === 'gold' ? 'text-amber-400' :
                                        options.colorTheme === 'rose' ? 'text-rose-400' :
                                        'text-purple-400'
                                      }`} />
                                    </div>
                                    <div className="text-center">
                                      <h6 className="text-[10.5px] font-extrabold text-slate-100 leading-tight">{options.appName}</h6>
                                      <span className="text-[7.5px] text-slate-500 block">{options.developerName}</span>
                                    </div>
                                  </div>

                                  {/* Core Functional Screen Modules */}
                                  <div className="flex-1 my-3 overflow-y-auto space-y-2.5 px-0.5">
                                    
                                    {/* App UI style representations */}
                                    {options.uiStyle === 'royal' && (
                                      <div className="border border-amber-500/25 bg-amber-500/5 p-2 rounded-xl text-center space-y-1 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-0.5 bg-amber-500/10 rounded-es">👑</div>
                                        <span className="text-[7.5px] text-amber-400 font-extrabold block">لوحة ذهبية ملكية فاخرة</span>
                                        <p className="text-[7.5px] text-slate-300 leading-relaxed text-center px-1">
                                          {options.description.length > 80 ? `${options.description.slice(0, 80)}...` : options.description}
                                        </p>
                                      </div>
                                    )}

                                    {options.uiStyle === 'mono' && (
                                      <div className="border border-slate-800 bg-[#02050a] p-2 rounded-xl font-mono text-right space-y-1">
                                        <span className="text-[7px] text-slate-400 font-bold block">// نظام أحادي ومقاوم للعوامل</span>
                                        <p className="text-[7px] text-emerald-400 leading-relaxed">
                                          ⚙️ SYS_LOAD: STABLE<br />
                                          📝 {options.description.length > 80 ? `${options.description.slice(0, 80)}...` : options.description}
                                        </p>
                                      </div>
                                    )}

                                    {options.uiStyle === 'cards' && (
                                      <div className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-xl space-y-1">
                                        <div className="flex items-center gap-1.2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                          <span className="text-[7.5px] font-extrabold text-slate-200">النمط الجغرافي للبطاقات</span>
                                        </div>
                                        <p className="text-[7.5px] text-slate-400 leading-relaxed pr-1">
                                          {options.description.length > 80 ? `${options.description.slice(0, 80)}...` : options.description}
                                        </p>
                                      </div>
                                    )}

                                    {options.uiStyle === 'minimal' && (
                                      <div className="border border-slate-900 bg-slate-950 p-2.5 rounded-xl text-center">
                                        <p className="text-[8px] text-slate-350 leading-relaxed italic">
                                          "{options.description.length > 90 ? `${options.description.slice(0, 90)}...` : options.description}"
                                        </p>
                                      </div>
                                    )}

                                    {options.uiStyle === 'sand' && (
                                      <div className="border border-amber-900/20 bg-amber-950/10 p-2.5 rounded-xl space-y-1">
                                        <span className="text-[7px] text-amber-500 font-bold block border-b border-amber-900/10 pb-0.5">⏳ الطبع الصحراوي الدافئ</span>
                                        <p className="text-[7.5px] text-slate-400 leading-relaxed">
                                          {options.description.length > 80 ? `${options.description.slice(0, 80)}...` : options.description}
                                        </p>
                                      </div>
                                    )}

                                    {/* Offline SW Banner if active */}
                                    {options.enableOfflinePwa && simIsOffline && (
                                      <div className="bg-amber-550/10 border border-amber-550/20 p-2 rounded-xl text-center space-y-0.5 animate-pulse">
                                        <span className="text-[7.2px] font-bold text-amber-400 block">منع الترابط الخارجي (Offline Mode)</span>
                                        <p className="text-[6.5px] text-slate-400 leading-relaxed">
                                          يعمل بالتكامل ومحايد 100% دون الحاجة للسحب أو خطوط النت.
                                        </p>
                                      </div>
                                    )}

                                    {/* SQLite Simulated DB Card element */}
                                    {options.enableLocalDb && (
                                      <div className="bg-slate-900/40 border border-slate-850/60 p-2.5 rounded-xl space-y-1.5 text-right">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[7.5px] text-slate-400 font-bold flex items-center gap-1">
                                            <Database size={8} className="text-sky-400" />
                                            <span>سجل SQLite المحلي (.db)</span>
                                          </span>
                                          <span className="text-[6.5px] px-1.2 py-0.2 rounded bg-sky-500/10 text-sky-400 font-bold">
                                            الصفوف: +{simDbRecords.length}
                                          </span>
                                        </div>

                                        {/* Display simulated SQL records on device */}
                                        <div className="space-y-1 max-h-16 overflow-y-auto">
                                          {simDbRecords.length === 0 ? (
                                            <span className="text-[6.5px] text-slate-650 block text-center py-1">قاعدة البيانات فارغة، اضغط الحفظ لتوفير السجلات.</span>
                                          ) : (
                                            simDbRecords.map((rec, i) => (
                                              <div key={i} className="text-[6.8px] bg-slate-950 p-1 rounded border border-slate-900 text-teal-400 flex justify-between font-mono">
                                                <span>{rec}</span>
                                                <span className="text-[6px] text-slate-500">تم الحفظ</span>
                                              </div>
                                            ))
                                          )}
                                        </div>

                                        <button 
                                          onClick={() => {
                                            playSimTone(587, 0.08, 'sine'); // D5
                                            setSimVibrateWiggle(true);
                                            setTimeout(() => setSimVibrateWiggle(false), 150);
                                            const now = new Date();
                                            const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                            const newRecord = `صف_أهواء_${simDbRecords.length + 1}`;
                                            setSimDbRecords(prev => [...prev, newRecord]);
                                            
                                            // Append DB telemetry logs
                                            const logTime = now.toLocaleTimeString('ar-EG');
                                            setSimLogs(prev => [
                                              ...prev,
                                              `[${logTime}] 💾 قاعدة_بيانات.تحديث_أو_إضافة("سجل_التقدم"، "${newRecord}")`
                                            ]);
                                          }}
                                          className="w-full py-1 rounded bg-sky-900/50 hover:bg-sky-850/60 border border-sky-800/30 text-[7px] text-sky-350 font-bold flex items-center justify-center gap-1"
                                        >
                                          <span>💾 حفظ سجل جديد في SQLite</span>
                                        </button>
                                      </div>
                                    )}

                                    {/* Tone generating and music chord synthesizers panel */}
                                    {options.enableVoice && (
                                      <div className="bg-slate-900/40 border border-slate-850/60 p-2.5 rounded-xl space-y-1.5 text-right">
                                        <div className="flex items-center gap-1.2 text-slate-400">
                                          <Volume2 size={9} className="text-indigo-400 animate-pulse" />
                                          <span className="text-[7.5px] font-bold">مؤلف النغمات ورنين العتاد التلقائي</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5">
                                          <button
                                            onClick={() => {
                                              playSimTone(261.63, 0.1, 'sine'); // C4
                                              setTimeout(() => playSimTone(329.63, 0.1, 'sine'), 100); // E4
                                              setTimeout(() => playSimTone(392.00, 0.15, 'sine'), 200); // G4
                                              
                                              const logTime = new Date().toLocaleTimeString('ar-EG');
                                              setSimLogs(prev => [
                                                ...prev, 
                                                `[${logTime}] 📢 نغمة.تشغيل_مسار("C4->E4->G4", "8n")`
                                              ]);
                                            }}
                                            className="py-1 rounded bg-indigo-950/40 border border-indigo-900/30 text-[7px] text-indigo-300 font-bold"
                                          >
                                            🔊 عزف نوتة الأمل
                                          </button>
                                          <button
                                            onClick={() => {
                                              playSimTone(440.00, 0.08, 'square'); // A4
                                              setTimeout(() => playSimTone(554.37, 0.12, 'square'), 80); // C#5
                                              
                                              const logTime = new Date().toLocaleTimeString('ar-EG');
                                              setSimLogs(prev => [
                                                ...prev, 
                                                `[${logTime}] 📢 نغمة.تشغيل_مسار("A4->C#5", "16n")`
                                              ]);
                                            }}
                                            className="py-1 rounded bg-indigo-950/40 border border-indigo-900/30 text-[7px] text-indigo-300 font-bold"
                                          >
                                            🎹 نغمة التبريد
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Tactile test buttons */}
                                    {options.enableHaptic && (
                                      <div className="p-2 border border-slate-900 bg-slate-950 rounded-xl flex items-center justify-between gap-2">
                                        <span className="text-[7px] text-slate-500">حاقن الاهتزاز (Haptic)</span>
                                        <button
                                          onClick={() => {
                                            setSimVibrateWiggle(true);
                                            setTimeout(() => setSimVibrateWiggle(false), 200);
                                            playSimTone(110, 0.08, 'triangle'); // Low rumble
                                            const logTime = new Date().toLocaleTimeString('ar-EG');
                                            setSimLogs(prev => [
                                              ...prev,
                                              `[${logTime}] 📳 أندرويد.اهتزاز_لمسي("نقرة_خفيفة")`
                                            ]);
                                          }}
                                          className="py-1 px-2.5 rounded bg-pink-900/40 hover:bg-pink-850/50 border border-pink-900/30 text-[7px] text-pink-300 font-bold"
                                        >
                                          📳 تفريغ نبض
                                        </button>
                                      </div>
                                    )}

                                  </div>

                                  {/* Bottom user action controls & triggers */}
                                  <div className="space-y-1.5 pt-1.5 border-t border-slate-900/60 shrink-0 select-none relative z-10">
                                    <button 
                                      onClick={() => {
                                        playSimTone(523.25, 0.1, 'sine'); // C5
                                        setSimVibrateWiggle(true);
                                        setTimeout(() => setSimVibrateWiggle(false), 150);
                                        setSimButtonClicks(prev => prev + 1);
                                        setSimModalText(`تأكيد دخول ناجح! \n\nتم الاتصال ببرنامجك الموطن "${options.appName}" بنجاح فائق.\n\nتطهير الذاكرة: 100% مستقرة.`);
                                        const logTime = new Date().toLocaleTimeString('ar-EG');
                                        setSimLogs(prev => [
                                          ...prev,
                                          `[${logTime}] 🚀 تم تسجيل النقر بنجاح وتأصيل الدالة تعلن.عند_النقر("زر_الدخول")`
                                        ]);
                                      }}
                                      className={`w-full py-2.2 rounded-xl text-slate-950 font-extrabold text-[9px] shadow-lg flex items-center justify-center gap-1 transition-all ${
                                        options.colorTheme === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110' :
                                        options.colorTheme === 'indigo' ? 'bg-gradient-to-r from-indigo-400 to-blue-400 hover:brightness-110' :
                                        options.colorTheme === 'gold' ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110' :
                                        options.colorTheme === 'rose' ? 'bg-gradient-to-r from-rose-400 to-pink-400 hover:brightness-110' :
                                        'bg-gradient-to-r from-purple-400 to-indigo-400 hover:brightness-110'
                                      }`}
                                    >
                                      <span>تـأكـيـد الاتـصـال و فـتـح الـتـطـبـيـق 🚀</span>
                                    </button>
                                    
                                    <div className="flex items-center justify-between text-[6.5px] text-slate-500 px-1 mt-0.5">
                                      <span>النقرات المسجلة: {simButtonClicks}</span>
                                      {options.enableOfflinePwa ? (
                                        <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                                          <Shield size={7} /> App Cache PWA
                                        </span>
                                      ) : (
                                        <span>نظام خارجي</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Custom simulated mobile Modal Overlay */}
                                  {simModalText && (
                                    <div className="absolute inset-x-2 top-10 bottom-4 bg-slate-955/95 backdrop-blur-sm border border-slate-900 rounded-2xl flex items-center justify-center p-4 z-40 animate-in zoom-in-95 duration-200">
                                      <div className="bg-slate-900 border border-slate-805 rounded-xl p-3.5 text-center space-y-3 shadow-2xl">
                                        <Wand2 className="mx-auto text-sky-400 animate-pulse" size={18} />
                                        <div className="space-y-1">
                                          <h6 className="text-[9px] font-extrabold text-[#edf2f7] leading-tight">رسالة تطبيق البيان:</h6>
                                          <p className="text-[7.5px] text-slate-350 leading-relaxed font-sans whitespace-pre-line pr-1 text-center">
                                            {simModalText}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => {
                                            setSimModalText(null);
                                            playSimTone(392, 0.05, 'sine');
                                          }}
                                          className="w-full py-1 rounded bg-slate-800 hover:bg-slate-755 border border-slate-700 text-slate-200 text-[8px] font-bold"
                                        >
                                          حسناً، استمر بالمعاينة
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                </div>
                              )}

                              {/* Bottom physical gesture line indicators */}
                              <div className="w-20 h-1 bg-slate-850 rounded-full mx-auto my-1.5 shrink-0" />

                            </div>
                          </div>

                        </div>

                        {/* Column 2: Dashboard Control Switchers and Live Telemetry Logs */}
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                          
                          {/* Live device auxiliary controllers */}
                          <div className="bg-slate-900/35 border border-slate-900 p-4 rounded-2xl space-y-3.5">
                            <h4 className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-900 pb-2.5">
                              <Settings size={12} className="text-sky-400" />
                              <span>مفاتيح تحكم عتادية في المعاينة والمحاكاة:</span>
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-right">
                              
                              {/* Flight / Offline SW Switcher */}
                              {options.enableOfflinePwa && (
                                <div className="flex items-center justify-between bg-slate-955 border border-slate-900 p-2.5 rounded-xl">
                                  <div className="space-y-0.5">
                                    <span className="text-[10px] text-slate-200 font-extrabold block">وضع الملاحة دون شبكة (Offline SW)</span>
                                    <span className="text-[8.5px] text-slate-500 block">محاكاة انقطاع الاتصال بالسيرفر</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const nextState = !simIsOffline;
                                      setSimIsOffline(nextState);
                                      playSimTone(400, 0.08, 'sine');
                                      const now = new Date().toLocaleTimeString('ar-EG');
                                      setSimLogs(prev => [
                                        ...prev,
                                        `[${now}] ${nextState ? '✈️ تم قطع التصدير الخارجي والتحول للمخزن الاحتياطي PWA Offline.' : '📶 تم إعادة ربط خيوط الاتصال بالمنفذ الخارجي 5G.'}`
                                      ]);
                                    }}
                                    className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 shrink-0 ${simIsOffline ? 'bg-amber-500' : 'bg-slate-805'}`}
                                  >
                                    <div className={`w-4 h-4 rounded-full bg-slate-950 transition-all transform duration-200 ${simIsOffline ? '-translate-x-4' : 'translate-x-0'}`} />
                                  </button>
                                </div>
                              )}

                              {/* Quantum Processing superposition selector */}
                              <div className="flex items-center justify-between bg-slate-955 border border-slate-900 p-2.5 rounded-xl">
                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-slate-200 font-extrabold block">التسريع والتقاط الكم الكمومي</span>
                                  <span className="text-[8.5px] text-slate-500 block">مضاعفة توازي الموجات للحساب اللحظي O(1)</span>
                                </div>
                                <button
                                  onClick={() => {
                                    const nextState = !isQuantumAccelerated;
                                    setIsQuantumAccelerated(nextState);
                                    playSimTone(nextState ? 660 : 330, 0.08, 'sine');
                                    const now = new Date().toLocaleTimeString('ar-EG');
                                    setSimLogs(prev => [
                                      ...prev,
                                      `[${now}] ${nextState ? '⚛️ تم تفعيل المحرك التراكمي كمومية.سجل_متشابك() لسرعة صفر زمنية.' : '💤 تم وضع الأنوية في وضع تبريد مستقر.'}`
                                    ]);
                                  }}
                                  className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 shrink-0 ${isQuantumAccelerated ? 'bg-indigo-500' : 'bg-slate-805'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-slate-950 transition-all transform duration-200 ${isQuantumAccelerated ? '-translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              </div>

                            </div>
                          </div>

                          {/* Live Console Output Terminal */}
                          <div className="flex-1 flex flex-col bg-[#030712] rounded-2xl border border-slate-900 overflow-hidden min-h-[160px]">
                            
                            {/* Inner Header bar on Terminal */}
                            <div className="bg-[#050b1a] p-3 px-4.5 border-b border-slate-900 flex items-center justify-between select-none shrink-0" dir="rtl">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-[#10b981]/15 text-[#10b981]">
                                  <Terminal size={11} className="animate-pulse" />
                                </div>
                                <span className="text-[10px] font-extrabold text-[#edf2f7] font-sans">سجل حاسوب الاستجابة الفوري (Terminal Simulation Dashboard)</span>
                              </div>
                              
                              <button
                                onClick={() => {
                                  setSimLogs([]);
                                  playSimTone(300, 0.05, 'sine');
                                }}
                                className="text-[9px] text-[#e2e8f0]/40 hover:text-white transition-colors border border-slate-800 p-1 px-2.5 rounded-lg font-bold bg-[#040914]"
                              >
                                مسح المخرجات
                              </button>
                            </div>

                            {/* Logs stream list content */}
                            <div className="flex-1 overflow-y-auto p-4.5 font-mono text-[9.5px] text-slate-300 leading-relaxed text-right space-y-2 max-h-52">
                              {simLogs.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-slate-650 italic text-[10px]">
                                  <span>[بانتظار العمليات للاستشعار والبث...]</span>
                                </div>
                              ) : (
                                simLogs.map((log, index) => (
                                  <div key={index} className="flex items-start gap-2 animate-in fade-in duration-100">
                                    <span className="text-emerald-500 shrink-0">✔</span>
                                    <span className="font-mono text-slate-250 select-all">{log}</span>
                                  </div>
                                ))
                              )}
                            </div>

                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================
             📙 GORGEOUS INTERACTIVE EDUCATION TAB (TRAINING MANUAL)
             ======================================================== */
          <div className="flex-1 overflow-y-auto p-6 bg-[#04060d] space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Top Grid of Sovereign Benefits and Philosphies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">السيادة المطلقة وحفظ الذواكر</h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  بنيت البيان لحل مشكلة تسريب الرام (0% Memory Leaks) من خلال دورات التطهير المدمجة الفعالة. حجم التطبيقات الكلي المتناهي الصغر يجعلها الأسرع قفزاً للعتاد.
                </p>
                <div className="text-[9px] text-emerald-400 font-mono">أندرويد.تنظيف_ذاكرة_تلقائي()</div>
              </div>

              <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 transition-all space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-sky-500/20 text-sky-400">
                    <Cpu size={16} className="animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">اختزال الجهد حاسوبياً لـ O(1)</h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  إزاحة الحلقات المنهكة كلاسيكياً واستدعاء محركات التوازي الكمومي والكيوبيت المترافق يعجِّل حركة الحساب والبيانات ويحمي صحة وطاقة بطاريات الأجهزة لسنوات.
                </p>
                <div className="text-[9px] text-sky-400 font-mono">كمومية.سجل_متشابك()</div>
              </div>

              <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-purple-500/20 text-purple-400">
                    <Globe size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">موطنة بالكامل للأجهزة الطرفية</h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  اكتب برنامجك بالعربية مرة واحدة، وسيقوم المترجم بالتكيف التلقائي وصناعة حزم أندرويد APK موطَّنة أو مواقع ويب تقدمية PWA متجاوبة 100% دون خوادم مبهمة.
                </p>
                <div className="text-[9px] text-purple-400 font-mono">أندرويد.بناء_APK()</div>
              </div>

            </div>

            {/* Split view: Playground with templates + Keywords Dictionary */}
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Left Column: Interactive Template Playground */}
              <div className="flex-1 space-y-4">
                <h3 className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white to-slate-400 flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-400" />
                  <span>المعجم التفاعلي ونماذج الأكواد المتكاملة:</span>
                </h3>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'android_azkar', label: '📱 أذكار وتنبيهات أندرويد', color: 'emerald' },
                    { id: 'quantum_hadamard', label: '⚛️ التشابك الكمي وهادامارد', color: 'sky' },
                    { id: 'neural_evolutionary', label: '🧬 شبكة عصبية تكيفية', color: 'purple' },
                    { id: 'media_experience', label: '🖼️ مشغّل ميديا BayanMedia', color: 'amber' },
                    { id: 'oop_inheritance', label: '🏛️ كائنات المواريث OOP', color: 'pink' }
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      onClick={() => {
                        setSelectedEduTemplate(temp.id);
                        setEduCopied(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedEduTemplate === temp.id
                          ? temp.color === 'emerald' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-900/20'
                            : temp.color === 'sky' ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-900/20'
                            : temp.color === 'purple' ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-900/20'
                            : temp.color === 'amber' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/20'
                            : 'bg-pink-500 text-slate-950 shadow-lg shadow-pink-900/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-850 hover:text-white'
                      }`}
                      id={`edu-temp-${temp.id}`}
                    >
                      {temp.label}
                    </button>
                  ))}
                </div>

                {/* Display Selected educational template detail */}
                {(() => {
                  let title = '';
                  let desc = '';
                  let byteSize = '320B';
                  let memLeak = '0%';
                  let comp = 'O(1)';
                  let carbon = '0% الصفر الخلوي';
                  let code = '';
                  let targetName = 'تطبيق بالبيان';

                  if (selectedEduTemplate === 'android_azkar') {
                    title = 'تطبيق أذكار وتنبيهات الروضة أندرويد';
                    desc = 'تطبيق مخصص لعتاد الهواتف، يستخدم الهوية الزمردية ويحجز الأهواء المحلية ببيئة معزولة ونغمة تنبيه صباحية بدون سيرفر ومداواة فورية لتسرب الذاكرة.';
                    byteSize = '380B';
                    memLeak = '0% أمان خلوي';
                    comp = 'O(1) لـ Jetpack Compose';
                    carbon = '0% سحابي';
                    targetName = 'تطبيق أذكار الروضة أندرويد';
                    code = `مهمة رئيسية():
    اطبع("🕌 بدء تحضير تطبيق الروضة والتعليم للهاتف...")
    أندرويد.صناعة_تطبيق("com.bayan.azkar", "أذكار الروضة المباركة")
    أندرويد.لوح_الألوان("زمردي_فاخر")
    أندرويد.إضافة_واجهة("منصة_الأدعية")
    
    // التطهير الخلوي لتجنب استنزاف الرام والبطارية بالخلفية
    أندرويد.تنظيف_ذاكرة_تلقائي()
    
    أندرويد.عنوان_رئيسي("🕋 الأذكار اليومية للمسلم")
    أندرويد.نص("أذكار_الصباح"، "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (١٠٠ مرة)")
    أندرويد.زر("تشغيل_تنبيه"، "تفعيل المنبه اللمسي")

    تعلم.عند_النقر("تشغيل_تنبيه"):
        أندرويد.اهتزاز_لمسي("نقرة_خفيفة")
        نغمة.تشغيل_مسار("E4", "4n")
        أندرويد.رسالة_منبثقة("📿 تم تهيئة التنبيه اليومي الموقظ بسلام وتحصين!")
    نهاية

    أندرويد.بناء_APK()
نهاية`;
                  } else if (selectedEduTemplate === 'quantum_hadamard') {
                    title = 'خوارزمية قياس التشابك الكمي وهادامارد';
                    desc = 'تمثيل لغوي فصيح للالتفاف والتشابك التراكبي للكيوبيتات، لحساب المتواترات المعقدة دفعة واحدة وتخطي حلقات الدوران المستهلكة لعتاد الهواتف.';
                    byteSize = '290B';
                    memLeak = '0% عتادي للكيوبيت';
                    comp = 'O(1) تراكبي كامل';
                    carbon = '0% كربون';
                    targetName = 'محاكي الحوسبة الكمية';
                    code = `مهمة رئيسية():
    جهاز.تهيئة_الجهاز("ويب_كمي")
    اطبع("⚛️ محاكاة التشابك الاقتراني للكيوبيتات...")
    
    // حيازة معالجات الكيوبيتس
    عرف ك_رئيسي = كمومية.كيوبيت()
    عرف ك_تابع = كمومية.كيوبيت()
    
    // إدخال أول معالج في تراكب الحالات المتوازية
    كمومية.هادامارد(ك_رئيسي)
    
    // ربط ارتباطي كمي فوري
    كمومية.تشابك(ك_رئيسي، ك_تابع)
    
    // رصد وقياس النواتج اللحظية لوأد الأعباء الزمنية
    عرف رصد_رئيسي = كمومية.قياس(ك_رئيسي)
    عرف رصد_تابع = كمومية.قياس(ك_تابع)
    
    اطبع("رصد القياس النهائي المتناغم:")
    اطبع(رصد_رئيسي)
    اطبع(رصد_تابع)
نهاية`;
                  } else if (selectedEduTemplate === 'neural_evolutionary') {
                    title = 'نموذج شبكة عصبية و تدريب تطوري جيني';
                    desc = 'بناء الخلايا العصبية الحسابية وتغذيتها ذاتياً بالتعلم التطوري الجيني، لتوقع أحوال الإنتاج ورطوبة السوائل والتربة محلياً بذكاء خالص.';
                    byteSize = '310B';
                    memLeak = '0%';
                    comp = 'O(E * G) لعهود التناسل';
                    carbon = 'عزل انبعاثات محلي';
                    targetName = 'نموذج شبكة عصبية الذكاء';
                    code = `مهمة رئيسية():
    جهاز.تهيئة_الجهاز("معدات_ذكية")
    اطبع("🧬 غرس الشبكة العصبية الذوقية والتكيف التلقائي...")
    
    // إنشاء نموذج شبكة عصبية بـ ٤ طبقات مدخلات ومخرجات مدمجة
    عرف نموذج_الطقس = عصبية.إنشاء_نموذج(٤)
    
    // إجراء التدريب الكفاءاتي الجيني فوري محلياً دون إجهاد لـ ٣ عهود
    عصبية.تدريب_تطوري(نموذج_الطقس، ٣)
    
    // توقع الحالات المستقبلية لنمو التربة والرطوبة
    عرف توقع_الري = عصبية.توقع(نموذج_الطقس, "رطوبة_عالية")
    
    اطبع("📝 حالة توقع ري المزروعات التلقائي بالبيان:")
    اطبع(توقع_الري)
نهاية`;
                  } else if (selectedEduTemplate === 'media_experience') {
                    title = 'مشغل ميديا وصوتيات متفاعلة بـ BayanMedia';
                    desc = 'تشغيل الصور التوليدية وحقن المقطوعات العزفية التخليقية باستخدام التفاعل ثنائي الاتجاه الموطن بالبيان.';
                    byteSize = '420B';
                    memLeak = '0% عزل الذاكرة';
                    comp = 'O(1) ميديا فوري';
                    carbon = '0% طاقة';
                    targetName = 'منظومة الميديا التفاعلية';
                    code = `مهمة رئيسية():
    أندرويد.صناعة_تطبيق("com.bayan.media", "رواق الميديا التفاعلية")
    أندرويد.لوح_الألوان("ذهبي_ملكي")
    أندرويد.إضافة_واجهة("الرواق")
    
    أندرويد.عنوان_رئيسي("🎨 رواق البيان الفني والموسيقي")
    أندرويد.نص("مقدمة"، "شاهد وعزف النغمات التخليقية فورا")
    
    // استخدام محرك الميديا الفني لعرض الهوية البصرية الرسمية
    وسائط.صورة("ملصق_فني"، "https://images.unsplash.com/photo-1451187580459-43490279c0fa"، "المجرة التكنولوجية")
    
    أندرويد.زر("عزف_البرق"، "🎹 اعزف مقطوعة الأمل")

    تعلم.عند_النقر("عزف_البرق"):
        // توليد رنات تخليقية بنقرة واحدة
        نغمة.تشغيل_مسار("C4", "8n")
        نغمة.تشغيل_مسار("G4", "8n")
        أندرويد.رسالة_منبثقة("✨ تم عزف النبرات التخليقية بنجاح!")
    نهاية

    أندرويد.بناء_APK()
نهاية`;
                  } else {
                    title = 'صنف المواريث والبرمجة الكائنية OOP';
                    desc = 'صياغة الكيانات، الدوال البنائية للخصائص الكوشرة، المواريث الوظيفية، والتمرير الفصيح للمعطيات ذاتيا.';
                    byteSize = '350B';
                    memLeak = '0% حماية تجميع';
                    comp = 'O(1)';
                    carbon = '0% فاقد حراري';
                    targetName = 'الكيانات البرمجية OOP';
                    code = `صنف موظف:
    بناء(الاسم، الرتبة، المعاش):
        هذا.الاسم = الاسم
        هذا.الرتبة = الرتبة
        هذا.المعاش = المعاش
    نهاية

    مهمة تفاصيل():
        اطبع("الاسم الكريم للموظف:")
        اطبع(هذا.الاسم)
        اطبع("المرتبة الفنية:")
        اطبع(هذا.الرتبة)
        اطبع("المعاش الشهري المستحق:")
        اطبع(هذا.المعاش)
    نهاية
نهاية

صنف مهندس يرث موظف:
    بناء(الاسم، الرتبة، المعاش، التخصص):
        هذا.الاسم = الاسم
        هذا.الرتبة = الرتبة
        هذا.المعاش = المعاش
        هذا.التخصص = التخصص
    نهاية

    مهمة تفاصيل_كاملة():
        هذا.تفاصيل()
        اطبع("تخصص المهندس البرمجي:")
        اطبع(هذا.التخصص)
    نهاية
نهاية

مهمة رئيسية():
    عرف مهندس_أول = جديد مهندس("يزيد الفصيح"، "خبير أول"، ٨٥٠٠، "الحوسبة الكمومية")
    مهندس_أول.تفاصيل_كاملة()
نهاية`;
                  }

                  const handleTemplateCopy = () => {
                    navigator.clipboard.writeText(code);
                    setEduCopied(true);
                    setTimeout(() => setEduCopied(false), 2000);
                  };

                  const handleTemplateLoad = () => {
                    // Update main options
                    setOptions({
                      ...options,
                      appName: targetName,
                      description: desc,
                    });
                    setGeneratedCode(code);
                    setActiveSubTab('generator');
                  };

                  return (
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-850 space-y-4 animate-in fade-in duration-300">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded bg-indigo-500 animate-ping shrink-0" />
                            <span>{title}</span>
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            {desc}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Copy code button in education */}
                          <button
                            onClick={handleTemplateCopy}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center gap-1"
                          >
                            {eduCopied ? (
                              <>
                                <Check size={11} className="text-emerald-400" />
                                <span className="text-emerald-400">تم النسخ!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={11} />
                                <span>نسخ المعيار</span>
                              </>
                            )}
                          </button>

                          {/* Load and deploy button */}
                          <button
                            onClick={handleTemplateLoad}
                            className="text-[10px] font-extrabold px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-550 hover:from-sky-400 hover:to-indigo-400 text-slate-950 flex items-center gap-1 font-sans"
                          >
                            <Wand2 size={11} />
                            <span>تطبيق بمولد التطبيقات ⚡</span>
                          </button>
                        </div>
                      </div>

                      {/* Performance Indicators Metrics Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-900 text-center">
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] text-slate-500 block">وزن الشفرة الصافي:</span>
                          <span className="text-[10px] text-slate-300 font-bold font-mono block">{byteSize}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] text-slate-500 block">تسريب ذواكر الرام:</span>
                          <span className="text-[10px] text-emerald-400 font-bold block">{memLeak}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] text-slate-500 block">التعقيد الحسابي:</span>
                          <span className="text-[10px] text-sky-400 font-bold font-mono block">{comp}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] text-slate-500 block">البصمة الحرارية الكربونية:</span>
                          <span className="text-[10px] text-purple-400 font-bold block">{carbon}</span>
                        </div>
                      </div>

                      {/* Pure Code block */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 relative overflow-hidden">
                        <div className="absolute left-3 top-3 text-[8.5px] text-slate-600 font-bold font-sans">BYN CODE</div>
                        <pre className="text-[10px] text-slate-200 leading-relaxed font-mono whitespace-pre overflow-x-auto text-right select-all" dir="ltr">
                          {code}
                        </pre>
                      </div>

                    </div>
                  );
                })()}

              </div>

              {/* Right Column: Keyword Dictionary Cheat sheet */}
              <div className="w-full lg:w-[35%] space-y-4">
                <h3 className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white to-slate-400 flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-400" />
                  <span>معجم البيان والكيانات البرمجية:</span>
                </h3>

                <div className="bg-slate-900/40 border border-slate-900 rounded-xl divide-y divide-slate-900 overflow-hidden">
                  {[
                    { arabic: 'مهمة / مهمة رئيسية()', english: 'Function / Main function definition', desc: 'دوال التشغيل والتمرير البنيوي للبارامترات.' },
                    { arabic: 'عرف [اسم المتغير]', english: 'Declaration / let variable context', desc: 'لحجز معطيات المتغيرات في الرام الآمنة.' },
                    { arabic: 'صنف / يرث / جديد', english: 'Class OOP / Inheritance setup', desc: 'كائنات وخصائص البرمجة الكائنية الموحدة.' },
                    { arabic: 'لو / وإلا لو / وإلا', english: 'If / Else if / Else condition', desc: 'المقارنات والقرارات المنطقية بالتطبيق.' },
                    { arabic: 'كرر (عدد) مرات', english: 'Fixed Loop iteration execution', desc: 'لحلقات التكرار محددة المرات الآمنة عتادياً.' },
                    { arabic: 'لكل [متغير] في المجال(١، ٩)', english: 'For each variable in range loop', desc: 'التنقل في مجالات الأعداد والبيانات.' },
                    { arabic: 'حاول / التقط (الخطأ)', english: 'Try / Catch exception handling', desc: 'لاقتناص ومعالجة ثغرات واستثناءات العتاد.' },
                    { arabic: 'أندرويد.صناعة_تطبيق()', english: 'Native Android compilation setup', desc: 'التجميع وبناء تطبيقات APK خفيفة.' },
                    { arabic: 'أندرويد.تنظيف_ذاكرة_تلقائي()', english: '0% Memory leak Cellular trash-collector', desc: 'تطهير الذاكرة ومنع التداخل والتعثر.' },
                    { arabic: 'كمومية.سجل_متشابك()', english: 'Quantum communication matrix', desc: 'بناء الحساب والتوازي التراكبي لسرعة O(1).' }
                  ].map((word, idx) => (
                    <div key={idx} className="p-3.5 space-y-1 hover:bg-slate-900/30 transition-all">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[11px] font-extrabold text-emerald-450 font-mono">{word.arabic}</span>
                        <span className="text-[8.5px] text-slate-550 font-sans">{word.english}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 text-right leading-relaxed">{word.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Training and certification alert */}
                <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-right space-y-1">
                  <h4 className="text-[11px] font-bold text-emerald-400">💡 شهادة الاعتماد السيادي الفصيح:</h4>
                  <p className="text-[9.5px] text-slate-400 leading-relaxed">
                    تمت صياغة هذا الدليل والتدريب التفاعلي بنبض عام ٢٠٢٦ لتدريب طلاب العلم والمهندسين العرب على البرمجة السيادية دون الحاجة للاستعانة بلغات العجم.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};
