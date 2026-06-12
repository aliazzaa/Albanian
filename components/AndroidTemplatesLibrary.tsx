import React, { useState } from 'react';
import { 
  X, HelpCircle, Code, ShieldCheck, Cpu, Battery, Layers, Check, 
  Terminal, ArrowRight, Play, Server, ListCollapse, Settings, Sliders 
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'قوائم' | 'تبويبات' | 'لوحات تحكم' | 'ذكية ومستقبلية' | 'وسائط وميديا';
  apkSize: string;
  perfRating: string;
  batteryEcoRatio: string;
  features: string[];
  code: string;
}

interface AndroidTemplatesLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (code: string) => void;
  onInstantRun?: (code: string) => void;
}

export const TEMPLATES: Template[] = [
  {
    id: 'list-manager',
    title: 'تطبيق إدارة المهام والعناصر التفاعلي (Interactive List Manager)',
    description: 'الهيكل المثالي للتعامل مع تدفق البيانات في قائمة متكررة. يشمل تتبع ديناميكي لعناصر المهام مع التطهير الفوري التلقائي للذاكرة العشوائية لتقليص استهلاك الرام.',
    category: 'قوائم',
    apkSize: '362 KB',
    perfRating: "99.8%",
    batteryEcoRatio: '92%',
    features: [
      'تطهير فوري للذاكرة 0% Leakage ومقاومة Out-Of-Memory',
      'صياغة عناصر قائمة متكررة وتفاعلية',
      'تحديث فوري لعداد ونسبة إكمال المهمة بدقة متزايدة',
      'متجاوب تماماً مع أحجام شاشات أندرويد المختلفة'
    ],
    code: `مهمة رئيسية():
    اطبع("=== بدء تخليق وتفعيل تطبيق قائمة المهام الذكي للأندرويد ===")
    
    // ١. تهيئة وتوليد التطبيق وتلقينه الصنف الفريد
    أندرويد.صناعة_تطبيق("com.bayan.tasklist", "منظم المهام اليومي")
    
    // ٢. إضافة الواجهة وتصميم الواجهة الرسومية
    أندرويد.إضافة_واجهة("الرئيسية")

    // ٣. تنشيط محرك تنظيف ومعالجة تسريبات الذاكرة ذاتياً لمنع التباطؤ
    أندرويد.تنظيف_ذاكرة_تلقائي()

    // ٤. ترصيع الواجهة بالعناصر وصياغتها بأناقة
    أندرويد.نص("العنوان"، "📋 مفكرة مهامي الذكية بالتطهير الذاتي")
    أندرويد.حقل_إدخال("مهمة_جديدة"، "اكتب تفاصيل المهمة أو التحدي الجديد هنا...")

    أندرويد.نص("قسم_المهام"، "المهام الجاري العمل عليها اليوم:")
    أندرويد.نص("مهمة_١"، "  [✓] تفعيل محرك الترشيد الكمي للبيان")
    أندرويد.نص("مهمة_٢"، "  [ ] ضبط استجابات مستشعرات الحركة والهز")
    أندرويد.نص("مهمة_٣"، "  [ ] بناء واختبار حزمة الـ APK للتثبيت")
    
    أندرويد.زر("إضافة_إجراء"، "إضافة المهمة وتحديث النواة")
    
    أندرويد.مؤشر_تقدم("مستوى_الإنجاز"، 33)

    // ٥. البناء الفوري بأصغر حجم ممكن بفضل المترجم المطور!
    أندرويد.بناء_APK()

    اطبع("✨ تم الانتهاء من توليد وبناء تطبيق قائمة المهام التوافقي بنجاح!")
نهاية`
  },
  {
    id: 'tab-ui',
    title: 'واجهة استخدام مبوبة متعددة الصفحات (Multidimensional Tab UI)',
    description: 'نموذج لتطبيقات التبويب والتنقل السريع بين عدة شاشات فرعية (مثل التبويب الرئيسي والأداء والإعدادات) بأقل لود على معالج الـ CPU.',
    category: 'تبويبات',
    apkSize: '379 KB',
    perfRating: "99.4%",
    batteryEcoRatio: '95%',
    features: [
      'هندسة تنقل سلسة وآمنة برمجياً',
      'تأطير شريط تبويبات علوية وسفلية متطورة',
      'أداء متماسك مع تفريغ لحظي لمكونات الواجهة غير المرئية',
      'حساب فوري وتكاملي بين التبويبات بدون بطء'
    ],
    code: `مهمة رئيسية():
    اطبع("=== بدء تخليق واجهة التنقل التبويبي المتعددة (Tabbed UI) للأندرويد ===")

    // ١. تهيئة وبدء التطوير للتطبيق الهجين الشامل
    أندرويد.صناعة_تطبيق("com.bayan.multitabs", "بوابة التبويبات الموحدة")

    // ٢. تفعيل نمط التطهير الخلوي لموارد الهاتف لضمان سلاسة الانتقال
    أندرويد.تنظيف_ذاكرة_تلقائي()

    // ٣. رسم شريط التنقل بالهيئة العليا التفاعلية
    أندرويد.إضافة_واجهة("الرئيسية_الشاملة")
    أندرويد.نص("شريط_التبويبات"، "🏠 الرئيسية   |   📈 إحصائيات الأداء   |   ⚙️ الإعدادات الكمية")

    أندرويد.نص("محتوى_التبويب"، "مرحباً بك في لوحة تحليلات البيان. قيد التقاطع في الأداء.")
    
    // ٤. تفعيل محاكاة ذكية للرسم الرياضي
    أندرويد.مؤشر_تقدم("جاهزية_نواة_المعالجة"، 89)

    أندرويد.زر("تحول_تبويب"، "الانتقال للتبويب التالي ورصد التغير")

    // ٥. ضغط وبناء التطبيق لتوليد APK جاهز
    أندرويد.بناء_APK()

    اطبع("✨ اكتمل تجميع وبناء مشروع تطبيق التبويبات المتعدد للأندرويد!")
نهاية`
  },
  {
    id: 'settings-deep',
    title: 'لوحة التحكم وإعدادات الموارد (Deep Settings & Sensory Panel)',
    description: 'تطبيق لوحة إعدادات رائد وعميق. يشمل مفاتيح تبديل ذكية (Toggle Switches) للتحجيم وتفعيل المستشعرات الحيوية والمروحة ومصائد معالجة البطارية.',
    category: 'لوحات تحكم',
    apkSize: '388 KB',
    perfRating: "99.9%",
    batteryEcoRatio: '98%',
    features: [
      'مفاتيح التبديل الذكية للتحكم في تفضيلات النظام الرسومي',
      'تكامل الميكروفون أو المستشعرات المادية والجيروسكوب مباشرة',
      'حقل إدخال رقمي ومنفذ الاتصال المحلي IoT للتحكم بالعتاد',
      'مناسب لبساطة لوحات الأجهزة وربط مستشعرات الرام'
    ],
    code: `مهمة رئيسية():
    اطبع("=== بدء تخليق وتشفير لوحة إعدادات الموارد العميقة للأندرويد ===")

    // ١. صياغة وتجهيز التطبيق وحصر التواقيع الحيوية
    أندرويد.صناعة_تطبيق("com.bayan.deepsettings", "معدل الإعدادات الخلوية")
    
    أندرويد.إضافة_واجهة("مركز_الإعدادات_والتحكم")

    // ٢. استدعاء آلية معالجة ومنع تسريب الذاكرة فوراً لعدم إجهاد الهاتف
    أندرويد.تنظيف_ذاكرة_تلقائي()

    أندرويد.نص("العنوان"، "⚙️ لوحة إقرار وتحسين كفاءة الهاتف المستدامة")

    // ٣. أزرار التبديل الحالية للميزات التكنولوجية
    أندرويد.مفتاح_تبديل("محرك_ترشيد_عميق"، "حظر العمليات الخلفية الزائدة وتوفير البطارية 95%")
    أندرويد.مفتاح_تبديل("وضع_الاستشعار_اللحظي"، "مراقبة جيروسكوب الحركة ومؤشرات العتاد")

    // ٤. ربط مستشعر الهاتف الجيروسكوبي بدالة بالبرنامج برمجياً لتنفيذ تفريغ آمن
    أندرويد.نص("حالة_المستشعر"، "حالة المستشعر: في حالة استماع ذكية مرشدة...")
    أندرويد.مستشعر_ذكي("الحركة_الدوارة"، "حساب_حرق_الطاقة_المعقول")

    أندرويد.نص("تفضيل_الشبكة"، "عنوان اتصال المزامنة (Express Gateway Port):")
    أندرويد.حقل_إدخال("مزامنة_ip"، "3000")

    أندرويد.زر("حفظ_التفضيلات"، "حفظ التفضيلات وتصدير الحزمة الفائقة")

    // ٥. بناء وتثبيت التطبيق بحجم فائق الخفة
    أندرويد.بناء_APK()

    اطبع("✨ تم توليد لوحة التفضيلات والمستشعرات العميقة للأندرويد بنجاح فائق!")
نهاية`
  },
  {
    id: 'quantum-iot',
    title: 'تطبيق أندرويد كمومي مستقبلي للأجهزة المحمولة (Quantum-AI Mobile Dashboard)',
    description: 'يجمع بين معالجة التراكب الكمومي لمحاكاة المستشعرات بنبضة واحدة والتحليل الذاتي المدعوم ذكاء اصطناعياً محلياً متكاملاً.',
    category: 'ذكية ومستقبلية',
    apkSize: '395 KB',
    perfRating: "99.95%",
    batteryEcoRatio: '99%',
    features: [
      'حقن وتكاميل معالجة تراكب مستمر (Superposition)',
      'استخدام ذكاء اصطناعي إدراكي محلي للتصويب والاقتراح',
      'تقليص حجم الـ APK لأدنى وبطارية دقيقة للغاية',
      'تتبع نبض ومستشعر دوار في كفاءة لا نهائية'
    ],
    code: `مهمة رئيسية():
    اطبع("=== بدء تخليق وتطوير تطبيق أندرويد مستقبلي فائق الخفة (Quantum-AI) ===")

    // ١. تهيئة وتوليد تطبيق أندرويد ذكي
    أندرويد.صناعة_تطبيق("com.bayan.quantumai", "البيان الكمومي الذكي")

    // ٢. تفعيل نمط المعالجة الكمومية فئة Q-Core الحسي للهواتف مباشرة
    أندرويد.محرك_كمومي("تراكب_معلومات_مستمر")

    // ٣. تنشيط محرك تنظيف ومعالجة تسريبات الذاكرة ذاتياً بنسبة تسريب 0%
    أندرويد.تنظيف_ذاكرة_تلقائي()

    // ٤. إضافة الواجهة وتصميم العناصر المحقونة بالذكاء الاصطناعي الإدراكي
    أندرويد.إضافة_واجهة("الرئيسية")
    أندرويد.نص("شعار"، "مرحبًا بك في الهاتف الكمومي من لغة البيان")
    
    // حقن وتكامل ذكاء اصطناعي محلي مع حقول الإدخال لتعديلها ذاتياً دون سيرفر
    أندرويد.ذكاء_سحابي_دمج("تحليل_واقتراح_المدخلات")
    أندرويد.حقل_إدخال("سؤال_المستقبل"، "وجه سؤالاً للمستكشف الكمومي هنا...")

    أندرويد.مفتاح_تبديل("محاكاة_الحواس"، "تفعيل الترابط والمزامنة الفيدرالية")

    // ٥. ربط مستشعر ذكي حيوي بدالة في الكود مباشرة تزامناً
    أندرويد.مستشعر_ذكي("الحركة_الدوارة"، "تحديث_الموقع_الكمومي")

    أندرويد.مؤشر_تقدم("حالة_التشابك_الكمومي"، 96)

    أندرويد.زر("زر_توقع"، "بدء حساب توقعات التحول التنموي")

    // ٦. البناء الفوري بأصغر حجم ممكن لحزمة APK بفضل المترجم المطور!
    أندرويد.بناء_APK()

    اطبع("✨ اكتملت هندسة وتشغيل التطبيق الهجين المستقبلي بنجاح فائق وتواقيع مؤمنة!")
نهاية`
  },
  {
    id: 'media-hub',
    title: 'تطبيق مشغل الوسائط والمعرض المدمج (Bayan Cinema & Media Player)',
    description: 'مشغل وسائط متكامل بلغة البيان لعرض الصور والفيديوهات وتشغيل الصوتيات دفعة واحدة مع تكامل فوري لـ BayanMediaEngine.',
    category: 'وسائط وميديا',
    apkSize: '412 KB',
    perfRating: "99.92%",
    batteryEcoRatio: '96%',
    features: [
      'تشغيل فوري للفيديوهات 1080p وتوصيل شريط تقدم المشاهدة',
      'دمج ملفات الصوت في نظام الهواتف وتشغيلها في الخلفية',
      'بناء وتخليق ألبومات الصور وشبكة المعرض بلمسة برمجية',
      'كفاءة فائقة في تحرير الرام وحفظ شاشات الهاتف'
    ],
    code: `مهمة رئيسية():
    اطبع("=== بدء تفعيل وانطلاق سينما وميديا البيان للأندرويد ===")

    // ١. تهيئة وبناء تطبيق الميديا
    أندرويد.صناعة_تطبيق("com.bayan.mediahub", "سينما البيان الذكية")

    أندرويد.إضافة_واجهة("الرئيسية")

    // ٢. تنشيط محرك تنظيف ومعالجة تسريبات الذاكرة ذاتياً لمنع تشنج الفيديوهات
    أندرويد.تنظيف_ذاكرة_تلقائي()

    أندرويد.نص("شعار_السينما"، "🎬 واجهة سينما وميديا البيان التفاعلية للأندرويد")

    // ٣. دمج وعرض مشغلات الفيديو والـ Stream فوريّاً بدقة 1080p
    وسائط.فيديو("مشغل_الغابة"، "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4"، "طبيعة خلابة - البث المباشر")

    // ٤. تفعيل وحدة تشغيل الصوت في الخلفية مع مفاتيح التحكم بالتراكات
    وسائط.صوت("تراك_الموسيقى"، "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"، "سمفونية هادئة - استوديو البيان")

    أندرويد.نص("لوحة_معرض_الصور"، "🖼️ استوديو المعروضات الطبيعية:")

    // ٥. استيراد ألبوم صور ذكي مكون من نماذج متتالية تزامناً مع شبكة متجاوبة
    وسائط.معرض_صور("معرض_شخصي"، "طبيعة")

    أندرويد.زر("المزيد"، "تحميل التراكات الإضافية ⚡")

    // ٦. البناء النهائي للتطبيق وحفظ الحزمة المشفرة
    أندرويد.بناء_APK()

    اطبع("✨ اكتمل توليد حزمة السينما والميديا بنجاح فائق (APK جاهز)!")
نهاية`
  }
];

export const AndroidTemplatesLibrary: React.FC<AndroidTemplatesLibraryProps> = ({ 
  isOpen, 
  onClose, 
  onLoadTemplate,
  onInstantRun
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(TEMPLATES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = ['الكل', 'قوائم', 'تبويبات', 'لوحات تحكم', 'ذكية ومستقبلية', 'وسائط وميديا'];

  const filteredTemplates = selectedCategory === 'الكل' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadTemplateIntoEditor = (text: string) => {
    onLoadTemplate(text);
    onClose();
  };

  const runTemplateCodeInstantly = (text: string) => {
    if (onInstantRun) {
      onInstantRun(text);
    } else {
      onLoadTemplate(text);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4" dir="rtl">
      <div className="bg-[#0f172a] border-0 sm:border border-slate-800 rounded-none sm:rounded-2xl w-full max-w-6xl h-full sm:h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers size={22} className="animate-pulse" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-sans">مكتبة هياكل وقوالب الأندرويد لغة البيان 🤖📱</h2>
              <p className="text-xs text-slate-400 mt-0.5">مشاريع جاهزة ومكتوبة بالكامل للبدء الفوري بالتطوير ذي الهيكل الأنظف والأقل استهلاكاً للطاقة.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all"
            title="إغلاق المكتبة"
          >
            <X size={20} />
          </button>
        </div>

        {/* Categories Navbar */}
        <div className="px-6 py-2.5 border-b border-slate-850 bg-slate-900/10 flex items-center gap-2 overflow-x-auto shrink-0 custom-scrollbar select-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                const filtered = cat === 'الكل' ? TEMPLATES : TEMPLATES.filter(t => t.category === cat);
                if (filtered.length > 0) {
                  setSelectedTemplate(filtered[0]);
                } else {
                  setSelectedTemplate(null);
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Templates Directory List */}
          <div className="w-full md:w-[35%] border-l border-slate-850 overflow-y-auto p-4 space-y-2.5 bg-slate-950/20 custom-scrollbar">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block select-none mb-1">القوالب المتاحة ({filteredTemplates.length}):</span>
            {filteredTemplates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`w-full text-right p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 justify-start ${
                  selectedTemplate?.id === tpl.id 
                    ? 'border-emerald-500 bg-emerald-950/20 text-slate-100 shadow-lg shadow-emerald-950/10' 
                    : 'border-slate-850 bg-slate-900/20 hover:bg-slate-900/40 text-slate-300 hover:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-xs select-all text-slate-200 md:text-sm">{tpl.title.split(' (')[0]}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    tpl.category === 'ذكية ومستقبلية' 
                      ? 'bg-purple-950/45 text-purple-400 border-purple-900/60' 
                      : tpl.category === 'قوائم' 
                        ? 'bg-blue-950/45 text-blue-400 border-blue-900/60'
                        : 'bg-teal-950/45 text-teal-400 border-teal-900/60'
                  }`}>
                    {tpl.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{tpl.description}</p>
                
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-1 select-none">
                  <span className="flex items-center gap-0.5"><Battery size={11} className="text-emerald-500" /> كفاءة {tpl.batteryEcoRatio}</span>
                  <span>•</span>
                  <span>حجم {tpl.apkSize}</span>
                </div>
              </button>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs">لا يوجد قوالب في هذا التصنيف حالياً.</div>
            )}
          </div>

          {/* Template Detail Area */}
          {selectedTemplate ? (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-900/10">
              
              {/* Info panel */}
              <div className="p-5 border-b border-slate-855 bg-slate-900/30 space-y-3 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-bold text-sm text-emerald-400 select-all font-sans">{selectedTemplate.title}</h3>
                  
                  {/* Direct Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => runTemplateCodeInstantly(selectedTemplate.code)}
                      className="bg-emerald-600 hover:bg-emerald-500 hover:scale-105 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/10"
                      title="تحميل البرنامج والتشغيل الفوري في نافذة المعاينة"
                    >
                      <Play size={13} fill="currentColor" />
                      <span>تشغيل فوري ⚡</span>
                    </button>
                    <button
                      onClick={() => loadTemplateIntoEditor(selectedTemplate.code)}
                      className="bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/10"
                      title="إدراج الشيفرة في محرر الأكواد"
                    >
                      <Terminal size={13} />
                      <span>بث في المحرر 📝</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">{selectedTemplate.description}</p>
                
                {/* Resource Metrics & Diagnostics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1 text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850/60 flex items-center gap-2">
                    <Battery size={15} className="text-emerald-400" />
                    <div>
                      <span className="text-slate-500 block text-[9px] font-medium leading-none mb-0.5">توفير رصين للبطارية</span>
                      <span className="font-bold font-mono text-emerald-400">{selectedTemplate.batteryEcoRatio} كفاءة بـ O(1)</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850/60 flex items-center gap-2">
                    <Cpu size={15} className="text-indigo-400" />
                    <div>
                      <span className="text-slate-500 block text-[9px] font-medium leading-none mb-0.5">تقييم النيابة والأداء</span>
                      <span className="font-bold font-mono text-indigo-400">{selectedTemplate.perfRating} فائق الجودة</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850/60 flex items-center gap-2">
                    <Sliders size={15} className="text-sky-400" />
                    <div>
                      <span className="text-slate-500 block text-[9px] font-medium leading-none mb-0.5">حجم حزمة APK المقدر</span>
                      <span className="font-bold font-mono text-sky-400">{selectedTemplate.apkSize} خفيف للغاية</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850/60 flex items-center gap-2">
                    <ShieldCheck size={15} className="text-emerald-400" />
                    <div>
                      <span className="text-slate-500 block text-[9px] font-medium leading-none mb-0.5">أمان وإدارة الذاكرة</span>
                      <span className="font-bold text-emerald-500 font-sans">0% تسريب (مؤمن)</span>
                    </div>
                  </div>
                </div>

                {/* Features bulletins */}
                <div className="pt-1.5 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">ميزات القالب الفنية المدعومة:</span>
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {selectedTemplate.features.map((feat, fIdx) => (
                      <span key={fIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code viewer with Copy */}
              <div className="flex-1 flex flex-col min-h-0 relative">
                <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-850 flex justify-between items-center select-none shrink-0">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                    <Code size={13} />
                    شيفرة تطبيق البيان للأندرويد (.byn)
                  </span>
                  <button
                    onClick={() => handleCopy(selectedTemplate.code)}
                    className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded text-[10px] font-semibold transition-colors flex items-center gap-1"
                    title="نسخ الكود بالكامل"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Code size={12} />}
                    <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
                  </button>
                </div>
                
                <div className="flex-1 overflow-auto bg-slate-950/80 p-4 custom-scrollbar text-left font-mono text-xs leading-relaxed" dir="ltr">
                  <pre className="text-slate-300 whitespace-pre selection:bg-emerald-800/30 select-all">
                    {selectedTemplate.code}
                  </pre>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-slate-500 text-sm">
              <HelpCircle size={40} className="text-slate-600 mb-2 animate-bounce" />
              <span>الرجاء تحديد قالب من القائمة الجانبية لعرض شيفرة البيان ودراستها وتنزيلها.</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
