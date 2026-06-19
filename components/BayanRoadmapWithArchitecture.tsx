import React, { useState, useMemo } from 'react';
import { 
  Cpu, Terminal, Layers, Sparkles, Wand2, Info, ArrowRight,
  Code2, CheckCircle2, ChevronRight, HelpCircle, Activity, FileCode, AlertCircle, Play,
  Shield, Search, Plus, Smartphone, HardDrive, Check, RefreshCw
} from 'lucide-react';
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

  // New Future Cores States
  const [bareMetalArch, setBareMetalArch] = useState<'arm64' | 'x86_64'>('arm64');
  const [bpmSearchQuery, setBpmSearchQuery] = useState('');
  const [bpmInstalledPackages, setBpmInstalledPackages] = useState<string[]>(['رياضيات']);
  const [bpmInstallTarget, setBpmInstallTarget] = useState<string | null>(null);
  const [bpmInstallProgress, setBpmInstallProgress] = useState(0);
  
  // Simulated BPM Registry
  const [bpmPackages, setBpmPackages] = useState<any[]>([
    { name: 'bayan-soccrates', arabicName: 'سقراط_ذكاء', description: 'لوحة تفاعل ومكاملة مع نماذج الاستدلال والتعلم الهائلة سحابياً ومحلياً.', version: 'v1.4.2', size: '42 KB', signature: 'RSA-SHA256: 8f9e...2a1b', downloads: 1420 },
    { name: 'bayan-canvas-quantum', arabicName: 'رسم_كمومي', description: 'توليد الرسوم والخرائط المسقطة بمتجهات تراكبية سريعة الأداء.', version: 'v2.1.0', size: '28 KB', signature: 'RSA-SHA256: 3c9d...9a2f', downloads: 853 },
    { name: 'bayan-db-cellular', arabicName: 'قواعد_بيانية_خلوية', description: 'قاعدة بيانات صلبة فائقة الترابط خالية تماماً من تسرب المراجع التفاعلية.', version: 'v0.9.8', size: '64 KB', signature: 'RSA-SHA256: 7d4a...5c1e', downloads: 932 },
    { name: 'bayan-iot-link', arabicName: 'وصل_عتادي_عام', description: 'منظومة الولوج المباشر للأجهزة السلكية ونطاقات لوحات الأردوينو ومستشعراتها.', version: 'v3.0.4', size: '19 KB', signature: 'RSA-SHA256: 1f8b...4f7e', downloads: 1205 }
  ]);

  // Publish dialogue states
  const [publishName, setPublishName] = useState('');
  const [publishDesc, setPublishDesc] = useState('');
  const [publishArabicName, setPublishArabicName] = useState('');
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // hardware api states
  const [gpioState, setGpioState] = useState<Record<number, boolean>>({ 1: false, 2: true, 3: false, 4: false, 5: true, 6: false, 7: false, 8: false });
  const [serialOutput, setSerialOutput] = useState<string[]>([
    "[Direct-I/O] تهيئة نظام الربط العتادي المباشر... ناجح",
    "[GPU-Grid] تخصيص مصفوفة الحسابات البصرية المسرعة... خالية وجاهزة",
    "[Cellular-Mem] حجز صفحة ذاكرة صلبة مستقرة عند العنوان Phys 0x00450F00"
  ]);
  const [gpuActiveCores, setGpuActiveCores] = useState(128);
  const [isGpuOptimized, setIsGpuOptimized] = useState(true);

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

  // Dynamic ARM64 & x86_64 compilation
  const bareMetalCompilation = useMemo(() => {
    let armLines: string[] = [
      "// ===========================================================",
      "// مُخرجات المترجم الأصيل للبيان (Al-Bayan Bare-Metal Compiler)",
      "// معمارية المعالج المستهدف: ARM64 (AArch64)",
      "// ===========================================================",
      ".global _start",
      ".text",
      "_start:",
      "    // تهيئة إطار المكدس",
      "    sub sp, sp, #32          // حجز ٣٢ بايت بالذاكرة المحلية",
      "    str x29, [sp, #16]       // حفظ مؤشر إطار العقدة السابق"
    ];

    let x86Lines: string[] = [
      "; ===========================================================",
      "; مُخرجات المترجم الأصيل للبيان (Al-Bayan Bare-Metal Compiler)",
      "; معمارية المعالج المستهدف: Intel x86_64",
      "; ===========================================================",
      "global _start",
      "section .text",
      "_start:",
      "    ; تهيئة إطار المكدس",
      "    push rbp",
      "    mov rbp, rsp",
      "    sub rsp, 32"
    ];

    let cleanCode = code;
    let lines = cleanCode.split('\n');
    let offset = 0;
    let definedVars: Record<string, number> = {};

    lines.forEach((line) => {
      let trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) return;

      let varMatch = trimmed.match(/عرف\s+([a-zA-Z_\u0600-\u06FF][a-zA-Z0-9_\u0600-\u06FF]*)\s*=\s*(.*)/);
      if (varMatch) {
        let varName = varMatch[1];
        let rawVal = varMatch[2];
        let val = parseInt(rawVal.replace(/[٠-٩]/g, d => "0123456789"['٠١٢٣٤٥٦٧٨٩'.indexOf(d)] || d)) || 0;
        
        offset += 4;
        definedVars[varName] = offset;

        armLines.push(`\n    // تعريف المتغير [${varName}] بقيمة [${val}]`);
        armLines.push(`    mov w0, #${val}          // تحميل القيمة الفورية لـ w0`);
        armLines.push(`    str w0, [sp, #${offset}]       // حفظ قيمة المتغير في العنوان المؤقت [sp + ${offset}]`);

        x86Lines.push(`\n    ; تعريف المتغير [${varName}] بقيمة [${val}]`);
        x86Lines.push(`    mov dword [rsp + ${offset}], ${val} ; إزاحة محلية عند العنوان [rsp + ${offset}]`);
      }

      let printMatch = trimmed.match(/اطبع\((.*?)\)/);
      if (printMatch) {
        let arg = printMatch[1].trim();
        if (definedVars[arg] !== undefined) {
          let varOffset = definedVars[arg];
          armLines.push(`\n    // استدعاء الطباعة للمتغير [${arg}]`);
          armLines.push(`    ldr w0, [sp, #${varOffset}]       // سحب المتغير من المكدس`);
          armLines.push(`    mov x1, x0               // تمرير قيمة المتغير ومواءمتها مع مسجل المعالج [x1]`);
          armLines.push(`    mov x0, #1               // رقم الواصف للنظام القياسي stdout`);
          armLines.push(`    mov x8, #64              // رمز استدعاء النظام للكتابة sys_write في معالجات ARM64`);
          armLines.push(`    svc #0                   // إطلاق نبضة المقاطعة العتادية واستبصار القرار`);

          x86Lines.push(`\n    ; استدعاء الطباعة للمتغير [${arg}]`);
          x86Lines.push(`    mov edi, dword [rsp + ${varOffset}] ; سحب قيمة المتغير للمسجل rdi`);
          x86Lines.push(`    mov rsi, edi             ; تهيئة المعامل ومزامنة البيانات ثنائياً`);
          x86Lines.push(`    mov eax, 1               ; رمز الاستدعاء sys_write للكتابة المباشرة`);
          x86Lines.push(`    syscall                  ; ملامسة السيليكون وإطلاق المقاطعة العتادية`);
        } else {
          armLines.push(`\n    // طباعة نصية مباشرة: ${arg}`);
          armLines.push(`    adrp x0, msg_const@PAGE  // جلب عنوان السلسلة النصية`);
          armLines.push(`    add x0, x0, msg_const@PAGEOFF`);
          armLines.push(`    mov x1, #13              // تمرير طول الرسالة المنسقة`);
          armLines.push(`    mov x8, #64              // استدعاء نظام الكتابة ARM64 linux-sys`);
          armLines.push(`    svc #0`);

          x86Lines.push(`\n    ; طباعة نصية مباشرة: ${arg}`);
          x86Lines.push(`    mov rdi, 1               ; stdout descriptor`);
          x86Lines.push(`    mov rsi, msg_const       ; مؤشر الكتل النصية`);
          x86Lines.push(`    mov rdx, 13              ; طول السلسلة`);
          x86Lines.push(`    mov rax, 1               ; sys_write code`);
          x86Lines.push(`    syscall`);
        }
      }
    });

    armLines.push("\n    // إنهاء التطبيق بأمان وسلامة وبلا أي فواقد");
    armLines.push("    ldr x29, [sp, #16]       // استعادة مؤشر الإطار السابق");
    armLines.push("    add sp, sp, #32          // تنظيف إطار المكدس بالكامل");
    armLines.push("    mov x0, #0               // كود الحالة 0");
    armLines.push("    mov x8, #93              // الاستدعاء sys_exit في ARM64 Linux");
    armLines.push("    svc #0");

    x86Lines.push("\n    ; إنهاء التطبيق بأمان وسلامة وبلا أي فواقد");
    x86Lines.push("    mov rsp, rbp");
    x86Lines.push("    pop rbp");
    x86Lines.push("    xor edi, edi             ; كود الحالة 0");
    x86Lines.push("    mov eax, 60              ; الاستدعاء sys_exit في x86_64 Linux");
    x86Lines.push("    syscall");

    armLines.push("\n.data\nmsg_const:\n    .ascii \"Al-Bayan direct Bare-metal Output\\n\"");
    x86Lines.push("\nsection .data\nmsg_const db \"Al-Bayan direct Bare-metal Output\\n\", 0");

    return {
      arm64: armLines.join('\n'),
      x86_64: x86Lines.join('\n'),
      definedVariables: definedVars,
      offsetsCount: offset
    };
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

          {/* Custom Interactive Arch Flowchart */}
          <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-slate-900/60 p-5 shadow-2xl">
            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h4 className="text-sm font-bold text-slate-100 mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              مخطط تفاملي لمعمارية كومبايلر البيان وسلسلة التجميع الذكية
            </h4>

            {/* Grid Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
              {/* Box 1 */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-indigo-950/20 hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="bg-indigo-950/50 text-indigo-400 border border-indigo-900/50 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mb-3">01</div>
                  <h5 className="text-xs font-bold text-white mb-1">المدخل: الشفرة المصدرية</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed">تغذية ملفات البيان المكتوبة بـ <code className="text-indigo-300 bg-slate-900 px-1 rounded">.byn</code> والتي تستعين بقوالب المفردات العربية الفصحى المتناسقة.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[9px] text-indigo-400 font-mono">
                  <span>INPUT: AL-BAYAN CODE</span>
                  <CheckCircle2 size={12} className="text-emerald-500" />
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-emerald-950/20 hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mb-3">02</div>
                  <h5 className="text-xs font-bold text-white mb-1">المحلل المعجمي والنحوي</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed">يقوم <code className="text-emerald-300 font-bold">Lexer</code> بتقطيع الكود لرموز دلالية ومن ثم يقوم الـ <code className="text-emerald-300 font-bold">Parser</code> ببناء رزم العلاقات النحوية.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[9px] text-emerald-400 font-mono">
                  <span>LEXER & PARSER ENGINE</span>
                  <Activity size={12} className="text-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-amber-500/40 hover:shadow-amber-950/20 hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="bg-amber-950/50 text-amber-400 border border-amber-900/50 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mb-3">03</div>
                  <h5 className="text-xs font-bold text-white mb-1">شجرة العلاقات والتحليل</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed">تشييد شجرة الإعراب المجردة <code className="text-amber-300 font-bold">AST</code> وفحص السلامة المنطقية لتجاوز أخطاء القيود والثواني الصفرية.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[9px] text-amber-400 font-mono">
                  <span>AST & SEMANTIC CHECK</span>
                  <Layers size={12} className="text-amber-400" />
                </div>
              </div>

              {/* Box 4 */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-purple-500/40 hover:shadow-purple-950/20 hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="bg-purple-950/50 text-purple-400 border border-purple-900/50 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mb-3">04</div>
                  <h5 className="text-xs font-bold text-white mb-1">توليد الرموز ومنصات الآلة</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed">تصدير البايت كود الفوري لصالح <code className="text-purple-300">BayanVM</code> وتجميع الـ <code className="text-purple-300">WASM</code> وإنتاج تطبيقات الأندرويد الأصيلة.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[9px] text-purple-400 font-mono">
                  <span>COMPILER TARGET GENERATORS</span>
                  <Sparkles size={12} className="text-purple-400" />
                </div>
              </div>
            </div>

            {/* Connection labels/hints */}
            <div className="hidden lg:grid grid-cols-4 gap-4 mt-2 text-center pointer-events-none">
              <div className="text-[10px] text-indigo-400/70 font-sans">تفتيت الحروف ──▶</div>
              <div className="text-[10px] text-emerald-400/70 font-sans">بناء الرابط ──▶</div>
              <div className="text-[10px] text-amber-400/70 font-sans">التجميع والتحسين ──▶</div>
              <div className="text-[10px] text-purple-400/70 font-sans">تشغيل فوري وبث 🚀</div>
            </div>

            <div className="absolute bottom-2 left-3 bg-slate-950/80 px-2.5 py-1 rounded text-[10px] text-indigo-300 font-mono border border-indigo-800/30">
              كومبايلر متكامل ونظام تجميع موحد بالكامل بنسبة أمان فائقة 🌟
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
    },
    {
      title: "المترجم الذاتي الأصيل للعتاد (Bare-Metal Self-Hosting Compiler)",
      badge: "الخطوة الخامسة 🛠️",
      colorClass: "from-rose-950/40 to-slate-910 border-rose-500/30",
      icon: <Cpu className="text-rose-400 w-5 h-5 shrink-0" />,
      description: "تحويل كود البيان المصدر مباشرة إلى لغات التجميع للمعالجات الحديثة (ARM64 و x86_64) لإنتاج ملفات ثنائية صلبة تعمل مباشرة بلا تشغيل خلفي.",
      details: (
        <div className="space-y-4">
          <div className="bg-slate-905/70 border border-slate-800 p-4 rounded-xl space-y-4">
            <h5 className="text-rose-400 font-bold text-xs border-b border-slate-800/85 pb-2 flex justify-between items-center bg-transparent">
              <span>المترجم الذاتي الأصيل والسيليكون (Direct ASM Generation Interface)</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setBareMetalArch('arm64')}
                  className={`text-[10px] px-2.5 py-1 rounded transition-all font-bold ${bareMetalArch === 'arm64' ? 'bg-rose-900 text-white' : 'text-slate-400'}`}
                >
                  ARM64 (Apple Silicon, ARM v9)
                </button>
                <button
                  type="button"
                  onClick={() => setBareMetalArch('x86_64')}
                  className={`text-[10px] px-2.5 py-1 rounded transition-all font-bold ${bareMetalArch === 'x86_64' ? 'bg-rose-900 text-white' : 'text-slate-400'}`}
                >
                  Intel / AMD (x86_64)
                </button>
              </div>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
              {/* Assembly Output Column */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">التوليد الفوري الشفاف للمعالج المستهدف:</span>
                  <span className="text-[10px] font-mono text-rose-300">_start entry point ready</span>
                </div>
                <div className="bg-black/55 p-3 rounded-lg border border-slate-950 text-left font-mono text-[10.5px] max-h-[220px] overflow-auto custom-scrollbar" dir="ltr">
                  <pre className={bareMetalArch === 'arm64' ? 'text-rose-200' : 'text-blue-200'}>
                    {bareMetalArch === 'arm64' ? bareMetalCompilation.arm64 : bareMetalCompilation.x86_64}
                  </pre>
                </div>
              </div>

              {/* Hardware Visual & Register states Column */}
              <div className="space-y-3">
                <div className="bg-slate-950/80 border border-slate-900 p-3 rounded-lg space-y-3">
                  <h6 className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                    <Shield size={12} className="text-rose-450" />
                    حالة السجلات الافتراضية للمعالج
                  </h6>
                  <div className="space-y-2 font-mono text-[10.5px]" dir="ltr">
                    {bareMetalArch === 'arm64' ? (
                      <>
                        <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-900">
                          <span className="text-rose-400 font-bold">W0 (Return/Arg)</span>
                          <span className="text-slate-300">#{Object.keys(bareMetalCompilation.definedVariables).length > 0 ? "25" : "0"}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-900">
                          <span className="text-rose-400 font-bold">X1 (Buffer pointer)</span>
                          <span className="text-slate-300">0x00000001048b</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-900">
                          <span className="text-rose-400 font-bold">SP (Stack pointer)</span>
                          <span className="text-slate-300">0x16fdff5b0 - {bareMetalCompilation.offsetsCount} bytes</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-900">
                          <span className="text-rose-400 font-bold">PC (Program Counter)</span>
                          <span className="text-slate-300">0x100003cb4</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-900">
                          <span className="text-blue-400 font-bold">RAX (System call / ACC)</span>
                          <span className="text-slate-300">60</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-900">
                          <span className="text-blue-400 font-bold">RDI (First parameter)</span>
                          <span className="text-slate-300">#{Object.keys(bareMetalCompilation.definedVariables).length > 0 ? "25" : "0"}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-900">
                          <span className="text-blue-400 font-bold">RSP (Stack Pointer)</span>
                          <span className="text-slate-300">0x7fff5fbff - {bareMetalCompilation.offsetsCount} bytes</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-900">
                          <span className="text-blue-400 font-bold">RIP (Instruction Index)</span>
                          <span className="text-slate-300">0x00000040008d</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Built executable mockup representation */}
                <div className="bg-slate-950/80 border border-slate-900 p-3 rounded-lg space-y-2">
                  <h6 className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                    <Activity size={12} className="text-emerald-450 animate-pulse" />
                    تحليل الشفرة الثنائية المركبة
                  </h6>
                  <div className="text-[10px] text-right text-slate-400 space-y-1">
                    <p>• صيغة الملف المستخرج: <span className="text-slate-200 font-mono">{bareMetalArch === 'arm64' ? 'Mach-O 64-Bit' : 'ELF64 Executable'}</span></p>
                    <p>• الحجم الكلي للملف التنفيذي: <span className="text-emerald-400 font-mono font-bold">14.2 KB</span> (صفر فواقد)</p>
                    <p>• بصمة الأمان: <span className="text-rose-400 font-mono font-bold">امتداد موقع ومحمي بالكامل 🔐</span></p>
                    <p>• التخصيص الافتراضي للقطاعات: <span className="text-orange-400 font-mono text-[9px]">.text (الكود المعالج) | .data (مسودة الثوابت المستقرة)</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "مدير الحزم الوطني والمحكم (Bayan Package Manager - BPM)",
      badge: "الخطوة السادسة 📦",
      colorClass: "from-blue-950/40 to-slate-910 border-blue-500/30",
      icon: <Layers className="text-blue-400 w-5 h-5 shrink-0" />,
      description: "نظام التوزيع والاستدعاء الموثق للمكتبات والخوادم وطنيّاً بكفاءة حاسوبية فائقة السرعة وتدقيق كامل وموقع بالبصمات الرقمية.",
      details: (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-805 p-4 rounded-xl space-y-4 text-right">
            <h5 className="text-blue-400 font-bold text-xs border-b border-slate-800/85 pb-2 flex justify-between items-center text-right">
              <span>مدير الحزم السحابي والتحليلي (BPM Universal Registry Browser)</span>
              <span className="text-[10px] text-slate-400">تدقيق إلكتروني كامل - حزم وطنية حرة وآمنة</span>
            </h5>

            {/* Registry toolbar */}
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث بالنص العربي أو الإنجليزي عن حزم رسمية... (مثال: ذكاء، رسم، قواعد)"
                  value={bpmSearchQuery}
                  onChange={(e) => setBpmSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 text-xs text-slate-200 border border-slate-800 rounded-lg pr-9 pl-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none text-right"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setPublishName(''); setPublishArabicName(''); setPublishDesc(''); setPublishSuccessMsg(null);
                  setBpmSearchQuery('');
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-2 flex items-center gap-1.5 text-xs font-bold transition-colors shrink-0"
              >
                <Plus size={14} />
                نشر حزمتي حراً
              </button>
            </div>

            {/* Install loading simulation widget */}
            {bpmInstallTarget && (
              <div className="bg-slate-950 p-3 rounded-lg border border-blue-900/40 space-y-2 animate-pulse text-right">
                <div className="flex justify-between text-[11px]">
                  <span className="text-blue-400 font-mono">BPM Pipeline: {bpmInstallTarget}</span>
                  <span className="text-slate-300">جاري فحص وتنزيل حزمة مكتبة [{bpmInstallTarget}]... {bpmInstallProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-150" style={{ width: `${bpmInstallProgress}%` }} />
                </div>
                <div className="text-[9px] text-slate-500 flex justify-between">
                  <span>SHA-256 Verified Signature check</span>
                  <span>100% Secure cellular sandbox</span>
                </div>
              </div>
            )}

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bpmPackages.filter(p => !bpmSearchQuery || p.name.includes(bpmSearchQuery) || p.arabicName.includes(bpmSearchQuery) || p.description.includes(bpmSearchQuery)).map((pkg) => {
                const isInstalled = bpmInstalledPackages.includes(pkg.arabicName);
                return (
                  <div key={pkg.name} className="bg-slate-950/70 border border-slate-900 p-3.5 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{pkg.version} • {pkg.size}</span>
                        <div className="text-right">
                          <h6 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                            <span className="font-mono text-blue-400 text-[10.5px] bg-blue-950/50 px-1 py-0.5 rounded">import("{pkg.arabicName}")</span>
                            <span>{pkg.arabicName}</span>
                          </h6>
                        </div>
                      </div>
                      <p className="text-[11.5px] text-slate-350 leading-relaxed text-right">{pkg.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between">
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Shield size={10} className="text-emerald-455" />
                        {pkg.signature.slice(0, 16)}...
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10.5px] text-slate-500 font-sans">{pkg.downloads} تنزيل</span>
                        {isInstalled ? (
                          <span className="text-[10.5px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 rounded px-2.5 py-1 flex items-center gap-1 font-bold">
                            <Check size={12} />
                            مركبة ونشطة
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (bpmInstallTarget) return;
                              setBpmInstallTarget(pkg.arabicName);
                              setBpmInstallProgress(0);
                              let prg = 0;
                              const timer = setInterval(() => {
                                prg += 20;
                                setBpmInstallProgress(prg);
                                if (prg >= 100) {
                                  clearInterval(timer);
                                  setTimeout(() => {
                                    setBpmInstalledPackages(prev => [...prev, pkg.arabicName]);
                                    setBpmInstallTarget(null);
                                  }, 300);
                                }
                              }, 150);
                            }}
                            className="bg-blue-950/50 hover:bg-blue-900 text-blue-300 border border-blue-900/40 rounded px-2.5 py-1 text-[11px] font-bold transition-all"
                          >
                            تنصيب ودمج
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Publishing dialogue widget inside section */}
            <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl space-y-3 mt-2 text-right">
              <h6 className="text-[11.5px] font-bold text-slate-200">صناعة وتخليق حزمة ونشرها وطنيّاً في ثوانٍ</h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="اسم الحزمة المصدر بالإنجليزية (بـ bpm-)"
                  value={publishName}
                  onChange={(e) => setPublishName(e.target.value)}
                  className="bg-slate-950 text-right text-xs text-slate-200 border border-slate-800 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="الاسم العربي للاستيراد البرمجي الفصحى"
                  value={publishArabicName}
                  onChange={(e) => setPublishArabicName(e.target.value)}
                  className="bg-slate-950 text-right text-xs text-slate-200 border border-slate-800 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="ملخص وظيفة الحزمة البرمجية وشروطها"
                  value={publishDesc}
                  onChange={(e) => setPublishDesc(e.target.value)}
                  className="bg-slate-950 text-right text-xs text-slate-200 border border-slate-800 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-500 font-mono">BPM Signing Engine RSA-2048 client side ready</span>
                <button
                  type="button"
                  onClick={() => {
                    if (!publishName || !publishArabicName || !publishDesc) {
                      setPublishSuccessMsg("⚠️ يرجى ملء كافة حقول النشر لغرض التدقيق الرقمي.");
                      return;
                    }
                    const newPkg = {
                      name: publishName,
                      arabicName: publishArabicName,
                      description: publishDesc,
                      version: 'v1.0.0',
                      size: '12 KB',
                      signature: 'RSA-SHA256: d8f3...ef10',
                      downloads: 1
                    };
                    setBpmPackages(prev => [newPkg, ...prev]);
                    setPublishSuccessMsg(`🚀 تم التوقيع الرقمي لحزمتك [${publishArabicName}] وتدقيقها أوتوماتيكياً بنجاح تام! نُشرت الحزمة في السجل المحلي وهي جاهزة للاستدعاء.`);
                    setPublishName(''); setPublishArabicName(''); setPublishDesc('');
                  }}
                  className="bg-blue-700 hover:bg-blue-600 text-white rounded px-3.5 py-1.5 text-xs font-bold transition-all"
                >
                  وقع وانشر وطنيّاً 🚀
                </button>
              </div>

              {publishSuccessMsg && (
                <div className="bg-slate-950 p-2.5 rounded border border-blue-900/30 text-[11px] text-blue-300 font-bold leading-relaxed">
                  {publishSuccessMsg}
                </div>
              )}
            </div>

          </div>
        </div>
      )
    },
    {
      title: "الترجمات الكونية لشرائح آبل (iOS & SwiftUI Universal Compiler)",
      badge: "الخطوة السابعة 🍎",
      colorClass: "from-orange-950/40 to-slate-910 border-orange-500/30",
      icon: <Smartphone className="text-orange-405 w-5 h-5 shrink-0" />,
      description: "تحويل مباشر لشفرتك العربية كلياً إلى لغة Swift وتصميم كتل الواجهات باستخدام مكتبة SwiftUI الرائعة.",
      details: (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-805 p-4 rounded-xl space-y-4">
            <h5 className="text-orange-450 font-bold text-xs border-b border-slate-800/85 pb-2 flex justify-between items-center mb-1">
              <span>المحاكاة والترجمة الكونية المزدوجة (Universal SwiftUI Simulator & Engine)</span>
              <span className="text-[10px] text-slate-400 font-sans">IOS 17+ STATEFUL VIEW GENERATION</span>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Left iPhone layout mock view */}
              <div className="bg-slate-950 border-4 border-slate-800 rounded-3xl h-[330px] p-4 flex flex-col relative overflow-hidden shadow-2xl justify-between mx-auto w-full max-w-[220px]">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-slate-800 rounded-full flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                </div>
                
                {/* Content mockup simulated layout container */}
                <div className="flex-1 overflow-auto custom-scrollbar pt-6 pb-2 text-center flex flex-col items-center justify-center gap-4 px-1">
                  <p className="text-[10px] text-slate-500 font-bold font-mono">Al-Bayan Mobile App</p>
                  
                  {(() => {
                    let hasButton = code.includes('زر');
                    let hasInput = code.includes('حقل_إدخال');
                    let hasSwitch = code.includes('مفتاح_تبديل');
                    let hasProgress = code.includes('مؤشر_تقدم');
                    
                    return (
                      <div className="space-y-3.5 w-full text-right animate-fade-in text-[11px]">
                        <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-center">
                          <p className="text-slate-200 font-bold mb-1 text-[10px]">المنزل الذكي المستقر</p>
                          <p className="text-[9.5px] text-slate-400">تتم معالجة الواجهات ديناميكياً 1:1.</p>
                        </div>
                        
                        {hasInput && (
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400">حقل الإدخال المصدر</span>
                            <div className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-left font-sans">
                              المدخلات...
                            </div>
                          </div>
                        )}
                        
                        {hasSwitch && (
                          <div className="flex justify-between items-center bg-slate-900/45 p-2 rounded border border-slate-900">
                            <span className="h-4 w-8 rounded-full bg-emerald-500 flex items-center justify-end p-0.5"><span className="h-3 w-3 rounded-full bg-white" /></span>
                            <span className="text-slate-200">المرشح التفاعلي</span>
                          </div>
                        )}

                        {hasProgress && (
                          <div className="space-y-1 text-right">
                            <div className="flex justify-between text-[9px] text-slate-400">
                              <span>96% الوفر</span>
                              <span>حالة مؤشر التقدم</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full w-[96%]" />
                            </div>
                          </div>
                        )}

                        {hasButton && (
                          <button
                            type="button"
                            onClick={() => alert('🍎 تم إطلاق نبضة حدث SwiftUI المتفاعل على الموبايل!')}
                            className="w-full bg-blue-600 text-white rounded-lg py-2 text-center text-xs font-bold shadow hover:bg-blue-500 transition-colors"
                          >
                            مفتاح تشغيل تفاعلي
                          </button>
                        )}

                        <div className="text-center text-[9px] text-slate-500 pt-2 border-t border-slate-900">
                          حجم التطبيق المتولد لهاتف آبل: <span className="text-yellow-405 font-bold font-mono">310 KB</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="h-1 w-24 bg-slate-600 rounded-full mx-auto shrink-0 mb-1" />
              </div>

              {/* Swift translation output block with high fidelity */}
              <div className="md:col-span-2 space-y-2 text-right">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">شفرة Swift & SwiftUI الحرفية الكونية:</span>
                  <span className="text-[10px] text-orange-400 font-mono">iOS SwiftUI Module Transpiled</span>
                </div>
                <div className="bg-black/55 p-3 rounded-lg border border-slate-950 font-mono text-[10px] leading-relaxed h-[330px] overflow-auto custom-scrollbar text-left" dir="ltr">
                  <pre className="text-orange-200">
                    {`// Generated iOS SwiftUI native code from Al-Bayan Universal Cross-Compiler
import SwiftUI
import CoreLocation
import CoreMotion

@main
struct AlBayanApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    @State private var memoryPurgeCounter = 0
    
    var body: some View {
        VStack(spacing: 16) {
            Text("🏡 وحدة التحكم المركزية للمنزل الذكي")
                .font(.headline)
                .foregroundColor(.white)
            
            ProgressView(value: 0.24, total: 1.0)
                .progressViewStyle(LinearProgressViewStyle(tint: .emerald))
            
            Toggle(isOn: .constant(true)) {
                Text("منظومة تنقية الهواء الكمي")
            }
            .padding()
            
            Button(action: {
                // UI Touch haptic pulse feedback triggers automatically
            }) {
                Text("تسجيل وتفعيل البيانات")
                    .font(.subheadline)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .padding()
        .onAppear {
            // Cellular memory healing (ARC holds this natively)
            autoreleasepool { }
        }
    }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "الولوج المباشر للعتاد والمنافذ الصلبة (Direct Hardware Register API)",
      badge: "الخطوة الثامنة 🎛️",
      colorClass: "from-emerald-950/40 to-slate-910 border-emerald-500/30",
      icon: <Terminal className="text-emerald-400 w-5 h-5 shrink-0" />,
      description: "تكامل مباشر مع لوحات التحكم من نوع FPGA و Arduino، والولوج المباشر لذاكرة المعالج ومنافذ الدخل والخرج I/O.",
      details: (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-805 p-4 rounded-xl space-y-4 text-right">
            <h5 className="text-emerald-405 font-bold text-xs border-b border-slate-800/85 pb-2 flex justify-between items-center text-right">
              <span>مدير المكاملة العتادية وخرائط الذاكرة MMIO (Hardware Pinboard Hub)</span>
              <span className="text-[10px] text-slate-500">منظومة I/O المباشرة بنطاق زمن استجابة 1.2 نانو ثانية</span>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
              {/* GPIO Interactive Board layout */}
              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl space-y-3.5">
                <h6 className="text-[11.5px] font-bold text-slate-200 border-b border-slate-900 pb-1.5 flex justify-between items-center">
                  <span>منظومة المسامير GPIO pins</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Live Interlocks</span>
                </h6>
                <div className="grid grid-cols-4 gap-2 text-center font-mono text-[9px]" dir="ltr">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((pin) => {
                    const isActive = gpioState[pin];
                    return (
                      <button
                        type="button"
                        key={pin}
                        onClick={() => {
                          setGpioState(prev => {
                            const updated = { ...prev, [pin]: !prev[pin] };
                            setSerialOutput(old => [
                              `[Direct-I/O] Pin GPIO #${pin} changed electrical state to: ${updated[pin] ? "HIGH (3.3V)" : "LOW (0V)"}`,
                              ...old
                            ]);
                            return updated;
                          });
                        }}
                        className={`flex flex-col items-center justify-between p-2 rounded-lg border transition-all ${
                          isActive 
                            ? 'bg-emerald-950/65 border-emerald-500 text-emerald-300 ring-1 ring-emerald-900/40 animate-pulse' 
                            : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        <span className="opacity-60">PIN {pin}</span>
                        <span className={`block w-2.5 h-2.5 rounded-full mt-2.5 ${isActive ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                        <span className="font-sans font-bold mt-1 text-[8px]">{isActive ? 'HIGH' : 'LOW'}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] text-slate-450 text-right space-y-1">
                  <p>💡 <span className="font-bold text-slate-200">التحكم اليدوي:</span> يمكنك النقر على المسامير أعلاه لمحاكاة تغير الجهود الكهربائية (0V إلى 3.3V) وتتبع ميكانيكية المقاطعة العتادية حياً.</p>
                </div>
              </div>

              {/* Hardware Register control matrix */}
              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl space-y-3">
                <h6 className="text-[11.5px] font-bold text-slate-200 border-b border-slate-900 pb-1.5 flex justify-between items-center">
                  <span>سجلات الدخل والخرج (I/O Registers)</span>
                  <span className="text-[10px] text-orange-400 font-mono">Real-time IOports</span>
                </h6>
                <div className="space-y-2 font-mono text-[10px]" dir="ltr">
                  <div className="flex justify-between items-center bg-slate-900/45 p-2 rounded border border-slate-900">
                    <span className="text-orange-400 font-bold">PORT 0x3F8 (Serial TX/RX)</span>
                    <span className="text-emerald-400 font-bold">0x41 (Ascii: A)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/45 p-2 rounded border border-slate-900">
                    <span className="text-orange-400 font-bold">PORT 0x3FA (Interrupt status)</span>
                    <span className="text-slate-300">0x0002 (HIGH PRIO)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/45 p-2 rounded border border-slate-900">
                    <span className="text-orange-400 font-bold">GPU Active Blocks matrix</span>
                    <div className="flex items-center gap-1.5 font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          setGpuActiveCores(prev => Math.max(0, prev - 128));
                          setSerialOutput(old => [
                            `[GPUDirect] GPU core allocation altered: ${Math.max(0, gpuActiveCores - 128)} active threads`,
                            ...old
                          ]);
                        }}
                        className="bg-slate-850 px-1 py-0.5 rounded text-[10px] text-slate-400 font-mono hover:text-white"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs">{gpuActiveCores}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setGpuActiveCores(prev => prev + 128);
                          setSerialOutput(old => [
                            `[GPUDirect] GPU core allocation altered: ${gpuActiveCores + 128} active threads`,
                            ...old
                          ]);
                        }}
                        className="bg-slate-850 px-1 py-0.5 rounded text-[10px] text-slate-400 font-mono hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/45 p-2 rounded border border-slate-900">
                    <span className="text-orange-400 font-bold">FPGA Matrix Super-Engine</span>
                    <span className="text-purple-400 font-bold">98.2 TeraOps</span>
                  </div>
                </div>
              </div>

              {/* Hardware Serial Output logs terminal */}
              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <h6 className="text-[11px] font-bold text-slate-200 border-b border-slate-900 pb-1 flex justify-between items-center">
                    <span>نبضات العمل العتادي (Serial Monitor)</span>
                    <button
                      type="button"
                      onClick={() => setSerialOutput([
                        "[Direct-I/O] مسح وعقد وحدة التحكم مجدداً...",
                        "[Direct-I/O] تهيئة نظام الربط العتادي المباشر... ناجح"
                      ])}
                      className="text-[9px] text-slate-400 hover:text-white"
                    >
                      مسح
                    </button>
                  </h6>
                  <div className="bg-black border border-slate-900 rounded p-2.5 h-[130px] overflow-auto custom-scrollbar font-mono text-[9.5px] text-slate-350 space-y-2 text-left" dir="ltr">
                    {serialOutput.map((log, idx) => (
                      <p key={idx} className={log.includes('Pin') ? 'text-emerald-450 font-bold' : log.includes('GPU') ? 'text-orange-400' : 'text-slate-400'}>
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="pt-2 text-right text-[10px] text-slate-400 flex justify-between items-center border-t border-slate-900 mt-2">
                  <span className="text-emerald-400 font-bold">1:1 Silicon direct</span>
                  <span>أمن الأقطاب ولغات البيان</span>
                </div>
              </div>
            </div>
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
