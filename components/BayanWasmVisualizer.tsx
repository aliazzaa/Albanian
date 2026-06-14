import React, { useState, useEffect } from 'react';
import { AlBayanLexer, AlBayanParser } from '../services/parser';
import { AlBayanWasmCompiler } from '../services/wasm';
import { Cpu, Terminal, HelpCircle, ArrowRight, Share2, FileCode, CheckCircle, Lightbulb } from 'lucide-react';

interface BayanWasmVisualizerProps {
  code: string;
}

export const BayanWasmVisualizer: React.FC<BayanWasmVisualizerProps> = ({ code }) => {
  const [watCode, setWatCode] = useState<string>('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<{ code: string; explanation: string } | null>(null);

  useEffect(() => {
    try {
      setParseError(null);
      const lexer = new AlBayanLexer(code);
      const tokens = lexer.tokenize();
      const parser = new AlBayanParser(tokens);
      const ast = parser.parse();

      const compiler = new AlBayanWasmCompiler();
      const compiledWat = compiler.compile(ast);
      setWatCode(compiledWat);
    } catch (e: any) {
      setParseError(e.message || "فشل توليد تجميع الويب (WASM) الدلالي لعدم اكتمال القواعد النحوية.");
      setWatCode('');
    }
  }, [code]);

  const handleLineClick = (lineText: string) => {
    const trimmed = lineText.trim();
    if (!trimmed) return;

    let explanation = "تعليمة تجميع ويب (WAT) مخصصة ضمن تجميعة الكود المصدري للبروتوكول.";
    
    if (trimmed.startsWith("(module")) {
      explanation = "أمر استهلال تعريفي يبدأ به أي برنامج WebAssembly معياري لحصر الوحدات البرمجية.";
    } else if (trimmed.startsWith("(import")) {
      explanation = "استيراد دالة خارجية من البيئة المضيفة (Host Environment مثل JavaScript في المتصفح) لاستدعائها لاحقاً.";
    } else if (trimmed.startsWith("(func $main")) {
      explanation = "تعريف الدالة الرئيسية للبرنامج الحاضن وتصديرها بـ (export) لتصبح قابلة للتشغيل المباشر من المتصفح.";
    } else if (trimmed.startsWith("(local $")) {
      const match = trimmed.match(/\(local \$(\w+) i32\)/);
      const name = match ? match[1] : "محلي";
      explanation = `حجز مساحة ذاكرة تسجيلية آمنة (Register/Local Variable) للمتغير [${name}] من النوع الصحيح 32-بت (i32).`;
    } else if (trimmed.startsWith("i32.const")) {
      const match = trimmed.match(/i32\.const (\d+)/);
      const val = match ? match[1] : "قيمة";
      explanation = `دفع ثابت عددي مباشر قيمته (${val}) ووضعه على قمة مكدس المعاملات (Operand Stack).`;
    } else if (trimmed.startsWith("local.set $")) {
      const match = trimmed.match(/local\.set \$(\w+)/);
      const name = match ? match[1] : "المتغير";
      explanation = `سحب القيمة العلوية من قمة المكدس وتخزينها رسمياً في المتغير المحلي [${name}].`;
    } else if (trimmed.startsWith("local.get $")) {
      const match = trimmed.match(/local\.get \$(\w+)/);
      const name = match ? match[1] : "المتغير";
      explanation = `استرجاع قيمة المتغير المحلي [${name}] من خلية التخزين ووضعها فوق مكدس المعاملات من جديد لاستخدامها.`;
    } else if (trimmed === "i32.add") {
      explanation = "سحب آخر قيمتين من مكدس المعاملات، جمعهم ميكانيكياً بوحدة الحساب والمنطق (ALU)، ثم إرجاع النتيجة للمكدس.";
    } else if (trimmed === "i32.sub") {
      explanation = "طرح القيمة العلوية الثانية من الأولى (بعد سحبهم من المكدس) وإرجاع الناتج لقمة المكدس.";
    } else if (trimmed === "i32.mul") {
      explanation = "إجراء عملية ضرب ثنائي مباشر للقيم السفلية والعلوية للمكدس ووضع حاصل الضرب فوق قمة المكدس.";
    } else if (trimmed === "i32.div_s") {
      explanation = "القسمة الصحيحة بإشارة (Signed Division) لآخر قيمتين مسحوبتين مسبقاً.";
    } else if (trimmed.startsWith("call $print")) {
      explanation = "استدعاء دالة الطباعة الخارجية المعرّفة في التصدير لعرض القيمة العلوية المنقوشة على المكدس حالياً.";
    } else if (trimmed === "if") {
      explanation = "فحص القيمة المنطقية على قمة المكدس؛ إذا ثبت صحتها (ليست صفراً) يدخل المعالج لتنفيذ أوامر الشرط.";
    } else if (trimmed === "else") {
      explanation = "مسار النفي الاختياري (وإلا) الذي يعبره التوجيه في حال فشل شرط الـ if الأساسي.";
    } else if (trimmed === "end") {
      explanation = "محدد فني يوضح غلق وإتمام حلقة تكرار، تفريع شرطي، أو نهاية دالة تجميع ويب.";
    } else if (trimmed === "block") {
      explanation = "تعليق هيكلي لتهيئة حاوية قفز هروبي (Label Block) يتيح كسر الحلقات بأمان باستخدام أوامر br.";
    } else if (trimmed.startsWith("loop $")) {
      explanation = "تأسيس حلقة تكرار برمجية تدعم القفز المرتد المستمر لإعادة تشغيل الكتل بمرونة وتكامل سرعة أصيل.";
    } else if (trimmed.startsWith("br_if")) {
      explanation = "وثبة هروب مشروطة؛ إذا كانت قمة المكدس صحيحة يتم كسر نطاق الحلقة والخروج فوراً للغطاء التالي.";
    } else if (trimmed === "br 0") {
      explanation = "أمر قفز فوري غير مشروط لبداية حلقة التكرار (اللفة التالية) للمحافظة على انسياب دوران الحلقات.";
    }

    setSelectedLine({ code: trimmed, explanation });
  };

  const copyWasmToClipboard = () => {
    navigator.clipboard.writeText(watCode);
    alert("📋 تم نسخ شفرة الـ WebAssembly Text (WAT) للحافظة بنجاح!");
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full text-slate-200" dir="rtl">
      
      {/* Visualizer Header */}
      <div className="bg-gradient-to-l from-emerald-950/40 to-slate-900/40 border border-emerald-900/30 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="text-emerald-400 w-5 h-5 shrink-0 animate-pulse" />
            مترجم تجميع الويب والمحاكاة الأصلية (Al-Bayan WebAssembly Text Compiler - WAT)
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            الخطوة الرابعة المتقدمة في حوسبة لغة البيان. نقوم بتجميع الأكواد وتحليلها بنيوياً وصرفياً، ثم ترجمتها إلى تعليمات لغة آلة تجميع الويب القياسية (WASM) لتعمل على المتصفحات أو الخوادم محلياً بسرعة تقارب السرعة الأصلية لـ C++.
          </p>
        </div>
        <button
          onClick={copyWasmToClipboard}
          disabled={!watCode}
          className="text-xs bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold shrink-0 shadow-md"
        >
          <Share2 size={13} />
          نسخ الكود المجمّع 📋
        </button>
      </div>

      {parseError && (
        <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-right text-red-300 text-xs font-mono" dir="ltr">
          ⚠️ {parseError}
        </div>
      )}

      {watCode && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* WAT Interactive Editor Display */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2 shadow-inner">
            <h5 className="text-xs font-bold text-slate-300 border-b border-sidebar-border border-slate-800 pb-2 mb-2 flex justify-between">
              <span>شفرة الـ WebAssembly Text (WAT) الناتجة</span>
              <span className="text-[10px] text-emerald-400 font-mono">الارتفاع: {watCode.split('\n').length} أسطر</span>
            </h5>
            
            <p className="text-[10px] text-slate-400 leading-relaxed mb-1">
              💡 انقر على أي سطر أدناه لرؤية تفسير دلالي مفصل لما تقوم به الوحدة المعالجية بالخلفية!
            </p>

            <div className="flex-1 overflow-auto max-h-[380px] space-y-1 custom-scrollbar bg-black/45 p-3 rounded-lg border border-slate-950" dir="ltr">
              {watCode.split('\n').map((line, idx) => {
                const isSelected = selectedLine && selectedLine.code === line.trim().split(';;')[0].trim();
                if (!line.trim()) return null;
                const parts = line.split(';;');
                const instructionPart = parts[0];
                const commentPart = parts[1] ? `;; ${parts[1]}` : '';

                return (
                  <div
                    key={idx}
                    onClick={() => handleLineClick(instructionPart)}
                    className={`py-1 px-2 rounded font-mono text-xs cursor-pointer transition-all flex justify-between gap-4 border ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold translate-x-1'
                        : 'border-transparent text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <span>{instructionPart}</span>
                    <span className="text-emerald-600/85 text-[10px] select-none text-right font-sans shrink-0">{commentPart}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Translation Explainer Info-board */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Click diagnostics result details */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-md min-h-[170px]">
              <h5 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <Lightbulb size={14} className="text-emerald-400 animate-pulse" />
                تحليل المترجم الدلالي (Interactive WAT Explainer)
              </h5>

              {selectedLine ? (
                <div className="flex-grow flex flex-col gap-2.5 justify-center animate-fade-in text-right">
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-2 rounded-lg font-mono text-xs text-emerald-300 inline-block align-right">
                    {selectedLine.code}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ⚙️ <span className="font-bold text-white">الشرح:</span> {selectedLine.explanation}
                  </p>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-500 italic text-xs py-10 text-center gap-1">
                  <ArrowRight size={20} className="text-slate-600 rotate-90 lg:rotate-0 animate-bounce" />
                  انقر على أي سطر من شفرة WAT البرمجية للوصول للشرح الهندسي للتعليمة البرمجية المجمعة.
                </div>
              )}
            </div>

            {/* Direct compiler education guide */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-md flex-1">
              <h5 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <FileCode size={14} className="text-yellow-400" />
                هيكل تجميعة الويب (WebAssembly Blueprint Architecture)
              </h5>
              <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed text-right">
                <div className="flex gap-2 items-start">
                  <span className="bg-emerald-950 text-emerald-400 px-1 py-0.5 rounded font-bold font-mono text-[9px] mt-0.5">1</span>
                  <p className="text-[11px]">
                    <span className="font-bold text-slate-200">صيغة الملف (WAT):</span> السلسلة النصية المقروءة لـ WebAssembly، والتي تُترجم بنسبة 1:1 إلى الملفات الثنائية المدمجة <span className="font-mono text-emerald-400 font-bold">.wasm</span>.
                  </p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="bg-emerald-950 text-emerald-400 px-1 py-0.5 rounded font-bold font-mono text-[9px] mt-0.5">2</span>
                  <p className="text-[11px]">
                    <span className="font-bold text-slate-200">البيئة المضيفة:</span> يعمل الملف الناتج بمعدلات أمان قصوى وسرعة صاروخية معزولة داخل محرك الـ V8 للكروميوم أو خوادم الويب المتطورة.
                  </p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="bg-emerald-950 text-emerald-400 px-1 py-0.5 rounded font-bold font-mono text-[9px] mt-0.5">3</span>
                  <p className="text-[11px]">
                    <span className="font-bold text-slate-200">المطابقة المعيارية للبيّان:</span> يحول المترجم الهيكلي متغيراتك وسلسلة حلقاتك البرمجية لأوامر مكدسية صلبة وخالية تماماً من ثغرات الحقن أو تتبع المسارات.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {watCode === '' && !parseError && (
        <div className="bg-slate-900/40 p-10 rounded-2xl text-center border border-slate-800 flex flex-col items-center gap-1">
          <HelpCircle className="text-slate-600 w-12 h-12 mb-1" />
          <h5 className="text-sm font-bold text-slate-300">أدخل كود بيان برمجي سليم</h5>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            يرجى ملء المحرر بكود بيّان ليتم تحليله معجمياً وتشخيص أخطائه الدلالية ثم ترجمته مباشرةً إلى تجميع ويب (WASM) عالي الجودة والأداء.
          </p>
        </div>
      )}

    </div>
  );
};
