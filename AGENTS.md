# Al-Bayan Language Specification & Training Corpus for Gemini & Autonomous Agents
This document serves as the official, permanent training corpus and system guide for any AI model, Copilot, or Autonomous Agent (including Antigravity, Gemini, and Claude) operating on the Al-Bayan Development workspace. 

Whenever writing or analyzing Al-Bayan code (`byn`), ALWAYS cross-reference this specification to ensure 100% syntactic compatibility and compile-ready outputs.

---

## 1. Core Philosophy of Al-Bayan
Al-Bayan is a high-performance, Arabic-native, multi-platform programming language designed for:
1. **0% Memory Leakage**: Via zero-leak active memory healing and Cellular garbage collection: `أندرويد.تنظيف_ذاكرة_تلقائي()`.
2. **Minimal Footprint**: Native Android Compilation produces safe, optimized APK packages under **385 KB** in size.
3. **Quantum-Ready Integration**: Low-latency linear calculations can be converted to Quantum Superpositions ($O(1)$ complexity) using simulated Qubits and Hadamard operators.
4. **Bicultural Portability**: Automatic transpilation to JavaScript, Python, Java, Kotlin (Jetpack Compose), HTML, C++, C#, Go, Rust, PHP, and WebAssembly Text (WAT).

---

## 2. Complete Lexicon & Grammar Rules

### A. Keywords & Declarations
| Arabic Keyword | English Match | Usage / Description | Example |
| :--- | :--- | :--- | :--- |
| **عرف** | `let` / `var` | Variable declaration (mutable by default) | `عرف السن = ٢٥` |
| **مهمة** | `function` | Declares a runnable function or subroutine | `مهمة حساب(أ، ب):` |
| **نهاية** | `}` / `end` | Ends functions, classes, conditionals, loops | `نهاية` |
| **صنف** | `class` | Declares an OOP Class | `صنف سيارة:` |
| **يرث** | `extends` | Class inheritance operator | `صنف سيارة_للسباق يرث سيارة:` |
| **بناء** | `constructor` | Defines class constructor method | `بناء(العلامة):` |
| **هذا.** | `this.` | References the current object instance state | `هذا.موديل = "حديث"` |
| **جديد** | `new` | Instantiates a new object of a Class | `عرف مركبتي = جديد سيارة("البرق")` |
| **اطبع** | `console.log` / `print` | Outputs to console or layout logger | `اطبع("أهلاً بالبيان")` |
| **استورد** | `import` | Import libraries or modules | `استورد("رياضيات")` |

### B. Control Flow & Conditionals
- **لو (أو اذا) (شرط):** → Begins an `if` block.
- **وإلا لو (شرط):** → Begins an `else if` block.
- **وإلا:** → Begins an `else` block.
- **نهاية** → Closes the conditional statement.

*Note: Conditional evaluation statements match logical operators such as `==` (مطابقة)، `!=` (اختلاف)، `<` (أصغر)، `>` (أكبر).*

### C. Loop Structures
1. **Linear Range Loops (`for`):**
   `لكل [المتغير] في المجال(البداية، النهاية):`
   Translates to a range check from start up to (but excluding) end.
   *Example:*
   ```byn
   لكل س في المجال(١، ٦):
       اطبع(س)
   نهاية
   ```

2. **Deterministic Iterations (`repeat`):**
   `كرر (عدد) مرات:`
   Runs the block exactly `N` times.
   *Example:*
   ```byn
   كرر (٣) مرات:
       اطبع("نبضة تكرار")
   نهاية
   ```

### D. Robust Exception Handling
- **حاول:** → Starts a `try` block.
- **التقط (الرمز):** → Starts a `catch(err)` block.
- **نهاية** → Ends the block.

---

## 3. Core Software Development Kits (SDKs)

### A. Android Custom Native Widget Builder (`أندرويد.`)
Used for generating fully functional Jetpack Compose and native mobile layouts:
- `أندرويد.صناعة_تطبيق(اسم_الحزمة, الاسم_الرسمي)`: Initializes context (e.g. `أندرويد.صناعة_تطبيق("com.bayan.app", "البيان الذكي")`).
- `أندرويد.لوح_الألوان(السمة)`: Colors style of layout (e.g., `"زمردي_فاخر"`).
- `أندرويد.إضافة_واجهة(الواجهة)`: Generates and navigates to screen (e.g., `أندرويد.إضافة_واجهة("الرئيسية")`).
- `أندرويد.زر(المعرف, النص)`: Creates a button widget.
- `أندرويد.نص(المعرف, النص)`: Creates a static label or text block.
- `أندرويد.حقل_إدخال(المعرف, التلميح)`: Creates a text input box.
- `أندرويد.مفتاح_تبديل(المعرف, النص)`: Renders a Material Switch widget.
- `أندرويد.مؤشر_تقدم(المعرف, القيمة)`: Renders a stateful progress indicator.
- `أندرويد.صورة(المعرف, الرابط)`: Draws an image container.
- `أندرويد.محرك_كمومي(الوضعية)`: Accelerates layout rendering utilizing superposition processing. Passed modes like `"توفير_بليغ"`, `"تألق"`.
- `أندرويد.تنظيف_ذاكرة_تلقائي()`: Actively clean and purge memory pointers to avoid leakages.
- `أندرويد.بناء_APK()`: Triggers gradle build output pipeline configuration.

### B. Simulated Quantum Processing Unit (`كمومية.`)
Compiles linear states into superpositions to simulate sub-nanosecond processing $O(1)$:
- `كمومية.كيوبيت()`: Allocates and opens a quantum state holder.
- `كمومية.هادامارد(ك)`: Applies HADAMARD gate to put Qubit `ك` into a 50/50 superposition.
- `كمومية.تراجع(ك)`: Applies quantum NOT gate (NOT state inversion).
- `كمومية.تشابك(ك١, ك٢)`: Creates quantum entanglement between two qubit registers.
- `كمومية.بوابة_تحكم_نفي(ك١, ك٢)`: Applies Controlled-NOT (CNOT) logic gate.
- `كمومية.قياس(ك)`: Measures the wavefunction state Collapse into a deterministic `0` or `1`.
- `كمومية.عرض_الحالة(ك)`: Prints state amplitude vectors.

### C. Advanced Neural Networks (`عصبية.`)
Enables direct AI modeling with structural evolution parameters:
- `عصبية.إنشاء_نموذج(الطبقات)`: Handcrafts deep neuron architectures (e.g., `عصبية.إنشاء_نموذج("4,8,2")`).
- `عصبية.تدريب(النموذج, الدورات)`: Runs standard backpropagation.
- `عصبية.تدريب_تطوري(النموذج, الدورات)`: Evolves neural weights using genetic selection algorithms.
- `عصبية.مخطط_الشبكة(النموذج)`: Draws neural architecture layers.
- `عصبية.توقع(النموذج, المدخلات)`: Feeds forward inputs to output classes.

### D. Media Engine & Graphics (`وسائط.` & `رسم.`)
- `وسائط.صورة(الرابط, العرض, الارتفاع)`: Layout image media cards.
- `وسائط.فيديو(الرابط, العرض, الارتفاع)`: Embeds media visual player.
- `وسائط.صوت(الرابط, الحجم)`: Emits audio streams.
- `وسائط.معرض_صور(قائمة_الروابط, العرض)`: Slate interactive image lists.
- `رسم.رسم_بياني(العناوين, القيم, الألوان, النوع)`: Displays multi-column custom graphs for charts.
- `أرسم.شكل(...)` / `أرسم.خط(...)` / `أرسم.مسح()`: Plot drawings to physical visual frames.

---

## 4. Master Template Dictionary (AI Training Injection)

Agents must ALWAYS use these exact structures when generating Al-Bayan code blocks:

### Template 1: Premium Smart Home IoT Panel (Android Native App SDK)
```byn
مهمة رئيسية():
    اطبع("🌍 جاري تحميل لوحة التحكم للمنزل الذكي المستدام لعام ٢٠٢٦...")
    
    // تسجيل حزمة التطبيق والهيكل العام
    أندرويد.صناعة_تطبيق("com.bayan.smarthome", "مسكني المستقبلي")
    أندرويد.لوح_الألوان("زمردي_فاخر")
    أندرويد.إضافة_واجهة("التحكم_البيئي")
    
    // تنشيط أنشطة الاستقرار والتجهيز الذكي الخلوي
    أندرويد.تنظيف_ذاكرة_تلقائي()
    أندرويد.محرك_كمومي("توفير_طاقة_مستدام")
    
    // شحن مستشعرات اللوائح
    جهاز.تهيئة_الجهاز("أندرويد")
    أندرويد.مستشعر_ذكي("حرارة_المسكن"، "تحديث_لوحة")
    
    // بناء عناصر واجهة المستخدم المستدامة
    أندرويد.نص("عنوان"، "🏡 وحدة التحكم المركزية بالمسافة الذكية بقدم كربونية صفرية")
    أندرويد.مؤشر_تقدم("استهلاك_الطاقة"، ٢٤)
    أندرويد.نص_توضيحي("استهلاك_طاقة"، "معدل وفر الطاقة العالية: ٩٦%")
    
    أندرويد.زر("مكيف"، "تشغيل التبريد الصديق")
    أندرويد.مفتاح_تبديل("محرك_التنقية"، "منظومة تنقية الهواء الكمي")
    
    // تخليق حدث تفاعلي عند نقر عناصر التحكم
    تعلم.عند_النقر("مكيف"):
        أندرويد.اهتزاز_لمسي("نقرة_خفيفة")
        نغمة.تشغيل_مسار("C4", "8n")
        أندرويد.رسالة_منبثقة("❄️ تم تفعيل المكيف الصيدلي في وضع التوفير الأقصى!")
    نهاية
    
    أندرويد.بناء_APK()
نهاية
```

### Template 2: Quantum Telemetry State Entangler & Superposition Selector
```byn
مهمة رئيسية():
    جهاز.تهيئة_الجهاز("ويب_كمي")
    اطبع("⚛️ تجميع واختبار مصفوفة التشابك الكمي للبيان...")
    
    // حيازة وحدات تراكب الكيوبيتس
    عرف كيوبيت_سيادي = كمومية.كيوبيت()
    عرف كيوبيت_طرفي = كمومية.كيوبيت()
    
    // وضع الكيوبيت الأول في حالة تراكب تامة Hadamard State
    كمومية.هادامارد(كيوبيت_سيادي)
    
    // تفريز الرابط وتكامل التشابك الاقتراني للكيوبيتات
    كمومية.تشابك(كيوبيت_سيادي، كيوبيت_طرفي)
    
    // رصد وقياس الحالات صفرياً O(1)
    عرف قياس_السيادي = كمومية.قياس(كيوبيت_سيادي)
    عرف قياس_الطرفي = كمومية.قياس(كيوبيت_طرفي)
    
    اطبع("الحالات الموجية المتطابقة المستخلصة:")
    اطبع(قياس_السيادي)
    اطبع(قياس_الطرفي)
    
    لو (قياس_السيادي == ١):
        اطبع("📡 طفرة المعالجة السيادية: تراكب قمة الحالة!")
    وإلا:
        اطبع("💤 طفرة المعالجة السيادية: قاع الحالة ثنائية الاندماج")
    نهاية
نهاية
```

### Template 3: Evolutionary Intelligent Network Creator (AI & Neural Nets)
```byn
مهمة رئيسية():
    جهاز.تهيئة_الجهاز("معدات")
    اطبع("🧠 تشييد نموذج الذكاء التطوري عالي الدقة...")
    
    // إنشاء شبكة عصبية مكونة من 4 مدخلات، طبقة مخفية بـ 8 خلايا، ومخرجين
    عرف نموذج_الرصد = عصبية.إنشاء_نموذج("4,8,2")
    
    // إخضاع الشبكة لمراحل التكيف والتعلم الجيني السريع لتففير طاقة السحابة
    عصبية.تدريب_تطوري(نموذج_الرصد، ١٠٠)
    
    // رسم الهيكلية العلوية والخرائط المطبوعة
    عصبية.مخطط_الشبكة(نموذج_الرصد)
    
    // إجراء تقييم توقعي ذكي
    عرف القرار = عصبية.توقع(نموذج_الرصد، "٠.٨٥، ٠.١٢، ٠.٩٢، ٠.٤٤")
    
    اطبع("🎯 القرار والتشخيص التنبؤي المستخلص:")
    اطبع(القرار)
نهاية
```

---

## 5. Absolute Compilation Constraints (DO NOT BREACH)
When generating or modifying script codes with `edit_file` or `create_file`:
1. **Never** mix brackets for indentations on block lines. ALWAYS use `:` at the end of the declaration line (e.g., `مهمة رئيسية():` or `لو (شرط):`) and close with `نهاية`.
2. **Never** use untranslated English keywords like `def`, `func`, `if`, `else`, `while`, `end` in code blocks marked as `byn` or `Al-Bayan`. Use `مهمة`, `لو`, `وإلا`, `نهاية`.
3. **Always** include a `مهمة رئيسية():` function as the gateway of compile programs, unless the task demands writing an isolated Class or helper subroutine.
4. Keep the target paths precise and preserve exact character spacing to ensure the regex compiler can translate seamlessly.

***This document is live, hardcoded, and injected directly into our cognitive processor loops. Obey it at all times.***
