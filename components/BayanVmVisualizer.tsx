import React, { useState, useEffect } from 'react';
import { AlBayanLexer, AlBayanParser } from '../services/parser';
import { AlBayanBytecodeCompiler, BytecodeInstruction } from '../services/vm';
import { Play, RotateCcw, ArrowRight, Layers, Cpu, Square, PlayCircle, HelpCircle, Database, Settings, Code } from 'lucide-react';

interface BayanVmVisualizerProps {
  code: string;
}

interface BinaryMappedInstruction {
  address: number;
  binaryString: string; 
  hexString: string;    
  op: string;
  arg: any;
  description: string;
}

const OPC_CODES: Record<string, string> = {
  "DECLARE_VAR":   "0001",
  "LOAD_CONST":    "0010",
  "STORE_VAR":     "0011",
  "LOAD_VAR":      "0100",
  "BINARY_OP":     "0101",
  "PRINT":         "0110",
  "JUMP":          "0111",
  "JUMP_IF_FALSE": "1000",
  "CALL_SYS":      "1001",
  "HALT":          "1111"
};

const OP_ENC: Record<string, string> = {
  "+": "00000001",
  "-": "00000010",
  "*": "00000011",
  "/": "00000100",
  ">": "00000101",
  "<": "00000110",
  "==": "00000111",
  ">=": "00001000",
  "<=": "00001001"
};

const ASSEMBLY_PRESETS = [
  {
    name: "حساب مضروب القيمة 5 (Factorial of 5)",
    code: `; برنامج حساب مضروب 5 بلغة التجميع للبيان
LOAD_CONST 1          ; AX = 1 (تهيئة النتيجة)
STORE_VAR accum       ; accum = 1
LOAD_CONST 5          ; AX = 5 (العداد التنازلي)
STORE_VAR counter     ; counter = 5

; بداية حلقة التكرار للضرب (رقم التعليمة الحالي 4)
LOAD_VAR counter
LOAD_CONST 0
BINARY_OP >           ; هل العداد أكبر من 0؟
JUMP_IF_FALSE 17      ; إذا كانت خاطئة فاقفز للنهاية (السطر 17)

LOAD_VAR accum
LOAD_VAR counter
BINARY_OP *           ; ضرب النتيجة السابقة بالعداد
STORE_VAR accum       ; حفظ في accum

LOAD_VAR counter
LOAD_CONST 1
BINARY_OP -           ; طرح 1 من العداد
STORE_VAR counter     ; تحديث قيمة العداد

JUMP 4                ; القفز مجدداً لفحص الشرط في السطر 4

; طباعة الناتج النهائي المتراكم (رقم التعليمة الحالي 17)
LOAD_VAR accum
PRINT                 ; إخراج وطباعة النتيجة
HALT                  ; إيقاف المعالج`
  },
  {
    name: "مجموع الأرقام الزوجية أقل من 10 (Even Sum < 10)",
    code: `; حساب مجموع الأعداد الزوجية من 2 إلى 8 بلغة التجميع
LOAD_CONST 0          ; تهيئة المجموع sum = 0
STORE_VAR sum
LOAD_CONST 2          ; تهيئة القيمة الأولى num = 2
STORE_VAR num

; فحص الشرط للحلقة (رقم التعليمة الحالي 4)
LOAD_VAR num
LOAD_CONST 10
BINARY_OP <           ; هل القيمة الحالية أقل من 10؟
JUMP_IF_FALSE 15      ; اذهب لنهاية الحلقة (السطر 15)

; جمع القيمة في sum
LOAD_VAR sum
LOAD_VAR num
BINARY_OP +
STORE_VAR sum         ; sum = sum + num

; زيادة المتغير الزوجي بخطوتين
LOAD_VAR num
LOAD_CONST 2
BINARY_OP +
STORE_VAR num         ; num = num + 2

JUMP 4                ; ارجع لبداية الحلقة

; المخرج النهائي (رقم التعليمة السطر 15)
LOAD_VAR sum
PRINT                 ; سيعرض الناتج وهو 20
HALT                  ; إيقاف المعالج`
  },
  {
    name: "مقارنة عددين وطبع الأكبر (Check Maximum)",
    code: `; المقارنة بين الرقمين 15 و 25 وطباعة الأكبر
LOAD_CONST 15
STORE_VAR x
LOAD_CONST 25
STORE_VAR y

LOAD_VAR x
LOAD_VAR y
BINARY_OP >
JUMP_IF_FALSE 11      ; إذا لم يكن x > y، اذهب للسطر 11

LOAD_VAR x
PRINT
JUMP 13

LOAD_VAR y
PRINT                 ; طباعة القيمة الأكبر وهي y
HALT                  ; إيقاف المعالج`
  }
];

const assembleAssembly = (asmCode: string) => {
  const lines = asmCode.split('\n');
  const compiledInsts: BytecodeInstruction[] = [];
  const map: BinaryMappedInstruction[] = [];
  const variableAddresses: Record<string, number> = {};
  let nextVarAddr = 16; // 0x10

  const cleanLines = lines.map((line, idx) => {
    const withoutComment = line.split(';')[0];
    const trimmed = withoutComment.trim();
    return {
      raw: line,
      clean: trimmed,
      originalIndex: idx
    };
  }).filter(l => l.clean.length > 0);

  cleanLines.forEach((item, addr) => {
    const parts = item.clean.split(/\s+/);
    const opStr = parts[0].toUpperCase();
    const argStr = parts.slice(1).join(' ').trim();

    let finalOp = opStr;
    let finalArg: any = argStr;

    // Classic command map
    if (opStr === "PUSH" || opStr === "LOAD_CONST") {
      finalOp = "LOAD_CONST";
      const valNum = Number(argStr);
      if (!isNaN(valNum) && argStr !== '') {
        finalArg = valNum;
      }
    } else if (opStr === "STORE" || opStr === "STORE_VAR") {
      finalOp = "STORE_VAR";
    } else if (opStr === "LOAD" || opStr === "LOAD_VAR") {
      finalOp = "LOAD_VAR";
    } else if (opStr === "ADD") {
      finalOp = "BINARY_OP";
      finalArg = "+";
    } else if (opStr === "SUB") {
      finalOp = "BINARY_OP";
      finalArg = "-";
    } else if (opStr === "MUL") {
      finalOp = "BINARY_OP";
      finalArg = "*";
    } else if (opStr === "DIV") {
      finalOp = "BINARY_OP";
      finalArg = "/";
    } else if (opStr === "GT") {
      finalOp = "BINARY_OP";
      finalArg = ">";
    } else if (opStr === "LT") {
      finalOp = "BINARY_OP";
      finalArg = "<";
    } else if (opStr === "EQ") {
      finalOp = "BINARY_OP";
      finalArg = "==";
    } else if (opStr === "OUT" || opStr === "PRINT") {
      finalOp = "PRINT";
      finalArg = undefined;
    } else if (opStr === "JMP" || opStr === "JUMP") {
      finalOp = "JUMP";
      finalArg = Number(argStr);
    } else if (opStr === "JZ" || opStr === "JUMP_IF_FALSE") {
      finalOp = "JUMP_IF_FALSE";
      finalArg = Number(argStr);
    } else if (opStr === "HALT") {
      finalOp = "HALT";
      finalArg = undefined;
    } else if (opStr === "DECLARE") {
      finalOp = "DECLARE_VAR";
    }

    let argBinary = "00000000";
    let desc = "";
    const opc = OPC_CODES[finalOp] || "0000";

    if (finalOp === "LOAD_CONST") {
      const val = typeof finalArg === 'string' ? Number(finalArg) : finalArg;
      if (!isNaN(val)) {
        argBinary = (val & 0xFF).toString(2).padStart(8, '0');
      }
      desc = `شحن الثابت (${finalArg}) بقمة المكدس`;
    } else if (finalOp === "STORE_VAR") {
      if (!(finalArg in variableAddresses)) {
        variableAddresses[finalArg] = nextVarAddr++;
      }
      const address = variableAddresses[finalArg];
      argBinary = address.toString(2).padStart(8, '0');
      desc = `تخزين قمة المكدس في [${finalArg}] بالعنوان 0x${address.toString(16).toUpperCase()}`;
    } else if (finalOp === "LOAD_VAR") {
      if (!(finalArg in variableAddresses)) {
        variableAddresses[finalArg] = nextVarAddr++;
      }
      const address = variableAddresses[finalArg];
      argBinary = address.toString(2).padStart(8, '0');
      desc = `تحميل قيمة [${finalArg}] من العنوان 0x${address.toString(16).toUpperCase()}`;
    } else if (finalOp === "BINARY_OP") {
      const opEncVal = OP_ENC[finalArg] || "00000000";
      argBinary = opEncVal;
      desc = `عملية حسابية ثنائية (${finalArg})`;
    } else if (finalOp === "PRINT") {
      desc = "قراءة قمة المكدس وطباعتها على الشاشة";
    } else if (finalOp === "JUMP") {
      const target = Number(finalArg);
      if (!isNaN(target)) {
        argBinary = target.toString(2).padStart(8, '0');
      }
      desc = `قفز غير مشروط للتعليمة رقم [${finalArg}]`;
    } else if (finalOp === "JUMP_IF_FALSE") {
      const target = Number(finalArg);
      if (!isNaN(target)) {
        argBinary = target.toString(2).padStart(8, '0');
      }
      desc = `قفز للتعليمة [${finalArg}] إذا كانت قمة المكدس 0`;
    } else if (finalOp === "DECLARE_VAR") {
      if (!(finalArg in variableAddresses)) {
        variableAddresses[finalArg] = nextVarAddr++;
      }
      const address = variableAddresses[finalArg];
      argBinary = address.toString(2).padStart(8, '0');
      desc = `حجز مساحة ذاكرة للمتغير [${finalArg}] عند العنوان 0x${address.toString(16).toUpperCase()}`;
    } else if (finalOp === "HALT") {
      desc = "إيقاف المعالجة الفورية نهائياً";
      argBinary = "11111111";
    }

    const binaryString = `${opc} ${argBinary.slice(0, 4)} ${argBinary.slice(4)}`;
    const fullIntVal = (parseInt(opc, 2) << 8) | parseInt(argBinary, 2);
    const hexString = fullIntVal.toString(16).toUpperCase().padStart(4, '0');

    compiledInsts.push({
      op: finalOp,
      arg: finalArg,
      description: desc
    });

    map.push({
      address: addr,
      binaryString,
      hexString,
      op: finalOp,
      arg: finalArg,
      description: desc
    });
  });

  return { compiledInsts, map };
};

export const BayanVmVisualizer: React.FC<BayanVmVisualizerProps> = ({ code }) => {
  const [instructions, setInstructions] = useState<BytecodeInstruction[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stack, setStack] = useState<any[]>([]);
  const [memory, setMemory] = useState<Record<string, any>>({});
  const [vmLogs, setVmLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
  const [explainerTab, setExplainerTab] = useState<string>('flow');
  const [tourStep, setTourStep] = useState<number>(1);
  const [animatePacket, setAnimatePacket] = useState<boolean>(true);
  const [binaryPulseActive, setBinaryPulseActive] = useState<boolean>(false);

  // States to allow debugging and tracking CPU registers
  const [isDebugActive, setIsDebugActive] = useState<boolean>(false);
  const [registers, setRegisters] = useState<Record<string, any>>({
    PC: 0,
    IR: 'N/A',
    AX: 0,
    BX: 0,
    CX: 0,
    SP: 0,
    MAR: 'N/A',
    MBR: 0,
  });

  // States for Assembly Mode
  const [isAssemblyMode, setIsAssemblyMode] = useState<boolean>(false);
  const [assemblyInput, setAssemblyInput] = useState<string>('');
  const [binaryMemoryMap, setBinaryMemoryMap] = useState<BinaryMappedInstruction[]>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  // Auto-compile the user's code on load/change
  useEffect(() => {
    if (!isAssemblyMode) {
      recompile();
    }
  }, [code, isAssemblyMode]);

  const recompile = () => {
    if (isAssemblyMode) return;
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
    setSelectedCell(null);
    setRegisters({
      PC: 0,
      IR: 'N/A',
      AX: 0,
      BX: 0,
      CX: 0,
      SP: 0,
      MAR: 'N/A',
      MBR: 0,
    });
  };

  const handleAssemble = (rawCode: string) => {
    try {
      setParseError(null);
      const { compiledInsts, map } = assembleAssembly(rawCode);
      setInstructions(compiledInsts);
      setBinaryMemoryMap(map);
      resetVM();
    } catch (e: any) {
      setParseError(e.message || "فشل تجميع وترجمة كود التجميع");
    }
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

    // Tracking registers updates
    let nextRegisters = { ...registers };
    nextRegisters.PC = currentStep;
    nextRegisters.IR = inst ? `${inst.op} ${inst.arg !== undefined ? String(inst.arg) : ''}` : 'N/A';

    switch (inst.op) {
      case "DECLARE_VAR":
        if (!(inst.arg in nextMemory)) {
          nextMemory[inst.arg] = 0;
        }
        nextLogs.push(`📥 [إنشاء]: حجز حجرة للمتغير [${inst.arg}] في الذاكرة.`);
        nextRegisters.MAR = String(inst.arg);
        nextRegisters.MBR = 0;
        break;

      case "LOAD_CONST":
        nextStack.push(inst.arg);
        nextLogs.push(`🔋 [المكدس]: سحب الثابت (${typeof inst.arg === 'string' ? `"${inst.arg}"` : inst.arg}) وشحنه بالقاع.`);
        nextRegisters.AX = inst.arg;
        break;

      case "STORE_VAR": {
        if (nextStack.length === 0) {
          nextLogs.push(`⚠️ خطأ في التخزين: مكدس العمليات فارغ!`);
          break;
        }
        const val = nextStack.pop();
        nextMemory[inst.arg] = val;
        nextLogs.push(`💾 [تخزين]: سحب قمة المكدس لبلع القيمة [${val}] بالمتغير [${inst.arg}].`);
        nextRegisters.MAR = String(inst.arg);
        nextRegisters.MBR = val;
        nextRegisters.AX = val;
        break;
      }

      case "LOAD_VAR": {
        const val = nextMemory[inst.arg];
        const valToPush = val !== undefined ? val : 0;
        nextStack.push(valToPush);
        nextLogs.push(`🔌 [تحميل]: جلب المتغير [${inst.arg}] وقيمته (${valToPush}) لقمة المكدس.`);
        nextRegisters.MAR = String(inst.arg);
        nextRegisters.MBR = valToPush;
        nextRegisters.BX = valToPush;
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
        nextRegisters.AX = result;
        break;
      }

      case "PRINT": {
        if (nextStack.length === 0) {
          nextLogs.push(`⚠️ خطأ بالطباعة: لا يوجد قيمة بالمكدس للطباعة.`);
          break;
        }
        const val = nextStack.pop();
        nextLogs.push(`💻 [مخرج الشاشة]: ${val}`);
        nextRegisters.AX = val;
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
        nextRegisters.AX = val;
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
        nextRegisters.AX = "موافق";
        break;
      }

      case "HALT":
        nextLogs.push(`🏁 [إيقاف]: تم الوصول لتعليمة إيقاف المعالجة HALT نهائياً.`);
        nextStep = instructions.length;
        setIsCompleted(true);
        break;
    }

    nextRegisters.CX = nextRegisters.CX + 1;
    nextRegisters.SP = nextStack.length;
    setRegisters(nextRegisters);

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

    let tempRegisters = { ...registers };

    tempLogs.push("🏃 جاري تشغيل كافة سلسلة تعليمات البايت كود المتبقية بسرعة قصوى...");

    while (tempStep < instructions.length && safetyCounter < 500) {
      const inst = instructions[tempStep];
      let nextStep = tempStep + 1;

      tempRegisters.PC = tempStep;
      tempRegisters.IR = inst ? `${inst.op} ${inst.arg !== undefined ? String(inst.arg) : ''}` : 'N/A';

      switch (inst.op) {
        case "DECLARE_VAR":
          if (!(inst.arg in tempMemory)) {
            tempMemory[inst.arg] = 0;
          }
          tempRegisters.MAR = String(inst.arg);
          tempRegisters.MBR = 0;
          break;
        case "LOAD_CONST":
          tempStack.push(inst.arg);
          tempRegisters.AX = inst.arg;
          break;
        case "STORE_VAR": {
          const val = tempStack.pop();
          tempMemory[inst.arg] = val;
          tempRegisters.MAR = String(inst.arg);
          tempRegisters.MBR = val;
          tempRegisters.AX = val;
          break;
        }
        case "LOAD_VAR": {
          const val = tempMemory[inst.arg];
          const valToPush = val !== undefined ? val : 0;
          tempStack.push(valToPush);
          tempRegisters.MAR = String(inst.arg);
          tempRegisters.MBR = valToPush;
          tempRegisters.BX = valToPush;
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
          tempRegisters.AX = result;
          break;
        }
        case "PRINT": {
          const val = tempStack.pop();
          tempLogs.push(`💻 [مخرج الشاشة]: ${val}`);
          tempRegisters.AX = val;
          break;
        }
        case "JUMP":
          nextStep = inst.arg;
          break;
        case "JUMP_IF_FALSE": {
          const val = tempStack.pop();
          if (!val) nextStep = inst.arg;
          tempRegisters.AX = val;
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
          tempRegisters.AX = "موافق";
          break;
        }
        case "HALT": {
          tempLogs.push(`🏁 [إيقاف]: تم إيقاف المفسر والموجة الفورية يدوياً عبر تعليمة HALT.`);
          nextStep = instructions.length;
          break;
        }
      }

      tempStep = nextStep;
      tempRegisters.CX = tempRegisters.CX + 1;
      tempRegisters.SP = tempStack.length;
      safetyCounter++;
    }

    setStack(tempStack);
    setMemory(tempMemory);
    setVmLogs(tempLogs);
    setCurrentStep(tempStep);
    setIsCompleted(true);

    tempRegisters.PC = tempStep;
    tempRegisters.IR = "🏁 END";
    setRegisters(tempRegisters);

    tempLogs.push("🏁 تم الانتهاء بنجاح من كافة الأكواد.");
  };

  // Resolve variable addresses dynamically
  const getVariableAddresses = () => {
    const addresses: Record<string, number> = {};
    let nextAddr = 16; // 0x10
    
    // Scan instructions for DECLARE_VAR / STORE_VAR / LOAD_VAR to lock addresses in execution order
    instructions.forEach(inst => {
      if (inst.op === "DECLARE_VAR" || inst.op === "STORE_VAR" || inst.op === "LOAD_VAR") {
        if (typeof inst.arg === 'string' && !(inst.arg in addresses)) {
          addresses[inst.arg] = nextAddr++;
        }
      }
    });
    
    // Fallback: search in memory keys
    Object.keys(memory).forEach(key => {
      if (!(key in addresses) && typeof key === 'string') {
        addresses[key] = nextAddr++;
      }
    });

    return addresses;
  };

  const varAddresses = getVariableAddresses();
  const memoryCells = Array.from({ length: 64 }, (_, index) => {
    const address = index;
    const addressHex = `0x${address.toString(16).toUpperCase().padStart(2, '0')}`;
    
    let type: 'instruction' | 'variable' | 'stack' | 'empty' = 'empty';
    let label = 'N/A';
    let value: any = 0;
    let binaryString = '00000000 00000000';
    let hexString = '0000';
    let description = 'غير محجوز / فارغ';
    let isActive = false;
    let isRead = false;
    let isWritten = false;

    // 1. Instruction Segment (0x00 to 0x0F)
    if (address < 16) {
      if (address < instructions.length) {
        const inst = instructions[address];
        type = 'instruction';
        label = inst.op;
        value = inst.arg !== undefined ? inst.arg : '';
        isActive = currentStep === address;
        
        // Find opcode binary string
        const opc = OPC_CODES[inst.op] || '0000';
        let argBinary = '00000000';
        if (inst.op === 'LOAD_CONST' && typeof inst.arg === 'number') {
          argBinary = (inst.arg & 0xFF).toString(2).padStart(8, '0');
        } else if (inst.op === 'LOAD_VAR' || inst.op === 'STORE_VAR' || inst.op === 'DECLARE_VAR') {
          const varName = String(inst.arg);
          const varAddr = varAddresses[varName] || 16;
          argBinary = varAddr.toString(2).padStart(8, '0');
        } else if (inst.op === 'BINARY_OP') {
          argBinary = OP_ENC[inst.arg] || '00000000';
        } else if (inst.op === 'JUMP' || inst.op === 'JUMP_IF_FALSE') {
          if (typeof inst.arg === 'number') {
            argBinary = inst.arg.toString(2).padStart(8, '0');
          }
        }
        
        binaryString = `${opc} ${argBinary.slice(0, 4)} ${argBinary.slice(4)}`;
        const fullIntVal = (parseInt(opc, 2) << 8) | parseInt(argBinary, 2);
        hexString = fullIntVal.toString(16).toUpperCase().padStart(4, '0');
        description = inst.description || `تعليمة برمجية: ${inst.op}`;
      } else {
        type = 'instruction';
        label = 'خالٍ';
        value = '';
        description = 'حجرة تعليمات برمجية شاغرة مسبقاً لم يتم حشوها بأي كود.';
      }
    }
    // 2. Data/Variable Segment (0x10 to 0x1F)
    else if (address >= 16 && address < 32) {
      // Find variable mapped to this address
      const varName = Object.keys(varAddresses).find(k => varAddresses[k] === address);
      if (varName) {
        type = 'variable';
        label = varName;
        const val = memory[varName];
        value = val !== undefined ? val : 0;
        
        // Compute binary and hex representation
        let numVal = 0;
        if (typeof value === 'number') {
          numVal = value;
        } else if (typeof value === 'boolean') {
          numVal = value ? 1 : 0;
        } else if (typeof value === 'string') {
          numVal = value.length; // fallback
        }
        
        const binPart = (numVal & 0xFFFF).toString(2).padStart(16, '0');
        binaryString = `${binPart.slice(0, 8)} ${binPart.slice(8)}`;
        hexString = (numVal & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
        description = `حجرة لحفظ بيانات المتغير [${varName}]. قيمته الحالية: [${JSON.stringify(value)}].`;
        
        // Active instruction interaction
        const curInst = instructions[currentStep];
        if (curInst) {
          if (curInst.op === 'LOAD_VAR' && curInst.arg === varName) {
            isRead = true;
          } else if ((curInst.op === 'STORE_VAR' || curInst.op === 'DECLARE_VAR') && curInst.arg === varName) {
            isWritten = true;
          }
        }
      } else {
        type = 'variable';
        label = 'غير مستغل';
        value = 0;
        description = 'مساحة الذاكرة المتغيرة (Data RAM Segment). جاهزة لحفظ عناوين المتغيرات عند الإعلان عنها.';
      }
    }
    // 3. Stack Segment (0x20 to 0x2F)
    else if (address >= 32 && address < 48) {
      const stackIndex = address - 32;
      if (stackIndex < stack.length) {
        type = 'stack';
        const stackVal = stack[stackIndex];
        label = `مكدس [${stackIndex}]`;
        value = stackVal;
        
        let numVal = 0;
        if (typeof value === 'number') {
          numVal = value;
        } else if (typeof value === 'boolean') {
          numVal = value ? 1 : 0;
        }
        
        const binPart = (numVal & 0xFFFF).toString(2).padStart(16, '0');
        binaryString = `${binPart.slice(0, 8)} ${binPart.slice(8)}`;
        hexString = (numVal & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
        description = `حجرة بالمكدس النشط لحساب العمليات (Evaluation Stack)، تحفظ قيمة التقييم: [${JSON.stringify(value)}].`;
        isActive = true;
      } else {
        type = 'stack';
        label = 'مكدس فارغ';
        value = '-';
        description = 'خلية شاغرة في مكدس التقييم والعمليات المكدسية (Stack Pool Area).';
      }
    }
    // 4. Input Output / Heap / Reserved Segment (0x30 to 0x3F)
    else {
      type = 'empty';
      label = 'غير مخصص';
      value = 0;
      description = 'مساحات توسعية مخصصة للمقاطعات وإدخال/إخراج العتاد الذكي (Reserved System RAM Block).';
    }

    return {
      address,
      addressHex,
      type,
      label,
      value,
      binaryString,
      hexString,
      description,
      isActive,
      isRead,
      isWritten
    };
  });

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
            onClick={() => setShowExplainer(true)}
            className="text-xs bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-98 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold shadow-md shadow-indigo-950/20"
          >
            <HelpCircle size={14} />
            شرح الآلة 📖
          </button>
          <button
            onClick={() => setIsDebugActive(!isDebugActive)}
            className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold border ${
              isDebugActive
                ? 'bg-amber-955/50 text-amber-400 border-amber-900/50 hover:bg-amber-950/60'
                : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDebugActive ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
            وضع التصحيح {isDebugActive ? 'نشط 🛠️' : 'مغلق ⚙️'}
          </button>
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

      {/* Input Mode Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-lg relative overflow-hidden">
        <button
          onClick={() => {
            setIsAssemblyMode(false);
            // Recompile original Al-Bayan code
            try {
              const lexer = new AlBayanLexer(code);
              const tokens = lexer.tokenize();
              const parser = new AlBayanParser(tokens);
              const ast = parser.parse();
              const compiler = new AlBayanBytecodeCompiler();
              setInstructions(compiler.compile(ast));
              resetVM();
            } catch (e: any) {
              setParseError(e.message || "فشل تحليل شفرة الكود برمجياً");
              setInstructions([]);
            }
          }}
          className={`text-center py-2 text-xs rounded-lg font-bold gap-2 flex items-center justify-center transition-all ${
            !isAssemblyMode
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-extrabold shadow-md shadow-indigo-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Code size={14} />
          شريط التعليمات للبيّان (AST Compiler)
        </button>
        <button
          onClick={() => {
            setIsAssemblyMode(true);
            const defaultAsm = assemblyInput || ASSEMBLY_PRESETS[0].code;
            if (!assemblyInput) {
              setAssemblyInput(defaultAsm);
            }
            handleAssemble(defaultAsm);
          }}
          className={`text-center py-2 text-xs rounded-lg font-bold gap-2 flex items-center justify-center transition-all ${
            isAssemblyMode
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-extrabold shadow-md shadow-cyan-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Database size={14} />
          لوحة لغة التجميع وجدول الذاكرة الثنائية (Assembly Sandbox)
        </button>
      </div>

      {isAssemblyMode && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 animate-fade-in font-sans">
          
          {/* Assembly Inputs Block (5 cols) */}
          <div className="xl:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-teal-500/10 w-full h-[3px]" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-teal-400" />
                <h5 className="text-xs font-bold text-slate-100">محرر لغة التجميع البسيطة (Assembly Compiler Editor)</h5>
              </div>
              <span className="text-[10px] bg-teal-950/50 text-teal-400 border border-teal-900/40 px-2 py-0.5 rounded font-mono">ASM_IDE_v1</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal" dir="rtl">
              اكتب تعليمات التجميع (Assembly Mnemonics) سطراً بسطر. يمكنك استعمال الأوامر مثل <code className="text-teal-300 font-mono">LOAD_CONST val</code> أو <code className="text-teal-300 font-mono">STORE_VAR var</code> أو العمليات الحسابية والوثب التكراري للتحكم الكامل.
            </p>

            {/* Template Selector dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-400 font-bold">اختيار برنامج تجميع جاهز مسبقاً:</label>
              <select
                onChange={(e) => {
                  const selectedPreset = ASSEMBLY_PRESETS[Number(e.target.value)];
                  if (selectedPreset) {
                    setAssemblyInput(selectedPreset.code);
                    handleAssemble(selectedPreset.code);
                  }
                }}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-teal-500/50 cursor-pointer font-sans"
              >
                {ASSEMBLY_PRESETS.map((p, pIdx) => (
                  <option key={pIdx} value={pIdx}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Assembly Textarea */}
            <div className="flex flex-col gap-1.5 flex-1 min-h-[240px]">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 font-bold">كود التجميع (Assembly Script):</label>
                <span className="text-[9px] text-slate-500 font-black font-mono">ASCII BYN ASM</span>
              </div>
              <textarea
                value={assemblyInput}
                onChange={(e) => setAssemblyInput(e.target.value)}
                placeholder="; اكتب تعليمات التجميع هنا..."
                className="flex-1 bg-black/60 border border-slate-850 p-4 rounded-xl text-xs font-mono text-emerald-400 outline-none focus:border-teal-500/30 custom-scrollbar leading-relaxed resize-none text-left"
                dir="ltr"
                spellCheck={false}
              />
            </div>

            {/* Execute compile/assemble button */}
            <button
              onClick={() => handleAssemble(assemblyInput)}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-900/20 active:scale-98 transition-all"
            >
              <RotateCcw size={13} className="animate-spin" style={{ animationDuration: '4s' }} />
              تجميع الشفرة ورفعها لجدول الذاكرة وبايت كود الآلة 🚀
            </button>
          </div>

          {/* Machine Binary RAM Memory Table Block (7 cols) */}
          <div className="xl:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 bg-cyan-500/10 w-full h-[3px]" />

            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-cyan-400" />
                <h5 className="text-xs font-bold text-slate-100">رقاقة الثنائيات وجدول الذاكرة النشطة (Binary RAM Memory Table)</h5>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/40">سعة الكود: {binaryMemoryMap.length} بايت</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal" dir="rtl">
              يتعرض الكود هنا للترجمة الكهروتقنية للغة الآلة الثنائية (Binary RAM). تتكون كل تعليمة من رمز تشغيل بطول 4 بت (Opcode) ثم معامل ثنائي بطول 8 بت (Operand) يمثل عنوان المتغير أو المعامل الثابت.
            </p>

            {/* RAM Grid/Table */}
            <div className="flex-1 overflow-auto max-h-[380px] custom-scrollbar border border-slate-850 rounded-xl bg-slate-950/40">
              <table className="w-full text-xs font-sans text-right" dir="rtl">
                <thead className="bg-slate-950/80 sticky top-0 border-b border-slate-850 text-slate-400 select-none text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-14 font-mono">الموقع (PC)</th>
                    <th className="py-2.5 px-3 text-center w-28 font-mono">التعليمة (Opcode)</th>
                    <th className="py-2.5 px-3 text-center w-36 font-mono">المعامل الثنائي (Operand)</th>
                    <th className="py-2.5 px-3 text-center w-20 font-mono">الست عشري (Hex)</th>
                    <th className="py-2.5 px-3">الشرح وعمل الحجرة المبرمجة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/50 font-mono">
                  {binaryMemoryMap.map((cell, idx) => {
                    const isPcActive = currentStep === idx;
                    const opBin = cell.binaryString.split(' ')[0];
                    const argBin = cell.binaryString.split(' ').slice(1).join(' ');

                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-slate-800/10 transition-colors relative ${
                          isPcActive
                            ? 'bg-cyan-950/50 text-cyan-200 font-extrabold border-y border-cyan-800/40'
                            : 'text-slate-300'
                        }`}
                      >
                        {/* Address (Offset) */}
                        <td className="py-3 px-3 text-center text-slate-500 font-bold border-l border-slate-850/40 bg-slate-950/30">
                          {isPcActive && (
                            <span className="absolute right-1 top-4 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          )}
                          0x{idx.toString(16).toUpperCase().padStart(2, '0')}
                        </td>

                        {/* Opcode Bin */}
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            opBin === '1111' ? 'bg-red-955 text-red-400 border border-red-900/40' : 'bg-indigo-955 text-indigo-400 border border-indigo-900/40'
                          }`}>
                            {opBin}
                          </span>
                        </td>

                        {/* Operand Bin */}
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-teal-955 text-teal-400 border border-teal-900/40 font-bold">
                            {argBin}
                          </span>
                        </td>

                        {/* Hex representation */}
                        <td className="py-3 px-3 text-center font-bold text-amber-400 bg-slate-950/20">
                          0x{cell.hexString}
                        </td>

                        {/* Description */}
                        <td className="py-3 px-3 text-slate-400 text-right text-[11px] font-sans" dir="rtl">
                          <span className="font-bold text-slate-100 font-mono text-xs">{cell.op}</span>{' '}
                          {cell.arg !== undefined && (
                            <span className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-500 font-bold font-mono text-[10px]">
                              {String(cell.arg)}
                            </span>
                          )}{' '}
                          - <span className="text-slate-400 text-[10px]">{cell.description}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {binaryMemoryMap.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-500 italic font-sans text-xs">
                        يرجى تجميع كود التجميع لملء مصفوفة الذاكرة الثنائية
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {parseError && (
        <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-right text-red-300 text-xs font-mono" dir="ltr">
          ⚠️ {parseError}
        </div>
      )}

      {/* RENDER THE REGISTERS DECODER BOARD */}
      {isDebugActive && instructions.length > 0 && (
         <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden animate-fade-in">
           {/* Subtle styling overlay */}
           <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/20 to-transparent w-full h-[2px]" />
           <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-70">
             <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
             <span className="text-[9px] font-mono font-bold tracking-wider text-amber-450 uppercase">DBGN_ACTIVE</span>
           </div>

           <div className="flex items-center gap-2">
             <Cpu size={16} className="text-amber-500" />
             <h5 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
               مسجلات وحدة المعالجة المركزية (CPU Registers Debugger Board)
             </h5>
           </div>

           <p className="text-[11px] text-slate-400 leading-normal font-sans text-right" dir="rtl">
             واجهة استكشاف وتدقيق تفاعلية منخفضة المستوى للآلة الافتراضية. تعكس مسجلات المعالج الحالة الدقيقة لعناوين وقيم المتغيرات قيد التشغيل في كل خطوة معالجة (Step Cycle).
           </p>

           {/* Registers grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 font-sans">
             
             {/* PC */}
             <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors">
               <span className="text-[10px] text-slate-400 font-bold block text-right">عداد البرنامج (PC)</span>
               <div className="mt-1 font-mono text-xs font-bold text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/40 text-center">
                 0x{registers.PC.toString(16).toUpperCase().padStart(2, '0')} ({registers.PC})
               </div>
               <span className="text-[9px] text-slate-500 mt-1 block text-right">مؤشر التعليمة النشطة</span>
             </div>

             {/* IR */}
             <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors col-span-2 md:col-span-1 lg:col-span-2">
               <span className="text-[10px] text-slate-400 font-bold block text-right">مسجل التعليمة (IR)</span>
               <div className="mt-1 font-mono text-xs font-bold text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/40 text-center truncate" title={registers.IR}>
                 {registers.IR}
               </div>
               <span className="text-[9px] text-slate-500 mt-1 block text-right">النوع والمعامل</span>
             </div>

             {/* AX */}
             <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors">
               <span className="text-[10px] text-slate-400 font-bold block text-right">المراكم العام (AX)</span>
               <div className="mt-1 font-mono text-xs font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/40 text-center truncate">
                 {registers.AX !== undefined ? JSON.stringify(registers.AX) : '0'}
               </div>
               <span className="text-[9px] text-slate-500 mt-1 block text-right">نواتج العمليات الحسابية</span>
             </div>

             {/* BX */}
             <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors">
               <span className="text-[10px] text-slate-400 font-bold block text-right">علامة القاعدة (BX)</span>
               <div className="mt-1 font-mono text-xs font-bold text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-900/40 text-center truncate">
                 {registers.BX !== undefined ? JSON.stringify(registers.BX) : '0'}
               </div>
               <span className="text-[9px] text-slate-500 mt-1 block text-right">آخر قيمة مستدعاة</span>
             </div>

             {/* CX */}
             <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors">
               <span className="text-[10px] text-slate-400 font-bold block text-right">مسجل العداد (CX)</span>
               <div className="mt-1 font-mono text-xs font-bold text-teal-400 bg-teal-950/30 px-2 py-0.5 rounded border border-teal-900/40 text-center">
                 {registers.CX}
               </div>
               <span className="text-[9px] text-slate-500 mt-1 block text-right">دورات المعالج المنفذة</span>
             </div>

             {/* SP */}
             <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors">
               <span className="text-[10px] text-slate-400 font-bold block text-right">مؤشر المكدس (SP)</span>
               <div className="mt-1 font-mono text-xs font-bold text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/40 text-center">
                 0x{(0x1000 + registers.SP).toString(16).toUpperCase()}
               </div>
               <span className="text-[9px] text-slate-500 mt-1 block text-right">عمق المكدس الحالي</span>
             </div>

             {/* MAR */}
             <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors">
               <span className="text-[10px] text-slate-400 font-bold block text-right">عنوان الذاكرة (MAR)</span>
               <div className="mt-1 font-mono text-xs font-bold text-sky-400 bg-sky-950/30 px-2 py-0.5 rounded border border-sky-900/40 text-center truncate">
                 {String(registers.MAR)}
               </div>
               <span className="text-[9px] text-slate-500 mt-1 block text-right">عنوان المتغير النشط</span>
             </div>

             {/* MBR */}
             <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors">
               <span className="text-[10px] text-slate-400 font-bold block text-right">حاصن العينات (MBR)</span>
               <div className="mt-1 font-mono text-xs font-bold text-fuchsia-400 bg-fuchsia-950/30 px-2 py-0.5 rounded border border-fuchsia-900/40 text-center truncate">
                 {registers.MBR !== undefined ? JSON.stringify(registers.MBR) : '0'}
               </div>
               <span className="text-[9px] text-slate-500 mt-1 block text-right">آخر قيمة قرئت/كتبت</span>
             </div>

           </div>
         </div>
      )}

      {instructions.length > 0 && (
        <>
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

        {/* INTERACTIVE LIVE MEMORY MAP EXPLORER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-xl relative overflow-hidden animate-fade-in mt-5">
          {/* Top accent line */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 via-cyan-500 to-indigo-500 w-full h-[3px]" />
          
          {/* Header and Controls */}
          <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Database className="text-emerald-400 w-5 h-5 shrink-0 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-slate-100 font-sans">خريطة الذاكرة التفاعلية للآلة الافتراضية (Interactive Live Memory Map)</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">مصفوفة خلايا الرام من العنوان 0x00 إلى 0x3F. انقر على أي خلية لاستكشافها ومراقبة التحولات الثنائية لحظياً.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-sans">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-950/40 border border-indigo-900/50 text-indigo-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                تعليمات (0x00-0x0F)
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-950/40 border border-emerald-900/50 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                متغيرات (0x10-0x1F)
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-purple-950/40 border border-purple-900/50 text-purple-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                مكدس التقييم (0x20-0x2F)
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-850 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                غير مخصص (0x30-0x3F)
              </span>
            </div>
          </div>

          {/* RAM 8x8 Grid Block (lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-8 gap-2 bg-slate-955/65 p-4 border border-slate-850 rounded-xl">
              {memoryCells.map((cell) => {
                const isCurrentPC = cell.type === 'instruction' && currentStep === cell.address;
                const isSelected = selectedCell === cell.address;
                
                // Color Scheme determining classes based on cell type & execution states
                let cellBg = "bg-slate-950/40 border-slate-900 text-slate-500 hover:border-slate-800";
                if (cell.type === 'instruction') {
                  if (isCurrentPC) {
                    cellBg = "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow shadow-cyan-950 animate-pulse font-extrabold";
                  } else if (cell.address < instructions.length) {
                    cellBg = "bg-indigo-950/30 border-indigo-900/30 text-indigo-300 hover:border-indigo-805/40";
                  } else {
                    cellBg = "bg-indigo-950/10 border-indigo-950/20 text-indigo-500/50";
                  }
                } else if (cell.type === 'variable') {
                  if (cell.isWritten) {
                    cellBg = "bg-emerald-950 border-emerald-450 text-emerald-300 shadow shadow-emerald-950 font-bold animate-pulse";
                  } else if (cell.isRead) {
                    cellBg = "bg-amber-955 border-amber-450 text-amber-300 shadow shadow-amber-955 font-bold animate-pulse";
                  } else if (cell.label !== 'غير مستغل') {
                    cellBg = "bg-emerald-950/25 border-emerald-900/30 text-emerald-300 hover:border-emerald-805/40";
                  } else {
                    cellBg = "bg-slate-950/10 border-slate-950/20 text-slate-600";
                  }
                } else if (cell.type === 'stack') {
                  if (cell.label !== 'مكدس فارغ') {
                    cellBg = "bg-purple-950/35 border-purple-900/40 text-purple-300 hover:border-purple-805/40 font-bold";
                  } else {
                    cellBg = "bg-slate-950/10 border-slate-950/20 text-slate-600";
                  }
                }

                return (
                  <button
                    key={cell.address}
                    onClick={() => setSelectedCell(isSelected ? null : cell.address)}
                    className={`h-16 rounded-lg border flex flex-col justify-between p-1.5 transition-all outline-none text-right group ${cellBg} ${
                      isSelected ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-slate-900 scale-102 z-10' : ''
                    }`}
                  >
                    <div className="flex justify-between w-full text-[8px] font-bold font-mono">
                      <span className="text-slate-500 opacity-60">
                        {cell.addressHex}
                      </span>
                      {isCurrentPC && (
                        <span className="text-cyan-400 flex items-center gap-0.5 animate-pulse">
                          PC ⚡
                        </span>
                      )}
                      {cell.isWritten && <span className="text-emerald-400 font-bold">W 📥</span>}
                      {cell.isRead && <span className="text-amber-400 font-bold">R 🔌</span>}
                    </div>

                    <div className="text-[10px] font-black truncate w-full flex-1 flex items-center justify-center font-sans tracking-tight">
                      {cell.label}
                    </div>

                    <div className="text-[8px] font-mono text-center font-bold opacity-80 truncate w-full">
                      {cell.value !== '' && cell.value !== undefined ? (
                        typeof cell.value === 'object' ? '...' : String(cell.value)
                      ) : '00'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Grid interactive state help tags */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-sans px-1">
              <div>
                💡 <span className="text-slate-300">ملاحظة:</span> الـ CPU يقوم بسحب المعطيات وتحويلها لحجرات RAM حرة وتفريغها بالمستودع.
              </div>
              <div>
                العنوان الأقصى النشط: <span className="font-mono text-cyan-400">0x3F</span>
              </div>
            </div>
          </div>

          {/* Inspect Panel Block (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-slate-950/40 border border-slate-850 rounded-xl p-4 flex flex-col gap-4 justify-between min-h-[160px]">
            {(() => {
              // Determine targeted inspection cell
              let activeInspectIdx = selectedCell;
              let activeAutoInspectLabel = "مراقب تلقائي";
              if (activeInspectIdx === null) {
                // Fallback to PC or first variables
                activeInspectIdx = currentStep < instructions.length ? currentStep : 16;
                activeAutoInspectLabel = "تتبع مباشر (PC)";
              }

              const cell = memoryCells[activeInspectIdx] || memoryCells[0];

              let typeLabel = "غير معروف";
              let typeColor = "text-slate-400 bg-slate-900 border-slate-800";
              if (cell.type === 'instruction') {
                typeLabel = "تعليمة بايت كود (Instruction Segment)";
                typeColor = "text-indigo-400 bg-indigo-950/40 border-indigo-900/30";
              } else if (cell.type === 'variable') {
                typeLabel = "واجهة بيانات المتغيرات (Data/Variable Segment)";
                typeColor = "text-emerald-400 bg-emerald-950/40 border-emerald-900/30";
              } else if (cell.type === 'stack') {
                typeLabel = "خلية مكدس التقييم (Evaluation Stack Segment)";
                typeColor = "text-purple-400 bg-purple-950/40 border-purple-900/30";
              } else {
                typeLabel = "منطقة ذاكرة فارغة (Reserved Space)";
                typeColor = "text-slate-400 bg-slate-950 border-slate-850";
              }

              return (
                <div className="flex flex-col gap-4 w-full h-full justify-between">
                  <div className="space-y-3">
                    
                    {/* Inspection Title & Tag */}
                    <div className="flex justify-between items-center font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${typeColor}`}>
                          {typeLabel}
                        </span>
                      </div>
                      <span className="text-[9px] bg-slate-800 text-slate-350 px-2 py-0.5 rounded font-mono font-bold">
                        {activeAutoInspectLabel}
                      </span>
                    </div>

                    {/* Header values */}
                    <div className="flex justify-between items-start pb-2 border-b border-slate-850">
                      <div className="font-sans">
                        <h5 className="text-xl font-mono font-black text-slate-100 flex items-center gap-2">
                          <span>{cell.addressHex}</span>
                          <span className="text-xs text-slate-500 font-sans font-bold">({cell.address})</span>
                        </h5>
                        <span className="text-[10px] text-slate-400 font-sans">العنوان الفيزيائي للخلية</span>
                      </div>
                      <div className="text-left font-sans animate-fade-in" key={cell.address}>
                        <h5 className="text-xs font-bold text-cyan-400 font-mono tracking-tight bg-slate-950 px-2 py-1 rounded border border-slate-850 truncate max-w-[120px]">
                          {cell.label}
                        </h5>
                        <span className="text-[9px] text-slate-500 block mt-0.5">معرف الحجرة</span>
                      </div>
                    </div>

                    {/* Info grid */}
                    <div className="space-y-2 text-xs font-sans">
                      
                      {/* Live Value */}
                      <div className="flex justify-between items-center p-2 bg-slate-950/80 rounded border border-slate-850/50">
                        <span className="text-slate-400">القيمة اللحظية الحالية:</span>
                        <span className="font-mono text-amber-400 font-black">
                          {cell.value !== '' && cell.value !== undefined ? (
                            typeof cell.value === 'object' ? JSON.stringify(cell.value) : String(cell.value)
                          ) : '00 (فارغ)'}
                        </span>
                      </div>

                      {/* Hex representation */}
                      <div className="flex justify-between items-center p-2 bg-slate-950/40 rounded border border-slate-850/30 font-mono text-[11px]">
                        <span className="text-slate-400 font-sans">القيمة بالست عشري (Hex):</span>
                        <span className="text-cyan-400 font-bold">0x{cell.hexString}</span>
                      </div>

                      {/* Binary registers */}
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-850/50">
                        <div className="flex justify-between items-center font-mono text-[11px] mb-1 font-sans">
                          <span className="text-slate-400 font-sans">النطاق الثنائي للخلية (Binary Mask):</span>
                          <span className="text-emerald-400 font-extrabold">{cell.binaryString}</span>
                        </div>
                        {/* Live representation of the bits inside custom microchip gates */}
                        <div className="flex gap-0.5 justify-end mt-1.5 select-none" dir="ltr">
                          {cell.binaryString.replace(/\s+/g, '').split('').map((bit, bitIdx) => (
                            <span
                              key={bitIdx}
                              className={`w-2.5 h-3.5 rounded-sm flex items-center justify-center font-mono text-[8px] font-black leading-none ${
                                bit === '1'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                                  : 'bg-slate-900 text-slate-600 border border-slate-850'
                              }`}
                              title={`Bit ${15 - bitIdx}: ${bit}`}
                            >
                              {bit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Description explainers */}
                      <p className="text-[10px] text-slate-400 bg-slate-950/30 p-2 rounded border border-slate-850/20 leading-relaxed text-right" dir="rtl">
                        💡 {cell.description}
                      </p>
                    </div>

                  </div>

                  {/* Reset custom inspect button */}
                  {selectedCell !== null && (
                    <button
                      onClick={() => setSelectedCell(null)}
                      className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 py-1.5 rounded-lg border border-slate-850 transition-colors font-sans"
                    >
                      ↩️ إلغاء التجميد والعودة للتعقب التلقائي (Auto-Follow Code)
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </>
      )}

      {instructions.length === 0 && !parseError && (
        <div className="bg-slate-900/40 p-10 rounded-2xl text-center border border-slate-800 flex flex-col items-center gap-1">
          <HelpCircle className="text-slate-600 w-12 h-12 mb-1" />
          <h5 className="text-sm font-bold text-slate-300">
            {isAssemblyMode ? "أدخل تعليمة تجميع صحيحة" : "أدخل كود بيّان برمجي سليم"}
          </h5>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            {isAssemblyMode 
              ? "بيئة المعالجة الحالية فارغة. يرجى ملء محرر لغة التجميع بتعليمات صحيحة ليتم شحن رقاقة الذاكرة." 
              : "ببيئة العمل خالية؛ يرجى ملء المحرر بكود بيّان صحيح ليتم فك شفرته معجمياً وتحويله لتعليمات معالج فوري تفاعلي."}
          </p>
        </div>
      )}

      {/* Explanation Modal pop-up (شرح الآلة الافتراضية) */}
      {showExplainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Top decorative gradient */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 via-cyan-500 to-teal-500 w-full h-[3px]" />
            
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-950/60 rounded-xl border border-indigo-900/50">
                  <Cpu className="text-indigo-400 w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-sans">الفهم التفاعلي للآلة الافتراضية لمشروع البيان (System Core & VM Explorer)</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">رحلة المعالجة الكهروميكانيكية والبرمجية من كود البيان للغة الآلة الثنائية</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExplainer(false)}
                className="text-slate-400 hover:text-red-405 hover:bg-red-950/30 bg-slate-950/50 border border-slate-850 hover:border-red-900/40 p-2 rounded-lg text-xs leading-none transition-colors"
                title="إغلاق"
              >
                ✕
              </button>
            </div>

            {/* Inner Content Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/20 px-4 pt-2 gap-2 select-none overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setExplainerTab('flow')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  explainerTab === 'flow' 
                    ? 'border-indigo-500 text-indigo-400 font-extrabold bg-indigo-950/10' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                🔄 دورة حياة التدفق (Processing Pipeline)
              </button>
              <button
                onClick={() => setExplainerTab('compiler')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  explainerTab === 'compiler' 
                    ? 'border-cyan-500 text-cyan-400 font-extrabold bg-cyan-950/10' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚙️ المترجم والبايت كود (AST to Bytecode)
              </button>
              <button
                onClick={() => setExplainerTab('registers')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  explainerTab === 'registers' 
                    ? 'border-amber-500 text-amber-400 font-extrabold bg-amber-950/10' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                🛠️ فك شفرة مسجلات المعالج (CPU Registers Decoder)
              </button>
              <button
                onClick={() => setExplainerTab('ram')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  explainerTab === 'ram' 
                    ? 'border-teal-500 text-teal-400 font-extrabold bg-teal-950/10' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                💾 خلايا الذاكرة العشوائية RAM ومكدس العمليات
              </button>
              <button
                onClick={() => {
                  setExplainerTab('tour');
                  setTourStep(1);
                  setAnimatePacket(true);
                }}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  explainerTab === 'tour' 
                    ? 'border-rose-500 text-rose-400 font-extrabold bg-rose-950/20' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                🎯 الجولة التعليمية التفاعلية (Guided Visual Tour)
              </button>
            </div>

            {/* Tab Contents Area */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 bg-slate-900/40">
              
              {/* Tab 1: Processing Flow Pipeline */}
              {explainerTab === 'flow' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl space-y-3">
                    <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      مخطط تدفق العمليات البرمجية وهندسة العبور
                    </h4>
                    <p className="text-[12px] text-slate-400 leading-relaxed text-right" dir="rtl">
                      خلال رحلة تنفيذ كود البيان، يمر النص المصدر بأربعة مراحل رئيسية حتى يتحول إلى إشارات ثنائية يتلقاها المعالج ويقوم بترجمتها، فيدفع البيانات بالمكدس أو يقرأ مواضع الذاكرة العشوائية:
                    </p>
                  </div>

                  {/* Flow Map Visual Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950 border border-slate-855 p-4 rounded-xl flex flex-col justify-between hover:border-indigo-500/20 transition-all">
                      <div className="space-y-1.5">
                        <span className="text-[10px] bg-indigo-950/80 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded font-mono font-bold leading-none">01. SOURCE</span>
                        <h5 className="text-xs font-bold text-slate-200">كود مصدري للبيّان</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed text-right">أكواد مكتوبة باللغة العربية البسيطة تصف هياكل الإيقاع والتحكم مثل <code className="text-indigo-400 font-mono text-[10px]">عرف س = ٣</code>.</p>
                      </div>
                      <span className="text-[9px] text-slate-650 mt-4 block font-mono text-left">Level: Human-readable</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-855 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/20 transition-all">
                      <div className="space-y-1.5">
                        <span className="text-[10px] bg-cyan-950/80 text-cyan-400 border border-cyan-900/40 px-2 py-0.5 rounded font-mono font-bold leading-none">02. COMPILER / AST</span>
                        <h5 className="text-xs font-bold text-slate-200">محلل المترجم (AST)</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed text-right">يقوم المعجم بفصل الكلمات، ثم يبني المحلل هيكلة شجرية متجانسة لتبويب منطق الكود وقواعده لضمان خلوه من العيوب.</p>
                      </div>
                      <span className="text-[9px] text-slate-650 mt-4 block font-mono text-left">Level: Syntactic Tree</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-855 p-4 rounded-xl flex flex-col justify-between hover:border-amber-500/20 transition-all">
                      <div className="space-y-1.5">
                        <span className="text-[10px] bg-amber-950/80 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded font-mono font-bold leading-none">03. BYTECODE REF</span>
                        <h5 className="text-xs font-bold text-slate-200">شفرة البايت كود</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed text-right">يقوم المفسر بتحويل الشجرة الثنائية لتعليمات معالجة خطية منخفضة المستوى وسريعة يتعامل معها المعالج فجأة.</p>
                      </div>
                      <span className="text-[9px] text-slate-650 mt-4 block font-mono text-left">Level: Command Sequence</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-855 p-4 rounded-xl flex flex-col justify-between hover:border-teal-500/20 transition-all">
                      <div className="space-y-1.5">
                        <span className="text-[10px] bg-teal-950/80 text-teal-400 border border-teal-900/40 px-2 py-0.5 rounded font-mono font-bold leading-none">04. CPU / RAM CORE</span>
                        <h5 className="text-xs font-bold text-slate-200">الآلة ومسجلات المعالج</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed text-right">يحول نظام الذاكرة التعليمات إلى ثنائيات بحجرات RAM، ثم يقوم الـ CPU بخطوات القراءة والتمرير والتعديل المباشر للمسجلات في الآلة.</p>
                      </div>
                      <span className="text-[9px] text-slate-650 mt-4 block font-mono text-left">Level: Hardware Simulation</span>
                    </div>
                  </div>

                  <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-xl space-y-2">
                    <h5 className="text-xs font-bold text-indigo-300">💡 الفائدة من هذا التكامل البرمجي:</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed text-right" dir="rtl">
                      بفضل هذا البناء الخطي المتدرج، تستقر لغة البيان في بيئتها البرمجية لتكافئ الصفر في نسبة تسريب الخلايا أو الذاكرة (0% Memory Leakage) وتعمل بسعر معالجة منخفض، مما يجعل التحويل من الفهم المتجرر البسيط إلى لغات البرمجة الآلية سهلاً وسريعاً للغاية.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: AST to Bytecode Compiler */}
              {explainerTab === 'compiler' && (
                <div className="space-y-5 animate-fade-in font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Source conversion card */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
                      <span className="text-[10px] text-cyan-400 font-bold block">1. التحليل القواعدي وتذويب الرموز (Syntactic Dissolution)</span>
                      <p className="text-[11px] text-slate-400 leading-normal" dir="rtl">
                        عندما يثبت المترجم صحة الكود، يتم بناء تسلسل شجري مفصل. لنفترض كتابة الكود:
                      </p>
                      <pre className="bg-black/80 text-teal-400 text-xs p-3 rounded-lg font-mono text-left" dir="ltr">
                        {`عرف المعدل = ٢٠ + ٥`}
                      </pre>
                      <p className="text-[11px] text-slate-400 leading-normal font-sans" dir="rtl">
                        سيقوم محرك البيان بالتجميعي بتشريح العملية الحسابية إلى خطوات مكدس متناهية السلاسة (Stack Operations).
                      </p>
                    </div>

                    {/* Output bytecode steps card */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
                      <span className="text-[10px] text-cyan-400 font-bold block">2. التعليمات المنخفضة المقابلة (Bayan Bytecode instructions)</span>
                      <p className="text-[11px] text-slate-400 leading-normal" dir="rtl">
                        يقوم المترجم بإخراج التعليمات المترجمة للبايت كود بالترتيب لإمداد المعالج بها:
                      </p>
                      <div className="space-y-2 font-mono text-[10px]">
                        <div className="flex justify-between items-center bg-slate-900/60 px-3 py-1.5 rounded border border-slate-850/60">
                          <span className="text-cyan-450 font-bold">LOAD_CONST 20</span>
                          <span className="text-slate-500 font-sans">; سحب القيمة 20 للمكدس</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/60 px-3 py-1.5 rounded border border-slate-855/60">
                          <span className="text-cyan-450 font-bold">LOAD_CONST 5</span>
                          <span className="text-slate-500 font-sans">; سحب القيمة 5 للمكدس</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/60 px-3 py-1.5 rounded border border-slate-855/60">
                          <span className="text-cyan-450 font-bold">BINARY_OP +</span>
                          <span className="text-slate-500 font-sans">; سحب القيمتين والجمع</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/60 px-3 py-1.5 rounded border border-slate-855/60">
                          <span className="text-cyan-450 font-bold">STORE_VAR المعدل</span>
                          <span className="text-slate-500 font-sans">; حفظ النتيجة في خلايا المتغير</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="bg-cyan-950/20 border border-cyan-900/30 p-4 rounded-xl space-y-2">
                    <h5 className="text-xs font-bold text-cyan-305">❓ لم نستعمل المعالجة المكدسية (Stack-Based Engine)؟</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed text-right" dir="rtl">
                      الآلات الافتراضية المعتمدة على المكدس (مثل JVM لـ Java أو العقل المترجم لـ WebAssembly) هي الأكثر مرونة لحفظ مساحات المعالج ونقل القيم بطريقة آمنة ومتجاوبة في الذاكرة دون إجهاد النواة الفيزيائية للحاسب.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: registers Explanation */}
              {explainerTab === 'registers' && (
                <div className="space-y-4 animate-fade-in font-sans">
                  <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
                    <h4 className="text-xs font-bold text-amber-400 mb-1">أدوات الفهم: الدليل السريع لمسجلات المعالج اللحظية</h4>
                    <p className="text-[11px] text-slate-400 leading-normal" dir="rtl">
                      المسجلات (Registers) هي حجرات تخزين بالغة السرعة والصغر مبنية في قلب المعالج نفسه. تعكس هذه اللوحة البيانات المتكاملة لتنفيذ خطوة المعالجة الحالية:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <h5 className="text-xs font-bold text-slate-200">عداد البرنامج Program Counter (PC)</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        عداد البرنامج يشير دائماً إلى رقم/عنوان التعليمة المخطط تنفيذها تالياً. عندما نتقدم بخطوة للأمام، يزيد المعالج من قيمة الـ PC بمقدار 1، إلا لو حدثت تعليمة وُثوب (JUMP) فتتغير القيمة فجأة لعنوان القفز المحدد.
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <h5 className="text-xs font-bold text-slate-200">مسجل التعليمة Instruction Register (IR)</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        يحتفظ هذا المسجل بشفرة الأمر المفكك قيد التنفيذ للتو (مثل <code className="text-cyan-400 font-mono text-[10px]">LOAD_CONST 5</code>). يعتمد عليه المعالج لتفسير نوع المهمة التي يتوجب الاستعداد للمساهمة فيها حالياً.
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-450" />
                        <h5 className="text-xs font-bold text-slate-200">المراكم الحسابي Accumulator (AX)</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        أي عمل رياضي (كالجمع والطرح والضرب) أو منطقي (كالمقارنات الشرطية) يمر ناتجه الأخير فوراً بالمرآكم الحسابي AX لشركته بكل كفاءة في التعليمات اللاحقة.
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        <h5 className="text-xs font-bold text-slate-200">مؤشرات خلايا الذاكرة (MAR / MBR)</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        الـ **MAR** يحفظ عنوان المتغير النشط حالياً في RAM، بينما الـ **MBR** فهو مخبأ وسيط يحمي البيانات القادمة من خلايا الذاكرة أو المتأهبة للكتابة والتخزين فيها بأمان تام لتسريع الاستجابة.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: RAM and Stack Explanation */}
              {explainerTab === 'ram' && (
                <div className="space-y-4 animate-fade-in font-sans">
                  <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-teal-400">بنية المكدس (Stack) وخلايا الذاكرة العشوائية (RAM)</h4>
                    <p className="text-[11px] text-slate-400 leading-normal" dir="rtl">
                      تعمل بيئة المعالجة للبيّان على عزل كامل للمنطقتين الرئيسيتين لتخزين البيانات أثناء الركض الفعلي:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* The Stack */}
                    <div className="bg-slate-950 border border-slate-855 p-4 rounded-xl space-y-2.5">
                      <span className="text-teal-400 font-bold text-xs">١. مكدس العمليات الحركي (Execution Stack)</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        يعمل بنطاق "آخر القادم، أول المغادر" (LIFO - Last In, First Out). عند تحميل الثوابت تدفع لأعلى المكدس. وعند القيام بعملية حسابية (+ / *)، يسحب المعالج العنصرين العلويين ليجمعهما، ثم يعيد دفع ناتج الجمع مجدداً لسطح المكدس.
                      </p>
                      <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg text-center font-mono text-[10px] text-slate-500">
                        [ قاع المكدس ] ➔ [ قيم المتغيرات الوسيطة ] ➔ [ القيمة العلوية النشطة ]
                      </div>
                    </div>

                    {/* RAM Memory */}
                    <div className="bg-slate-950 border border-slate-855 p-4 rounded-xl space-y-2.5">
                      <span className="text-teal-400 font-bold text-xs">٢. خلايا الذاكرة العشوائية ومواقع المتغيرات (RAM Memory Table)</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        مساحة تخزين مستقرة تحتفظ بأسماء المتغيرات كعناوين ذاكرية صريحة (مثل العنوان 0x10 أو 0x11). لا تتأثر بحركة مكدس العمليات المتقلب، وتستعملها كتعليمات مثل `STORE_VAR` أو `LOAD_VAR` لحفظ القيم أو سحبها مجدداً بحرية كاملة.
                      </p>
                      <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg text-center font-mono text-[10px] text-slate-500">
                        عنوان 0x10: [ المتغير س ] = ٥ <br />
                        عنوان 0x11: [ المتغير ص ] = ١٥
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 5: Interactive Guided Educational Tour */}
              {explainerTab === 'tour' && (
                <div className="space-y-6 animate-fade-in font-sans text-right" dir="rtl">
                  {/* Inline styles for custom path flow animations */}
                  <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes flowEast {
                      0% { left: 0%; opacity: 0.2; transform: scale(0.9); }
                      15% { opacity: 1; transform: scale(1.1); }
                      85% { opacity: 1; transform: scale(1.1); }
                      100% { left: calc(100% - 24px); opacity: 0.2; transform: scale(0.9); }
                    }
                    @keyframes flowWest {
                      0% { right: 0%; opacity: 0.2; transform: scale(0.9); }
                      15% { opacity: 1; transform: scale(1.1); }
                      85% { opacity: 1; transform: scale(1.1); }
                      100% { right: calc(100% - 24px); opacity: 0.2; transform: scale(0.9); }
                    }
                    @keyframes pulseGlow {
                      0%, 100% { border-color: rgba(244, 63, 94, 0.2); box-shadow: 0 0 5px rgba(244, 63, 94, 0.1); }
                      50% { border-color: rgba(244, 63, 94, 0.6); box-shadow: 0 0 15px rgba(244, 63, 94, 0.3); }
                    }
                    @keyframes signalBus {
                      0% { right: 8%; opacity: 0.3; }
                      20% { opacity: 1; }
                      80% { opacity: 1; }
                      100% { right: 88%; opacity: 0.3; }
                    }
                    .animate-flow-east {
                      animation: flowEast 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    }
                    .animate-flow-west {
                      animation: flowWest 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    }
                    .animate-pulse-glow {
                      animation: pulseGlow 2.5s infinite;
                    }
                    .animate-signal-bus {
                      animation: signalBus 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    }
                  `}} />

                  {/* Header */}
                  <div className="bg-slate-955/40 p-4 border border-rose-900/30 rounded-xl space-y-1.5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-rose-500/10 w-32 h-32 blur-2xl rounded-full animate-pulse" />
                    <h4 className="text-xs font-extrabold text-rose-400 flex items-center gap-2 text-right">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      </span>
                      المعبر التفاعلي الذكي (Bayan Visual Data Flow Tour)
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal text-right">
                      خذ رحلة تفاعلية بصرية خطوة بخطوة لمرافقة تعليمة البيّان الفوقية <code className="text-rose-450 font-mono text-[10px]">عرف س = ٥</code> وهي تخترق قشرة نظام الترجمة النحوية، لتتحول لحزم من البايت كود المكدسي، وصولاً لتخزينها الرمزي الثنائي داخل عتاد الذاكرة RAM وروافد مسجلات المعالج AX!
                    </p>
                  </div>

                  {/* Progressive Step Steppers */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 select-none">
                    {[
                      { num: 1, label: "١. كود المحرر", detail: "Editor Node", color: "from-rose-500 to-rose-700" },
                      { num: 2, label: "٢. المترجم و AST", detail: "Token Analysis", color: "from-rose-400 to-rose-600" },
                      { num: 3, label: "٣. بايت كود الآلة", detail: "Bytecode Generation", color: "from-indigo-500 to-indigo-700" },
                      { num: 4, label: "٤. الذاكرة والمعالج", detail: "RAM & CPU Registers", color: "from-teal-500 to-teal-700" }
                    ].map((step) => {
                      const isActive = tourStep === step.num;
                      return (
                        <button
                          key={step.num}
                          onClick={() => {
                            setTourStep(step.num);
                            setBinaryPulseActive(false);
                          }}
                          className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                            isActive
                              ? 'bg-slate-850/80 border-rose-500/50 shadow-md shadow-rose-950/20 scale-102 animate-pulse-glow z-10'
                              : 'bg-slate-950/40 border-slate-850 hover:border-slate-800 hover:bg-slate-900/40'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                              isActive ? 'bg-rose-950/65 text-rose-400 border border-rose-900/40' : 'bg-slate-900 text-slate-500'
                            }`}>
                              STEP 0{step.num}
                            </span>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-rose-500 animate-ping' : 'bg-slate-750'}`} />
                          </div>
                          <div>
                            <h5 className={`text-xs font-bold leading-tight ${isActive ? 'text-rose-450' : 'text-slate-300'}`}>
                              {step.label}
                            </h5>
                            <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{step.detail}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Step Content Frame */}
                  <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl relative overflow-hidden min-h-[350px] flex flex-col justify-between text-right">
                    
                    {/* Background Tech Net Drawing */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none" style={{ backgroundImage: 'radial-gradient(#f43f5e 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                    {/* Step 1: High Level Editor View */}
                    {tourStep === 1 && (
                      <div className="space-y-6 animate-fade-in flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] bg-rose-950/50 text-rose-450 border border-rose-900/40 px-2 py-0.5 rounded font-mono font-bold">SOURCE LEVEL :: لغة الضاد</span>
                          <h4 className="text-xs font-extrabold text-slate-100">تحميل واستكشاف النص عالي المستوى للخلية (Text Entry Tokenizing)</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            تبدأ الرحلة عندما يكتب المبرمج الكود بالكلمات العربية الصريحة. لنفترض أننا نكتب السطر <code className="text-rose-455 font-mono text-[10px]">عرف س = ٥</code>. يعمل هذا المحرر المبسط على شحن المترجم بالرموز وتحزيمها لنقلها للخطوة التالية.
                          </p>
                        </div>

                        {/* Interactive Animation Track */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 relative">
                          {/* Left Panel: Simple Editor Container */}
                          <div className="md:col-span-4 bg-slate-900 border border-slate-800 p-4 rounded-xl relative shadow-lg text-right">
                            <span className="absolute top-2 left-2 text-[8px] text-slate-600 font-mono">EDITOR.BYN</span>
                            <div className="flex items-center gap-1.5 border-b border-slate-800/60 pb-2 mb-2">
                              <span className="w-2 w-2 rounded-full bg-red-500" />
                              <span className="w-2 w-2 rounded-full bg-amber-500" />
                              <span className="w-2 w-2 rounded-full bg-green-500" />
                            </div>
                            <div className="font-mono text-xs text-right space-y-1 text-emerald-450" dir="rtl">
                              <div className="text-slate-500 text-[10px]">&lt;!-- كود البيان المصدري --&gt;</div>
                              <div><span className="text-rose-450 font-bold">مهمة</span> <span className="text-indigo-400">حساب()</span>:</div>
                              <div className="pr-4 text-slate-100 bg-rose-950/15 border-r-2 border-rose-500/50 p-1 rounded font-bold">عرف س = ٥</div>
                              <div><span className="text-rose-455 font-bold">نهاية</span></div>
                            </div>
                          </div>

                          {/* Middle Track: Transfer Lane */}
                          <div className="md:col-span-4 flex flex-col items-center justify-center relative min-h-[60px]">
                            <span className="text-[10px] text-slate-500 font-mono mb-2">ناقل الرموز (Lexer Path)</span>
                            
                            {/* Visual Lane Arrow */}
                            <div className="w-full h-[6px] bg-slate-900 border border-slate-800 rounded-full relative">
                              {/* Glowing moving dot */}
                              {animatePacket && (
                                <div className="absolute top-1/2 -mt-2 w-4 h-4 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full flex items-center justify-center animate-flow-east shadow-md shadow-rose-950">
                                  <span className="text-[8px] text-white font-black">س</span>
                                </div>
                              )}
                            </div>
                            
                            <span className="text-[9px] text-slate-400 mt-2 italic">الرمز يسير إلى شريحة المترجم</span>
                          </div>

                          {/* Right Panel: Compiler Chip Metaphor */}
                          <div className="md:col-span-4 bg-slate-900 border border-indigo-950/60 p-4 rounded-xl text-center shadow-lg relative">
                            <div className="absolute -top-2.5 left-1/2 -ml-16 bg-indigo-950 text-indigo-400 border border-indigo-900/65 text-[9px] px-2 py-0.5 rounded font-bold">
                              AL-BAYAN LEXER
                            </div>
                            <Settings className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-spin" style={{ animationDuration: '8s' }} />
                            <h5 className="text-[11px] font-bold text-slate-350">مستقبِل ومحلل المعجم الهيكلي</h5>
                            <span className="text-[10px] text-slate-500 mt-1 block">جاري معالجة الكلمات وتفكيك الحروف</span>
                          </div>
                        </div>

                        {/* Control buttons inside Card */}
                        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-850">
                          <span className="text-[10px] text-slate-500">حالة النبض: مستمر</span>
                          <button
                            onClick={() => {
                              setAnimatePacket(false);
                              setTimeout(() => setAnimatePacket(true), 50);
                            }}
                            className="bg-slate-950 hover:bg-slate-900 border border-rose-900/30 text-rose-400 text-[10px] font-bold px-3 py-1 rounded-lg transition-all"
                          >
                            🔄 إعادة إطلاق الإسقاط (Re-launch Pulse)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Tokens Analysis and AST parsing */}
                    {tourStep === 2 && (
                      <div className="space-y-5 animate-fade-in flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] bg-rose-950/50 text-rose-455 border border-rose-900/40 px-2 py-0.5 rounded font-mono font-bold">TOKENIZER & PARSER :: هضم العبارات وشجر المترجم</span>
                          <h4 className="text-xs font-extrabold text-slate-100">تحليل معجم الكلمات وبناء شجرة النحو المجرد (Abstract Syntax Tree)</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            هنا، يقوم المفكك (Lexer) بتذويب السطر إلى قطع مستقلة تدعى <span className="text-rose-450 font-bold">المشاهد المعجمية (Tokens)</span>، ثم يقوم المحلل القواعدي (Parser) بالتهامها لتخمير شجرة الكود (AST) التي تنظم الهيكل المنطقي بالتوريث كما يلي:
                          </p>
                        </div>

                        {/* Interactive Token map + Tree view visual */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch py-2">
                          
                          {/* Tokenizer Output (5 Cols) */}
                          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-850 p-3.5 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] text-slate-500 font-bold block mb-2 font-mono text-right">TOKENS OUTPUT / جدول الكلمات المفسرة:</span>
                            
                            <div className="space-y-2 font-mono text-[10px] text-right">
                              <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-850">
                                <span className="bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded font-bold font-sans">عرف</span>
                                <span className="text-slate-400">KEYWORD_DECLARE</span>
                              </div>
                              <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-850">
                                <span className="bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded font-bold">س</span>
                                <span className="text-slate-400">IDENTIFIER (س)</span>
                              </div>
                              <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-850">
                                <span className="bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded font-bold">=</span>
                                <span className="text-slate-400">OPERATOR_ASSIGN</span>
                              </div>
                              <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-850">
                                <span className="bg-emerald-950 text-emerald-450 px-1.5 py-0.5 rounded font-bold">٥</span>
                                <span className="text-slate-400">LITERAL_INTEGER (5)</span>
                              </div>
                            </div>
                            
                            <span className="text-[8px] text-slate-500 mt-2 font-sans block leading-tight text-right">شخص المترجم كل كلمة واعتبرها جزء من تركيبة برمجية قياسية</span>
                          </div>

                          {/* Graphical AST Tree Structure (7 Cols) */}
                          <div className="lg:col-span-7 bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-center items-center relative">
                            <span className="absolute top-2 left-2 text-[9px] text-slate-500 font-mono font-bold">AST SHAPE / شجرة الـ AST</span>
                            
                            {/* Graphic Representation of AST Nodes */}
                            <div className="flex flex-col items-center gap-6 w-full py-4 text-xs font-bold relative">
                              
                              {/* Assignment Node / Parent */}
                              <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-xl text-center shadow-md relative z-10 font-bold border border-amber-500/30">
                                <span className="text-[8px] bg-amber-950 text-amber-300 px-1 rounded block mb-0.5 font-mono">NODE: ASSIGN</span>
                                تخصيص القيمة (=)
                              </div>

                              {/* Connective lines representation in CSS */}
                              <div className="w-[120px] h-[30px] border-x border-b border-rose-500/20 absolute top-[43px]" />

                              <div className="flex justify-between w-[220px] mt-2 select-none">
                                {/* Left Child Node */}
                                <div className="bg-slate-900 border border-indigo-900 text-indigo-400 px-3 py-1.5 rounded-lg text-center shadow">
                                  <span className="text-[8px] text-slate-500 block mb-0.5 font-mono">LEFT_CHILD: VAR</span>
                                  س
                                </div>

                                {/* Right Child Node */}
                                <div className="bg-slate-900 border border-emerald-900 text-emerald-455 px-3 py-1.5 rounded-lg text-center shadow">
                                  <span className="text-[8px] text-slate-500 block mb-0.5 font-mono">RIGHT_CHILD: CONST</span>
                                  ٥
                                </div>
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* Step 3: Bytecode translation & Stack operations */}
                    {tourStep === 3 && (
                      <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] bg-rose-950/50 text-rose-450 border border-rose-900/40 px-2 py-0.5 rounded font-mono font-bold">BYTECODE LEVEL :: منتدى التعليمات</span>
                          <h4 className="text-xs font-extrabold text-slate-100">تحويل البنية الشجرية إلى بايت كود مفسر (Assembly Mnemonic Compilation)</h4>
                          <p className="text-[11px] text-slate-400 leading-normal">
                            يقوم مولد الأوامر بسحق شجرة الـ AST وتحويلها لمجموعة مسارات خطية تدعى البايت كود (Bytecode). فتنفيذ المطلب يتم بالتتابع المكدسي التلقائي:
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* AST to Code Converter Box */}
                          <div className="md:col-span-5 bg-slate-900 border border-slate-800 p-4 rounded-xl text-right">
                            <span className="text-[10px] text-rose-400 font-bold block mb-2 text-right">1. شجرة التحليل AST</span>
                            <div className="bg-slate-950 p-2.5 rounded-lg text-[11px] text-slate-400 text-center font-mono select-none">
                              تخصيص (=) <br />
                              ↙ ↘ <br />
                              س ٥
                            </div>
                            <span className="text-[9px] text-slate-500 block mt-2">يقوم المعالج بفرد الشجرة تسلسلياً (De-nesting structure) لإنشاء الكود الوسيط.</span>
                          </div>

                          {/* Arrow spacer with motion */}
                          <div className="md:col-span-2 flex justify-center py-2">
                            <ArrowRight className="text-rose-500 rotate-90 md:rotate-180 w-6 h-6 animate-pulse" />
                          </div>

                          {/* Produced Machine Mnemonic Container */}
                          <div className="md:col-span-5 bg-slate-900 border border-indigo-900/30 p-4 rounded-xl text-right">
                            <span className="text-[10px] text-indigo-400 font-bold block mb-2 text-right">2. تعليمات بايت كود البيّان (Compiled Instructions)</span>
                            
                            <div className="space-y-2 font-mono text-[10px] text-right">
                              <div className="bg-slate-950 p-2 rounded border-r-2 border-indigo-500/60 font-bold">
                                <span className="text-indigo-400 font-black">LOAD_CONST</span> <span className="text-amber-500 font-bold">5</span>
                                <span className="text-[9px] text-slate-500 block mt-1 font-sans">; يدفع الرقم 5 بمكدس المفسر</span>
                              </div>
                              <div className="bg-slate-950 p-2 rounded border-r-2 border-indigo-500/60 font-bold">
                                <span className="text-indigo-400 font-black">STORE_VAR</span> <span className="text-emerald-450 font-bold">س</span>
                                <span className="text-[9px] text-slate-500 block mt-1 font-sans">; يسحب 5 ويخزنها بالمتغير س</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-850 p-3 rounded-lg text-[11px] text-slate-400 text-right leading-relaxed">
                          💡 **أهمية مرحلة البايت كود:** تجعل الكود مستعداً تماماً لترجمته في الحال لثنائيات الآلة (0 و 1) ليعمل في خلايا المعالج ومواقع الذاكرة فورا بمقام زمني متناهي القصر.
                        </div>
                      </div>
                    )}

                    {/* Step 4: Machine RAM and CPU Registers decoder with dynamic interactive pulse */}
                    {tourStep === 4 && (
                      <div className="space-y-5 animate-fade-in flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] bg-rose-950/50 text-rose-455 border border-rose-900/40 px-2 py-0.5 rounded font-mono font-bold">RAM & CPU CORE :: عتاد الآلة ومسجلاتها</span>
                          <h4 className="text-xs font-extrabold text-slate-100">غمر الذاكرة العشوائية RAM ومسجلات المعالج بالنبضات الثنائية (Signal Bus Execution)</h4>
                          <p className="text-[11px] text-slate-400 leading-normal">
                            في المرحلة الفيزيائية الختامية، تترجم الأوامر من بايت كود للغة الآلة الثنائية (Opcodes & Operand binary bits). اضغط وتفاعل مع النبضة لترى النبضة الحسابية الثنائية وهي تسير من حجرة الذاكرة العشوائية RAM إلى قلب مسجلات الـ CPU!
                          </p>
                        </div>

                        {/* Interactive Motherboard Board Rendering */}
                        <div className="bg-slate-950/90 border border-slate-850 p-4 rounded-xl flex flex-col relative overflow-hidden min-h-[170px] justify-center shadow-lg">
                          
                          {/* Bus circuit lines backglow */}
                          <div className="absolute inset-x-8 top-[85px] h-[3px] bg-slate-800 border-t border-slate-900 rounded-full" />
                          
                          {/* Animated Signal Packet Bus */}
                          {binaryPulseActive && (
                            <div className="absolute top-[73px] h-6 px-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-mono rounded-full font-black flex items-center justify-center animate-signal-bus shadow-md shadow-rose-950 z-20 select-none">
                              <span className="animate-pulse">0010 00000101 (BIN DATA) ⚡</span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch relative z-10">
                            
                            {/* Left Box: RAM Chips (4 cols) */}
                            <div className="md:col-span-4 bg-slate-900 border border-slate-800 p-3 rounded-lg text-center flex flex-col justify-between relative shadow-md">
                              <div>
                                <span className="text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-bold">RAM BANK / الذاكرة</span>
                                <h5 className="text-[11px] font-bold text-slate-300 mt-1.5">حجرات خلايا العناوين</h5>
                              </div>
                              <div className="border border-slate-950 bg-black/50 p-1.5 rounded-lg text-[10px] font-mono text-left space-y-1" dir="ltr">
                                <div className="flex justify-between bg-emerald-950/20 p-1 rounded border border-emerald-900/30">
                                  <span className="text-slate-500 text-[9px]">Addr 0x00:</span>
                                  <span className="text-emerald-400 font-bold ml-1">0010 00000101</span>
                                </div>
                                <div className="flex justify-between p-1 text-slate-600">
                                  <span className="text-[9px]">Addr 0x01:</span>
                                  <span className="ml-1">0011 00000001</span>
                                </div>
                              </div>
                              <span className="text-[8px] text-slate-500 font-sans block mt-1">تضم الذاكرة الأوامر بصورة رقمية كاملة</span>
                            </div>

                            {/* Middle Bus track Label (4 cols) */}
                            <div className="md:col-span-4 flex flex-col justify-center items-center min-h-[40px] text-center select-none">
                              <span className="text-[9px] text-amber-400 font-bold bg-amber-950/50 border border-amber-900/40 px-2 py-0.5 rounded mb-1 font-mono">BUS LINE NETWORK</span>
                              <span className="text-[10px] text-slate-450 leading-snug">خطوط الربط الكهروتقنية لنقل البيانات</span>
                              {binaryPulseActive ? (
                                <span className="text-[8.5px] text-rose-400 font-bold animate-pulse mt-1">النبض جارٍ... نترقب استجابة المعالج</span>
                              ) : (
                                <span className="text-[8px] text-slate-500 select-none mt-1">اضغط على الزر تحت المذربورد لإثارة النبضة</span>
                              )}
                            </div>

                            {/* Right Box: CPU Chip with AX (4 cols) */}
                            <div className="md:col-span-4 bg-slate-900 border border-slate-800 p-3 rounded-lg text-center flex flex-col justify-between relative shadow-md">
                              <div>
                                <span className="text-[8px] bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">CPU CHIP / المعالج</span>
                                <h5 className="text-[11px] font-bold text-slate-300 mt-1.5">رقاقة وحدة النواة الحسابية</h5>
                              </div>
                              <div className="border border-slate-950 bg-black/50 p-1.5 rounded-lg text-[9.5px] font-mono text-left space-y-1" dir="ltr">
                                <div className="flex justify-between border-b border-slate-900 pb-0.5">
                                  <span className="text-slate-500">PC (عداد):</span>
                                  <span className="text-amber-400 font-bold">0x00</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">AX (المراكم):</span>
                                  <span className={`px-1 rounded transition-colors ${binaryPulseActive ? 'bg-rose-950 text-rose-450 font-black text-[10px]' : 'text-slate-200'}`}>
                                    {binaryPulseActive ? '5 ⚡' : '0'}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[8px] text-slate-500 font-sans block mt-1">تنعكس القيم اللحظية بمسجل المراكم AX</span>
                            </div>

                          </div>
                        </div>

                        {/* Fire interactive trigger */}
                        <div className="flex justify-between items-center bg-slate-900/50 p-3.5 rounded-xl border border-slate-850">
                          <span className="text-[10px] text-slate-400">تفاعل لإظهار كيف يعمل المعقب المادي للناقلات</span>
                          <button
                            onClick={() => {
                              setBinaryPulseActive(false);
                              setTimeout(() => {
                                setBinaryPulseActive(true);
                              }, 30);
                            }}
                            className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-650 active:scale-98 text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-rose-950/20 flex items-center gap-1.5"
                          >
                            ⚡ تشغيل نبض الشحنة الثنائية للناقل (Fire Bus Signal)
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Stepper Footer/Navigation */}
                  <div className="flex justify-between items-center bg-slate-955/50 p-4 rounded-xl border border-slate-850 select-none">
                    <button
                      disabled={tourStep === 1}
                      onClick={() => {
                        setTourStep(prev => Math.max(1, prev - 1));
                        setBinaryPulseActive(false);
                      }}
                      className="bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:bg-slate-900 text-xs font-bold px-4 py-2 rounded-lg transition-all"
                    >
                      ← المرحلة السابقة (Back)
                    </button>
                    <span className="text-xs text-slate-500 font-mono font-bold">
                      {tourStep} / 4
                    </span>
                    <button
                      disabled={tourStep === 4}
                      onClick={() => {
                        setTourStep(prev => Math.min(4, prev + 1));
                        setBinaryPulseActive(false);
                      }}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow shadow-rose-950/20"
                    >
                      المرحلة التالية (Next) →
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer containing quick close */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center select-none">
              <span className="text-[10px] text-slate-500 font-mono">CORE_VM_V2 :: BYN_COMPILER</span>
              <button
                onClick={() => setShowExplainer(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-1.5 px-4 rounded-lg shadow-md hover:shadow-indigo-900/30 transition-all font-sans"
              >
                حسناً، فهمت العلاقة التكميلية! العودة للآلة 🎯
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
