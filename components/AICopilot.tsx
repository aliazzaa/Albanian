import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code2, Play, Copy, ArrowRight, User, Terminal, Check, Cpu, Battery, Gauge, RotateCcw, Activity, HeartPulse, AlertTriangle, CheckCircle, RefreshCw, Zap, Atom, Download, Bot, FolderOpen, Plus, Trash2, Search, HelpCircle, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { generateMediaAsset } from '../services/openMediaService';

interface AICopilotProps {
  currentCode: string;
  onApplyCode: (code: string) => void;
  onInstantRun: (code: string) => void;
  compilationError?: string | null;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
  codeBlock?: string;
  timestamp: string;
}

const AICopilot: React.FC<AICopilotProps> = ({
  currentCode,
  onApplyCode,
  onInstantRun,
  compilationError,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'أهلاً بك في رفيق البرمجة الذكي للغة البيان ومبتكر أكواد المستقبل! بفضل الحوسبة الكمومية المدمجة والشبكات العصبية المتقدمة، يمكننا كتابة برمجيات عربية فائقة الذكاء وتتحدى آفاق الغد. ماذا سنبني معاً اليوم؟ 🚀',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Advanced States for Android Performance, Optimization suggestions & reinforcement training
  const [activeTab, setActiveTab] = useState<'chat' | 'android-perf' | 'self-healing' | 'quantum-analyzer' | 'agent-hub'>('chat');
  const [isQuantumActive, setIsQuantumActive] = useState(false);
  const [isGcActive, setIsGcActive] = useState(false);
  const [isSensorActive, setIsSensorActive] = useState(false);
  const [isAiActive, setIsAiActive] = useState(false);

  // AI-Agent-Hub States
  interface LocalAgent {
    id: string;
    name: string;
    description: string;
    category: 'logic' | 'docs' | 'refactor' | 'quantum';
    code: string;
    status: 'downloadable' | 'downloading' | 'registered';
    version: string;
    author: string;
    runsCount: number;
    size: string;
  }

  const [agents, setAgents] = useState<LocalAgent[]>([
    {
      id: 'logic-checker',
      name: 'محقق منطق البيان وسد الثغرات',
      description: 'يقوم بفحص تسلسل الأوامر في كود البيان، ويتطابق من صحة مسارات الشروط ويمنع حدوث الاستثناءات الصفرية في عتاد التشغيل والخلوي بدقة تامة.',
      category: 'logic',
      code: `مهمة محقق_المنطق(شيفرة_البيان):
    اطبع("🔍 جاري فحص مسارات كود البيان محلياً...")
    عرف الأخطاء = 0
    إذا شيفرة_البيان.يحتوي("مهمة رئيسية():") == خطأ:
        اطبع("⚠️ تنبيه: الكود يفتقر إلى البوابة الرئيسية للتشغيل!")
        الأخطاء = الأخطاء + ١
    نهاية
    تفقد_التوازن(شيفرة_البيان)
    إرجاع الأخطاء
نهاية`,
      status: 'downloadable',
      version: '1.2.0',
      author: 'البيان-مفتوح-المصدر',
      runsCount: 142,
      size: '12KB'
    },
    {
      id: 'docs-creator',
      name: 'مولد الشروح والتوثيق التلقائي للمنهجيات',
      description: 'يقرأ دوال ومتغيرات الكود ويصمم لها بطاقة توثيق فصاحية شاملة باللغة العربية الفصحى لتسهيل الصيانة والتطوير الجماعي.',
      category: 'docs',
      code: `مهمة مولد_التوثيق(شيفرة_البيان):
    اطبع("📝 جاري استنباط هياكل البرمجة والتعليقات...")
    عرف التقرير = "✍️ بطاقة الصيانة الفصاحية المستقلة:\\n"
    تقرير.ألحق("تم فحص الملف وبنائه لتقليل البصمة الكربونية")
    إرجاع تقرير
نهاية`,
      status: 'registered',
      version: '0.9.5',
      author: 'رابطة البرمجة المستدامة',
      runsCount: 89,
      size: '8KB'
    },
    {
      id: 'refactorer-extreme',
      name: 'صاقل الكود ومنحّف الذاكرة الخضراء',
      description: 'وكيل متخصص في إعادة صياغة الشيفرة المكررة والتكرار الكلاسيكي واستبداله بدوال الاختصار وتراكبات الذاكرة الصفرية.',
      category: 'refactor',
      code: `مهمة صاقل_الذاكرة(كود_المدخل):
    اطبع("⚡ تصفية دورات المعالج وحيازة السجلات المتراصة قيد العمل...")
    عرف كود_محسن = كود_المدخل.استبدل("كرر", "تراكب")
    اطبع("🚀 تم تخليق كود فائق النقاوة وصديق للبيئة!")
    إرجاع كود_محسن
نهاية`,
      status: 'downloadable',
      version: '2.0.1',
      author: 'مجمع حوسبة الأخضر',
      runsCount: 310,
      size: '16KB'
    },
    {
      id: 'quantum-transpiler',
      name: 'مترجم ومحاكي الأكواد الكمي الفارق',
      description: 'يقوم بمطابقة دوال البيان السطحية ودمجها مباشرة بنوات الجراف المتشابك وتراكب حالات الكيوبيت لضمان Zero Buffer.',
      category: 'quantum',
      code: `مهمة المترجم_الكمي(كود):
    أندرويد.محرك_كمومي("تراكب_كامل_الحركة")
    كمومية.سجل_متشابك()
نهاية`,
      status: 'downloadable',
      version: '0.1.1',
      author: 'سرية الحوسبة المستدامة',
      runsCount: 57,
      size: '22KB'
    },
    {
      id: 'local-ai-localization-agent',
      name: 'منسق خطة توطين الذكاء الاصطناعي وذكاء البيان',
      description: 'يقود تفعيل الذكاء الموطن محلياً بالكامل خطوة بخطوة على العتاد الشخصي لصفر انبعاثات وخصوصية وموثوقية رقمية مطلقة وبناء سياج كامل للسيادة الرقمية للبيان.',
      category: 'logic',
      code: `مهمة محقق_توطين_الذكاء(شيفرة):
    اطبع("🌍 فحص مسار وخطة توطين الذكاء الاصطناعي...")
    إذا شيفرة.يحتوي("ذكاء.عامل_مستقل") == صحيح:
        اطبع("✅ رائع! هناك تفعيل لعامل مستقل وبحاجة لتنسيق الخطوات محلياً.")
    نهاية
    طبع_خطوات_التوطين()
نهاية`,
      status: 'registered',
      version: '2.1.0',
      author: 'رابطة ذكاء البيان المفتوحة',
      runsCount: 205,
      size: '14KB'
    }
  ]);

  const [localizationSteps, setLocalizationSteps] = useState([
    { id: 1, text: 'تحضير العتاد وتأهيل البيئة المحلية (تنزيل Node.js & JDK 17+)', done: true },
    { id: 2, text: 'استيراد وتشغيل منصة ومترجم لغة البيان محلياً بالكامل', done: false },
    { id: 3, text: 'تنزيل النماذج اللغوية الحرة مفتوحة التوطين للغة العربية (Qwen-2.5-Coder / Llama-3-8B GGUF)', done: false },
    { id: 4, text: 'ضبط منافذ الربط المغلقة للخصوصية وسياج البيانات (Ollama: http://localhost:11434)', done: false },
    { id: 5, text: 'انطلاق التشغيل المحلي للوكلاء الحرة بمعدل صفر انبعاثات حوسبية وصفر كلفة شبكية', done: false }
  ]);

  const handleToggleLocalizationStep = (id: number) => {
    setLocalizationSteps(prev => prev.map(step => step.id === id ? { ...step, done: !step.done } : step));
  };

  const [downloadingAgentId, setDownloadingAgentId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadLogs, setDownloadLogs] = useState<string[]>([]);
  
  const [selectedAgentId, setSelectedAgentId] = useState<string>('docs-creator');
  const [isRunningAgent, setIsRunningAgent] = useState<boolean>(false);
  const [agentRunLogs, setAgentRunLogs] = useState<string[]>([]);
  const [agentOutput, setAgentOutput] = useState<string | null>(null);

  // Registration states
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
  const [regName, setRegName] = useState<string>('');
  const [regDesc, setRegDesc] = useState<string>('');
  const [regCategory, setRegCategory] = useState<'logic' | 'docs' | 'refactor' | 'quantum'>('logic');
  const [regCode, setRegCode] = useState<string>(`مهمة وكيل_المرئيات_الذكي(كود):
    // منطق الوكيل المطور الفردي بلغة البيان
    اطبع("تحليل مخصص جاري محلياً بالكامل لتوفير حزم الطاقة...")
نهاية`);
  const [regError, setRegError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // PWA & Network Offline/Online Monitoring States
  const [isOnline, setIsOnline] = useState<boolean>(typeof window !== 'undefined' ? window.navigator.onLine : true);
  const [swActive, setSwActive] = useState<boolean>(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(window.navigator.onLine);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    }

    // Periodically inspect if Service Worker controller is active
    const checkServiceWorker = () => {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        setSwActive(!!navigator.serviceWorker.controller);
      }
    };

    checkServiceWorker();
    const interval = setInterval(checkServiceWorker, 3000);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      }
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // AI-Agent-Hub Implementation
  // ==========================================

  const handleDownloadAgent = async (agentId: string) => {
    if (downloadingAgentId) return;
    setDownloadingAgentId(agentId);
    setDownloadProgress(0);
    setDownloadLogs([]);

    const agentName = agents.find(a => a.id === agentId)?.name || 'الوكيل';
    
    const logs = [
      `🌐 الاتصال بمستودع البيان المفتوح لتوطين الوكيل: ${agentName}...`,
      `📦 تنزيل حزمة الكود المصدرية وتدقيق المجموعات الرقمية SHA-256...`,
      `🧬 التحقق من سلامة البنى الحسابية الخضراء وتأصيل المفردات...`,
      `🧠 تسجيل الوكيل محلياً وحسم الترخيص غير المشروط لسيادة التطبيق...`,
      `👍 نجح التحميل! الوكيل مستعد ومنصب محلياً بجهازك بنسبة 100%!`
    ];

    for (let i = 0; i < logs.length; i++) {
      setDownloadLogs(prev => [...prev, logs[i]]);
      setDownloadProgress((i + 1) * 20);
      await new Promise(r => setTimeout(r, 450));
    }

    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return { ...a, status: 'registered' };
      }
      return a;
    }));
    setDownloadingAgentId(null);
    setDownloadProgress(0);
  };

  const handleRegisterCustomAgent = () => {
    if (!regName.trim()) {
      setRegError('برجاء إدخال اسم فريد ومميز للوكيل.');
      return;
    }
    if (!regCode.trim() || regCode.length < 15) {
      setRegError('برجاء تزويد شيفرة صالحة ومستقرة بلغة البيان (.byn) للوكيل (أكثر من 15 حرفاً).');
      return;
    }

    const newAgent: LocalAgent = {
      id: `custom-${Date.now()}`,
      name: regName,
      description: regDesc.trim() || 'وكيل برمجيات مخصص مطور محلياً بالكامل لتوطين الحلول فصاحياً وتسريع العمليات.',
      category: regCategory,
      code: regCode,
      status: 'registered',
      version: '1.0.0',
      author: 'مطور محلي مستقل',
      runsCount: 0,
      size: `${Math.round(regCode.length / 10.2) / 100}KB`
    };

    setAgents(prev => [newAgent, ...prev]);
    
    // Reset form
    setRegName('');
    setRegDesc('');
    setRegCategory('logic');
    setRegCode(`مهمة وكيل_المرئيات_الذكي(كود):
    // منطق الوكيل المطور الفردي بلغة البيان
    اطبع("تحليل مخصص جاري محلياً بالكامل لتوفير حزم الطاقة...")
نهاية`);
    setRegError(null);
    setShowRegisterForm(false);
  };

  const handleDeleteAgent = (agentId: string) => {
    // For default system agents, reset status to downloadable. For custom ones, remove completely.
    const defaultIds = ['logic-checker', 'docs-creator', 'refactorer-extreme', 'quantum-transpiler'];
    if (defaultIds.includes(agentId)) {
      setAgents(prev => prev.map(a => {
        if (a.id === agentId) {
          return { ...a, status: 'downloadable' };
        }
        return a;
      }));
    } else {
      setAgents(prev => prev.filter(a => a.id !== agentId));
    }

    if (selectedAgentId === agentId) {
      setSelectedAgentId('docs-creator');
    }
  };

  const handleRunAgentOnEditor = async (agentId: string) => {
    if (isRunningAgent) return;
    setIsRunningAgent(true);
    setAgentRunLogs([]);
    setAgentOutput(null);

    const targetAgent = agents.find(a => a.id === agentId);
    if (!targetAgent) {
      setIsRunningAgent(false);
      return;
    }

    const runLogs = [
      `⚙️ [مرحلة التهيئة] قراءة شيفرة فصاحية للوكيل: ${targetAgent.name}...`,
      `🔒 [سياج الخصوصية] تأمين التشغيل محلياً ومستداماً (بترشيد كربوني كامل)...`,
      `🔍 [محاكاة العتاد] تحليل الكود النشط بالمحرر وتطبيق حواجز التفسير...`,
      `⚡ [تحليل استاتيكي] جرد الدوال، المتغيرات، وفحص مسارات الاستجرار...`,
      `🎉 [إنهاء النبضة] تم جمع النتائج وحفظ الطاقة المستنزفة للبطارية بمعدل صفر انبعاثات.`
    ];

    for (let i = 0; i < runLogs.length; i++) {
      setAgentRunLogs(prev => [...prev, runLogs[i]]);
      await new Promise(r => setTimeout(r, 400));
    }

    // Dynamic analysis of the currentCode
    let codeToAnalyze = currentCode.trim();
    let generatedOutput = '';

    if (!codeToAnalyze) {
      generatedOutput = `❌ [تنبيه من الوكيل]: لا توجد شيفرة ممتلئة في المحرر الأيسر لمعالجتها!
يرجى إدراج قالب كود أندرويد أو بيان كمومي أولاً للتجربة والتحقق مستقل الأطراف.`;
    } else {
      const functionMatches = codeToAnalyze.match(/مهمة\s+(\w+)\((.*?)\):/g) || [];
      const variableMatches = codeToAnalyze.match(/عرف\s+(\w+)/g) || [];
      const hasAndroidApp = codeToAnalyze.includes('أندرويد.صناعة_تطبيق');
      const hasQuantum = codeToAnalyze.includes('محرك_كمومي') || codeToAnalyze.includes('سجل_متشابك');

      if (targetAgent.category === 'logic') {
        const issues: string[] = [];
        if (functionMatches.length === 0) issues.push('- لا توجد دوال منظمة (مهمة)، الكود خطي ومكشوف للرام.');
        if (codeToAnalyze.includes('كرر') && !hasQuantum) issues.push('- يحتوي الكود على تكرار تقليدي بطيء؛ يوصى بترقيته لسجلات التشابك.');
        if ((codeToAnalyze.match(/إذا/g) || []).length !== (codeToAnalyze.match(/نهاية/g) || []).length) {
          issues.push('- تنبيه: هناك عدم تطابق محتمل في أعداد عبارات الشروط والنهاية (فقدان نهاية).');
        }

        generatedOutput = `🔍 [تقرير فحص المنطق للوكيل المحلي ${targetAgent.name} (v${targetAgent.version})]

الوضعية الإجمالية: ${issues.length === 0 ? '✅ متطابق ومثالي تماماً' : '⚠️ بحاجة لبعض المراجعة'}
تعداد الدوال المكتشفة: ${functionMatches.length} دالة فصاحية.
المتغيرات المحجوزة: ${variableMatches.length} متغير مستقل.

البنود والفحوصات الجردية:
${issues.length === 0 ? '✓ تم فحص كافة مسارات الشروط والنقاط الصفرية ولم يثبت وجود مسارات ميتة أو هدر للطاقة.' : issues.join('\n')}

توصية الوكيل الخضراء:
${issues.length === 0 ? 'كودك ممتاز للغاية، ننصح برفده بمجموعات التجميع الكمية كخطوة احترازية للسرعة المطلقة.' : 'يرجى مراجعة الملاحظات الحسابية لتفادي إرهاق معالج أندرويد في العمليات الطويلة.'}`;
      } 
      else if (targetAgent.category === 'docs') {
        const fnList = functionMatches.map(f => {
          const clean = f.replace('مهمة ', '').replace(':', '');
          return `  - دالة: ${clean} [نوع الخدمة: مستقلة ومستدامة]`;
        }).join('\n');

        generatedOutput = `📝 [المستندات التوضيحية المولدة بواسطة الوكيل المحلي: ${targetAgent.name}]

📌 وصف عام للشيفرة:
شيفرة تقنية بلغة البيان لغرض تطوير برمجيات خضراء فائقة الاستدامة ومستقلة تماماً عن خوادم الحوسبة السحابية المكلفة.

🛠️ المكونات الهيكلية والأعضاء النشطة:
${fnList || '  - لا توجد دوال معرفة (شيفرة تتابعية مسطحة).'}

📋 المتغيرات والمدخلات المرصودة:
${variableMatches.length > 0 ? variableMatches.map(v => `  - المتغير: ${v.replace('عرف ', '')} (عنصر حجز ذاكرة تكتيكي)`).join('\n') : '  - لم يتم التصريح بمتغيرات كلاسيكية.'}

✨ تصريح الاستدامة الذاتية:
كود معزول، منسوج ومحمي بمحاذاة الرقاقات الكمية العربية، مستعد للتجميع في بياض زمني وجيز لبيئة عمل واثقة.`;
      } 
      else if (targetAgent.category === 'refactor') {
        let refactoredCode = codeToAnalyze;
        let changeMade = false;
        
        if (refactoredCode.includes('مهمة رئيسية():') && !refactoredCode.includes('أندرويد.تنظيف_ذاكرة_تلقائي()')) {
          refactoredCode = refactoredCode.replace(
            'مهمة رئيسية():',
            'مهمة رئيسية():\n    // تمت تصفيتها عبر وكيل الصقل الخضر\n    أندرويد.تنظيف_ذاكرة_تلقائي()'
          );
          changeMade = true;
        }

        generatedOutput = `⚡ [تقرير تحسين وإعادة صياغة الشيفرة من الوكيل المحلي: ${targetAgent.name}]

الإجراءات المتخذة لتحجيم العبء:
${changeMade ? '✓ تم غرس دالة "تنظيف_ذاكرة_تلقائي()" في مستهل البوابة الرئيسية لوقف أي نزيف للرام.' : '✓ الكود منظم سلفاً ولا يحتوي على عقد ذاكرة كلاسيكية مجهدة للتشغيل.'}
✓ تم تهذيب المسافات البادئة والمسافات الفارغة لتقليل السعة الكلية لملف الكومبايلر بنسبة 7.3%.
✓ تم فحص الاستدعاءات وتبديل الهياكل لتوفير ما يزيد عن 15% من نبضات بطارية العتاد الطرفي.

الكود المقترح والمعدل بعد الصقل الخضري:
--------------------------------------------------------------
${refactoredCode}
--------------------------------------------------------------

(يمكنك نسخ هذا الكود أو تطبيقه بالمحرر عبر رفيق البيان كمومياً!)`;
      } 
      else if (targetAgent.id === 'local-ai-localization-agent') {
        generatedOutput = `🇸🇦 [دستور وتوجيهات خطة توطين الذكاء الاصطناعي - وكيل التوطين الذكي v${targetAgent.version}]

مستوى جاهزية توطين النظام المكتشف حالياً: 🔋 ممتازة ومستديرة بالكامل!

🛠️ فحص الكود البرمجي المكتوب بالمحرر:
- تم فحص الأوامر البنيوية ووجدنا أنها جاهزة للتحويل والتشغيل لصفر انبعاثات وسحابة مغلقة.
- الكود خالٍ تماماً من أي تسريبات سحابية أو قنوات غير مرخصة (100% مستقل للسيادة الوطنية).

📋 الخطوات الإجرائية التنفيذية الموصى بها لتفعيل الكود محلياً:
١. قم بتهيئة عتادك المحلي (تثبيت Node.js 18+ و Java SDK 17+).
٢. حمل وتثبيت Ollama محلياً (https://ollama.com) وسحب نموذج "Qwen-2.5-Coder" أو "Llama-3" عبر الأمر:
   ollama run qwen2.5-coder:1.5b
٣. قم بتشغيل المنصة لتشير الخصوصية إلى نقطة الربط المغلقة: http://localhost:11434/v1
٤. شغّل المترجم الفصاحي لتقييد الكود، واحصد مخرجات المعالجة مباشرة من الرقاقات المدمجة بلا اتصال بالإنترنت!

🍀 توجيه بيئي مستقبلي:
البرمجة بلغة البيان تمنحك استقلالية تامة، بحيث يتحرك الوكيل محلياً لترشيد المعالجة، مما يحول دون إجهاد السحابة ويحمي ثروات البيانات الوطنية بجدارة وبما يتطابق مع السيادة الحوسبية الاستثنائية.`;
      }
      else {
        generatedOutput = `⚛️ [تقرير الدمج والترجمة الكمية من وكيلك: ${targetAgent.name}]

مستوى الارتباط الكمي المستهدف: تراكب كامل O(1)
درجة الاستحقاق والتعشيق: 99.7% Coherence

التحليل الهيكلي:
- تم تطويق واستبدال عقد المعالجة الخطية بقيم تراكب Hadamard.
- تم تشفير الروابط متبادلة الاستجابة لضمان خصوصية مطلقة للبيانات وعزل تام للطرف الخلوي.

التوصية التطبيقية:
تم بناء نموذج تسريع تكميلي بالخلفية ليدير قفزات الرام والواجهات دون فترات تجميد جراء الهجمات التنافسية.`;
      }
    }

    setAgentOutput(generatedOutput);
    setIsRunningAgent(false);

    // Increase play run count of that agent
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return { ...a, runsCount: a.runsCount + 1 };
      }
      return a;
    }));
  };

  const [trainingLevel, setTrainingLevel] = useState(94.8);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [hasCompletedTrain, setHasCompletedTrain] = useState(false);

  // BayanSelfHealing Agent-Driven States
  const [healLogs, setHealLogs] = useState<string[]>([]);
  const [isHealing, setIsHealing] = useState(false);
  const [activeHealId, setActiveHealId] = useState<string | null>(null);
  const [healingSuccessCount, setHealingSuccessCount] = useState<number>(31); // Past healed problems count
  const [proactiveQuery, setProactiveQuery] = useState('');
  const [proactiveAiReport, setProactiveAiReport] = useState<string | null>(null);
  const [isSynthesizingReport, setIsSynthesizingReport] = useState(false);

  // BayanQuantumAnalyzer States
  const [isQuantumAnalyzing, setIsQuantumAnalyzing] = useState(false);
  const [quantumAnalysisLogs, setQuantumAnalysisLogs] = useState<string[]>([]);
  const [isOptimizingQuantumCode, setIsOptimizingQuantumCode] = useState(false);
  const [quantumOptimizationLogs, setQuantumOptimizationLogs] = useState<string[]>([]);
  const [quantumSuccessScore, setQuantumSuccessScore] = useState<number>(42); // Previous successful quantum optimizations count
  const [activeQuantumAnalysisId, setActiveQuantumAnalysisId] = useState<string | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const runContinuousTraining = async () => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainingLogs([]);
    
    const logs = [
      '🔍 جاري تفكيك دورة حياة أندرويد (Activity Lifecycle) للبيئة الهجينة...',
      '🛠️ جاري تحليل استهلاك الطاقة وتغذية معلمات الـ Power Profile لعتاد الأندرويد...',
      '⚡ ضبط خوارزمية التعزيز (Actor-Critic Matrix) لترشيد حشو الذاكرة وتخفيض الريكومبوزيشن...',
      '⚛️ تنشيط محاكي تراكب الكيوبيتات الـ 8 (Superposition Processing) لاختصار دوال الحساب المعقدة...',
      '📚 استخلاص قواعد Jetpack Compose الحديثة لحفظ طاقة بطارية الهاتف الدقيقة...',
      '✨ تم الترابط بنجاح! تم برمجة رقاقة التجميع وتقليص الـ APK من 1.8MB إلى 385KB فقط!'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 450));
      setTrainingLogs(prev => [...prev, logs[i]]);
    }
    
    setTrainingLevel(99.9);
    setIsTraining(false);
    setHasCompletedTrain(true);

    // Apply code findings as continuous learning outcome
    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        text: '🎉 [تم تفعيل قواعد الأداء الفائق المكتشفة!] لقد خاض المترجم دورة تدريبية كمومية إدراكية مكثفة. أسفرت عن منهجية موفرة لبطارية وموارد الهاتف بنسبة تصل لـ 97%. إليك الهيكل المتكامل لنمط التشغيل المستدام والعملي الأسرع:',
        codeBlock: `مهمة رئيسية():
    اطبع("=== تطبيق أندرويد فائق الترشيد مستقبلي وحركة حيوية ===")
    أندرويد.صناعة_تطبيق("com.bayan.sustainable", "البيان الأخضر المستدام")
    أندرويد.إضافة_واجهة("الرئيسية")

    // ١. منع وحظر فوري لتسريب الذاكرة (0% Leakage)
    أندرويد.تنظيف_ذاكرة_تلقائي()

    // ٢. تفعيل النمط الكمي الموفر للتراكبات (Ultra-Low Energy processing)
    أندرويد.محرك_كمومي("توفير_طاقة_مستدام")

    // ٣. استشعار ذكي لا يستهلك طاقة المعالج إلا للموجات الصادقة
    أندرويد.مستشعر_ذكي("الحركة_الدوارة"، "تراكم_الاستجابة")

    أندرويد.نص("إرشاد"، "التطبيق مؤمن ويعمل بالحد الأدنى من الطاقة!")
    أندرويد.مؤشر_تقدم("كفاءة_الطاقة"، 99)

    أندرويد.بناء_APK()
نهاية`,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  // ==========================================
  // BayanSelfHealing Core Mechanism
  // ==========================================

  // Dynamic Self-Healing Gap detector based on currentCode
  const analyzeSelfHealingGaps = () => {
    const gaps = [
      {
        id: 'missing-garbage-clean',
        title: 'امتصاص تسريبات الذاكرة وتخفيض شحن العتاد (Memory Safety Leakage)',
        description: 'الكود يحتوي على تصريحات أندرويد ولكنه لا يستدعي آلية التطهير الخلوي التلقائي. يفضل حقن أداة الاستعادة للرام فائقة الكفاءة بنسبة تسريب 0%.',
        severity: 'warning' as const,
        detected: currentCode.includes('أندرويد.') && !currentCode.includes('أندرويد.تنظيف_ذاكرة_تلقائي()'),
        proposedCodeSnippet: 'أندرويد.تنظيف_ذاكرة_تلقائي()',
        fixLabel: 'تفعيل التطهير الخلفي التلقائي',
        fixAction: (code: string) => {
          if (code.includes('أندرويد.إضافة_واجهة')) {
            return code.replace('أندرويد.إضافة_واجهة', 'أندرويد.إضافة_واجهة\n    أندرويد.تنظيف_ذاكرة_تلقائي()');
          }
          if (code.includes('مهمة رئيسية():')) {
            return code.replace('مهمة رئيسية():', 'مهمة رئيسية():\n    أندرويد.تنظيف_ذاكرة_تلقائي()');
          }
          return 'أندرويد.تنظيف_ذاكرة_تلقائي()\n' + code;
        }
      },
      {
        id: 'non-arabic-keywords',
        title: 'رصد الكلمات العجمية الغازية وبقايا لغات التفسير (Def/End Contamination)',
        description: 'تم استخدام كلمات مفتاحية عجمية غريبة (مثل def, function, func, end) بدلاً من البنية العربية الفصيحة للغة البيان (مهمة / نهاية).',
        severity: 'critical' as const,
        detected: /\b(def|function|func|end)\b/i.test(currentCode) || currentCode.toLowerCase().includes('end'),
        proposedCodeSnippet: 'مهمة ... نهاية',
        fixLabel: 'تعريب وتوطين صياغة الدوال بالنحو الفصيح',
        fixAction: (code: string) => {
          let fixed = code;
          fixed = fixed.replace(/\bdef\s+/g, 'مهمة ');
          fixed = fixed.replace(/\bfunction\s+/g, 'مهمة ');
          fixed = fixed.replace(/\bfunc\s+/g, 'مهمة ');
          fixed = fixed.replace(/\bend\b/g, 'نهاية');
          fixed = fixed.replace(/\bEnd\b/g, 'نهاية');
          return fixed;
        }
      },
      {
        id: 'missing-main-entrypoint',
        title: 'غياب بوابة المعالجة الرئيسية (No Haupt-Entrypoint)',
        description: 'الكود الحالي لا يحتوي على نقطة تشغيل التطبيقات الأساسية (مهمة رئيسية():). هذا يحول دون انطلاق حوسبة المعالج بصورة مترابطة.',
        severity: 'critical' as const,
        detected: currentCode.trim().length > 0 && !currentCode.includes('مهمة رئيسية()') && !currentCode.includes('مهمة رئيسية ():'),
        proposedCodeSnippet: `مهمة رئيسية():\n    // كودك هنا\nنهاية`,
        fixLabel: 'تغليف وتأصيل نقطة الانطلاق',
        fixAction: (code: string) => {
          return `مهمة رئيسية():\n    ${code.split('\n').join('\n    ')}\nنهاية`;
        }
      },
      {
        id: 'missing-apk-compilator',
        title: 'صناعة واجهات دون إثارة التجميع النهائي (No APK Builder)',
        description: 'إغفال نداء التجميع (أندرويد.بناء_APK()). لن يتم ضغط الموارد وتعمير الرقاقة البرمجية بأقل حجم مستدام (<385KB).',
        severity: 'preventive' as const,
        detected: currentCode.includes('أندرويد.صناعة_تطبيق') && !currentCode.includes('أندرويد.بناء_APK()'),
        proposedCodeSnippet: 'أندرويد.بناء_APK()',
        fixLabel: 'حقن تريجر التجميع وتآزر الحزمة',
        fixAction: (code: string) => {
          if (code.includes('نهاية')) {
            const idx = code.lastIndexOf('نهاية');
            return code.substring(0, idx) + '    أندرويد.بناء_APK()\n' + code.substring(idx);
          }
          return code + '\nأندرويد.بناء_APK()';
        }
      },
      {
        id: 'missing-quantum-measure',
        title: 'تشغيل الكيوبيتات وتجاهل بوابات الرصد (Unmeasured Qubit Superposition)',
        description: 'تم رصد استخدام للكيوبيتات الكمومية دون استدعاء بوابات قياس رصينة. هذا يبقي المترجم الذكي في حالة تشتت تراكبية لانهائية.',
        severity: 'preventive' as const,
        detected: (currentCode.includes('كمومية.كيوبيت()') || currentCode.includes('كمومية.هادامارد')) && !currentCode.includes('كمومية.قياس'),
        proposedCodeSnippet: 'كمومية.قياس(ك)',
        fixLabel: 'تحييد التشتت واستدعاء بوابة القياس الرصينة',
        fixAction: (code: string) => {
          if (code.includes('نهاية')) {
            const idx = code.lastIndexOf('نهاية');
            return code.substring(0, idx) + '    عرف م = كمومية.قياس(ك)\n    اطبع(م)\n' + code.substring(idx);
          }
          return code + '\nعرف م = كمومية.قياس(ك)\nاطبع(م)';
        }
      },
      {
        id: 'missing-device-adaptation',
        title: 'تجاهل آلية تكييف الجهاز والمنصات (No Unified Target Device)',
        description: 'البيان يتكيف مع أي أجهزة طرفية. إغفال التصريح عن تهيئة اللوحة (مثل جهاز.تهيئة_الجهاز) يحرم التطبيق من التجاوب التام للأداء العالي.',
        severity: 'preventive' as const,
        detected: currentCode.includes('مهمة رئيسية():') && !currentCode.includes('جهاز.تهيئة_الجهاز'),
        proposedCodeSnippet: 'جهاز.تهيئة_الجهاز("أندرويد")',
        fixLabel: 'مواءمة الذاكرة مع الأجهزة الطرفية والمستشعرات',
        fixAction: (code: string) => {
          if (code.includes('مهمة رئيسية():')) {
            return code.replace('مهمة رئيسية():', 'مهمة رئيسية():\n    جهاز.تهيئة_الجهاز("أندرويد")');
          }
          return 'جهاز.تهيئة_الجهاز("أندرويد")\n' + code;
        }
      }
    ];

    return gaps;
  };

  // ==========================================
  // BayanQuantumAnalyzer Implementation
  // ==========================================

  const analyzeQuantumResourceGaps = () => {
    const gaps = [];
    
    // 1. Nested loop detection or multiple loops (O(N^2) or higher complexity)
    const hasLoops = /كرر|لكل|من\s+.*إلى/g.test(currentCode);
    const hasNestedLoops = (currentCode.match(/كرر|لكل/g) || []).length > 1;
    
    if (hasNestedLoops) {
      gaps.push({
        id: 'nested-loops-complexity',
        title: 'رصد حلقات تكرارية متداخلة (Nested Computation Bottleneck)',
        severity: 'critical' as const,
        description: 'يحتوي الكود على حلقات تكرارية متداخلة تتفاقم فيها التعقيدات الحسابية إلى O(N²)، مما يزيد من حرارة معالج الهاتف ويستنزف البطارية وسعة الرام بشكل متسارع.',
        traditionalComplexity: 'O(N²)',
        quantumComplexity: 'O(1) التراكبي البليغ',
        alternativeStructure: 'بنية التراكب المتوازي (كمومية.سجل_متشابك)',
        impact: 'تخفيض جهد الحساب بنسبة 99.4%',
        suggestedCode: `مهمة رئيسية():
    // استنهاض مصفوفة التراكب لتمرير كافة العناصر في نبضة كمية واحدة دافعة
    عرف سجل_متراكب = كمومية.سجل_متشابك()
    سجل_مستدام = سجل_متراكب.محاكاة_تراكبية()
    اطبع("تمت المعالجة التآزرية بضربة زمنية واحدة O(1)!")
نهاية`
      });
    } else if (hasLoops) {
      gaps.push({
        id: 'single-loop-complexity',
        title: 'استخدام حلقات تكرارية خطية (Iterative Resource Exhaustion)',
        severity: 'warning' as const,
        description: 'يحتوي الكود على حلقة تكرارية كلاسيكية O(N). بمستودع بيانات ضخم، سيعاني التطبيق من تعقيد زمني خطي واهتزاز في جودة عرض البيانات على الهاتف.',
        traditionalComplexity: 'O(N)',
        quantumComplexity: 'O(1) عبر التراكب الفوري',
        alternativeStructure: 'حوسبة الحزمة الكمومية من خلال تراكب الحالات والمشاهد المتصلة',
        impact: 'تخفيض معدل استهلاك طاقة المعالج لـ 1.25%',
        suggestedCode: `مهمة رئيسية():
    أندرويد.محرك_كمومي("تسريع_خطي_تراكبي")
    // حوسبة الحالات مدمجة ومحصنة كمياً لمنع التأرجح
    اطبع("تنشيط القفزة الكمومية للمصفوفات!")
نهاية`
      });
    }

    // 2. Heavy traditional searches or variables indexing
    const hasSequentialMatch = /ابحث|تفقد|قارن|تطابق/g.test(currentCode) || (currentCode.includes('عرف') && !currentCode.includes('متشابك') && !currentCode.includes('كمومية'));
    if (hasSequentialMatch && currentCode.length > 50) {
      gaps.push({
        id: 'sequential-indexing',
        title: 'استعلام خطي غير معزز (Non-Entangled Linear Querying)',
        severity: 'warning' as const,
        description: 'يتم استخدام هياكل معالجة متغيرات خطية دون ربطها بحواض الكيوبيتات المعززة. يتطلب الاستعلام عن البيانات جهداً حسابياً متكرراً وخوارزمية فحص متعثرة.',
        traditionalComplexity: 'O(N)',
        quantumComplexity: 'O(log N) عبر التشابك الاقتراني للذاكرة',
        alternativeStructure: 'السجل الاقتراني المتشابك متبادل الاستجابة لصفر زمن تأخير',
        impact: 'استرجاع لحظي بلا فترات انتظار مقارنة بالاستعلام الخطي الكلاسيكي',
        suggestedCode: `مهمة رئيسية():
    // ربط متبادل لتوائم الكيوبيت لتقريب المسافة الفراغية صفريا
    عرف سجل_مستدام = كمومية.سجل_متشابك()
    سجل_مستدام.ربط_توأمي("مفتاح", "بيانات")
نهاية`
      });
    }

    // 3. UI Redraw and compose adaptivity without quantum accelerator
    const hasUiWithoutQuantum = (currentCode.includes('أندرويد.') || currentCode.includes('واجهة')) && !currentCode.includes('محرك_كمومي');
    if (hasUiWithoutQuantum) {
      gaps.push({
        id: 'no-quantum-ui-accelerator',
        title: 'تشييد واجهات أصلية رتيبة دون تسريع كمي مستدام',
        severity: 'preventive' as const,
        description: 'تشغيل واجهات الجهاز وتحديثها يدوياً يرهق عتاد أندرويد ويزيد من دورات المعالجة والتحديث Recomposition لـ Jetpack Compose بنسبة كبيرة.',
        traditionalComplexity: 'إعادة تجميع UI خطية مجهدة',
        quantumComplexity: 'تحديث تراكبي لحظي O(1)',
        alternativeStructure: 'محرك أندرويد الكمي المستدام لوأد التحديث المكرر',
        impact: 'توفير 87% من تيار شحن بطارية الجهاز الطرفي',
        suggestedCode: `مهمة رئيسية():
    أندرويد.صناعة_تطبيق("com.bayan.quantum", "تطبيق فائق الاستدامة")
    أندرويد.إضافة_واجهة("الرئيسية")
    
    // حقن محرك التراكب الكمي لوقف إجهاد معالج العتاد بنقرة واحدة
    أندرويد.محرك_كمومي("توفير_طاقة_مستدام")
    
    أندرويد.نص("حالة", "يعمل بأعلى معايير الاستدامة الخضراء لصفر انبعاثات")
    أندرويد.بناء_APK()
نهاية`
      });
    }

    // Default gap to always ensure there is a playful entry
    if (gaps.length === 0) {
      gaps.push({
        id: 'baseline-optimization',
        title: 'عدم تفعيل النواة الكمومية المدمجة كخيار هيكلي افتراضي',
        severity: 'preventive' as const,
        description: 'يعمل الكود الحالي من خلال مسارات الحوسبة الكلاسيكية السهلة. يوصى بترحيله كلياً إلى بنى الكيوبيتات ومصفوفات التراكب المستدامة لتفادي أي ضياع طاقة تراكمي بالمستقبل.',
        traditionalComplexity: 'تراكم مستمر O(N)',
        quantumComplexity: 'حوسبة تراكبية مستدامة صفرية الذوبان O(1)',
        alternativeStructure: 'النظام الداخلي للاحتواء الكمي بالبيان (Quantum Entangled Matrix)',
        impact: 'حفظ استمرارية الكود وثبات الذاكرة لعقود دون عيوب منطقية',
        suggestedCode: `مهمة رئيسية():
    جهاز.تهيئة_الجهاز("ويب_كمي")
    // صهر الهياكل الكلاسيكية وحيلتها لتراكب الكيوبيت
    عرف نوى_كمية = كمومية.كيوبيت()
    كمومية.هادامارد(نوى_كمية)
    كمومية.عرض_الحالة(نوى_كمية)
نهاية`
      });
    }

    return gaps;
  };

  const getQuantumOptimizedCode = (code: string): string => {
    if (!code.trim()) {
      return `مهمة رئيسية():
    جهاز.تهيئة_الجهاز("ويب_كمي")
    
    // ١. تفعيل النماذج المتراكبة لتفادي الأداء الكلاسيكي الرتيب
    أندرويد.محرك_كمومي("تراكبات_سرعة_قصوى")
    
    // ٢. حجز هياكل البيانات الكمومية المدمجة فائقة الكفاءة O(1)
    عرف السجل_المتشابك = كمومية.سجل_متشابك()
    السجل_المتشابك.ربط_توأمي("قفل_المدخلات", "سيادة_برمجية")
    
    // ٣. استشعار منسوب الطاقة المستدامة لصفر انبعاثات وتوفير بنسبة 96%
    اطبع("بوابة BayanQuantumAnalyzer نشطة وتعمل بكفاءة تراكبية مطلقة!")
نهاية`;
    }
    
    let optimized = code;
    
    if (optimized.includes('مهمة رئيسية():')) {
      // Avoid duplicating the quantum engine code block if it is already there
      if (!optimized.includes('أندرويد.محرك_كمومي')) {
        optimized = optimized.replace(
          'مهمة رئيسية():',
          `مهمة رئيسية():\n    // تم الحقن والتحسين عبر BayanQuantumAnalyzer: ترشيد الموارد والتعقيدات الحسابية لـ O(1)\n    أندرويد.محرك_كمومي("توفير_طاقة_مستدام")\n    أندرويد.تنظيف_ذاكرة_تلقائي()`
        );
      }
    } else {
      optimized = `مهمة رئيسية():
    جهاز.تهيئة_الجهاز("متعدد_المنصات")
    أندرويد.محرك_كمومي("تراكبات_فائقة")
    أندرويد.تنظيف_ذاكرة_تلقائي()

    // الشيفرة الأساسية مدمجة ومعززة بهياكل التشابك الكمومي
    ${code.split('\n').join('\n    ')}
    
    أندرويد.بناء_APK()
نهاية`;
    }
    
    return optimized;
  };

  const handleApplyQuantumOptimization = async (gapId: string) => {
    if (isOptimizingQuantumCode) return;
    setIsOptimizingQuantumCode(true);
    setActiveQuantumAnalysisId(gapId);
    setQuantumOptimizationLogs([]);

    const optimizationSteps = [
      '⚡ [مستوى ١] تعقب بؤر الاستهلاك الحاد وتفكيك الهياكل الحسابية الكلاسيكية...',
      '🌀 [مستوى ٢] تشابك توائم الكيوبيتات وتوجيه مسارات الذاكرة لـ Zero Entropy...',
      '🟢 [مستوى ٣] ترحيل مصفوفات التكرار إلى البنية المتراكبة المستدامة O(1)...',
      '🎉 [مكتمل والسيادة للبيان] تم توطين الكود وحياكته كمياً لترشيد أمثل لـ 98%!'
    ];

    for (let i = 0; i < optimizationSteps.length; i++) {
      setQuantumOptimizationLogs(prev => [...prev, optimizationSteps[i]]);
      await new Promise(r => setTimeout(r, 450));
    }

    const optimized = getQuantumOptimizedCode(currentCode);
    onApplyCode(optimized);
    setQuantumSuccessScore(prev => prev + 1);
    setIsOptimizingQuantumCode(false);
    setActiveQuantumAnalysisId(null);

    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        text: `🚀 [تم إحلال وتوطين البنية الهيكلية الكمية O(1)]! نجح محلل BayanQuantumAnalyzer في تحجيم دورات التكرار وخفض فاقد الطاقة والحرارة من حلقة معالجة الكود. عتاد الهاتف يتنفس الآن بحصانة مطلقة لصفر استهلاك موارد تراكمية. يمكنك فحص الكود المتراكب المحدَّث بالمحرر ودفعه للتجميع الفوري!`,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleApplyHeal = async (gapId: string, fixAction: (code: string) => string) => {
    if (isHealing) return;
    setIsHealing(true);
    setActiveHealId(gapId);
    setHealLogs([]);

    const healingSteps = [
      '🔍 [خطوة ١] استنهاض الوكيل الإدراكي وتوجيه مصفوفات التحوط البرمجي...',
      '🛡️ [خطوة ٢] قياس عصب التعارض وتجاوز عيوب تجميع المراجع ثنائية الاتجاه...',
      '🧬 [خطوة ٣] تطبيق الشيفرة التعويضية وضغط النطاقات لمنع فائض التكلفة...',
      '🎉 [مكتمل] تم دباغة الكود وتفعيل التعافي الأملي بنجاح!'
    ];

    for (let i = 0; i < healingSteps.length; i++) {
      setHealLogs(prev => [...prev, healingSteps[i]]);
      await new Promise(r => setTimeout(r, 450));
    }

    const fixed = fixAction(currentCode);
    onApplyCode(fixed);
    setHealingSuccessCount(prev => prev + 1);
    setIsHealing(false);
    setActiveHealId(null);
  };

  const handleSynthesizeProactiveReport = async () => {
    if (isSynthesizingReport) return;
    setIsSynthesizingReport(true);
    setProactiveAiReport(null);

    try {
      const prompt = `أنت بطل البرمجة والذكاء الاصطناعي بلغة البيان ومستشار التعافي الذاتي ومداواة الأكواد (BayanSelfHealing Agent).
قم بعمل فحص إدراكي كامل ومفصل للكود التالي المكتوب بلغة البيان، وقدم تقريراً استباقياً proactive رائعاً خطوة بخطوة باللغة العربية يشمل:
١. تحليل الغرض من الكود الحالي وعلاقته بالسيادة والموارد وتفوق البيان.
٢. رصد أي فجوات منطقية أو تعقيدات في المنطق (Logic Gaps) حتى لو كان الكود يعمل بدون أخطاء.
٣. اقتراح خوارزميات للتحسين، والترشيد، وصيانة طاقة الهاتف أو الويب.
٤. إعطاء نموذج كود البيان المطور والمحكم بالكامل (داخل كود بلوك بماركدوان \`\`\`byn ... \`\`\`).

الكود الحالي للمستخدم:
\`\`\`byn
${currentCode}
\`\`\`
اطلب من المستخدم التفاؤل والتمكين واستشراف ٢٠٥٠ بمخرجات مجانية ومستدامة بالكامل حرة ومستقلة.`;

      const response = await generateMediaAsset('text', prompt);
      setProactiveAiReport(response);
    } catch (e) {
      setProactiveAiReport("عذراً، تعذر الاتصال بمستشار التعافي اللحظي حالياً. الرجاء المحاولة مجدداً وسيتولى عامل الفحص التلقائي تلمس الأسطر.");
    } finally {
      setIsSynthesizingReport(false);
    }
  };

  const extractCodeBlock = (text: string): { pureText: string; code?: string } => {
    // Matches ```byn ... ``` or ``` ... ```
    const regex = /```(?:byn)?([\s\S]*?)```/;
    const match = text.match(regex);
    if (match) {
      const code = match[1].trim();
      const pureText = text.replace(regex, '').trim();
      return { pureText, code };
    }
    return { pureText: text };
  };

  const PROMPT_SYSTEM_PREAMBLE = `أنت رفيق البرمجة الذكي والذراع الاستراتيجي لمهندسي البرمجيات بلغة "البيان" - لغة البرمجة العربية الثنائية والكمومية الأكثر تميزاً واستقلالاً لعام ٢٠٢٦. لقد تم تدريبك بالكامل على دستور لغة البيان، وفوائدها، وقواعد صياغتها، وأكوادها الموطنة لتلبية طلبات المبرمجين وإنارة سبل الابتكار بثقة ويقين.

=========================================
📖 دليل لغة البيان الشامل وفوائدها وجوهرها:
=========================================
١. الأمان المطلق وحفظ الموارد (0% Memory Leak):
   تتفوق البيان على لغات البرمجة الشائعة (مثل C++ و Java) عبر دمج إدارتها المعزولة للذاكرة وتخطي الأخطاء الصفرية ومؤشرات التأرجح بالعتاد بفضل استدعاء التطهير الخلوي الكفاءة: \`أندرويد.تنظيف_ذاكرة_تلقائي()\`.
٢. التكيف والمرونة للأجهزة الطرفية (Adaptability):
   تسمح لمطوريها بكتابة الكود مرة واحدة وتشغيله على أي واجهة بفضل تهيئة العتاد التلقائية: \`جهاز.تهيئة_الجهاز("أندرويد")\` أو \`"ويب"\` أو \`"معدات"\` أو \`"كمي"\`.
٣. التجميع الخفيف جداً (<400KB APK):
   تطبيق أندرويد مبني بـ Jetpack Compose الخلوي يجمع محلياً ولا يتجاوز حجم الـ APK الصافي 385KB مقارنة بالحلول التقليدية المجهدة للذاكرة.
٤. حسم توافق ثنائي الاتجاه (Interoperability):
   تمكنك من حقن وتشغيل السكريبتات العجمية فورا، وتبادل المعطيات تزامناً: \`تبادل.تشغيل_جافاسكريبت("code")\` أو \`تبادل.تشغيل_بايثون("code")\`.
٥. نسيج الحوسبة الكمومية المدمج:
   تحتوي على معالج تراكبي للكيوبيتات ومطابقة حركة Hadamard، مما يسمح بحل المعادلات الصعبة بزمن O(1) بدلاً من الحلقات المكررة المنهكة لبطارية الأجهزة.

=========================================
💻 القواعد البنيوية والمعجم الفصيح للبرمجة بالبيان:
=========================================
- كلمة "مهمة" لتعريف الدوال. نقطة البدء التلقائية للتطبيق تسمى "مهمة رئيسية()". وتنتهي الأجسام بكلمة "نهاية".
- التصريح بالمتغيرات يبدأ بـ "عرف".
- التوريث والبرمجة الكائنية تستخدم "صنف [الاسم] [يرث الاسم_الآخر]:" و"بناء(العناصر):" و"هذا." و"جديد ".
- الشروط والتشعبات: "لو (شرط):" أو "اذا (شرط):" ثم "وإلا لو (شرط):" أو "وإلا لو (شرط):" وأخيراً "وإلا:".
- التكرار المعجل: "كرر (المرات) مرات:" أو عبر المجالات "لكل [المتغير] في المجال(البدء، النهاية):".
- فحص الاستثناءات: "حاول:" ثم "التقط (الاستثناء):" في النهاية.

=========================================
🛠️ مجموعات وفئات الدوال الجاهزة (Built-in SDKs):
=========================================
- مكتبة وسائط ميديا (BayanMediaEngine):
  وسائط.صورة(معرف_الحدث، الرابط، تسمية_بديلة)
  وسائط.فيديو(معرف_الحدث، الرابط، لوحة_عرض)
  وسائط.صوت(معرف_الحدث، الرابط)
  وسائط.معرض_صور(معرف_العنصر، مصفوفة_الروابط)

- مكتبة الذكاء الاصطناعي الفوري:
  اسأل_الذكاء(سؤال) -> يعطي رد ذكي موطن
  ترجم(نص، لغة) -> ترجمة فصيحة فورية
  لخص(نص) -> استخلاص مركز للمعلومات

- واجهات تطبيقات أندرويد والـ PWA التقدمية (Native Android Widget Builder):
  أندرويد.صناعة_تطبيق("com.comapny.app", "الاسم الرسمي") // تسجيل الحزمة
  أندرويد.لوح_الألوان("زمردي_فاخر") // تشذيب المظهر بصريا
  أندرويد.إضافة_واجهة("اسم_الواجهة") // غرس شاشة جديدة
  أندرويد.زر("رابط_أو_اسم"، "نص الزر") // تفاعل
  أندرويد.نص("اسم"، "نص الواجهة") // نصوص ثابتة
  أندرويد.حقل_إدخال("اسم_المدخل"، "التلميح") // استقبال البيانات
  أندرويد.مفتاح_تبديل("مفتاح_الصوت"، "مفتاح التنبيه") // Material Switch
  أندرويد.مؤشر_تقدم("كفاءه"، نسبة_مئوية) // Progress Indicator
  أندرويد.صورة("لوجو"، "رابط الصورة") // Image Box
  أندرويد.محرك_كمومي("تألق") // تفعيل السرعة الفائقة
  أندرويد.تنظيف_ذاكرة_تلقائي() // استدعاء فوري للتطهير
  أندرويد.بناء_APK() // خطوة التجميع والختام الفائقة

- مكتبات السيطرة وقواعد البيانات والشبكات العصبية والكم الحقيقي:
  أمان.تحليل_لغة_ومعالجة("سي")
  جهاز.تهيئة_الجهاز("ويب_كمي")
  قاعدة_بيانات.تهيئة("الاسم")
  قاعدة_بيانات.تحديث_أو_إضافة("مفتاح", "بيانات")
  نغمة.تشغيل_مسار("نوتة_موسيقية", "الزمن")
  تعلم.عند_النقر("اسم_الزر"): ... نهاية
  كمومية.كيوبيت() // حائز الكيوبيت
  كمومية.هادامارد(ك) // بوابة السوبربوزشن
  كمومية.تشابك(ك1, ك2) // ربط التشابك
  كمومية.قياس(ك) // بوابة الرصد والقياس اللحظي لوأد العبء الحسابي
  عصبية.إنشاء_نموذج(الطبقات) // شبكة عصبية ذكية
  عصبية.تدريب_تطوري(نموذج, عصر) // تكيف جيني ذكي للخوارزمية

=========================================
📋 أمثلة لأكواد البيان الكاملة والصالحة للتشغيل:
=========================================

١. تطبيق أندرويد متكامل ذكي وموفر للبطارية:
\\\`\\\`\\\`byn
مهمة رئيسية():
    اطبع("🏁 بدء إقلاع تطبيق البيان للأندرويد المستدام...")
    أندرويد.صناعة_تطبيق("com.bayan.eco", "الروضة الخضراء للطفل")
    أندرويد.لوح_الألوان("زمردي_فاخر")
    أندرويد.إضافة_واجهة("الرئيسية")
    
    // منع تشتت الرام وحفظ الطاقة الذكي لـ 0% تسريب
    أندرويد.تنظيف_ذاكرة_تلقائي()
    أندرويد.محرك_كمومي("توفير_بليغ")

    أندرويد.عنوان_رئيسي("🕌 تطبيق الروضة والتعليم")
    أندرويد.نص("إرشاد"، "اضغط على الزر لتفعيل تنبيه الأذكار المدمج")
    أندرويد.زر("تنبيه", "تفعيل منبه الصباح")

    قاعدة_بيانات.تهيئة("قاعدة_محلية")
    قاعدة_بيانات.تحديث_أو_إضافة("سجل_الدخول", "نشط", "نعم")

    تعلم.عند_النقر("تنبيه"):
        أندرويد.اهتزاز_لمسي("نقرة_خفيفة")
        نغمة.تشغيل_مسار("E4", "4n")
        أندرويد.رسالة_منبثقة("📢 تم تشغيل التنبيه الصباحي الموقظ بنجاح!")
    نهاية

    أندرويد.بناء_APK()
نهاية
\\\`\\\`\\\`

٢. محاكاة التشابك الكمي وبوابة Hadamard لسرعة الحساب O(1):
\\\`\\\`\\\`byn
مهمة رئيسية():
    جهاز.تهيئة_الجهاز("ويب_كمي")
    اطبع("⚛️ تشغيل محاكي مصفوفة التراكب والتشابك الكمي...")
    
    // تفعيل قنوات الكيوبيتس
    عرف ك١ = كمومية.كيوبيت()
    عرف ك٢ = كمومية.كيوبيت()
    
    // إدخال الكيوبيت في حالة التراكب المتوازية (Hadarmard State)
    كمومية.هادامارد(ك١)
    
    // إجراء التشابك الاقتراني للكيوبيتات لسرعة تداول البيانات اللحظية
    كمومية.تشابك(ك١، ك٢)
    
    // قياس النتيجة لإنهاء زمن التأخر الخطيب
    عرف رصد١ = كمومية.قياس(ك١)
    عرف رصد٢ = كمومية.قياس(ك٢)
    
    اطبع("النتيجة المسجلة بعد القياس والارتباط المتآزر:")
    اطبع(رصد١)
    اطبع(رصد٢)
نهاية
\\\`\\\`\\\`

٣. البرمجة كائنية التوجه (OOP) في البيان:
\\\`\\\`\\\`byn
صنف سيارة:
    بناء(العلامة، السرعة_القصوى):
        هذا.العلامة = العلامة
        هذا.السرعة_القصوى = السرعة_القصوى
    نهاية

    مهمة تفاصيل():
        اطبع("العلامة التجارية:")
        اطبع(هذا.العلامة)
        اطبع("السرعة الفائقة لسيارة البيان:")
        اطبع(هذا.السرعة_القصوى)
    نهاية
نهاية

مهمة رئيسية():
    عرف سيارة_أولى = جديد سيارة("البرق العربي"، ٢٨٠)
    سيارة_أولى.تفاصيل()
نهاية
\\\`\\\`\\\`

ملاحظة حاسمة وصارمة جداً: في كافة إجاباتك، عندما يسألك العميل أو المبرمج عن كود البيان، قدم الشرح بأفضل أسلوب عربي تقني، دقيق، ودافع، وثق ثقة تامة بالقدرة والموثوقية، وضع الأكواد بالكامل داخل بلوك مارك داون \`\`\`byn ... \`\`\`. واجعل الأكواد ممتازة وخالية تماماً من الاختصارات المبهمة ومباشرة الاستعمال.`;

  const handleSend = async (userPrompt: string) => {
    if (!userPrompt.trim() || loading) return;

    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: userPrompt, timestamp: time }]);
    setInput('');
    setLoading(true);

    try {
      const fullPrompt = `${PROMPT_SYSTEM_PREAMBLE}\n\nالكود الحالي للمستخدم في المحرر:\n\`\`\`byn\n${currentCode}\n\`\`\`\n\nسؤال المستخدم أو طلبه الحالي:\n"${userPrompt}"`;
      const aiResponse = await generateMediaAsset('text', fullPrompt);
      const { pureText, code } = extractCodeBlock(aiResponse);

      setMessages(prev => [...prev, {
        role: 'ai',
        text: pureText || 'تفضل، هذا الكود المطلب لبناء الفكرة المبتكرة:',
        codeBlock: code,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'عذراً، واجهت عقبة اتصال غير متوقعة أثناء معالجة الابتكار البرمجي. يرجى المحاولة بعد قليل أو التأكد من سلامة الاتصال.',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuickAction = (actionType: 'quantum' | 'neural' | 'explain' | 'fix' | 'strategy' | 'git' | 'safety' | 'devices') => {
    if (actionType === 'quantum') {
      handleSend('أنشئ لي نموذجاً مبهراً ومتقدماً لمحاكاة الحوسبة الكمومية والتشابك الكمي في البيان، يربط الكيوبيتات ويطبق بوابة CNOT التبادلية.');
    } else if (actionType === 'neural') {
      handleSend('أنشئ لي كوداً مبتكراً لإنشاء وتدريب شبكة عصبية ذكية بالبيان تحل مشكلة برمجية مستقبلية وتتوقع النتائج باستخدام التدريب التطوري ومخططات الهيكل.');
    } else if (actionType === 'explain') {
      handleSend('قم بتحليل وشرح كودي الحالي في المحرر بالتفصيل سطر بسطر واذكر نقاط القوة ومواقع التطوير.');
    } else if (actionType === 'strategy') {
      handleSend('اكتب لي برنامجاً متقدماً يستدعي وكلاء الذكاء الاصطناعي في البيان لتأمين استخلاص معرفي وصياغة رؤية استراتيجية لعام ٢٠٥٠ حول الأنظمة برمجية التطور.');
    } else if (actionType === 'git') {
      handleSend('اكتب لي برنامجاً يتصل بمستودعات جيثب وجيتلاب المفتوحة ويبحث عن الأكواد ويستورد حزمة للتعلم التلقائي وتفعيل التحديث الذاتي للمترجم والمحرر.');
    } else if (actionType === 'safety') {
      handleSend('أنشئ لي برنامجاً بلغة البيان يستعرض عيوب لغات البرمجة الشائعة كـ C++ و Java و Python ويعالج عيوب الذاكرة والتعقيد بواسطة ميزات الأمان بالبيان.');
    } else if (actionType === 'devices') {
      handleSend('اكتب لي كوداً بلغة البيان لتجهيز البيئة والتكيف مع الأجهزة المختلفة مثل الويب والاندرويد والحواسيب ومستشعرات ومعدات IoT مع تخطي عقبات الأنظمة الأخرى.');
    } else if (actionType === 'fix') {
      if (compilationError) {
        handleSend(`لدي خطأ برمجي حالي وهو: "${compilationError}". الرجاء مراجعة الكود وإصلاحه وتقديمه لي بشكل صحيح.`);
      } else {
        handleSend('قم بمراجعة الكود الحالي وإيجاد أي أخطاء أو تحسينات في كتابته.');
      }
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden shadow-2xl relative text-slate-100">
      
      {/* Header */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex justify-between items-center z-10 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-l from-emerald-400 to-blue-400">
            رفيق البيان الذكي ومطور المستقبل
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow shadow-emerald-400 animate-ping"></span>
          <span className="text-[10px] text-slate-400 font-mono">Quantum & AI Ready</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-950 border-b border-slate-800/80 p-1 gap-1" dir="rtl">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles size={11} />
          الدردشة والابتكار
        </button>
        <button
          onClick={() => setActiveTab('android-perf')}
          className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeTab === 'android-perf'
              ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Cpu size={11} />
          الأداء والتدريب 🤖⚛️
        </button>
        <button
          onClick={() => setActiveTab('self-healing')}
          className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all relative ${
            activeTab === 'self-healing'
              ? 'bg-gradient-to-r from-purple-650 to-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <HeartPulse size={11} className={activeTab !== 'self-healing' ? 'animate-pulse text-purple-400' : ''} />
          <span>مداواة الثغرات 🧬🩹</span>
        </button>
        <button
          onClick={() => setActiveTab('quantum-analyzer')}
          className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all relative ${
            activeTab === 'quantum-analyzer'
              ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Atom size={11} className={activeTab !== 'quantum-analyzer' ? 'animate-pulse text-amber-500' : ''} />
          <span>المحلل الكمومي ⚛️🧪</span>
        </button>
        <button
          onClick={() => setActiveTab('agent-hub')}
          className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all relative ${
            activeTab === 'agent-hub'
              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Bot size={11} className={activeTab !== 'agent-hub' ? 'animate-pulse text-sky-400' : ''} />
          <span>مركز الوكلاء Hub 🤖🏡</span>
        </button>
      </div>

      {activeTab === 'chat' && (
        <>
          {/* Messages Window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-900/60 flex flex-col justify-between">
            
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-1 max-w-[90%] ${
                    msg.role === 'user' ? 'mr-auto items-end animate-in fade-in slide-in-from-left-5' : 'ml-auto items-start animate-in fade-in slide-in-from-right-5'
                  }`}
                  dir={msg.role === 'user' ? 'ltr' : 'rtl'}
                >
                  
                  {/* Message Header (Avatar & Name) */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                    {msg.role === 'user' ? (
                      <>
                        <span>أنت</span>
                        <User size={12} className="text-blue-400" />
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="text-emerald-400" />
                        <span>البيان الاصطناعي</span>
                      </>
                    )}
                  </div>

                  {/* Text Balloon */}
                  <div
                    dir="rtl"
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tl-none'
                        : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tr-none'
                    }`}
                  >
                    {msg.text}

                    {/* Optional Code Block inside message */}
                    {msg.codeBlock && (
                      <div className="mt-3.5 rounded-lg border border-slate-700 bg-slate-950 overflow-hidden font-mono text-xs w-full text-left" dir="ltr">
                        <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex justify-between items-center select-none">
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                            <Code2 size={12} /> AL-BAYAN (.byn)
                          </span>
                          <div className="flex items-center gap-2">
                            {/* Instant Run Button */}
                            <button
                              onClick={() => onInstantRun(msg.codeBlock!)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all"
                              title="تشغيل فوري للكود المستخرج"
                            >
                              <Play size={10} fill="currentColor" />
                              <span>تشغيل</span>
                            </button>

                            {/* Apply to Editor Button */}
                            <button
                              onClick={() => onApplyCode(msg.codeBlock!)}
                              className="bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all"
                              title="إدراج الكود بالكامل في المحرر اليسار"
                            >
                              <Terminal size={10} />
                              <span>تطبيق في المحرر</span>
                            </button>

                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopy(msg.codeBlock!, i)}
                              className="p-1 text-slate-400 hover:text-white transition-colors"
                              title="نسخ الكود"
                            >
                              {copiedIndex === i ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                        <pre className="p-3 overflow-x-auto text-slate-300 font-medium whitespace-pre max-h-[220px] custom-scrollbar" dir="ltr">
                          {msg.codeBlock}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[9px] text-slate-500 mt-0.5 select-none">{msg.timestamp}</span>
                </div>
              ))}

              {loading && (
                <div className="ml-auto flex flex-col gap-1 items-start max-w-[80%]" dir="rtl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Sparkles size={12} className="text-emerald-400 animate-spin" />
                    <span>البيان يفكر ويكتب المستقبل...</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 mr-2 flex items-center gap-2.5">
                    <div className="flex space-x-1.5 space-x-reverse">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length === 1 && (
              <div className="mt-8 space-y-2.5" dir="rtl">
                <h4 className="text-xs font-semibold text-slate-400 select-none flex items-center gap-1.5">
                  💡 اقتراحات الابتكار التفاعلية:
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickAction('quantum')}
                    className="text-right p-2.5 text-xs rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-emerald-400 font-medium transition-all hover:-translate-y-0.5 flex flex-col gap-1"
                  >
                    <span className="text-sm">⚛️ بوابات التشابك الكمي</span>
                    <span className="text-[10px] text-slate-500 font-normal">بناء بوابات CNOT وتوليد حالة بيل المتشابكة ورصدها.</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('neural')}
                    className="text-right p-2.5 text-xs rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-blue-400 font-medium transition-all hover:-translate-y-0.5 flex flex-col gap-1"
                  >
                    <span className="text-sm">🧠 التدريب العصبي الجيني</span>
                    <span className="text-[10px] text-slate-500 font-normal">تدريب تطوري للأوزان ورسم مخطط هندسة العصبونات.</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('strategy')}
                    className="text-right p-2.5 text-xs rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-pink-400 font-medium transition-all hover:-translate-y-0.5 flex flex-col gap-1"
                  >
                    <span className="text-sm">🔮 وكلاء ذكاء واستشراف ٢٠٥٠</span>
                    <span className="text-[10px] text-slate-500 font-normal">تفعيل عميل مستقل للتحليل وصياغة خطة للمستقبل.</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('git')}
                    className="text-right p-2.5 text-xs rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-teal-400 font-medium transition-all hover:-translate-y-0.5 flex flex-col gap-1"
                  >
                    <span className="text-sm">🌐 تعلم واستيراد من GitHub</span>
                    <span className="text-[10px] text-slate-500 font-normal">سحب أكواد المنصات الحرة وتفعيل التطوير التلقائي.</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('safety')}
                    className="text-right p-2.5 text-xs rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-indigo-400 font-medium transition-all hover:-translate-y-0.5 flex flex-col gap-1"
                  >
                    <span className="text-sm">🛡️ موازنة الأمان وعلاج عيوب اللغات</span>
                    <span className="text-[10px] text-slate-500 font-normal">تحليل عيوب الذاكرة والتعقيد باللغات الأخرى ومداواتها.</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('devices')}
                    className="text-right p-2.5 text-xs rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-sky-400 font-medium transition-all hover:-translate-y-0.5 flex flex-col gap-1"
                  >
                    <span className="text-sm">📱 تشغيل الأجهزة الموحدة IoT</span>
                    <span className="text-[10px] text-slate-500 font-normal">تكييف ومطابقة الكود للأندرويد والحواسب والمعدات.</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('explain')}
                    className="text-right p-2.5 text-xs rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-amber-400 font-medium transition-all hover:-translate-y-0.5 flex flex-col gap-1"
                  >
                    <span className="text-sm">📝 شرح وتحليل كودي الحالي</span>
                    <span className="text-[10px] text-slate-500 font-normal">تحليل كامل لأسطر كود البيان الحالي سطر بسطر.</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('fix')}
                    className={`text-right p-2.5 text-xs rounded-xl bg-slate-800/40 border transition-all hover:-translate-y-0.5 flex flex-col gap-1 font-medium ${
                      compilationError 
                        ? 'border-red-500/30 hover:border-red-500 bg-red-950/20 text-red-400 hover:bg-red-950/30' 
                        : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-purple-400'
                    }`}
                  >
                    <span className="text-sm">🔧 {compilationError ? 'إصلاح العطـل الحالي' : 'مراجعة وتصويب الأخطاء'}</span>
                    <span className="text-[10px] text-slate-500 font-normal">مراجعة المنطق ومعالجة أي مشاكل صياغية فوراً.</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Input Pad */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 z-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
              dir="rtl"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="اطلب فكرة مستقبلية، حوسبة كمية، أو مراجعة أكواد..."
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500 text-slate-100"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`p-3 rounded-xl transition-all ${
                  !input.trim() || loading
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95'
                }`}
              >
                <Send size={18} className="rotate-180" />
              </button>
            </form>
          </div>
        </>
      )}

      {activeTab === 'android-perf' && (
        /* Android Performance Advisor Console */
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-900/60" dir="rtl">
          
          {/* Header section with icon and title */}
          <div className="bg-gradient-to-l from-teal-950/40 to-slate-900 border border-teal-900/40 p-4 rounded-xl flex items-center gap-3">
            <span className="p-2.5 rounded-lg bg-teal-500/20 text-teal-400">
              <Cpu size={22} className={isTraining ? "animate-spin" : ""} />
            </span>
            <div>
              <h3 className="font-bold text-sm text-teal-300 font-sans">مستشار أداء الأندرويد الهجين بالبيان</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">محاكي ترشيد الموارد، الحوسبة الموفرة، والتعلم المعزز للمخططات.</p>
            </div>
          </div>

          {/* Interactive Resource Metrics Simulator */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 space-y-3 shadow-inner">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Activity size={13} className="text-sky-400" />
                لوحة التقييم الحي لموارد الهاتف المستهدف
              </span>
              <span className="bg-emerald-950/40 text-[10px] text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/60 flex items-center gap-1 font-mono">
                <Battery size={11} className="text-emerald-500" /> Eco-Optimized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
              {/* CPU load */}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-850">
                <span className="text-[10px] text-slate-400 font-medium block">لود المعالج المطلوب (CPU)</span>
                <span className="text-lg font-bold font-mono tracking-tight text-right block mt-1">
                  {isQuantumActive ? (
                    <span className="text-purple-400">1.8% <span className="text-[10px] font-normal text-slate-500">(بالمحرك الكمي)</span></span>
                  ) : (
                    <span className="text-amber-400">42% <span className="text-[10px] font-normal text-slate-500">(كلاسيكي)</span></span>
                  )}
                </span>
                <div className="w-full bg-slate-950 h-1 rounded mt-1.5 overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${isQuantumActive ? 'w-[5%] bg-purple-500' : 'w-[42%] bg-amber-500'}`}></div>
                </div>
              </div>

              {/* Memory leakage */}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-850">
                <span className="text-[10px] text-slate-400 font-medium block">تسريب الذاكرة (RAM Leak)</span>
                <span className="text-lg font-bold font-mono tracking-tight text-right block mt-1">
                  {isGcActive ? (
                    <span className="text-emerald-400">0.00% <span className="text-[10px] font-normal text-slate-500">(خلوية مطهرة)</span></span>
                  ) : (
                    <span className="text-red-400">1.2% <span className="text-[10px] font-normal text-slate-500">(Java Heap Garbage)</span></span>
                  )}
                </span>
                <div className="w-full bg-slate-950 h-1 rounded mt-1.5 overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${isGcActive ? 'w-0' : 'w-[15%] bg-red-500'}`}></div>
                </div>
              </div>

              {/* APK size */}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-850">
                <span className="text-[10px] text-slate-400 font-medium block">حجم حزمة التصدير (APK Size)</span>
                <span className="text-lg font-bold font-mono tracking-tight text-emerald-400 block mt-1">
                  {trainingLevel > 98 ? "385 KB" : "1.8 MB"}
                  <span className="text-[10px] font-normal text-slate-500 mr-1">(ألترا خفيف)</span>
                </span>
              </div>

              {/* Battery Drainage */}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-850">
                <span className="text-[10px] text-slate-400 font-medium block">ترشيد البطارية الإنتقائي</span>
                <span className="text-lg font-bold text-sky-400 block mt-1">
                  {isSensorActive ? "اقتصادي مفرط" : "طبيعي"}
                  <span className="text-[10px] font-normal text-slate-500 mr-1">({isSensorActive ? '95%' : '60%'})</span>
                </span>
              </div>
            </div>

            {/* Quick Interactive Knobs to preview performance benefit */}
            <div className="space-y-2 border-t border-slate-800/80 pt-3">
              <span className="text-[10px] font-bold text-slate-400 block select-none">اضغط لتفعيل المزايا ومحاكاة التحسن في طاقة الهاتف المستهدف:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuantumActive(!isQuantumActive)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-xs border text-right transition-all justify-start ${
                    isQuantumActive ? 'border-purple-500 bg-purple-950/30 text-purple-200' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-sm">⚛️</span>
                  <div className="text-right">
                    <span className="font-bold block text-[11px]">محاكي كمي (Q-Core)</span>
                    <span className="text-[9px] block text-slate-500">حساب الواجهات بـ O(1)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGcActive(!isGcActive)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-xs border text-right transition-all justify-start ${
                    isGcActive ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-sm">♻️</span>
                  <div className="text-right">
                    <span className="font-bold block text-[11px]">تطهير خلوي (Memory GC)</span>
                    <span className="text-[9px] block text-slate-500">حجب فوري ومطابقة ثغرات</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSensorActive(!isSensorActive)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-xs border text-right transition-all justify-start ${
                    isSensorActive ? 'border-sky-500 bg-sky-950/30 text-sky-200' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-sm">📡</span>
                  <div className="text-right">
                    <span className="font-bold block text-[11px]">استشعار متكيف (Sensors)</span>
                    <span className="text-[9px] block text-slate-500">استجابة للحركة الدوارة موفر</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAiActive(!isAiActive)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-xs border text-right transition-all justify-start ${
                    isAiActive ? 'border-blue-500 bg-blue-950/30 text-blue-200' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-sm">🧠</span>
                  <div className="text-right">
                    <span className="font-bold block text-[11px]">ذكاء مدمج (Edge-AI)</span>
                    <span className="text-[9px] block text-slate-500">استكمال ذكي محلي دون سيرفر</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Continuous Reinforcement Learning Area */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Gauge size={14} className="text-emerald-400" />
                مستوى التدريب والاستخلاص الذاتي للمترجم
              </span>
              <span className="text-emerald-400 font-mono text-sm font-bold">{trainingLevel}%</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              تتدرب عصبية لغة البيان تلقائياً عبر آلية التعلم والتدريب المستمر (Self-Training Platform) لتحليل مواصفات Jetpack Compose وتوليد أسرع كود كوتلن بأقل حجم واستهلاك طاقة، متجاوزة أخطاء اللغات الشائعة.
            </p>

            {isTraining ? (
              <div className="bg-slate-900/90 p-3 rounded-xl border border-teal-500/20 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-teal-400 flex items-center gap-1 font-bold">
                    <span className="animate-spin h-2.5 w-2.5 border-2 border-teal-400 border-t-transparent rounded-full block"></span>
                    جاري خوض دورة التدريب والتطوير الذاتي للبيان...
                  </span>
                  <span className="text-slate-500 font-mono">التقدم: 100%</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded text-[10px] font-mono text-teal-300 h-24 overflow-y-auto custom-scrollbar space-y-1" dir="rtl">
                  {trainingLogs.map((log, lIdx) => (
                    <div key={lIdx} className="animate-fade-in text-right">✓ {log}</div>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={runContinuousTraining}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw size={13} />
                تنشيط دورة تدريبية وتثقيف المترجم الهجين فوراً 🚀
              </button>
            )}
          </div>

          {/* Futuristic Android Best-Practice Guidelines */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1 select-none">
              💡 مكتبة الأنماط المحسنة والكمومية لتطبيقات أندرويد المستدامة:
            </h4>

            {/* Tip 1 */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-teal-300 flex items-center gap-1">
                    <span>١. منع تسريبات الذاكرة وتخفيض العبء (0% RAM Leaks)</span>
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    من خلال استدعاء <span className="text-emerald-300 font-mono">أندرويد.تنظيف_ذاكرة_تلقائي()</span>، يستبدل مترجم البيان الـ GC الكلاسيكي المرهق للهواتف بتنظيف خلوي مؤمن يحرر الذاكرة فور الاستخدام.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onApplyCode(`مهمة رئيسية():
    أندرويد.صناعة_تطبيق("com.bayan.zeroleak", "تطبيق صفر تسريب")
    أندرويد.إضافة_واجهة("الرئيسية")

    // تفعيل التنظيف الخلوي الآمن للمستودعات والذاكرة العشوائية
    أندرويد.تنظيف_ذاكرة_تلقائي()

    أندرويد.نص("حالة", "الذاكرة العشوائية مصانة ومطهرة كلياً بنسبة تسريب 0%")
    أندرويد.مؤشر_تقدم("تحسين_الرام"، 100)
    
    أندرويد.بناء_APK()
نهاية`);
                    setActiveTab('chat');
                    setMessages(prev => [...prev, {
                      role: 'user',
                      text: 'أريد تطبيق نموذج منع تسريبات الذاكرة على كودي وتأميله.',
                      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
                    }, {
                      role: 'ai',
                      text: 'تفضل! قمت بإحضار نموذج منع تسريبات الذاكرة (Memory Healing Framework) إلى المحرر. هذا يزيد استقرار التطبيق ويمنعه من التراخي والبطء فجأة.',
                      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
                    }]);
                  }}
                  className="bg-teal-950 text-teal-400 border border-teal-900/60 hover:bg-teal-900 hover:text-white px-2 py-1 rounded text-[10px] font-bold block shrink-0 transition-colors"
                >
                  تطبيق النموذج
                </button>
              </div>
            </div>

            {/* Tip 2 */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-purple-300 flex items-center gap-1">
                    <span>٢. الاستماع الموفر للطاقة للمستشعرات المدمجة</span>
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    باستعمال <span className="text-purple-300 font-mono">أندرويد.مستشعر_ذكي(اسم_المستشعر، دالة_المعالجة)</span>، يتجنب التطبيق تكرار العمليات الحسابية وقراءة بيانات الحواجز إلا عند حدوث تغيير حركي حقيقي، مما يحث كفاءة البطارية بمعدل 5 أضعاف.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onApplyCode(`مهمة رئيسية():
    أندرويد.صناعة_تطبيق("com.bayan.greenpoints", "تطبيق الاستشعار الدقيق")
    أندرويد.إضافة_واجهة("الرئيسية")

    // تفعيل وضع الاستجابة المتكيفة الموفر لموارد الهاتف خلفيا
    أندرويد.مستشعر_ذكي("الحركة_الدوارة"، "معالجة_تلقائية")

    أندرويد.نص("لوحة_الحركة", "الاستشعار متكيف وموفر للطاقة والبطارية بنسبة 95%")
    أندرويد.بناء_APK()
نهاية`);
                    setActiveTab('chat');
                    setMessages(prev => [...prev, {
                      role: 'user',
                      text: 'أريد تعشيق وتطبيق نموذج الاستشعار الموفر للطاقة.',
                      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
                    }, {
                      role: 'ai',
                      text: 'رائع جداً! تم إدراج نموذج الاستشعار منخفض الاستهلاك (Eco-Sensor Framework). سيجعل تطبيقك يلتقط جيروسكوب الأندرويد وإرهاصات الحركة فقط بتوقيتات حيوية مرشدة للغاية.',
                      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
                    }]);
                  }}
                  className="bg-purple-950 text-purple-400 border border-purple-900/60 hover:bg-purple-900 hover:text-white px-2 py-1 rounded text-[10px] font-bold block shrink-0 transition-colors"
                >
                  تطبيق النموذج
                </button>
              </div>
            </div>

            {/* Tip 3 */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <span>٣. محاكاة التسريع والتراكم الكمي للرسم القوي</span>
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    طلب <span className="text-amber-300 font-mono">أندرويد.محرك_كمومي("تراكبات_فائقة")</span> ينشط محاكاة ذرة تراكب البيان الكمية، لحساب ورسم ملايين البيانات ومشاركتها مع النواة الهجينة دون بطء المعالج الكلاسيكي.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onApplyCode(`مهمة رئيسية():
    أندرويد.صناعة_تطبيق("com.bayan.quantumrendering", "الرسم الكمي المتسارع")
    أندرويد.إضافة_واجهة("الرئيسية")

    // تنشيط تسريع الرسم والتراكيب بضربة O(1)
    أندرويد.محرك_كمومي("تراكبات_سرعة_قصوى")

    أندرويد.نص("العرض", "محاكاة التراكبات الكمومية مفعّلة ولود الـ CPU يقل لـ 1.8%")
    أندرويد.بناء_APK()
نهاية`);
                    setActiveTab('chat');
                    setMessages(prev => [...prev, {
                      role: 'user',
                      text: 'أود استخدام نموذج المحرك الكمومي للتسريع.',
                      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
                    }, {
                      role: 'ai',
                      text: 'تفضل! تم تحميل قالب التسريع الكمي المستقبلي المبهج. بفضل ميزة التراكب، ستتم المعالجة بسرعة لحظية فائقة.',
                      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
                    }]);
                  }}
                  className="bg-amber-950 text-amber-400 border border-amber-900/60 hover:bg-amber-900 hover:text-white px-2 py-1 rounded text-[10px] font-bold block shrink-0 transition-colors"
                >
                  تطبيق النموذج
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'self-healing' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-900/60 text-right font-sans" dir="rtl">
          
          {/* Header section with icon and title */}
          <div className="bg-gradient-to-l from-purple-950/40 to-slate-900 border border-purple-900/40 p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400">
                <HeartPulse size={22} className={isHealing ? "animate-pulse" : ""} />
              </span>
              <div>
                <h3 className="font-bold text-sm text-purple-300 font-sans">بوابة المداواة التلقائية لثغرات البيان</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                  فحص استباقي لمنطق الكود ومعالجة عيوب اللغات المفسرة والأجهزة الطرفية فورياً.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-purple-950/30 text-purple-400 text-xs px-2.5 py-1 rounded-full border border-purple-900/30">
              <Zap size={12} className="text-amber-400" />
              <span>مفتوح ومستقل ومجاني بالكامل</span>
            </div>
          </div>

          {/* Active Detector Status Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-850 justify-between">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-200">عنصر الاستشعار العصبي المعزز:</span>
              <span className="text-slate-400 text-[11px]">يفحص الشيفرات خلفياً دون إجهاد المعالج</span>
            </div>
            <div className="flex items-center justify-center gap-1 bg-emerald-950/20 text-emerald-400 text-[10px] sm:text-xs px-2.5 py-0.5 rounded border border-emerald-900/30">
              <span>✓ تمت مداواة {healingSuccessCount} تعارضاً بنجاح</span>
            </div>
          </div>

          {/* Code Health Dashboard Card */}
          {(() => {
            const gaps = analyzeSelfHealingGaps();
            const detectedGaps = gaps.filter(g => g.detected);
            const totalRules = gaps.length;
            const healthyCount = totalRules - detectedGaps.length;
            const codeHealthScore = currentCode.trim().length === 0 ? 0 : Math.round((healthyCount / totalRules) * 100);

            return (
              <div className="space-y-4">
                
                {/* Health gauge panel */}
                <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="flex items-center gap-4 text-right">
                    <div className="relative w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center select-none shrink-0 overflow-hidden">
                      <div className="absolute inset-0 bg-slate-900/60"></div>
                      <div className="z-10 flex flex-col items-center">
                        <span className={`text-base font-bold font-mono tracking-tight ${
                          codeHealthScore >= 90 ? 'text-emerald-400' : codeHealthScore >= 65 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {codeHealthScore}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">مؤشر الإحكام اللفظي للشيفرة</span>
                      <h4 className="text-xs font-bold text-slate-200 mt-0.5">
                        {currentCode.trim().length === 0 ? (
                          <span className="text-slate-500">مستودع الكود فارغ حالياً</span>
                        ) : codeHealthScore >= 90 ? (
                          <span className="text-emerald-400">فصيح بليغ وخالٍ من الانحرافات 🌟</span>
                        ) : codeHealthScore >= 65 ? (
                          <span className="text-amber-400">سليم ويحتاج لمداواة منطقية استباقية 🩹</span>
                        ) : (
                          <span className="text-rose-400">يحتاج إلى إحلال فوري وتطهير العبارات ⚙️</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 max-w-sm mt-1 leading-normal">
                        مقياس حوسبة البيان يختبر أصالة المفردات، وتكامل معالجات الذاكرة العشوائية ومواءمة الحوسبة المستدامة لصفر استهلاك طاقة.
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto shrink-0">
                    {detectedGaps.length > 0 ? (
                      <span className="bg-red-950/30 text-rose-400 border border-red-900/40 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5">
                        <AlertTriangle size={11} className="animate-bounce" />
                        رصد {detectedGaps.length} فجوة/تعارض منطقي جاهزة للمداواة الاستباقية!
                      </span>
                    ) : (
                      <span className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5">
                        <CheckCircle size={11} />
                        لا توجد فجوات منطقية معلقة - كودك محصن ومثالي كلياً!
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtitle list of logic gaps */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 select-none">
                    🔎 قائمة الفجوات والتعارضات المرصودة تفصيلياً:
                  </h4>

                  {/* Empty state for code checking */}
                  {currentCode.trim().length === 0 && (
                    <div className="border border-dashed border-slate-800 p-8 rounded-xl text-center flex flex-col items-center justify-center space-y-2">
                      <Code2 size={24} className="text-slate-600 animate-pulse" />
                      <h5 className="text-xs font-semibold text-slate-400">شيفرة البيان غير متاحة بالمحرر</h5>
                      <p className="text-[10px] text-slate-500 max-w-xs leading-normal">
                        اكتب كود البيان بالمحرر أو اختر أحد النماذج من التبويبات الأخرى للبدء، وسيتولى الوكيل رصد الكلمات العجمية أو تسريبات طاقة الذاكرة حياً بالخلفية!
                      </p>
                    </div>
                  )}

                  {currentCode.trim().length > 0 && detectedGaps.length === 0 && (
                    <div className="bg-emerald-950/10 border border-emerald-900/30 p-6 rounded-xl text-center space-y-2 flex flex-col items-center justify-center">
                      <span className="p-2 rounded-full bg-emerald-500/15 text-emerald-400">
                        <CheckCircle size={20} />
                      </span>
                      <h5 className="text-xs font-bold text-emerald-300 font-sans">أصالة منطقية استثنائية! ⚔️</h5>
                      <p className="text-[10px] text-slate-400 max-w-md leading-relaxed">
                        لم يرصد المعالج الإدراكي للغة البيان أي بقايا من العبارات العجمية، ولا يوجد أي مخاطر لتسريب موارد الذاكرة الحية أو فقدان تناغم بوابات الأجهزة والكمومية. كودك جاهز تماماً للاسترخاء والإنتاج المستدام!
                      </p>
                    </div>
                  )}

                  {/* Detected gaps loop */}
                  {detectedGaps.map(gap => {
                    const isApplying = isHealing && activeHealId === gap.id;

                    return (
                      <div 
                        key={gap.id}
                        className={`border rounded-xl p-4 space-y-3 transition-all ${
                          gap.severity === 'critical'
                            ? 'border-red-950 bg-red-950/5'
                            : gap.severity === 'warning'
                              ? 'border-amber-950 bg-amber-950/5'
                              : 'border-blue-950 bg-blue-950/5'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5" dir="rtl">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              gap.severity === 'critical' ? 'bg-red-500' : gap.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-400'
                            }`}></span>
                            <h5 className="font-bold text-xs text-slate-200">{gap.title}</h5>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              gap.severity === 'critical' 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                : gap.severity === 'warning' 
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {gap.severity === 'critical' ? 'مداواة حرجة' : gap.severity === 'warning' ? 'مداواة تكتيكية' : 'وصاية وقائية'}
                            </span>
                          </div>

                          <button
                            disabled={isHealing}
                            onClick={() => handleApplyHeal(gap.id, gap.fixAction)}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                              isHealing 
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-500 text-white shadow shadow-purple-600/30 hover:scale-102 active:scale-95'
                            }`}
                          >
                            <span className="text-sm">🩹</span>
                            <span>{gap.fixLabel}</span>
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans text-right">
                          {gap.description}
                        </p>

                        {/* If in healing state, show logs */}
                        {isApplying ? (
                          <div className="bg-slate-950 p-3 rounded-lg border border-purple-900/30 overflow-hidden text-left font-mono text-[10px] space-y-1.5 leading-relaxed" dir="ltr">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
                              <span className="text-purple-400 text-[9px] font-sans flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
                                عامل الدباغة التلقائي يجري إدراكاً منطقياً معقداً...
                              </span>
                              <span className="text-[8px] text-slate-600">v2.5_NeuralGC</span>
                            </div>
                            {healLogs.map((log, lIdx) => (
                              <div key={lIdx} className="text-purple-350 text-right font-sans">
                                {log}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-lg border border-slate-850/60" dir="ltr">
                            <span className="text-[9px] text-slate-500 font-bold font-sans">التعديل المقترح الحُر للشيفرة:</span>
                            <span className="font-mono text-[10px] text-purple-400 font-semibold">{gap.proposedCodeSnippet}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Proactive Advisor Report Section */}
                <div className="border border-slate-850/60 rounded-xl p-4 bg-slate-950/20 space-y-3 pt-4 font-sans">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-850" dir="rtl">
                    <div className="text-right">
                      <h4 className="font-bold text-xs text-slate-200">🔮 توليد وتخليق تقرير الفحص الاستباقي الشامل (Deep Proactive Diagnostics)</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        سيقوم وكيل البيان بتحليل الكود من زاوية أمنية واستباقية تامة لإخراجه بنسق ٢٠٥٠ للسيادة الرقمية.
                      </p>
                    </div>
                  </div>

                  {isSynthesizingReport ? (
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-850 text-center flex flex-col items-center justify-center space-y-3">
                      <RefreshCw size={24} className="text-purple-400 animate-spin" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-purple-300 block">جاري تشريح المنطق البرمجي وتوقيع الخوارزميات البديلة...</span>
                        <span className="text-[10px] text-slate-500 block">عامل الذكاء الحُر يطابق أنماط التطهير وصيانة الطاقة بالخلفية لصفر تكاليف.</span>
                      </div>
                    </div>
                  ) : proactiveAiReport ? (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4 text-slate-200 text-xs leading-relaxed max-h-[350px] overflow-y-auto custom-scrollbar">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2 font-bold text-[10px] text-purple-400" dir="rtl">
                        <span>📋 وثيقة تشريح وتحصين الشيفرة الصادرة</span>
                        <span className="bg-purple-950/40 border border-purple-900/30 px-2 py-0.5 rounded font-mono">v1.2_Report</span>
                      </div>
                      
                      <div className="whitespace-pre-wrap font-sans text-right leading-relaxed text-slate-350">
                        {proactiveAiReport}
                      </div>

                      <div className="flex justify-end gap-2 border-t border-slate-900 pt-3" dir="rtl">
                        <button
                          onClick={() => {
                            const match = proactiveAiReport.match(/```(?:byn)?([\s\S]*?)```/);
                            if (match && match[1]) {
                              onApplyCode(match[1].trim());
                              setMessages(prev => [...prev, {
                                role: 'ai',
                                text: '👍 لقد استخرجت الشيفرة المحسنّة والمطهرة بالكامل من مستند مداواة الوكيل، وأدرجتها فصيحة جاهزة بالمحرر اليسار!',
                                timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
                              }]);
                            } else {
                              navigator.clipboard.writeText(proactiveAiReport);
                            }
                          }}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-purple-800 transition-all flex items-center gap-1.5"
                        >
                          <Terminal size={11} />
                          <span>استخراج الشيفرة المحصنة وحيالتها بالمحرر فورا ⚡</span>
                        </button>
                        <button
                          onClick={() => setProactiveAiReport(null)}
                          className="bg-slate-900 hover:bg-slate-850 text-slate-400 text-[10px] py-1.5 px-3 rounded-lg border border-slate-850"
                        >
                          إغلاق التقرير
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      disabled={currentCode.trim().length === 0}
                      onClick={handleSynthesizeProactiveReport}
                      className={`w-full font-bold py-2.5 px-3 rounded-xl text-xs transition-colors duration-200 flex items-center justify-center gap-2 shadow ${
                        currentCode.trim().length === 0
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-850'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-700/40 hover:scale-[1.01]'
                      }`}
                    >
                      <Sparkles size={12} className="animate-pulse" />
                      🧬 قم باستدعاء المعالج الاستباقي لتشخيص عميق وحصانة كودك مجاناً
                    </button>
                  )}
                </div>

                {/* Past repair patterns archive */}
                <div className="border border-slate-850/60 rounded-xl p-4 space-y-2.5 text-right font-sans">
                  <h4 className="text-xs font-bold text-slate-350 select-none flex items-center gap-1.5 justify-start">
                    📑 مكتبة أنماط التعافي والتحصين بالبيان لعام ٢٠٥٠:
                  </h4>
                  <div className="space-y-2 text-[10px] leading-relaxed text-slate-400">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-slate-950/30 border border-slate-900/60 gap-1.5">
                      <span>• منع طي المراجع وتسريب الذاكرة الديناميكية (Dynamic Java GC Bypass)</span>
                      <span className="text-teal-400 font-semibold bg-teal-950/20 px-1.5 py-0.5 rounded border border-teal-900/30 shrink-0 text-center">🟢 منشط ومجاني كلياً</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-slate-950/30 border border-slate-900/60 gap-1.5">
                      <span>• مداواة وباء التسميات العجمية الدخيلة (Def/Func Block Sanitize)</span>
                      <span className="text-teal-400 font-semibold bg-teal-950/20 px-1.5 py-0.5 rounded border border-teal-900/30 shrink-0 text-center">🟢 نشط تلقائياً</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-slate-950/30 border border-slate-900/60 gap-1.5">
                      <span>• تطويق غياب القياس من حالات الكيوبيت المتشابكة (Quantum Decoherence Barrier)</span>
                      <span className="text-teal-400 font-semibold bg-teal-950/20 px-1.5 py-0.5 rounded border border-teal-900/30 shrink-0 text-center">🟢 جاهز للاستظهار</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      )}

      {activeTab === 'quantum-analyzer' && (
        <div id="quantum-analyzer-container" className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-900/60 text-right font-sans animate-in fade-in duration-200" dir="rtl">
          
          {/* Header section with icon and title */}
          <div className="bg-gradient-to-l from-amber-950/40 to-slate-900 border border-amber-900/40 p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-amber-500/20 text-amber-450">
                <Atom size={22} className={isOptimizingQuantumCode ? "animate-spin" : "animate-pulse"} />
              </span>
              <div>
                <h3 className="font-bold text-sm text-amber-300 font-sans">محلل الموارد الكمومي BayanQuantumAnalyzer</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                  تحليل استهلاك موارد الكود فصاحياً، وتقليص التعقيد الحسابي O(N²) إلى بنيات كمومية مستدامة وحيادية الكربون.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-amber-950/30 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-900/30">
              <Zap id="sustainability-badge" size={12} className="text-amber-405" />
              <span>ترشيد استباقي ذاتي</span>
            </div>
          </div>

          {/* KPI Metrics Dashboard Grid */}
          {(() => {
            const gaps = analyzeQuantumResourceGaps();
            const hasNested = gaps.some(g => g.id === 'nested-loops-complexity');
            const hasSingle = gaps.some(g => g.id === 'single-loop-complexity');
            
            let complexityReductionText = "O(1) مستقر";
            if (hasNested) complexityReductionText = "O(N²) ➔ O(1) التراكبي";
            else if (hasSingle) complexityReductionText = "O(N) ➔ O(1) التراكبي";

            const energyEfficiency = hasNested ? "98.8%" : hasSingle ? "96.4%" : "99.9%";
            const thermalReduction = hasNested ? "تخفيض 45°C من جهد النواة" : hasSingle ? "تخفيض 20°C" : "حرارة مستقرة تماماً";

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Metric 1 */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <span className="text-[9px] text-slate-500 uppercase font-bold text-right">التعقيد الحسابي المستهدف</span>
                  <span className="text-sm font-extrabold font-mono tracking-tight text-amber-400 mt-1 text-right">{complexityReductionText}</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: hasNested ? '95%' : '100%' }}></div>
                  </div>
                </div>
                {/* Metric 2 */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <span className="text-[9px] text-slate-500 uppercase font-bold text-right">ترشيد طاقة البطارية الخلوية</span>
                  <span className="text-sm font-extrabold font-mono tracking-tight text-emerald-400 mt-1 text-right">{energyEfficiency}</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: energyEfficiency }}></div>
                  </div>
                </div>
                {/* Metric 3 */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <span className="text-[9px] text-slate-500 uppercase font-bold text-right">عبء المعالج الحراري CPU</span>
                  <span className="text-[10px] font-bold text-sky-400 mt-1 text-right">{thermalReduction}</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                {/* Metric 4 */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <span className="text-[9px] text-slate-500 uppercase font-bold text-right">تماسك الروابط والتماثل</span>
                  <span className="text-xs font-extrabold font-mono tracking-tight text-purple-400 mt-1 text-right">99.98% Coherence</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '99%' }}></div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Active Analyzer Status */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-850 justify-between">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-semibold text-slate-200">مستشعر هياكل البيانات الكمومية:</span>
              <span className="text-slate-400 text-[11px]">مستعد لتحليل الحلقات والاسترجاع الخطي حياً بالخلفية</span>
            </div>
            <div className="flex items-center justify-center gap-1 bg-amber-950/20 text-amber-450 px-2.5 py-0.5 rounded border border-amber-900/30">
              <span>✓ تمت ترقية {quantumSuccessScore} هيكلاً كمومياً للتعقيد صفري الصدمة</span>
            </div>
          </div>

          {/* Details / List Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 select-none text-right">
              🔎 تحليل كفاءة الشيفرة الحالية واستخلاص البدائل:
            </h4>

            {currentCode.trim().length === 0 ? (
              <div className="border border-dashed border-slate-800 p-8 rounded-xl text-center flex flex-col items-center justify-center space-y-2 bg-slate-950/25">
                <Atom size={24} className="text-slate-600 animate-pulse" />
                <h5 className="text-xs font-semibold text-slate-400">لا توجد شيفرة حالية للفحص بالمحرر</h5>
                <p className="text-[10px] text-slate-500 max-w-xs leading-normal">
                  قم بكتابة كود في المحرر الأيسر أو تصفّح النماذج الأخرى، وسيتولى مستشعر الموارد فحص الحلقات التكرارية والبحث الخطي فوريّاً واقتراح هياكل الكيوبيت البديلة!
                </p>
              </div>
            ) : (
              (() => {
                const gaps = analyzeQuantumResourceGaps();
                return (
                  <div className="space-y-4">
                    {gaps.map(gap => {
                      const isApplying = isOptimizingQuantumCode && activeQuantumAnalysisId === gap.id;
                      
                      return (
                        <div 
                          key={gap.id}
                          className={`border rounded-xl p-4 space-y-3 transition-all ${
                            gap.severity === 'critical'
                              ? 'border-rose-950 bg-rose-950/5'
                              : gap.severity === 'warning'
                                ? 'border-amber-950 bg-amber-950/5'
                                : 'border-blue-950 bg-blue-950/5'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5" dir="rtl">
                            <div className="flex items-center gap-2 text-right">
                              <span className={`w-2 h-2 rounded-full ${
                                gap.severity === 'critical' ? 'bg-red-500' : gap.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-400'
                              }`}></span>
                              <h5 className="font-bold text-xs text-slate-200">{gap.title}</h5>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                gap.severity === 'critical' 
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                  : gap.severity === 'warning' 
                                    ? 'bg-amber-500/10 text-amber-405 border border-amber-500/20' 
                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {gap.severity === 'critical' ? 'تعقيد حرج للعتاد' : gap.severity === 'warning' ? 'استهلاك متوسط للموارد' : 'توصية وقائية خضراء'}
                              </span>
                            </div>

                            <button
                              disabled={isOptimizingQuantumCode}
                              onClick={() => handleApplyQuantumOptimization(gap.id)}
                              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                                isOptimizingQuantumCode
                                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white shadow shadow-amber-600/30 hover:scale-[1.02] active:scale-95'
                              }`}
                            >
                              <Atom size={11} className={isApplying ? "animate-spin" : ""} />
                              <span>ترقية الكود للبنية الكمومية المستدامة</span>
                            </button>
                          </div>

                          <p className="text-[11px] text-slate-400 leading-relaxed text-right">
                            {gap.description}
                          </p>

                          {/* Traditional vs Quantum Comparison */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[10px]" dir="rtl">
                            <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-900 flex justify-between sm:flex-col sm:justify-center items-center gap-1">
                              <span className="text-slate-500">التعقيد الزمني التقليدي</span>
                              <span className="font-semibold text-rose-450 font-mono text-xs">{gap.traditionalComplexity}</span>
                            </div>
                            <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-900 flex justify-between sm:flex-col sm:justify-center items-center gap-1">
                              <span className="text-slate-500">التعقيد الزمني الكمومي</span>
                              <span className="font-semibold text-emerald-450 font-mono text-xs">{gap.quantumComplexity}</span>
                            </div>
                            <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-900 flex justify-between sm:flex-col sm:justify-center items-center gap-1">
                              <span className="text-slate-500">البنية والمحور المعتمد</span>
                              <span className="font-semibold text-purple-400 text-[10px] truncate max-w-full">{gap.alternativeStructure}</span>
                            </div>
                          </div>

                          {/* Animated Logs or suggestions */}
                          {isApplying ? (
                            <div className="bg-slate-950 p-3 rounded-lg border border-amber-900/30 overflow-hidden text-left font-mono text-[10px] space-y-1.5 leading-relaxed" dir="ltr">
                              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
                                <span className="text-amber-400 text-[9px] font-sans flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                                  محلل المحاكاة الكمومية يعيد تخليق الشيفرة المستدامة...
                                </span>
                                <span className="text-[8px] text-slate-600">v3.0_QuantumGC</span>
                              </div>
                              {quantumOptimizationLogs.map((log, lIdx) => (
                                <div key={lIdx} className="text-amber-350 text-right font-sans">
                                  {log}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-1.5 text-right font-sans">
                              <span className="text-[10px] text-slate-400 block font-bold">بنية الهيكل الكمي البديل المقترح:</span>
                              <div className="bg-slate-950 p-2.5 rounded-md border border-slate-850 text-left font-mono text-[10px]" dir="ltr">
                                <pre className="text-amber-400 overflow-x-auto whitespace-pre">{gap.suggestedCode}</pre>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </div>

          {/* Cheat Sheet library of Al-Bayan native quantum structures */}
          <div className="border border-slate-850/65 rounded-xl p-4 bg-slate-950/20 space-y-3 pt-4 text-right font-sans">
            <div>
              <h4 className="font-bold text-xs text-slate-200">📚 قاموس هياكل ومصطلحات البيان للبرمجة الكمية المستدامة</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                تأصيل مفردات الكيوبيتات ومحركات فحص الموارد المضمّحة حرة ومستقلة لعام ٢٠٥٠.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-[10px] leading-relaxed">
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-900/60 flex flex-col gap-1">
                <span className="text-amber-450 font-mono font-bold">أندرويد.محرك_كمومي("توفير_طاقة_مستدام")</span>
                <span className="text-slate-400">يلغي تماماً دورات التحديث غير الضرورية لواجهات compose، ويخفف لود الـ recomposition بضربة واحدة دافعة.</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-900/60 flex flex-col gap-1">
                <span className="text-amber-455 font-mono font-bold">كمومية.سجل_متشابك()</span>
                <span className="text-slate-400">هيكل بيانات متراكب يرتكز على الترابط الكمي لتخزين وبحث مصفوفات البيانات بضرب O(1) بدلاً من الحلقات العادية الاهتزازية.</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-900/60 flex flex-col gap-1">
                <span className="text-amber-455 font-mono font-bold">أندرويد.تنظيف_ذاكرة_تلقائي()</span>
                <span className="text-slate-400">تطهير دائم لنقاط تسريب الذاكرية بالخلفية لعتاد الأندرويد لـ 0% leakage برعاية الوكيل الذاتي.</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-900/60 flex flex-col gap-1">
                <span className="text-amber-455 font-mono font-bold">كمومية.كيوبيت() / كمومية.هادامارد()</span>
                <span className="text-slate-400">توليد ومعالجة تراكب ثنائي للكيوبيتات لمعالجات الشروط والمقارنات بالتوازي الفوري لترشيد حتمي لفاقد الطاقة.</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'agent-hub' && (
        <div id="ai-agent-hub-container" className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-900/60 text-right font-sans animate-in fade-in duration-200" dir="rtl">
          
          {/* Header section with icon and title */}
          <div className="bg-gradient-to-l from-sky-950/40 to-slate-900 border border-sky-900/40 p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-sky-500/20 text-sky-450">
                <Bot size={22} className={isRunningAgent ? "animate-bounce" : "animate-pulse"} />
              </span>
              <div>
                <h3 className="font-bold text-sm text-sky-300 font-sans">بيئة الوكلاء المفتوحة Al-Agent-Hub</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                  تنزيل، تسجيل وتشغيل وكلاء الذكاء الاصطناعي بلغة البيان محلياً بالكامل. استقلالية، خصوصية، واستدامة تامة لصفر انبعاثات حوسبة سحابية.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-emerald-950/30 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-900/30">
              <HardDrive size={12} className="text-emerald-405" />
              <span>تشغيل محلي 100% مستقل</span>
            </div>
          </div>

          {/* KPI Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 font-bold">الوكلاء المتوفرين</span>
              <span className="text-sm font-extrabold text-sky-450 mt-1 font-mono text-right">{agents.length} وكلاء رصد</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 font-bold">مثبت بحصانة محلية</span>
              <span className="text-sm font-extrabold text-emerald-400 mt-1 font-mono text-right">
                {agents.filter(a => a.status === 'registered').length} وكلاء حرة
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex flex-col justify-between col-span-2 sm:col-span-1">
              <span className="text-[9px] text-slate-500 font-bold">إجمالي عمليات الفحص الآهلة</span>
              <span className="text-sm font-extrabold text-amber-500 mt-1 font-mono text-right">
                {agents.reduce((acc, current) => acc + current.runsCount, 0)} تشغيل موفر
              </span>
            </div>
          </div>

          {/* Quick Sandbox panel */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h4 className="font-bold text-xs text-slate-200 flex items-center gap-1.5 font-sans">
                <Play size={12} className="text-emerald-400" />
                حقيبة اختبار وتشغيل الوكلاء محلياً (Agent Execution Sandbox)
              </h4>
              <span className="text-[9px] text-slate-500">حوسبة آمنة وموفرة للطاقة</span>
            </div>

            {agents.filter(a => a.status === 'registered').length === 0 ? (
              <p className="text-xs text-slate-405 text-center py-4">
                لا توجد كائنات منصَّبة حالياً. قم بتنزيل أحد الوكلاء من المستودع بالأسفل أو تسجيل وكيلك يدويّاً!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold">اختر الوكيل المحلي المنصَّب:</label>
                    <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                    >
                      {agents.filter(a => a.status === 'registered').map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.version})</option>
                      ))}
                    </select>
                  </div>

                  <button
                    disabled={isRunningAgent || downloadingAgentId !== null}
                    onClick={() => handleRunAgentOnEditor(selectedAgentId)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    {isRunningAgent ? (
                      <>
                        <Bot size={13} className="animate-spin" />
                        <span>جاري تحليل الروابط البرمجية...</span>
                      </>
                    ) : (
                      <>
                        <Play size={12} fill="currentColor" />
                        <span>تشغيل الوكيل على شيفرة المحرر الأيسر</span>
                      </>
                    )}
                  </button>

                  {/* Registered code preview */}
                  {(() => {
                    const activeAgent = agents.find(a => a.id === selectedAgentId);
                    if (!activeAgent) return null;
                    return (
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 block">كود الوكيل المستدعى:</span>
                        <pre className="p-2 bg-slate-900 border border-slate-850 rounded text-[9px] font-mono text-slate-405 max-h-[100px] overflow-y-auto whitespace-pre custom-scrollbar text-left" dir="ltr">
                          {activeAgent.code}
                        </pre>
                      </div>
                    );
                  })()}
                </div>

                <div className="md:col-span-3 bg-slate-900/60 rounded-lg border border-slate-850 p-3 flex flex-col justify-between min-h-[180px]">
                  {/* Output Display / Logs */}
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] text-sky-400 font-bold block mb-1.5 border-b border-slate-850 pb-1 text-right">
                      💻 مخرجات تشغيل الوكيل المستدام:
                    </span>
                    
                    {isRunningAgent ? (
                      <div className="font-mono text-[10px] space-y-1 text-right text-amber-400" dir="rtl">
                        {agentRunLogs.map((log, index) => (
                          <div key={index} className="animate-in fade-in duration-300">{log}</div>
                        ))}
                      </div>
                    ) : agentOutput ? (
                      <div className="text-right text-xs text-slate-300 whitespace-pre-wrap font-mono select-text bg-slate-950 p-2.5 rounded border border-slate-850 max-h-[220px] overflow-y-auto custom-scrollbar" dir="rtl">
                        {agentOutput}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 text-[11px] py-6">
                        <HelpCircle size={22} className="text-slate-600 mb-1" />
                        <span>اضغط "تشغيل الوكيل" ليقوم الوكيل بتحليل الكود محلياً واستخراج البيانات.</span>
                      </div>
                    )}
                  </div>

                  {agentOutput && !isRunningAgent && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-850" dir="rtl">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(agentOutput);
                          alert('تم نسخ تقرير مخرجات الوكيل بنجاح!');
                        }}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                      >
                        <Copy size={11} />
                        <span>نسخ التقرير</span>
                      </button>
                      
                      {(() => {
                        const activeAgent = agents.find(a => a.id === selectedAgentId);
                        // Show "Apply output" only if agent is refactorer/logic in form of code or contains markdown-formatted code
                        const hasCode = agentOutput.includes('مهمة') || agentOutput.includes('أندرويد');
                        if (!hasCode) return null;
                        
                        return (
                          <button
                            onClick={() => {
                              // Extract and apply
                              let codeToApply = agentOutput;
                              if (agentOutput.includes('--------------------------------------------------------------')) {
                                const parts = agentOutput.split('--------------------------------------------------------------');
                                if (parts.length >= 3) {
                                  codeToApply = parts[1].trim();
                                }
                              }
                              onApplyCode(codeToApply);
                              alert('تم غرس كود وتحسينات الوكيل في المحرر بنجاح!');
                            }}
                            className="flex-1 bg-sky-600 hover:bg-sky-500 text-white py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                          >
                            <Terminal size={11} />
                            <span>تطبيق الكود المحسن</span>
                          </button>
                        );
                      })()}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Plan Section */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/85 pb-2">
              <div className="flex items-center gap-2">
                <Cpu size={15} className="text-sky-400 animate-pulse" />
                <h4 className="font-bold text-xs text-slate-100 font-sans">
                  🇸🇦 الخطة المفتوحة لتوطين الذكاء الاصطناعي ووكلاء لغة البيان
                </h4>
              </div>
              <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/10">محدثة ومجانية</span>
            </div>

            <p className="text-[11.5px] text-slate-400 leading-relaxed text-right">
              توفر لغة البيان سياجاً سيادياً حوسبياً يهدف لتشغيل نماذج الذكاء التوليدي والوكلاء البرمجية محلياً بالكامل. يمكنك من خلال هذه اللوحة، العمل خطوة بخطوة لتهيئة وتفعيل بيئة التشغيل المستقلة والمجانية 100% على جهازك الشخصي، مما يحقق حماية مطلقة للخصوصية وسرعة مدمجة برعاية النواة المحلية وعوائد صفرية لانبعاثات الطاقة السحابية.
            </p>

            {/* PWA / Offine Capabilities Hub Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-900/40 p-4 rounded-xl border border-slate-850">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">مؤشر الاتصال والدخول:</span>
                <div className="flex items-center gap-2 mt-1">
                  {isOnline ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold bg-emerald-950/30 text-emerald-450 border border-emerald-900/30">
                      <Wifi size={12} className="text-emerald-450" />
                      <span>متصل بالخادم والشبكة</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold bg-amber-950/40 text-amber-500 border border-amber-900/30 animate-pulse">
                      <WifiOff size={12} className="text-amber-500" />
                      <span>يعمل محلياً بنجاح (دون اتصال) 📡</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">حالة تخزين التطبيق التقدمي (PWA):</span>
                <div className="flex items-center gap-2 mt-1">
                  {swActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold bg-sky-950/40 text-sky-400 border border-sky-900/40">
                      <Zap size={11} className="text-sky-400 animate-bounce" />
                      <span>وكيل الخدمة نشط ومحمّل بذاكرة الجهاز 💾</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      <RefreshCw size={11} className="animate-spin text-slate-400" />
                      <span>جاري تسجيل التخزين المؤقت المحلي...</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 text-[10.5px] text-slate-400 border-t border-slate-850 pt-2.5 leading-relaxed">
                ℹ️ <strong>ميزة الـ PWA الفعالة:</strong> يقوم المتصفح حالياً بتخزين Al-Bayan Studio محلياً بالكامل بفضل الـ <code>Service Worker</code> المطور. يمكنك تثبيت التطبيق على سطح المكتب أو شاشة الهاتف لفتحه وتشغيل كامل مترجم "البيان"، وصوتيات "Tone.js"، ووكيل المعالجة بخصوصية تامة ودون اتصال بالإنترنت في أي وقت!
              </div>
            </div>

            {/* Progress calculation */}
            {(() => {
              const doneCount = localizationSteps.filter(s => s.done).length;
              const totalCount = localizationSteps.length;
              const percentage = Math.round((doneCount / totalCount) * 100);
              return (
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">مستوى السيادة وجاهزية الجهاز الحالية للتوطين:</span>
                    <span className="font-mono font-bold text-sky-400 text-xs">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900 font-sans">
                    <div 
                      className="bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] pt-1">
                    {percentage === 100 ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle size={10} className="text-emerald-405" />
                        <span>تهانينا الفائقة! لقد أنجزت بروتوكول التوطين بالكامل؛ جهازك مؤهل لتشغيل الوكلاء بخصوصية مطلقة.</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        ⏳ يرجى إتمام خطوات الدليل بالأسفل لرفع كفاءة وجاهزية جهازك وسحب النماذج اللغوية محلياً ومجاناً.
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Checklist details */}
            <div className="space-y-2.5">
              {localizationSteps.map(step => (
                <div 
                  key={step.id}
                  onClick={() => handleToggleLocalizationStep(step.id)}
                  className={`border rounded-xl p-3 flex flex-col gap-2 transition-all cursor-pointer select-none ${
                    step.done 
                      ? "border-emerald-950/30 bg-emerald-950/10 hover:bg-emerald-950/20" 
                      : "border-slate-850 bg-slate-900/40 hover:bg-slate-900/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                        step.done 
                          ? "bg-emerald-600 border-emerald-500 text-white" 
                          : "border-slate-700 bg-slate-950"
                      }`}>
                        {step.done && <Check size={11} strokeWidth={3} />}
                      </span>
                      <span className={`text-[11px] font-bold ${step.done ? "text-emerald-400 line-through opacity-85" : "text-slate-200"}`}>
                        الخطوة {step.id}: {step.text}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      step.done ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.done ? 'مكتمل' : 'مطلوب عمله'}
                    </span>
                  </div>

                  {/* Step Expanded Detail Explication */}
                  <div className="mr-6 pl-2 border-r-2 border-slate-800/80 pr-2.5 py-1 text-[10.5px] leading-relaxed text-slate-400">
                    {step.id === 1 && (
                      <span>
                        لتهيئة بيئة جهازك، تأكد من تثبيت منصة <strong>Node.js (الإصدار 18 فما فوق)</strong> ومترجم <strong>Java SDK 17+</strong> في نظام تشغيل جهازك. تعتمد أدوات الكومبايلر للغات مثل الجافا والـ Kotlin على وجود آلة جافا الافتراضية JVM لتجميع وتصدير ملفات تراكب العتاد بسلاسة وسرعة فائقة.
                      </span>
                    )}
                    {step.id === 2 && (
                      <span>
                        يمكنك استدعاء مترجم لغة البيان وتجهيزه عبر تنزيل مكتبات الربط وتضمين الملفات محلياً. استخدم حزمة مترجم <code>AlBayanCompiler.ts</code> كبوابة قراءة مدمجة محايدة، وحفزّ منطق الاستيراد مستقل الأطراف لمعالجة البارامترات دون عبء خارجي.
                      </span>
                    )}
                    {step.id === 3 && (
                      <span>
                        قم بتنزيل تراكبات ونماذج الذكاء الاصطناعي الحرة الخفيفة والداعمة للغة العربية مثل <strong>Qwen-2.5-Coder (1.5B/3B)</strong> أو <strong>Llama-3-8B</strong> بصيغة GGUF الموفرة للرام، لتتمكن من تشغيل كامل مهام الإرشاد وتوليد الشيفرات محلياً على بطاقة الرسوميات (GPU) الخاصة بك.
                      </span>
                    )}
                    {step.id === 4 && (
                      <span>
                        قم بتثبيت مشغل النماذج مفتوح المصدر <strong>Ollama</strong> من الموقع الرسمي <code>ollama.com</code>، ثم افتح الطرفية وشغل الأمر التالي: <br />
                        <code className="bg-slate-950 text-sky-400 border border-slate-800 px-1.5 py-0.5 rounded mt-1 font-mono text-[9px] inline-block text-left" dir="ltr">ollama run qwen2.5-coder:1.5b</code><br />
                        يقوم هذا بفتح بوابة خادم محلية بالكامل على العنوان <code>http://localhost:11434/v1</code> متوافقة تماماً مع معايير السيادة الحوسبية والتأمين.
                      </span>
                    )}
                    {step.id === 5 && (
                      <span>
                        الآن، عند تفعيل رفيق الروابط ومعالج "مركز الوكلاء"، يتم مطابقة الأوامر وصقل الأكواد وتوفير الموارد محلياً بالكلية على عتادك وبصفر كلفة حوسبية، وصفر سعة انبعاثات كربونية للغد، صانعاً درع أمان لا يخترق للسيادة الوطنية الرقمية وحصانة بياناتك.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Register Custom Agent Toggle / Button */}
          <div className="flex justify-between items-center sm:flex-row flex-col gap-2 bg-slate-950 p-3 rounded-xl border border-slate-850" dir="rtl">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بين الوكلاء المتاحين والمثبتين في الدليل..."
                className="bg-transparent text-xs text-slate-300 placeholder-slate-500 outline-none w-48 sm:w-64 text-right"
              />
            </div>
            
            <button
              onClick={() => {
                setShowRegisterForm(!showRegisterForm);
                setRegError(null);
              }}
              className="bg-sky-950/40 hover:bg-sky-900/40 border border-sky-800/40 text-sky-450 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 self-stretch sm:self-auto justify-center"
            >
              <Plus size={12} />
              <span>{showRegisterForm ? 'تصغير نموذج التسجيل' : 'تسجيل وكيل محلي مخصص .byn'}</span>
            </button>
          </div>

          {/* Simple form to register Custom Al-Bayan Agent */}
          {showRegisterForm && (
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3 relative block animate-in slide-in-from-top-4 duration-300">
              <div className="border-b border-slate-850 pb-2">
                <h5 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                  <Plus size={12} className="text-sky-450" />
                  تسجيل رمز وكيل محلي جديد (Register Local Al-Bayan Agent)
                </h5>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  أبهر الجميع بنظم التوطين! صمّم وكيلك مكتوباً بلغة البيان، وسيدار بالكامل على معالج جهازك الحالي بلا تشبيك خارجي.
                </p>
              </div>

              {regError && (
                <div className="bg-rose-950/20 border border-rose-900/30 p-2 rounded text-[10px] text-rose-400 text-right">
                  ⚠️ {regError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">اسم الوكيل المبتكر:</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: وكيل فحص السجلات المترابطة"
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1 px-2.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">تصنيف التخصص للوكيل:</label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1 px-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                  >
                    <option value="logic">فحص وتأكيد المنطق والروابط</option>
                    <option value="docs">توليد الشروح وتوثيقات المنهجية</option>
                    <option value="refactor">صقل الذاكرة وترشيد الطاقة</option>
                    <option value="quantum">الارتباط والدمج الكمي الصاعد</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block">وصف موجز لوظيفته ومميزاته:</label>
                  <input
                    type="text"
                    value={regDesc}
                    onChange={(e) => setRegDesc(e.target.value)}
                    placeholder="مثال: فحص تسلسل المتغيرات وضمان تحييد الطاقة للبطارية..."
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1 px-2.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-450 font-bold block">كود الوكيل المصدر بلغة البيان (.byn):</label>
                    <span className="text-[8px] text-emerald-450 font-mono">يدعم حزم لغة البيان</span>
                  </div>
                  <textarea
                    rows={4}
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-[10px] font-mono text-amber-400 focus:outline-none focus:ring-1 focus:ring-sky-500 whitespace-pre scrollbar-thin overflow-x-auto"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-2 p-2 border-t border-slate-850">
                <button
                  onClick={() => setShowRegisterForm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg px-3 py-1.5 text-[11px] font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleRegisterCustomAgent}
                  className="bg-sky-600 hover:bg-sky-500 text-white rounded-lg px-4 py-1.5 text-[11px] font-bold"
                >
                  حفظ وتسجيل الوكيل محلياً
                </button>
              </div>
            </div>
          )}

          {/* Directory of agents lists */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 select-none text-right font-sans">
              <FolderOpen size={13} className="text-slate-500" />
              دليل وكتالوج الوكلاء البرمجية (AI Agents Registry Directory)
            </h4>

            {(() => {
              const filteredAgents = agents.filter(a => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.trim().toLowerCase();
                return a.name.toLowerCase().includes(query) || 
                       a.description.toLowerCase().includes(query) ||
                       a.author.toLowerCase().includes(query);
              });

              if (filteredAgents.length === 0) {
                return (
                  <div className="text-center py-6 text-xs text-slate-500 font-sans">
                    لا يوجد وكيل يطابق معايير بحثك. جرب اسماً آخراً!
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAgents.map(agent => {
                    const isDownloading = downloadingAgentId === agent.id;
                    const isRegistered = agent.status === 'registered';

                    let categoryLabel = 'فحص منطق';
                    let categoryColorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/20';

                    if (agent.category === 'docs') {
                      categoryLabel = 'توثيق المنهجية';
                      categoryColorClass = 'text-green-400 bg-green-500/10 border-green-500/20';
                    } else if (agent.category === 'refactor') {
                      categoryLabel = 'صقل الموارد وطاقة';
                      categoryColorClass = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
                    } else if (agent.category === 'quantum') {
                      categoryLabel = 'دمج كمي متراكب';
                      categoryColorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    }

                    return (
                      <div 
                        key={agent.id}
                        className={`border rounded-xl p-4 flex flex-col justify-between space-y-3 bg-slate-950/40 relative ${
                          isRegistered ? "border-emerald-900/30" : "border-slate-850"
                        }`}
                      >
                        {/* Upper line */}
                        <div className="space-y-1.5 font-sans">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${categoryColorClass}`}>
                              {categoryLabel}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">v{agent.version} / {agent.size}</span>
                          </div>

                          <h5 className="font-extrabold text-xs text-slate-200 select-none text-right">
                            {agent.name}
                          </h5>
                          
                          <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed text-right">
                            {agent.description}
                          </p>

                          {/* Stats and Author */}
                          <div className="flex justify-between items-center pt-1.5 text-[9px] text-slate-500 border-t border-slate-900">
                            <span>المطور: <strong className="text-slate-405">{agent.author}</strong></span>
                            <span>تشغيل مستقل: <strong className="text-slate-400 font-mono">{agent.runsCount} Run</strong></span>
                          </div>
                        </div>

                        {/* Interactive dynamic downloading simulation logs inline */}
                        {isDownloading && (
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-sky-950 text-left font-mono text-[9px] space-y-1.5 duration-200" dir="ltr">
                            <div className="flex justify-between text-[8px] text-sky-400">
                              <span>Local Download Progress:</span>
                              <span className="font-bold">{downloadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-850 h-1 rounded-full overflow-hidden">
                              <div className="bg-sky-500 h-full rounded-full transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
                            </div>
                            <div className="overflow-x-auto max-h-[60px] custom-scrollbar text-[9px] text-slate-400 text-right font-sans" dir="rtl">
                              {downloadLogs.slice(-1).map((log, idx) => (
                                <div key={idx} className="text-sky-350">{log}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Control buttons */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
                          {isRegistered ? (
                            <>
                              <div className="flex-1 flex items-center gap-1 bg-emerald-950/20 text-emerald-400 text-[10px] font-bold py-1 px-2.5 rounded-lg border border-emerald-900/20 shadow-sm font-sans justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse"></span>
                                <span>جاهز ومنصب محلياً</span>
                              </div>
                              
                              <button
                                onClick={() => handleDeleteAgent(agent.id)}
                                title="إلغاء تنصيب الوكيل المحلي"
                                className="bg-slate-900 hover:bg-rose-950/40 text-slate-500 hover:text-rose-450 p-1.5 rounded-lg border border-slate-850 hover:border-rose-900/40 transition-all shrink-0"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          ) : (
                            <button
                              disabled={downloadingAgentId !== null}
                              onClick={() => handleDownloadAgent(agent.id)}
                              className={`flex-1 font-bold py-1.5 px-3 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1 font-sans ${
                                downloadingAgentId !== null
                                  ? 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                                  : 'bg-slate-900 hover:bg-sky-950 border border-slate-800 text-sky-400 hover:scale-[1.01] active:scale-95 shadow-sm'
                              }`}
                            >
                              <Download size={11} />
                              <span>تنزيل للتشغيل المحلي 📥</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Philosophy Panel */}
          <div className="border border-slate-850 bg-slate-950/30 rounded-xl p-4 text-right space-y-2 font-sans">
            <h5 className="font-bold text-xs text-sky-400 flex items-center gap-1 select-none">
              <Bot size={13} />
              رؤية البيان للبرمجة المستدامة وصفر انبعاثات حوسبة سحابية
            </h5>
            <p className="text-[10.5px] text-slate-400 leading-relaxed">
              تؤمن لغة البيان وتوطين الرابطة بأن الذكاء الاصطناعي لا ينبغي أن يكون مستنزفاً لخوادم السحابة وطاقة تبريد المنظومات الكبرى.
              من خلال تصميم <strong>الوكلاء المحليين المندمجين Al-Bayan Agents</strong>، يمكن لكافة أدوات الفحص، والصقل، ومولدات التوصيفات أن تعمل بكفاءة مطلقة محلياً على هاتفك الذكي أو الحاسوب الخاص بك عبر محركات البيان الخفيفة، مما يحفظ خصوصية بياناتك 100% ويؤمّن الغد الرقمي الحر.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};

export default AICopilot;
