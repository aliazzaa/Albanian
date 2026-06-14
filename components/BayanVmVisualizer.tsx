import React, { useState, useEffect } from 'react';
import { AlBayanLexer, AlBayanParser } from '../services/parser';
import { AlBayanBytecodeCompiler, BytecodeInstruction } from '../services/vm';
import { Play, RotateCcw, ArrowRight, Layers, Cpu, Square, PlayCircle, HelpCircle } from 'lucide-react';

interface BayanVmVisualizerProps {
  code: string;
}

export const BayanVmVisualizer: React.FC<BayanVmVisualizerProps> = ({ code }) => {
  const [instructions, setInstructions] = useState<BytecodeInstruction[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stack, setStack] = useState<any[]>([]);
  const [memory, setMemory] = useState<Record<string, any>>({});
  const [vmLogs, setVmLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Auto-compile the user's code on load/change
  useEffect(() => {
    recompile();
  }, [code]);

  const recompile = () => {
    try {
      setParseError(null);
      const lexer = new AlBayanLexer(code);
      const tokens = lexer.tokenize();
      const parser = new AlBayanParser(tokens);
      const ast = parser.parse();

      const compiler = new AlBayanBytecodeCompiler();
      const compiledInsts = compiler.compile(ast);
      setInstructions(compiledInsts);
      resetVM();
    } catch (e: any) {
      setParseError(e.message || "فشل تحليل شفرة الكود برمجياً");
      setInstructions([]);
    }
  };

  const resetVM = () => {
    setCurrentStep(0);
    setStack([]);
    setMemory({});
    setVmLogs(["🤖 تم تصفير الآلة الافتراضية وجهاز التوقيت وجاهز للخطو المباشر."]);
    setIsCompleted(false);
  };

  const stepForward = () => {
    if (instructions.length === 0 || currentStep >= instructions.length) {
      setIsCompleted(true);
      return;
    }

    const inst = instructions[currentStep];
    let nextStep = currentStep + 1;
    let nextStack = [...stack];
    let nextMemory = { ...memory };
    let nextLogs = [...vmLogs];

    switch (inst.op) {
      case "DECLARE_VAR":
        if (!(inst.arg in nextMemory)) {
          nextMemory[inst.arg] = 0;
        }
        nextLogs.push(`📥 [إنشاء]: حجز حجرة للمتغير [${inst.arg}] في الذاكرة.`);
        break;

      case "LOAD_CONST":
        nextStack.push(inst.arg);
        nextLogs.push(`🔋 [المكدس]: سحب الثابت (${typeof inst.arg === 'string' ? `"${inst.arg}"` : inst.arg}) وشحنه بالقاع.`);
        break;

      case "STORE_VAR": {
        if (nextStack.length === 0) {
          nextLogs.push(`⚠️ خطأ في التخزين: مكدس العمليات فارغ!`);
          break;
        }
        const val = nextStack.pop();
        nextMemory[inst.arg] = val;
        nextLogs.push(`💾 [تخزين]: سحب قمة المكدس لبلع القيمة [${val}] بالمتغير [${inst.arg}].`);
        break;
      }

      case "LOAD_VAR": {
        const val = nextMemory[inst.arg];
        const valToPush = val !== undefined ? val : 0;
        nextStack.push(valToPush);
        nextLogs.push(`🔌 [تحميل]: جلب المتغير [${inst.arg}] وقيمته (${valToPush}) لقمة المكدس.`);
        break;
      }

      case "BINARY_OP": {
        if (nextStack.length < 2) {
          nextLogs.push(`⚠️ خطأ حسابي: المعاملات في المكدس غير كافية لمهمة الحساب!`);
          break;
        }
        const right = nextStack.pop();
        const left = nextStack.pop();
        let result: any = 0;

        switch (inst.arg) {
          case "+": result = left + right; break;
          case "-": result = left - right; break;
          case "*": result = left * right; break;
          case "/": result = right !== 0 ? left / right : 0; break;
          case "==": result = left == right; break;
          case "!=": result = left != right; break;
          case "<": result = left < right; break;
          case ">": result = left > right; break;
          case "<=": result = left <= right; break;
          case ">=": result = left >= right; break;
        }
        nextStack.push(result);
        nextLogs.push(`🧮 [حساب]: فك مكدس (${left}، ${right}) وإجراء عملية (${inst.arg}) -> النتيجة: ${result}.`);
        break;
      }

      case "PRINT": {
        if (nextStack.length === 0) {
          nextLogs.push(`⚠️ خطأ بالطباعة: لا يوجد قيمة بالمكدس للطباعة.`);
          break;
        }
        const val = nextStack.pop();
        nextLogs.push(`💻 [مخرج الشاشة]: ${val}`);
        break;
      }

      case "JUMP":
        nextStep = inst.arg;
        nextLogs.push(`🦘 [وثب]: قفز فوري غير مشروط للتعليمة #${inst.arg}.`);
        break;

      case "JUMP_IF_FALSE": {
        if (nextStack.length === 0) {
          nextLogs.push(`⚠️ خطأ: الشرط غير متواجد بالمكدس!`);
          break;
        }
        const val = nextStack.pop();
        if (!val) {
          nextStep = inst.arg;
          nextLogs.push(`🦘 [وثب مشروط]: قفز للعنوان #${inst.arg} لأن الشرط غير متحقق (خطأ).`);
        } else {
          nextLogs.push(`➡️ [استمر]: استقرار المسار وتسلسل للخطوة التالية لثبوت مطابقة الشرط.`);
        }
        break;
      }

      case "CALL_SYS": {
        const callInfo = inst.arg as { name: string; argCount: number };
        const args: any[] = [];
        for (let i = 0; i < callInfo.argCount; i++) {
          if (nextStack.length > 0) {
            args.unshift(nextStack.pop());
          }
        }
        nextLogs.push(`⚙️ [دالة نظام]: تشغيل الغلاف النواتي (${callInfo.name}) بالمعاملات: [${args.join(", ")}]`);
        nextStack.push("موافق");
        break;
      }
    }

    setStack(nextStack);
    setMemory(nextMemory);
    setVmLogs(nextLogs);
    setCurrentStep(nextStep);

    if (nextStep >= instructions.length) {
      setIsCompleted(true);
      nextLogs.push("🏁 تم إنجاز جميع العمليات بالكامل! بلغت الآلة الافتراضية السقف النهائي.");
      setVmLogs(nextLogs);
    }
  };

  const runAll = () => {
    if (instructions.length === 0) return;
    
    let tempStep = currentStep;
    let tempStack = [...stack];
    let tempMemory = { ...memory };
    let tempLogs = [...vmLogs];
    let safetyCounter = 0;

    tempLogs.push("🏃 جاري تشغيل كافة سلسلة تعليمات البايت كود المتبقية بسرعة قصوى...");

    while (tempStep < instructions.length && safetyCounter < 500) {
      const inst = instructions[tempStep];
      let nextStep = tempStep + 1;

      switch (inst.op) {
        case "DECLARE_VAR":
          if (!(inst.arg in tempMemory)) {
            tempMemory[inst.arg] = 0;
          }
          break;
        case "LOAD_CONST":
          tempStack.push(inst.arg);
          break;
        case "STORE_VAR": {
          const val = tempStack.pop();
          tempMemory[inst.arg] = val;
          break;
        }
        case "LOAD_VAR": {
          const val = tempMemory[inst.arg];
          tempStack.push(val !== undefined ? val : 0);
          break;
        }
        case "BINARY_OP": {
          const right = tempStack.pop();
          const left = tempStack.pop();
          let result: any = 0;
          switch (inst.arg) {
            case "+": result = left + right; break;
            case "-": result = left - right; break;
            case "*": result = left * right; break;
            case "/": result = right !== 0 ? left / right : 0; break;
            case "==": result = left == right; break;
            case "!=": result = left != right; break;
            case "<": result = left < right; break;
            case ">": result = left > right; break;
            case "<=": result = left <= right; break;
            case ">=": result = left >= right; break;
          }
          tempStack.push(result);
          break;
        }
        case "PRINT": {
          const val = tempStack.pop();
          tempLogs.push(`💻 [مخرج الشاشة]: ${val}`);
          break;
        }
        case "JUMP":
          nextStep = inst.arg;
          break;
        case "JUMP_IF_FALSE": {
          const val = tempStack.pop();
          if (!val) nextStep = inst.arg;
          break;
        }
        case "CALL_SYS": {
          const callInfo = inst.arg as { name: string; argCount: number };
          const args: any[] = [];
          for (let i = 0; i < callInfo.argCount; i++) {
            args.unshift(tempStack.pop());
          }
          tempLogs.push(`⚙️ [دالة نظام]: تشغيل (${callInfo.name}) بالمعاملات: [${args.join(", ")}]`);
          tempStack.push("موافق");
          break;
        }
      }

      tempStep = nextStep;
      safetyCounter++;
    }

    setStack(tempStack);
    setMemory(tempMemory);
    setVmLogs(tempLogs);
    setCurrentStep(tempStep);
    setIsCompleted(true);
    tempLogs.push("🏁 تم الانتهاء بنجاح من كافة الأكواد.");
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full text-slate-200" dir="rtl">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-l from-indigo-950/40 to-slate-900/40 border border-indigo-900/30 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="text-cyan-400 w-5 h-5 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
            الآلة الافتراضية ومولد البايت كود (Al-Bayan VM & Bytecode Interpter)
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            الخطوة الثالثة من خارطة طريق "البيّان". نقوم بتحويل شجرة AST مباشرة إلى بايت كود مخصص (Bayan Bytecode instructions) يحاكي مكدسات المعالجة وسجلات الذاكرة والرمز الوظيفي بلغة الآلة.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={stepForward}
            disabled={isCompleted || instructions.length === 0}
            className="text-xs bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold"
          >
            <ArrowRight size={14} />
            خطوة للأمام ▶️
          </button>
          <button
            onClick={runAll}
            disabled={isCompleted || instructions.length === 0}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold"
          >
            <Play size={12} fill="currentColor" />
            تشغيل الكل 🏃
          </button>
          <button
            onClick={resetVM}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
          >
            <RotateCcw size={12} />
            إعادة تصفير 🔄
          </button>
        </div>
      </div>

      {parseError && (
        <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-right text-red-300 text-xs font-mono" dir="ltr">
          ⚠️ {parseError}
        </div>
      )}

      {instructions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Instructions Pipeline Block */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-h-[300px]">
            <h5 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 mb-1 flex justify-between">
              <span>أوامر الـ Bytecode المولدة</span>
              <span className="text-[10px] text-cyan-400 font-mono">طول الشريط: {instructions.length}</span>
            </h5>
            <div className="flex-1 overflow-auto max-h-[360px] space-y-1.5 custom-scrollbar pr-1">
              {instructions.map((inst, idx) => {
                const isCurrent = currentStep === idx;
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded border text-right transition-all flex justify-between gap-2 text-xs font-mono group relative ${
                      isCurrent
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow shadow-cyan-950 scale-102 font-bold'
                        : idx < currentStep
                        ? 'bg-slate-950/45 border-slate-950 text-slate-500 line-through'
                        : 'bg-slate-950 border-slate-900 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-bold ${isCurrent ? 'text-cyan-400' : 'text-slate-500'}`}>
                        [{String(idx).padStart(2, '0')}]
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100">{inst.op} {inst.arg !== undefined ? `(${String(inst.arg)})` : ''}</span>
                        <span className="text-[9px] text-slate-400 group-hover:text-slate-300 transition-colors">{inst.description}</span>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Virtual Stack & Memory Block */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            
            {/* Virtual Stack (Operands) */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex-1 flex flex-col gap-2 min-h-[170px]">
              <h5 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Layers size={13} className="text-cyan-400" />
                  مكدس المتغيرات والعمليات (Evaluation Stack)
                </span>
                <span className="text-[10px] bg-slate-800 px-1.5 rounded font-mono text-cyan-400">{stack.length} عناصر</span>
              </h5>
              <div className="flex-1 overflow-auto max-h-[150px] flex flex-col-reverse gap-1.5 p-1 justify-end">
                {stack.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-l from-slate-955 to-slate-950 border border-slate-850 px-2.5 py-1.5 rounded-lg flex justify-between items-center text-xs font-mono animate-scale-up"
                  >
                    <span className="text-cyan-400 font-bold">القمة 🔝</span>
                    <span className="text-[#38bdf8] truncate font-bold">{JSON.stringify(item)}</span>
                    <span className="text-slate-600">[{idx}]</span>
                  </div>
                ))}
                {stack.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic text-xs py-4">
                    المكدس فارغ حالياً (لا يوجد مدخلات)
                  </div>
                )}
              </div>
            </div>

            {/* Virtual Variables Memory */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex-1 flex flex-col gap-2 min-h-[170px]">
              <h5 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 flex justify-between items-center">
                <span>سجلات الذاكرة (Static Registers / Scope)</span>
                <span className="text-[10px] bg-slate-800 px-1.5 rounded font-mono text-cyan-400">{Object.keys(memory).length} معرّف</span>
              </h5>
              <div className="flex-1 overflow-auto max-h-[150px] space-y-1.5 p-1">
                {Object.keys(memory).map((key) => (
                  <div
                    key={key}
                    className="bg-slate-950 border border-slate-850 px-2.5 py-1.5 rounded-lg flex justify-between items-center text-xs font-mono"
                  >
                    <span className="text-amber-400 font-bold">{key}</span>
                    <span className="text-slate-100 font-bold truncate max-w-[130px]">{JSON.stringify(memory[key])}</span>
                  </div>
                ))}
                {Object.keys(memory).length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic text-xs py-4">
                    لم يتم إدراج متغيرات بالذاكرة بعد
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Virtual execution logs / logs Terminal Block */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-h-[300px]">
            <h5 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 mb-1">
              سجل معالجة وحدة الـ CPU ومخرجات الشاشة (Console Output Logs)
            </h5>
            <div className="flex-1 bg-black/60 rounded-lg p-2.5 overflow-auto max-h-[360px] space-y-1.5 custom-scrollbar text-xs font-mono text-slate-300" dir="ltr">
              {vmLogs.map((log, idx) => (
                <div key={idx} className="border-b border-slate-950 pb-1 text-left whitespace-pre-wrap leading-relaxed break-words">
                  <span className="text-cyan-500 mr-1.5 select-none">&gt;&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {instructions.length === 0 && !parseError && (
        <div className="bg-slate-900/40 p-10 rounded-2xl text-center border border-slate-800 flex flex-col items-center gap-1">
          <HelpCircle className="text-slate-600 w-12 h-12 mb-1" />
          <h5 className="text-sm font-bold text-slate-300">أدخل كود بيّان برمجي سليم</h5>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            ببيئة العمل خالية؛ يرجى ملء المحرر بكود بيّان صحيح ليتم فك شفرته معجمياً وتحويله لتعليمات معالج فوري تفاعلي.
          </p>
        </div>
      )}

    </div>
  );
};
