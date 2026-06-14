import { ASTNode } from "../types";

export interface WasmInstruction {
  wat: string;
  comment: string;
  line: number;
}

/**
 * Al-Bayan modern compiler to WebAssembly Text Format (WASM - WAT)
 */
export class AlBayanWasmCompiler {
  private watLines: WasmInstruction[] = [];
  private indentation = 2;
  private localVariables = new Set<string>();

  private getIndent(): string {
    return " ".repeat(this.indentation);
  }

  private emit(wat: string, comment: string, line: number) {
    this.watLines.push({
      wat: `${this.getIndent()}${wat}`,
      comment,
      line
    });
  }

  public compile(ast: ASTNode): string {
    this.watLines = [];
    this.localVariables.clear();
    this.indentation = 0;

    // 1. Module Header
    this.emit("(module", ";; بداية الموديل الأصلي للغة البيان المجمع", 1);
    this.indentation = 2;

    // 2. Declaration of standard system library imports (e.g., printing numbers, strings)
    this.emit('(import "env" "اطبع_رقم" (func $print_i32 (param i32)))', ";; استيراد دالة طباعة الأرقام الصافية", 1);
    this.emit('(import "env" "اطبع_منطقي" (func $print_bool (param i32)))', ";; استيراد دالة طباعة القيم المنطقية", 1);

    // 3. Collect active local variables first to declare them in WebAssembly function header
    const locals: string[] = [];
    this.collectLocals(ast, locals);
    locals.forEach(v => this.localVariables.add(v));

    // 4. Main Exported Function definition
    this.emit("(func $main (export \"main\")", ";; الدالة المعيارية الرئيسية لتشغيل كتل الأوامر", ast.line || 1);
    this.indentation = 4;

    // Declare WebAssembly locals in function header
    this.localVariables.forEach(varName => {
      this.emit(`(local $${varName} i32)`, `;; حجز متغير محلي أصيل من نوع 32-بت للمتغير: ${varName}`, ast.line || 1);
    });

    // 5. Compile body nodes
    this.compileNode(ast);

    // Close function
    this.indentation = 2;
    this.emit(")", ";; نهاية الدالة الرئيسية", ast.line || 1);

    // Close module
    this.indentation = 0;
    this.emit(")", ";; نهاية ملف تصريف الموديل ثنائي التجميع", ast.line || 1);

    // Build formatted string
    let result = "";
    this.watLines.forEach(line => {
      const formattedWat = line.wat.padEnd(45, " ");
      result += `${formattedWat} ${line.comment ? `${line.comment}` : ""}\n`;
    });

    return result;
  }

  private collectLocals(node: ASTNode, locals: string[]) {
    if (!node) return;
    if (node.type === "Program" || node.type === "Block") {
      if (Array.isArray(node.body)) {
        node.body.forEach(child => this.collectLocals(child, locals));
      }
    } else if (node.type === "VariableDeclaration") {
      if (node.name && !locals.includes(node.name)) {
        locals.push(node.name);
      }
    } else if (node.type === "ForLoop") {
      if (node.iterator && !locals.includes(node.iterator)) {
        locals.push(node.iterator);
      }
      this.collectLocals(node.body, locals);
    } else if (node.type === "RepeatLoop") {
      // Loop counter
      const counterName = `repeat_counter_${node.line || 0}`;
      if (!locals.includes(counterName)) {
        locals.push(counterName);
      }
      this.collectLocals(node.body, locals);
    } else if (node.type === "IfStatement") {
      this.collectLocals(node.thenBranch, locals);
      this.collectLocals(node.elseBranch, locals);
    }
  }

  private compileNode(node: ASTNode) {
    if (!node) return;

    switch (node.type) {
      case "Program":
      case "Block":
        if (Array.isArray(node.body)) {
          node.body.forEach(child => this.compileNode(child));
        }
        break;

      case "VariableDeclaration":
        if (node.initializer) {
          this.compileNode(node.initializer);
          this.emit(`local.set $${node.name}`, `;; تخزين القيمة النهائية في محدد المتغير: ${node.name}`, node.line);
        } else {
          this.emit("i32.const 0", ";; إعداد القيمة الافتراضية للصفر", node.line);
          this.emit(`local.set $${node.name}`, `;; تخزين القيمة الأولية للمتغير: ${node.name}`, node.line);
        }
        break;

      case "AssignmentExpression":
        this.compileNode(node.value);
        this.emit(`local.set $${node.name}`, `;; تحديث قيمة المتغير الحالي: ${node.name}`, node.line);
        break;

      case "LiteralNode":
        if (typeof node.value === "number") {
          this.emit(`i32.const ${Math.floor(node.value)}`, `;; تحميل الثابت العددي: ${node.value}`, node.line);
        } else if (typeof node.value === "boolean") {
          this.emit(`i32.const ${node.value ? 1 : 0}`, `;; شحن الحالة المنطقية: ${node.value ? "حقيقة" : "كذب"}`, node.line);
        } else {
          // strings are represented as memory offsets/dummies in basic direct translation
          this.emit(`i32.const 0`, `;; مصفوفة نصوص مدمجة (مؤشر الذاكرة)`, node.line);
        }
        break;

      case "IdentifierNode":
        if (this.localVariables.has(node.name)) {
          this.emit(`local.get $${node.name}`, `;; جلب واسترجاع قيمة المتغير: ${node.name}`, node.line);
        } else {
          this.emit(`i32.const 0`, `;; متغير مجهول أو خارجي (${node.name}) تم تمثيله بالصفر لتفادي الانهيار`, node.line);
        }
        break;

      case "BinaryExpression":
        this.compileNode(node.left);
        this.compileNode(node.right);

        switch (node.operator) {
          case "+":
            this.emit("i32.add", ";; إجراء عملية الجمع الثنائي للأعداد الصحيحة", node.line);
            break;
          case "-":
            this.emit("i32.sub", ";; إجراء عملية الطرح الثنائي للأعداد الصحيحة", node.line);
            break;
          case "*":
            this.emit("i32.mul", ";; إجراء عملية الضرب الثنائي الميكانيكي", node.line);
            break;
          case "/":
            this.emit("i32.div_s", ";; إجراء عملية القسمة الصحيحة الموجهة", node.line);
            break;
          case "==":
            this.emit("i32.eq", ";; فحص المطابقة المنطقية للأرقام", node.line);
            break;
          case "!=":
            this.emit("i32.ne", ";; فحص الاختلاف المنطقي الدقيق", node.line);
            break;
          case "<":
            this.emit("i32.lt_s", ";; فحص: هل المعامل الأول أصغر من الثاني؟", node.line);
            break;
          case ">":
            this.emit("i32.gt_s", ";; فحص: هل المعامل الأول أكبر من الثاني؟", node.line);
            break;
          case "<=":
            this.emit("i32.le_s", ";; فحص: هل المعامل الأول أصغر أو يساوي الثاني؟", node.line);
            break;
          case ">=":
            this.emit("i32.ge_s", ";; فحص: هل المعامل الأول أكبر أو يساوي الثاني؟", node.line);
            break;
        }
        break;

      case "PrintStatement":
        this.compileNode(node.expression);
        // Simple type inference: check if expression evaluates logically or mathematically
        this.emit("call $print_i32", ";; استدعاء نظام الإخراج المعياري لطباعة القيمة المكدسة", node.line);
        break;

      case "IfStatement": {
        // Compile condition first
        this.compileNode(node.condition);
        this.emit("if", ";; تفريع التحديد الشرطي للبايت كود الموجه", node.line);
        
        this.indentation += 2;
        this.compileNode(node.thenBranch);
        
        if (node.elseBranch) {
          this.indentation -= 2;
          this.emit("else", ";; مسار النفي البديل (وإلا) في حوض السيطرة", node.line);
          this.indentation += 2;
          this.compileNode(node.elseBranch);
        }
        
        this.indentation -= 2;
        this.emit("end", ";; قفل كتلة التفريع الشرطي الحالي", node.line);
        break;
      }

      case "ForLoop": {
        const loopVar = node.variable;
        
        // 1. Initialize Loop variable
        this.compileNode(node.low);
        this.emit(`local.set $${loopVar}`, `;; شحن متغير الحلقة بالمدى البدئي: ${loopVar}`, node.line);

        // 2. Loop block
        this.emit("block", ";; حاوية حصر دورة الدوران", node.line);
        this.emit("loop $for_loop_block", ";; بداية دوران حلقة الفترات المباشرة", node.line);
        this.indentation += 2;

        // Condition checking: loopVar < high
        this.emit(`local.get $${loopVar}`, `;; جلب المعرج النشط: ${loopVar}`, node.line);
        this.compileNode(node.high);
        this.emit("i32.ge_s", ";; فحص: هل المعرج تجاوز النهاية المجالية الحاكمة؟", node.line);
        this.emit("br_if 1", ";; في حال تجاوز المدى؛ اقطع الدورة واهرب للخارج", node.line);

        // Compile Body
        this.compileNode(node.body);

        // Increment: loopVar = loopVar + 1
        this.emit(`local.get $${loopVar}`, `;; قراءة القيمة الحالية استعداداً للحركة الصاعدة`, node.line);
        this.emit("i32.const 1", ";; قيمة معيار القفز (1)", node.line);
        this.emit("i32.add", ";; تذويب الزيادة في السجل الخلوي", node.line);
        this.emit(`local.set $${loopVar}`, `;; تخزين المعرج التصاعدي الدائم لـ: ${loopVar}`, node.line);

        // Continue looping
        this.emit("br 0", ";; قفز مرتد فوري للبدء بلفّة دوران تالية نشطة", node.line);

        this.indentation -= 2;
        this.emit("end", ";; تصفية كلاسيكية للدورة الداخلية", node.line);
        this.emit("end", ";; إتمام غلق كتلة المعاينة لمجالات التكرار", node.line);
        break;
      }

      case "RepeatLoop": {
        const counterName = `repeat_counter_${node.line || 0}`;

        // Initialize Counter: counter = timesCount
        this.compileNode(node.count);
        this.emit(`local.set $${counterName}`, `;; شحن خزان لفات التكرار [${counterName}]`, node.line);

        this.emit("block", ";; غطاء حلقة التكرار التكراري", node.line);
        this.emit("loop $repeat_loop_block", ";; انطلاقة كتلة تكرار البيان التنازلية", node.line);
        this.indentation += 2;

        // Condition Check: counter <= 0, then break
        this.emit(`local.get $${counterName}`, `;; تفحص التعداد المتبقي بـ [${counterName}]`, node.line);
        this.emit("i32.const 0", ";; نقطة الصفر المنتهية", node.line);
        this.emit("i32.le_s", ";; التحقق: هل استهلكت جميع اللفات المأذونة؟", node.line);
        this.emit("br_if 1", ";; فك التكرار فوراً لصفرية لفائف العد الإرادي", node.line);

        // Body
        this.compileNode(node.body);

        // Decrement: counter = counter - 1
        this.emit(`local.get $${counterName}`, `;; جلب قيمة التعداد للإنقاص الرأسي`, node.line);
        this.emit("i32.const 1", ";; خصم دورة واحدة (1)", node.line);
        this.emit("i32.sub", ";; طرح الخطوة اليدوية", node.line);
        this.emit(`local.set $${counterName}`, `;; ترسيم الحالة المعنوية المنقوصة`, node.line);

        // Loop again
        this.emit("br 0", ";; العودة لبدء اللفة التالية في التكرار", node.line);

        this.indentation -= 2;
        this.emit("end", ";; حصر الدائرة التفاعلية المباشرة", node.line);
        this.emit("end", ";; غلق جدار الحصار التكراري بأمان", node.line);
        break;
      }

      case "CallExpression": {
        if (Array.isArray(node.arguments)) {
          node.arguments.forEach(arg => this.compileNode(arg));
        }

        let calleeName = "unknown";
        if (typeof node.callee === "string") {
          calleeName = node.callee;
        } else if (node.callee && node.callee.type === "IdentifierNode") {
          calleeName = node.callee.name;
        }

        if (calleeName === "اطبع") {
          this.emit("call $print_i32", ";; استدعاء فوري لمخرج الطباعة الرقمي للنظام لإظهار المعامل", node.line);
        } else {
          this.emit(`;; استدعاء للمهمة المكتوبة [${calleeName}] بمجمع الكود الوصفي`, node.line);
        }
        break;
      }

      case "ExpressionStatement":
        this.compileNode(node.expression);
        break;
    }
  }
}
