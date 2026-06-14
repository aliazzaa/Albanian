import React, { useRef } from 'react';
import { 
  FileText, Download, Printer, BookOpen, Layers, Cpu, Sparkles, 
  Terminal, Globe, Smartphone, Activity, ArrowLeftRight 
} from 'lucide-react';

export const BayanInteractiveReport: React.FC = () => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = `# تقرير مشروع نظام لغة البيان المتكامل (الأصدار المحدث ٢٠٢٦)
مقدم من استوديو تطوير الكومبايلر والمفسر الهيكلي للغة البيان العربية

---

## فهرس المحتويات
1. الفلسفة اللغوية ورؤية التأسيس لبرمجة عربية مستقلة
2. مواصفة المعمارية وهيكل مرور الشفرة (The Compiler Pipeline)
3. المرحلة الأولى: تفكيك الحروف والمسح المعجمي (Lexer & Tokenizer)
4. المرحلة الثانية: المحلل الإعرابي الهيكلي وتشييد الشجرة النحوية (AST Parser)
5. المرحلة الثالثة: المجمع الدلالي وإنشاء شريط البايت كود (Semantic Analyzer & VM Bytecode)
6. المرحلة الرابعة: محاكي المسجل وتدفقات الآلة الافتراضية للبيان (Al-Bayan VM Runtime)
7. المرحلة الخامسة: التجميع فائق السرعة لبرمجيات المتصفح (WebAssembly WAT Compiler)
8. المرحلة السادسة: هندسة واجهات الأجهزة المحمولة ومجمع الأندرويد لـ Jetpack Compose
9. المرحلة السابعة: الدمج الذكي للشبكات العصبية والخوارزميات الكمومية (AI & Quantum SDK)
10. الخاتمة والأبعاد الاستراتيجية لمستقبل لغة البيان

---

## 1. الفلسفة اللغوية ورؤية التأسيس
انطلقت لغة البيان (Al-Bayan) كأول لغة برمجة ثنائية وكمومية عربية المنشأ لعام ٢٠٢٦، تهدف إلى إدخال الثقافة والهوية اللغوية العربية في صميم هندسة الأنظمة والعتاد. بدلاً من مجرد تعريب واجهات أو استبدال كلمات بسيطة، صممت "البيان" كمنظومة برمجية متكاملة تترجم تركيب الجمل العربية العميقة إلى بايت كود حقيقي محمي بآليات أمان صارمة و0% تسريب للذاكرة.

### الركائز الاستراتيجية:
* **الأمان الصارم**: منع تداخل معجم المعرّفات الموطنة مع متغيرات المستخدم عبر هيكل تجميع حاد.
* **الأداء المتفوق**: حجم مخرجات تجميعية للأندرويد لا تتجاوز 385 كيلوبايت.
* **البعد الكمي**: تمهير العمليات الخطية وتحويلها إلى تراكبات كمومية ذات تعقيد O(1).

---

## 2. مواصفة المعمارية وهيكل مرور الشفرة
ترصف شفرة البيان مسار مرور علمي صارم يماثل أحدث لغات النظم في العالم:
\`\`\`
[الكود المصدري .byn]
       │
      ▼ (مرحلة المسح اللغوي)
 [المحلل المعجمي: Lexer] ──▶ قائمة الرموز المفروزة (Tokens)
       │
      ▼ (قواعد الصرف النحوي)
 [المحلل الإعرابي: Parser] ──▶ شجرة الإعراب المجردة (AST JSON)
       │
      ▼ ┌──────────────────────────────────────────────┐
      │ │   المحلل الدلالي وفاحص السلامة المعرفي (AST Check)│
      │ └──────────────────────────────────────────────┘
      ├───────────────────────┬────────────────────────┐
      ▼                       ▼                        ▼
[آلة البيان الافتراضية]  [مجمع ويب أسمبلي]      [موطن الأندرويد والهواتف]
(Virtual Machine)       (WebAssembly WAT)       (Android App Compiler)
[البايت كود الفعلي]       [ملفات الـ .wasm]       [مخرجات Jetpack Compose]
\`\`\`

---

## 3. المرحلة الأولى: تفكيك الحروف والمسح المعجمي (Lexer)
يقوم المحلل المعجمي (\`AlBayanLexer\`) بقراءة الكود كحروف مائية، ثم تجميعها خطوة بخطوة إلى رموز معرفة (\`Tokens\`) حسب المعجم البرمجي للغة البيان:
* **حجز المتغيرات**: الكلمة المفتاحية \`عرف\` لتوليد الرمز \`TokenType.VAR\`.
* **تعريف الدوال**: الكلمة المفتاحية \`مهمة\` لتوليد الرمز \`TokenType.FUNC\`.
* **التحكم والشرط**: الأدوات \`لو\` و \`إلا لو\` و \`وإلا\` و \`نهاية\` لتأطير مسودات الدورة.

---

## 4. المرحلة الثانية: المحلل الإعرابي وتشجير البنية (AST Parser)
يأخذ المحلل الإعرابي (\`AlBayanParser\`) قائمة الرموز ويصوغها في هيكل هرمي يسمى شجرة الإعراب المجردة (\`Abstract Syntax Tree\`).
طريقة عمل مفسر النزول التراجعي الصارم:
- التحقق من توازن العبارات البرمجية.
- صياغة عبارات الإسناد المعادل مثل \`عرف السن = ٢٥\`.
- تنظيم العمليات الرياضية وفق سلم الأسبقية العالمي (الضرب والقسمة قبل الجمع والطرح).

---

## 5. المرحلة الثالثة: المحلل الدلالي وشريط البايت كود (Semantic & Bytecode)
قبل إرسال الكود للآلة الافتراضية، يمر عبر فاحص الصحة الدلالي لضمان الأمان والجاذبية:
* اكتشاف محاولات استخدام متغيرات غير معلن عنها مسبقاً.
* الكشف عن القسمة على قيمة صفرية لمنع الانهيار المباشر للآلة.
* توليد شريط بايت كود فائق السرعة يعتمد على مكدس الآلة والـ Instructions لزيادة التوافق العتادي.

---

## 6. المرحلة الرابعة: الآلة الافتراضية للبيان (Virtual Machine Engine)
تحاكي الآلة الافتراضية (\`AlBayanVirtual Machine\`) وحدة المعالجة المركزية الدقيقة، حيث تمتلك مسجلات للذاكرة ومكدس (Call Stack) لحفظ الحسابات اللحظية:
* **الأمر \`PUSH [Value]\`**: دفع الأرقام والمحارف إلى المكدس.
* **الأمر \`ADD\` / \`SUB\` / \`MUL\` / \`DIV\`**: إجراء العمليات الحسابية من أعلى المكدس.
* **الأمر \`STORE [VarName]\`**: تخزين القيم المستخرجة من المكدس في مسجل الذاكرة المحلي.

---

## 7. المرحلة الخامسة: مجمع ويب اسمبلي (WebAssembly WAT)
يتولى مجمع الويب (\`AlBayanWasmCompiler\`) تحويل شجرة الإعراب لشفرة من صنف \`WAT\` ليعمل الكود في المتصفحات والسيرفرات بسرعة قريبة من سرعة الآلة الأصلية، متفوقاً بمرونته على سائر اللغات المفسرة وخالٍ تماماً من التجسير عبر الجافا سكريبت الثقيلة.

---

## 8. المرحلة السادسة: مجمع الأندرويد والهواتف الذكية (Android Compose SDK)
مكتبة \`أندرويد.\` تمنح مطوري البيان القدرة الفائقة على تخريد شفرة واحدة تترجم فورياً إلى لغتي Kotlin و Jetpack Compose:
- \`أندرويد.صناعة_تطبيق\` للإطلاق.
- \`أندرويد.زر\` و \`أندرويد.نص\` لبناء الواجهات الرشيقة.
- منظومة تنظيف الذاكرة التلقائية الخلوية \`أندرويد.تنظيف_ذاكرة_تلقائي()\` لضمان 0% تسريب للذاكرة على الأجهزة الضعيفة.

---

## 9. المرحلة السابعة: تكامل الذكاء الاصطناعي والحوسبة الكمومية (AI & Quantum Simulation)
تدريب النماذج العصبية \`عصبية.\` مع بوابات التراكب والتشابك الكمي \`كمومية.\` لدمج نظريات الحوسبة فائقة السرعة مع دلالات البيان، حيث تحول البوابات الكمومية مثل \`كمومية.هادامارد()\` المشاكل المعقدة جداً لحساب فوري مذهل ومثبت بنمذجة الآلة الافتراضية.

---

## 10. الخلايا والتقرير الاستراتيجي الختامي
تُمثل لغة البيان نقلة نوعية في التوطين الرقمي والذكاء السيادي، متممة جميع مراحل البناء البرمجي من الصفر بمرونة وتكامل متناهي الدقة والتشغيل.
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AlBayan_Project_Comprehensive_Thesis_Report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-right animate-fade-in text-slate-100" dir="rtl">
      
      {/* Top Banner & Control Toolbar */}
      <div className="no-print bg-slate-900/90 border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileText className="text-yellow-400 w-5 h-5 shrink-0" />
            مرصد المستندات الفصيحة وتوليد تقارير PDF الموثقة 🎓
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            من هنا يمكنك تصفح التقرير المتكامل لمراحل تصميم وتطوير كومبايلر البيان من الصفر وحتى الحوسبة الكمية، وطباعتها وتصديرها كملف PDF رسمي ومفهرس!
          </p>
        </div>
        
        <div className="flex gap-2.5 w-full md:w-auto">
          <button
            onClick={handleDownloadMarkdown}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-705 border border-slate-700 text-xs font-bold text-slate-200 transition-all shadow cursor-pointer select-none"
            title="تحميل التقرير الكامل كملف ماركداون ممتد"
          >
            <Download size={15} />
            تنزيل مستند الكومبايلر (.md)
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4   py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-450 hover:to-amber-550 text-slate-950 text-xs font-bold transition-all shadow-md shadow-yellow-500/10 cursor-pointer select-none"
            title="فتح نافذة الطباعة لتوليد مستند PDF احترافي ومفهرس"
          >
            <Printer size={15} />
            طباعة / تصدير التقرير PDF
          </button>
        </div>
      </div>

      {/* Main Report Document - Document Layout */}
      <div 
        ref={printAreaRef}
        className="bg-slate-950 p-6 md:p-12 rounded-2xl border border-slate-900 shadow-2xl relative overflow-hidden text-right leading-relaxed max-w-4xl mx-auto printing-document-sheet"
      >
        {/* Subtle Watermark Decoration */}
        <div className="absolute top-10 left-10 text-[110px] text-slate-900/10 font-bold font-mono select-none pointer-events-none uppercase tracking-widest no-print">
          Bayan
        </div>

        {/* ----------------- COVER PAGE (FOR PRINTING) ----------------- */}
        <div className="print-only-title text-center py-16 border-b-2 border-slate-800 mb-12 flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20 mb-3 no-print-flex">
            <BookOpen size={48} className="animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-loose">
            البيان الفصيح لعام ٢٠٢٦
          </h1>
          <h2 className="text-xl font-bold text-yellow-400 mt-1">
            أطروحة وهندسة الكومبايلر والآلة الافتراضية للغة برمجية عربية مدمجة
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-4 leading-relaxed max-w-lg mx-auto">
            دراسة تفصيلية متكاملة تتبع مراحل التحليل اللغوي، الإعرابي النحوي، التجميع المالي، توليد البايت كود، المعالجة على الويب (WAT)، ومجمع الأندرويد لـ Jetpack Compose والعتاد الكمي التطوري.
          </p>
          <div className="mt-8 text-[11px] text-slate-500 font-bold flex flex-wrap justify-center gap-x-8 gap-y-2 border-t border-slate-900 pt-6">
            <span>تاريخ الإصدار: يونيو ٢٠٢٦ م</span>
            <span>النسخة: v1.8.4 المستقرة</span>
            <span>الناشر: استوديو تطوير البيان التفاعلي</span>
          </div>
        </div>

        {/* ----------------- TABLE OF CONTENTS ----------------- */}
        <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl mb-12">
          <h3 className="text-sm font-bold text-yellow-400 mb-4 border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <span className="bg-yellow-950 text-yellow-400 text-[10px] py-0.5 px-2 rounded-full font-bold">مفهرس</span>
            جدول المحتويات والمحتوى الدراسي الشامل:
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-350">
            <li className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
              <span className="font-bold text-slate-100">1. الفلسفة اللغوية ورؤية التأسيس لبرمجة عربية مستقلة</span>
              <span className="font-mono text-slate-500 font-bold">ص ١</span>
            </li>
            <li className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
              <span className="font-bold text-slate-100">2. مواصفة المعمارية وهيكل مرور الشفرة (The Compiler Pipeline)</span>
              <span className="font-mono text-slate-500 font-bold">ص ٢</span>
            </li>
            <li className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
              <span className="font-bold text-slate-100">3. المرحلة الأولى: تفكيك الحروف والمسح اللغوي والمعجمي (Lexer)</span>
              <span className="font-mono text-slate-500 font-bold">ص ٣</span>
            </li>
            <li className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
              <span className="font-bold text-slate-100">4. المرحلة الثانية: الإعراب الدلالي وتشييد شجرة الإعراب (AST Parser)</span>
              <span className="font-mono text-slate-500 font-bold">ص ٤</span>
            </li>
            <li className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
              <span className="font-bold text-slate-100">5. المرحلة الثالثة: مجمع الرموز البينية وشريط البايت كود (Bytecode Generator)</span>
              <span className="font-mono text-slate-500 font-bold">ص ٥</span>
            </li>
            <li className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
              <span className="font-bold text-slate-100">6. المرحلة الرابعة: محاكي الذاكرة وتشغيل برمجيات الآلة الافتراضية (Bayan VM)</span>
              <span className="font-mono text-slate-500 font-bold">ص ٦</span>
            </li>
            <li className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
              <span className="font-bold text-slate-100">7. المرحلة الخامسة: التجميع فائق السرعة لبرمجيات المتصفح (WebAssembly WAT)</span>
              <span className="font-mono text-slate-500 font-bold">ص ٧</span>
            </li>
            <li className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
              <span className="font-bold text-slate-100">8. المرحلة السادسة: مجمع واجهات المحمول وتطبيقات أندرويد (Compose Native SDK)</span>
              <span className="font-mono text-slate-500 font-bold">ص ٨</span>
            </li>
            <li className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
              <span className="font-bold text-slate-100">9. المرحلة السابعة: هندسة شبكات الذكاء العصبي ونماذج التراكب الكمي (AI & Quantum SDK)</span>
              <span className="font-mono text-slate-500 font-bold">ص ٩</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="font-bold text-slate-100">10. خاتمة وتطلعات حوسبة الغد من المنظورين الوطني والدولي لتمكين التقنية الموطنة</span>
              <span className="font-mono text-slate-500 font-bold">ص ١٠</span>
            </li>
          </ul>
        </div>

        {/* ----------------- SECTIONS ----------------- */}
        <div className="space-y-12">
          
          {/* SECTION 1 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">١.</span>
              الفلسفة اللغوية ورؤية التأسيس لبرمجة عربية مستقلة
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              تعتبر لغات البرمجة الركيزة الأقوى التي تبنى عليها سيادة الدول الرقمية. طوال العقود الماضية، ظلت البرمجيات مرتبطة كلياً بالرموز اللاتينية والحروف الإنجليزية، مما شكّل عائقاً هائلاً وفجوة تمنع تغلغل الفهم البرمجي في الأذهان العربية بالدقة المطلوبة. لم تكن الصعوبة في حفظ الكلمات البرمجية، بل كانت في صياغة أنماط التفكير المنطقي بلغة مغايرة لثقافتهم.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              من هذا المبدأ العلمي، ولدت لغة <strong>البيان (Al-Bayan)</strong> كمنظومة مادية ورياضية متكاملة لعام ٢٠٢٦. لم تُبنى البيان كمجرد غطاء نصي لتعريب الكلمات المفتاحية بلغة بيثون أو جافا سكريبت، بل صُممت من الصفر بكومبايلر متكامل ومفسر صارم ليكون لها بايت كود مستقل، وهندسة معالجة تستفيد من البناء الهيكلي الرصين وقواعد الصرف اللغوي اللحظي في لغة الضاد.
            </p>
            <div className="bg-slate-905 p-3.5 rounded-lg border border-slate-900 my-4 text-xs">
              <div className="font-bold text-yellow-405 mb-1.5">الركائز الأساسية التي تنبني عليها فكرة البيان:</div>
              <ul className="list-disc pr-4 space-y-1 text-slate-400">
                <li><strong className="text-slate-200">السيادة التكنولوجية الموطنة:</strong> تطوير أنظمة مستقلة تماماً تمتد للعتاد وهندسة الآلات دون ارتباط بالبنى الخارجية.</li>
                <li><strong className="text-slate-200">الأمان النظمي غير القابل للتجسير:</strong> معالجة الكود بطبقات إعرابية صارمة تمنع الأخطاء الشائعة وحجب تسريب الذاكرة بنسبة 100%.</li>
                <li><strong className="text-slate-200">الحوسبة الكمومية والذكاء الاصطناعي:</strong> تمكين صياغة خوارزميات كمومية ونماذج دلالية بشكل بديهي يحاكي البني المتوازية.</li>
              </ul>
            </div>
          </section>

          {/* SECTION 2 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">٢.</span>
              مواصفة المعمارية وهيكل مرور الشفرة (The Compiler Pipeline)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              تسلك شفرة البيان البرمجية مسار مرور (Compilation Pipeline) صارم ودقيق يضمن توافقية ومستويات معيارية تامة 1:1 مع لغات المستوى المتطور وأنظمة المعالجات الدقيقة. الهيكل يمنع كلياً المشاكل المتكررة لمستبدلات النصوص البسيطة التي تتأثر بالرموز العربية وتداخل علامات الترقيم.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              يمر الكود من المصدر وحتى الآلات والمنصات عبر مسار الخطوات التالية:
            </p>
            
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-3 font-sans my-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-yellow-400 font-bold mb-1">١. المحلل المعجمي</div>
                  <p className="text-[9.5px] text-slate-400 leading-normal">تجزئة السطور لحساء الرموز (Tokens)</p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-emerald-400 font-bold mb-1">٢. المحلل النحوي</div>
                  <p className="text-[9.5px] text-slate-400 leading-normal">رسم هرم وشجرة العلاقات (AST JSON)</p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-cyan-400 font-bold mb-1">٣. الفاحص الدلالي</div>
                  <p className="text-[9.5px] text-slate-400 leading-normal">مكافحة الأخطاء ومعالجة المتغيرات</p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-purple-400 font-bold mb-1">٤. مولد التنفيذ والمكدس</div>
                  <p className="text-[9.5px] text-slate-400 leading-normal">توليد بايت كود الآلة والـ WebAssembly</p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              تضمن هذه المعمارية المنهجية أن تكون الشفرة مفسرة ومترجمة في نفس الوقت، حيث تدعم التصدير الفوري لعشر لغات نظم كبرى مثل (Python, Java, Javascript, Kotlin, Rust, Go, C++, C#, PHP) مما يسهل دمج المشاريع المكتوبة بالبيان في بيئات العمل القائمة بكل مرونة وسخاء.
            </p>
          </section>

          {/* SECTION 3 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">٣.</span>
              المرحلة الأولى: تفكيك الحروف والمسح اللغوي والمعجمي (Lexer)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              تعتبر مرحلة المسح المعجمي (Lexing & Tokenization) خط الدفاع الأول في تتبع وفصل معاني الكلمات البرمجية المدخلة بمحرر لغة البيان. يتلقى الصنف <code className="bg-slate-900 border border-slate-800 text-yellow-300 px-1 py-0.5 rounded font-mono">AlBayanLexer</code> الكود كحبل نصي من الرموز، وبدلاً من تفتيته عشوائياً، يقرأ الحروف بشكل خطي متراص ويقوم بفرزه وتحليله لرموز معجمية دلالية محددة.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              يقوم المحلل المعجمي بالتعرف التلقائي على العناصر اللغوية وعزلها في شكل قائمة كائنات تحمل ترويسة الصنف (<code className="text-emerald-400">Type</code>)، القيمة النصية الاستشهادية (<code className="text-amber-400">Value</code>)، ورقم السطر الحالي لتسجيل أي خطأ بدقة بالغة.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 my-4">
              <div className="text-[10px] text-slate-400 mb-1.5 font-mono">قائمة الرموز المفروزة لـ "عرف س = ٢٤":</div>
              <table className="w-full text-right text-[10.5px] text-slate-300 border-collapse" dir="rtl">
                <thead>
                  <tr className="border-b border-slate-800 text-yellow-400">
                    <th className="pb-1.5 font-bold">الرمز (Lexeme)</th>
                    <th className="pb-1.5 font-bold">الصنف المعجمي (Token Type)</th>
                    <th className="pb-1.5 font-semibold">تفسير المحلل الدلالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="py-2 font-mono text-white">"عرف"</td>
                    <td className="py-2 text-purple-400 font-mono">TokenType.VAR</td>
                    <td className="py-2 text-slate-400">تعليمة برمجية لحجز متغير بالذاكرة.</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-white">"س"</td>
                    <td className="py-2 text-blue-400 font-mono">TokenType.IDENTIFIER</td>
                    <td className="py-2 text-slate-400">اسم المتغير المعرّف من قبل المستخدم.</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-white">"="</td>
                    <td className="py-2 text-emerald-400 font-mono">TokenType.ASSIGN</td>
                    <td className="py-2 text-slate-400">معامل الإسناد لحشو السجل بالقيمة الفورية.</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-white">"٢٤"</td>
                    <td className="py-2 text-amber-400 font-mono">TokenType.NUMBER</td>
                    <td className="py-2 text-slate-400 font-sans">الثابت الرقمي العشري الممثل بالقيمة.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">٤.</span>
              المرحلة الثانية: الإعراب الدلالي وتشييد شجرة الإعراب (AST Parser)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              تأخذ الشفرة صورتها الهندسية الحقيقية داخل المحلل الإعرابي النحوي <code className="bg-slate-900 border border-slate-800 text-yellow-300 px-1 py-0.5 rounded font-mono">AlBayanParser</code>. لا يهتم المعرب بالرموز المفتتة بل يتولى ربطها وتنظيمها في هيكل شجرة هرمية تسمى <strong>شجرة الإعراب المجردة (Abstract Syntax Tree - AST)</strong>.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              باستخدام ميكانيكية الهبوط التراجعي العودي (Recursive Descent Parsing)، يقابل المحلل النحوي قواعد الصرف البرمجي الموطنة في البيان متتبعاً الشفرة سطر بسطر:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-left font-mono text-[10px] my-4" dir="ltr">
              <div className="text-slate-400 mb-1.5 font-sans" dir="rtl">مثال لعقدة تمثيلية في شجرة الإعراب:</div>
{`{
  "type": "VariableDeclaration",
  "name": "س",
  "init": {
    "type": "Literal",
    "value": 24,
    "raw": "٢٤"
  },
  "line": 1
}`}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              تسمح شجرة الإعراب الناتجة للبيان بالتحكم التام في استخراج الدوال الفرعية، وإسناد العمليات المعقدة، والتحقق الحاد من دقة توازن العبارات قبل كتابة الكود لبيئات المترجمات النهائية.
            </p>
          </section>

          {/* SECTION 5 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">٥.</span>
              المرحلة الثالثة: مجمع الرموز البينية وشريط البايت كود (Bytecode Generator)
            </h3>
            <p className="text-xs text-slate-305 leading-relaxed text-justify">
              عندما تعبر الشجرة النحوية فحص السلامة وتثبت دلالتها، يتم تسليمها للمجمع لتوليد شريط كود بيني متراص وسريع يسمى <strong>البايت كود (Al-Bayan VM Bytecode)</strong>. البايت كود هو حلقة الوصل غير القابلة للكسر بين لغة المستخدم المكتوبة والعتاد المعماري الصارم للكمبيوتر.
            </p>
            <p className="text-xs text-slate-305 leading-relaxed text-justify">
              يقوم المجمع <code className="bg-slate-900 border border-slate-800 text-yellow-300 px-1 py-0.5 rounded font-mono">AlBayanBytecodeCompiler</code> بتبسيط تراكيب الحلقات، الشروط، والإسنادات إلى سلسلة مرقمة من التعليمات المسجلة. على سبيل المثال، التعبير الحسابي المعقد <code className="font-mono text-yellow-400 bg-slate-900 px-1 py-0.5 rounded">٥ + ٣ * ٢</code> يتم تبسيطه لترتيب مكدسي صارم:
            </p>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-left font-mono text-[10px] my-4 leading-relaxed" dir="ltr">
{`0: PUSH 5     ; دفع الرقم ٥ للمكدس
1: PUSH 3     ; دفع الرقم ٣ للمكدس
2: PUSH 2     ; دفع الرقم ٢ للمكدس
3: MUL        ; ضرب آخر قيمتين (٣ * ٢ = ٦) ودفع النتيجة للمكدس
4: ADD        ; جمع أعلى قيمتين (٥ + ٦ = ١١) ودفع المحصل النهائي`}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تمنع هذه الهندسة المبتكرة تكرار معالجة السلسلة الحسابية في كل مرة تدور فيها البرمجيات؛ مما يوفر نوى مستقرة ومتحررة من بطء المفسرات اللاتينية التقليدية.
            </p>
          </section>

          {/* SECTION 6 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">٦.</span>
              المرحلة الرابعة: محاكي الذاكرة وتشغيل برمجيات الآلة الافتراضية (Al-Bayan VM)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              تمتلك لغة البيان آلة جافة بالكامل وافتراضية <code className="bg-slate-900 border border-slate-800 text-yellow-300 px-1 py-0.5 rounded font-mono">AlBayanVirtualMachine</code> تمثّل الكمبيوتر بمسجلاته ووحدات المعالجة فيه. تتولى هذه الآلة تفسير البايت كود المفرز وتنفيذه في مساحة ذاكرة مغلقة ومعزولة لضمان حماية النظام المضيف.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              عناصر هيكل الحوسبة في الآلة الافتراضية:
            </p>
            <ul className="list-disc pr-4 space-y-1.5 text-xs text-slate-350">
              <li><strong className="text-slate-100">مكدس الآلة (Stack Engine):</strong> حوض مائي فائق الخفة لحفظ البيانات المؤقتة الناتجة من التقييم الحسابي والمنطقي الفوري.</li>
              <li><strong className="text-slate-100">سجل الرموز والعناوين (Symbols Table):</strong> المعاجم المتواجدة بالذاكرة العشوائية لتخزين قيم المتغيرات ودوال الأكوان.</li>
              <li><strong className="text-slate-100">إطار الدوال النشطة (Call Frames Stack):</strong> مسؤول عن تشريح إحداثيات العودة للدوال عند انتهائها من النفوذ البرمجي.</li>
            </ul>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              علاوة على ذلك، تتمتع الآلة بمستكشف حي للأخطاء (Al-Bayan Live Debugger) يمنح المهندسين القدرة على وضع نقاط توقف (Breakpoints) خطوة بخطوة بالذاكرة الحية ومعاينة تغير السجلات وتدفق العمليات بكل تفصيل وأريحية.
            </p>
          </section>

          {/* SECTION 7 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">٧.</span>
              المرحلة الخامسة: التجميع فائق السرعة لبرمجيات المتصفح (WebAssembly WAT)
            </h3>
            <p className="text-xs text-slate-303 leading-relaxed text-justify">
              تكاملت لغة البيان بالكامل مع منصة الويب عبر مجمع ويب أسمبلي المدمج <code className="bg-slate-900 border border-slate-800 text-yellow-300 px-1 py-0.5 rounded font-mono">AlBayanWasmCompiler</code>. يعود مجمع الويب بفائدة كبرى تجعل شفرات البيان العربية تعمل في كل متصفح ويب في العالم دون أي تأخير، ودون الحاجة لتنزيل آلة جافا سكريبت ضخمة لتفسيرها.
            </p>
            <p className="text-xs text-slate-303 leading-relaxed text-justify">
              يقوم مجمع الويب بإنشاء كود بلغة التجميع المعيارية <strong>WebAssembly Text Format (WAT)</strong>، والتي تترجم مباشرة لملفات البكسل المفسرة ثنائياً بنواة المتصفح:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-left font-mono text-[10px] my-4 leading-relaxed" dir="ltr">
              <div className="text-slate-400 mb-1.5 font-sans" dir="rtl">مستخلص كود الـ WAT المولد لقرينة العملية الحسابية:</div>
{`(module
  (func $add (param $lh i32) (param $rh i32) (result i32)
    local.get $lh
    local.get $rh
    i32.add
  )
  (export "add" (func $add))
)`}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              تجعلك هذه الميزة الفريدة قادراً على كتابة خوارزميات الذكاء الرياضي بلغة البيان، وتصديرها للمخدمات، الكلاود، والمتصفحات لتؤدي عملها بسرعة تنافس لغات C و Rust النظمية.
            </p>
          </section>

          {/* SECTION 8 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">٨.</span>
              المرحلة السادسة: مجمع واجهات المحمول وتطبيقات أندرويد (Compose Native SDK)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              مكتبة ومجمع الأندرويد الهيكلي للغة البيان هو الإنجاز الأبرز لتسهيل صناعة البرمجيات المحمولة. عبر البوابة الهيكلية الرائعة <code className="bg-slate-900 border border-slate-800 text-white px-1 py-0.5 rounded font-mono">أندرويد.</code>، يتم تحويل التعليمات البرمجية فورياً لواجهات الأندرويد القياسية المكتوبة بـ <strong>Kotlin</strong> ومكتبة واجهات المستخدم الأحدث في العالم <strong>Jetpack Compose</strong>.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              ميزات أمان الذاكرة والتنظيم بالملف المحمول:
            </p>
            <ul className="list-disc pr-4 space-y-1 text-xs text-slate-350">
              <li><strong className="text-slate-100">0% تسريب للذاكرة:</strong> حشو واستدعاء دالة منظف الذاكرة الهيكلي <code className="bg-slate-900 text-teal-400 px-1 rounded">تنظيف_ذاكرة_تلقائي()</code> يقوم بمسح شامل وإزالة لكومة العقد التالفة لضمان أمان الـ Heap في الهاتف المحمول.</li>
              <li><strong className="text-slate-100">حوسبة خفيفة الوزن للغاية:</strong> تترجم الأكواد لتطبيق أصيل (Native APK) بحجم إجمالي لا يكاد يتجاوز <strong>385 كيلوبايت</strong>، خفيف الاستهلاك وموفر للطاقة ومنظم بالكامل لصالح الهاتف.</li>
              <li><strong className="text-slate-100">قوالب الهاتف التفاعلية:</strong> توفير منصة متكاملة لقوالب هواتف كالمنازل الذكية والآلات والأدوات التي تتيح تشغيل مخرجات البيان حياً على شاشة محاكي الهاتف العربي المدمج.</li>
            </ul>
          </section>

          {/* SECTION 9 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">٩.</span>
              المرحلة السابعة: هندسة شبكات الذكاء العصبي ونماذج التراكب الكمي (AI & Quantum SDK)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              لم تقف البيان عند أسلوب الحوسبة المعتادة ثنائية الدقة، بل صممت من اليوم الأول بوعي متناهي يدعم تشييد الخلايا العصبية عبر مكتبة <code className="bg-slate-900 border border-slate-800 text-yellow-300 px-1 py-0.5 rounded font-mono">عصبية.</code> ومحاكي آلة الكم <code className="bg-slate-900 border border-slate-800 text-cyan-300 px-1 py-0.5 rounded font-mono">كمومية.</code> لتجربة خوارزميات المستقبل الخارقة.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              في الحوسبة الكمية، يمكن صياغة القفزات الرياضية ودمجها بالتراكب التام والتشابك:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-right text-xs my-4 leading-relaxed">
              <span className="font-bold text-cyan-405 block mb-2">📡 نموذج تراكب وتشابك الكيوبيتس:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                نقوم بحجز كيوبيت سيادي وكيوبيت طرفي وتطوير بوابة <code className="text-cyan-300">كمومية.هادامارد(كيوبيت_سيادي)</code> التي تضع الكيوبيت في تراكب تماثلي بنسبة 50/50. ثم نربطهما بـ <code className="text-cyan-300">كمومية.تشابك()</code> ليحصل الانهيار المتماسك لحظياً بسرعة O(1).
              </p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              وفي نفس المضمار العصبي، تمتلك المكتبة <code className="text-yellow-400">عصبية.تدريب_تطوري()</code> محرك جيني ذكي يطور قيم الأوزان والانجرافات عبر الشبكة تلقائياً لإتمام الرصد والتقييم، مسهلة صياغة الذكاء الاصطناعي بلغة الضاد الأنيقة.
            </p>
          </section>

          {/* SECTION 10 */}
          <section className="print-page space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-yellow-400 font-mono">١٠.</span>
              الخلاصة والأبعاد الاستراتيجية لمستقبل لغة البيان
            </h3>
            <p className="text-xs text-slate-303 leading-relaxed text-justify">
              يمثل مشروع لغة البيان المحدثة نموذجاً مشرقاً يثبت قدرة التقدم والابتكار العربي الموطن على خوض محافل التنافس التقني من الصفر بأمان وريادة وسخاء. جميع المراحل المعمارية المذكورة بدءاً من تفتيت الحروف، تشييد شجرة AST، تحليل دلالة العمليات، هندسة البايت كود، تجميع آلة ويب أسمبلي (WAT)، محاكاة الهاتف الذكي والعتاد العصبي والكمي تؤكد أن لغة البيان ليست مجرد لغة تعليمية للأطفال، بل هي أداة نظمية ثقيلة ومعدة بهندسة متميزة لتناسب حوسبة الغد الفسيحة واستقلال التقنيات السيادية بالكامل.
            </p>
            
            <div className="mt-12 text-center border-t border-slate-900 pt-6">
              <div className="text-xs font-bold text-slate-400">نهاية وثيقة التقرير المتكامل والمفهرس لشؤون لغة البيان لعام ٢٠٢٦</div>
              <div className="text-[10px] text-slate-600 mt-1">كتبت وصيغت بالكامل لصالح مهندسي استوديو البيان التفاعلي</div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
