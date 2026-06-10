
import { TranspilationResult } from "../types";

/**
 * A local compiler implementation for "Al-Bayan".
 * This removes the dependency on AI for core logic and syntax translation.
 * It uses Regex patterns to translate Arabic keywords to target languages.
 */
export class AlBayanCompiler {
  
  private code: string;
  private literals: string[] = [];

  constructor(code: string) {
    this.code = code;
  }

  // Convert Arabic numerals to English numerals
  private normalizeNumerals(str: string): string {
    return str.replace(/[٠-٩]/g, d => "0123456789"['٠١٢٣٤٥٦٧٨٩'.indexOf(d)] || d);
  }

  // Convert Arabic punctuation to standard
  private normalizePunctuation(str: string): string {
    return str.replace(/،/g, ',');
  }

  /**
   * Masks string literals and comments to protect them from transpilation regexes.
   * Stores them in this.literals and replaces them with ___LIT_N___
   */
  private maskLiterals(code: string): string {
    this.literals = [];
    // Regex matches: Double quoted strings OR Single quoted strings OR Single line comments
    const regex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/[^\n]*/g;
    return code.replace(regex, (match) => {
      this.literals.push(match);
      return `___LIT_${this.literals.length - 1}___`;
    });
  }

  /**
   * Restores literals and adapts comment syntax for the target language.
   */
  private unmaskLiterals(code: string, lang: 'js' | 'py' | 'java' | 'html'): string {
    return code.replace(/___LIT_(\d+)___/g, (match, indexStr) => {
      const index = parseInt(indexStr);
      const val = this.literals[index];
      if (!val) return match;

      // Handle Comment Syntax Conversion
      if (val.trim().startsWith('//')) {
          if (lang === 'py') {
              // Convert // to # for Python
              return val.replace('//', '#');
          }
          if (lang === 'html') {
              // In HTML (outside script), comments are <!-- --> but inside script they are //
              return val;
          }
      }
      return val;
    });
  }

  /**
   * Main compilation method
   */
  compile(enableDebug: boolean = false): TranspilationResult {
    // 1. Mask Literals (Strings & Comments) to protect them
    const maskedCode = this.maskLiterals(this.code);
    
    // 2. Normalize numerals/punctuation (on the code structure)
    let normalized = this.normalizePunctuation(this.normalizeNumerals(maskedCode));

    // 2.5 Instrument for Debugging (if enabled)
    // We do this BEFORE standard transpilation so we can inject JS hooks based on Arabic lines
    if (enableDebug) {
      normalized = this.instrumentForDebug(normalized);
    }
    
    // 3. Transpile & Unmask
    return {
      javascript: this.unmaskLiterals(this.toJavaScript(normalized), 'js'),
      python: this.unmaskLiterals(this.toPython(normalized), 'py'),
      java: this.unmaskLiterals(this.toJava(normalized), 'java'),
      html: this.unmaskLiterals(this.toHTML(normalized), 'html')
    };
  }

  /**
   * Instruments the code with debug pauses and variable snapshots.
   */
  private instrumentForDebug(code: string): string {
    const lines = code.split('\n');
    const knownVars: string[] = [];
    let instrumentedLines: string[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Skip empty lines, comments (which are masked as ___LIT___), and structural ends
      if (!trimmed || trimmed.startsWith('___LIT_') || trimmed === 'نهاية' || trimmed.endsWith(':')) {
        instrumentedLines.push(line);
        return;
      }

      // Detect Variable Declarations to track scope
      // Match "عرف x" or "عرف x ="
      const varMatch = trimmed.match(/عرف\s+([a-zA-Z_\u0600-\u06FF][a-zA-Z0-9_\u0600-\u06FF]*)/);
      if (varMatch) {
        if (!knownVars.includes(varMatch[1])) {
          knownVars.push(varMatch[1]);
        }
      }

      // Construct scope object for this line: { x: x, y: y }
      // This allows the runtime to inspect current values of known variables
      const scopeBuilder = `{ ${knownVars.map(v => `${v}: (typeof ${v} !== 'undefined' ? ${v} : 'undefined')`).join(', ')} }`;

      // Inject await __sys_debug(line, scope) BEFORE the line execution
      // Note: We append it to the previous line end or handle it as a prepended statement
      // Simpler approach: Prepend to the current line, but ensure semantically correct
      instrumentedLines.push(`await __sys_debug(${lineNum}, ${knownVars.length ? scopeBuilder : '{}'}); ${line}`);
    });

    return instrumentedLines.join('\n');
  }

  /**
   * Compiles to JavaScript for local browser execution
   */
  private toJavaScript(code: string): string {
    let js = code;

    // 1. OOP Structure (with Inheritance support)
    js = js.replace(/صنف\s+([a-zA-Z_\u0600-\u06FF][a-zA-Z0-9_\u0600-\u06FF]*)(?:\s+يرث\s+([a-zA-Z_\u0600-\u06FF][a-zA-Z0-9_\u0600-\u06FF]*))?:/g, (match, cls, parent) => {
        return parent ? `class ${cls} extends ${parent} {` : `class ${cls} {`;
    });

    js = js.replace(/بناء\s*\((.*?)\):/g, 'constructor($1) {');
    js = js.replace(/هذا\./g, 'this.');
    js = js.replace(/جديد\s+/g, 'new ');

    // 2. Keywords Mapping
    js = js.replace(/مهمة\s+([a-zA-Z_\u0600-\u06FF][a-zA-Z0-9_\u0600-\u06FF]*)\s*\((.*?)\):/g, 'async $1($2) {');
    js = js.replace(/^async\s+/gm, 'async function '); 
    js = js.replace(/عرف\s+/g, 'let ');
    js = js.replace(/اطبع\((.*?)\)/g, 'await __sys_log($1)');
    
    // Imports
    js = js.replace(/استورد\s*\(?["'](.*?)["']\)?/g, 'await __sys_import("$1")');

    // Conditionals
    js = js.replace(/(اذا|لو)\s*\((.*?)\):/g, 'if ($2) {');
    js = js.replace(/وإلا:/g, '} else {');
    js = js.replace(/وإلا (اذا|لو)\s*\((.*?)\):/g, '} else if ($2) {');
    
    // Loops
    js = js.replace(/لكل\s+([a-zA-Z_\u0600-\u06FF]+)\s+في\s+المجال\((.*?),\s*(.*?)\):/g, 'for (let $1 = $2; $1 < $3; $1++) {');
    js = js.replace(/كرر\s*\((.*?)\)\s*مرات:/g, 'for (let _i=0; _i<$1; _i++) {');

    // Error Handling
    js = js.replace(/حاول:/g, 'try {');
    js = js.replace(/التقط\s*\((.*?)\):/g, 'catch ($1) {');

    // --- AI & Media Commands (Async) ---
    js = js.replace(/أنشئ_صورة\((.*?)\)/g, 'await __sys_gen_image($1)');
    js = js.replace(/أنشئ_صوت\((.*?)\)/g, 'await __sys_gen_audio($1)');
    js = js.replace(/أنشئ_فيديو\((.*?)\)/g, 'await __sys_gen_video($1)');
    js = js.replace(/اعزف\((.*?),\s*(.*?)\)/g, 'await __sys_music($1, $2)'); 
    
    // --- HTML / DOM Generation Commands ---
    js = js.replace(/أنشئ_صفحة\((.*?)\)/g, 'await __sys_ui_element("title", $1)');
    js = js.replace(/عنوان\((.*?)\)/g, 'await __sys_ui_element("h1", $1)');
    js = js.replace(/فقرة\((.*?)\)/g, 'await __sys_ui_element("p", $1)');
    js = js.replace(/زر\((.*?)\)/g, 'await __sys_ui_element("button", $1)');
    js = js.replace(/مدخل\((.*?)\)/g, 'await __sys_ui_element("input", $1)');
    js = js.replace(/صورة\((.*?)\)/g, 'await __sys_ui_element("img", $1)');

    // File I/O
    js = js.replace(/اكتب_ملف\((.*?),\s*(.*?)\)/g, 'await __sys_file_write($1, $2)');
    js = js.replace(/اقرأ_ملف\((.*?)\)/g, 'await __sys_file_read($1)');

    // New AI Text Commands
    js = js.replace(/اسأل_الذكاء\((.*?)\)/g, 'await __sys_ai_ask($1)');
    js = js.replace(/ترجم\((.*?)\)/g, 'await __sys_ai_translate($1)');
    js = js.replace(/لخص\((.*?)\)/g, 'await __sys_ai_summarize($1)');

    // Block End
    js = js.replace(/نهاية/g, '}');

    // Execution Call
    if (js.includes('function رئيسية()')) {
        js += '\n\n// Auto-start main\nرئيسية();';
    } else if (js.includes('function main()')) {
        js += '\n\nmain();';
    }

    return js;
  }

  /**
   * Compiles to Python
   */
  private toPython(code: string): string {
    let py = code;
    // Inheritance
    py = py.replace(/صنف\s+([a-zA-Z_\u0600-\u06FF][a-zA-Z0-9_\u0600-\u06FF]*)(?:\s+يرث\s+([a-zA-Z_\u0600-\u06FF][a-zA-Z0-9_\u0600-\u06FF]*))?:/g, (match, cls, parent) => {
        return parent ? `class ${cls}(${parent}):` : `class ${cls}:`;
    });

    py = py.replace(/بناء\s*\((.*?)\):/g, 'def __init__(self, $1):');
    py = py.replace(/هذا\./g, 'self.');
    py = py.replace(/جديد\s+/g, '');
    py = py.replace(/مهمة\s+([^\(]+)\((.*?)\):/g, 'def $1($2):');
    py = py.replace(/عرف\s+/g, ''); 
    py = py.replace(/اطبع\((.*?)\)/g, 'print($1)');
    py = py.replace(/(اذا|لو)\s*\((.*?)\):/g, 'if $2:');
    py = py.replace(/وإلا:/g, 'else:');
    py = py.replace(/لكل\s+(\w+)\s+في\s+المجال\((.*?),\s*(.*?)\):/g, 'for $1 in range($2, $3):');

    py = py.replace(/استورد\s*\(?["'](.*?)["']\)?/g, '# Import Library: $1 (JS only)');
    py = py.replace(/حاول:/g, 'try:');
    py = py.replace(/التقط\s*\((.*?)\):/g, 'except Exception as $1:');
    py = py.replace(/أنشئ_صورة\((.*?)\)/g, 'ai.image($1)');
    py = py.replace(/اعزف\((.*?),\s*(.*?)\)/g, 'ai.play($1, $2)');
    py = py.replace(/اسأل_الذكاء\((.*?)\)/g, 'ai.text($1)');
    
    py = py.replace(/أنشئ_صفحة\((.*?)\)/g, 'print("Page Title:", $1)');
    py = py.replace(/عنوان\((.*?)\)/g, 'print("<h1>" + str($1) + "</h1>")');
    py = py.replace(/فقرة\((.*?)\)/g, 'print("<p>" + str($1) + "</p>")');
    py = py.replace(/زر\((.*?)\)/g, 'print("<button>" + str($1) + "</button>")');

    py = py.replace(/اكتب_ملف\((.*?),\s*(.*?)\)/g, 'with open($1, "w") as f: f.write($2)');
    py = py.replace(/اقرأ_ملف\((.*?)\)/g, 'open($1).read()');

    // --- Standard Library Mappings (Python) ---
    py = py.replace(/رياضيات.جذر\(/g, 'math.sqrt(');
    py = py.replace(/رياضيات.أس\(/g, 'math.pow(');
    py = py.replace(/رياضيات.عشوائي\(\)/g, 'random.random()');
    py = py.replace(/رياضيات.تقريب\(/g, 'round(');
    py = py.replace(/رياضيات.ط/g, 'math.pi');
    
    py = py.replace(/قوائم.أضف\((.*?),\s*(.*?)\)/g, '$1.append($2)');
    py = py.replace(/قوائم.رتب\((.*?)\)/g, '$1.sort()');
    py = py.replace(/قوائم.طول\((.*?)\)/g, 'len($1)');
    
    py = py.replace(/نصوص.استبدال\((.*?),\s*(.*?),\s*(.*?)\)/g, '$1.replace($2, $3)');
    py = py.replace(/نصوص.طول\((.*?)\)/g, 'len($1)');
    
    py = py.replace(/وقت.الآن\(\)/g, 'datetime.datetime.now()');
    py = py.replace(/نهاية/g, '# end');
    
    const imports = `import math\nimport random\nimport datetime\nimport albayan_ai as ai\n\n`;
    return `# Generated Python Code\n${imports}${py}`;
  }

  /**
   * Compiles to Java
   */
  private toJava(code: string): string {
    let java = code;
    // Inheritance
    java = java.replace(/صنف\s+([a-zA-Z_\u0600-\u06FF][a-zA-Z0-9_\u0600-\u06FF]*)(?:\s+يرث\s+([a-zA-Z_\u0600-\u06FF][a-zA-Z0-9_\u0600-\u06FF]*))?:/g, (match, cls, parent) => {
        return parent ? `class ${cls} extends ${parent} {` : `class ${cls} {`;
    });

    java = java.replace(/بناء\s*\((.*?)\):/g, 'public $1 {');
    java = java.replace(/هذا\./g, 'this.');
    java = java.replace(/جديد\s+/g, 'new ');
    java = java.replace(/مهمة\s+([^\(]+)\((.*?)\):/g, 'public static void $1($2) {');
    java = java.replace(/عرف\s+/g, 'var ');
    java = java.replace(/اطبع\((.*?)\)/g, 'System.out.println($1);');
    java = java.replace(/(اذا|لو)\s*\((.*?)\):/g, 'if ($2) {');
    java = java.replace(/وإلا:/g, '} else {');
    java = java.replace(/لكل\s+(\w+)\s+في\s+المجال\((.*?),\s*(.*?)\):/g, 'for (int $1 = $2; $1 < $3; $1++) {');
    
    java = java.replace(/استورد\s*\(?["'](.*?)["']\)?/g, '// Import Library: $1 (JS only)');
    java = java.replace(/حاول:/g, 'try {');
    java = java.replace(/التقط\s*\((.*?)\):/g, 'catch (Exception $1) {');

    java = java.replace(/أنشئ_صفحة\((.*?)\)/g, 'System.out.println("Page: " + $1);');
    java = java.replace(/عنوان\((.*?)\)/g, 'System.out.println("<h1>" + $1 + "</h1>");');
    
    java = java.replace(/اكتب_ملف\((.*?),\s*(.*?)\)/g, 'Files.writeString(Path.of($1), $2);');
    java = java.replace(/اقرأ_ملف\((.*?)\)/g, 'Files.readString(Path.of($1))');

    // --- Standard Library Mappings (Java) ---
    java = java.replace(/رياضيات.جذر\(/g, 'Math.sqrt(');
    java = java.replace(/رياضيات.أس\(/g, 'Math.pow(');
    java = java.replace(/رياضيات.عشوائي\(\)/g, 'Math.random()');
    java = java.replace(/رياضيات.ط/g, 'Math.PI');

    java = java.replace(/قوائم.أضف\((.*?),\s*(.*?)\)/g, '$1.add($2);');
    java = java.replace(/نصوص.استبدال\((.*?),\s*(.*?),\s*(.*?)\)/g, '$1.replace($2, $3)');
    java = java.replace(/وقت.الآن\(\)/g, 'new Date()');

    java = java.replace(/نهاية/g, '}');
    return `import java.nio.file.*;\nimport java.util.*;\n\npublic class Main {\n    ${java.replace(/\n/g, '\n    ')}\n}`;
  }

  /**
   * Generates a functional HTML file.
   */
  private toHTML(code: string): string {
     // Extract title if present
     let title = "Al-Bayan App";
     const titleMatch = code.match(/أنشئ_صفحة\("([^"]+)"\)/);
     if (titleMatch) {
         title = titleMatch[1];
     }

     const jsLogic = this.toJavaScript(code);

     return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem; text-align: center; }
        h1 { color: #0f172a; margin-bottom: 1rem; }
        p { margin-bottom: 0.5rem; line-height: 1.6; }
        button { background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 1rem; margin: 5px; }
        button:hover { background: #059669; }
        .log-output { margin-top: 2rem; border-top: 1px solid #e2e8f0; pt-4; text-align: left; font-family: monospace; color: #64748b; font-size: 0.8rem; }
    </style>
</head>
<body>
    <div id="app"></div>
    <div id="logs" class="log-output"></div>

    <script>
        async function __sys_ui_element(tag, content, id, style) { /*...*/ }
        async function __sys_log(msg) { /*...*/ }
        async function __sys_import(lib) { /*...*/ }
        // ... (Other stubs) ...

        // Standard Library Stubs
        const رياضيات = { جذر: Math.sqrt, أس: Math.pow, عشوائي: Math.random, تقريب: Math.round, ط: Math.PI };
        const نصوص = { استبدال: (t,a,b) => t.replace(a,b), طول: t => String(t).length };
        const قوائم = { أضف: (l,i) => l.push(i), طول: l => l.length, رتب: l => l.sort() };
        const وقت = { الآن: () => new Date().toLocaleTimeString(), انتظر: ms => new Promise(r => setTimeout(r, ms)) };

        // --- Application Logic ---
        ${jsLogic}
    </script>
</body>
</html>`;
  }
}
