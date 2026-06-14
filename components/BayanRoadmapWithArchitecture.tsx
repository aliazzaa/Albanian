import React, { useState, useMemo } from 'react';
import { 
  Cpu, Terminal, Layers, Sparkles, Wand2, Info, ArrowRight,
  Code2, CheckCircle2, ChevronRight, HelpCircle, Activity, FileCode, AlertCircle, Play
} from 'lucide-react';
import bayanArchImage from '../src/assets/images/bayan_compiler_architecture_1781441747024.jpg';
import { AlBayanLexer, AlBayanParser } from '../services/parser';
import { AlBayanBytecodeCompiler } from '../services/vm';
import { AlBayanWasmCompiler } from '../services/wasm';
import { Token, TokenType, ASTNode } from '../types';

interface BayanRoadmapWithArchitectureProps {
  code: string;
}

export const BayanRoadmapWithArchitecture: React.FC<BayanRoadmapWithArchitectureProps> = ({ code }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);
  const [selectedInstructionIndex, setSelectedInstructionIndex] = useState<number | null>(null);

  // Compile and tokenize current editor code reactively
  const pipelineData = useMemo(() => {
    let tokens: Token[] = [];
    let ast: ASTNode | null = null;
    let bytecode: any[] = [];
    let wasm: string = "";
    let error: string | null = null;
    let errorLine: number | null = null;

    try {
      // 1. Lexical breakdown
      const lexer = new AlBayanLexer(code);
      tokens = lexer.tokenize();

      // 2. Syntactic parsing
      const parser = new AlBayanParser(tokens);
      ast = parser.parse();

      // 3. VM Bytecode Compilation
      const bcCompiler = new AlBayanBytecodeCompiler();
      bytecode = bcCompiler.compile(ast);

      // 4. WASM compilation
      const wasmCompiler = new AlBayanWasmCompiler();
      wasm = wasmCompiler.compile(ast);
    } catch (e: any) {
      error = e.message || "خطأ غير معروف في صيانة الكومبايلر";
      // Try to extract line number
      const match = e.message?.match(/السطر\s+(\d+)/) || e.message?.match(/line\s+(\d+)/);
      if (match) {
        errorLine = parseInt(match[1]);
      }
    }

    return { tokens, ast, bytecode, wasm, error, errorLine };
  }, [code]);

  // Helper to describe token definitions in Arabic
  const getTokenDescription = (type: TokenType, value: string): string => {
    switch (type) {
      case TokenType.VAR:
        return `كلمة مفتاحية رسمية لحجز عنوان للمتغير [${value}] بالذاكرة المحلية لبرنامج البيان.`;
      case TokenType.PRINT:
        return "تعليمة الإخراج الرسمية لطرح القيم المتواجدة على المكدس للخارج.";
      case TokenType.IF:
        return "توجيه شرطي (لو / اذا) لإشعال مسار تنفيذ منطقي مشروط بقيم الصواب والنفي.";
      case TokenType.ELSE:
        return "تابع التوجيه الشرطي (وإلا) للتعبير عن مسار النفي البديل للشرط في حال عدم تحققه.";
      case TokenType.FOR:
        return "الإدارة التكرارية المنظمة لزيارة تسلسلات المجالات والفترات العددية النشطة.";
      case TokenType.IN:
        return "رابط الانتماء لتوصيل معرج الدورة بهيكل حوض السجلات.";
      case TokenType.RANGE:
        return "مولد النطاقات لتأطير مجالات البداية والنهاية لحلقات الدوران الفوقي.";
      case TokenType.REPEAT:
        return "حلقة التكرار السريعة لتشغيل كتل الأوامر عدداً محدداً من المرات البديهية.";
      case TokenType.TIMES:
        return "مميّز عددي مخصص لتحديد قفزات حلقات التكرار.";
      case TokenType.FUNC:
        return "أمر إعلان الدالة لتجميع شفرات وظيفية مستقلة قابلة للاستدعاء المستمر.";
      case TokenType.END:
        return "الحصار النحوي القياسي الذي يعلن انتهاء نفوذ جملة معينة (لو، كرر، لكل، مهمة).";
      case TokenType.IDENTIFIER:
        return `معرّف مرسوم مخصص يشير إلى متغير باسم [${value}] أو مهمة مكتشفة.`;
      case TokenType.NUMBER:
        return `ثابت رقمي صحيح تم التعرف دلالته وتوحيد لغته لـ [${value}] لحشره بسجل الثوابت.`;
      case TokenType.STRING:
        return `ثابت نصي معزول بالرمز [${value}] ممثل بالذاكرة السلسة التراكمية.`;
      case TokenType.ASSIGN:
        return "عملية الإسناد المائي لحشو السجل بالرقم أو القيمة الفورية الناتجة.";
      case TokenType.PLUS:
        return "شعار الإضافة الحسابية (+) لتمرير معاملات التجميع المعيارية لمعالج الآلة.";
      case TokenType.MINUS:
        return "عملية الطرح الحسابي (-) لإنقاص المتغيرات عبر وحدة الحساب والمنطق.";
      case TokenType.MULTIPLY:
        return "عملية الضرب الحسابي (*) لإنجاز مضاعفة القيم الحيوية للبيانات.";
      case TokenType.DIVIDE:
        return "عملية القسمة الحسابية (/) لتفتيت القيم الثنائية.";
      case TokenType.EQ:
        return "عامل المطابقة المنطقي المزدوج (==) للتحقق الدقيق من المساواة الفقهية للأرقام.";
      case TokenType.NEQ:
        return "عامل الاختلاف المنطقي (!=) للتحقق من عدم تساوي القيم المتقابلة.";
      case TokenType.LT:
        return "مقارن الأصغرية (<)؛ يرجع صحيحاً في مكدس الآلة إذا تفوق الأيسر بالقيمة.";
      case TokenType.GT:
        return "مقارن الأكبرية (>)؛ يرجع صحيحاً إذا تفوق المعامل الأيمن المنقوش.";
      case TokenType.NEWLINE:
        return "الأمر الفاصل للمسطرة بنهاية السطر الحالي لإتمام معالجة العبارة الحالية.";
      default:
        return `رمز بريد دلالي من صنف [${type}] بمسودة الكومبايلر للغة البيان.`;
    }
  };

  const steps = [
    {
      title: "العرض الشامل ومخطط المعمارية للغتنا العربية",
      badge: "الهيكل العام 📐",
      colorClass: "from-indigo-600 to-slate-910 border-indigo-500/30",
      icon: <Wand2 className="text-indigo-400 w-5 h-5 shrink-0" />,
      description: "الهندسة المعمارية الكاملة التي تعتمد عليها لغة البيان لربط الشفرة العربية بجميع لغات الآلة بنسبة توافق وأمان فائقة السرعة.",
      details: (
        <div className="space-y-5">
          {/* Live pipeline compilation stats card */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-950/70 border border-indigo-900/40 p-3 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 font-bold mb-1">حجم الكود المصدري</div>
              <div className="text-sm font-mono text-indigo-400 font-bold">{code.length} حرف</div>
            </div>
            <div className="bg-slate-950/70 border border-indigo-900/40 p-3 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 font-bold mb-1">الرموز المفروزة (Tokens)</div>
              <div className="text-sm font-mono text-emerald-400 font-bold">{pipelineData.tokens.length} رمز</div>
            </div>
            <div className="bg-slate-950/70 border border-indigo-900/40 p-3 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 font-bold mb-1">شجرة الإعراب (AST)</div>
              <div className="text-sm font-mono text-amber-400 font-bold">
                {pipelineData.error ? "⚠️ معطلة" : "سليمة وجاهزة"}
              </div>
            </div>
            <div className="bg-slate-950/70 border border-indigo-900/40 p-3 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 font-bold mb-1">تعليمات الـ VM</div>
              <div className="text-sm font-mono text-cyan-400 font-bold">{pipelineData.bytecode.length} تعليمة</div>
            </div>
            <div className="bg-slate-950/70 border border-indigo-900/40 p-3 rounded-xl text-center col-span-2 md:col-span-1">
              <div className="text-[10px] text-slate-400 font-bold mb-1">سطور الـ WASM</div>
              <div className="text-sm font-mono text-purple-400 font-bold">
                {pipelineData.error ? "0" : pipelineData.wasm.split('\n').filter(Boolean).length} أسطر
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-xl border border-indigo-900/40 bg-black/50 p-2 shadow-2xl">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <img 
              src={bayanArchImage} 
              alt="Al-Bayan Compiler Architecture Flowchart" 
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-lg object-cover max-h-[350px] shadow-lg transition-transform duration-500 group-hover:scale-[1.01]" 
            />
            <div className="absolute bottom-3 right-3 bg-slate-950/80 px-2.5 py-1 rounded text-[10px] text-indigo-300 font-mono border border-indigo-800">
              مخطط المعمارية الشامل والمولّد بواسطة الكومبايلر الحالي 🌟
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/65 border border-indigo-950 p-4 rounded-xl">
              <h5 className="text-indigo-400 font-bold text-xs mb-1.5 flex items-center gap-1">
                <Info size={14} />
                فلسفة البناء بالبايت كود المباشر
              </h5>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                بدلاً من استبدال الشفرات النصي البسيط والذي يتعرض دائماً لمشاكل التداخل النحوي مع متغيرات المستخدم، يتولى المجمع معالجة حروف البيان وتحويلها إلى قيم رمزية (Tokens)، ثم ترتيبها كبنية شجرية كاملة (AST) تُترجم بكفاءة إلى رزم بايت كود وتتكامل مع المعايير المعمارية للويب.
              </p>
            </div>
            <div className="bg-slate-900/65 border border-indigo-950 p-4 rounded-xl">
              <h5 className="text-emerald-400 font-bold text-xs mb-1.5 flex items-center gap-1">
                <CheckCircle2 size={14} />
                أداء الوجود الاستثنائي لبيئة الـ AST
              </h5>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                تمكّن شجرة الإعراب النحوي البيّان من تحليل الدلالات (Semantics)، وإصلاح المسارات التالفة، واكتشاف المتغيرات غير المعرفة بدقة، وتوليد كود خفيف الحجم جداً لا يؤثر على الأجهزة الضعيفة مثل سيارات أندرويد الذكية وأنظمة الهواتف المدمجة.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "المحلل اللغوي المعجمي (Lexical Tokenizer)",
      badge: "الخطوة الأولى 🟢",
      colorClass: "from-emerald-700 to-slate-910 border-emerald-500/30",
      icon: <Terminal className="text-emerald-400 w-5 h-5 shrink-0" />,
      description: "المحطة الأولى لقراءة حروف مدخل كود البيان وفصلها وتحويلها إلى تجمعات معنوية ورموز مفرزة تسمى Tokens.",
      details: (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <h5 className="text-emerald-400 font-bold text-xs border-b border-slate-800/85 pb-2 flex justify-between items-center">
              <span>الرموز المفروزة ديناميكياً من شفرتك الحالية (Live Interactive Tokens)</span>
              <span className="text-[10px] text-slate-400 font-mono">اضغط على أي رمز بالأسفل لاختبار المفسر</span>
            </h5>
            
            {pipelineData.tokens.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-auto p-2 border border-slate-950 bg-black/30 rounded-lg custom-scrollbar" dir="rtl">
                {pipelineData.tokens.map((token, idx) => {
                  const isSelected = selectedTokenIndex === idx;
                  let colorClass = "bg-slate-900 border-slate-800 text-slate-300";
                  if (token.type === TokenType.VAR || token.type === TokenType.FUNC || token.type === TokenType.IF || token.type === TokenType.ELSE || token.type === TokenType.FOR || token.type === TokenType.REPEAT) {
                    colorClass = "bg-purple-950/40 border-purple-900 text-purple-300";
                  } else if (token.type === TokenType.IDENTIFIER) {
                    colorClass = "bg-blue-950/40 border-blue-900 text-blue-300";
                  } else if (token.type === TokenType.NUMBER || token.type === TokenType.STRING) {
                    colorClass = "bg-amber-950/40 border-amber-900 text-amber-300";
                  } else if (token.type === TokenType.ASSIGN || token.type === TokenType.PRINT) {
                    colorClass = "bg-emerald-950/40 border-emerald-900 text-emerald-300";
                  }
                  
                  if (token.type === TokenType.NEWLINE) return null; // Newline is technical

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedTokenIndex(idx)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all flex items-center gap-1 cursor-pointer select-none font-bold ${colorClass} ${
                        isSelected ? 'ring-2 ring-emerald-400 scale-[1.05] border-transparent shadow shadow-emerald-950' : 'hover:opacity-80'
                      }`}
                    >
                      <span className="text-[9px] opacity-60 font-sans">[{token.type}]</span>
                      <span>{token.value === '\n' ? 'سطر جديد' : token.value}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-5">لا توجد رموز مع معالجة المصدر الحالي.</p>
            )}

            {/* Interactive Token Explainer Board */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-900 min-h-[75px] flex items-center justify-center">
              {selectedTokenIndex !== null && pipelineData.tokens[selectedTokenIndex] ? (
                <div className="w-full text-right animate-fade-in space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900/30">
                      الصنف: {pipelineData.tokens[selectedTokenIndex].type}
                    </span>
                    <span className="text-[10px] text-slate-500">السطر: {pipelineData.tokens[selectedTokenIndex].line}</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1">
                    🎯 <span className="font-bold text-white">الرمز المصدري:</span> <code className="bg-slate-800 text-amber-300 px-1.5 rounded font-mono font-bold">"{pipelineData.tokens[selectedTokenIndex].value}"</code>
                  </p>
                  <p className="text-[11px] text-slate-300">
                    ℹ️ <span className="font-bold text-slate-100">التفسير المعجمي:</span> {getTokenDescription(pipelineData.tokens[selectedTokenIndex].type, pipelineData.tokens[selectedTokenIndex].value)}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic text-center">
                  💡 انقر على أي معجم رمزي مفروز بالأعلى للحصول على تفسيره العلمي وموقعه دلالياً بمصفوفة اللغات.
                </p>
              )}
            </div>

          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-900">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-400 font-mono">Conceptual TypeScript Implementation (AlBayanLexer):</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300">Lexer Shell</span>
            </div>
            <pre className="text-[10px] text-slate-300 font-mono text-left overflow-x-auto" dir="ltr">
{`class AlBayanLexer {
  tokenize(code: string) {
    const tokens = [];
    let current = 0;
    while (current < code.length) {
      let char = code[current];
      if (char === ' ') { current++; continue; }
      if (/[0-9]/.test(char)) {
        let value = '';
        while (/[0-9]/.test(char)) { value += char; char = code[++current]; }
        tokens.push({ type: 'Number', value: parseInt(value) });
        continue;
      }
      // ... معالجة المعرفات العربية كـ "عرف"، "مهمة"، "لو"، "كرر"
    }
    return tokens;
  }
}`}
            </pre>
          </div>
        </div>
      )
    },
    {
      title: "المفسر الإعرابي وشجرة الإعراب (AST Parser Stage)",
      badge: "الخطوة الثانية 🔄",
      colorClass: "from-amber-700 to-slate-910 border-amber-500/30",
      icon: <Layers className="text-amber-400 w-5 h-5 shrink-0" />,
      description: "المسؤول عن أخذ قائمة الرموز من المفعل الأول ورسم الهيكلية الشجرية التي تسرد العلاقات النحوية لأوامرك.",
      details: (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <h5 className="font-bold text-xs border-b border-slate-800/80 pb-2 text-amber-400 flex items-center justify-between">
              <span>شجرة الإعراب الناتجة من الكود البرمجي (Abstract Syntax Tree)</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-900/40">تحديث فوري ⚡</span>
            </h5>
            
            {pipelineData.error ? (
              <div className="bg-red-950/30 border border-red-900/40 p-4 rounded-xl flex items-start gap-2 text-right">
                <AlertCircle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h6 className="text-xs font-bold text-red-300">عثر الكومبايلر على خطأ إملائي أو نحوي في شفرتك:</h6>
                  <p className="text-[11px] text-red-400 mt-1 leading-relaxed">{pipelineData.error}</p>
                </div>
              </div>
            ) : pipelineData.ast ? (
              <div className="text-right">
                <p className="text-[11px] text-slate-300 mb-2">
                  يقوم المكبس الإعرابي ببناء مجالات العقد الهرمية. إليك هيكل شجرة الإعراب الحقيقية المولدة لـ <span className="font-mono text-amber-400">{pipelineData.ast.type}</span>:
                </p>
                <div className="bg-black/45 p-3 rounded-lg border border-slate-950 max-h-[160px] overflow-auto custom-scrollbar text-left font-mono text-[10px]" dir="ltr">
                  <pre className="text-amber-200">
                    {JSON.stringify(pipelineData.ast, null, 2)}
                  </pre>
                </div>
              </div>
            ) : null}
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-900">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-400 font-mono">Syntactic Rule Matching (Recursive Descent):</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">AST Node Shell</span>
            </div>
            <pre className="text-[10px] text-amber-200 font-mono text-left overflow-x-auto" dir="ltr">
{`interface ASTNode {
  type: string;          // مثل Program, VariableDeclaration, BinaryExpression
  line: number;          // تتبع خطأ السطر البرمجي
  [key: string]: any;    // عقد فرعية مثل left, right, name, value, body
}`}
            </pre>
          </div>
        </div>
      )
    },
    {
      title: "شريط تعليمات البايت كود ومحاكي الآلة (Al-Bayan VM)",
      badge: "الخطوة الثالثة ⚡",
      colorClass: "from-cyan-700 to-slate-910 border-cyan-500/30",
      icon: <Cpu className="text-cyan-400 w-5 h-5 shrink-0" />,
      description: "تحويل العقد الهيكلية لشجرة AST لتعليمات آلية مدمجة وسريعة تعمل حياً ومباشرة على نموذج الذاكرة والمسجل لنموذج البيان.",
      details: (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <h5 className="text-cyan-400 font-bold text-xs border-b border-slate-800/80 pb-2 flex justify-between items-center">
              <span>شريط تعليمات البايت كود الفعلي المولد (Intermediary Representation - IR)</span>
              <span className="text-[10px] text-slate-400 font-mono">اضغط على أي رماز للمعاينة</span>
            </h5>
            
            {pipelineData.error ? (
              <p className="text-xs text-slate-400 italic text-center py-4">الرجاء إصلاح الشفرة المعجمية ليتم تجميع البايت كود.</p>
            ) : pipelineData.bytecode.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 text-right">
                
                {/* Micro instructions list renderer */}
                <div className="bg-black/35 border border-slate-950 p-2 rounded-lg max-h-[140px] overflow-auto custom-scrollbar space-y-1.5" dir="ltr">
                  {pipelineData.bytecode.map((instr, idx) => {
                    const isSelected = selectedInstructionIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedInstructionIndex(idx)}
                        className={`text-[10.5px] font-mono p-1 px-2 rounded cursor-pointer border flex justify-between transition-all ${
                          isSelected 
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold scale-[1.01]' 
                            : 'bg-slate-900/40 border-transparent text-slate-300 hover:bg-slate-800/45'
                        }`}
                      >
                        <span className="text-emerald-400/90 font-sans">#{idx}</span>
                        <span>{instr.op} {instr.arg !== undefined ? `[${instr.arg}]` : ""}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Micro Explainer panel */}
                <div className="bg-slate-950/90 border border-slate-900 p-3 rounded-lg flex flex-col justify-center">
                  {selectedInstructionIndex !== null && pipelineData.bytecode[selectedInstructionIndex] ? (
                    <div className="animate-fade-in space-y-1">
                      <div className="text-[9px] text-slate-500 font-mono">عنوان الأمر: Instruction Index #{selectedInstructionIndex}</div>
                      <div className="text-xs font-bold text-cyan-400 font-mono">{pipelineData.bytecode[selectedInstructionIndex].op}</div>
                      <p className="text-[11px] text-slate-200 leading-relaxed mt-1">
                        🎯 <span className="font-bold">ميكانيكية الأمر:</span> {pipelineData.bytecode[selectedInstructionIndex].description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic text-center">
                      💡 انقر على أي رماز بايت كود على اليسار للغوص خلف كتل الذاكرة وتفصيل دلالات المعالجة المشتركة.
                    </p>
                  )}
                </div>

              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-4">البرنامج خالٍ من عناصر توليد البايت كود.</p>
            )}
          </div>
        </div>
      )
    },
    {
      title: "التجميع المباشر لكود المترجم (WebAssembly - WAT)",
      badge: "الخطوة الرابعة 🚀",
      colorClass: "from-emerald-800 to-slate-910 border-emerald-500/30",
      icon: <Sparkles className="text-emerald-400 w-5 h-5 shrink-0" />,
      description: "تصدير فوري لكود تجميع الويب القياسي ليعمل على المتصفحات أو السحابة مباشرة لسرعة تحاكي التطبيقات الأصلية.",
      details: (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <h5 className="text-emerald-400 font-bold text-xs border-b border-slate-800/85 pb-2 flex justify-between items-center font-sans">
              <span>تعليمات تجميع الويب (WAT) المولدة لكودك المظلي</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">رسمية ومعيارية 1:1</span>
            </h5>
            
            {pipelineData.error ? (
              <p className="text-xs text-slate-400 italic text-center py-4">الرجاء تصحيح أخطاء الكوبيلر المذكورة ليتمكن من معالجة تجميع الويب.</p>
            ) : pipelineData.wasm ? (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  يتحول كود البيان بالكامل إلى مسار تعليمات مكدسية صلبة <span className="font-mono text-emerald-300">WAT</span> خالية من الانهيارات والتجسير:
                </p>
                <div className="bg-black/55 p-3 rounded-lg border border-slate-950 max-h-[140px] overflow-auto custom-scrollbar text-left font-mono text-[10.5px]" dir="ltr">
                  <pre className="text-emerald-300">
                    {pipelineData.wasm}
                  </pre>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )
    }
  ];

  const current = steps[activeStep];

  return (
    <div className="space-y-5 text-right font-sans" dir="rtl">
      
      {/* Visual Header */}
      <div className="bg-gradient-to-l from-indigo-950/40 to-slate-900/40 border border-indigo-900/30 p-4 rounded-xl flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Code2 className="text-indigo-400 w-5 h-5 shrink-0 animate-pulse" />
            مرجل كومبايلر البيان ولغات الآلة بالتفصيل (Al-Bayan Deep Pipeline Explorer)
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            المنصة الحية والتفاعلية الأقوى لتفكيك شفراتك في محرر البيان وتحليلها بالصور والإحصائيات والرموز المعجمية الفورية في نفس اللحظة!
          </p>
        </div>
      </div>

      {/* Steps Navigation Array bar */}
      <div className="flex flex-wrap gap-2.5">
        {steps.map((s, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-right transition-all font-bold text-xs ${
              activeStep === index 
                ? 'bg-slate-800 border-slate-700 text-white shadow-md shadow-slate-950 scale-[1.02]' 
                : 'bg-slate-950/60 border-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono ${
              activeStep === index ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/40' : 'bg-slate-900 text-slate-500'
            }`}>
              {s.badge}
            </span>
            <span className="truncate">{s.title.split(' (')[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Container details */}
      <div className={`bg-gradient-to-b ${current.colorClass} border p-5 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in`}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/40 shadow">
              {current.icon}
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{current.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{current.description}</p>
            </div>
          </div>
        </div>

        {/* Dynamic details render body */}
        <div className="flex-1">
          {current.details}
        </div>
      </div>

    </div>
  );
};
