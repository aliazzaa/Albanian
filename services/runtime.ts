
import { generateMediaAsset } from "./openMediaService";
import { ExecutionResult, HtmlElement, RuntimeCallbacks } from "../types";

// In-memory virtual file system for the current session
const VIRTUAL_FILES: Record<string, string> = {};

// Library Definition Interface
interface LibraryConfig {
    url: string;
    globalVar?: string;
}

// Predefined Libraries Map
const KNOWN_LIBRARIES: Record<string, LibraryConfig> = {
    'confetti': { 
        url: 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
        globalVar: 'confetti'
    },
    'sweetalert': { 
        url: 'https://cdn.jsdelivr.net/npm/sweetalert2@11',
        globalVar: 'Swal'
    },
    'chartjs': { 
        url: 'https://cdn.jsdelivr.net/npm/chart.js',
        globalVar: 'Chart'
    },
    'axios': { 
        url: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
        globalVar: 'axios'
    },
    'lodash': {
        url: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
        globalVar: '_'
    },
    'moment': {
        url: 'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js',
        globalVar: 'moment'
    },
    'anime': {
        url: 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js',
        globalVar: 'anime'
    },
    'jquery': {
        url: 'https://code.jquery.com/jquery-3.7.1.min.js',
        globalVar: '$'
    }
};

const LIBRARY_LOAD_PROMISES: Record<string, Promise<void>> = {};
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;

/**
 * Controller class to manage the stepping state of the debugger.
 * Passed into the runtime.
 */
export class DebugController {
  public resolvePause: (() => void) | null = null;
  public isStepping: boolean = false;
  
  resume() {
    if (this.resolvePause) {
      this.resolvePause();
      this.resolvePause = null;
    }
  }

  step() {
    this.isStepping = true;
    this.resume();
  }

  continue() {
    this.isStepping = false;
    this.resume();
  }
}

/**
 * Executes the compiled JavaScript code in a browser sandbox.
 */
export const runAlBayanCode = async (
  jsCode: string, 
  breakpoints: number[] = [], 
  callbacks?: RuntimeCallbacks,
  debugController?: DebugController
): Promise<ExecutionResult> => {
  const logs: string[] = [];
  const images: string[] = [];
  const audio: string[] = [];
  const videos: { frames: string[], prompt: string }[] = [];
  const htmlElements: HtmlElement[] = [];

  // Sandbox Environment with Standard Library
  const env = {
    // 0. Standard Library
    رياضيات: {
        جذر: Math.sqrt,
        أس: Math.pow,
        عشوائي: Math.random,
        تقريب: Math.round,
        سقف: Math.ceil,
        أرضية: Math.floor,
        قيمة_مطلقة: Math.abs,
        ط: Math.PI
    },
    نصوص: {
        طول: (t: any) => String(t).length,
        بحث: (t: string, sub: string) => t.includes(sub),
        استبدال: (t: string, a: string, b: string) => t.replace(a, b),
        تكبير: (t: string) => t.toUpperCase(),
        تصغير: (t: string) => t.toLowerCase(),
        جزء: (t: string, start: number, end: number) => t.substring(start, end)
    },
    قوائم: {
        طول: (arr: any[]) => arr.length,
        أضف: (arr: any[], item: any) => { arr.push(item); return arr; },
        احذف: (arr: any[]) => arr.pop(),
        رتب: (arr: any[]) => arr.sort(),
        اعكس: (arr: any[]) => arr.reverse(),
        نص: (arr: any[]) => arr.join(',')
    },
    وقت: {
        الآن: () => new Date().toLocaleTimeString('ar-SA'),
        تاريخ: () => new Date().toLocaleDateString('ar-SA'),
        انتظر: async (ms: number) => new Promise(res => setTimeout(res, ms))
    },

    // 1. System Logger
    __sys_log: async (msg: any) => {
      console.log("Al-Bayan Log:", msg);
      const logStr = (typeof msg === 'object' && msg !== null) ? JSON.stringify(msg) : String(msg);
      logs.push(logStr);
      if (callbacks?.onOutput) callbacks.onOutput(logStr);
    },
    
    // 2. Debugger Hook
    __sys_debug: async (line: number, scope: any) => {
      // Logic:
      // 1. If line is in breakpoints -> PAUSE
      // 2. If isStepping is true -> PAUSE
      const shouldPause = breakpoints.includes(line) || (debugController && debugController.isStepping);
      
      if (shouldPause && callbacks?.onDebugPause && debugController) {
        // Reset stepping flag so we don't skip over the next line automatically unless clicked 'Step' again
        // However, if we hit a breakpoint while 'Continuing', we want to stop.
        // If we hit a breakpoint while 'Stepping', we want to stop (which we do).
        debugController.isStepping = false; // Reset "Step" command once we hit a line

        // Notify UI to update Debugger State
        await callbacks.onDebugPause(line, scope);
        
        // Pause execution until UI calls resume/step
        await new Promise<void>((resolve) => {
          debugController.resolvePause = resolve;
        });
      }
    },

    // 3. Media Generators
    __sys_gen_image: async (prompt: string) => {
      logs.push(`> [صور] جاري توليد صورة: "${prompt}"...`);
      try {
        const base64 = await generateMediaAsset('image', prompt);
        if (base64) images.push(base64);
        logs.push(`> [تم] تم جلب الصورة.`);
      } catch (e) {
        logs.push(`> [خطأ] فشل توليد الصورة.`);
      }
    },

    __sys_gen_audio: async (text: string) => {
      logs.push(`> [صوت] قراءة: "${text}"...`);
       try {
        const result = await generateMediaAsset('audio', text);
        if (result === "AUDIO_PLAYED") logs.push(`> [تم] تشغيل الصوت.`);
      } catch (e) {
        logs.push(`> [خطأ] فشل الصوت.`);
      }
    },

    __sys_gen_video: async (prompt: string) => {
      logs.push(`> [فيديو] جاري إنشاء محاكاة فيديو: "${prompt}"...`);
      try {
          const frames = await generateMediaAsset('video', prompt);
          if (Array.isArray(frames) && frames.length > 0) {
              videos.push({ frames, prompt });
              logs.push(`> [تم] إنشاء ${frames.length} إطارات للفيديو.`);
          }
      } catch(e) {
          logs.push(`> [خطأ] فشل إنشاء الفيديو.`);
      }
    },
    
    __sys_music: async (note: string, duration: string) => {
        logs.push(`> [موسيقى] عزف: ${note} (${duration})...`);
        try {
            await generateMediaAsset('music', note, duration);
        } catch(e) {
            logs.push(`> [خطأ] فشل تشغيل الموسيقى.`);
        }
    },

    // 4. AI Text Capabilities
    __sys_ai_ask: async (question: string) => {
        logs.push(`> [الذكاء الاصطناعي] يفكر في: "${question}"...`);
        try {
            const answer = await generateMediaAsset('text', question);
            if (answer) {
                logs.push(`> [الجواب]: ${answer}`);
            }
        } catch (e) {
            logs.push(`> [خطأ] خدمة الذكاء الاصطناعي غير متاحة حالياً.`);
        }
    },

    __sys_ai_translate: async (text: string, lang: string) => {
        const prompt = `Translate the following text to ${lang || 'English'}: "${text}". Only output the translation.`;
        logs.push(`> [ترجمة] جاري ترجمة "${text}"...`);
        try {
            const translated = await generateMediaAsset('text', prompt);
            logs.push(`> [الترجمة]: ${translated}`);
        } catch (e) {
            logs.push(`> [خطأ] فشل الترجمة.`);
        }
    },

    __sys_ai_summarize: async (text: string) => {
        const prompt = `Summarize this text in Arabic: "${text}"`;
        logs.push(`> [تلخيص] جاري تحليل النص...`);
        try {
            const summary = await generateMediaAsset('text', prompt);
            logs.push(`> [الملخص]: ${summary}`);
        } catch (e) {
            logs.push(`> [خطأ] فشل التلخيص.`);
        }
    },

    // 5. Virtual File System
    __sys_file_write: async (filename: string, content: string) => {
        VIRTUAL_FILES[filename] = content;
        logs.push(`> [نظام الملفات] تم حفظ الملف: "${filename}"`);
    },

    __sys_file_read: async (filename: string) => {
        if (filename in VIRTUAL_FILES) {
            return VIRTUAL_FILES[filename];
        } else {
            logs.push(`> [نظام الملفات] خطأ: الملف "${filename}" غير موجود.`);
            return "NULL";
        }
    },

    // 6. DOM Simulation
    __sys_ui_element: async (tag: string, content: string, id?: any, style?: any) => {
        if (tag === 'title') {
            logs.push(`> [صفحة ويب] تم تعيين العنوان: "${content}"`);
            return;
        }
        htmlElements.push({
            tag,
            content: String(content),
            id: id ? String(id) : undefined,
            style: style ? String(style) : undefined
        });
        logs.push(`> [DOM] <${tag}> ${content} ${id ? `(id=${id})` : ''}`);
    },

    // 7. External Libraries Loader
    __sys_import: async (libIdentifier: string) => {
        const libConfig: LibraryConfig = KNOWN_LIBRARIES[libIdentifier] || { url: libIdentifier };
        if (libConfig.globalVar && (window as any)[libConfig.globalVar]) {
             logs.push(`> [مكتبات] ${libIdentifier} جاهزة.`);
             return;
        }
        if (LIBRARY_LOAD_PROMISES[libConfig.url]) {
             await LIBRARY_LOAD_PROMISES[libConfig.url];
             return;
        }

        logs.push(`> [مكتبات] بدء عملية تحميل: ${libIdentifier}...`);
        
        const loadTask = async () => {
            let attempt = 1;
            while (attempt <= MAX_RETRIES) {
                try {
                    await new Promise<void>((resolve, reject) => {
                        if (!libConfig.url || !libConfig.url.startsWith('http')) {
                            reject(new Error("عنوان URL غير صالح"));
                            return;
                        }
                        const script = document.createElement('script');
                        script.src = libConfig.url;
                        script.async = true;
                        script.onload = () => resolve();
                        script.onerror = () => { script.remove(); reject(new Error("فشل الاتصال")); };
                        document.head.appendChild(script);
                    });
                    return; 
                } catch (err: any) {
                    const isLastAttempt = attempt === MAX_RETRIES;
                    if (isLastAttempt) {
                        logs.push(`> [خطأ فادح] فشل استيراد "${libIdentifier}" بعد ${MAX_RETRIES} محاولات.`);
                        throw err;
                    } else {
                        const delay = Math.pow(2, attempt) * RETRY_BASE_DELAY_MS;
                        await new Promise(r => setTimeout(r, delay));
                        attempt++;
                    }
                }
            }
        };

        const processPromise = loadTask();
        LIBRARY_LOAD_PROMISES[libConfig.url] = processPromise;
        
        try {
            await processPromise;
        } catch (e) {
            delete LIBRARY_LOAD_PROMISES[libConfig.url];
            throw e; 
        }
    }
  };

  try {
    const argNames = Object.keys(env);
    const argValues = Object.values(env);

    // Wrap code in async IIFE to allow top-level await behavior
    const wrappedCode = `
      (async () => {
        try {
          ${jsCode}
        } catch (err) {
          throw err;
        }
      })()
    `;

    const dynamicFunction = new Function(...argNames, wrappedCode);
    
    await dynamicFunction(...argValues);

    return { 
        output: logs, 
        generatedImages: images,
        generatedAudio: audio,
        generatedVideos: videos,
        generatedHtmlElements: htmlElements
    };

  } catch (error: any) {
    return { 
        output: logs, 
        error: `خطأ وقت التشغيل (Runtime Error): ${error.message}` 
    };
  }
};
