import { ASTNode, Token, TokenType } from "../types";

/**
 * Normalizes Eastern Arabic numerals (٠-٩) into Western Arabic numerals (0-9).
 */
export function normalizeDigits(str: string): string {
  return str.replace(/[٠-٩]/g, d => "0123456789"['٠١٢٣٤٥٦٧٨٩'.indexOf(d)] || d);
}

/**
 * -------------------------------------------------------------
 * 1. Lexical Analyzer (Lexer/Scanner) for Al-Bayan
 * -------------------------------------------------------------
 * This class converts the raw Al-Bayan code string into active Tokens.
 * It strictly supports Arabic Unicode tags, localized punctuations (e.g., ،),
 * and can match both Arabic and standard math operators.
 */
export class AlBayanLexer {
  private input: string;
  private currentPos: number = 0;
  private lineNum: number = 1;
  private length: number;

  constructor(input: string) {
    this.input = input;
    this.length = input.length;
  }

  private peek(): string {
    if (this.currentPos >= this.length) return "";
    return this.input[this.currentPos];
  }

  private next(): string {
    if (this.currentPos >= this.length) return "";
    const char = this.input[this.currentPos++];
    if (char === "\n") {
      this.lineNum++;
    }
    return char;
  }

  private skipWhitespace(): void {
    while (this.currentPos < this.length) {
      const char = this.peek();
      if (char === " " || char === "\t" || char === "\r") {
        this.next();
      } else if (char === "\n") {
        // We'll treat newline as separate token or skip based on grammar.
        // For line-based and block-end systems like Al-Bayan, we yield Newline tokens
        // to simplify statement ending markers, but skip consecutive ones.
        break;
      } else {
        break;
      }
    }
  }

  private scanComment(): string {
    let comment = "";
    // Skip '//'
    this.next();
    this.next();
    while (this.currentPos < this.length && this.peek() !== "\n") {
      comment += this.next();
    }
    return comment;
  }

  private scanString(quoteChar: string): string {
    // Skip opening quote
    this.next();
    let str = "";
    while (this.currentPos < this.length) {
      const char = this.peek();
      if (char === quoteChar) {
        this.next(); // Skip closing quote
        return str;
      }
      if (char === "\\") {
        this.next(); // Skip escape backslash
        str += this.next();
      } else {
        str += this.next();
      }
    }
    throw new Error(`خطأ لغوي في السطر ${this.lineNum}: لم يتم إغلاق النص المقتبس.`);
  }

  private scanNumeric(firstChar: string): string {
    let numStr = firstChar;
    this.next(); // consume first Char

    const isDigitChar = (c: string) => {
      return /[0-9٠-٩.]/.test(c);
    };

    while (this.currentPos < this.length && isDigitChar(this.peek())) {
      numStr += this.next();
    }
    return normalizeDigits(numStr);
  }

  private scanIdentifierOrKeyword(firstChar: string): Token {
    let text = firstChar;
    this.next(); // consume first Char

    // Regex matching any Arabic character range alongside standard English identifiers
    const isIdChar = (c: string) => {
      return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9_]/.test(c);
    };

    while (this.currentPos < this.length && isIdChar(this.peek())) {
      text += this.next();
    }

    // Keyword mapping dictionary
    const keywords: Record<string, TokenType> = {
      "عرف": TokenType.VAR,
      "اطبع": TokenType.PRINT,
      "اذا": TokenType.IF,
      "لو": TokenType.IF,
      "وإلا": TokenType.ELSE,
      "لكل": TokenType.FOR,
      "في": TokenType.IN,
      "المجال": TokenType.RANGE,
      "كرر": TokenType.REPEAT,
      "مرات": TokenType.TIMES,
      "مهمة": TokenType.FUNC,
      "رئيسية": TokenType.MAIN, // Special marker for program entry point
      "صنف": TokenType.CLASS,
      "يرث": TokenType.EXTENDS,
      "نهاية": TokenType.END,
      "استورد": TokenType.IMPORT,
      "حاول": TokenType.TRY,
      "التقط": TokenType.CATCH,
      "هذا": TokenType.THIS,
      "جديد": TokenType.NEW
    };

    if (text in keywords) {
      return { type: keywords[text], value: text, line: this.lineNum };
    }

    return { type: TokenType.IDENTIFIER, value: text, line: this.lineNum };
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.currentPos < this.length) {
      this.skipWhitespace();
      if (this.currentPos >= this.length) break;

      const char = this.peek();

      // Skip comment or add comment tokens
      if (char === "/" && this.input[this.currentPos + 1] === "/") {
        this.scanComment(); // Skip comments for AST builder
        continue;
      }

      // Newlines
      if (char === "\n") {
        this.next();
        // Prevent redundant consecutive newline tokens
        if (tokens.length > 0 && tokens[tokens.length - 1].type !== TokenType.NEWLINE) {
          tokens.push({ type: TokenType.NEWLINE, value: "\n", line: this.lineNum - 1 });
        }
        continue;
      }

      // String literals
      if (char === '"' || char === "'") {
        const strVal = this.scanString(char);
        tokens.push({ type: TokenType.STRING, value: strVal, line: this.lineNum });
        continue;
      }

      // Numeric literals (checks standard digits + Arabic digit symbols)
      if (/[0-9٠-٩]/.test(char)) {
        const numVal = this.scanNumeric(char);
        tokens.push({ type: TokenType.NUMBER, value: numVal, line: this.lineNum });
        continue;
      }

      // Identifiers & Keywords
      if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z_]/.test(char)) {
        tokens.push(this.scanIdentifierOrKeyword(char));
        continue;
      }

      // Localized comma mapping (arabic comma '،' replaces normal standard comma)
      if (char === "،" || char === ",") {
        this.next();
        tokens.push({ type: TokenType.COMMA, value: ",", line: this.lineNum });
        continue;
      }

      // Symbols and Math Operators
      if (char === "=") {
        this.next();
        if (this.peek() === "=") {
          this.next();
          tokens.push({ type: TokenType.EQ, value: "==", line: this.lineNum });
        } else {
          tokens.push({ type: TokenType.ASSIGN, value: "=", line: this.lineNum });
        }
        continue;
      }

      if (char === "!") {
        this.next();
        if (this.peek() === "=") {
          this.next();
          tokens.push({ type: TokenType.NEQ, value: "!=", line: this.lineNum });
        } else {
          // Unrecognized solo '!' is evaluated as arithmetic/unary, for simplicity skip or output
          tokens.push({ type: TokenType.MINUS, value: "!", line: this.lineNum });
        }
        continue;
      }

      if (char === "<") {
        this.next();
        if (this.peek() === "=") {
          this.next();
          tokens.push({ type: TokenType.LTE, value: "<=", line: this.lineNum });
        } else {
          tokens.push({ type: TokenType.LT, value: "<", line: this.lineNum });
        }
        continue;
      }

      if (char === ">") {
        this.next();
        if (this.peek() === "=") {
          this.next();
          tokens.push({ type: TokenType.GTE, value: ">=", line: this.lineNum });
        } else {
          tokens.push({ type: TokenType.GT, value: ">", line: this.lineNum });
        }
        continue;
      }

      // Single character operators/punctuations
      const simpleTokens: Record<string, TokenType> = {
        "+": TokenType.PLUS,
        "-": TokenType.MINUS,
        "*": TokenType.MULTIPLY,
        "/": TokenType.DIVIDE,
        "(": TokenType.LPAREN,
        ")": TokenType.RPAREN,
        ":": TokenType.COLON,
        ".": TokenType.DOT
      };

      if (char in simpleTokens) {
        this.next();
        tokens.push({ type: simpleTokens[char], value: char, line: this.lineNum });
        continue;
      }

      // Catch remaining unrecognized elements safely
      this.next();
    }

    tokens.push({ type: TokenType.EOF, value: "", line: this.lineNum });
    return tokens;
  }
}

/**
 * -------------------------------------------------------------
 * 2. AST Structure Node classes
 * -------------------------------------------------------------
 * High level definitions conforming to semantic structural parsing.
 */
export class AlBayanParser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    // Filter out trailing and starting unused newlines to avoid grammar clutter
    this.tokens = tokens.filter((t, idx) => {
      if (t.type === TokenType.NEWLINE) {
        if (idx === 0) return false;
        if (idx === tokens.length - 1) return false;
        // Suppress sequence of multiple newlines
        if (tokens[idx + 1] && tokens[idx + 1].type === TokenType.NEWLINE) return false;
      }
      return true;
    });
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: TokenType.EOF, value: "", line: 0 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, errorMessage: string): Token {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new Error(`خطأ هيكلي في السطر ${token.line}: ${errorMessage} (وجدنا: ${token.value || token.type})`);
  }

  /**
   * Main parsing entry point
   */
  public parse(): ASTNode {
    const statements: ASTNode[] = [];

    while (!this.isAtEnd()) {
      if (this.match(TokenType.NEWLINE)) continue;
      try {
        statements.push(this.statement());
      } catch (e: any) {
        // Simple error recovery strategy: consume until next statement edge or EOF
        statements.push({
          type: 'ErrorNode',
          errorMessage: e.message,
          line: this.peek().line
        });
        this.synchronize();
      }
    }

    return {
      type: 'Program',
      body: statements,
      line: 1
    };
  }

  private synchronize(): void {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.NEWLINE) return;

      switch (this.peek().type) {
        case TokenType.VAR:
        case TokenType.FUNC:
        case TokenType.IF:
        case TokenType.FOR:
        case TokenType.REPEAT:
        case TokenType.CLASS:
        case TokenType.PRINT:
          return;
      }

      this.advance();
    }
  }

  /**
   * -------------------------------------------------------------
   * Parsing Statements
   * -------------------------------------------------------------
   */
  private statement(): ASTNode {
    if (this.match(TokenType.VAR)) return this.varDeclaration();
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.REPEAT)) return this.repeatStatement();
    if (this.match(TokenType.FUNC)) return this.functionDeclaration();
    if (this.match(TokenType.CLASS)) return this.classDeclaration();
    
    // Fall back to expression statements
    return this.expressionStatement();
  }

  private varDeclaration(): ASTNode {
    const nameToken = this.consume(TokenType.IDENTIFIER, "توقعنا اسم المتغير بعد كلمة 'عرف'.");
    let initializer: ASTNode | undefined = undefined;

    if (this.match(TokenType.ASSIGN)) {
      initializer = this.expression();
    }

    this.consumeStatementEnd();

    return {
      type: 'VariableDeclaration',
      name: nameToken.value,
      initializer,
      line: nameToken.line
    };
  }

  private printStatement(): ASTNode {
    const line = this.previous().line;
    this.consume(TokenType.LPAREN, "توقعنا القوس الداخلي '(' بعد دالة 'اطبع'.");
    const arg = this.expression();
    this.consume(TokenType.RPAREN, "توقعنا إغلاق القوس ')' بعد بارامترات 'اطبع'.");
    
    this.consumeStatementEnd();

    return {
      type: 'PrintStatement',
      argument: arg,
      line
    };
  }

  private ifStatement(): ASTNode {
    const line = this.previous().line;
    // Condition expression
    this.consume(TokenType.LPAREN, "توقعنا فتح القوس '(' لشروط جملة التفرع 'اذا'.");
    const condition = this.expression();
    this.consume(TokenType.RPAREN, "توقعنا إغلاق القوس ')' للشروط.");
    
    // Optional colon (اذا (س == ٥):)
    this.match(TokenType.COLON);
    this.consumeStatementEnd();

    const thenBranch: ASTNode[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.END) && !this.check(TokenType.ELSE)) {
      if (this.match(TokenType.NEWLINE)) continue;
      thenBranch.push(this.statement());
    }

    let elseBranch: ASTNode[] | undefined = undefined;
    if (this.match(TokenType.ELSE)) {
      this.match(TokenType.COLON);
      this.consumeStatementEnd();
      elseBranch = [];
      while (!this.isAtEnd() && !this.check(TokenType.END)) {
        if (this.match(TokenType.NEWLINE)) continue;
        elseBranch.push(this.statement());
      }
    }

    this.consume(TokenType.END, "توقعنا كلمة 'نهاية' لإغلاق كتلة 'اذا'.");
    this.consumeStatementEnd();

    return {
      type: 'IfStatement',
      condition,
      thenBranch: { type: 'Block', body: thenBranch, line },
      elseBranch: elseBranch ? { type: 'Block', body: elseBranch, line } : undefined,
      line
    };
  }

  private forStatement(): ASTNode {
    const line = this.previous().line;
    const iteratorToken = this.consume(TokenType.IDENTIFIER, "توقعنا اسم المتغير المكرر بعد 'لكل'.");
    
    this.consume(TokenType.IN, "توقعنا الموصول 'في' بعد اسم متغير الدورة.");
    this.consume(TokenType.RANGE, "توقعنا الدالة المعيارية 'المجال' لتحديد النطاق.");
    
    this.consume(TokenType.LPAREN, "توقعنا القوس '(' لمعاملات المجال.");
    const start = this.expression();
    this.consume(TokenType.COMMA, "توقعنا فاصلة '،' بين بداية ونهاية المجال.");
    const end = this.expression();
    this.consume(TokenType.RPAREN, "توقعنا إغلاق القوس ')' لنطاق المجال.");
    
    this.match(TokenType.COLON);
    this.consumeStatementEnd();

    const body: ASTNode[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.END)) {
      if (this.match(TokenType.NEWLINE)) continue;
      body.push(this.statement());
    }

    this.consume(TokenType.END, "توقعنا كلمة 'نهاية' لإغلاق كتلة التكرار 'لكل'.");
    this.consumeStatementEnd();

    return {
      type: 'ForLoop',
      iterator: iteratorToken.value,
      rangeStart: start,
      rangeEnd: end,
      body: { type: 'Block', body, line },
      line
    };
  }

  private repeatStatement(): ASTNode {
    const line = this.previous().line;
    this.consume(TokenType.LPAREN, "توقعنا فتح قوسين لعدد مرات التكرار 'كرر(١٠)'.");
    const count = this.expression();
    this.consume(TokenType.RPAREN, "توقعنا إغلاق القوس لتفصيل كرر.");
    
    // Optional 'مرات'
    this.match(TokenType.TIMES);
    this.match(TokenType.COLON);
    this.consumeStatementEnd();

    const body: ASTNode[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.END)) {
      if (this.match(TokenType.NEWLINE)) continue;
      body.push(this.statement());
    }

    this.consume(TokenType.END, "توقعنا كلمة 'نهاية' لإغلاق حلقة 'كرر'.");
    this.consumeStatementEnd();

    return {
      type: 'RepeatLoop',
      timesCount: count,
      body: { type: 'Block', body, line },
      line
    };
  }

  private functionDeclaration(): ASTNode {
    const line = this.previous().line;
    const nameToken = this.consume(TokenType.IDENTIFIER, "توقعنا اسم المهمة (الدالة) بعد صياغة 'مهمة'.");
    
    this.consume(TokenType.LPAREN, "توقعنا قوس البارامترات '(' بعد اسم المهمة.");
    const params: string[] = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        params.push(this.consume(TokenType.IDENTIFIER, "توقعنا اسم كائن صحيح للبارامتر.").value);
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RPAREN, "توقعنا إغلاق قوس المعاملات ')'.");
    
    this.match(TokenType.COLON);
    this.consumeStatementEnd();

    const body: ASTNode[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.END)) {
      if (this.match(TokenType.NEWLINE)) continue;
      body.push(this.statement());
    }

    this.consume(TokenType.END, "توقعنا كلمة 'نهاية' لقفل تفاصيل المهمة.");
    this.consumeStatementEnd();

    return {
      type: 'FunctionDeclaration',
      name: nameToken.value,
      parameters: params,
      body: { type: 'Block', body, line },
      line
    };
  }

  private classDeclaration(): ASTNode {
    const line = this.previous().line;
    const nameToken = this.consume(TokenType.IDENTIFIER, "توقعنا اسم الصنف (الكلاس) بعد كلمة 'صنف'.");
    
    let parentClass: string | undefined = undefined;
    if (this.match(TokenType.EXTENDS)) {
      parentClass = this.consume(TokenType.IDENTIFIER, "توقعنا اسم الصنف الموروث بعد صياغة 'يرث'.").value;
    }

    this.match(TokenType.COLON);
    this.consumeStatementEnd();

    const methods: ASTNode[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.END)) {
      if (this.match(TokenType.NEWLINE)) continue;
      methods.push(this.statement());
    }

    this.consume(TokenType.END, "توقعنا كلمة 'نهاية' لإغلاق جسم الصنف.");
    this.consumeStatementEnd();

    return {
      type: 'ClassDeclaration',
      name: nameToken.value,
      parentClass,
      body: { type: 'Block', body: methods, line },
      line
    };
  }

  private expressionStatement(): ASTNode {
    const expr = this.expression();
    this.consumeStatementEnd();
    return {
      type: 'ExpressionStatement',
      expression: expr,
      line: expr.line
    };
  }

  private consumeStatementEnd(): void {
    if (this.match(TokenType.NEWLINE) || this.isAtEnd()) {
      return;
    }
    // Statement delimiters can be optional in loose script environments but we check EOF or general punctuation lines
    if (this.check(TokenType.END) || this.check(TokenType.ELSE)) {
      return;
    }
  }

  /**
   * -------------------------------------------------------------
   * Expression Parsing (Recursive Descent Operator Precedence)
   * -------------------------------------------------------------
   */
  private expression(): ASTNode {
    return this.assignment();
  }

  private assignment(): ASTNode {
    // Basic assignment right associative parsing
    const expr = this.equality();

    if (this.match(TokenType.ASSIGN)) {
      const equalsToken = this.previous();
      const value = this.assignment();

      if (expr.type === 'IdentifierNode') {
        const name = (expr as any).name;
        return {
          type: 'AssignmentExpression',
          name,
          value,
          line: equalsToken.line
        };
      } else if (expr.type === 'MemberExpression') {
        return {
          type: 'MemberAssignment',
          object: (expr as any).object,
          property: (expr as any).property,
          value,
          line: equalsToken.line
        };
      }

      throw new Error(`خطأ في السطر ${equalsToken.line}: هدف الإسناد غير صحيح.`);
    }

    return expr;
  }

  private equality(): ASTNode {
    let expr = this.comparison();

    while (this.match(TokenType.EQ, TokenType.NEQ)) {
      const operator = this.previous().value;
      const right = this.comparison();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private comparison(): ASTNode {
    let expr = this.term();

    while (this.match(TokenType.LT, TokenType.GT, TokenType.LTE, TokenType.GTE)) {
      const operator = this.previous().value;
      const right = this.term();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private term(): ASTNode {
    let expr = this.factor();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value;
      const right = this.factor();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private factor(): ASTNode {
    let expr = this.call();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const operator = this.previous().value;
      const right = this.call();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private call(): ASTNode {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const propToken = this.consume(TokenType.IDENTIFIER, "توقعنا اسم الخاصية بعد علامة النقطة '.'.");
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: propToken.value,
          line: propToken.line
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private finishCall(callee: ASTNode): ASTNode {
    const args: ASTNode[] = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    const parenToken = this.consume(TokenType.RPAREN, "توقعنا إغلاق قوس استدعاء المهمة ')'.");
    return {
      type: 'CallExpression',
      callee,
      arguments: args,
      line: parenToken.line
    };
  }

  private primary(): ASTNode {
    if (this.match(TokenType.NUMBER)) {
      return {
        type: 'LiteralNode',
        value: Number(this.previous().value),
        raw: this.previous().value,
        line: this.previous().line
      };
    }

    if (this.match(TokenType.STRING)) {
      return {
        type: 'LiteralNode',
        value: this.previous().value,
        raw: `"${this.previous().value}"`,
        line: this.previous().line
      };
    }

    if (this.match(TokenType.THIS)) {
      return {
        type: 'ThisExpression',
        line: this.previous().line
      };
    }

    if (this.match(TokenType.NEW)) {
      const line = this.previous().line;
      // Syntactically support instantiation: جديد الحساب("علي"، ١٠٠)
      const classNameToken = this.consume(TokenType.IDENTIFIER, "توقعنا اسم الصنف بعد صياغة الاستنساخ 'جديد'.");
      
      this.consume(TokenType.LPAREN, "توقعنا فتح القوس '(' لبناء عنصر الصنف الجديد.");
      const args: ASTNode[] = [];
      if (!this.check(TokenType.RPAREN)) {
        do {
          args.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RPAREN, "توقعنا إغلاق قوس البناء الكبّاسي ')'.");

      return {
        type: 'NewExpression',
        className: classNameToken.value,
        arguments: args,
        line
      };
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return {
        type: 'IdentifierNode',
        name: this.previous().value,
        line: this.previous().line
      };
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RPAREN, "توقعنا إغلاق قوس الأولوية ')'.");
      return expr;
    }

    throw new Error(`خطأ لغوي في السطر ${this.peek().line}: لم يتم التعرف على المحتوى (${this.peek().value || this.peek().type}).`);
  }
}

/**
 * Helper to compute Levenshtein distance for spell suggestions.
 */
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

import { Diagnostic } from "../types";

/**
 * -------------------------------------------------------------
 * AlBayanSemanticAnalyzer
 * -------------------------------------------------------------
 * Inspects Al-Bayan AST nodes for security issues, un-declared variable usage,
 * unused identifiers, loops that will never execute, dead blocks, and spelling mistakes.
 */
export class AlBayanSemanticAnalyzer {
  private diagnostics: Diagnostic[] = [];
  
  // Track defined global resources, APIs, and SDK namespaces
  private globalSymbols = new Set<string>([
    "رياضيات", "جذر", "أس", "عشوائي", "تقريب", "ط",
    "نصوص", "استبدال", "طول",
    "قوائم", "أضف", "رتب",
    "وقت", "الآن", "انتظر",
    "أرسم", "رسم", "رسم_بياني", "شكل", "خط", "مسح",
    "أندرويد", "صناعة_تطبيق", "إضافة_واجهة", "زر", "زر_تفاعلي", "نص", "نص_توضيحي", "حقل_إدخال", "مفتاح_تبديل", "مؤشر_تقدم", "صورة", "بناء_APK",
    "كمومية", "كيوبيت", "هادامارد", "تراجع", "تشابك", "بوابة_تحكم_نفي", "قياس", "عرض_الحالة",
    "عصبية", "إنشاء_نموذج", "تدريب", "تدريب_تطوري", "مخطط_الشبكة", "توقع",
    "ذكاء", "عامل_مستقل", "استخلاص_معرفة", "توليد_استراتيجي",
    "تعلم", "استيراد_حزمة", "تحديث_تلقائي", "بحث_مستودعات",
    "أمان", "تحليل_لغة_ومعالجة", "تبادل", "تشغيل_جافاسكريبت", "تشغيل_بايثون", "تشغيل_سي_بلس_بلس", "تحويل", "جهاز", "تهيئة_الجهاز",
    "اطبع", "أنشئ_صورة", "أنشئ_صوت", "أنشئ_فيديو", "اعزف", "أنشئ_صفحة", "عنوان", "فقرة", "مدخل", "اكتب_ملف", "اقرأ_ملف",
    "اسأل_الذكاء", "ترجم", "لخص", "رسالة", "قيمة", "حدث", "رئيسية", "MainActivity"
  ]);

  private bayanKeywords = [
    "عرف", "اطبع", "اذا", "لو", "وإلا", "لكل", "في", "المجال", "كرر", "مرات", "مهمة", "نهاية", "حاول", "التقط", "صنف", "يرث", "جديد", "هذا"
  ];

  public analyze(ast: ASTNode): Diagnostic[] {
    this.diagnostics = [];
    
    // First pass: locate user functions and classes globally so they are not treated as undeclared
    const globalUserSymbols = new Set<string>();
    this.collectDeclaredStructures(ast, globalUserSymbols);

    // Track declared variables with state { lineOfDeclaration, isRead }
    const declaredVarsState = new Map<string, { line: number; isRead: boolean }>();
    const activeScope = new Set<string>();

    this.walk(ast, activeScope, declaredVarsState, globalUserSymbols);

    // After walk, check for unused declarations
    declaredVarsState.forEach((state, name) => {
      if (!state.isRead) {
        this.diagnostics.push({
          severity: "warning",
          line: state.line,
          message: `تحذير أسلوبي: تم تعريف المتغير '${name}' بنجاح، ولكنه لم يقرأ أو يُستعمل في الكود لاحقاً.`
        });
      }
    });

    return this.diagnostics;
  }

  private collectDeclaredStructures(node: ASTNode, symbols: Set<string>) {
    if (!node) return;
    if (node.type === "Program" && node.body) {
      node.body.forEach((child: ASTNode) => this.collectDeclaredStructures(child, symbols));
    } else if (node.type === "FunctionDeclaration") {
      symbols.add(node.name);
    } else if (node.type === "ClassDeclaration") {
      symbols.add(node.name);
    }
  }

  private walk(
    node: ASTNode,
    scope: Set<string>,
    declared: Map<string, { line: number; isRead: boolean }>,
    userSymbols: Set<string>
  ) {
    if (!node) return;

    switch (node.type) {
      case "Program":
      case "Block":
        if (node.body && node.body.length === 0) {
          this.diagnostics.push({
            severity: "info",
            line: node.line || 1,
            message: "كتلة الأوامر فارغة. الكود خالٍ من اللبس البرمجي لكن يمكنك إزالة هذه الكلمات لتنظيف الكود."
          });
        }
        if (node.body) {
          node.body.forEach((child: ASTNode) => this.walk(child, scope, declared, userSymbols));
        }
        break;

      case "VariableDeclaration": {
        const varName = node.name;
        if (scope.has(varName)) {
          this.diagnostics.push({
            severity: "warning",
            line: node.line,
            message: `تحذير: تم الكشف عن إعادة تعريف المتغير '${varName}' في نفس نطاق الذاكرة. سيتم تجديد قيمته.`
          });
        } else {
          scope.add(varName);
          declared.set(varName, { line: node.line, isRead: false });
        }

        if (node.initializer) {
          this.walk(node.initializer, scope, declared, userSymbols);
        }
        break;
      }

      case "AssignmentExpression": {
        const varName = node.name;
        // Check if variable is defined in the active scope or user-defined functions/globals
        if (!scope.has(varName) && !userSymbols.has(varName) && !this.globalSymbols.has(varName)) {
          this.diagnostics.push({
            severity: "warning",
            line: node.line,
            message: `إسناد مباشر: تم إسناد قيمة للمتغير '${varName}' دون استخدام كلمة 'عرف' المحجوزة مسبقاً.`,
            fixSuggestion: {
              type: "replace",
              text: `عرف ${varName} = `,
              description: `إضافة كلمة 'عرف' لتوثيق المتغير برمجياً لضمان سلامته في الذاكرة.`
            }
          });
          // Auto register it to prevent cascading errors
          scope.add(varName);
          declared.set(varName, { line: node.line, isRead: true });
        } else {
          // If already declared, mark it as read/modified
          const state = declared.get(varName);
          if (state) state.isRead = true;
        }

        this.walk(node.value, scope, declared, userSymbols);
        break;
      }

      case "IdentifierNode": {
        const name = node.name;
        if (!scope.has(name) && !userSymbols.has(name) && !this.globalSymbols.has(name) && name !== "هذا") {
          // Check for keyword spell checker suggestion
          let foundSuggestion = false;
          for (const key of this.bayanKeywords) {
            if (getLevenshteinDistance(name, key) <= 1) {
              this.diagnostics.push({
                severity: "error",
                line: node.line,
                message: `خطأ نحوي: الكلمة '${name}' غير معرّفة. هل وددت كتابة الكلمة المفتاحية '${key}'؟`,
                fixSuggestion: {
                  type: "replace",
                  text: key,
                  description: `تصحيح إملائي تلقائي لكلمة الحجز '${key}'.`
                }
              });
              foundSuggestion = true;
              break;
            }
          }

          if (!foundSuggestion) {
            this.diagnostics.push({
              severity: "error",
              line: node.line,
              message: `خطأ لغوي: المتغير أو الاستدعاء '${name}' غير موجود في نطاق التشغيل النشط الحالي.`
            });
          }
        } else {
          // Mark as used
          const state = declared.get(name);
          if (state) state.isRead = true;
        }
        break;
      }

      case "BinaryExpression": {
        this.walk(node.left, scope, declared, userSymbols);
        this.walk(node.right, scope, declared, userSymbols);

        // Security / Safety Check: Division by Zero
        if (node.operator === "/") {
          const rightHand = node.right;
          if (rightHand.type === "LiteralNode" && Number(rightHand.value) === 0) {
            this.diagnostics.push({
              severity: "error",
              line: node.line,
              message: "مخاطرة برمجية قاتلة: تم رصد محاولة قسمة على صفر ميكانيكياً. قد يتعطل المحرك أثناء التشغيل الفعلي."
            });
          }
        }
        break;
      }

      case "IfStatement":
        this.walk(node.condition, scope, declared, userSymbols);
        if (node.thenBranch) {
          const leftScope = new Set(scope);
          this.walk(node.thenBranch, leftScope, declared, userSymbols);
        }
        if (node.elseBranch) {
          const rightScope = new Set(scope);
          this.walk(node.elseBranch, rightScope, declared, userSymbols);
        }
        break;

      case "ForLoop": {
        // Evaluate range
        const start = node.rangeStart;
        const end = node.rangeEnd;
        if (start.type === "LiteralNode" && end.type === "LiteralNode") {
          const startVal = Number(start.value);
          const endVal = Number(end.value);
          if (startVal >= endVal) {
            this.diagnostics.push({
              severity: "warning",
              line: node.line,
              message: `خطأ منطقي: حلقة المجال تبدأ من (${startVal}) وتنتهي عند (${endVal}). لن تعمل الحلقة التصاعدية بسبب انعكاس المدى.`
            });
          }
        }

        // Loop index is temporarily active
        const nested = new Set(scope);
        nested.add(node.iterator);
        declared.set(node.iterator, { line: node.line, isRead: true }); // marked as read since it's loop counter
        
        this.walk(node.body, nested, declared, userSymbols);
        break;
      }

      case "RepeatLoop": {
        this.walk(node.timesCount, scope, declared, userSymbols);
        const subScope = new Set(scope);
        this.walk(node.body, subScope, declared, userSymbols);
        break;
      }

      case "FunctionDeclaration": {
        // Nested evaluation inside method
        const functionScope = new Set(scope);
        node.parameters.forEach((param: string) => {
          functionScope.add(param);
          declared.set(param, { line: node.line, isRead: false });
        });

        // Walk function body
        this.walk(node.body, functionScope, declared, userSymbols);
        
        // Ensure function parameters are validated
        node.parameters.forEach((param: string) => {
          const state = declared.get(param);
          if (state && !state.isRead) {
            this.diagnostics.push({
              severity: "info",
              line: node.line,
              message: `ملاحظة: البارامتر '${param}' في المهمة '${node.name}' غير مُستخدم داخل الكود.`
            });
            // self-clean from list so it doesn't alert at outer scope
            declared.delete(param);
          }
        });
        break;
      }

      case "ClassDeclaration": {
        const classScope = new Set(scope);
        this.walk(node.body, classScope, declared, userSymbols);
        break;
      }

      case "CallExpression":
        this.walk(node.callee, scope, declared, userSymbols);
        if (node.arguments) {
          node.arguments.forEach((arg: ASTNode) => this.walk(arg, scope, declared, userSymbols));
        }
        break;

      case "MemberExpression":
        this.walk(node.object, scope, declared, userSymbols);
        break;

      case "MemberAssignment":
        this.walk(node.object, scope, declared, userSymbols);
        this.walk(node.value, scope, declared, userSymbols);
        break;

      case "NewExpression":
        if (node.arguments) {
          node.arguments.forEach((arg: ASTNode) => this.walk(arg, scope, declared, userSymbols));
        }
        break;

      case "PrintStatement":
        this.walk(node.argument, scope, declared, userSymbols);
        break;

      case "ExpressionStatement":
        this.walk(node.expression, scope, declared, userSymbols);
        break;
    }
  }
}

