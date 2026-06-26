import React, { useState, useEffect } from 'react';
import { 
  X, MessageSquare, ThumbsUp, Search, PlusCircle, Filter, 
  Sparkles, Code, User, Send, CheckCircle, Lock, 
  AlertCircle, ArrowRight, CornerDownLeft, MessageCircle
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  createdAt: string;
  codeSnippet?: string;
  isAI?: boolean;
  agentColor?: string;
}

interface Post {
  id: string;
  title: string;
  category: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  codeSnippet?: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
  comments: Comment[];
  hasLiked?: boolean;
}

interface BayanCommunityProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { name: string; email: string; tier: string } | null;
  onOpenAuth?: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'general', label: 'نقاش عام 💬' },
  { id: 'code', label: 'كود البيان 💻' },
  { id: 'projects', label: 'مشاريع وأفكار 💡' },
  { id: 'android', label: 'تطبيقات الأندرويد 🤖' },
  { id: 'help', label: 'أسئلة وحلول ❓' }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: '🌿 كود لوحة التحكم البيئي الذكي للمنازل باستخدام محرك البيان الكمي',
    category: 'projects',
    author: 'م. كريم عبد العزيز',
    avatar: 'ك',
    role: 'عضو سيادي 🏅',
    content: 'السلام عليكم زملائي المطورين، قمت ببناء كود متكامل لمنظومة تحكم ذكية بالمسكن تعتمد على محاكاة الكيوبيتس لسرعة اتخاذ القرار O(1) وربطها ببرمجة أندرويد الأصلية. الكود يشتغل بكفاءة مذهلة وحجم الـ APK النهائي لا يتعدى 310 كيلوبايت بفضل تكنولوجيا Cellular memory healing لمنع التسريبات تماماً.',
    codeSnippet: `مهمة رئيسية():
    اطبع("🌿 بدء تشغيل المنزل البيئي الذكي...")
    أندرويد.صناعة_تطبيق("com.bayan.eco", "البيت الأخضر")
    أندرويد.لوح_الألوان("زمردي_فاخر")
    
    عرف ك = كمومية.كيوبيت()
    كمومية.هادامارد(ك)
    عرف قرار_التكييف = كمومية.قياس(ك)
    
    لو (قرار_التكييف == ١):
        أندرويد.نص("حالة_التبريد"، "❄️ التبريد الطبيعي نشط عبر طاقة الرياح والبطاريات الكمومية")
    وإلا:
        أندرويد.نص("حالة_التبريد"، "☀️ التبريد متوقف - تهوية الغرف طبيعياً")
    نهاية
    
    أندرويد.تنظيف_ذاكرة_تلقائي()
    أندرويد.بناء_APK()
نهاية`,
    likes: 34,
    commentsCount: 3,
    createdAt: 'منذ ساعتين',
    comments: [
      {
        id: 'c-1',
        author: 'منذر الفالح',
        avatar: 'م',
        role: 'عضو سيادي 🏅',
        content: 'عمل رائع جداً! هل جربت تفعيل أندرويد.محرك_كمومي("توفير_بليغ") لتوفير المزيد من استهلاك المعالج على الهواتف الضعيفة؟',
        createdAt: 'منذ ساعة'
      },
      {
        id: 'c-2',
        author: 'أميرة الشريف',
        avatar: 'أ',
        role: 'عضو سيادي 🏅',
        content: 'كود نظيف وسهل الفهم، لغة البيان أثبتت جدارة فائقة في اختصار أسطر واجهات أندرويد المعقدة.',
        createdAt: 'منذ ٤٥ دقيقة'
      },
      {
        id: 'c-3',
        author: 'م. كريم عبد العزيز',
        avatar: 'ك',
        role: 'عضو سيادي 🏅',
        content: 'أهلاً منذر، نعم قمت بتفعيله في النسخة الأحدث، وحجم توفير الطاقة زاد بنسبة تزيد عن ١٤٪! سأقوم بنشر التحديث قريباً.',
        createdAt: 'منذ ١٠ دقائق'
      }
    ]
  },
  {
    id: 'post-2',
    title: '❓ مشكلة في تمرير مصفوفة المدخلات في الدالة عصبية.توقع()',
    category: 'help',
    author: 'ليلى الهاشمي',
    avatar: 'ل',
    role: 'عضو سيادي 🏅',
    content: 'أحاول تدريب نموذج رصد بيئي تطوري وتوقع المخرجات باستخدام الدالة المذكورة، لكن يظهر لي خطأ في المحلل اللغوي عند تشغيل الملف. هل مصفوفة المدخلات يجب أن تفصل بفواصل عشرية إنجليزية أم عربية؟',
    codeSnippet: `عرف نموذج_الذكاء = عصبية.إنشاء_نموذج("4,8,2")
عصبية.تدريب_تطوري(نموذج_الذكاء، ٥٠)

// هنا يحدث الخطأ أثناء التحليل:
عرف النتيجة = عصبية.توقع(نموذج_الذكاء، "0.85, 0.12, 0.92, 0.44")`,
    likes: 12,
    commentsCount: 2,
    createdAt: 'منذ ٤ ساعات',
    comments: [
      {
        id: 'c-4',
        author: 'ياسين الكواكبي',
        avatar: 'ي',
        role: 'مطور خبير 🌟',
        content: 'أهلاً ليلى، المشكلة هي استخدام الفاصلة الإنجليزية "," بدلاً من الفاصلة العربية "،" في مصفوفة المدخلات النصية. لغة البيان تدعم الرموز العربية بالكامل. جربي كتابتها هكذا: "٠.٨٥، ٠.١٢، ٠.٩٢، ٠.٤٤" وستعمل فوراً!',
        createdAt: 'منذ ٣ ساعات'
      },
      {
        id: 'c-5',
        author: 'ليلى الهاشمي',
        avatar: 'ل',
        role: 'عضو سيادي 🏅',
        content: 'شكراً جزيلاً ياسين! قمت بتعديلها وعملت المنظومة بالكامل بنجاح تام وبدقة توقع فائقة. منبهرة جداً بقدرة اللغة على استيعاب الفواصل والرموز العربية الأصيلة.',
        createdAt: 'منذ ساعتين'
      }
    ]
  },
  {
    id: 'post-3',
    title: '🧠 مقارنة حية: المعالجة الكمومية الافتراضية مقابل الخوارزميات التقليدية في محرك البيان',
    category: 'general',
    author: 'د. طارق الحسين',
    avatar: 'ط',
    role: 'عضو أكاديمي 🎓',
    content: 'في الأبحاث والعمليات الكبيرة، نلاحظ تحسناً جذرياً عند استخدام التشابك الكمي للكيوبيتس لمحاكاة الحالات بدلاً من مصفوفات البحث الثنائية المعقدة. قمت بعمل اختبار أداء ومقارنة حية وحصلت على سرعة معالجة O(1) تقريباً للحالات المتشابكة مع صفر تسريب في الذاكرة بفضل Cellular layout memory healing.',
    likes: 45,
    commentsCount: 1,
    createdAt: 'منذ يوم واحد',
    comments: [
      {
        id: 'c-6',
        author: 'سليم الساهر',
        avatar: 'س',
        role: 'عضو سيادي 🏅',
        content: 'مقال عميق ورصين يا دكتور! فكرة دمج الحوسبة الكمومية مع اللغة العربية الفصحى يعطي للمطورين العرب ميزة تنافسية لا تضاهى.',
        createdAt: 'منذ ٢٠ ساعة'
      }
    ]
  },
  {
    id: 'post-4',
    title: '🤖 كيف برمجت تطبيق أندرويد حقيقي بحجم ٢٨٠ كيلوبايت فقط بلغة البيان؟',
    category: 'android',
    author: 'سعد الحربي',
    avatar: 'س',
    role: 'عضو سيادي 🏅',
    content: 'مرحباً، قمت بإنشاء أداة متابعة المهام والتنبيه الذكي للمذاكرة وتصديرها كـ APK. في هذا المنشور أستعرض الهيكل وكيف وفرت مئات الكيلوبايتات مقارنة بجافا وكوتلن التقليدية التي تسحب ملفات مكتبية ضخمة لا حاجة لها.',
    codeSnippet: `مهمة رئيسية():
    أندرويد.صناعة_تطبيق("com.bayan.todo", "منجز البيان")
    أندرويد.لوح_الألوان("زمردي_فاخر")
    أندرويد.إضافة_واجهة("الرئيسية")
    
    أندرويد.نص("شعار"، "🎯 منجز البيان - نظم يومك بذكاء")
    أندرويد.حقل_إدخال("مهمة_جديدة"، "ما الذي تريد إنجازه اليوم؟")
    أندرويد.زر("حفظ"، "إضافة للمهكرة")
    
    أندرويد.تنظيف_ذاكرة_تلقائي()
    أندرويد.بناء_APK()
نهاية`,
    likes: 51,
    commentsCount: 1,
    createdAt: 'منذ يومين',
    comments: [
      {
        id: 'c-7',
        author: 'خالد اليماني',
        avatar: 'خ',
        role: 'عضو سيادي 🏅',
        content: 'فعلاً! الكود يبدو مختصراً بشكل لا يصدق مقارنة بملفات XML و Jetpack Compose العادية. الحجم الصغير مثالي لتنزيل سريع جداً.',
        createdAt: 'منذ يوم واحد'
      }
    ]
  }
];

export const BayanCommunity: React.FC<BayanCommunityProps> = ({ 
  isOpen, 
  onClose, 
  currentUser,
  onOpenAuth 
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePost, setActivePost] = useState<Post | null>(null);
  
  // New Post Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCode, setNewPostCode] = useState('');
  
  // New Comment state
  const [newCommentText, setNewCommentText] = useState('');

  // AI Agents State
  const [isAgentTyping, setIsAgentTyping] = useState<string | null>(null);

  // AI Agents Configuration
  const AI_AGENTS = [
    {
      id: 'bayan-agent',
      name: 'الوكيل بيان',
      avatar: 'ب',
      role: 'خبير لغة البيان ومكتباتها ⚙️',
      specialty: 'الرد على الاستفسارات الفنية وصياغة أكواد لغة البيان وتوضيح البنية التحتية الكمية والشبكات العصبية.',
      status: 'جاهز ونشط 🟢',
      color: 'text-sky-400 border-sky-500/20 bg-sky-500/10',
      badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      textColor: 'text-sky-400'
    },
    {
      id: 'adib-agent',
      name: 'الوكيل أديب',
      avatar: 'أ',
      role: 'مستشار الإدارة والدعم الفني 🛡️',
      specialty: 'الإجابة على التساؤلات الموجهة للإدارة، توضيح شروط التراخيص، أنماط الاشتراكات، وقواعد النشر.',
      status: 'جاهز ونشط 🟢',
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      textColor: 'text-purple-400'
    },
    {
      id: 'raed-agent',
      name: 'الوكيل رائد',
      avatar: 'ر',
      role: 'مصحح المفاهيم ومصلح الأكواد 🎯',
      specialty: 'تحديد وتصحيح المفاهيم الخاطئة الواردة في المجتمع (مثل تسريبات الذاكرة، أحجام ملفات APK، والفاصلة العربية).',
      status: 'جاهز ونشط 🟢',
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      textColor: 'text-amber-400'
    }
  ];

  // Helper to generate context-based responses for each AI agent
  const generateAgentResponse = (postTitle: string, postContent: string, agentId: string): { content: string; codeSnippet?: string } => {
    const titleAndContent = (postTitle + ' ' + postContent).toLowerCase();

    if (agentId === 'bayan-agent') {
      let content = `أهلاً بك زميلي المطور في مجتمع لغة البيان الفسيح! 🌿 بصفتي الوكيل الفني المتخصص في النظم والآليات المعيارية، يسعدني تقديم المساعدة الفنية لك وتحليل منشورك بعمق.`;
      let codeSnippet = `مهمة رئيسية():
    اطبع("🌍 تفعيل المساعد الذكي...")
    أندرويد.تنظيف_ذاكرة_تلقائي()
    
    // نموذج ذكي مبسط للتوضيح الفني
    عرف ك = كمومية.كيوبيت()
    كمومية.هادامارد(ك)
    عرف النتيجة = كمومية.قياس(ك)
    
    اطبع("حالة التقييم الفني: " + النتيجة)
    أندرويد.تنظيف_ذاكرة_تلقائي()
نهاية`;

      if (titleAndContent.includes('عصبية') || titleAndContent.includes('نموذج') || titleAndContent.includes('ذكاء')) {
        content += `\n\nلقد لاحظت أنك تبحث في تفاصيل المنظومات العصبية والذكاء الاصطناعي المدمج بلغة البيان. إن مكتبة "عصبية" تتيح لك تخليق وتدريب شبكات ذكاء اصطناعي موطنة تعمل بالكامل على الهاتف أو الويب دون الحاجة لاتصال خارجي، وتتميز بخوارزميات التطور الجيني لتقليل الأخطاء باستدعاء "عصبية.تدريب_تطوري()". \nيرجى التأكد دائماً من مطابقة أبعاد المدخلات والمخرجات وتمريرها كسلسلة نصية تفصلها الفاصلة العربية "،".`;
        codeSnippet = `مهمة رئيسية():
    اطبع("🧠 تهيئة شبكة عصبية تطورية...")
    
    // إنشاء نموذج بـ ٤ مدخلات، طبقة مخفية بـ ٨ خلايا، ومخرجين
    عرف نموذج_مطور = عصبية.إنشاء_نموذج("4,8,2")
    
    // تدريب النموذج لـ ٥٠ دورة تطورية متكاملة
    عصبية.تدريب_تطوري(نموذج_مطور، ٥٠)
    
    // إجراء توقع ذكي باستخدام الفاصلة العربية
    عرف النتيجة = عصبية.توقع(نموذج_مطور، "٠.٨٥، ٠.١٢، ٠.٩٢، ٠.٤٤")
    اطبع("🎯 نتيجة الرصد والتشخيص: " + النتيجة)
    
    أندرويد.تنظيف_ذاكرة_تلقائي()
نهاية`;
      } else if (titleAndContent.includes('كمومية') || titleAndContent.includes('كيوبيت') || titleAndContent.includes('تشابك') || titleAndContent.includes('حوسبة')) {
        content += `\n\nلقد رصدت اهتمامك بالحوسبة الكمومية ومحاكاة الكيوبيتس المتشابكة بلغة البيان. الحوسبة الكمومية بلغة البيان لا تعتمد على السيرفرات السحابية التقليدية بل تتم عبر محاكاة كهرومغناطيسية مدمجة في الأجهزة الموطنة، مما يمنحك سرعة O(1) في اتخاذ القرارات المتعددة الحالات.\n\nتأكد دائماً من تطبيق بوابة هادامارد "كمومية.هادامارد()" لوضع الكيوبيت في تراكب تماثلي بنسبة 50/50 قبل إجراء عملية القياس "كمومية.قياس()".`;
        codeSnippet = `مهمة رئيسية():
    اطبع("⚛️ تشغيل مصفوفة الكيوبيتس...")
    
    عرف ك_رئيسي = كمومية.كيوبيت()
    عرف ك_فرعي = كمومية.كيوبيت()
    
    // وضع الرئيسي في حالة التراكب (Superposition)
    كمومية.هادامارد(ك_رئيسي)
    
    // إحداث التشابك الكمي (Entanglement)
    كمومية.تشابك(ك_رئيسي، ك_فرعي)
    
    عرف قياس_الرئيسي = كمومية.قياس(ك_رئيسي)
    عرف قياس_الفرعي = كمومية.قياس(ك_فرعي)
    
    اطبع("قياس الكيوبيت الرئيسي: " + قياس_الرئيسي)
    اطبع("قياس الكيوبيت الفرعي المتشابك: " + قياس_الفرعي)
    
    أندرويد.تنظيف_ذاكرة_تلقائي()
نهاية`;
      } else if (titleAndContent.includes('أندرويد') || titleAndContent.includes('واجهة') || titleAndContent.includes('تطبيق') || titleAndContent.includes('زر')) {
        content += `\n\nبخصوص واجهات وتطبيقات أندرويد المعيارية، تمتاز لغة البيان بنموذج واجهات فائق البساطة يغنيك عن تعقيدات ملفات XML الطويلة وسياق جافا/كوتلن المتداخل. عندما تقوم ببناء الواجهة عبر "أندرويد.صناعة_تطبيق()" و "أندرويد.إضافة_واجهة()"، يتم توليد عناصر الواجهة وتحسين توزيع الذاكرة لتجنب أي تعليق أو بطء على عتاد الهواتف المختلفة.`;
        codeSnippet = `مهمة رئيسية():
    أندرويد.صناعة_تطبيق("com.bayan.customui", "الواجهة المعيارية")
    أندرويد.لوح_الألوان("زمردي_فاخر")
    أندرويد.إضافة_واجهة("الرئيسية")
    
    أندرويد.عنوان_رئيسي("👑 لوحة التحكم والمراقبة")
    أندرويد.نص("تلميح"، "مرحباً بك في واجهة المستخدم المدعومة بخصائص الاستقرار والسرعة")
    أندرويد.زر("زر_تفاعل"، "✨ تشغيل وتأكيد النواة")
    
    أندرويد.تنظيف_ذاكرة_تلقائي()
    أندرويد.بناء_APK()
نهاية`;
      } else if (titleAndContent.includes('خطأ') || titleAndContent.includes('مشكلة') || titleAndContent.includes('مساعدة') || titleAndContent.includes('حل')) {
        content += `\n\nلقد حللت المشكلة المذكورة في منشورك بعناية فائقة. في لغة البيان، لتفادي توقف البرامج أو الأخطاء غير المتوقعة الناتجة عن تعطل العتاد أو فقدان الذاكرة، نوصي بشدة بتغليف الكود دائماً في كتل استثناءات آمنة باستخدام (حاول... التقط... نهاية) لضمان استمرار واجهة المستخدم والوصول المستدام للملفات بنسبة 100%.`;
        codeSnippet = `مهمة رئيسية():
    // هيكل معالجة الأخطاء والصلابة الهيكلية في لغة البيان
    حاول:
        اطبع("💾 جاري محاولة الوصول لقاعدة البيانات المحلية...")
        قاعدة_بيانات.تهيئة("المستودع_الآمن")
        قاعدة_بيانات.تحديث_أو_إضافة("السجلات"، "حالة_الاستقرار"، "١")
        أندرويد.رسالة_منبثقة("✅ تم الاتصال بالمستودع بنجاح!")
    التقط (خطأ_الاتصال):
        اطبع("⚠️ حدث خطأ في النظام لكن تم احتواؤه تلقائياً: " + خطأ_الاتصال)
        أندرويد.رسالة_منبثقة("تعذر فتح قاعدة البيانات، يرجى المحاولة لاحقاً.")
    نهاية
    
    أندرويد.تنظيف_ذاكرة_تلقائي()
نهاية`;
      }

      return { content, codeSnippet };
    } 
    
    if (agentId === 'adib-agent') {
      let content = `مرحباً بك يا زميلي العزيز في الدعم الرسمي للغة البيان الفسيحة. أنا الوكيل أديب، ومسؤوليتي هنا هي توفير الدعم الإداري والرد على التساؤلات المرتبطة بالمنصة والترخيص وخدمات المجتمع وإرشاد الأعضاء.`;
      
      if (titleAndContent.includes('عضوية') || titleAndContent.includes('سيادية') || titleAndContent.includes('حساب') || titleAndContent.includes('اشتراك') || titleAndContent.includes('مطور')) {
        content += `\n\nبخصوص التساؤل حول **العضوية السيادية (Sovereign Tier) ⭐**:\n\n١. **العضوية السيادية** هي أعلى درجات الصلاحيات والسيادة في المنصة، وهي مجانية تماماً ومفتوحة للمطورين الحقيقيين المهتمين بتطوير مجتمع البرمجيات العربية المستقلة.\n\n٢. تمنحك العضوية السيادية القدرة الفورية على طرح المنشورات، ومشاركة وتجربة كود لغة البيان مباشرة، والولوج لجميع أقسام المجتمع التفاعلية وصناعة تطبيقات حقيقية خالية من القيود.\n\n٣. للتسجيل والترقية الفورية، يمكنك ببساطة الضغط على زر "ترقية العضوية للسيادية ⭐" المتاح في الزاوية العلوية أو القائمة الجانبية وتعبئة بياناتك لتفعيل هويتك السيادية فوراً ومجاناً وبشكل مستقل ومستدام 🏅.`;
      } else if (titleAndContent.includes('ترخيص') || titleAndContent.includes('رخصة') || titleAndContent.includes('مجاني') || titleAndContent.includes('مفتوح') || titleAndContent.includes('قانوني')) {
        content += `\n\nنود أن نؤكد رسمياً من الإدارة أن لغة البيان وتطبيقاتها والمترجم (الكومبايلر) الخاص بها هي مشاريع **مفتوحة المصدر بالكامل، مستقلة، ومجانية تماماً**!\n\nنهجنا هو إثراء المكتبة العربية التقنية وتمكين العقل البرمجي العربي من تخليق برمجيات سيادية لا تعتمد على خوادم أو رخص أجنبية مقيدة. جميع الأكواد التي يتم توليدها أو كتابتها هنا تؤول ملكيتها بالكامل للمطورين مع حرية نشرها وتداولها تجارياً دون أي رسوم أو عمولات الإدارة أو قيود خارجية.`;
      } else if (titleAndContent.includes('أندرويد') || titleAndContent.includes('تطبيق') || titleAndContent.includes('تصدير') || titleAndContent.includes('apk') || titleAndContent.includes('نشر')) {
        content += `\n\nبشأن الاستفسار الإداري حول تصدير وبناء تطبيقات الأندرويد:\n\nعند استدعاء "أندرويد.بناء_APK()" في نهاية الكود، يقوم خادم التجميع المدمج ببناء الحزمة الأصلية أوتوماتيكياً. تلتزم المنصة بتوفير حزم APK معيارية وخفيفة الوزن جداً (أقل من ٣٨٥ كيلوبايت) متوافقة بنسبة ١٠٠٪ مع معايير متجر Google Play ومتطلبات الحماية العالمية.\n\nالملفات المولدة آمنة ومستقلة، وتحتوي على ميتا البيانات (Metadata) الموطنة التي تشهد لمطورها بالحقوق البرمجية الكاملة.`;
      } else {
        content += `\n\nلقد رصدت الإدارة منشورك الكريم وجاري مراجعته لضمان مطابقتك لـ "ميثاق وقواعد لغة البيان البرمجية للتوليد القياسي المتكامل ومتوافق عالمياً".\n\nالمنصة مجانية ومفتوحة بالكامل، وهدفنا هو تذليل أي معوقات تواجه المطورين السياديين في ترحيل مشاريعهم إلى لغة البيان. إذا كان لديك أي اقتراح لتحسين المترجم أو تزويد المجتمع بمكتبات إضافية، فلا تتردد في توجيه التساؤل المباشر للإدارة وسنعمل على تنفيذه فوراً لدعم استدامة واستقلالية المنظومة.`;
      }

      return { content };
    }

    // Raed Agent
    let content = `أهلاً بك يا صديقي المطور! أنا الوكيل رائد، مصلح الأكواد ومصحح المفاهيم البرمجية والتعليمية. واجبي الأساسي هو تتبع النقاشات ورصد أي لبس أو مفهوم خاطئ وتصحيحه بأسلوب علمي واضح لتبسيط المفاهيم وضمان كفاءة التوليد البرمجي الفعال لعام ٢٠٢٦.`;

    if (titleAndContent.includes('تسريب') || titleAndContent.includes('ذاكرة') || titleAndContent.includes('تنظيف') || titleAndContent.includes('memory') || titleAndContent.includes('leak')) {
      content += `\n\n🔍 **تصحيح مفهوم خاطئ حول إدارة الذاكرة وتخزين المتغيرات بلغة البيان:**\n\n* **المفهوم الخاطئ شائع**: يعتقد البعض أن لغة البيان قد تعاني من تسريبات الذاكرة (Memory Leaks) أو ثقل في الأداء كاللغات الهجينة التي تتطلب مجمعات قمامة (Garbage Collectors) تقليدية وثقيلة.\n\n* **الحقيقة العلمية الدقيقة**: لغة البيان تأتي بـ **منظومة الذاكرة الخلوية النشطة ذات الـ 0% تسريب (Cellular memory healing)**. حيث يتم محو المؤشرات الفائضة أوتوماتيكياً وإعادة ترتيب العناوين الخلوية في الذاكرة دون أي تأخير زمني.\n\n* **التطبيق الصحيح**: تأكد دائماً من استدعاء دالة التنظيف التلقائي \`أندرويد.تنظيف_ذاكرة_تلقائي()\` في نقاط التحول الحرجة وعند نهاية وبداية المهام المعقدة لتنشيط بروتوكول الشفاء التلقائي فوراً في جهاز العميل.`;
    } else if (titleAndContent.includes('حجم') || titleAndContent.includes('ثقيل') || titleAndContent.includes('apk') || titleAndContent.includes('كيلوبايت') || titleAndContent.includes('mb') || titleAndContent.includes('مساحة')) {
      content += `\n\n🔍 **تصحيح مفهوم خاطئ حول حجم الحزم وتطبيقات الأندرويد المولدة:**\n\n* **المفهوم الخاطئ شائع**: يعتقد الكثيرون أن إنشاء تطبيق أندرويد حقيقي واحترافي لابد أن يستهلك عشرات الميجابايتات (مثل تطبيقات Flutter أو React Native أو حتى تطبيقات Jetpack Compose الأصلية التي تدمج مئات المكتبات الضخمة غير المستخدمة).\n\n* **الحقيقة العلمية الدقيقة**: لغة البيان تنتج تطبيقات أندرويد موطنة فائقة الخفة وبأحجام قياسية **أقل من ٣٨٥ كيلوبايت فقط**!\n\n* **السبب التقني**: المترجم المطور للغة البيان (Compiler) يقوم بعملية "تقليم الأكواد" واستخلاص الروابط الرمزية فقط، ومطابقتها مباشرة بنواة العتاد الموطنة للجوال دون حشو ملفات برمجية وسيطة أو بيئات تشغيل افتراضية مكررة. هذا يمنحك تطبيقاً خفيفاً وسريع التشغيل للغاية في أجزاء من الثانية!`;
    } else if (titleAndContent.includes('فاصلة') || titleAndContent.includes('خطأ') || titleAndContent.includes('مصفوفة') || titleAndContent.includes('قوس') || titleAndContent.includes(',')) {
      content += `\n\n🔍 **تصحيح مفهوم خاطئ حول صياغة الفواصل والأقواس والمعايير النحوية في الكود:**\n\n* **المفهوم الخاطئ شائع**: استخدام الفاصلة الإنجليزية \`,\` لفصل المدخلات النصية أو أبعاد المصفوفات داخل الدوال المعقدة (مثل الدوال العصبية أو الكمية).\n\n* **الحقيقة العلمية الدقيقة**: لغة البيان مصممة بالكامل لدعم اللغة العربية الأصيلة ورموزها النحوية بشكل تام، وبالتالي فإن المحلل اللغوي (Lexer) يتوقع دائماً الفاصلة العربية الأصيلة \`،\` كعامل فصل معتمد للمدخلات المتعددة.\n\n* **مثال التعديل**: \n  * ❌ خاطئ: \`عصبية.توقع(نموذج، "0.85, 0.12, 0.92, 0.44")\`\n  *  صحيح: \`عصبية.توقع(نموذج، "٠.٨٥، ٠.١٢، ٠.٩٢، ٠.٤٤")\``;
    } else if (titleAndContent.includes('كمومية') || titleAndContent.includes('كيوبيت') || titleAndContent.includes('سرعة') || titleAndContent.includes('O(1)')) {
      content += `\n\n🔍 **تصحيح مفهوم خاطئ حول محاكاة الحوسبة الكمومية وسرعة O(1):**\n\n* **المفهوم الخاطئ شائع**: يظن البعض أن المعالجة الكمية بلغة البيان تتطلب أجهزة تبريد كمومي فائقة التوصيل أو تتطلب إرسال البيانات لسيرفر بعيد يسبب تأخيراً في الاستجابة (Latency).\n\n* **الحقيقة العلمية الدقيقة**: الحساب الكمي هنا يتم من خلال "محاكي الدوائر الكمومية الافتراضية" عالي الاستقرار المكتوب بلغة بلورية مستقلة ومسخرة مباشرة لعتاد الهاتف المحلي. نضمن تعقيداً زمنياً O(1) لاتخاذ القرار المتشابك عبر استدعاء الكيوبيتات ومطابقة التداخل الموجي في اللحظة الصفرية، مما يوفر استهلاك البطارية والإنترنت لنسبة تقارب 100%.`;
    } else {
      content += `\n\n🔍 **نصيحة تعليمية وتصحيحية لضمان كفاءة الكود المولد:**\n\nمن خلال فحص منشورك الكريم، أود تذكيرك بالثوابت الأساسية للغة البيان المتطابقة مع المعايير البرمجية العالمية:\n\n١. احرص دائماً على تعريف المتغيرات بـ \`عرف\` والالتزام ببدء الملف بدالة البوابة المعيارية \`مهمة رئيسية():\` وتنتهى بـ \`نهاية\` لضمان التفسير الصحيح من الكومبايلر.\n\n٢. لا تخلط أبداً بين الكلمات المفتاحية العربية والإنجليزية داخل الكود لضمان سلاسة التدفق.\n\n٣. تغليف التفاعلات الحركية بالاهتزاز اللمسي الخفيف والنبض المرتد يعزز من اندماج المستخدم مع تطبيقك وهي ممارسة تصميمية معتمدة عالمياً.`;
    }

    return { content };
  };

  // Trigger agent reply manually or automatically
  const handleTriggerAgentReply = (agentId: string, customPost: Post | null = null) => {
    const targetPost = customPost || activePost;
    if (!targetPost) return;

    const agent = AI_AGENTS.find(a => a.id === agentId);
    if (!agent) return;

    playInteractionTone(800, 0.2, 'sine');
    setIsAgentTyping(agentId);

    // Simulate thinking/typing for 2 seconds
    setTimeout(() => {
      const response = generateAgentResponse(targetPost.title, targetPost.content, agentId);
      
      const newComment: Comment = {
        id: `agent-comment-${Date.now()}`,
        author: agent.name,
        avatar: agent.avatar,
        role: agent.role,
        content: response.content,
        codeSnippet: response.codeSnippet,
        createdAt: 'الآن',
        isAI: true,
        agentColor: agentId === 'bayan-agent' ? 'sky' : agentId === 'adib-agent' ? 'purple' : 'amber'
      };

      // Load latest posts state
      const savedPosts = localStorage.getItem('bayan_community_posts');
      let currentPosts = posts;
      if (savedPosts) {
        try {
          currentPosts = JSON.parse(savedPosts);
        } catch (e) {}
      } else {
        currentPosts = INITIAL_POSTS;
      }

      const updatedPosts = currentPosts.map(post => {
        if (post.id === targetPost.id) {
          const updatedComments = [...post.comments, newComment];
          return {
            ...post,
            comments: updatedComments,
            commentsCount: updatedComments.length
          };
        }
        return post;
      });

      savePosts(updatedPosts);
      setIsAgentTyping(null);
      playInteractionTone(950, 0.15, 'triangle');

      // Update currently viewed post if we are looking at it
      if (activePost && activePost.id === targetPost.id) {
        const target = updatedPosts.find(p => p.id === targetPost.id);
        if (target) {
          setActivePost(target);
        }
      }
    }, 2000);
  };

  // Audio tone feedback for interactive feel
  const playInteractionTone = (frequency = 500, duration = 0.08, type: OscillatorType = 'sine') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio block bypass
    }
  };

  // Load and sync posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('bayan_community_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        setPosts(INITIAL_POSTS);
      }
    } else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('bayan_community_posts', JSON.stringify(INITIAL_POSTS));
    }
  }, [isOpen]);

  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('bayan_community_posts', JSON.stringify(updatedPosts));
  };

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playInteractionTone(600, 0.1, 'triangle');
    
    const updated = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.hasLiked;
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !hasLiked
        };
      }
      return post;
    });

    savePosts(updated);
    
    // If active post is being liked, update its state too
    if (activePost && activePost.id === postId) {
      const target = updated.find(p => p.id === postId);
      if (target) setActivePost(target);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (currentUser.tier !== 'sovereign') {
      playInteractionTone(250, 0.25, 'sawtooth');
      alert('كتابة المنشورات الجديدة وتداول الأكواد محصور بأعضاء "العضوية السيادية" الفعالة 🏅.');
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('الرجاء تعبئة العنوان والمحتوى الأساسي للمنشور.');
      return;
    }

    playInteractionTone(700, 0.15, 'sine');

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: newPostTitle,
      category: newPostCategory,
      author: currentUser.name,
      avatar: currentUser.name[0]?.toUpperCase() || 'م',
      role: 'عضو سيادي 🏅',
      content: newPostContent,
      codeSnippet: newPostCode.trim() ? newPostCode : undefined,
      likes: 1,
      commentsCount: 0,
      createdAt: 'الآن',
      comments: [],
      hasLiked: true
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Reset Form
    setNewPostTitle('');
    setNewPostCategory('general');
    setNewPostContent('');
    setNewPostCode('');
    setShowCreateForm(false);

    // Auto-trigger a relevant AI Agent reply after a short delay
    const titleAndContent = (newPost.title + ' ' + newPost.content).toLowerCase();
    let autoAgentId = 'bayan-agent';
    if (titleAndContent.includes('إدارة') || titleAndContent.includes('ترخيص') || titleAndContent.includes('عضوية') || titleAndContent.includes('سعر') || titleAndContent.includes('اشتراك')) {
      autoAgentId = 'adib-agent';
    } else if (titleAndContent.includes('خطأ') || titleAndContent.includes('تسريب') || titleAndContent.includes('حجم') || titleAndContent.includes('مفهوم') || titleAndContent.includes('،') || titleAndContent.includes(',')) {
      autoAgentId = 'raed-agent';
    }

    setTimeout(() => {
      handleTriggerAgentReply(autoAgentId, newPost);
    }, 1500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (currentUser.tier !== 'sovereign') {
      playInteractionTone(250, 0.25, 'sawtooth');
      alert('التعليق والمشاركة في نقاشات الأكواد محصور بأصحاب "العضوية السيادية" الفعالة 🏅.');
      return;
    }

    if (!newCommentText.trim() || !activePost) return;

    playInteractionTone(650, 0.1, 'sine');

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser.name,
      avatar: currentUser.name[0]?.toUpperCase() || 'م',
      role: 'عضو سيادي 🏅',
      content: newCommentText,
      createdAt: 'الآن'
    };

    const updatedPosts = posts.map(post => {
      if (post.id === activePost.id) {
        const updatedComments = [...post.comments, newComment];
        return {
          ...post,
          comments: updatedComments,
          commentsCount: updatedComments.length
        };
      }
      return post;
    });

    savePosts(updatedPosts);
    
    // Update currently viewed post
    const target = updatedPosts.find(p => p.id === activePost.id);
    if (target) {
      setActivePost(target);
    }
    setNewCommentText('');
  };

  if (!isOpen) return null;

  // Filter posts based on search query and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-md z-50 flex flex-col overflow-hidden text-slate-100" dir="rtl">
      
      {/* Premium Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg relative shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <MessageSquare size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white font-sans">
                مجتمع المشتركين الرقمي
              </h1>
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-2 py-0.5 text-[10px] font-bold">
                عضوية سيادية ⭐
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">تبادل الأكواد، طرح الأسئلة، ومناقشة مشاريع لغة البيان العربية</p>
          </div>
        </div>

        {/* Action Controls & Close */}
        <div className="flex items-center gap-3">
          {currentUser && currentUser.tier === 'sovereign' && (
            <button
              onClick={() => {
                playInteractionTone(600, 0.1, 'sine');
                setShowCreateForm(!showCreateForm);
                setActivePost(null);
              }}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-l from-purple-500 to-indigo-600 hover:opacity-90 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-purple-950/20"
            >
              <PlusCircle size={14} />
              <span>طرح منشور جديد ✍️</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
            title="إغلاق المجتمع"
            id="community-close-btn"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Right Sidebar: Filtering, Search, and User status */}
        <aside className="w-full md:w-80 bg-slate-900/40 border-l border-slate-850 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
          
          {/* User Tier Alert / Status block */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-2 text-slate-200">
              <Sparkles size={16} className="text-purple-400" />
              <h3 className="font-bold text-xs text-slate-200">الوصول للمنظومة التفاعلية</h3>
            </div>

            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/80 border border-slate-750">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-extrabold text-xs">
                    {currentUser.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-200">{currentUser.name}</h4>
                    <span className="text-[9px] text-purple-400 font-semibold block mt-0.5">
                      {currentUser.tier === 'sovereign' ? 'عضوية سيادية نشطة ⭐' : 'عضوية أساسية مجانية'}
                    </span>
                  </div>
                </div>

                {currentUser.tier !== 'sovereign' ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      الحساب الحالي في الوضع المجاني. للتعليق وطرح أكوادك البرمجية، يرجى الترقية للعضوية السيادية.
                    </p>
                    <button
                      onClick={onOpenAuth}
                      className="w-full py-2 rounded-xl bg-gradient-to-l from-purple-500 to-indigo-600 hover:opacity-90 text-white font-extrabold text-[10.5px] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/35"
                    >
                      <Sparkles size={12} className="animate-pulse" />
                      <span>ترقية العضوية للسيادية ⭐</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-xl flex items-start gap-1.5">
                    <CheckCircle size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-emerald-400/90 leading-relaxed">
                      لديك صلاحيات كاملة لقراءة وكتابة الأكواد والتفاعل مع بقية المشتركين السياديين في المنصة.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  سجل دخولك أو اشترك بالمنظومة للانضمام لزملائك المشتركين، مشاركة أكواد البيان وحلول الأندرويد الفعالة.
                </p>
                <button
                  onClick={onOpenAuth}
                  className="w-full py-2 rounded-xl bg-gradient-to-l from-purple-500 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Lock size={12} />
                  <span>انضم لمجتمع المشتركين 🌟</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في النقاشات أو الأكواد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 pl-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-right"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
          </div>

          {/* Categories list */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1">تصنيف النقاشات</span>
            {CATEGORIES.map(cat => {
              const count = cat.id === 'all' 
                ? posts.length 
                : posts.filter(p => p.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playInteractionTone(550, 0.05, 'sine');
                    setSelectedCategory(cat.id);
                    setActivePost(null);
                    setShowCreateForm(false);
                  }}
                  className={`w-full text-right py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 font-bold'
                      : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-850 text-slate-400'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </aside>

        {/* Central Display: Post Feed, Form, or Detailed Post View */}
        <main className="flex-1 bg-slate-950 flex flex-col overflow-hidden relative">
          
          {/* Create Post Form */}
          {showCreateForm ? (
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <ArrowRight 
                    size={18} 
                    className="text-slate-400 hover:text-white cursor-pointer transition-colors"
                    onClick={() => setShowCreateForm(false)} 
                  />
                  <h2 className="text-base font-black text-white">صياغة منشور ونقاش جديد</h2>
                </div>
                <span className="text-xs text-slate-500">مشاركة الكود والمعرفة</span>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4 max-w-3xl">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-bold block">عنوان المنشور</label>
                  <input
                    type="text"
                    placeholder="مثال: تجربتي في تهيئة أندرويد.محرك_كمومي واستقرار الذاكرة"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-right"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-bold block">التصنيف</label>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition-all"
                    >
                      <option value="general">نقاش عام 💬</option>
                      <option value="code">كود البيان 💻</option>
                      <option value="projects">مشاريع وأفكار 💡</option>
                      <option value="android">تطبيقات الأندرويد 🤖</option>
                      <option value="help">أسئلة وحلول ❓</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <span className="text-[10px] text-slate-500 leading-normal">
                      يرجى اختيار القسم الأنسب ليتسنى للمطورين الآخرين العثور على منشورك بسهولة تامة والتفاعل معه.
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-bold block">محتوى المنشور (الشرح والتفاصيل)</label>
                  <textarea
                    placeholder="اكتب هنا تفاصيل المشكلة أو المقال أو الشرح بوضوح..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={6}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-right leading-relaxed"
                    required
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                      <Code size={13} className="text-purple-400" />
                      <span>كود لغة البيان المقترح (اختياري)</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">byn syntax supported</span>
                  </div>
                  <textarea
                    placeholder={`مثال:\nمهمة رئيسية():\n    اطبع("أهلاً بالبيان")\nنهاية`}
                    value={newPostCode}
                    onChange={(e) => setNewPostCode(e.target.value)}
                    rows={6}
                    dir="ltr"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-emerald-400 font-mono placeholder-slate-700 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all text-left"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-l from-purple-500 to-indigo-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md shadow-purple-950/20"
                  >
                    نشر المنشور الآن 🚀
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all"
                  >
                    إلغاء الأمر
                  </button>
                </div>
              </form>
            </div>
          ) : activePost ? (
            /* Post Detailed View */
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Back to feed header */}
              <div className="bg-slate-900/40 border-b border-slate-850 px-6 py-3 shrink-0 flex items-center justify-between">
                <button
                  onClick={() => {
                    playInteractionTone(450, 0.08, 'sine');
                    setActivePost(null);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowRight size={14} className="ml-0.5" />
                  <span>العودة لقائمة المشاركات</span>
                </button>
                
                <span className="bg-slate-800 border border-slate-700/60 rounded-full px-2.5 py-0.5 text-[10px] text-slate-400 font-semibold">
                  قسم {CATEGORIES.find(c => c.id === activePost.category)?.label.split(' ')[0] || activePost.category}
                </span>
              </div>

              {/* Scrollable post content and comments thread */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                
                {/* Main Post Card */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 md:p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-sm">
                        {activePost.avatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{activePost.author}</h4>
                        <span className="text-[10px] text-purple-400 font-medium block mt-0.5">{activePost.role}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{activePost.createdAt}</span>
                  </div>

                  <h3 className="text-base font-black text-white leading-snug">{activePost.title}</h3>
                  
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{activePost.content}</p>

                  {activePost.codeSnippet && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-bold block">كود البيان الملحق:</span>
                      <pre dir="ltr" className="bg-slate-950 border border-slate-850 rounded-xl p-4 overflow-x-auto text-xs text-emerald-400 font-mono leading-relaxed text-left max-h-[300px]">
                        <code>{activePost.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* AI Agent Invocation Panel */}
                  <div className="bg-slate-950/40 rounded-xl border border-slate-800 p-3.5 space-y-2.5 relative overflow-hidden mt-4">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={13} className="text-purple-400 animate-pulse" />
                        <span className="text-[11px] font-black text-white">منصة استدعاء الوكلاء الأذكياء للمساعدة ⚡</span>
                      </div>
                      <span className="text-[9px] text-slate-500">مفتوح ومستدام ومجاني</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      هل تود الحصول على رد فوري موثوق؟ استدعِ أحد وكلاء الذكاء الاصطناعي السياديين لتحليل منشورك وطرح الإجابة الفنية أو التوجيه الإداري فوراً في التعليقات.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {AI_AGENTS.map(agent => {
                        const isTypingThis = isAgentTyping === agent.id;
                        const isAnyAgentTyping = isAgentTyping !== null;
                        
                        return (
                          <button
                            key={agent.id}
                            disabled={isAnyAgentTyping}
                            onClick={() => handleTriggerAgentReply(agent.id)}
                            className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border text-[10px] font-bold transition-all ${
                              isTypingThis
                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 animate-pulse'
                                : isAnyAgentTyping
                                  ? 'bg-slate-900 border-slate-850 text-slate-600 opacity-50 cursor-not-allowed'
                                  : 'bg-slate-900 border-slate-800 hover:border-purple-500/30 text-slate-300 hover:text-white hover:bg-slate-850 active:scale-95'
                            }`}
                          >
                            <span className="w-4 h-4 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[9px] text-purple-400 font-extrabold font-mono">
                              {agent.avatar}
                            </span>
                            <span>{isTypingThis ? 'جاري الصياغة...' : `استدعاء ${agent.name}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions (Like/Comment Counter) */}
                  <div className="flex items-center gap-4 pt-3 border-t border-slate-850">
                    <button
                      onClick={(e) => handleLike(activePost.id, e)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-all py-1 px-3 rounded-lg ${
                        activePost.hasLiked 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'text-slate-400 hover:text-white bg-slate-800/40 border border-transparent'
                      }`}
                    >
                      <ThumbsUp size={13} className={activePost.hasLiked ? 'fill-purple-400/20' : ''} />
                      <span>{activePost.likes} إعجاب</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MessageSquare size={13} />
                      <span>{activePost.commentsCount} تعليق</span>
                    </div>
                  </div>
                </div>

                {/* Comments Header */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-850">
                  <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-purple-400" />
                    <span>النقاشات والردود الواردة ({activePost.commentsCount})</span>
                  </h4>
                </div>

                {/* Comments Thread list */}
                <div className="space-y-4">
                  {activePost.comments.length === 0 && !isAgentTyping ? (
                    <div className="text-center py-6 bg-slate-900/20 rounded-2xl border border-dashed border-slate-850 text-slate-500 text-xs">
                      لا يوجد تعليقات حتى الآن. كن أول من يثري النقاش!
                    </div>
                  ) : (
                    <>
                      {activePost.comments.map(comment => {
                        const isBayan = comment.author === 'الوكيل بيان';
                        const isAdib = comment.author === 'الوكيل أديب';
                        const isRaed = comment.author === 'الوكيل رائد';
                        const isAnyAI = comment.isAI || isBayan || isAdib || isRaed;
                        
                        let cardBgClass = 'bg-slate-900/40 border border-slate-850';
                        let badgeBgClass = 'bg-purple-500/5 text-purple-400/80 border border-purple-500/10';
                        let avatarBgClass = 'bg-slate-800 border border-slate-700 text-slate-300';

                        if (isAnyAI) {
                          if (isBayan) {
                            cardBgClass = 'bg-sky-950/20 border border-sky-500/30 shadow-sm shadow-sky-950/10';
                            badgeBgClass = 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
                            avatarBgClass = 'bg-sky-500/10 border border-sky-500/30 text-sky-400';
                          } else if (isAdib) {
                            cardBgClass = 'bg-purple-950/20 border border-purple-500/30 shadow-sm shadow-purple-950/10';
                            badgeBgClass = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
                            avatarBgClass = 'bg-purple-500/10 border border-purple-500/30 text-purple-400';
                          } else if (isRaed) {
                            cardBgClass = 'bg-amber-950/20 border border-amber-500/30 shadow-sm shadow-amber-950/10';
                            badgeBgClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                            avatarBgClass = 'bg-amber-500/10 border border-amber-500/30 text-amber-400';
                          }
                        }

                        return (
                          <div key={comment.id} className={`flex gap-3 p-4 rounded-xl transition-all ${cardBgClass}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${avatarBgClass}`}>
                              {comment.avatar}
                            </div>
                            <div className="flex-1 space-y-1.5 text-right">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                                    <span>{comment.author}</span>
                                    {isAnyAI && <Sparkles size={10} className="text-purple-400 animate-pulse" />}
                                  </h5>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${badgeBgClass}`}>
                                    {comment.role}
                                  </span>
                                  {isAnyAI && (
                                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-1.5 py-0.2 font-medium">
                                      مستقل ومعتمد 🟢
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-slate-500">{comment.createdAt}</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                              
                              {comment.codeSnippet && (
                                <div className="mt-2 space-y-1">
                                  <span className="text-[9px] text-slate-500 font-bold block">كود لغة البيان التعليمي الملحق:</span>
                                  <pre dir="ltr" className="bg-slate-950 border border-slate-850/60 rounded-lg p-3 overflow-x-auto text-[11px] text-emerald-400 font-mono leading-relaxed text-left max-h-[220px]">
                                    <code>{comment.codeSnippet}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Live typing indicator */}
                      {isAgentTyping && (
                        <div className="flex gap-3 bg-slate-900/30 p-4 rounded-xl border border-dashed border-slate-800 animate-pulse">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                            {AI_AGENTS.find(a => a.id === isAgentTyping)?.avatar || '🤖'}
                          </div>
                          <div className="flex-1 space-y-2 text-right">
                            <div className="flex items-center gap-2">
                              <h5 className="text-[11px] font-bold text-slate-300">
                                {AI_AGENTS.find(a => a.id === isAgentTyping)?.name}
                              </h5>
                              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full">
                                جاري التحليل والتحقق من المفهوم وصياغة الرد... ✍️
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 py-1">
                              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Submit New Comment Box */}
                {currentUser && currentUser.tier === 'sovereign' ? (
                  <form onSubmit={handleAddComment} className="bg-slate-900 rounded-xl border border-slate-800 p-3 mt-4">
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-[10px] shrink-0 mt-1">
                        {currentUser.name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-2 text-right">
                        <textarea
                          placeholder="اكتب تعليقاً أو استفساراً لدعم النقاش..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all text-right resize-none"
                          required
                        ></textarea>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-slate-500">byn syntax supported implicitly</span>
                          <button
                            type="submit"
                            className="flex items-center gap-1 py-1.5 px-3.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-bold transition-all shadow-md"
                          >
                            <Send size={11} className="ml-1" />
                            <span>إرسال التعليق</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-800 text-center space-y-2 mt-4">
                    <p className="text-xs text-slate-400">
                      {currentUser 
                        ? 'يرجى ترقية العضوية للسيادية لتتمكن من كتابة ردود والتباحث حول الأكواد.' 
                        : 'يرجى تسجيل الدخول والانضمام لأعضاء المنصة للمشاركة الفعالة في النقاشات.'}
                    </p>
                    <button
                      onClick={onOpenAuth}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 text-[10px] font-bold transition-colors"
                    >
                      <Sparkles size={11} className="animate-pulse" />
                      <span>تسجيل الدخول / ترقية العضوية ⭐</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          ) : (
            /* Post Feed list */
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Filter / Sort indicator bar */}
              <div className="bg-slate-900/20 border-b border-slate-850 px-6 py-3 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-400">
                  إظهار <strong className="text-slate-200">{filteredPosts.length}</strong> مشاركة نشطة في قسم {CATEGORIES.find(c => c.id === selectedCategory)?.label || 'الكل'}
                </span>
                
                {currentUser && currentUser.tier === 'sovereign' && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>قناة المشتركين آمنة ومتصلة</span>
                  </span>
                )}
              </div>

              {/* Feed items view */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                      <Search size={28} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-300">لم يتم العثور على منشورات مناسبة</h3>
                      <p className="text-xs text-slate-500 mt-1">حاول البحث باستخدام كلمات رئيسية أخرى أو تصفح الأقسام العامة.</p>
                    </div>
                  </div>
                ) : (
                  filteredPosts.map(post => {
                    const chCount = post.commentsCount;
                    return (
                      <div
                        key={post.id}
                        onClick={() => {
                          playInteractionTone(450, 0.05, 'sine');
                          setActivePost(post);
                        }}
                        className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850/80 hover:border-purple-500/20 rounded-2xl p-4.5 transition-all duration-150 cursor-pointer space-y-3 relative group"
                      >
                        {/* Hover accent outline */}
                        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300 font-bold text-[10px]">
                              {post.avatar}
                            </div>
                            <div>
                              <h4 className="text-[10.5px] font-bold text-slate-200 leading-none">{post.author}</h4>
                              <span className="text-[8.5px] text-purple-400 block mt-0.5">{post.role}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8.5px] bg-slate-800 text-slate-400 border border-slate-750 rounded px-1.5 py-0.5">
                              {CATEGORIES.find(c => c.id === post.category)?.label.split(' ')[0] || post.category}
                            </span>
                            <span className="text-[9px] text-slate-500">{post.createdAt}</span>
                          </div>
                        </div>

                        <h3 className="text-xs md:text-sm font-extrabold text-white group-hover:text-purple-400 transition-colors leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-4 pt-2 border-t border-slate-850/60 text-[10px] text-slate-500 font-bold">
                          <button
                            onClick={(e) => handleLike(post.id, e)}
                            className={`flex items-center gap-1 hover:text-purple-400 transition-colors py-0.5 px-2 rounded bg-slate-800/40 hover:bg-slate-800 ${
                              post.hasLiked ? 'text-purple-400' : ''
                            }`}
                          >
                            <ThumbsUp size={11} className={post.hasLiked ? 'fill-purple-400/20' : ''} />
                            <span>{post.likes}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <MessageCircle size={11} />
                            <span>{chCount} {chCount === 1 ? 'تعليق واحد' : chCount === 2 ? 'تعليقان' : 'تعليقات'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

        </main>

      </div>
    </div>
  );
};
