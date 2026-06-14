import { ASTNode } from "../types";

export interface BytecodeInstruction {
  index: number;
  op: string;
  arg?: any;
  line: number;
  description: string;
}

/**
 * Al-Bayan AST to Flat Bytecode Compiler
 */
export class AlBayanBytecodeCompiler {
  private instructions: BytecodeInstruction[] = [];
  private loopIdCounter = 0;

  private emit(op: string, arg: any, line: number, description: string) {
    this.instructions.push({
      index: this.instructions.length,
      op,
      arg,
      line,
      description
    });
  }

  public compile(ast: ASTNode): BytecodeInstruction[] {
    this.instructions = [];
    this.loopIdCounter = 0;
    try {
      this.compileNode(ast);
    } catch (e: any) {
      this.emit("HALT", e.message || "خطأ غير متوقع", 0, "إيقاف قهري بسبب خطأ داخلي");
    }
    return this.instructions;
  }

  private compileNode(node: ASTNode) {
    if (!node) return;

    switch (node.type) {
      case "Program":
      case "Block":
        if (Array.isArray(node.body)) {
          node.body.forEach((child) => this.compileNode(child));
        }
        break;

      case "VariableDeclaration":
        this.emit(
          "DECLARE_VAR",
          node.name,
          node.line,
          `تعريف مساحة للمتغير جديد باسم: ${node.name}`
        );
        if (node.initializer) {
          this.compileNode(node.initializer);
          this.emit(
            "STORE_VAR",
            node.name,
            node.line,
            `إسناد القيمة الناتجة من المكدس للمتغير: ${node.name}`
          );
        }
        break;

      case "AssignmentExpression":
        this.compileNode(node.value);
        this.emit(
          "STORE_VAR",
          node.name,
          node.line,
          `تحديث قيمة المتغير ${node.name} ببلع القيمة من قمة المكدس`
        );
        break;

      case "PrintStatement":
        this.compileNode(node.expression);
        this.emit(
          "PRINT",
          undefined,
          node.line,
          `سحب القيمة من قمة المكدس وطباعتها على الشاشة`
        );
        break;

      case "LiteralNode":
        this.emit(
          "LOAD_CONST",
          node.value,
          node.line,
          `تحميل الثابت إلى المكدس: ${typeof node.value === 'string' ? `"${node.value}"` : node.value}`
        );
        break;

      case "IdentifierNode":
        this.emit(
          "LOAD_VAR",
          node.name,
          node.line,
          `تحميل قيمة المتغير [${node.name}] ووضعها على المكدس`
        );
        break;

      case "BinaryExpression":
        // Compile left first (pushed first)
        this.compileNode(node.left);
        // Compile right (pushed second)
        this.compileNode(node.right);
        // Operator
        const opNameMap: Record<string, string> = {
          "+": "جمع (+)",
          "-": "طرح (-)",
          "*": "ضرب (*)",
          "/": "قسمة (/)",
          "==": "مقارنة تطابق (==)",
          "!=": "مقارنة عدم تطابق (!=)",
          "<": "أصغر من (<)",
          ">": "أكبر من (>)",
          "<=": "أصغر أو يساوي (<=)",
          ">=": "أكبر أو يساوي (>=)",
        };
        this.emit(
          "BINARY_OP",
          node.operator,
          node.line,
          `سحب المدخلين العلويين وإجراء عملية: ${opNameMap[node.operator] || node.operator}`
        );
        break;

      case "IfStatement": {
        // Compile condition
        this.compileNode(node.condition);
        
        // Setup placeholder for jump if false
        const jumpIfFalseIdx = this.instructions.length;
        this.emit(
          "JUMP_IF_FALSE",
          -1,
          node.line,
          `طرد قمة المكدس؛ إذا كانت 'خطأ' سيتم الهروب للشرط التالي أو نهاية البنية`
        );

        // Compile Then branch
        this.compileNode(node.thenBranch);

        if (node.elseBranch) {
          // Unconditional JUMP to skip Else
          const jumpEndIdx = this.instructions.length;
          this.emit("JUMP", -1, node.line, `إتمام غلق فرع 'اذا' والقفز لتخطي فرع 'وإلا'`);

          // Patch JumpIfFalse placeholder to the block AFTER the unconditional JUMP (beginning of Else)
          const elseStartIdx = this.instructions.length;
          this.instructions[jumpIfFalseIdx].arg = elseStartIdx;

          // Compile Else branch
          this.compileNode(node.elseBranch);

          // Patch Jump unconditional to the index after Else
          const endIdx = this.instructions.length;
          this.instructions[jumpEndIdx].arg = endIdx;
        } else {
          // No Else branch, just patch jumpIfFalse to skip the then branch
          const endIdx = this.instructions.length;
          this.instructions[jumpIfFalseIdx].arg = endIdx;
        }
        break;
      }

      case "RepeatLoop": {
        const loopId = this.loopIdCounter++;
        const counterName = `_vm_repeat_count_${loopId}`;

        // Initialize Counter: LOAD_CONST count, STORE_VAR counter
        this.compileNode(node.count);
        this.emit("DECLARE_VAR", counterName, node.line, `خزان داخلي لدورات التكرار [${counterName}]`);
        this.emit("STORE_VAR", counterName, node.line, `شحن خزان التكرار بالقيمة البدئية`);

        // Start index
        const startIdx = this.instructions.length;

        // Condition check: LOAD_VAR counter, LOAD_CONST 0, BINARY_OP >, JUMP_IF_FALSE end
        this.emit("LOAD_VAR", counterName, node.line, `تحميل قيمة عدّاد التكرار [${counterName}]`);
        this.emit("LOAD_CONST", 0, node.line, `تحميل نهاية مؤشر التكرار (0)`);
        this.emit("BINARY_OP", ">", node.line, `فحص: هل بقي تكرار متبقي؟`);
        
        const jumpIfFalseIdx = this.instructions.length;
        this.emit("JUMP_IF_FALSE", -1, node.line, `انتهاء لفات التكرار المبرمجة؛ خروج خارج تكرار`);

        // Compile body
        this.compileNode(node.body);

        // Decrement step: LOAD_VAR counter, LOAD_CONST 1, BINARY_OP -, STORE_VAR counter
        this.emit("LOAD_VAR", counterName, node.line, `سحب دورة متممة متبقية من [${counterName}]`);
        this.emit("LOAD_CONST", 1, node.line, `قيمة الخطوة التنازلية (1)`);
        this.emit("BINARY_OP", "-", node.line, `خصم خطوة تكرار`);
        this.emit("STORE_VAR", counterName, node.line, `تخزين القيمة المنقوصة بالعدّاد`);

        // JUMP to loop start
        this.emit("JUMP", startIdx, node.line, `إتمام لفّة والقفز المرتد لبداية الفحص`);

        // Patch loop end
        const endIdx = this.instructions.length;
        this.instructions[jumpIfFalseIdx].arg = endIdx;
        break;
      }

      case "ForLoop": {
        const loopVar = node.variable;

        // Init: compile low, STORE_VAR loopVar
        this.compileNode(node.low);
        this.emit("DECLARE_VAR", loopVar, node.line, `تعريف متغير دوران حلقة الفترات: ${loopVar}`);
        this.emit("STORE_VAR", loopVar, node.line, `شحن متغير الحلقة بالبداية المجالية`);

        // Start index
        const startIdx = this.instructions.length;

        // Condition: LOAD_VAR loopVar, compile high, BINARY_OP <, JUMP_IF_FALSE end
        this.emit("LOAD_VAR", loopVar, node.line, `سحب المعرّج الحالي [${loopVar}] للفحص`);
        this.compileNode(node.high);
        this.emit("BINARY_OP", "<", node.line, `التحقق الدوار: هل مؤشر المجال لم يتجاوز السقف؟`);

        const jumpIfFalseIdx = this.instructions.length;
        this.emit("JUMP_IF_FALSE", -1, node.line, `انقضاء سقف الدورة المجالية؛ خروج للمستويات التالية`);

        // Compile Body
        this.compileNode(node.body);

        // Step: LOAD_VAR loopVar, LOAD_CONST 1, BINARY_OP +, STORE_VAR loopVar
        this.emit("LOAD_VAR", loopVar, node.line, `تحميل المعرج الدائر للخطوة التصاعدية`);
        this.emit("LOAD_CONST", 1, node.line, `خطوة الحركة الصاعدة (1)`);
        this.emit("BINARY_OP", "+", node.line, `زيادة عدّاد الدورة الموجهة`);
        this.emit("STORE_VAR", loopVar, node.line, `إرساء القيمة الجديدة للمعوج`);

        // JUMP back
        this.emit("JUMP", startIdx, node.line, `الرجوع لتحديث حالة المجال الدوار`);

        // Patch end
        const endIdx = this.instructions.length;
        this.instructions[jumpIfFalseIdx].arg = endIdx;
        break;
      }

      case "CallExpression": {
        // Compile arguments from first to last
        if (Array.isArray(node.arguments)) {
          node.arguments.forEach((arg) => this.compileNode(arg));
        }

        // Determine callee name
        let calleeName = "مهمة_مجهولة";
        if (typeof node.callee === "string") {
          calleeName = node.callee;
        } else if (node.callee && node.callee.type === "IdentifierNode") {
          calleeName = node.callee.name;
        } else if (node.callee && node.callee.type === "MemberExpression") {
          // e.g. "أندرويد.زر" -> object.name + "." + property
          const obj = node.callee.object?.name || "كائن";
          const prop = node.callee.property || "أثر";
          calleeName = `${obj}.${prop}`;
        }

        this.emit(
          "CALL_SYS",
          { name: calleeName, argCount: node.arguments?.length || 0 },
          node.line,
          `استدعاء دالة النظام/المهمة [${calleeName}] بـ (${node.arguments?.length || 0}) وسائط`
        );
        break;
      }

      case "ExpressionStatement":
        this.compileNode(node.expression);
        break;

      default:
        this.emit(
          "NOP",
          undefined,
          node.line || 0,
          `عملية شكلية غير مدعومة بالآلة الافتراضية حالياً [${node.type}]`
        );
        break;
    }
  }
}

/**
 * Al-Bayan Virtual Machine Simulator
 */
export class AlBayanVMInterpreter {
  private instructions: BytecodeInstruction[] = [];
  private pc = 0;
  private stack: any[] = [];
  private memory: Record<string, any> = {};
  private logs: string[] = [];
  private maxExecutionCycles = 1000; // anti-loop protection

  constructor(instructions: BytecodeInstruction[]) {
    this.instructions = instructions;
  }

  public run(): { output: string[]; variables: Record<string, any>; cycles: number } {
    this.pc = 0;
    this.stack = [];
    this.memory = {};
    this.logs = [];
    let cycles = 0;

    this.logs.push("🚀 تم تهيئة الـ Al-Bayan Virtual Machine بنجاح ببيئة افتراضية نقية.");

    while (this.pc < this.instructions.length && cycles < this.maxExecutionCycles) {
      const inst = this.instructions[this.pc];
      this.executeInstruction(inst);
      cycles++;
    }

    if (cycles >= this.maxExecutionCycles) {
      this.logs.push(`⚠️ إيقاف طارئ: تم بلوغ الحد الأقصى للمحاكاة (${this.maxExecutionCycles} دورة) لمنع تجمد المتصفح.`);
    } else {
      this.logs.push("🏁 تم إنهاء محاكاة تشغيل الأكواد وبلوغ نهاية البايت كود بنجاح.");
    }

    return {
      output: this.logs,
      variables: this.memory,
      cycles
    };
  }

  private executeInstruction(inst: BytecodeInstruction) {
    const { op, arg, line } = inst;
    this.pc++; // Advance by default

    switch (op) {
      case "DECLARE_VAR":
        // Initialize variable as undefined if not exists
        if (!(arg in this.memory)) {
          this.memory[arg] = 0;
        }
        break;

      case "LOAD_CONST":
        this.stack.push(arg);
        break;

      case "STORE_VAR": {
        const val = this.stack.pop();
        this.memory[arg] = val;
        break;
      }

      case "LOAD_VAR": {
        const val = this.memory[arg];
        this.stack.push(val !== undefined ? val : 0);
        break;
      }

      case "BINARY_OP": {
        const right = this.stack.pop();
        const left = this.stack.pop();
        let result: any = 0;

        switch (arg) {
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
        this.stack.push(result);
        break;
      }

      case "PRINT": {
        const val = this.stack.pop();
        this.logs.push(`[شاشة المخرجات] 💻: ${val}`);
        break;
      }

      case "JUMP":
        this.pc = arg; // branch destination
        break;

      case "JUMP_IF_FALSE": {
        const val = this.stack.pop();
        if (!val) {
          this.pc = arg;
        }
        break;
      }

      case "CALL_SYS": {
        const callInfo = arg as { name: string; argCount: number };
        const args: any[] = [];
        for (let i = 0; i < callInfo.argCount; i++) {
          args.unshift(this.stack.pop());
        }

        if (callInfo.name === "اطبع") {
          this.logs.push(`[لوحة مخرجات النظام] 📢: ${args.join(" ")}`);
        } else {
          this.logs.push(`⚙️ [استدعاء API نظام]: تم تسييل وظيفة النواة (${callInfo.name}) بالمعاملات: [${args.join(", ")}]`);
        }
        // push dummy return value
        this.stack.push("تم_بنجاح");
        break;
      }

      case "NOP":
      default:
        // Do nothing
        break;
    }
  }
}
