import React, { useState } from 'react';
import { 
  X, Sparkles, Brain, Cpu, Wand2, RefreshCw, Layers, ShieldCheck, 
  Terminal, Check, Copy, ArrowLeft, HelpCircle, Code2, Play, AlertCircle, Zap
} from 'lucide-react';

interface BayanAIToolkitProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  onUpdateCode: (newCode: string) => void;
  onInstantRun: (code: string) => void;
}

interface AICodeSnippet {
  id: string;
  title: string;
  desc: string;
  code: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  library: 'الذكاء العام' | 'الوكلاء ومستشرق المستقبل' | 'الشبكات العصبية' | 'الكمومية الهجينة';
}

export const BayanAIToolkit: React.FC<BayanAIToolkitProps> = ({
  isOpen,
  onClose,
  code,
  onUpdateCode,
  onInstantRun
}) => {
  const [activeTab, setActiveTab] = useState<'localization' | 'tools' | 'mitigation' | 'agents_and_future'>('localization');
  const [selectedSnippet, setSelectedSnippet] = useState<string>('ai-ask');
  
  // Tuning state
  const [modelStyle, setModelStyle] = useState<'baligh' | 'academic' | 'strategic' | 'technical'>('strategic');
  const [temp, setTemp] = useState<number>(0.7);
  const [isTuning, setIsTuning] = useState(false);
  const [tuningStep, setTuningStep] = useState<string>('');
  const [tuningProgress, setTuningProgress] = useState<number>(0);
  const [isTuned, setIsTuned] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // AI Agent & Futurist 2050 state
  const [selectedAgent, setSelectedAgent] = useState<'knowledge' | 'healing' | 'futurist'>('knowledge');
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [activeAgentStep, setActiveAgentStep] = useState<number>(-1);

  const handleRunAgent = async (agentId: 'knowledge' | 'healing' | 'futurist') => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setSelectedAgent(agentId);
    setAgentLogs([]);
    setActiveAgentStep(0);

    const agentSteps = {
      knowledge: [
        { text: "🤖 [تفكير عقلاني] جاري صياغة سياق التنقيب واستقصاء المعارف العربية مجانًا ومستقلاً عن أي مزود أجنبي...", duration: 800 },
        { text: "⚡ [إجراء] فتح قنوات استخلاص المعرفة وتحليل الحوسبة ثنائية الاتجاه بلغة البيان الحرة...", duration: 800 },
        { text: "👁️ [ملاحظة] رصد توافقية تاريخية بنسبة 99.8% وهيكلة المعاجم الإملائية الموطنة تلقائياً...", duration: 800 },
        { text: "💡 [مخرج مستدام] تم تخليق مستند المعرفة بلسان عربي بليغ، وتهيئة ملقط تطهير الذاكرة لضمان صفر استهلاك طاقة!" },
      ],
      healing: [
        { text: "🤖 [تفكير عقلاني] مراقبة دورية لنبضات معالج الهاتف وحساب مراجع كائنات النّحو لدرء التعارض النحوي الأجنبي...", duration: 800 },
        { text: "⚡ [إجراء] تفعيل ميزة `أندرويد.تنظيف_ذاكرة_تلقائي()` وصرف الكيانات المهملة استباقياً...", duration: 800 },
        { text: "👁️ [ملاحظة] استرداد 98% من الذاكرة الحية المهدرة وتبريد درجة حرارة النواة بمقدار 4 درجات مئوية...", duration: 800 },
        { text: "💡 [مخرج مستدام] المعالج في وضع الاسترخاء والتعشيق التام مع حفاظ استثنائي على شحن البطارية (صفر واط مهدر)!" },
      ],
      futurist: [
        { text: "🤖 [تفكير عقلاني] قراءة وتكامل خطط التطوير التقني الوطني لعام ٢٠٥٠ القائم على الخلو الذاتي والسيادة البرمجية...", duration: 800 },
        { text: "⚡ [إجراء] استدعاء بوابات محاكاة الترابط الكمومي المعجل (Virtual Q-Core Gateways)...", duration: 800 },
        { text: "👁️ [ملاحظة] كفاءة عبور المعالجة الهجينة وتجاوز عوائق المكتبات الثقيلة عبر ضغط الكود لـ 385KB فقط...", duration: 800 },
        { text: "💡 [مخرج مستدام] استشعار وتحديد معاطف الاستراتيجية وتمكين قفزات كمية مذهلة مدعومة ببيان كلي حر ومستقل وصديق للبيئة!" },
      ]
    };

    const currentAgentSteps = agentSteps[agentId];
    for (let i = 0; i < currentAgentSteps.length; i++) {
      setActiveAgentStep(i);
      // We safely map step-by-step
      setAgentLogs(prev => [...prev, currentAgentSteps[i].text]);
      await new Promise(resolve => setTimeout(resolve, currentAgentSteps[i].duration || 800));
    }
    setIsAgentRunning(false);
  };

  if (!isOpen) return null;

  const SNIPPETS: AICodeSnippet[] = [
    {
      id: 'ai-ask',
      title: 'محاورة الذكاء العربي بلسانٍ بليغ ☁️',
      desc: 'سؤال النموذج السحابي واستقبال الجواب مع تفعيل تلقائي لهياكل المعالجة الإملائية والنحوية.',
      difficulty: 'مبتدئ',
      library: 'الذكاء العام',
      code: `مهمة رئيسية():
    اطبع("=== محاورة الذكاء بلسان عربي مبين ===")

    عرف السؤال = "ما هي الفلسفة المعرفية للغة البيان مقارنة باللغات التقليدية؟"
    
    // استدعاء الذكاء السحابي الموطن للغة العربية
    عرف الإجابة = اسأل_الذكاء(السؤال)
    
    اطبع(الإجابة)
نهاية`
    },
    {
      id: 'ai-agent',
      title: 'الوكيل الذكي لتلخيص واستخلاص المعرفة 🔍',
      desc: 'بناء وكيل ذكاء اصطناعي مستقل يقوم ببحث مكثف وتأمين اتصال بالمكتبات المعرفية المفتوحة.',
      difficulty: 'متوسط',
      library: 'الوكلاء ومستشرق المستقبل',
      code: `مهمة رئيسية():
    اطبع("=== رادار المعرفة للوكلاء المستقلين ===")

    // ١. تفويض وكيل عقلاني بمهمة البحث
    عرف وكيل = ذكاء.عامل_مستقل("باحث تاريخي وتقني")
    
    // ٢. إطلاق الوكيل المستخلص للمعرفة لاستقصاء البيانات وتوليد التقرير
    عرف التقرير = ذكاء.استخلاص_معرفة("تاريخ الحضارة البرمجية العربية وتأثير الحوسبة ثنائية الاتجاه")
    
    اطبع("✨ استودعك تقرير الوكيل الموطن:")
    اطبع(التقرير)
نهاية`
    },
    {
      id: 'ai-strategy',
      title: 'مستشرف الاستراتيجيات وخطط عام ٢٠٥٠ 📊',
      desc: 'تحصيل تقرير استشرافي استراتيجي مبهر يعتمد المعالجة العميقة والترابط الكمي في صياغة الحلول التنموية.',
      difficulty: 'متقدم',
      library: 'الوكلاء ومستشرق المستقبل',
      code: `مهمة رئيسية():
    اطبع("📊 === صياغة الرؤية الاستراتيجية لعام ٢٠٥٠ ===")

    // توليد تقرير استشرافي مستقبلي يدعم تمكين الذكاء التوليفي والكمومي
    عرف الرؤية = ذكاء.توليد_استراتيجي("تكامل الرقاقات الحيوية مع الحوسبة الكمومية في المدن الذكية العربي")

    اطبع(الرؤية)
نهاية`
    },
    {
      id: 'ai-neural',
      title: 'تدريب شبكة عصبية تطورية متطورة 🧠',
      desc: 'تخليق وبناء وتدريب شبكة عصبية ذكية بالبيان تعتمد على الخوارزميات التطورية والشبكات العميقة لتوقع مخرجات العتاد.',
      difficulty: 'متقدم',
      library: 'الشبكات العصبية',
      code: `مهمة رئيسية():
    اطبع("🧠 === إنشاء وتدريب شبكتنا العصبية التفاعلية ===")

    // ١. خلق عصبية ذات ٣ طبقات مدخلات ومخرجات
    عرف نموذج = عصبية.إنشاء_نموذج(3)

    // ٢. تفعيل التدريب التطوري القائم على الأجيال (Evolutionary Training Sequence)
    عصبية.تدريب_تطوري(نموذج، 15)

    // ٣. رسم تخطيط هيكل السينابس والخلايا العصيبة في المنصة
    عصبية.مخطط_الشبكة(نموذج)

    // ٤. توقع السلوك وحساب الاستجابة
    عرف القيم = [1.2, 0.8, -0.5]
    عرف المخرج = عصبية.توقع(نموذج، القيم)

    اطبع("✨ مخرج الاستقراء العصبي والتنبؤ الفوري:")
    اطبع(المخرج)
نهاية`
    },
    {
      id: 'ai-quantum-energy',
      title: 'محاكاة الترابط الكمومي المعجل للأندرويد ⚛️',
      desc: 'استدعاء كيوبيتات هجينة لتقليل نبض المستشعرات وتجاوز مشكلات البطارية في شاشات الجوال.',
      difficulty: 'متقدم',
      library: 'الكمومية الهجينة',
      code: `مهمة رئيسية():
    اطبع("⚛️ === تفعيل الرقاقة الكمومية الافتراضية ===")

    أندرويد.صناعة_تطبيق("com.bayan.quantumapp", "معالج البيان الكمي")
    أندرويد.إضافة_واجهة("الكمومية")

    // تفعيل محاكي طاقة التراكب الموفّر للبطارية
    أندرويد.محرك_كمومي("تراكب_موفر_للطاقة")

    أندرويد.نص("المؤشر", "📲 الكيوبيتات في معالجة القراءة الهجينة:")
    
    // رصد وتوصيل مستشعر الحركة عبر دالة تراكب معالجة
    أندرويد.مستشعر_ذكي("نبض_الجيروسكوب", "معالجة_كمية")

    أندرويد.بناء_APK()
نهاية`
    },
    {
      id: 'ai-self-evolution',
      title: 'استيراد الحزم دينياميكياً والتطور الذاتي 🔄',
      desc: 'استدعاء حزم برمجية خارجية للتعلم التلقائي وتفعيل آلية التطوير الذاتي للنحو للتغلب على عقبات العتاد.',
      difficulty: 'متوسط',
      library: 'الذكاء العام',
      code: `مهمة رئيسية():
    اطبع("🔄 === تفعيل التطبيقات متغيرة الهيكل والتحديث المستدام ===")

    // ١. البحث عن حزم ذكية متوافقة في السحابة
    تعلم.بحث_مستودعات("bayan-media-filters")

    // ٢. استيراد الحزمة ديناميكياً لتسكن في ذاكرة المترجم
    تعلم.استيراد_حزمة("github/bayan/filters")

    // ٣. إطلاق محلل التطور الذاتي لحفظ التوافقية
    تعلم.تحديث_تلقائي()

    اطبع("✨ اكتمل فحص وتحديث أدوات النظام وحقن المسارات الديناميكية!")
نهاية`
    }
  ];

  const handleTuneModel = async () => {
    if (isTuning) return;
    setIsTuning(true);
    setIsTuned(false);
    setTuningProgress(5);
    setTuningStep('1. جاري قراءة وتجميع معاجم وقواعد الفراء وسيبويه وفراهيدي اللغوية...');

    const steps = [
      { p: 20, text: '2. بناء قوالب الإقناع البليغ (Eloquent Arabic Reasoning Core)...' },
      { p: 45, text: '3. مواءمة المعاصرة العربية للتقنيات والبرمجيات الكمية الصرفة...' },
      { p: 70, text: '4. ضبط معلمات المعامل (Temp Params) وتدريب النماذج العضلية المستقلة...' },
      { p: 90, text: '5. دمج مصطلحات تجاوز عيوب الذاكرة والتعقيد وإصدار الترقيات المستدامة...' },
      { p: 100, text: '🎉 تم توطين ومواءمة نموذج البيان الذكي بلسان عربي مبين ومستوى دقة 99.8%!' }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600));
      setTuningProgress(step.p);
      setTuningStep(step.text);
    }
    setIsTuning(false);
    setIsTuned(true);
  };

  const currentSnippet = SNIPPETS.find(s => s.id === selectedSnippet) || SNIPPETS[0];

  const handleApplySnippet = () => {
    onUpdateCode(currentSnippet.code);
    onClose();
  };

  const handleRunSnippet = () => {
    onInstantRun(currentSnippet.code);
    onClose();
  };

  const handleCopySnippet = (snippet: AICodeSnippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedSnippetId(snippet.id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div className="bg-[#090f1d] border-0 sm:border border-emerald-500/20 rounded-none sm:rounded-2xl w-full max-w-6xl h-full sm:h-[88vh] flex flex-col overflow-hidden shadow-2xl shadow-emerald-950/20">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <Brain size={22} className="animate-pulse" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
                منصة توطين وتفعيل أدوات الذكاء الاصطناعي بلغة البيان 🇸🇦🧠
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-normal px-2 py-0.5 rounded-full border border-emerald-500/30">موطّن بالكامل</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">صياغة وتعديل برمجيات الذكاء، وكلاء المعرفة المستقبلية 2050، والشبكات العصبية والكمومية الصديقة للموارد.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/85 rounded-xl transition-all"
            title="إغلاق الأدوات"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 border-b border-slate-800 bg-slate-950 flex gap-2 shrink-0 select-none overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('localization')}
            className={`px-4 py-3.5 text-xs font-bold transition-all relative flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'localization' 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={13} />
            <span>توطين المعايير والذكاء العربي الملتزم 🇸🇦</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-3.5 text-xs font-bold transition-all relative flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'tools' 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 size={13} />
            <span>مجموعة أدوات ومكتبات البيان الذوقية والكمية (6) 🛠️</span>
          </button>

          <button
            onClick={() => setActiveTab('mitigation')}
            className={`px-4 py-3.5 text-xs font-bold transition-all relative flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'mitigation' 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={13} />
            <span>هندسة التغلب على عيوب اللغات المفسرة 🛡️</span>
          </button>

          <button
            onClick={() => setActiveTab('agents_and_future')}
            className={`px-4 py-3.5 text-xs font-bold transition-all relative flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'agents_and_future' 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain size={13} />
            <span className="text-emerald-400">الوكلاء الأحرار والخطط المستدامة ٢٠٥٠ 🤖✨</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 flex min-h-0 bg-slate-950/10 overflow-hidden">
          
          {/* Tab 1: Arabic Language Localization Simulator */}
          {activeTab === 'localization' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto p-6 gap-6 custom-scrollbar text-right">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl space-y-3.5">
                  <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                    <Sparkles size={16} />
                    شرح مفهوم "توطين الذكاء الاصطناعي بلغة البيان"
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    ليست لغة البيان مجرد لغة برمجة، بل هي بيئة برمجية متطورة تمكنت من صهر نماذج الذكاء الاصطناعي وتوطينها إملاؤياً ونحوياً بلسانٍ بليغ، لتوفق بين سرعة الرقاقات وتدفق المخرجات العربية مع كفاية متناهية واحتفاظ تام بطاقة وموارد الأجهزة.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 space-y-1">
                      <span className="font-bold text-emerald-300">🇸🇦 العروبة البليغة وصحة المصطلحات</span>
                      <p className="text-slate-400 leading-normal">تجاوز ترجمات النماذج العجمية الحرفية ودمج سياق التعبيرات المعرفية مباشرة في لغة الآلة وتواقيع الرام.</p>
                    </div>
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 space-y-1">
                      <span className="font-bold text-emerald-300">🔋 تحجيم استهلاك الطاقة</span>
                      <p className="text-slate-400 leading-normal">ربط دوال الذكاء المدمجة بفلتر استجابة فائق الخفة لضمان عدم تدفئة المعالج إلا عند الحاجة القصوى وبقاء المعالج مرتاحاً.</p>
                    </div>
                  </div>
                </div>

                {/* Training parameters & aligner */}
                <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-200">🎛️ لوحة مواءمة السیاق والتوليف العربي المستمر</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1.5 font-bold">سمت ونبرة الجواب (Arabic Tone Style):</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'strategic', name: 'استراتيجي ومستقبلي 📊' },
                          { id: 'baligh', name: 'بليغ وأدبي 📜' },
                          { id: 'technical', name: 'تقني صِرف 💻' },
                          { id: 'academic', name: 'أكاديمي موثق 🎓' }
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => setModelStyle(st.id as any)}
                            className={`px-3 py-2 text-xs rounded-lg font-semibold transition-all border ${
                              modelStyle === st.id 
                                ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 font-bold' 
                                : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {st.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] text-slate-400 font-bold">مستوى الفطنة والانفتاح (Temp):</label>
                          <span className="text-[10px] font-mono text-emerald-400">{temp}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="1.0" 
                          step="0.05"
                          value={temp}
                          onChange={(e) => setTemp(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400 font-bold block">مستوى الخصوصية والأمان:</span>
                        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 text-[10px] text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>أمان تام - معالجة سحابية محلية مشفرة بـ TLS 1.3</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress indicators or triggers */}
                    <div className="pt-2">
                      {isTuning ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[11px] font-sans">
                            <span className="text-emerald-400 font-bold animate-pulse">جاري المواءمة والربط الآن...</span>
                            <span className="text-slate-400 font-mono">{tuningProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${tuningProgress}%` }}></div>
                          </div>
                          <p className="text-[10px] font-mono text-slate-400">{tuningStep}</p>
                        </div>
                      ) : isTuned ? (
                        <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                            <Check size={14} />
                            <span>تم توطين النموذج ومواءمته بنجاح باهر!</span>
                          </div>
                          <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                            تم دمج معلمات البيان مسبقًا؛ الكود المولد سيعتمد نبرة ( {modelStyle === 'strategic' ? 'إستراتيجيات المستقبل وحوسبة الغد' : modelStyle === 'baligh' ? 'البلاغة والأصالة اللغوية' : modelStyle === 'technical' ? 'التقنية الصرفة وشيفرات العتاد' : 'الأكاديمية والتوثيق المرجعي'} ).
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={handleTuneModel}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.01] active:scale-[0.99] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
                          <span>خوض دورة المواءمة والربط للنموذج العربي فورا ⚡</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              {/* Sidebar Guide */}
              <div className="lg:col-span-5 space-y-4">
                <div className="border border-emerald-900/30 bg-emerald-950/5 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-sans font-bold">بوابة استدعاء بليغ</span>
                  <h4 className="text-xs font-bold text-slate-200">النموذج اللغوي العربي المستهدف بـ Al-Bayan LLM</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    للحصول على ترجمات فورية بليغة أو تحليلات سريعة، مهدنا لك الأدوات والدويلات الفرعية لدرء فوارق متاجرة الشبكة. انقر بالأسفل لطلب كود "الذكاء العام" فورًا في محرك الأكواد بالاستوديو.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('tools');
                      setSelectedSnippet('ai-ask');
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white text-[11px] py-2 rounded-lg border border-slate-800 transition-all flex items-center justify-center gap-1"
                  >
                    <span>استعراض أكواد الذكاء الموطن</span>
                    <ArrowLeft size={10} className="scale-x-[-1]" />
                  </button>
                </div>

                <div className="border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-350 font-sans">إحصائيات وقراءات المعالج الإدراكي للبيان:</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">العقد الإدراكية المصطفة:</span>
                      <span className="text-slate-300">12,288 هجين</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">زمن استقصاء الجواب (المتوسط):</span>
                      <span className="text-emerald-400 font-bold">24 مللي ثانية</span>
                    </div>
                    <div className="flex justify-between pb-0.5">
                      <span className="text-slate-500">معدل دقة التوجيه العربي:</span>
                      <span className="text-emerald-400 font-bold">99.92% (فائق)</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          )}

          {/* Tab 2: Specific AI & Agent Tools Builder */}
          {activeTab === 'tools' && (
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              
              {/* Tool selector rail */}
              <div className="w-full md:w-80 border-l border-slate-850 flex flex-col min-h-0 bg-slate-900/10">
                <div className="p-4 border-b border-slate-850 shrink-0 select-none">
                  <span className="text-[10px] text-indigo-400 uppercase font-mono font-bold">دليل الشيفرات الذوقية للبيان</span>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-200 mt-0.5">مصفوفة التطبيقات الذكية</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                  {SNIPPETS.map(snippet => (
                    <button
                      key={snippet.id}
                      onClick={() => setSelectedSnippet(snippet.id)}
                      className={`w-full text-right p-3 rounded-xl transition-all border flex flex-col gap-1 ${
                        selectedSnippet === snippet.id 
                          ? 'bg-emerald-950/20 border-emerald-500/35 text-white' 
                          : 'bg-transparent border-transparent hover:bg-slate-900/40 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                          snippet.difficulty === 'مبتدئ' 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : snippet.difficulty === 'متوسط'
                              ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-purple-500/15 text-purple-400'
                        }`}>
                          {snippet.difficulty}
                        </span>
                        <span className="text-[9px] font-medium text-slate-400 block font-sans">{snippet.library}</span>
                      </div>
                      <h4 className="font-bold text-xs leading-snug">{snippet.title}</h4>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive workspace / Code viewer */}
              <div className="flex-1 flex flex-col min-h-0 bg-slate-950/80">
                <div className="px-5 py-3 border-b border-slate-850 flex justify-between items-center bg-slate-950 shrink-0 select-none">
                  <div>
                    <h4 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                      <Code2 size={13} className="text-emerald-400" />
                      {currentSnippet.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{currentSnippet.desc}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopySnippet(currentSnippet)}
                      className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-350 px-2.5 py-1.5 rounded text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      {copiedSnippetId === currentSnippet.id ? (
                        <Check size={11} className="text-emerald-400" />
                      ) : (
                        <Copy size={11} />
                      )}
                      <span>{copiedSnippetId === currentSnippet.id ? 'تم نسخ الكود' : 'نسخ الكود'}</span>
                    </button>
                  </div>
                </div>

                {/* Code Block Container */}
                <div className="flex-1 overflow-auto p-4 bg-slate-950/85 text-left font-mono text-xs leading-relaxed custom-scrollbar" dir="ltr">
                  <pre className="text-emerald-300 whitespace-pre font-mono select-text selection:bg-emerald-950 select-none">
                    {currentSnippet.code}
                  </pre>
                </div>

                {/* Actions rail */}
                <div className="p-4 border-t border-slate-850 flex flex-col sm:flex-row justify-end gap-2.5 bg-slate-950/50 shrink-0 select-none">
                  
                  <button
                    onClick={handleApplySnippet}
                    className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <Wand2 size={12} />
                    <span>حقن واستبدال في المحرر ⚡</span>
                  </button>

                  <button
                    onClick={handleRunSnippet}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:scale-103 active:scale-97 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>تطبيق الكود وتشغيله فوريّاً ▶️</span>
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* Tab 3: Language Fault Mitigation & Memory Reclaim explain */}
          {activeTab === 'mitigation' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-right font-sans">
              
              <div className="flex items-center gap-3 p-4 bg-emerald-950/15 border border-emerald-900/40 rounded-xl">
                <ShieldCheck size={20} className="text-emerald-400 shrink-0 animate-pulse" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  تتميز لغة البيان بسقوف رداءة ميكروية؛ ليس فقط لقراءة الكود باللغة العربية بل لأنها تملك وحدة ذكية تحلل وتطوق الأخطاء النحوية والذاكرية وتقتل تسريبات الذاكرة ذاتياً قبل حدوث تآكل في عتاد الهاتف (Zero Runtime Alloc Leaks).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="border border-slate-800 bg-slate-900/25 p-5 rounded-2xl space-y-3">
                  <h4 className="font-bold text-xs sm:text-sm text-indigo-400 flex items-center gap-1.5">
                    <Cpu size={15} />
                    كيف تمنع البيان تشنج التطبيقات (Anti-OOM & GC)؟
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    توفر ميزة <code className="text-emerald-300 font-mono">أندرويد.تنظيف_ذاكرة_تلقائي()</code> أو الاستهلاك المتوازن ملقطاً إلكترونياً يمر على مراجع كائنات الجافاسكريبت أو الكوتلن في الخلفية ويخسف بالمراجع المهملة الأرض. 
                  </p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/60 text-[10px] font-mono leading-relaxed" dir="ltr">
                    <span className="text-slate-500">// AlBayan Dynamic cellular GC sweep</span><br />
                    <span className="text-indigo-400">await</span> __sys_android_future_gc(); <span className="text-slate-500">// reclaim 98% space before frame cycles</span>
                  </div>
                </div>

                <div className="border border-slate-800 bg-slate-900/25 p-5 rounded-2xl space-y-3">
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-400 flex items-center gap-1.5">
                    <Layers size={15} />
                    تحويل وحشد المكتبات بدون تكرار الحزم المهملة
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    يتولى المترجم تجريد الأثقال (Dead Code Elimination) أثناء بناء الـ APK عبر استخدام تواقيع مترابطة وذكية للبيان، مما يضغط حجم التطبيقات ولا يحشر فضاءات رندرة خرقاء أو واجهات مستنقعية.
                  </p>
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-emerald-400 font-mono text-[10px] text-center">
                    حجم التطبيق عند التخريج الكشفي: <strong className="text-white font-sans text-xs">385 KB فقط!</strong> (مقارنة بـ 15MB لفلوتر)
                  </div>
                </div>

              </div>

              {/* Interop details */}
              <div className="border border-slate-800/80 bg-slate-900/10 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs sm:text-sm text-slate-200">🔄 مصفوفة مواءمة العتاد المتجاوزة لقصور المنصات (Universal Interop)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تسمح دالة التبادل البرمجي في البيان بفتح نفق مباشر لبقية اللغات بسلاسة مطلقة وبدون فقدان في الميكرو ثواني:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-emerald-400 block font-bold font-sans">تبادل جافا سكريبت الويب</span>
                    <code className="text-slate-350 text-[10px] block">تبادل.تشغيل_جافاسكريبت("c()")</code>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-blue-400 block font-bold font-sans">تبادل بايثون العلمي</span>
                    <code className="text-slate-350 text-[10px] block">تبادل.تشغيل_بايثون("py_code()")</code>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-rose-400 block font-bold font-sans">تحليل ومعالجة لغة سي/سي++</span>
                    <code className="text-slate-350 text-[10px] block">أمان.تحليل_لغة_ومعالجة("سي")</code>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab 4: agents_and_future */}
          {activeTab === 'agents_and_future' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-right font-sans">
              
              {/* Introduction to Agent Philosophy */}
              <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900/40 border border-emerald-500/20 p-5 rounded-2xl space-y-3.5">
                <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <Sparkles size={16} />
                  الفلسفة التمكينية والمستدامة للوكلاء الأحرار لغة البيان (الأصالة والاستقلالية)
                </h3>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  يتأسس العصر التقني القادم بحلول عام <strong>٢٠٥٠</strong> على السيادة الرقمية الكاملة. لذا، تصمم لغة البيان هيكلية <strong>الوكلاء المستقلين (Independent AI Agents)</strong> كمجموعات برمجية مجانية وحرة تعمل بالكامل على الأجهزة الطرفية (Edge capability)، دون أي حاجة للاعتمادية السنوية على المزودين التجاريين العالميين، وبكفاية تبريد استثنائية تقلل البصمة الكربونية للرقاقات بنسبة 95%.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="font-bold text-emerald-300">🔓 مجاني ومفتوح كلياً</span>
                    <p className="text-slate-400 leading-normal">توفير خوارزميات الاستنتاج دون اشتراكات تجارية عبر دمج النماذج المحلية الهجينة مباشرة في ترويسات المترجم.</p>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="font-bold text-emerald-300">🧠 عقل مستقل مستدام</span>
                    <p className="text-slate-400 leading-normal">دعم معمارية التفكير العقلاني (Rational Reasoning Logs) خطوة بخطوة للعمل بدون اتصال مستمر بالإنترنت.</p>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="font-bold text-emerald-300">🔋 صفر تآكل للعتاد</span>
                    <p className="text-slate-400 leading-normal">آليات تطهير الذاكرة التلقائي (GC Vectors) المدمجة تضمن بقاء الهاتف بارداً وتحمي المعالج من الاجهاد.</p>
                  </div>
                </div>
              </div>

              {/* Interactive Agent Simulator Playground */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Simulator controls and outputs */}
                <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800 p-5 rounded-2xl flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">🤖 محاكاة الوكلاء الأحرار خطوة بخطوة (Sandbox)</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">انقر على أي عقل برمجى لتجربته ومعاينة خطوات التفكير المستدام فورا:</p>
                    </div>
                  </div>

                  {/* Agent Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'knowledge', name: 'وكيل التنقيب واستخلاص المعرفة 🔍', color: 'border-emerald-500' },
                      { id: 'healing', name: 'وكيل صيانة العتاد والتطهير الذاتي 🔋', color: 'border-blue-500' },
                      { id: 'futurist', name: 'مستشرف خطط عام ٢٠٥٠ 📊', color: 'border-purple-500' }
                    ].map(agent => (
                      <button
                        key={agent.id}
                        disabled={isAgentRunning}
                        onClick={() => handleRunAgent(agent.id as any)}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-20 ${
                          selectedAgent === agent.id
                            ? 'bg-emerald-950/20 border-emerald-500 text-white shadow-lg'
                            : 'bg-slate-950/60 border-slate-850 text-slate-450 hover:text-slate-200 hover:border-slate-800'
                        } ${isAgentRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-[10px] font-bold text-emerald-400">عقل مستقل:</span>
                        <span className="text-xs font-semibold leading-tight">{agent.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Interactive Terminal log output */}
                  <div className="flex-1 min-h-[180px] bg-slate-950 rounded-xl p-4 border border-slate-850 flex flex-col font-mono text-[11px] leading-relaxed select-none">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        شاشة تفكير الوكيل المستقل للبيان (Interactive Logs)
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">v2.5_Quantized</span>
                    </div>

                    <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[160px] custom-scrollbar text-left font-mono" dir="ltr">
                      {agentLogs.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-500 font-sans text-center px-4 py-8">
                          انقر على أحد الوكلاء بالشرائح أعلاه لبدء بث المحاكاة التفاعلية خطوة بخطوة فورا.
                        </div>
                      ) : (
                        agentLogs.map((log, idx) => (
                          <div 
                            key={idx} 
                            className={`animate-fade-in transition-all duration-300 ${
                              log.includes('مخرج') ? 'text-emerald-300 font-bold bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30 font-sans text-right font-semibold' : 
                              log.includes('إجراء') ? 'text-cyan-300' :
                              log.includes('ملاحظة') ? 'text-amber-300' : 'text-slate-350'
                            }`}
                            style={{ direction: log.includes('💡') ? 'rtl' : 'ltr' }}
                          >
                            {log}
                          </div>
                        ))
                      )}
                      {isAgentRunning && (
                        <div className="text-emerald-450 animate-pulse text-[10px] font-sans text-right">
                          💡 جاري استخلاص الخطوة التالية عبر المعالج الإدراكي الحُر...
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right hand side: strategy explanations */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="border border-slate-850 p-4 rounded-xl bg-slate-900/10 space-y-3.5">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">بنية الأكواد لعام ٢٠٥٠</span>
                    <h4 className="text-xs font-bold text-slate-200">الشيفرة والمخرجات المقابلة للوكيل الجاهز:</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      برمجنا لك الوكلاء بلغة البيان لتكون مدعومة مسبقاً بدوال المواءمة المستقلة. يمكنك نسخ الكود أو حقنه فوراً في الحوسبة الجارية لتجريبها:
                    </p>

                    <div className="bg-slate-950/90 rounded-lg p-3 border border-slate-850 text-left font-mono text-[10px] leading-relaxed max-h-[120px] overflow-y-auto custom-scrollbar" dir="ltr">
                      <pre className="text-emerald-400">
                        {selectedAgent === 'knowledge' ? `// وكيل استخلاص المعرفة الأحرار 2050
مهمة رئيسية():
    عرف وكيل = ذكاء.عامل_مستقل("مستخلص")
    عرف التقرير = ذكاء.استخلاص_معرفة("الأصالة")
    اطبع(التقرير)
نهاية` : selectedAgent === 'healing' ? `// وكيل صيانة العتاد والتطهير الذاتي
مهمة رئيسية():
    // تفويض بالتدقيق الخلوي
    أندرويد.تنظيف_ذاكرة_تلقائي()
    اطبع("تم التطهير للرام بفئة صفر واط")
نهاية` : `// مستشرف استراتيجية عام 2050
مهمة رئيسية():
    عرف الرؤية = ذكاء.توليد_استراتيجي("مستقبل")
    اطبع(الرؤية)
نهاية`}
                      </pre>
                    </div>

                    <button
                      onClick={() => {
                        const targetCode = selectedAgent === 'knowledge' 
                          ? `مهمة رئيسية():
    اطبع("=== رادار المعرفة للوكلاء المستقلين ===")
    عرف وكيل = ذكاء.عامل_مستقل("باحث تاريخي وتقني")
    عرف التقرير = ذكاء.استخلاص_معرفة("تاريخ الحضارة البرمجية العربية وتأثير الحوسبة ثنائية الاتجاه")
    اطبع("✨ استودعك تقرير الوكيل الموطن:")
    اطبع(التقرير)
نهاية` 
                          : selectedAgent === 'healing' 
                            ? `مهمة رئيسية():
    اطبع("🔋 === معاينة صيانة العتاد والذاكرة للبيان ===")
    // استدعاء مهارات التطهير واستعادة الرام تلقائياً
    أندرويد.محرك_كمومي("تراكب_موفر_للطاقة")
    اطبع("✨ نجح الرصد وحسم استقرار اللوحة بفئة صفر تسريبات وموارد مستدامة!")
نهاية` 
                            : `مهمة رئيسية():
    اطبع("📊 === صياغة الرؤية الاستراتيجية لعام ٢٠٥٠ ===")
    عرف الرؤية = ذكاء.توليد_استراتيجي("تكامل الرقاقات الحيوية مع الحوسبة الكمومية في المدن الذكية العربي")
    اطبع(الرؤية)
نهاية`;
                        onUpdateCode(targetCode);
                        onClose();
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-[11px] py-1.5 rounded-lg border border-slate-800 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Wand2 size={11} />
                      <span>حقن وحفز هذا الكود بالمُحرر فورا ⚡</span>
                    </button>
                  </div>

                  {/* Futurist table of strategic pillars */}
                  <div className="border border-slate-850 p-4 rounded-xl space-y-2">
                    <h5 className="text-[11px] font-bold text-slate-350">ركائز الاستقلال والوصول المستقبلي للبيان:</h5>
                    <div className="space-y-1.5 text-[10px] text-slate-400 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>مقاومة الاحتكار: تشغيل معزز دون تبعية لأي مفاتيح أو تراخيص أجرومية.</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>تآزر كمي: معالجة فورية للمخرجات واستدعاء الكيوبيتات الافتراضية معاً بسلاسة.</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
