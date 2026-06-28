import React, { useState, useEffect } from 'react';
import { 
  X, Search, Download, CheckCircle, RefreshCw, Copy, Check, 
  Terminal, Code, BookOpen, ChevronRight, Grid, Filter, Cpu, 
  Database, Network, ShieldCheck, Sparkles, Volume2, Gamepad2, 
  FileText, LineChart, Smartphone, Eye, Binary, Workflow, Compass,
  Brain, Zap, Lock, Languages
} from 'lucide-react';

interface BayanLibraryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadExample: (code: string) => void;
}

type LibraryCategory = 'all' | 'ai' | 'networking' | 'database' | 'security' | 'graphics' | 'nlp' | 'audio' | 'iot' | 'finance' | 'web';

interface LibraryItem {
  id: string;
  name: string;
  importName: string;
  version: string;
  size: string;
  downloads: string;
  developer: string;
  category: LibraryCategory;
  categoryLabel: string;
  description: string;
  icon: React.ReactNode;
  exampleCode: string;
  dependencies: string[];
}

export const BayanLibraryManager: React.FC<BayanLibraryManagerProps> = ({ isOpen, onClose, onLoadExample }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LibraryCategory>('all');
  const [selectedLib, setSelectedLib] = useState<LibraryItem | null>(null);
  const [installedLibs, setInstalledLibs] = useState<string[]>([]);
  const [installingLibId, setInstallingLibId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState(0);
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load installed libraries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bayan_installed_libraries');
    if (saved) {
      try {
        setInstalledLibs(JSON.parse(saved));
      } catch (e) {
        setInstalledLibs([]);
      }
    }
  }, []);

  // Registry Database representing "All Fields" (جميع المجالات)
  const LIBRARIES: LibraryItem[] = [
    {
      id: 'bayan_physics',
      name: 'محاكي القوانين الفيزيائية والحركة (BayanPhysics)',
      importName: 'الفيزياء_والحركة',
      version: 'v1.0.0',
      size: '64 KB',
      downloads: '1,240',
      developer: 'مختبرات البيان للعلوم',
      category: 'graphics',
      categoryLabel: 'الرسومات والفيزياء',
      icon: <Compass className="text-emerald-400 w-5 h-5" />,
      description: 'مكتبة برمجية تفاعلية لمحاكاة القوانين الفيزيائية الكلاسيكية مثل الجاذبية، ارتداد الكولوم، ومقاومة الهواء، مع دعم دمج وتسيير الأجسام في شاشة وسائط تفاعلية.',
      dependencies: ['أرسم (مدمجة)'],
      exampleCode: `مهمة رئيسية():
    اطبع("🌍 جاري تهيئة محاكاة القوانين الفيزيائية...")
    استورد("الفيزياء_والحركة")
    
    // إعداد متغيرات بيئة الجاذبية والارتداد
    الفيزياء_والحركة.جاذبية(٩.٨)
    الفيزياء_والحركة.ارتداد(٠.٨٥)
    الفيزياء_والحركة.احتكاك(٠.٠٢)
    
    // إضافة أجسام دائرية ومستطيلة للمحاكاة
    // المعاملات: المعرف، النوع، الإحداثي س، الإحداثي ص، الحجم، السرعة س، السرعة ص، اللون، مرونة الكائن
    الفيزياء_والحركة.إضافة_جسم("كرة_حمراء", "دائرة", ١٢٠, ٦٠, ٢٥, ١٢, ٥, "#ef4444", ٠.٩)
    الفيزياء_والحركة.إضافة_جسم("صندوق_أزرق", "مستطيل", ٢٤٠, ١٠٠, ٤٥, -٨, ٤, "#3b82f6", ٠.٧)
    الفيزياء_والحركة.إضافة_جسم("كرة_ذهبية", "دائرة", ٣٢٠, ٨٠, ٣٠, ٥, -١٠, "#f59e0b", ٠.٩٥)
    الفيزياء_والحركة.إضافة_جسم("كتلة_زمردية", "مستطيل", ١٨٠, ١٢٠, ٤٠, ١٥, -٢, "#10b981", ٠.٨)
    
    // إطلاق محاكي الفيزياء في لوحة الوسائط
    الفيزياء_والحركة.بدء_المحاكاة()
نهاية`
    },
    {
      id: 'math_advanced',
      name: 'مكتبة الرياضيات الفائقة والتحليل العلمي',
      importName: 'رياضيات_متقدمة',
      version: 'v1.4.2',
      size: '42 KB',
      downloads: '4,821',
      developer: 'فريق تطوير البيان',
      category: 'ai',
      categoryLabel: 'الرياضيات والعلوم',
      icon: <Cpu className="text-emerald-400 w-5 h-5" />,
      description: 'توفر دوال رياضية وحسابية متطورة للتعامل مع المصفوفات والتحليل الخطي، وعمليات التفاضل والتكامل بسرعة فائقة O(1) عبر المحاكي الكمي الثنائي.',
      dependencies: ['رياضيات (مدمجة)'],
      exampleCode: `مهمة رئيسية():
    اطبع("📊 جاري تشغيل مكتبة الرياضيات المتقدمة...")
    استورد("رياضيات_متقدمة")
    
    // إنشاء مصفوفة ثنائية الأبعاد وحساب المحدد الخاص بها
    عرف مصفوفة = رياضيات_متقدمة.إنشاء_مصفوفة("2,2", "4,7|2,6")
    عرف المحدد = رياضيات_متقدمة.محدد_المصفوفة(مصفوفة)
    
    اطبع("مصفوفة المعالجة المربعة:")
    اطبع(المحدد)
    
    // حساب التكامل التقريبي لدالة خطية
    عرف مساحة = رياضيات_متقدمة.تكامل_خطي("x^2", ١، ٥)
    اطبع("المساحة تحت المنحنى:")
    اطبع(مساحة)
نهاية`
    },
    {
      id: 'networking_async',
      name: 'مستقبل الاستعلام والاتصال الشبكي غير المتزامن',
      importName: 'اتصال_شبكي',
      version: 'v2.1.0',
      size: '56 KB',
      downloads: '3,912',
      developer: 'مجتمع البيان المفتوح',
      category: 'networking',
      categoryLabel: 'الاتصالات والشبكات',
      icon: <Network className="text-blue-400 w-5 h-5" />,
      description: 'مكتبة غير متزامنة لإرسال واستقبال طلبات HTTP (GET, POST, PUT, DELETE)، والاتصال بخوادم الويب وتغذية البيانات الحية عبر الـ WebSockets.',
      dependencies: [],
      exampleCode: `مهمة رئيسية():
    اطبع("🌐 جاري تشغيل مكتبة الاتصال الشبكي الآمن...")
    استورد("اتصال_شبكي")
    
    حاول:
        عرف الاستجابة = اتصال_شبكي.جلب_طلب("https://api.bayan-lang.org/v1/status")
        اطبع("حالة الاتصال بالخادم المركزي للبيان:")
        اطبع(الاستجابة)
        
        // إرسال بيانات كائن JSON إلى الخادم
        عرف حمولة = "name=أحمد&tier=premium"
        عرف نتيجة_الإرسال = اتصال_شبكي.إرسال_طلب("https://api.bayan-lang.org/v1/register", حمولة)
        اطبع("رد الخادم على التسجيل:")
        اطبع(نتيجة_الإرسال)
    التقط (الخطأ):
        اطبع("فشل الاتصال بالخادم:")
        اطبع(الخطأ)
    نهاية
نهاية`
    },
    {
      id: 'db_sqlite',
      name: 'قواعد البيانات المحلية والـ SQLite التزامنية',
      importName: 'قواعد_بيانات_محلية',
      version: 'v1.8.5',
      size: '128 KB',
      downloads: '5,140',
      developer: 'مختبرات التكنولوجيا العربية',
      category: 'database',
      categoryLabel: 'قواعد البيانات',
      icon: <Database className="text-amber-400 w-5 h-5" />,
      description: 'ربط تزامني فائق السرعة مع محرك SQL و SQLite، يدعم تشفير الجداول وعمل الاستعلامات المعقدة والتخزين المؤقت النشط على الأجهزة الذكية.',
      dependencies: ['أمان_وتشفير'],
      exampleCode: `مهمة رئيسية():
    اطبع("🗄️ تهيئة قاعدة البيانات المحلية فائقة السرعة...")
    استورد("قواعد_بيانات_محلية")
    
    // فتح الاتصال وإنشاء الجداول تلقائياً
    قواعد_بيانات_محلية.فتح_اتصال("bayan_store.db")
    قواعد_بيانات_محلية.تنفيذ_أمر("أنشئ جدول المستخدمين (المعرف رقم، الاسم نص)")
    
    // إدخال سجل جديد والاستعلام الفوري عنه
    قواعد_بيانات_محلية.إدخال_سجل("المستخدمين", "١, 'أحمد العربي'")
    عرف النتيجة = قواعد_بيانات_محلية.استعلام("اختر * من المستخدمين")
    
    اطبع("السجلات المسترجعة من الملف المحلي:")
    اطبع(النتيجة)
نهاية`
    },
    {
      id: 'crypto_secure',
      name: 'منظومة الأمان والتشفير والأمن السيبراني',
      importName: 'أمان_وتشفير',
      version: 'v3.0.1',
      size: '34 KB',
      downloads: '6,204',
      developer: 'فريق تطوير البيان',
      category: 'security',
      categoryLabel: 'الأمن والتشفير',
      icon: <ShieldCheck className="text-indigo-400 w-5 h-5" />,
      description: 'أدوات الحماية والتشفير القياسي للمعلومات الحساسة باستخدام خوارزميات AES-256 و SHA-256 وتوليد المفاتيح العامة والخاصة لضمان سرية البيانات وحماية الاتصالات.',
      dependencies: [],
      exampleCode: `مهمة رئيسية():
    اطبع("🔐 جاري تهيئة مكتبة التشفير وأمان البيانات...")
    استورد("أمان_وتشفير")
    
    عرف النص_الخام = "سر_البيان_الكمي_٢٠٢٦"
    
    // تشفير البصمة SHA-256
    عرف البصمة = أمان_وتشفير.تشفير_SHA256(النص_الخام)
    اطبع("البصمة الرقمية الآمنة:")
    اطبع(البصمة)
    
    // تشفير متماثل وفك التشفير
    عرف المفتاح = "key12345"
    عرف المشفر = أمان_وتشفير.تشفير_AES(النص_الخام, المفتاح)
    اطبع("النص بعد تشفيره بـ AES:")
    اطبع(المشفر)
نهاية`
    },
    {
      id: 'graphics_canvas',
      name: 'محرك الألعاب والرسوميات ثنائية الأبعاد Canvas',
      importName: 'محرك_الألعاب_الرسومي',
      version: 'v2.4.4',
      size: '210 KB',
      downloads: '3,219',
      developer: 'مطور البكسل العربي',
      category: 'graphics',
      categoryLabel: 'الرسوميات والألعاب',
      icon: <Gamepad2 className="text-rose-400 w-5 h-5" />,
      description: 'محرك ألعاب رسومي متكامل للويب والأندرويد، يتيح معالجة المدخلات، رسم الكائنات، والتعامل مع التصادمات ثنائية الأبعاد، وتوليد إطارات متحركة بسلاسة.',
      dependencies: ['وسائط (مدمجة)'],
      exampleCode: `مهمة رئيسية():
    اطبع("🎮 تشغيل محرك الألعاب الرسومي ثنائي الأبعاد...")
    استورد("محرك_الألعاب_الرسومي")
    
    محرك_الألعاب_الرسومي.تهيئة_الشاشة(٨٠٠، ٦٠٠، "مغامرات البيان")
    
    // كرر محاكاة دورة اللعبة لـ 100 إطار رسومي متحرك
    لكل إطار في المجال(١، ١٠٠):
        محرك_الألعاب_الرسومي.مسح_الشاشة()
        محرك_الألعاب_الرسومي.رسم_لاعب(١٠٠ + إطار، ٢٥٠)
        محرك_الألعاب_الرسومي.تحديث()
    نهاية
    
    اطبع("🎮 انتهى عرض محاكاة محرك الألعاب بنجاح.")
نهاية`
    },
    {
      id: 'nlp_arabic',
      name: 'معالج معالجة اللغات الطبيعية (العربية)',
      importName: 'معالجة_اللغات_الطبيعية',
      version: 'v1.1.2',
      size: '145 KB',
      downloads: '2,810',
      developer: 'مجمع اللغة العربية الرقمي',
      category: 'nlp',
      categoryLabel: 'معالجة اللغات',
      icon: <FileText className="text-teal-400 w-5 h-5" />,
      description: 'محلل لغوي فريد لاستخراج الجذور الثلاثية والرباعية للكلمات العربية، والتعرف على الكلمات، والتشكيل التلقائي للنصوص بدقة متناهية مستنداً للذكاء الاصطناعي.',
      dependencies: [],
      exampleCode: `مهمة رئيسية():
    اطبع("✍️ تهيئة معالج اللغة العربية والذكاء اللغوي...")
    استورد("معالجة_اللغات_الطبيعية")
    
    عرف بيت_شعر = "وَأَعْظَمُ البَيَانِ مَا كَانَ عَرَبِيَّ النَّسَبِ"
    
    // تقسيم النص وتحديد الكلمات الرئيسية
    عرف كلمات = معالجة_اللغات_الطبيعية.تقطيع_نص(بيت_شعر)
    اطبع("الكلمات المفصلة:")
    اطبع(كلمات)
    
    // استخراج الجذور الثلاثية الأصلية للكلمات
    عرف جذور = معالجة_اللغات_الطبيعية.استخراج_الجذور(بيت_شعر)
    اطبع("الجذور اللغوية المستخرجة:")
    اطبع(جذور)
نهاية`
    },
    {
      id: 'audio_synthesis',
      name: 'منظومة توليد الصوتيات والترددات والسينث',
      importName: 'وسائط_متقدمة_وصوت',
      version: 'v1.5.0',
      size: '65 KB',
      downloads: '1,530',
      developer: 'مختبر الصوتيات الرقمية',
      category: 'audio',
      categoryLabel: 'الصوتيات والوسائط',
      icon: <Volume2 className="text-pink-400 w-5 h-5" />,
      description: 'توليد النغمات وتعديل موجات الصوت (التردد الجيبي، المربع، السن المنشاري)، وتوليف النطق الصوتي العربي وتحويل الكود إلى ملفات موجية WAV مسموعة.',
      dependencies: [],
      exampleCode: `مهمة رئيسية():
    اطبع("🎵 تهيئة مكتبة توليد الصوت والترددات الجيبية...")
    استورد("وسائط_متقدمة_وصوت")
    
    // توليد تردد نغمة "لا" (A4) بتردد 440 هرتز لمدة 1.5 ثانية
    وسائط_متقدمة_وصوت.توليد_تردد(٤٤٠، ١.٥)
    
    // تشغيل محاكاة النطق الصوتي العربي التلقائي
    وسائط_متقدمة_وصوت.تشغيل_نص_صوتي("أهلاً بك في استوديو البيان")
    
    اطبع("🎵 تم إخراج ترددات الصوت بنجاح.")
نهاية`
    },
    {
      id: 'ai_neural_deep',
      name: 'الشبكات العصبية العميقة والتعلم التطوري',
      importName: 'محاكي_الشبكات_العصبية_العميقة',
      version: 'v2.2.0',
      size: '188 KB',
      downloads: '4,105',
      developer: 'فريق تطوير البيان',
      category: 'ai',
      categoryLabel: 'الذكاء الاصطناعي',
      icon: <Sparkles className="text-purple-400 w-5 h-5" />,
      description: 'بناء شبكات عصبية عميقة (Deep Neural Networks) بمرونة عالية، مع إمكانية تحديد دوال التنشيط وطبقات الإخفاء وتدريب النماذج عبر خوارزميات جينية.',
      dependencies: ['عصبية (مدمجة)'],
      exampleCode: `مهمة رئيسية():
    اطبع("🧠 تهيئة محاكي الشبكات العصبية العميقة المتطور...")
    استورد("محاكي_الشبكات_العصبية_العميقة")
    
    // إنشاء نموذج شبكة عصبية متعددة الطبقات
    عرف شبكة = محاكي_الشبكات_العصبية_العميقة.بناء("4,16,8,2")
    محاكي_الشبكات_العصبية_العميقة.تعيين_دالة_التنشيط(شبكة، "ReLU")
    
    // محاكاة تدريب الشبكة العصبية لـ 100 دورة
    محاكي_الشبكات_العصبية_العميقة.تدريب_بيانات(شبكة، "inputs.csv", "labels.csv", ١٠٠)
    
    عرف توقع = محاكي_الشبكات_العصبية_العميقة.توقع_فردي(شبكة، "0.9,0.1,0.5,0.2")
    اطبع("توقع وتصنيف الشبكة العصبية المستقر:")
    اطبع(توقع)
نهاية`
    },
    {
      id: 'quantum_simulator',
      name: 'محاكاة الحوسبة الكمية وبوابات تراكب الكيوبيتس',
      importName: 'كمومية_متقدمة',
      version: 'v1.0.1',
      size: '72 KB',
      downloads: '2,401',
      developer: 'مركز أبحاث الحوسبة الكمية العربي',
      category: 'ai',
      categoryLabel: 'الرياضيات والعلوم',
      icon: <Binary className="text-emerald-500 w-5 h-5 animate-pulse" />,
      description: 'محاكاة كاملة للمعالجات الكمية ودوائر الكيوبيتس الفائقة، تتيح تمثيل البوابات الكمومية مثل Hadamard و CNOT وحساب التشابك والانهيار الموجي بفاعلية.',
      dependencies: [],
      exampleCode: `مهمة رئيسية():
    اطبع("⚛️ تشغيل محاكي الكمومية المتقدم للبيان...")
    استورد("كمومية_متقدمة")
    
    عرف كيو = كمومية_متقدمة.إنشاء_مسجل(٣)
    كمومية_متقدمة.تطبيق_بوابة_هادامارد(كيو، ٠)
    كمومية_متقدمة.تشابك_ثنائي(كيو، ٠، ١)
    
    عرف القياس = كمومية_متقدمة.رصد_وقياس(كيو)
    اطبع("نتائج رصد الانهيار الموجي الكمي:")
    اطبع(القياس)
نهاية`
    },
    {
      id: 'iot_hardware',
      name: 'إنترنت الأشياء والتحكم في العتاد واللوحات الذكية',
      importName: 'عتاد_البيان',
      version: 'v1.2.0',
      size: '95 KB',
      downloads: '1,890',
      developer: 'مهندسو الإلكترونيات العرب',
      category: 'iot',
      categoryLabel: 'إنترنت الأشياء والعتاد',
      icon: <Smartphone className="text-orange-400 w-5 h-5" />,
      description: 'مكتبة ممتازة مخصصة للتحكم في اللوحات التطويرية مثل Raspberry Pi و Arduino عن بعد ومحلياً، قراءة وكتابة منافذ GPIO والتحكم في الحساسات والإضاءة الذكية.',
      dependencies: [],
      exampleCode: `مهمة رئيسية():
    اطبع("🔌 جاري تهيئة الاتصال بلوحة الأردوينو/راسبيري باي...")
    استورد("عتاد_البيان")
    
    عتاد_البيان.تعيين_المنفذ(١٣، "مخرج")
    
    // محاكاة إرسال نبضات كهربائية متقطعة
    كرر (٥) مرات:
        عتاد_البيان.كتابة_رقمية(١٣، "مرتفع")
        جهاز.انتظار(٥٠٠)
        عتاد_البيان.كتابة_رقمية(١٣، "منخفض")
        جهاز.انتظار(٥٠٠)
    نهاية
    اطبع("⚡ تم إتمام دورة التحكم بالعتاد بنجاح.")
نهاية`
    },
    {
      id: 'web_server',
      name: 'محرك خدمات الويب السريعة وبناء الـ APIs',
      importName: 'خادم_الويب',
      version: 'v2.0.2',
      size: '112 KB',
      downloads: '3,450',
      developer: 'مجموعة المطورين السحابية',
      category: 'web',
      categoryLabel: 'تطوير الويب السحابي',
      icon: <Workflow className="text-cyan-400 w-5 h-5" />,
      description: 'إطار متكامل لبناء خوادم الويب وربط مسارات الـ API الخلفية للغة البيان، يدعم الاستجابات النصية وملفات JSON والتحكم في بروتوكولات الخادم وجلسات المستخدم.',
      dependencies: ['اتصال_شبكي'],
      exampleCode: `مهمة رئيسية():
    اطبع("🚀 جاري بدء تشغيل خادم ويب البيان المحلي...")
    استورد("خادم_الويب")
    
    عرف تطبيق = خادم_الويب.إنشاء_خادم(٣٠٠٠)
    
    تطبيق.عند_طلب("GET", "/"):
        خادم_الويب.إرسال_رد("<h1>مرحباً بك في ويب البيان الفائق</h1>")
    نهاية
    
    تطبيق.عند_طلب("GET", "/api/data"):
        خادم_الويب.إرسال_json("status=active&core=quantum")
    نهاية
    
    تطبيق.بدء()
نهاية`
    },
    {
      id: 'finance_trading',
      name: 'التداول الخوارزمي والتحليل المالي الكمي',
      importName: 'التحليل_المالي',
      version: 'v1.5.6',
      size: '85 KB',
      downloads: '1,230',
      developer: 'محللو الأسواق والتداول الذكي',
      category: 'finance',
      categoryLabel: 'التحليل المالي والكمي',
      icon: <LineChart className="text-yellow-400 w-5 h-5" />,
      description: 'تحليل السلاسل الزمنية للأسواق المالية والعملات الرقمية، حساب المؤشرات الفنية المتقدمة مثل RSI و MACD وتوليد قرارات تداول خوارزمية مؤتمتة.',
      dependencies: ['رياضيات_متقدمة'],
      exampleCode: `مهمة رئيسية():
    اطبع("📈 تشغيل خوارزمية التداول الكمي وتحليل المؤشرات...")
    استورد("التحليل_المالي")
    
    عرف أسعار = التحليل_المالي.جلب_تاريخي("BTC/USD", "1d")
    عرف المتوسط_المتحرك = التحليل_المالي.حساب_المتوسط(أسعار، ٢٠)
    
    اطبع("المتوسطات المتحركة المحسوبة لـ 20 يوماً:")
    اطبع(المتوسط_المتحرك)
    
    عرف القرار = التحليل_المالي.إشارة_التداول(أسعار)
    اطبع("🎯 القرار الاستثماري المقترح:")
    اطبع(القرار)
نهاية`
    },
    {
      id: 'vision_ai',
      name: 'محرك الرؤية الحاسوبية ومعالجة الصور والفيديو',
      importName: 'رؤية_الحاسوب',
      version: 'v1.6.0',
      size: '175 KB',
      downloads: '2,110',
      developer: 'معهد الذكاء البصري العربي',
      category: 'ai',
      categoryLabel: 'الذكاء الاصطناعي',
      icon: <Eye className="text-violet-400 w-5 h-5" />,
      description: 'تطبيق أدوات الرؤية الحاسوبية لمعالجة وتعديل الصور واكتشاف حواف الكائنات والتعرف على الوجوه والعلامات المكتوبة عبر خوارزميات الذكاء الاصطناعي البصري.',
      dependencies: [],
      exampleCode: `مهمة رئيسية():
    اطبع("👁️ جاري تشغيل محرك الرؤية الحاسوبية وتصنيف الوجوه...")
    استورد("رؤية_الحاسوب")
    
    عرف صورة = رؤية_الحاسوب.تحميل_ملف("camera_input.jpg")
    عرف مصفوفة_الوجوه = رؤية_الحاسوب.رصد_وجوه(صورة)
    
    اطبع("عدد الوجوه المكتشفة بالصورة:")
    اطبع(رؤية_الحاسوب.طول(مصفوفة_الوجوه))
    
    رؤية_الحاسوب.تطبيق_تأثير(صورة، "توهج_كمي")
    رؤية_الحاسوب.حفظ_صورة(صورة, "output.jpg")
نهاية`
    },
    {
      id: 'arabic_diacritics',
      name: 'معالج تشكيل النصوص واللسانيات العربية الفصحى',
      importName: 'التشكيل_والنطق',
      version: 'v1.3.1',
      size: '92 KB',
      downloads: '1,980',
      developer: 'مجمع اللغة العربية الرقمي',
      category: 'nlp',
      categoryLabel: 'معالجة اللغات',
      icon: <FileText className="text-emerald-500 w-5 h-5" />,
      description: 'أداة مميزة مخصصة للتشكيل التلقائي وضبط أواخر الكلمات العربية بالاعتماد على التحليل الإعرابي واللساني، وتوفير قواعد صرف نحوية متكاملة.',
      dependencies: ['معالجة_اللغات_الطبيعية'],
      exampleCode: `مهمة رئيسية():
    اطبع("📝 تهيئة معالج تشكيل الكلمات والمقاطع اللغوية...")
    استورد("التشكيل_والنطق")
    
    عرف نص_خام = "اللغة العربية هي لغة البيان والجمال"
    عرف نص_مشكول = التشكيل_والنطق.تشكيل_آلي(نص_خام)
    
    اطبع("النص بعد تشكيله تلقائياً:")
    اطبع(نص_مشكول)
    
    التشكيل_والنطق.تحويل_لنطق_صوتي(نص_مشكول، "فصحى_مبسطة")
نهاية`
    },
    {
      id: 'physics_3d',
      name: 'محاكي الفيزياء الكلاسيكية والرسوميات ثلاثية الأبعاد',
      importName: 'محرك_الفيزياء_والأبعاد',
      version: 'v2.1.2',
      size: '198 KB',
      downloads: '1,450',
      developer: 'مختبرات الألعاب العربية',
      category: 'graphics',
      categoryLabel: 'الرسوميات والألعاب',
      icon: <Gamepad2 className="text-orange-500 w-5 h-5" />,
      description: 'حساب التسارع، قوة الجاذبية والتصادمات ثنائية وثلاثية الأبعاد للأجسام، ومحاكاة حركة الكتل والجسيمات تحت تأثير القوى الفيزيائية الطبيعية.',
      dependencies: ['رياضيات_متقدمة'],
      exampleCode: `مهمة رئيسية():
    اطبع("🧱 تهيئة محاكي الجاذبية والأبعاد الثلاثية...")
    استورد("محرك_الفيزياء_والأبعاد")
    
    محرك_الفيزياء_والأبعاد.تهيئة_فضاء_ثلاثي(١٠٠٠، ٨٠٠)
    عرف كرة = محرك_الفيزياء_والأبعاد.إنشاء_جسم("كرة"، ١٠)
    محرك_الفيزياء_والأبعاد.تطبيق_جاذبية(كرة، -٩.٨)
    
    لكل خطوة في المجال(١، ١٥):
        محرك_الفيزياء_والأبعاد.تحديث_الفيزياء()
        عرف الارتفاع = محرك_الفيزياء_والأبعاد.جلب_موقع_ص(كرة)
        اطبع(الارتفاع)
    نهاية
نهاية`
    },
    {
      id: 'bio_genetics',
      name: 'محاكاة الجينوم والتحليل الحيوي الحوسبي',
      importName: 'التحليل_الجيني',
      version: 'v1.0.5',
      size: '115 KB',
      downloads: '1,120',
      developer: 'معهد اللسانيات الحيوية والطب الحسابي',
      category: 'ai',
      categoryLabel: 'العلوم والتحليل الجيني',
      icon: <Binary className="text-emerald-400 w-5 h-5" />,
      description: 'أداة علمية متطورة لتحليل وفهرسة سلاسل الحمض النووي (DNA/RNA)، واكتشاف الطفرات والجينات الوراثية ومحاكاة تطور السلاسل الحيوية عبر النماذج التطورية.',
      dependencies: ['رياضيات_متقدمة'],
      exampleCode: `مهمة رئيسية():
    اطبع("🧬 بدء محاكاة فحص تسلسل الحمض النووي DNA...")
    استورد("التحليل_الجيني")
    
    عرف شريط = "AGCTTTTCATTCTGACTGCAACGGGCAATATGTCTCT"
    
    // تحليل نسب توزيع القواعد النيتروجينية بالبصمة
    عرف الاحصائيات = التحليل_الجيني.تحليل_القواعد(شريط)
    اطبع("إحصائيات القواعد الجينية:")
    اطبع(الاحصائيات)
    
    // محاكاة تحويل DNA إلى RNA
    عرف شريط_الرنا = التحليل_الجيني.نسخ_رنا(شريط)
    اطبع("شريط الـ RNA المنسوخ:")
    اطبع(شريط_الرنا)
نهاية`
    },
    {
      id: 'blockchain_bayan',
      name: 'منظومة سلسلة الكتل (Blockchain) والعقود الذكية',
      importName: 'سلسلة_الكتل_الذكية',
      version: 'v1.1.0',
      size: '134 KB',
      downloads: '2,310',
      developer: 'فريق التشفير والحلول اللامركزية',
      category: 'security',
      categoryLabel: 'الأمن وسلاسل الكتل',
      icon: <ShieldCheck className="text-cyan-400 w-5 h-5" />,
      description: 'بناء كتل وتواقيع مشفرة، التحقق من المعاملات المالية والعملات الرقمية، وصياغة عقود ذكية متكاملة تعمل على شبكة البيان اللامركزية وتخزينها بأمان.',
      dependencies: ['أمان_وتشفير'],
      exampleCode: `مهمة رئيسية():
    اطبع("⛓️ جاري تهيئة شبكة سلسلة كتل البيان اللامركزية...")
    استورد("سلسلة_الكتل_الذكية")
    
    // إنشاء كتل جديدة وبناء الشبكة
    عرف شبكة = سلسلة_الكتل_الذكية.إنشاء_سلسلة()
    
    اطبع("إضافة معاملة ذكية مشفرة...")
    سلسلة_الكتل_الذكية.إضافة_معاملة(شبكة, "أحمد", "يوسف", "١٠.٥ بيان")
    
    // تعدين الكتلة وتفعيل خوارزمية إثبات العمل Proof of Work
    سلسلة_الكتل_الذكية.تعدين_كتلة_جديدة(شبكة)
    
    عرف الصلاحية = سلسلة_الكتل_الذكية.التحقق_من_الشبكة(شبكة)
    اطبع("حالة تكامل وصحة سلسلة الكتل:")
    اطبع(الصلاحية)
نهاية`
    },
    {
      id: 'data_science_viz',
      name: 'محلل البيانات الضخمة والإحصاء الرسومي المطور',
      importName: 'البيانات_والإحصاء',
      version: 'v2.0.0',
      size: '162 KB',
      downloads: '3,890',
      developer: 'محللو البيانات والذكاء الإحصائي',
      category: 'database',
      categoryLabel: 'علم وتحليل البيانات',
      icon: <LineChart className="text-teal-400 w-5 h-5" />,
      description: 'تحليل البيانات المجدولة، حساب الانحرافات المعيارية والتباين والوسيط الإحصائي، وتصميم وتوليد خرائط ونقاط تشتت بالاعتماد على مخرجات البيانات الضخمة.',
      dependencies: ['رياضيات_متقدمة'],
      exampleCode: `مهمة رئيسية():
    اطبع("📊 تهيئة محرك البيانات والإحصاء الرسومي...")
    استورد("البيانات_والإحصاء")
    
    عرف مجموعة_البيانات = "١٠، ١٢، ١٥، ٢٢، ٢٠، ٢٤، ٣٥، ٤٠"
    
    // حساب المتوسط الإحصائي والانحراف المعياري للبيانات
    عرف المتوسط = البيانات_والإحصاء.حساب_المتوسط(مجموعة_البيانات)
    عرف الانحراف = البيانات_والإحصاء.حساب_الانحراف(مجموعة_البيانات)
    
    اطبع("المتوسط الحسابي:")
    اطبع(المتوسط)
    اطبع("الانحراف المعياري:")
    اطبع(الانحراف)
نهاية`
    },
    {
      id: 'ar_vr_core',
      name: 'محاكي الواقع الافتراضي والمعزز ثلاثي الأبعاد XR',
      importName: 'الواقع_الافتراضي_والمعزز',
      version: 'v1.0.0',
      size: '245 KB',
      downloads: '1,150',
      developer: 'مختبرات الأبعاد التفاعلية',
      category: 'graphics',
      categoryLabel: 'الواقع الافتراضي XR',
      icon: <Eye className="text-pink-500 w-5 h-5 animate-pulse" />,
      description: 'تصميم وبناء بيئات افتراضية تفاعلية، توجيه الأجسام وتتبع الحركات المجسمة عبر مستشعرات الاتجاه للهواتف الذكية وتوليد مشاهد ثلاثية الأبعاد خفيفة.',
      dependencies: ['محرك_الفيزياء_والأبعاد'],
      exampleCode: `مهمة رئيسية():
    اطبع("👓 تهيئة فضاء الواقع الافتراضي والمعزز للبيان...")
    استورد("الواقع_الافتراضي_والمعزز")
    
    الواقع_الافتراضي_والمعزز.بدء_البث_الفضائي()
    عرف كائن = الواقع_الافتراضي_والمعزز.إضافة_نموذج_ثلاثي("mesh_pyramid.obj")
    
    // تدوير كائن الهرم الافتراضي بمقدار 45 درجة حول المحور الرأسي
    الواقع_الافتراضي_والمعزز.تدوير_الكائن(كائن، ٤٥، "ص")
    الواقع_الافتراضي_والمعزز.تحديث_المشهد()
    
    اطبع("✨ تم توليد وإسقاط الهولوغرام بنجاح.")
نهاية`
    },
    {
      id: 'sys_automation',
      name: 'مكتبة أتمتة نظام التشغيل وإدارة خادم البيان',
      importName: 'أتمتة_النظام',
      version: 'v1.5.0',
      size: '78 KB',
      downloads: '2,420',
      developer: 'مجتمع مطوري الأنظمة السحابية',
      category: 'web',
      categoryLabel: 'أتمتة وخوادم سحابية',
      icon: <Workflow className="text-yellow-500 w-5 h-5" />,
      description: 'أتمتة المهام اليومية، تفحص الملفات والمجلدات وجدولتها دورياً، مراقبة مستويات استهلاك الذاكرة، وإرسال تنبيهات تلقائية وإدارة الخادم والعمليات النشطة.',
      dependencies: [],
      exampleCode: `مهمة رئيسية():
    اطبع("🤖 تشغيل ميكانيكية الأتمتة وإدارة مجلدات النظام...")
    استورد("أتمتة_النظام")
    
    // جدولة مهمة تنظيف دورية للملفات المؤقتة كل 10 ثوانٍ
    أتمتة_النظام.جدولة_مهمة("تنظيف_مؤقت"، ١٠)
    
    عرف مساحة_القرص = أتمتة_النظام.تفحص_مساحة_القرص()
    اطبع("المساحة المتوفرة بالقرص الصلب:")
    اطبع(مساحة_القرص)
نهاية`
    },
    {
      id: 'robotics_control',
      name: 'محرك التحكم بالروبوتات وحساب كينماتيكا الحركة',
      importName: 'تحكم_الروبوت_الحركي',
      version: 'v1.2.2',
      size: '110 KB',
      downloads: '1,090',
      developer: 'مهندسو الميكاترونكس والتحكم الآلي',
      category: 'iot',
      categoryLabel: 'ميكاترونكس وروبوتات',
      icon: <Cpu className="text-orange-500 w-5 h-5" />,
      description: 'التحكم بالذراع الروبوتية والمفاصل وحساب مسارات الحركة وكينماتيكا الزوايا العكسية، وقراءة بيانات الحساسات الحركية الفوق صوتية والتوجيه الآلي.',
      dependencies: ['عتاد_البيان'],
      exampleCode: `مهمة رئيسية():
    اطبع("🦾 تهيئة وحدة معالجة الذراع الميكانيكي الروبوتي...")
    استورد("تحكم_الروبوت_الحركي")
    
    // تحديد منفذ المحرك المؤازر ومحاكاة التوجيه لزاوية 90 درجة
    تحكم_الروبوت_الحركي.تهيئة_محرك_مؤازر(٩)
    تحكم_الروبوت_الحركي.توجيه_المحرك(٩، ٩٠)
    
    عرف المسافة_الحرجة = تحكم_الروبوت_الحركي.قراءة_حساس_المسافة()
    اطبع("المسافة المستشعرة من الحائط بالمليمتر:")
    اطبع(المسافة_الحرجة)
نهاية`
    },
    {
      id: 'fast_machine_learning',
      name: 'مكتبة تعلم الآلة والتحليل التنبؤي الذكي',
      importName: 'التعلم_الآلي_السريع',
      version: 'v1.0.0',
      size: '148 KB',
      downloads: '1,890',
      developer: 'مختبرات الذكاء الإحصائي للبيان',
      category: 'ai',
      categoryLabel: 'الذكاء والعلوم',
      icon: <Brain className="text-pink-400 w-5 h-5" />,
      description: 'تصنيف البيانات وبناء النماذج التنبؤية مثل أشجار القرار، الانحدار الخطي، والتقسيم العنقودي (K-Means) بصورة مدمجة وفورية بدون حاجة لمكتبات بايثون ثقيلة.',
      dependencies: ['البيانات_والإحصاء'],
      exampleCode: `مهمة رئيسية():
    اطبع("🧠 تهيئة مصفوفات التعلم الآلي السريع للبيان...")
    استورد("التعلم_الآلي_السريع")
    
    // تعريف نموذج الانحدار الخطي للتنبؤ بالمبيعات
    عرف نموذج = التعلم_الآلي_السريع.إنشاء_نموذج_انحدار()
    
    // إدخال بيانات التدريب: (المدخلات: السعر، المخرجات: المبيعات المتوقعة)
    التعلم_الآلي_السريع.تدريب_النموذج(نموذج، "١٠، ٢٠، ٣٠، ٤٠"، "١٠٠، ١٨٠، ٢٩٠، ٤١٠")
    
    // التنبؤ بقيمة مبيعات لمنتج بسعر ٢٥ وحدة نقدية
    عرف مبيعات_متوقعة = التعلم_الآلي_السريع.توقع(نموذج، ٢٥)
    اطبع("المبيعات التقديرية المتوقعة:")
    اطبع(مبيعات_متوقعة)
نهاية`
    },
    {
      id: 'bayan_ui_kit',
      name: 'حزمة بناء واجهات المستخدم الرسومية والديناميكية',
      importName: 'برمجة_واجهات_المستخدم',
      version: 'v1.1.2',
      size: '185 KB',
      downloads: '3,110',
      developer: 'مجموعة تطوير الواجهات العربية',
      category: 'web',
      categoryLabel: 'تطوير الويب والواجهات',
      icon: <Smartphone className="text-violet-400 w-5 h-5" />,
      description: 'بناء واجهات مستخدم تصريحية (Declarative UI Layouts) مخصصة لتطبيقات الويب والهواتف بنظام السحب الذاتي، وإضافة النوافذ والأزرار والبطاقات التفاعلية بسهولة.',
      dependencies: ['أرسم'],
      exampleCode: `مهمة رئيسية():
    اطبع("📱 بدء تشغيل محرك بناء الواجهات الديناميكية...")
    استورد("برمجة_واجهات_المستخدم")
    
    // بناء إطار نافذة التطبيق الأساسي
    عرف تطبيق = برمجة_واجهات_المستخدم.صنع_إطار("حساباتي")
    برمجة_واجهات_المستخدم.تعيين_الأبعاد(تطبيق، ٤٠٠، ٦٠٠)
    
    // إضافة مكونات واجهة مستخدم تفاعلية داخل التطبيق
    برمجة_واجهات_المستخدم.إضافة_عنوان(تطبيق، "لوحة التحكم المالي الشخصي")
    برمجة_واجهات_المستخدم.إضافة_زر(تطبيق، "إضافة_مصروف"، "تسجيل معاملة جديدة")
    
    برمجة_واجهات_المستخدم.عرض_الواجهة(تطبيق)
    اطبع("✅ تم تفعيل تخطيط واجهة المستخدم بنجاح.")
نهاية`
    },
    {
      id: 'cyber_sentinel',
      name: 'منظومة فحص الاختراق وتحليل أمن الشبكات',
      importName: 'محلل_الأمن_السيبراني',
      version: 'v2.0.1',
      size: '96 KB',
      downloads: '1,720',
      developer: 'المعهد العربي للأمن السيبراني',
      category: 'security',
      categoryLabel: 'الأمن السيبراني والوقاية',
      icon: <Lock className="text-rose-500 w-5 h-5" />,
      description: 'تفحص أمن الشبكات والـ Ports المفتوحة، محاكاة اختبارات الاختراق المعتمدة، توليد مفاتيح التشفير التناظرية وغير التناظرية لضمان سلامة خوادم الويب وتأمين البيانات.',
      dependencies: ['أمان_وتشفير'],
      exampleCode: `مهمة رئيسية():
    اطبع("🔒 تشغيل منظومة محلل الأمن السيبراني النشط...")
    استورد("محلل_الأمن_السيبراني")
    
    // إجراء فحص أمني محاكي لخادم الويب المحلي
    عرف تقرير_الفحص = محلل_الأمن_السيبراني.فحص_الثغرات("localhost")
    اطبع("حالة الفحص الأمني السريع:")
    اطبع(تقرير_الفحص)
    
    // توليد واختبار قوة كلمات المرور ومفاتيح الهاش المشفرة
    عرف هاش = محلل_الأمن_السيبراني.توليد_بصمة_آمنة("MySecretPass123!")
    اطبع("بصمة التشفير الناتجة (Hash Key):")
    اطبع(هاش)
نهاية`
    },
    {
      id: 'quantum_graphics',
      name: 'محرك الفنون التوليدية والرسوم الإجرائية الكمية',
      importName: 'توليد_الرسومات_الكمومية',
      version: 'v1.0.1',
      size: '124 KB',
      downloads: '940',
      developer: 'مختبرات الفن الإبداعي الكمومي',
      category: 'graphics',
      categoryLabel: 'الرسومات والفن التوليدي',
      icon: <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />,
      description: 'محرك لرسم وتوليد الفنون التوليدية واللوحات الفنية الإجرائية من خلال إسقاط نتائج انهيار الموجات الكمية ومحاكاة مصفوفات الضوضاء اللانهائية.',
      dependencies: ['أرسم', 'كمومية_متقدمة'],
      exampleCode: `مهمة رئيسية():
    اطبع("🎨 تهيئة محرك توليد الفنون الرسومية والضوضاء الكمية...")
    استورد("توليد_الرسومات_الكمومية")
    
    توليد_الرسومات_الكمومية.تهيئة_لوحة_الفن(٨٠٠، ٦٠٠)
    
    // تخليق حقل تدفق فني اعتماداً على مصفوفة تشابك كمي افتراضية
    عرف حقل_تدفق = توليد_الرسومات_الكمومية.توليد_حقل_تدفق_كمي()
    توليد_الرسومات_الكمومية.رسم_دوائر_تدفق(حقل_تدفق، "#6366f1"، "#10b981")
    
    توليد_الرسومات_الكمومية.حفظ_اللوحة("art_quantum.png")
    اطبع("✨ تم الانتهاء من رسم وحفظ اللوحة التوليدية بنجاح.")
نهاية`
    },
    {
      id: 'bayan_translator',
      name: 'المترجم اللغوي الذكي للمصطلحات البرمجية والتعريب',
      importName: 'مترجم_المصطلحات_التقنية',
      version: 'v1.2.0',
      size: '89 KB',
      downloads: '2,650',
      developer: 'هيئة تعريب العلوم البرمجية للبيان',
      category: 'nlp',
      categoryLabel: 'اللسانيات والمعاجم البرمجية',
      icon: <Languages className="text-indigo-400 w-5 h-5" />,
      description: 'ترجمة فورية للمصطلحات البرمجية والبروتوكولات الفنية الإنجليزية إلى اللغة العربية الفصحى المفهومة، ومطابقة الأكواد لتسهيل التعريب وبناء المحررات الذكية.',
      dependencies: ['معالجة_اللغات_الطبيعية'],
      exampleCode: `مهمة رئيسية():
    اطبع("📖 تشغيل معجم ومترجم المصطلحات التقنية المدمج...")
    استورد("مترجم_المصطلحات_التقنية")
    
    // ترجمة وتعريب مصطلحات مألوفة في برمجيات الويب والشبكات
    عرف تعريب_١ = مترجم_المصطلحات_التقنية.تعريب("Asynchronous Function")
    عرف تعريب_٢ = مترجم_المصطلحات_التقنية.تعريب("Database Handshake Protocol")
    
    اطبع("تعريب المصطلح الأول:")
    اطبع(تعريب_١)
    اطبع("تعريب المصطلح الثاني:")
    اطبع(تعريب_٢)
نهاية`
    }
  ];

  // Map category on items
  const preparedLibraries = LIBRARIES.map(lib => {
    return lib;
  });

  // Filter items based on search and selected category
  const filteredLibs = preparedLibraries.filter(lib => {
    const matchesSearch = 
      lib.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lib.importName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lib.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lib.developer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || lib.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Automatically select the first library of the filtered list if none is selected
  useEffect(() => {
    if (filteredLibs.length > 0) {
      if (!selectedLib || !filteredLibs.some(l => l.id === selectedLib.id)) {
        setSelectedLib(filteredLibs[0]);
      }
    } else {
      setSelectedLib(null);
    }
  }, [searchQuery, selectedCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInstall = (lib: LibraryItem) => {
    if (installedLibs.includes(lib.id)) return;
    
    setInstallingLibId(lib.id);
    setInstallProgress(0);
    setInstallLogs([`[1/4] الاتصال بمستودع الحزم المركزي لـ Al-Bayan...`]);

    const interval = setInterval(() => {
      setInstallProgress(prev => {
        const next = prev + 10;
        if (next === 30) {
          setInstallLogs(l => [...l, `[2/4] جاري جلب الحزمة "${lib.importName}" (${lib.size}) وتفحص التوقيع الرقمي...`]);
        }
        if (next === 60) {
          if (lib.dependencies.length > 0) {
            setInstallLogs(l => [...l, `[3/4] حل التبعيات المطلوبة: جاري تحميل التبعية ${lib.dependencies.join('، ')}...`]);
          } else {
            setInstallLogs(l => [...l, `[3/4] التبعيات مستقرة وتلقائية. جاري تسجيل الأكواد وإلحاق محدد الاستيراد...`]);
          }
        }
        if (next === 90) {
          setInstallLogs(l => [...l, `[4/4] جاري تشغيل المترجم الكمومي الداخلي وتسجيل الحزمة في نظام الاستيراد استورد("${lib.importName}").`]);
        }
        if (next >= 100) {
          clearInterval(interval);
          setInstallingLibId(null);
          
          const updated = [...installedLibs, lib.id];
          setInstalledLibs(updated);
          localStorage.setItem('bayan_installed_libraries', JSON.stringify(updated));
          
          showToast(`✅ تم تثبيت مكتبة "${lib.name}" بنجاح! جاهزة للاستيراد.`);
          return 100;
        }
        return next;
      });
    }, 250);
  };

  const handleUninstall = (libId: string, libName: string) => {
    const updated = installedLibs.filter(id => id !== libId);
    setInstalledLibs(updated);
    localStorage.setItem('bayan_installed_libraries', JSON.stringify(updated));
    showToast(`🗑️ تم إلغاء تثبيت مكتبة "${libName}" من مشروعك.`);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLoadDemo = (lib: LibraryItem) => {
    onLoadExample(lib.exampleCode);
    onClose();
    showToast(`🚀 تم تحميل مثال مكتبة "${lib.name}" في محرر الأكواد بنجاح!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200" id="library-manager-modal">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500 text-slate-100 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs" dir="rtl">
          <Sparkles className="text-yellow-400 w-4 h-4 animate-spin" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="bg-[#0f172a] w-full max-w-6xl h-full sm:h-[90vh] rounded-none sm:rounded-2xl border-0 sm:border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative text-slate-100 font-sans" dir="rtl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-lg border border-slate-700/50">
              <Grid className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                مستودع مكتبات البيان الشامل لجميع المجالات
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-bold">نشط ومؤمن 🔐</span>
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">استعرض وثبّت حزم ومكتبات متقدمة لتوسيع لغة البيان (استورد) لتشمل الذكاء الاصطناعي، الأمن، الاتصالات، إنترنت الأشياء، الرسوميات، اللسانيات والمالية</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all active:scale-95"
            id="close-lib-manager-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Master Container Layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Right Sidebar: Search, Filters, Library List */}
          <div className="w-full md:w-[42%] border-l border-slate-800 flex flex-col min-h-0 bg-slate-900/10">
            {/* Search and Category header */}
            <div className="p-4 border-b border-slate-800/80 space-y-3 shrink-0">
              <div className="relative">
                <Search className="absolute right-3 top-2.5 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مكتبة بالاسم، المعرّف أو المطور..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-all font-sans"
                />
              </div>

              {/* Category Quick Filter */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 custom-scrollbar text-[11px] font-bold">
                <span className="text-slate-500 shrink-0 flex items-center gap-0.5"><Filter size={11} /> المجالات:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    selectedCategory === 'all' 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الكل ({preparedLibraries.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('ai')}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    selectedCategory === 'ai' 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الذكاء والعلوم
                </button>
                <button
                  onClick={() => setSelectedCategory('web')}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    selectedCategory === 'web' 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  تطوير الويب
                </button>
                <button
                  onClick={() => setSelectedCategory('iot')}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    selectedCategory === 'iot' 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  إنترنت الأشياء
                </button>
                <button
                  onClick={() => setSelectedCategory('database')}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    selectedCategory === 'database' 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  البيانات
                </button>
                <button
                  onClick={() => setSelectedCategory('security')}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    selectedCategory === 'security' 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الحماية
                </button>
                <button
                  onClick={() => setSelectedCategory('graphics')}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    selectedCategory === 'graphics' 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الألعاب والرسوميات
                </button>
                <button
                  onClick={() => setSelectedCategory('nlp')}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    selectedCategory === 'nlp' 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  اللغة العربية
                </button>
                <button
                  onClick={() => setSelectedCategory('finance')}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    selectedCategory === 'finance' 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800/30 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  التحليل المالي
                </button>
              </div>
            </div>

            {/* Libraries Scrollable List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {filteredLibs.length > 0 ? (
                filteredLibs.map((lib) => {
                  const isInstalled = installedLibs.includes(lib.id);
                  const isSelected = selectedLib?.id === lib.id;

                  return (
                    <div
                      key={lib.id}
                      onClick={() => setSelectedLib(lib)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative group flex gap-3 items-start ${
                        isSelected 
                          ? 'bg-gradient-to-l from-emerald-500/10 to-transparent border-emerald-500 text-emerald-100 shadow-md shadow-emerald-950/20' 
                          : 'bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-800/30 hover:border-slate-700/80'
                      }`}
                    >
                      {/* Library Category Icon Background */}
                      <div className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? 'bg-emerald-950/40 border border-emerald-800/60' : 'bg-slate-800 border border-slate-800'
                      }`}>
                        {lib.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-xs truncate group-hover:text-white transition-colors">
                            {lib.name}
                          </h3>
                          {/* Installation badge */}
                          {isInstalled && (
                            <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-900 px-1.5 py-0.2 rounded shrink-0 font-bold flex items-center gap-0.5">
                              <CheckCircle size={9} />
                              مثبتة
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[9.5px] font-mono text-slate-500">
                          <span>{lib.version}</span>
                          <span>•</span>
                          <span>{lib.size}</span>
                          <span>•</span>
                          <span className="text-slate-400">{lib.importName}</span>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {lib.description}
                        </p>
                      </div>

                      {/* Right Indicator arrow */}
                      <div className="self-center shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors">
                        <ChevronRight size={14} className="transform rotate-180" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-3">
                  <Terminal size={32} className="text-slate-700 animate-pulse" />
                  <p className="text-xs">لم يتم العثور على أي مكتبة تطابق معايير البحث.</p>
                </div>
              )}
            </div>

            {/* List Footer Count */}
            <div className="p-3 border-t border-slate-800/60 bg-slate-950/30 text-[10px] text-slate-500 flex items-center justify-between shrink-0 font-bold">
              <span>المكتبات المتاحة بالمستودع: {preparedLibraries.length} مكتبة كاملة</span>
              <span className="text-emerald-400">مثبتة لديك: {installedLibs.length} حزم</span>
            </div>
          </div>

          {/* Left Panel: Detailed Library Information */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#0c1322]">
            {selectedLib ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                
                {/* Header card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-800/80">
                  <div className="flex gap-3 items-center">
                    <div className="p-3 bg-slate-800/80 border border-slate-700/40 rounded-xl">
                      {selectedLib.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-md font-bold text-white">{selectedLib.name}</h2>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono font-bold">{selectedLib.version}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">الاستيراد عبر الكود: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-yellow-400 font-mono font-bold">استورد("{selectedLib.importName}")</code></p>
                    </div>
                  </div>

                  {/* Install / Uninstall Controls */}
                  <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                    {installedLibs.includes(selectedLib.id) ? (
                      <>
                        <button
                          onClick={() => handleLoadDemo(selectedLib)}
                          className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                        >
                          <Code size={14} />
                          <span>تجربة الكود في المحرر 🚀</span>
                        </button>
                        <button
                          onClick={() => handleUninstall(selectedLib.id, selectedLib.name)}
                          className="bg-slate-800 hover:bg-red-950/40 hover:text-red-400 border border-slate-700 px-3 py-2 rounded-xl text-xs transition-colors font-bold"
                          title="إلغاء التثبيت"
                        >
                          إلغاء
                        </button>
                      </>
                    ) : installingLibId === selectedLib.id ? (
                      <div className="w-full sm:w-52 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                        <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <RefreshCw size={10} className="animate-spin" />
                            جاري التثبيت...
                          </span>
                          <span>{installProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-200"
                            style={{ width: `${installProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleInstall(selectedLib)}
                        className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-emerald-500/15"
                      >
                        <Download size={14} />
                        <span>تثبيت المكتبة بمشروعك</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Installation Logs console if installing */}
                {installingLibId === selectedLib.id && (
                  <div className="bg-black/80 border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] text-slate-300 space-y-1" dir="ltr">
                    <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5 mb-2 text-slate-500">
                      <Terminal size={12} />
                      <span>AL-BAYAN PACKAGE MANAGER (BPM v1.0.4)</span>
                    </div>
                    {installLogs.map((log, idx) => (
                      <div key={idx} className={idx === installLogs.length - 1 ? "text-emerald-400 font-bold" : "text-slate-400"}>
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                {/* Metadata details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
                  <div className="bg-slate-900/20 border border-slate-800/60 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-bold">الناشر والمطور:</span>
                    <p className="text-xs font-bold text-slate-300 mt-1 truncate">{selectedLib.developer}</p>
                  </div>
                  <div className="bg-slate-900/20 border border-slate-800/60 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-bold">الحجم الصافي:</span>
                    <p className="text-xs font-bold text-slate-300 mt-1">{selectedLib.size}</p>
                  </div>
                  <div className="bg-slate-900/20 border border-slate-800/60 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-bold">عدد مرات التحميل:</span>
                    <p className="text-xs font-bold text-slate-300 mt-1">{selectedLib.downloads} تحميل</p>
                  </div>
                  <div className="bg-slate-900/20 border border-slate-800/60 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-bold">التبعيات البرمجية:</span>
                    <p className="text-xs font-bold text-slate-300 mt-1 truncate">
                      {selectedLib.dependencies.length > 0 ? selectedLib.dependencies.join('، ') : 'لا يوجد تبعيات خارجية'}
                    </p>
                  </div>
                </div>

                {/* Full Description */}
                <div className="bg-slate-900/10 p-4 rounded-xl border border-slate-800/50 space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-300 flex items-center gap-1">
                    <BookOpen size={13} className="text-emerald-400" />
                    تفاصيل ومميزات المكتبة:
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedLib.description}
                  </p>
                </div>

                {/* Example Code Block */}
                <div className="space-y-2 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                      <Code size={13} className="text-blue-400" />
                      كود تجريبي مقترح للتشغيل (Al-Bayan Code Example):
                    </h4>
                    <button
                      onClick={() => handleCopyCode(selectedLib.exampleCode)}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/40 border border-slate-800 px-2 py-1 rounded-md transition-all active:scale-95"
                    >
                      {copiedCode ? (
                        <>
                          <Check size={11} className="text-emerald-400" />
                          <span className="text-emerald-400 font-bold">تم نسخ الكود</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>نسخ الكود</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Readonly code block container */}
                  <div className="relative bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden font-mono text-[11px] text-slate-300 p-4 h-64 overflow-y-auto custom-scrollbar" dir="ltr">
                    <pre className="whitespace-pre-wrap select-all">{selectedLib.exampleCode}</pre>
                  </div>

                  {/* Bottom hint to try */}
                  {installedLibs.includes(selectedLib.id) ? (
                    <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg text-emerald-300 text-[10.5px] flex items-center justify-between gap-2">
                      <span className="font-bold">المكتبة جاهزة الآن! اضغط على زر التجربة لتحميل كود التشغيل في المحرر وتشغيل الكود لمشاهدة المخرجات حية.</span>
                      <button
                        onClick={() => handleLoadDemo(selectedLib)}
                        className="bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-md text-[10px] hover:bg-emerald-400 transition-colors shrink-0"
                      >
                        تشغيل الآن ⚡
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-900/30 border border-slate-800/50 p-3 rounded-lg text-slate-400 text-[10px] flex items-center gap-1.5 leading-relaxed">
                      <span>يرجى تثبيت هذه المكتبة أولاً لكي تتمكن من تحميل وتشغيل مثالها البرمجي بالمحرر والوصول لتعليمات الاستيراد.</span>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 text-center gap-3">
                <Grid size={48} className="text-slate-800 animate-spin" style={{ animationDuration: '12s' }} />
                <h3 className="font-bold text-sm text-slate-400">مرحباً بك في مستودع مكتبات استوديو البيان</h3>
                <p className="text-xs max-w-sm leading-relaxed">
                  اختر أي مكتبة من القائمة الجانبية لاستعراض خصائصها، الناشر، التبعيات البرمجية، وتحميل كود التشغيل التجريبي مباشرة.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2 shrink-0">
          <span>مستودع مكتبات لغة البيان المركزي v1.0.4</span>
          <span className="text-emerald-400 font-bold">مجتمع برمجيات لغة البيان الرقمية 🌍</span>
        </div>
      </div>
    </div>
  );
};
