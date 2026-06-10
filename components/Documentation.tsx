import React, { useState } from 'react';
import { 
  X, Book, Layers, Box, Sparkles, Music, Film, Search, AlertCircle, 
  Library, FileText, Download, Printer, Cpu, Terminal, Play, 
  HelpCircle, Check, Copy, ChevronLeft, ChevronRight, Settings, Sliders 
} from 'lucide-react';
import { EXAMPLES, SYNTAX_MAP } from '../constants';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('intro');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateManualText = () => {
    return `
===================================================================
             دليل مرجع لغة البيان (Al-Bayan Reference Manual)
===================================================================
الإصدار: 2.2
تاريخ التوليد: ${new Date().toLocaleDateString('ar-SA')}

مرحباً بك في لغة البيان، لغة برمجية عربية مفتوحة المصدر.
هذا الملف يحتوي على شرح تفصيلي لجميع الأوامر والدوال المتاحة مع الأمثلة.

-------------------------------------------------------------------
1. الأساسيات (Basics)
-------------------------------------------------------------------

[تعريف متغير]
الوصف: حجز مساحة في الذاكرة لتخزين قيمة (نص، رقم، قائمة...).
الصيغة: عرف [اسم] = [قيمة]
مثال:
  عرف الاسم = "أحمد"
  عرف العمر = 25

[الطباعة]
الوصف: عرض النتائج في شاشة المخرجات.
الصيغة: اطبع([القيمة])
مثال:
  اطبع("مرحبا بك")
  اطبع(الاسم)

[التعليقات]
الوصف: نصوص يتجاهلها المترجم، تستخدم للشرح.
الصيغة: // نص التعليق
مثال:
  // هذا تعليق لن يتم تنفيذه

-------------------------------------------------------------------
2. التحكم في التدفق (Control Flow)
-------------------------------------------------------------------

[الجمل الشرطية - لو / وإلا]
الوصف: تنفيذ كود معين فقط إذا تحقق الشرط.
الصيغة:
  لو (الشرط):
      // كود
  وإلا:
      // كود بديل
  نهاية
مثال:
  لو (العمر > 18):
      اطبع("بالغ")
  وإلا:
      اطبع("قاصر")
  نهاية

[حلقات التكرار - لكل]
الوصف: تكرار الكود لعدد محدد من المرات أو عبر قائمة.
الصيغة: لكل [متغير] في المجال([بداية]، [نهاية]):
مثال:
  لكل رقم في المجال(1، 5):
      اطبع(رقم)
  نهاية

[التكرار البسيط - كرر]
الوصف: تكرار بسيط لعدد مرات معين.
الصيغة: كرر ([عدد]) مرات:
مثال:
  كرر (3) مرات:
      اطبع("تنبيه!")
  نهاية

-------------------------------------------------------------------
3. الدوال والبرمجة الكائنية (OOP & Functions)
-------------------------------------------------------------------

[تعريف مهمة (دالة)]
الوصف: تجميع كود لتنفيذه لاحقاً.
الصيغة: مهمة [الاسم]([المعاملات]):
مثال:
  مهمة جمع(أ، ب):
      اطبع(أ + ب)
  نهاية
  جمع(5، 3)

[تعريف صنف (Class)]
الوصف: قالب لإنشاء كائنات تحتوي على بيانات ووظائف.
الصيغة: صنف [الاسم]:
مثال:
  صنف سيارة:
      بناء(لون):
          هذا.لون = لون
      نهاية
      
      مهمة تحرك():
          اطبع("السيارة " + هذا.لون + " تتحرك")
      نهاية
  نهاية

[الوراثة]
الوصف: إنشاء صنف جديد يرث صفات صنف آخر.
الصيغة: صنف [الابن] يرث [الاب]:
مثال:
  صنف شاحنة يرث سيارة:
     // ...
  نهاية

[إنشاء كائن]
الوصف: أخذ نسخة فعلية من الصنف.
الصيغة: عرف [اسم] = جديد [الصنف](...)
مثال:
  عرف س = جديد سيارة("أحمر")
  س.تحرك()

-------------------------------------------------------------------
4. المكتبة القياسية (Standard Library)
-------------------------------------------------------------------

تأتي اللغة مع كائنات جاهزة للاستخدام المباشر:

[وحدة الرياضيات - رياضيات]
- رياضيات.جذر(س)      : الجذر التربيعي
- رياضيات.أس(س، ص)    : س مرفوع للقوة ص
- رياضيات.عشوائي()    : رقم عشوائي بين 0 و 1
- رياضيات.تقريب(س)    : تقريب لأقرب عدد صحيح
- رياضيات.ط           : قيمة باي (3.14...)

[وحدة النصوص - نصوص]
- نصوص.طول(نص)        : عدد الأحرف
- نصوص.بحث(نص، كلمة)  : هل الكلمة موجودة؟ (صح/خطأ)
- نصوص.استبدال(نص، قديم، جديد)

[وحدة القوائم - قوائم]
- قوائم.أضف(قائمة، عنصر)
- قوائم.احذف(قائمة)      : حذف آخر عنصر
- قوائم.رتب(قائمة)       : ترتيب تصاعدي
- قوائم.اعكس(قائمة)
- قوائم.طول(قائمة)

[وحدة الوقت - وقت]
- وقت.الآن()            : الوقت الحالي كنص
- وقت.تاريخ()           : التاريخ الحالي
- وقت.انتظر(ملي_ثانية)  : إيقاف التنفيذ مؤقتاً

-------------------------------------------------------------------
5. الذكاء الاصطناعي والوسائط (AI & Media)
-------------------------------------------------------------------

[توليد الصور]
الأمر: أنشئ_صورة("وصف المشهد")
مثال: أنشئ_صورة("قطة ترتدي قبعة فضاء")

[توليد الصوت]
الأمر: أنشئ_صوت("النص للقراءة")
مثال: أنشئ_صوت("مرحباً بكم في استوديو البيان")

[توليد الفيديو (محاكاة)]
الأمر: أنشئ_فيديو("وصف الحركة")
مثال: أنشئ_فيديو("روبوت يرقص")

[الموسيقى]
الأمر: اعزف("النوتة"، "المدة")
مثال: اعزف("C4", "8n")

[نماذج اللغة (LLM)]
الأمر: اسأل_الذكاء("سؤالك")
مثال: اسأل_الذكاء("اشرح لي نظرية الكم")

[الترجمة والتلخيص]
الأمر: ترجم("النص"، "اللغة")
الأمر: لخص("النص الطويل")

-------------------------------------------------------------------
6. نظام الملفات (File System)
-------------------------------------------------------------------

[الكتابة في ملف]
الأمر: اكتب_ملف("مسار_الملف"، "المحتوى")
مثال: اكتب_ملف("بيانات.txt"، "مرحباً")

[القراءة من ملف]
الأمر: اقرأ_ملف("مسار_الملف")
مثال: عرف محتوى = اقرأ_ملف("بيانات.txt")

===================================================================
نهاية الدليل
استوديو البيان - مفتوح المصدر
===================================================================
    `;
  };

  const handleDownloadManual = () => {
    const text = generateManualText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AlBayan_Manual.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <title>الكتاب المرجعي - لغة البيان</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
          <style>
              body { font-family: 'Cairo', sans-serif; padding: 40px; color: #1e293b; max-width: 210mm; margin: 0 auto; }
              h1 { font-size: 28px; border-bottom: 3px solid #10b981; padding-bottom: 10px; margin-bottom: 20px; color: #064e3b; }
              h2 { font-size: 22px; color: #059669; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
              h3 { font-size: 18px; color: #0f766e; margin-top: 20px; }
              p { line-height: 1.6; margin-bottom: 10px; }
              pre { background: #f1f5f9; padding: 15px; border-radius: 8px; direction: ltr; text-align: left; font-family: 'Fira Code', monospace; white-space: pre-wrap; border: 1px solid #e2e8f0; }
              code { font-family: 'Fira Code', monospace; background: #e2e8f0; padding: 2px 4px; rounded: 4px; font-size: 0.9em; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; }
              th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: right; }
              th { background-color: #f1f5f9; font-weight: bold; color: #334155; }
              .page-break { page-break-after: always; }
              .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 50px; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
      </head>
      <body>
          <h1>لغة البيان (Al-Bayan) - الدليل الشامل</h1>
          <p>لغة برمجة عربية مفتوحة المصدر، مصممة للتعليم وتطوير التطبيقات الحديثة.</p>
          <p>تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</p>
          
          <h2>1. هيكلية اللغة (Architecture)</h2>
          <p>تعتمد لغة البيان على نظام <strong>Transpilation (الترجمة المصدرية)</strong>، حيث يتم تحويل الكود العربي إلى لغات عالمية:</p>
          <ul>
            <li><strong>JavaScript:</strong> للتشغيل داخل المتصفحات وبناء تطبيقات الويب التفاعلية.</li>
            <li><strong>Python:</strong> للذكاء الاصطناعي ومعالجة البيانات والنصوص.</li>
            <li><strong>Java:</strong> للتطبيقات المؤسسية والتعليم الأكاديمي.</li>
            <li><strong>HTML:</strong> لبناء واجهات الويب.</li>
          </ul>

          <h2>2. قاموس الأوامر (Syntax Dictionary)</h2>
          <table>
            <thead><tr><th>الأمر العربي</th><th>المقابل البرمجي (English)</th></tr></thead>
            <tbody>
              ${SYNTAX_MAP.map(item => `<tr><td style="font-weight:bold; color:#059669">${item.arabic}</td><td dir="ltr">${item.english}</td></tr>`).join('')}
            </tbody>
          </table>

          <div class="page-break"></div>

          <h2>3. أمثلة برمجية شاملة</h2>
          ${EXAMPLES.map((ex, i) => `
            <h3>${i + 1}. ${ex.title}</h3>
            <pre>${ex.code}</pre>
          `).join('')}

          <div class="footer">
             تم إنشاء هذا المستند بواسطة استوديو البيان &copy; 2024
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // 8 Comprehensive Chapters mapped indexing
  const CHAPTERS = [
    {
      id: 'intro',
      title: '1. دليل البدء السريع وكتابة برنامجك الأول',
      shortTitle: 'البدء السريع الأول',
      icon: <Play className="text-emerald-400" size={18} />,
      keywords: ['رئيسية', 'بدء', 'أول', 'مقدمة', 'تعريف', 'طباعة', 'خطوة'],
      render: () => (
        <div className="space-y-6">
          <div className="bg-emerald-950/20 border border-emerald-800/50 p-4 rounded-xl">
            <h4 className="text-emerald-400 font-bold mb-2 text-base flex items-center gap-2">
              <Sparkles size={18} />
              فلسفة لغة البيان
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              لغة <strong>البيان</strong> هي لغة برمجية تعتمد على قواعد اللغة العربية المفهومة والمبسطة. تُترجم مباشرة وجدولياً إلى لغات البرمجة الحديثة (مثل جافاسكريبت وبايثون وجافا). تهدف إلى إتاحة تطوير البرمجيات والوسائط والألعاب والذكاء الاصطناعي دون وجود عوائق لغوية.
            </p>
          </div>

          <h4 className="text-white font-bold text-base border-r-4 border-emerald-500 pr-3">دورة كتابة وتشغيل برنامجك الأول خطوة بخطوة:</h4>
          
          <div className="relative border-r border-slate-700 pr-6 space-y-6">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -right-[31px] top-0 bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ring-4 ring-slate-900">١</span>
              <h5 className="text-emerald-400 font-semibold text-sm">تجهيز المهمة الرئيسية</h5>
              <p className="text-slate-300 text-xs mt-1">
                كل برنامج في لغة البيان يبدأ من دالة تسمى <code className="bg-slate-800 text-emerald-300 px-1 py-0.5 rounded text-xs">رئيسية</code>. يتم الإعلان عنها بكتابة الكلمة المفتاحية <code className="bg-slate-800 text-purple-300 px-1 py-0.5 rounded text-xs">مهمة</code> متبوعة بالاسم والأقواس ونقطتين رأسيتين.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -right-[31px] top-0 bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ring-4 ring-slate-900">٢</span>
              <h5 className="text-emerald-400 font-semibold text-sm">حجز المتغيرات بالذاكرة</h5>
              <p className="text-slate-300 text-xs mt-1">
                نستخدم الكلمة البرمجية <code className="bg-slate-800 text-pink-300 px-1 py-0.5 rounded text-xs">عرف</code> للإعلان عن متغير جديد مرن يتكيف مع كافة قيم البيانات المدخلة.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -right-[31px] top-0 bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ring-4 ring-slate-900">٣</span>
              <h5 className="text-emerald-400 font-semibold text-sm">طباعة المخرجات</h5>
              <p className="text-slate-300 text-xs mt-1">
                نستدعي أمر <code className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded text-xs">اطبع(...)</code> لتمرير أي قيمة نصية أو رقمية ليتم إرسالها والاحتفاظ بها في اللوحة الطرفية للمخرجات.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <span className="absolute -right-[31px] top-0 bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ring-4 ring-slate-900">٤</span>
              <h5 className="text-emerald-400 font-semibold text-sm">إغلاق وتتويج كتلة الكود</h5>
              <p className="text-slate-300 text-xs mt-1">
                يجب إنهاء كل كتلة برمجية (مهمة، صنف، لو، لكل) بكتابة الكلمة البرمجية <code className="bg-slate-800 text-yellow-300 px-1 py-0.5 rounded text-xs">نهاية</code>. هذا الجزء يرشد المترجم لإنهاء الأقواس بشكل مغلق وآمن.
              </p>
            </div>
          </div>

          <div className="mt-4 bg-slate-950 p-4 rounded-lg border border-slate-800 relative group">
            <div className="absolute left-3 top-3 flex gap-2">
              <button 
                onClick={() => handleCopyCode('ex-first', `مهمة رئيسية():\n    عرف تيسير = "أهلاً بك في استوديو البيان"\n    اطبع(تيسير)\n    \n    لكل رقم في المجال(1، 4):\n        اطبع("الخطوة رقم: " + رقم)\n    نهاية\nنهاية`)}
                className="p-1 px-2 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1 transition-colors"
                title="نسخ الكود"
              >
                {copiedId === 'ex-first' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                {copiedId === 'ex-first' ? 'تم النسخ!' : 'نسخ'}
              </button>
            </div>
            <h5 className="text-xs text-slate-400 mb-2 font-mono" dir="rtl">مثال متكامل لكود البداية:</h5>
            <pre className="text-xs text-slate-300 font-mono text-left" dir="ltr">
{`مهمة رئيسية():
    عرف تيسير = "أهلاً بك في استوديو البيان"
    اطبع(تيسير)
    
    لكل رقم في المجال(1، 4):
        اطبع("الخطوة رقم: " + رقم)
    نهاية
نهاية`}
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'ide-tour',
      title: '2. معمارية واجهة استوديو البيان خطوة بخطوة',
      shortTitle: 'معمارية واجهة الاستوديو',
      icon: <Settings className="text-blue-400" size={18} />,
      keywords: ['محرر', 'منقح', 'مخرجات', 'نقاط التوقف', 'توقف', 'ذاكرة', 'مستكشف'],
      render: () => (
        <div className="space-y-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            استوديو البيان ليس مجرد محرر بسيط، بل هو <strong>بيئة تطوير متكاملة (IDE)</strong> كاملة المواصفات مصممة لمؤازرة المبرمجين العرب في صياغة، واختبار، ومراقبة الذاكرة أثناء عمل البرنامج.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-1">
                <Terminal size={16} />
                ١. محرر الكود الذكي وبدء نقاط التوقف
              </h5>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>لوحة إدخال مرنة مع دعم ترقيم تقدمي متزامن دقيق للأسطر.</li>
                <li><strong>تفعيل نقاط التوقف (Breakpoints)</strong>: من خلال النقر مباشرةً بجانب رقم السطر في المحرر. ستظهر علامة حمراء برمجية تُجبر المصحح البرمجي على التوقف المؤقت عندما يصل التنفيذ إليها.</li>
              </ul>
            </div>

            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-cyan-400 font-bold text-sm mb-2 flex items-center gap-1">
                <Sliders size={16} />
                ٢. المنقّح التفاعلي ومراقبة الذاكرة حياً
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                عند النقر على زر <strong>"تحري الأخطاء (Debug)"</strong>، سيقوم المترجم بتسجيل عمليات مراقبة لحظية. يمكنك الاستفادة من:
              </p>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li><strong className="text-white">خطوة بخطوة (Step)</strong>: لتمرير تنفيذ السطور سطرًا تلو الآخر ورصد الحركة.</li>
                <li><strong className="text-white">أكمل (Continue)</strong>: مواصلة التشغيل السريع حتى نقطة التوقف الحمراء التالية.</li>
                <li><strong className="text-white">مراقب البيئة والذاكرة (Scope Inspector)</strong>: لوحة جانبية تسرد المتغيرات وقيمها الفعالة في الذاكرة حالياً.</li>
              </ul>
            </div>

            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 col-span-1 md:col-span-2">
              <h5 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-1">
                <Layers size={16} />
                ٣. مستعرض الوسائط والمخرجات والترجمات المتعددة
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                تنقسم شاشة المخرجات إلى ثلاثة أجزاء مفصلية هامة:
              </p>
              <ul className="text-xs text-slate-300 space-y-1 mt-2 list-disc list-inside">
                <li><strong className="text-white">شاشة المخرجات (Terminal Console)</strong>: تعرض التقارير النصية وسجلات الأخطاء وحسابات العمليات البرمجية بشكل منسق.</li>
                <li><strong className="text-white">لوحة الوسائط (Media Panel)</strong>: المكان المخصص لتجسيد نتائج الأوامر الذكية كعرض الرسوم والصور، النطق السمعي التفاعلي، ملفات الفيديوهات، ومكونات الويب التفاعلية.</li>
                <li><strong className="text-white">الكود المقابل (Transpiled Source View)</strong>: يتيح لك التنقل المرن بين علامات التبويب ومشاهدة الكود المصدري بعد تحويله تلقائياً لـ (Python، JavaScript، Java، أو HTML).</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'syntax-vars',
      title: '3. القاموس المصدري وتفاصيل عمل المترجم التفسيري',
      shortTitle: 'تفاصيل عمل المترجم',
      icon: <Cpu className="text-pink-400" size={18} />,
      keywords: ['مترجم', 'ترجمة', 'قاموس', 'عرف', 'حاول', 'التقط', 'استورد', 'مكتبة'],
      render: () => (
        <div className="space-y-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            يعتمد مترجم البيان على محرك تحويل مصدري متقدم (Regex-based State Transpiler) يقوم بحماية السلاسل النصية والتعليقات أولاً (Masking Process) لتجنب ترجمتها بشكل خاطئ، ثم استبدال الكلمات العربية بمقابلاتها المناسبة وصياغة القواعد المستقرة.
          </p>

          <h4 className="text-white font-bold text-base border-r-4 border-pink-500 pr-3">تفصيل بنود القواعد وترجمتها خطوة بخطوة:</h4>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-200">
                  <th className="p-2 border border-slate-700">البند في لغة البيان</th>
                  <th className="p-2 border border-slate-700">الترجمة البرمجية المقابلة</th>
                  <th className="p-2 border border-slate-700">الوظيفة التفصيلية خطوة بخطوة</th>
                </tr>
              </thead>
              <tbody className="text-slate-300 divide-y divide-slate-800">
                <tr>
                  <td className="p-2 font-bold text-pink-300 font-mono">عرف س = ص</td>
                  <td className="p-2 font-mono text-left text-slate-400" dir="ltr">let s = y</td>
                  <td className="p-2">أمر حجز حيز في الذاكرة تحت مسمى (س) وحفظ القيمة الابتدائية (ص) داخله ديناميكياً.</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-pink-300 font-mono">حاول / نهاية</td>
                  <td className="p-2 font-mono text-left text-slate-400" dir="ltr">try &#123; ... &#125;</td>
                  <td className="p-2">بدء كتلة مأمونة لتجنب انهيار التطبيق، واختبار الأخطاء الداخلية.</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-pink-300 font-mono">التقط(خطأ)</td>
                  <td className="p-2 font-mono text-left text-slate-400" dir="ltr">catch(error) &#123;</td>
                  <td className="p-2">معالجة وقوع الخطأ وتفادي توقف المتصفح أو المعالج والحصول على تفاصيل مسببات الخلل.</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-pink-300 font-mono">استورد "confetti"</td>
                  <td className="p-2 font-mono text-left text-slate-400" dir="ltr">await __sys_import("...")</td>
                  <td className="p-2">استيراد المكتبات العالمية الشهيرة ديناميكياً من خوادم الويب المفتوحة وحقن واجهاتها الرسومية لتعمل مع كودك فوراً.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <h5 className="text-pink-400 font-bold text-sm mb-2">💡 الحماية الصارمة للنصوص الحرفية (Literals Masking)</h5>
            <p className="text-slate-300 text-xs leading-relaxed">
              يقوم مترجم البيان تلقائياً بتحييد النصوص داخل علامات التنصيص المزدوجة <code className="bg-slate-800 text-slate-300 px-1 rounded">"..."</code> والأحادية والتعليقات التي تبدأ بـ <code className="bg-slate-800 text-slate-300 px-1 rounded">//</code> ويستبدلها بمعرفات مؤقتة مثل <code className="bg-slate-800 text-slate-300 px-1 rounded">___LIT_0___</code>. بهذه الخطوة نضمن عدم ترجمة الكلمات العربية الموجودة داخل الجمل والرسائل المخصصة للشاشة مثل كلمة "لو" أو "عرف" عندما تكون جزءاً من حوار نصي عادي. ويتم إعادتها لقوامها الأصلي بعد تمام عملية الترجمة البرمجية.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'control-loops',
      title: '4. منطق التحكم والتدفق وحلقات التكرار الذكية',
      shortTitle: 'منطق التحكم وحلقات التكرار',
      icon: <Layers className="text-orange-400" size={18} />,
      keywords: ['لو', 'إلا', 'طبيعية', 'حلقة', 'مجال', 'كرر', 'مرات', 'نهاية'],
      render: () => (
        <div className="space-y-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            يدير استوديو البيان شؤون تسيير البرنامج وتفرعه الشرطي، أو تكرار العمليات البرمجية بشكل منتظم بالكامل من خلال تبسيط لا يرهق ذهن المتعلم.
          </p>

          <h4 className="text-white font-bold text-base border-r-4 border-orange-500 pr-3">تفصيل الجمل الشرطية والدوائر الحلقية:</h4>

          <div className="space-y-4">
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-orange-400 font-semibold text-sm mb-2">أولاً: الجمل الشرطية (لو / وإلا / وإلا لو)</h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                يقوم محرك الترجمة بتحليل الشروط الحية مسترجعاً الأقواس المنطقية للتفرعات. انظر المقارنة:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-slate-400 font-mono mb-1">البيان:</div>
                  <pre className="font-mono text-emerald-300">
{`لو (العمر >= 18):
    اطبع("بالغ")
وإلا:
    اطبع("شبل")
نهاية`}
                  </pre>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-slate-400 font-mono mb-1">الترجمة إلى JavaScript:</div>
                  <pre className="font-mono text-slate-400 text-left" dir="ltr">
{`if (العمر >= 18) {
    await __sys_log("بالغ")
} else {
    await __sys_log("شبل")
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-yellow-400 font-semibold text-sm mb-2">ثانياً: تكرار المجال (لكل ... في المجال)</h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                يُغني عن تعقيدات حساب مساحة الحلقات وصيغة الـ For المعقدة. نحدد نطاق البداية ونطاق النهاية كالتالي:
              </p>
              <div className="bg-slate-900 p-3 rounded text-xs font-mono mb-2">
                <span className="text-purple-400">لكل</span> س في <span className="text-cyan-400">المجال</span>(1، 10): 
                <span className="text-slate-500 block">  // يدور تنفيذ العمليات من الرقم ١ حتى الرقم ٩ تلقائياً</span>
              </div>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-pink-400 font-semibold text-sm mb-2">ثالثاً: التكرار المبسط (كرر ... مرات:)</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                طريقة مدمجة بريئة للمبتدئين للتكرار السريع عند الرغبة في تنفيذ كود دون الحاجة لإشغال الذاكرة بإنشاء متغير تحكم وتصفية رقمي، مثل:
              </p>
              <pre className="bg-slate-900 p-2 rounded text-xs font-mono text-emerald-300 mt-2">
{`كرر (3) مرات:
    اطبع("تنبيه!")
نهاية`}
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'oop',
      title: '5. البرمجة الكائنية المتقدمة (OOP - Object Oriented Programming)',
      shortTitle: 'البرمجة الكائنية المتقدمة',
      icon: <Box className="text-purple-400" size={18} />,
      keywords: ['صنف', 'كائن', 'بناء', 'جديد', 'هذا', 'الوراثة', 'يرث'],
      render: () => (
        <div className="space-y-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            يدعم استوديو البيان ركائز البرمجة الكائنية (OOP) الأساسية من إنشاء قوالب توريث الصفات مع وراثة برمجية صلبة ومرنة تسمح بتصنيف المكونات وتحقيق تعددية الأوجه البرمجية (Polymorphism).
          </p>

          <h4 className="text-white font-bold text-base border-r-4 border-purple-500 pr-3">مكونات البرمجة الكائنية في البيان بالتفصيل:</h4>

          <div className="space-y-4">
            {/* Class */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-purple-400 font-bold text-sm mb-1">١. الصنف والتعريف (صنف - Class)</h5>
              <p className="text-xs text-slate-300">
                يبدأ قالب الكائنات بالإعلان <code className="bg-slate-800 text-purple-300 px-1 rounded">صنف سيارة:</code> ليقوم ببناء الهيكل الخارجي الذي يحتوي بداخله على الخواص والدوال.
              </p>
            </div>

            {/* Constructor */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-blue-400 font-bold text-sm mb-1">٢. دالة التدشين التأسيسية (بناء - Constructor)</h5>
              <p className="text-xs text-slate-300">
                دالة خاصة تستدعى فور إنشاء الكائن في الذاكرة لتخصيص قيمه الافتراضية، مثل الألوان، السعات، أو أية بيانات تأسيسية.
              </p>
            </div>

            {/* This */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-cyan-400 font-bold text-sm mb-1">٣. الضمير المتصل بالذات للكائن (هذا - this)</h5>
              <p className="text-xs text-slate-300">
                يستخدم لمنع خلط المتغيرات العامة مع متغيرات الصف الكائنية. كود <code className="bg-slate-800 text-cyan-300 px-1 rounded">هذا.لون = لون</code> يترجم فورياً إلى <code className="bg-slate-800 text-cyan-200 px-1 rounded text-xs font-mono">this.color = color</code>.
              </p>
            </div>

            {/* Extends */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-pink-400 font-bold text-sm mb-1">٤. الوراثة المتقدمة وسهولة الاستنساخ (يرث / جديد)</h5>
              <p className="text-xs text-slate-300">
                نكتب <code className="bg-slate-800 text-pink-300 px-1 rounded">صنف شاحنة يرث سيارة:</code> لتقوم الشاحنة تلقائياً بالتمتع بجميع وظائف وصفات صنف السيارة الأب. ونشيد نسخاً جديدة في الذاكرة باستخدام الكلمة الراقية <code className="bg-slate-800 text-emerald-300 px-1 rounded">جديد</code>.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <h5 className="text-xs text-slate-400 mb-2 font-mono" dir="rtl">مثال متكامل لنظام كائني مورث:</h5>
            <pre className="text-xs text-slate-300 font-mono text-left" dir="ltr">
{`صنف روبوت:
    بناء(اسم):
        هذا.اسم = اسم
    نهاية

    مهمة تفعيل():
        اطبع("الروبوت " + هذا.اسم + " مستعد!")
        أنشئ_صوت("أهلاً بك")
    نهاية
نهاية

مهمة رئيسية():
    عرف ر = جديد روبوت("بيان-X")
    ر.تفعيل()
نهاية`}
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'stdlib-details',
      title: '6. تفاصيل ومكونات المكتبة القياسية المدمجة',
      shortTitle: 'أقسام وتفاصيل المكتبة القياسية',
      icon: <Library className="text-cyan-400" size={18} />,
      keywords: ['رياضيات', 'نصوص', 'قوائم', 'وقت', 'جذر', 'عشوائي', 'طول', 'استبدال'],
      render: () => (
        <div className="space-y-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            توفر البيئة ملفات ومكتبات استاتيكية مدمجة جاهزة للعمل والاستعمال دون أي تثبيت خارجي، من تصفية نصوص وحسابات وهندسة زمنية حركية.
          </p>

          <h4 className="text-white font-bold text-base border-r-4 border-cyan-500 pr-3">أقسام الوحدات والمكتبات القياسية:</h4>

          <div className="space-y-4">
            {/* Math */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-emerald-400 font-bold text-sm mb-2">رياضيات (Math Module)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300">
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">NaN / رياضيات.ط</code>: قيمة الثابت الهندسي باي (3.14).
                </div>
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">رياضيات.جذر(س)</code>: استخراج قيمة الجذر التربيعي للأعداد.
                </div>
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">رياضيات.أس(س، ص)</code>: القوة الرياضية (رفع القيمة س للقوة ص).
                </div>
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">رياضيات.عشوائي()</code>: رقم عشري عشوائي مستقر ما بين 0 و 1.
                </div>
              </div>
            </div>

            {/* List */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-cyan-400 font-bold text-sm mb-2">قوائم (List Module)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300">
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">قوائم.أضف(ق، ع)</code>: إدراج وحقن عنصر جديد في أخر القائمة.
                </div>
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">قوائم.احذف(ق)</code>: إزالة وإقصاء آخر عنصر من قائمة التخزين.
                </div>
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">قوائم.رتب(ق)</code>: الترتيب التصاعدي الطبيعي التلقائي لعناصر السلة.
                </div>
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">قوائم.طول(ق)</code>: استخراج العدد الكلي للعناصر الراكبة حالياً في القائمة.
                </div>
              </div>
            </div>

            {/* Texts */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-pink-400 font-bold text-sm mb-2">نصوص (Text Module)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300">
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-pink-300">نصوص.طول(ن)</code>: جلب العدد التام للأحرف للرسالة النصية.
                </div>
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-pink-300">نصوص.استبدال(ن، ق، ج)</code>: استبدال وتصحيح العبارات القديمة بالجديدة.
                </div>
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-pink-300">نصوص.بحث(ن، ك)</code>: البحث عن العثور على كلمة داخل السلسلة (صح/خطأ).
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-yellow-400 font-bold text-sm mb-2">وقت (Time & Async Operations)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300">
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-yellow-300">وقت.الآن()</code>: استدعاء التوقيت واللحظة الزمنية الحالية كنص منسق.
                </div>
                <div>
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-yellow-300">وقت.انتظر(ملي_ثانية)</code>: حجر تعليق للبرنامج مؤقتاً لتطوير العمليات المتأخرة والزمنية.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-media',
      title: '7. قنوات الذكاء الاصطناعي وتوليد الوسائط والرسوم',
      shortTitle: 'الذكاء الاصطناعي وتوليد الوسائط',
      icon: <Sparkles className="text-amber-400" size={18} />,
      keywords: ['صوت', 'صورة', 'فيديو', 'اعزف', 'اسأل_الذكاء', 'ترجم', 'لخص', 'ذكاء', 'ميديا'],
      render: () => (
        <div className="space-y-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            تتمتع لغة البيان ببنية تحتية قوية تدير دمج الوسائط المفتوحة والذكاء الاستدلالي بشكل فوري دون الحاجة لضبط معقد أو مفاتيح خادم سرية.
          </p>

          <h4 className="text-white font-bold text-base border-r-4 border-amber-500 pr-3">قواعد وأوامر التوليد الإبداعي:</h4>

          <div className="space-y-4">
            {/* Stable Diffusion */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-emerald-400 font-bold text-sm mb-1 flex items-center gap-1">
                <Sparkles size={16} />
                توليد اللوحات الفنية (أنشئ_صورة)
              </h5>
              <code className="text-xs bg-slate-900 text-emerald-300 px-1.5 py-1 rounded block mb-2 font-mono">
                أنشئ_صورة("وصف اللوحة بالإنجليزية أو بنص مفصل")
              </code>
              <p className="text-xs text-slate-300">
                الأمر يتصل ديناميكياً بخدمات التوليد السريعة لرسم لوحة تطابق خيالك وعرضها بداخل لوحة معارض المخرجات الجانبية التابعة للاستوديو.
              </p>
            </div>

            {/* Speech synthesis */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-cyan-400 font-bold text-sm mb-1 flex items-center gap-1">
                <Music size={16} />
                قراءة النصوص بالصوت والضاد (أنشئ_صوت)
              </h5>
              <code className="text-xs bg-slate-900 text-cyan-300 px-1.5 py-1 rounded block mb-2 font-mono">
                أنشئ_صوت("مرحباً بكم في فضاء لغة البيان الضادي")
              </code>
              <p className="text-xs text-slate-300">
                تستخدم البيئة واجهات التوليف الحنجري والصوتي المدمج لنطق الكلمات بأعلى مخارج تمنح المستمع حساً تفاعلياً طبيعياً رائعاً.
              </p>
            </div>

            {/* Tone.js */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-amber-400 font-bold text-sm mb-1 flex items-center gap-1">
                <Sliders size={16} />
                الآلة الموسيقية وهندسة الترددات (اعزف)
              </h5>
              <code className="text-xs bg-slate-900 text-amber-300 px-1.5 py-1 rounded block mb-2 font-mono">
                اعزف("C4", "8n")
              </code>
              <p className="text-xs text-slate-300">
                مبنية ومُدارة من خلال واجهات المتصفح الصوتي الهندسي (Tone.js) لإشعال الهزازات وتوليد تونات لحنية فريدة (Notes & Durations).
              </p>
            </div>

            {/* LLM Text */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-purple-400 font-bold text-sm mb-1 flex items-center gap-1">
                <Cpu size={16} />
                نماذج المحادثة وتلخيص الشروحات (اسأل_الذكاء/لخص/ترجم)
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                توفر واجهات استعلامات لغوية متكاملة لخدمة المشاريع البحثية وتبسيط معالجة اللغات الطبيعية (NLP):
              </p>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li><code className="bg-slate-900 px-1 rounded text-purple-300 font-mono">اسأل_الذكاء("ما هي سرعة الضوء؟")</code>: الحصول على إفادة دقيقة فورية.</li>
                <li><code className="bg-slate-900 px-1 rounded text-purple-300 font-mono">لخص("نص المقال...")</code>: تخفيض حجم الفقرات مع صيانة المفهوم المعرفي.</li>
                <li><code className="bg-slate-900 px-1 rounded text-purple-300 font-mono">ترجم("نص عربي"، "English")</code>: الترجمة الحرة اللحظية.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'advanced-future-tech',
      title: '8. الحوسبة الكمومية المتطورة والتطور التلقائي (GitHub/GitLab)',
      shortTitle: 'الحوسبة الكمومية والتطور التلقائي',
      icon: <Cpu className="text-pink-400" size={18} />,
      keywords: ['تشابك', 'كمومية', 'بوابة_تحكم_نفي', 'تحديث_تلقائي', 'عامل_مستقل', 'تدريب_تطوري', 'مخطط_الشبكة', 'استيراد_حزمة', 'بحث_مستودعات'],
      render: () => (
        <div className="space-y-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            يدعم استوديو لغة البيان ميزات الحوسبة الكمومية والشبكات العصبية المتطورة، إلى جانب مخرجات الربط السحابي والتعلم المستقل من المنصات المجانية والحرة كـ GitHub و GitLab من أجل قابلية المحرر للتطوير النحوي والذاتي المتواصل.
          </p>

          <h4 className="text-white font-bold text-base border-r-4 border-pink-500 pr-3">قواعد وأوامر الحوسبة الكمومية الفائقة:</h4>

          <div className="space-y-4">
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-pink-400 font-bold text-sm mb-1 flex items-center gap-1">
                ⚛️ التشابك الكمي وقواعد بيل (كمومية.تشابك)
              </h5>
              <code className="text-xs bg-slate-900 text-pink-300 px-1.5 py-1 rounded block mb-2 font-mono">
                كمومية.تشابك(ك١, ك٢)
              </code>
              <p className="text-xs text-slate-300">
                يقوم بتجميع كيوبيتين في حالة متشابكة واحدة تلغي استقلاليتهما الفردية وتصنع حالة بيل المشتركة <code className="text-pink-400 font-mono">|Ψ⁺⟩</code>. أي تأثير أو قياس على أحدهما ينهار بالحالة المتشابكة فورياً ليتأثر الآخر.
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-purple-400 font-bold text-sm mb-1 flex items-center gap-1">
                🎛️ بوابة التحكم بالنفي (كمومية.بوابة_تحكم_نفي)
              </h5>
              <code className="text-xs bg-slate-900 text-purple-300 px-1.5 py-1 rounded block mb-2 font-mono">
                كمومية.بوابة_تحكم_نفي(الكيوبيت_المتحكم, الكيوبيت_الهدف)
              </code>
              <p className="text-xs text-slate-300">
                أداة منطقية كمومية تقوم بعكس سعة الاحتمالية للكيوبيت الهدف فقط إذا كان الكيوبيت المتحكم في وضعية احتمالية مرتفعة للحالة <code className="text-purple-400 font-mono">|1⟩</code> (CNOT Gate).
              </p>
            </div>
          </div>

          <h4 className="text-white font-bold text-base border-r-4 border-blue-500 pr-3">قواعد الخلايا العصبية والارتقاء الجيني:</h4>

          <div className="space-y-4">
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-blue-400 font-bold text-sm mb-1 flex items-center gap-1">
                🧬 تدريب عصبي جيني تطوري (عصبية.تدريب_تطوري)
              </h5>
              <code className="text-xs bg-slate-900 text-blue-300 px-1.5 py-1 rounded block mb-2 font-mono">
                عصبية.تدريب_تطوري(نموذج_رقمي, عدد_الأجيال)
              </code>
              <p className="text-xs text-slate-300">
                يتجاوز التدريب الرياضي البسيط ليقوم بإطلاق خوارزمية وراثية مطورة ومستوحاة حيوياً تقوم بمزاوجة أوزان 50 فصيلة تدريبية وتتدرج بالصعود وتطوير الدقة عبر الأجيال تدريجياً.
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-cyan-400 font-bold text-sm mb-1 flex items-center gap-1">
                📊 رسم مخطط هندسة العصبونات (عصبية.مخطط_الشبكة)
              </h5>
              <code className="text-xs bg-slate-900 text-cyan-300 px-1.5 py-1 rounded block mb-2 font-mono">
                عصبية.مخطط_الشبكة(نموذج_رقمي)
              </code>
              <p className="text-xs text-slate-300">
                يقوم برسم المظهر الخلوي الداخلي ومخططات سريان التوقعات وهياكل التوصيل للشبكة رقمياً بالرموز التوضيحية داخل شاشة المخرجات والنتائج.
              </p>
            </div>
          </div>

          <h4 className="text-white font-bold text-base border-r-4 border-emerald-500 pr-3">الابتكار والتعلم والشفاء الذاتي من المنصات المفتوحة:</h4>

          <div className="space-y-4">
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-emerald-400 font-bold text-sm mb-1 flex items-center gap-1">
                🌐 استيراد والتعرف الذاتي للتعليقات والمنطق (تعلم.استيراد_حزمة)
              </h5>
              <code className="text-xs bg-slate-900 text-emerald-300 px-1.5 py-1 rounded block mb-2 font-mono">
                تعلم.استيراد_حزمة("github/username/repoName")
              </code>
              <p className="text-xs text-slate-300">
                يتواصل ديناميكياً مع خوادم جيت هوب وجيت لاب المفتوحة ويسحب الشيفرات ليقوم بتحليل هيكلها النحوي وبنائها لتسجيلها وتعلم وظائفها تلقائياً بالذاكرة الافتراضية.
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-teal-400 font-bold text-sm mb-1 flex items-center gap-1">
                🚀 التحديث النحوي التلقائي وعلاج الأخطاء الذاتي (تعلم.تحديث_تلقائي)
              </h5>
              <code className="text-xs bg-slate-900 text-teal-300 px-1.5 py-1 rounded block mb-2 font-mono">
                تعلم.تحديث_تلقائي()
              </code>
              <p className="text-xs text-slate-300">
                يتحقق من كفاءة مترجم لغة البيان ويقوم بإعادة بناء شجرات التحليل النحوي وإدراج مرادفات برمجية جديدة تلقائياً معززاً أداء ووظائف المحرر لتفادي الاختلالات المستقبلية.
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-indigo-400 font-bold text-sm mb-1 flex items-center gap-1">
                🛡️ حماية الذاكرة وعلاج عيوب لغات البرمجة (أمان.تحليل_لغة_ومعالجة)
              </h5>
              <code className="text-xs bg-slate-900 text-indigo-300 px-1.5 py-1 rounded block mb-2 font-mono">
                أمان.تحليل_لغة_ومعالجة(اللغة_الأخرى)
              </code>
              <p className="text-xs text-slate-300">
                يقوم محرك البيان بدراسة العثرات التاريخية في اللغات الأخرى (كفيض البيانات وتسريبات مؤشرات C++، وبطء تفسير وترميز بايثون، وترهّل جاوا) وتطبيق ترياق أمان معزز ونظير برباط الذاكرة والتعافي الذاتي (AST Self-Correction).
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-amber-400 font-bold text-sm mb-1 flex items-center gap-1">
                🔗 التوافق اللغوي والربط ثنائي الاتجاه (تبادل)
              </h5>
              <code className="text-xs bg-slate-900 text-amber-300 px-1.5 py-1 rounded block mb-2 font-mono">
                تبادل.تشغيل_جافاسكريبت("كود") / تبادل.تشغيل_بايثون("كود")
              </code>
              <p className="text-xs text-slate-300">
                أداة متقدمة تهدف لخلط ومزاوجة التكنولوجيا، حيث تمكنك من دمج وتشغيل الأكواد المكتوبة بلغات أخرى حياً وحصد مخرجاتها من قلب برامج البيان بمرونة بالغة.
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-sky-400 font-bold text-sm mb-1 flex items-center gap-1">
                📱 تهيئة وهندسة الأجهزة الموحدة وعوائق المنصات (جهاز.تهيئة_الجهاز)
              </h5>
              <code className="text-xs bg-slate-900 text-sky-300 px-1.5 py-1 rounded block mb-2 font-mono">
                جهاز.تهيئة_الجهاز(الجهاز_المستهدف)
              </code>
              <p className="text-xs text-slate-300">
                تكييف تلقائي كامل لموجات المترجم والـ AST بناءً على طبيعة الأجهزة والمكونات المعدنية - سواءً كان متصفح ويب (تفعيل استجابات اللمس والـ DOM)، أو تطبيق أندرويد (تكامل الحساسات والكاميرا)، أو حاسوب مكتب، أو رقاقات ومعدات IoT الذكية.
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-emerald-400 font-bold text-sm mb-1 flex items-center gap-1">
                🤖 بيئة تطوير برمجيات الأندرويد الهجينة (أندرويد.بناء_APK)
              </h5>
              <code className="text-xs bg-slate-900 text-emerald-300 px-1.5 py-1 rounded block mb-2 font-mono">
                أندرويد.صناعة_تطبيق(المعرف، الاسم) / أندرويد.بناء_APK()
              </code>
              <p className="text-xs text-slate-300">
                نظام برمجي ثوري يُمكّن المطوّر من تخليق وتجربة وتصدير تطبيقات هواتف ذكية أصلية حقيقية (Native Android App) بالكامل من خلال شيفرة البيان العربية! يُترجم الكود فوريّاً إلى Kotlin Jetpack Compose وتوليد ملف APK جاهز للتثبيت والمشاركة، متجاوزاً بذلك عثرات وتعقيدات بيئات العمل التقليدية المجهدة.
              </p>
            </div>

            <div className="bg-slate-850 p-4 rounded-xl border border-teal-500/20 col-span-1 md:col-span-2">
              <h5 className="text-teal-400 font-bold text-sm mb-1.5 flex items-center gap-1">
                ⚛️ الحوسبة الكمومية والتنظيف التلقائي الذاتي والمستشعرات للاندرويد
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded border border-purple-900/40">
                  <span className="text-purple-300 font-bold font-mono">أندرويد.محرك_كمومي("تراكب")</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    يفك قيود الحوسبة الكلاسيكية على الهواتف بتفعيل محاكي ترابط وتراكب البيانات (Superposition) لرفع سرعة المعالجة اللحظية وقبض الأخطاء الحسابية.
                  </p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-blue-900/40">
                  <span className="text-blue-300 font-bold font-mono">أندرويد.ذكاء_سحابي_دمج("ميزة")</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    يحقن ذكاءً اصطناعياً محلياً فائقاً للتفاعل الذاتي مع المدخلات داخل الواجهات دون إرهاق السيرفرات أو توليد نصوص بطيئة.
                  </p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-emerald-900/40">
                  <span className="text-emerald-300 font-bold font-mono">أندرويد.تنظيف_ذاكرة_تلقائي()</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    يتفوق على أخطاء لغات البرمجة الحالية (تسريبات اللغات الأخرى والـ Out of Memory) عبر التطهير الفوري التلقائي للذاكرة العشوائية لتبقى صفر مئوية.
                  </p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-amber-900/40">
                  <span className="text-amber-300 font-bold font-mono">أندرويد.مستشعر_ذكي(حساس، دالة)</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    يربط الحساسات المادية والجيروسكوبية للـ Android مباشرة بدالة المطور بنقرة برمجية وحيدة سهلة للتحكم المطلق.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-850 p-5 rounded-xl border border-rose-500/20 col-span-1 md:col-span-2">
              <h5 className="text-rose-400 font-bold text-sm mb-2 flex items-center gap-1.5">
                🎬 مكتبة محرك الوسائط الذكي (BayanMediaEngine / وسائط)
              </h5>
              <p className="text-xs text-slate-350 leading-relaxed mb-4">
                تُبسط هذه المكتبة المدمجة بالكامل تداول واستعراض ملفات الصوت، الفيديو، الصور والألبومات التفاعلية ضمن تطبيقات الأندرويد، وتوصيلها بمحرك الهياكل بأقل كتابة أكواد وبأقصى فاعلية.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded border border-rose-950/40">
                  <span className="text-rose-300 font-bold font-mono">وسائط.صورة(معرف, مسار, تعليق)</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    لتحميل وعرض الصور الثابتة والمتحركة بمحاذاة الشاشات وتجاوز دقة العرض تلقائياً وبأقل استهلاك للموارد.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-rose-950/40">
                  <span className="text-rose-300 font-bold font-mono">وسائط.فيديو(معرف, مسار, تعليق)</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    توليد مشغل مشبع تفاعلي مدمج مرسل بجميع أدوات التحكم (play/pause، شريط التقدم، ومستوى الصوت).
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-rose-950/40">
                  <span className="text-rose-300 font-bold font-mono">وسائط.صوت(معرف, مسار, تعليق)</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    لدمج وعزف الحزم الصوتية مع تتبع المسار وقوائم العينات وتوصيل مشغلات الخلفية.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-rose-950/40">
                  <span className="text-rose-300 font-bold font-mono">وسائط.معرض_صور(معرف, فئة)</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    لبناء شبكة ألبومات ذكية ومتجاوبة لعرض الصور بدقة وحركات وتكبير ملهم.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'vfs-extensions',
      title: '9. نظام الملفات الافتراضي وميزات الامتداد .byn للمشروع',
      shortTitle: 'نظام الملفات والامتداد .byn',
      icon: <FileText className="text-green-400" size={18} />,
      keywords: ['ملفات', 'مسار', 'اكتب_ملف', 'اقرأ_ملف', 'مستكشف', 'امتدادات'],
      render: () => (
        <div className="space-y-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            يوفر استوديو البيان نظاماً مسجلاً لمحاكاة التخزين للملفات والبرامج ذات الامتداد <span className="text-emerald-400 font-mono">.byn</span> (ملفات لغة البيان) لمساعدة المبتدئين في الاعتياد على هيكليات المشاريع الكبرى.
          </p>

          <h4 className="text-white font-bold text-base border-r-4 border-green-500 pr-3">قنوات وأولويات إدارة التخزين الافتراضي:</h4>

          <div className="space-y-4">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-green-400 font-bold text-sm mb-1">١. ميزة قراءة وكتابة الملفات (اكتب_ملف / اقرأ_ملف)</h5>
              <p className="text-xs text-slate-300 mb-2">
                يمكن للبرنامج إنشاء ملفات نصية افتراضية مسجلة بالقرص التخيلى أو استراجع الملفات التأسيسية للمشروع كالآتي:
              </p>
              <pre className="bg-slate-900 p-2 rounded text-xs font-mono text-emerald-300">
{`عرف مسار = "تكوين.byn"
اكتب_ملف(مسار, "الإعدادات: نشطة")
عرف محتوى = اقرأ_ملف(مسار)
اطبع(محتوى)`}
              </pre>
            </div>

            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h5 className="text-cyan-400 font-bold text-sm mb-1">٢. تنظيم حزمة المصادر ومستكشف الملفات الجانبي</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                في الواجهة الجانبية للاستوديو، تلاحظ وجود محاكاة لمجلد يسمى <strong className="text-white">"المصدر (src)"</strong>. هذا المجلد مخصص ليسكنه ملف التشغيل العام <code className="bg-slate-800 text-slate-300 px-1 rounded text-xs font-mono">main.byn</code> الذي يحتوي على دالتك التأسيسية، وملامح الدوال المساعدة الأخرى مثل <code className="bg-slate-800 text-slate-300 px-1 rounded text-xs font-mono">utils.byn</code> لتتدرج في هيكلة وهندسة الكود بطريقة علمية سليمة وجاهزة للمشروعات الحية المستقرة.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Global search filtering over matching keywords/chapters
  const filteredChapters = CHAPTERS.filter(chap => {
    const isSearchEmpty = searchTerm.trim() === '';
    if (isSearchEmpty) return true;
    return (
      chap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chap.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const activeChapter = CHAPTERS.find(c => c.id === activeTab) || CHAPTERS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
      <div className="bg-slate-900 w-full max-w-6xl h-[88vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative" id="docs-modal">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <Book className="text-emerald-500 animate-pulse" size={24} />
              الدليل التعليمي الشامل والمفهرس لاستوديو لغة البيان
            </h2>
            <div className="hidden sm:flex gap-2">
              <button 
                onClick={handleDownloadManual}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-full transition-colors font-medium"
                title="تحميل الدليل النصي البسيط"
              >
                <Download size={13} />
                تحميل نص (.txt)
              </button>
              <button 
                onClick={handlePrintPDF}
                className="flex items-center gap-1.5 text-xs bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-full transition-colors font-medium"
                title="طباعة الدليل أو حفظه كـ PDF"
              >
                <Printer size={13} />
                طباعة الدليل / PDF
              </button>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all hover:rotate-90 duration-300"
            id="close-docs-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            <input 
              type="text" 
              placeholder="ابحث عن مفهوم، دالة، أو كلمة برمجية (مثال: 'توقف'، 'صنف'، 'متغير'، 'اعزف')..." 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pr-10 pl-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-600 font-sans"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Auto switch to the first matching tab if searching
                if (e.target.value.trim() !== '') {
                  const matched = CHAPTERS.find(chap => 
                    chap.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    chap.keywords.some(k => k.toLowerCase().includes(e.target.value.toLowerCase()))
                  );
                  if (matched) setActiveTab(matched.id);
                }
              }}
              autoFocus
            />
          </div>
          <div className="text-xs text-slate-500 font-mono hidden md:block">
            الإصدار الحالي: v2.2
          </div>
        </div>

        {/* Dual Panel Body Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Right Sidebar: Chapters Index (الفهرس) */}
          <div className="w-1/3 md:w-1/4 border-l border-slate-800 bg-slate-900/40 overflow-y-auto flex flex-col">
            <div className="p-3 border-b border-slate-800 bg-slate-900/20 text-xs font-bold text-slate-500 tracking-wider">
              فهرس بنود الشرح
            </div>
            
            <div className="flex-1 p-2 space-y-1">
              {filteredChapters.length > 0 ? (
                filteredChapters.map((chap) => {
                  const isSelected = activeTab === chap.id;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => setActiveTab(chap.id)}
                      className={`w-full flex items-center gap-2.5 p-3 rounded-lg text-right transition-all group relative ${
                        isSelected 
                          ? 'bg-slate-800 border-r-4 border-emerald-500 text-white font-medium' 
                          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {chap.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate md:hidden">
                          {chap.shortTitle}
                        </div>
                        <div className="text-xs md:text-sm font-semibold truncate hidden md:block">
                          {chap.title}
                        </div>
                      </div>
                      <ChevronLeft size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ml-1 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-600">
                  لا توجد نتائج مطابقة لمفهوم البحث.
                </div>
              )}
            </div>

            {/* Mobile Print Help Buttons */}
            <div className="p-3 border-t border-slate-800 space-y-1 block sm:hidden">
              <button 
                onClick={handleDownloadManual}
                className="w-full text-center text-[10px] py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs block font-sans"
              >
                تحميل نص (.txt)
              </button>
              <button 
                onClick={handlePrintPDF}
                className="w-full text-center text-[10px] py-1.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400 text-xs block font-sans"
              >
                طباعة الدليل (PDF)
              </button>
            </div>
          </div>

          {/* Left Main Pane: Selected Chapter Contents (شرح البند المفصل) */}
          <div className="flex-1 overflow-y-auto bg-slate-900/10 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Active Chapter Title Card */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                  {activeChapter.icon}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {activeChapter.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    قسم الشروحات المفهرسة لبيئة البيان | تم التحديث
                  </p>
                </div>
              </div>

              {/* Dynamic Interactive Contents Render */}
              <div className="text-slate-300 leading-relaxed text-sm animate-fade-in py-2">
                {activeChapter.render ? activeChapter.render() : (
                  <p className="text-slate-500 text-xs">جاري تجهيز بيانات هذا المحتوى...</p>
                )}
              </div>

            </div>

            {/* Pagination Controls inside Modal */}
            <div className="border-t border-slate-800 pt-6 mt-8 flex justify-between items-center text-xs text-slate-400">
              {(() => {
                const currentIndex = CHAPTERS.findIndex(c => c.id === activeTab);
                const prevChapter = currentIndex > 0 ? CHAPTERS[currentIndex - 1] : null;
                const nextChapter = currentIndex < CHAPTERS.length - 1 ? CHAPTERS[currentIndex + 1] : null;
                
                return (
                  <>
                    <div>
                      {prevChapter ? (
                        <button 
                          onClick={() => setActiveTab(prevChapter.id)}
                          className="flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-lg border border-slate-700/60 transition-colors"
                        >
                          <ChevronRight size={14} />
                          السابق: {prevChapter.shortTitle}
                        </button>
                      ) : <div />}
                    </div>
                    
                    <div className="hidden sm:block font-mono text-[11px] text-slate-600">
                      بند {currentIndex + 1} من {CHAPTERS.length}
                    </div>

                    <div>
                      {nextChapter ? (
                        <button 
                          onClick={() => setActiveTab(nextChapter.id)}
                          className="flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-lg border border-slate-700/60 transition-colors"
                        >
                          التالي: {nextChapter.shortTitle}
                          <ChevronLeft size={14} />
                        </button>
                      ) : <div />}
                    </div>
                  </>
                );
              })()}
            </div>

          </div>

        </div>
        
        {/* Footer actions overlay */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <HelpCircle size={14} />
            هل تواجه صعوبة؟ جرب الأمثلة الجاهزة بالنقر فوقها مباشرة بالواجهة الرئيسية.
          </div>
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-755 text-sm"
            id="close-docs-footer-btn"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
