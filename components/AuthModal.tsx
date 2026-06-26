import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Chrome, Check, LogIn, LogOut, Award, User, Lock, 
  Sparkles, Star, Cpu, BookOpen, Smartphone, RefreshCw, CheckCircle2, ShieldCheck, Heart 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmailFromMetadata?: string; // We can pass the real user email aliazzaa@gmail.com!
  onAuthSuccess?: (userData: { name: string; email: string; tier: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  userEmailFromMetadata = "aliazzaa@gmail.com",
  onAuthSuccess 
}) => {
  // Local states
  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'benefits'>('register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tier, setTier] = useState<'free' | 'sovereign'>('sovereign');
  const [interest, setInterest] = useState<string>('ai');
  const [acceptTerms, setAcceptTerms] = useState(true);
  
  // Google sign in states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleStep, setGoogleStep] = useState<'idle' | 'popup' | 'syncing' | 'done'>('idle');
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string>('');

  // Email login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // General flow states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Current logged in user state
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    tier: string;
    interest: string;
    joinedAt: string;
    certId: string;
  } | null>(null);

  // Load existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('bayan_platform_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error loading user session:", e);
      }
    }
  }, [isOpen]);

  // Sensory feedback synthesizer
  const playSimTone = (frequency = 440, duration = 0.1, type: OscillatorType = 'sine') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext blocks sometimes, ignore silently
    }
  };

  if (!isOpen) return null;

  // Handles custom Email Register/Subscription
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !name || !password) {
      setErrorMsg('فضلاً قم بملء كافة الحقول الأساسية للتسجيل.');
      playSimTone(220, 0.2, 'sawtooth');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('يجب الموافقة على شروط الاستخدام والسياسة السيادية للمنصة.');
      playSimTone(220, 0.2, 'sawtooth');
      return;
    }

    setIsLoading(true);
    playSimTone(350, 0.08, 'sine');

    setTimeout(() => {
      const userObj = {
        name: name,
        email: email,
        tier: tier === 'sovereign' ? 'العضوية السيادية الفاخرة ⭐' : 'عضو أكاديمي مجاني',
        interest: interest === 'ai' ? 'الذكاء الاصطناعي والتعلم الآلي' : 
                  interest === 'android' ? 'تطوير تطبيقات الأندرويد المحسنة' : 
                  interest === 'quantum' ? 'المنطق الرياضي والكيوبيتات الكمية' : 'تكامل تطبيقات الويب الكبرى',
        joinedAt: new Date().toLocaleDateString('ar-SA'),
        certId: 'BYN-' + Math.floor(100000 + Math.random() * 900000)
      };

      localStorage.setItem('bayan_platform_user', JSON.stringify(userObj));
      setCurrentUser(userObj);
      setIsLoading(false);
      setSuccessMsg('تم تأكيد اشتراكك وتفعيل هويتك البرمجية بنجاح! 🎉');
      
      // Success melody
      playSimTone(523.25, 0.1, 'sine'); // C5
      setTimeout(() => playSimTone(659.25, 0.1, 'sine'), 80); // E5
      setTimeout(() => playSimTone(784.00, 0.15, 'sine'), 160); // G5

      if (onAuthSuccess) {
        onAuthSuccess({ name: userObj.name, email: userObj.email, tier: userObj.tier });
      }
    }, 1200);
  };

  // Handles standard Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
      playSimTone(220, 0.15, 'sawtooth');
      return;
    }

    setIsLoading(true);
    playSimTone(400, 0.08, 'sine');

    setTimeout(() => {
      // Simulate/Match saved user
      const savedUser = localStorage.getItem('bayan_platform_user');
      let matchedUser = null;
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.email.toLowerCase() === loginEmail.toLowerCase()) {
          matchedUser = parsed;
        }
      }

      // If no matched user, create a simulated session for this email
      if (!matchedUser) {
        matchedUser = {
          name: loginEmail.split('@')[0],
          email: loginEmail,
          tier: 'عضو أكاديمي مجاني',
          interest: 'تطوير تطبيقات الأندرويد المحسنة',
          joinedAt: new Date().toLocaleDateString('ar-SA'),
          certId: 'BYN-' + Math.floor(100000 + Math.random() * 900000)
        };
        localStorage.setItem('bayan_platform_user', JSON.stringify(matchedUser));
      }

      setCurrentUser(matchedUser);
      setIsLoading(false);
      setSuccessMsg('تم تسجيل الدخول واستدعاء هويتك البرمجية بنجاح!');
      playSimTone(523.25, 0.1, 'sine');
      setTimeout(() => playSimTone(784.00, 0.15, 'sine'), 100);

      if (onAuthSuccess) {
        onAuthSuccess({ name: matchedUser.name, email: matchedUser.email, tier: matchedUser.tier });
      }
    }, 1000);
  };

  // Google Sign In Sim Flow
  const handleGoogleSignIn = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGoogleStep('popup');
    playSimTone(523.25, 0.05, 'sine');
    setTimeout(() => playSimTone(659.25, 0.05, 'sine'), 50);
  };

  const confirmGoogleAccount = (selectedEmail: string) => {
    setSelectedGoogleAccount(selectedEmail);
    setGoogleStep('syncing');
    playSimTone(480, 0.08, 'sine');

    // Simulate Google server handshake & key generation
    setTimeout(() => {
      const gUser = {
        name: selectedEmail === userEmailFromMetadata ? "علي عزة" : selectedEmail.split('@')[0],
        email: selectedEmail,
        tier: 'العضوية السيادية الفاخرة ⭐',
        interest: 'الذكاء الاصطناعي والتعلم الآلي',
        joinedAt: new Date().toLocaleDateString('ar-SA'),
        certId: 'BYN-G-' + Math.floor(100000 + Math.random() * 900000)
      };

      localStorage.setItem('bayan_platform_user', JSON.stringify(gUser));
      setCurrentUser(gUser);
      setGoogleStep('done');
      
      // Success chords
      playSimTone(523.25, 0.08, 'sine');
      setTimeout(() => playSimTone(659.25, 0.08, 'sine'), 60);
      setTimeout(() => playSimTone(784.00, 0.08, 'sine'), 120);
      setTimeout(() => playSimTone(1046.50, 0.15, 'sine'), 180);

      setTimeout(() => {
        setGoogleStep('idle');
        setSuccessMsg('تم تسجيل اشتراكك الفوري عبر Google وتأمين حسابك بنجاح! 🚀');
        if (onAuthSuccess) {
          onAuthSuccess({ name: gUser.name, email: gUser.email, tier: gUser.tier });
        }
      }, 500);

    }, 2000);
  };

  const handleLogout = () => {
    playSimTone(293.66, 0.15, 'sawtooth'); // D4 down pitch
    localStorage.removeItem('bayan_platform_user');
    setCurrentUser(null);
    setSuccessMsg('تم تسجيل خروجك وتشفير جلستك بنجاح.');
    setEmail('');
    setName('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      
      {/* Container Card */}
      <div 
        className="w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/10 flex flex-col md:flex-row text-right"
        dir="rtl"
      >
        
        {/* Right Info Section (Always Visible on desktop/tablet) */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-950 p-6 flex flex-col justify-between border-l border-slate-800 relative overflow-hidden">
          {/* Subtle background abstract shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold">
              <Sparkles size={11} className="animate-spin duration-3000" />
              <span>نادي مطوري البيان السيادي</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white via-slate-100 to-purple-400">
                برمج بلغتك، وامتلك مستقبلك
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                انضم إلى أكثر من ٣٠,٠٠٠ مهندس برمجيات عربي يبنون تطبيقات الأندرويد والأنظمة المستدامة والحسابات الفائقة مباشرة باللغة العربية البليغة.
              </p>
            </div>

            {/* Perks Bullet List */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                  <Star size={12} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-200">الوصول الفوري للأكاديمية</h4>
                  <p className="text-[9.5px] text-slate-400">فتح فصول مقارنة الأكواد والنماذج العصبية المتقدمة خطوة بخطوة.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Cpu size={12} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-200">توطين الذكاء O(1)</h4>
                  <p className="text-[9.5px] text-slate-400">توليد واختبار النماذج والكيوبيتات محلياً بدون خوادم خارجية.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0 mt-0.5">
                  <Smartphone size={12} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-200">تصدير التطبيقات كـ APK</h4>
                  <p className="text-[9.5px] text-slate-400">بناء حزم تطبيقات متكاملة للأندرويد بحجم يقل عن ٣٨٥ كيلوبايت.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/60 z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
              <Heart size={10} className="text-pink-500 animate-pulse" />
              <span>مفتوح المصدر بالكامل</span>
            </div>
            <span className="text-[9px] text-slate-600">v2.2.0</span>
          </div>
        </div>

        {/* Left Form / Dashboard Section */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between relative min-h-[460px]">
          
          {/* Header Close button & Title */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-850">
            <div>
              <h4 className="text-sm font-black text-slate-100">
                {currentUser ? 'ملف العضوية السيادية' : 'بوابة الاشتراك والانتساب'}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {currentUser ? 'أهلاً بك مجدداً في استوديو البيان' : 'أنشئ حسابك المجاني أو سجّل دخولك'}
              </p>
            </div>
            <button 
              onClick={() => {
                playSimTone(300, 0.05, 'sine');
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800"
            >
              <X size={16} />
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* User Dashboard View (If logged in) */}
          {currentUser ? (
            <div className="flex-1 py-5 space-y-4 flex flex-col justify-between animate-in fade-in duration-200">
              
              {/* Profile Card */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-base font-black">
                    {currentUser.name[0]?.toUpperCase() || <User size={18} />}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-[8.5px] font-bold border border-purple-500/20">
                        {currentUser.tier.includes('السيادية') ? 'عضوية سيادية ⭐' : 'عضو أكاديمي'}
                      </span>
                    </h5>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-850 text-right">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 block">تاريخ الانتساب:</span>
                    <span className="text-[10px] text-slate-300 font-bold">{currentUser.joinedAt}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 block">رقم الشهادة الرقمية:</span>
                    <span className="text-[10px] text-purple-450 font-mono font-bold text-left">{currentUser.certId}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#060a12] border border-slate-950 space-y-1">
                  <span className="text-[8.5px] text-slate-500 block">الاهتمام البرمجي المفضّل:</span>
                  <p className="text-[10px] text-emerald-400 font-bold">🎯 {currentUser.interest}</p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 flex items-center gap-2.5">
                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-[10.5px] font-bold text-slate-200">الانتساب مفعّل بالكامل</p>
                  <p className="text-[9px] text-slate-400">حسابك متصل بخوادم محاكي الترجمة والذكاء الاصطناعي بنشاط ١٠٠٪.</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 rounded-xl border border-slate-850 hover:bg-rose-950/20 hover:border-rose-900 hover:text-rose-400 text-slate-400 transition-all text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <LogOut size={13} />
                <span>تسجيل الخروج وتشفير الجلسة</span>
              </button>

            </div>
          ) : (
            /* Forms (If NOT logged in) */
            <div className="flex-1 flex flex-col justify-between mt-4">
              
              {/* Google loading or syncing steps */}
              {googleStep === 'popup' && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm p-6 z-30 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 mb-2">
                    <Chrome size={24} className="text-blue-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">Google Accounts - اختر حساب للاشتراك</h4>
                  <p className="text-[9.5px] text-slate-400 max-w-sm">
                    يرغب استوديو البيان في استخدام حساب Google لتسجيل اشتراكك السريع والآمن.
                  </p>
                  
                  <div className="w-full max-w-xs space-y-2 pt-2">
                    <button
                      onClick={() => confirmGoogleAccount(userEmailFromMetadata)}
                      className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 text-right flex items-center gap-3 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                        ع
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-200">علي عزة (مطور سيادي)</p>
                        <p className="text-[9px] text-slate-500 font-mono">{userEmailFromMetadata}</p>
                      </div>
                    </button>

                    <button
                      onClick={() => confirmGoogleAccount("guest.developer@gmail.com")}
                      className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 text-right flex items-center gap-3 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-bold flex items-center justify-center text-xs">
                        G
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-200">حساب زائر</p>
                        <p className="text-[9px] text-slate-500 font-mono">guest.developer@gmail.com</p>
                      </div>
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      playSimTone(250, 0.1, 'sine');
                      setGoogleStep('idle');
                    }}
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-bold pt-4"
                  >
                    إلغاء العملية
                  </button>
                </div>
              )}

              {googleStep === 'syncing' && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm p-6 z-30 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
                  <RefreshCw size={32} className="text-purple-400 animate-spin" />
                  <h4 className="text-xs font-bold text-slate-200">جاري مزامنة حساب Google البرمجي...</h4>
                  <p className="text-[9.5px] text-slate-400 max-w-sm leading-relaxed">
                    نقوم الآن بربط هويتك الرقمية بـ <span className="text-purple-400 font-mono">{selectedGoogleAccount}</span> وتوليد شهادة الانتساب للأكاديمية والترجمة.
                  </p>
                </div>
              )}

              {/* Tabs selector */}
              <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-850 text-xs shrink-0 mb-4">
                <button
                  onClick={() => {
                    playSimTone(450, 0.04, 'sine');
                    setActiveTab('register');
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                    activeTab === 'register' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الاشتراك السريع 🚀
                </button>
                <button
                  onClick={() => {
                    playSimTone(450, 0.04, 'sine');
                    setActiveTab('login');
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                    activeTab === 'login' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => {
                    playSimTone(450, 0.04, 'sine');
                    setActiveTab('benefits');
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                    activeTab === 'benefits' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مزايا البوابة 💎
                </button>
              </div>

              {/* TAB 1: REGISTER */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="flex-1 flex flex-col justify-between space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-2.5 overflow-y-auto pr-0.5 max-h-[240px]">
                    
                    {/* Name Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block font-bold">الاسم الكامل</label>
                      <div className="relative">
                        <User size={13} className="absolute right-3.5 top-3 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="المهندس علي عزة"
                          className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 focus:border-purple-500/50 focus:ring-0 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block font-bold">البريد الإلكتروني</label>
                      <div className="relative">
                        <Mail size={13} className="absolute right-3.5 top-3 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="aliazzaa@gmail.com"
                          className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 focus:border-purple-500/50 focus:ring-0 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 transition-all outline-none text-right font-mono"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block font-bold">كلمة المرور المشفرة</label>
                      <div className="relative">
                        <Lock size={13} className="absolute right-3.5 top-3 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••••"
                          className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 focus:border-purple-500/50 focus:ring-0 rounded-xl py-2 pr-9 pl-12 text-xs text-slate-100 transition-all outline-none text-right font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            playSimTone(450, 0.05, 'sine');
                            setShowPassword(!showPassword);
                          }}
                          className="absolute left-3 top-2.5 text-[9px] font-bold text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-850"
                        >
                          {showPassword ? 'إخفاء' : 'إظهار'}
                        </button>
                      </div>
                    </div>

                    {/* Interests select */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">الاهتمام البرمجي</label>
                        <select
                          value={interest}
                          onChange={(e) => {
                            playSimTone(400, 0.05, 'sine');
                            setInterest(e.target.value);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500/50 rounded-xl py-2 px-3 text-[10.5px] text-slate-100 outline-none"
                        >
                          <option value="ai">الذكاء عصبية.*</option>
                          <option value="android">تطبيقات أندرويد</option>
                          <option value="quantum">كمومية.* والكم</option>
                          <option value="web">تطبيقات الويب</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">الباقة والامتياز</label>
                        <div className="flex rounded-xl overflow-hidden border border-slate-800 text-[10.5px]">
                          <button
                            type="button"
                            onClick={() => {
                              playSimTone(450, 0.05, 'sine');
                              setTier('free');
                            }}
                            className={`flex-1 py-2 text-center transition-all ${
                              tier === 'free' ? 'bg-slate-800 text-slate-250 font-bold' : 'bg-slate-900 text-slate-500'
                            }`}
                          >
                            مجانية
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playSimTone(450, 0.05, 'sine');
                              setTier('sovereign');
                            }}
                            className={`flex-1 py-2 text-center transition-all flex items-center justify-center gap-1 ${
                              tier === 'sovereign' ? 'bg-purple-900/30 text-purple-400 font-extrabold border-r border-purple-500/20' : 'bg-slate-900 text-slate-500'
                            }`}
                          >
                            <span>سيادية ⭐</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Accept terms checkbox */}
                    <label className="flex items-center gap-2 text-[9.5px] text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => {
                          playSimTone(380, 0.05, 'sine');
                          setAcceptTerms(e.target.checked);
                        }}
                        className="rounded bg-slate-900 border-slate-800 text-purple-500 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>أوافق على الشروط والسياسة السيادية والانتساب لنادي المطورين</span>
                    </label>

                  </div>

                  {/* Buttons */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          <span>جاري التحقق وتفعيل الباقة السيادية...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} />
                          <span>تأكيد الاشتراك وتفعيل الهوية البرمجية 🚀</span>
                        </>
                      )}
                    </button>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-850"></div>
                      <span className="flex-shrink mx-3 text-[9px] text-slate-500 font-bold">أو الانتساب الفوري والمزامنة</span>
                      <div className="flex-grow border-t border-slate-850"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Chrome size={13} className="text-blue-400" />
                      <span>الاشتراك المباشر عبر حساب Google الآمن 🛡️</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: LOGIN */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="flex-1 flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-3.5">
                    
                    {/* Login Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block font-bold">البريد الإلكتروني</label>
                      <div className="relative">
                        <Mail size={13} className="absolute right-3.5 top-3.5 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="aliazzaa@gmail.com"
                          className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 focus:border-purple-500/50 focus:ring-0 rounded-xl py-2.5 pr-9 pl-3 text-xs text-slate-100 transition-all outline-none text-right font-mono"
                        />
                      </div>
                    </div>

                    {/* Login Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block font-bold">كلمة المرور</label>
                      <div className="relative">
                        <Lock size={13} className="absolute right-3.5 top-3.5 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••••"
                          className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 focus:border-purple-500/50 focus:ring-0 rounded-xl py-2.5 pr-9 pl-12 text-xs text-slate-100 transition-all outline-none text-right font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            playSimTone(450, 0.05, 'sine');
                            setShowPassword(!showPassword);
                          }}
                          className="absolute left-3 top-3 text-[9px] font-bold text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-850"
                        >
                          {showPassword ? 'إخفاء' : 'إظهار'}
                        </button>
                      </div>
                    </div>

                  </div>

                  <div className="space-y-2 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          <span>جاري جلب هويتك الرقمية...</span>
                        </>
                      ) : (
                        <>
                          <LogIn size={13} />
                          <span>تسجيل الدخول الآمن 🔒</span>
                        </>
                      )}
                    </button>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-850"></div>
                      <span className="flex-shrink mx-3 text-[9px] text-slate-500 font-bold">تسجيل سريع بلمسة واحدة</span>
                      <div className="flex-grow border-t border-slate-850"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Chrome size={13} className="text-blue-400" />
                      <span>الدخول الفوري بـ Google</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: BENEFITS */}
              {activeTab === 'benefits' && (
                <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-200 space-y-4">
                  <div className="space-y-3.5 overflow-y-auto max-h-[260px] pr-0.5 text-right">
                    
                    <div className="p-3.5 rounded-xl border border-purple-500/15 bg-purple-500/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                        <Award size={14} />
                        <span>منح التوثيق والاعتماد</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        يحصل كل عضو مسجل على شهادة رقمية برمز فريد معتمد من المجمع التقني للبيان، تثبت كفاءته في لغة البرمجة العربية والذكاء السيادي.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <Cpu size={14} />
                        <span>معالجات الغد المحاذاة</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        يُفتح لجلستك محاكاة العتاد الفائقة لتمكين الحسابات الخلوية O(1) وتصفية الذاكرة الفائقة للأندرويد فورياً.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-blue-500/15 bg-blue-500/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                        <BookOpen size={14} />
                        <span>مستودع المنهجية الكامل للأكاديمية</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        الاطلاع على الكورسات المتقدمة ومقارنات الأكواد بالتفصيل الممل بين البيان واللغات الأخرى (بايثون وجافاسكريبت وبايت كود) دون قيود.
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => {
                      playSimTone(440, 0.05, 'sine');
                      setActiveTab('register');
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 border border-slate-700 transition-all text-center"
                  >
                    العودة لنموذج التسجيل والاشتراك
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
