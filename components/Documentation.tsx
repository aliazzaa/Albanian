
import React, { useState } from 'react';
import { X, Book, Layers, Box, Sparkles, Music, Film, Search, AlertCircle, Library, FileText, Download, Printer } from 'lucide-react';
import { EXAMPLES, SYNTAX_MAP } from '../constants';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

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

  const sections = [
    {
      id: 'stdlib',
      title: '0. المكتبة القياسية (Standard Library)',
      icon: <Library className="text-cyan-400" size={20} />,
      keywords: ['رياضيات', 'نصوص', 'قوائم', 'وقت', 'جذر', 'عشوائي', 'استبدال'],
      render: () => (
        <div className="space-y-4">
             <p className="text-slate-400 text-sm">توفر لغة البيان مجموعة من الوحدات الجاهزة لتسهيل البرمجة:</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-800 p-3 rounded border border-slate-700">
                     <h4 className="text-cyan-400 font-bold mb-2">1. وحدة الرياضيات (رياضيات)</h4>
                     <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                         <li><code className="bg-slate-900 px-1 rounded">رياضيات.جذر(س)</code> : الجذر التربيعي</li>
                         <li><code className="bg-slate-900 px-1 rounded">رياضيات.أس(س، ص)</code> : القوة (Power)</li>
                         <li><code className="bg-slate-900 px-1 rounded">رياضيات.عشوائي()</code> : رقم عشوائي بين 0 و 1</li>
                         <li><code className="bg-slate-900 px-1 rounded">رياضيات.تقريب(س)</code> : تقريب لأقرب عدد</li>
                     </ul>
                 </div>
                 <div className="bg-slate-800 p-3 rounded border border-slate-700">
                     <h4 className="text-cyan-400 font-bold mb-2">2. وحدة النصوص (نصوص)</h4>
                     <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                         <li><code className="bg-slate-900 px-1 rounded">نصوص.طول(نص)</code> : عدد الحروف</li>
                         <li><code className="bg-slate-900 px-1 rounded">نصوص.استبدال(نص، قديم، جديد)</code></li>
                         <li><code className="bg-slate-900 px-1 rounded">نصوص.بحث(نص، كلمة)</code> : هل توجد الكلمة؟</li>
                     </ul>
                 </div>
                 <div className="bg-slate-800 p-3 rounded border border-slate-700">
                     <h4 className="text-cyan-400 font-bold mb-2">3. وحدة القوائم (قوائم)</h4>
                     <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                         <li><code className="bg-slate-900 px-1 rounded">قوائم.أضف(قائمة، عنصر)</code></li>
                         <li><code className="bg-slate-900 px-1 rounded">قوائم.رتب(قائمة)</code></li>
                         <li><code className="bg-slate-900 px-1 rounded">قوائم.طول(قائمة)</code></li>
                     </ul>
                 </div>
                 <div className="bg-slate-800 p-3 rounded border border-slate-700">
                     <h4 className="text-cyan-400 font-bold mb-2">4. وحدة الوقت (وقت)</h4>
                     <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                         <li><code className="bg-slate-900 px-1 rounded">وقت.الآن()</code> : الوقت الحالي</li>
                         <li><code className="bg-slate-900 px-1 rounded">وقت.انتظر(ملي_ثانية)</code></li>
                     </ul>
                 </div>
             </div>
        </div>
      )
    },
    {
      id: 'ai',
      title: '1. مكتبات الذكاء الاصطناعي المفتوحة',
      icon: <Sparkles className="text-purple-400" size={20} />,
      keywords: ['ai', 'ذكاء', 'توليد', 'نصوص', 'ترجمة', 'تلخيص', 'اسأل_الذكاء', 'ترجم', 'لخص'],
      render: () => (
        <>
          <p className="mb-4 text-slate-400">
            تم دمج نماذج التوليد (Generative AI) مفتوحة المصدر داخل اللغة مباشرة. لا تحتاج لمفاتيح API.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-slate-800 p-4 rounded border border-slate-700">
                  <h4 className="text-white font-bold mb-2">توليد النصوص والمعرفة</h4>
                  <code className="text-xs text-emerald-400 block mb-2">اسأل_الذكاء("اشرح لي النظرية النسبية")</code>
                  <p className="text-xs">يستخدم نماذج لغوية ضخمة (LLMs) للإجابة على الأسئلة أو كتابة المقالات.</p>
               </div>
               <div className="bg-slate-800 p-4 rounded border border-slate-700">
                  <h4 className="text-white font-bold mb-2">الترجمة والتلخيص</h4>
                  <code className="text-xs text-emerald-400 block mb-2">ترجم("نص"، "English")</code>
                  <code className="text-xs text-emerald-400 block mb-2">لخص("نص طويل...")</code>
                  <p className="text-xs">أدوات مساعدة لمعالجة النصوص (NLP).</p>
               </div>
          </div>
        </>
      )
    },
    {
      id: 'music_video',
      title: '2. الموسيقى والفيديو',
      icon: <Music className="text-yellow-400" size={20} />,
      keywords: ['موسيقى', 'فيديو', 'اعزف', 'Tone.js', 'أنشئ_فيديو', 'frames', 'نغمات'],
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-slate-800 p-4 rounded border border-slate-700">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Music size={16}/> الموسيقى (Tone.js)</h4>
                <code className="text-xs text-emerald-400 block mb-2">اعزف("C4", "8n")</code>
                <p className="text-xs">توليد نغمات موسيقية باستخدام مكتبة Tone.js المفتوحة.</p>
             </div>
             <div className="bg-slate-800 p-4 rounded border border-slate-700">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Film size={16}/> الفيديو (محاكاة)</h4>
                <code className="text-xs text-emerald-400 block mb-2">أنشئ_فيديو("روبوت يمشي")</code>
                <p className="text-xs">توليد سلسلة من الصور المتحركة (Frames) لعرضها كفيديو.</p>
             </div>
        </div>
      )
    },
    {
      id: 'oop',
      title: '3. البرمجة الكائنية (OOP)',
      icon: <Box className="text-orange-400" size={20} />,
      keywords: ['oop', 'كائن', 'صنف', 'بناء', 'هذا', 'جديد', 'class', 'object', 'وراثة'],
      render: () => (
        <div className="bg-[#0f172a] p-4 rounded border border-slate-800">
            <code className="block bg-black/30 p-2 rounded text-xs font-mono mb-2 text-slate-300">
              صنف سيارة:<br/>
              &nbsp;&nbsp;بناء(لون):<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;هذا.لون = لون<br/>
              &nbsp;&nbsp;نهاية<br/>
              نهاية<br/><br/>
              عرف س = جديد سيارة("أحمر")
            </code>
        </div>
      )
    },
    {
      id: 'media_basics',
      title: '4. أوامر الوسائط الأساسية',
      icon: <Layers className="text-pink-400" size={20} />,
      keywords: ['صور', 'صوت', 'أنشئ_صورة', 'أنشئ_صوت', 'web speech', 'image'],
      render: () => (
        <table className="w-full text-right text-sm border-collapse">
          <thead>
            <tr className="bg-slate-800 text-slate-200">
              <th className="p-3 border border-slate-700">الأمر</th>
              <th className="p-3 border border-slate-700">الوظيفة</th>
            </tr>
          </thead>
          <tbody className="text-slate-400">
            <tr>
              <td className="p-3 border border-slate-800 text-emerald-400 font-mono">أنشئ_صورة("وصف")</td>
              <td className="p-3 border border-slate-800">رسم صور فنية باستخدام نماذج Stable Diffusion.</td>
            </tr>
            <tr>
              <td className="p-3 border border-slate-800 text-emerald-400 font-mono">أنشئ_صوت("نص")</td>
              <td className="p-3 border border-slate-800">قراءة النصوص بصوت عربي (Web Speech).</td>
            </tr>
          </tbody>
        </table>
      )
    },
    {
      id: 'synonyms',
      title: '5. المرادفات',
      icon: <Book className="text-blue-400" size={20} />,
      keywords: ['مرادفات', 'لو', 'اذا', 'كرر', 'حلقة', 'طبيعية', 'نحو'],
      render: () => (
         <p className="text-sm text-slate-400">يمكنك استخدام <strong>لو</strong> بدلاً من <strong>اذا</strong>، و <strong>كرر</strong> بدلاً من حلقات التكرار المعقدة لتبسيط الكود وجعله أقرب للغة العربية الطبيعية.</p>
      )
    }
  ];

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-4xl h-[90vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Book className="text-emerald-500" />
                دليل لغة البيان
              </h2>
              <div className="flex gap-2">
                <button 
                    onClick={handleDownloadManual}
                    className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-full transition-colors"
                    title="تحميل ملف نصي بسيط"
                >
                    <Download size={14} />
                    نص (.txt)
                </button>
                <button 
                    onClick={handlePrintPDF}
                    className="flex items-center gap-2 text-xs bg-emerald-900/50 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-full transition-colors"
                    title="طباعة أو حفظ كملف PDF"
                >
                    <Printer size={14} />
                    طباعة / PDF
                </button>
              </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800">
           <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن أمر، مفهوم، أو كلمة مفتاحية (مثال: 'صوت'، 'صنف')..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pr-10 pl-4 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 text-slate-300 leading-relaxed" dir="rtl">
          
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <section key={section.id} className="animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </h3>
                {section.render()}
              </section>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                <AlertCircle size={48} className="mb-4 opacity-20" />
                <p>لا توجد نتائج بحث مطابقة لـ "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-emerald-500 text-sm hover:underline"
                >
                  إظهار الكل
                </button>
            </div>
          )}

        </div>
        
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors border border-slate-700"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
