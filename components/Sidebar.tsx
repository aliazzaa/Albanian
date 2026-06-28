
import React from 'react';
import { BookOpen, Layers, Zap, Book, Download, FolderKanban, Smartphone, GraduationCap, User, Sparkles, MessageSquare, Terminal, Grid } from 'lucide-react';
import { EXAMPLES, SYNTAX_MAP } from '../constants';

interface SidebarProps {
  onLoadExample: (code: string) => void;
  isOpen: boolean;
  toggle: () => void;
  onOpenDocs: () => void;
  onDownloadExtension: () => void;
  onOpenProjectManager: () => void;
  onOpenTemplates: () => void;
  onOpenAcademy: () => void;
  onOpenAuth?: () => void;
  onOpenCommunity?: () => void;
  onOpenEnvChecker?: () => void;
  onOpenLibraryManager?: () => void;
  currentUser?: { name: string; email: string; tier: string } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onLoadExample, 
  isOpen, 
  toggle, 
  onOpenDocs, 
  onDownloadExtension,
  onOpenProjectManager,
  onOpenTemplates,
  onOpenAcademy,
  onOpenAuth,
  onOpenCommunity,
  onOpenEnvChecker,
  onOpenLibraryManager,
  currentUser
}) => {

  const handleDownloadDictionary = () => {
    let content = "===================================================================\n";
    content += "             قاموس لغة البيان (Al-Bayan Syntax Map)\n";
    content += "===================================================================\n\n";
    content += String("الأمر العربي").padEnd(40) + " | " + "الكود المقابل (English/Tech)\n";
    content += "-----------------------------------------|---------------------------------\n";

    SYNTAX_MAP.forEach(item => {
      content += String(item.arabic).padEnd(40) + " | " + item.english + "\n";
    });

    content += "\n===================================================================\n";
    content += "تم التوليد بواسطة استوديو البيان";

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AlBayan_Dictionary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={toggle}
        />
      )}
    
      <aside 
        className={`fixed lg:static top-0 right-0 h-full w-72 bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 z-30 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-emerald-400">
            لغة البيان
          </h1>
          <p className="text-slate-500 text-xs mt-1">برمجة عربية بمصادر مفتوحة</p>

          {/* Subscription / Auth Status in Sidebar */}
          {onOpenAuth && (
            <div className="mt-4">
              {currentUser ? (
                <div 
                  onClick={onOpenAuth}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/60 hover:border-purple-550/30 cursor-pointer transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xs shrink-0">
                    {currentUser.name[0]?.toUpperCase()}
                  </div>
                  <div className="text-right overflow-hidden">
                    <h4 className="text-[11px] font-bold text-slate-200 truncate">{currentUser.name}</h4>
                    <span className="text-[9px] text-purple-400 font-semibold block truncate">عضوية سيادية ⭐</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-l from-purple-500 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white text-[10.5px] font-extrabold flex items-center justify-center gap-1 shadow-md shadow-purple-950/20 transition-all"
                >
                  <Sparkles size={12} className="animate-pulse" />
                  <span>الاشتراك بالمنصة 🌟</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Main Navigation / Tools */}
          <div>
             <div className="flex items-center gap-2 text-slate-200 mb-3 font-semibold">
                <Layers size={18} className="text-emerald-500" />
                <span>الأدوات</span>
             </div>
             
             <div className="space-y-2">
                <button 
                  onClick={() => {
                    onOpenProjectManager();
                    if (window.innerWidth < 1024) toggle();
                  }}
                  className="w-full flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-3 rounded-lg transition-all"
                >
                  <FolderKanban size={20} className="text-blue-400" />
                  <span className="font-bold">إدارة المشاريع</span>
                </button>

                <button 
                  onClick={() => {
                    onOpenDocs();
                    if (window.innerWidth < 1024) toggle();
                  }}
                  className="w-full flex items-center gap-2 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/50 p-3 rounded-lg transition-all"
                >
                  <Book size={20} />
                  <span className="font-bold">دليل الاستخدام</span>
                </button>

                <button 
                  onClick={() => {
                    onOpenAcademy();
                    if (window.innerWidth < 1024) toggle();
                  }}
                  className="w-full flex items-center gap-2 bg-gradient-to-l from-amber-950/20 to-yellow-950/20 hover:from-amber-900/30 hover:to-yellow-900/30 text-amber-400 border border-amber-900/45 p-3 rounded-lg transition-all shadow-md shadow-amber-950/10"
                  title="أكاديمية لغة البيان لتعلم البرمجة العربية من الصفر للاحتراف"
                >
                  <GraduationCap size={20} className="text-amber-400 animate-pulse" />
                  <span className="font-extrabold">أكاديمية البيان 🎓</span>
                </button>

                <button 
                  onClick={() => {
                    onOpenTemplates();
                    if (window.innerWidth < 1024) toggle();
                  }}
                  className="w-full flex items-center gap-2 bg-gradient-to-l from-teal-950/30 to-emerald-950/30 hover:from-teal-900/40 hover:to-emerald-900/40 text-teal-300 border border-teal-900/50 p-3 rounded-lg transition-all"
                  title="قوالب تطبيق أندرويد جاهزة بلغة البيان"
                >
                  <Smartphone size={20} className="text-teal-400" />
                  <span className="font-bold">قوالب الأندرويد 🤖</span>
                </button>

                <button 
                  onClick={() => {
                    if (onOpenCommunity) onOpenCommunity();
                    if (window.innerWidth < 1024) toggle();
                  }}
                  className="w-full flex items-center gap-2 bg-gradient-to-l from-purple-950/30 to-indigo-950/30 hover:from-purple-900/40 hover:to-indigo-900/40 text-purple-300 border border-purple-900/50 p-3 rounded-lg transition-all shadow-md shadow-purple-950/15"
                  title="مجتمع المشتركين الرقمي لمناقشة أكواد البيان وتبادل الخبرات"
                >
                  <MessageSquare size={20} className="text-purple-400 animate-pulse" />
                  <span className="font-black">مجتمع المشتركين 💬</span>
                </button>

                <button 
                  onClick={() => {
                    if (onOpenLibraryManager) onOpenLibraryManager();
                    if (window.innerWidth < 1024) toggle();
                  }}
                  className="w-full flex items-center gap-2 bg-gradient-to-l from-blue-950/40 to-indigo-950/40 hover:from-blue-900/40 hover:to-indigo-900/40 text-blue-300 border border-blue-900/50 p-3 rounded-lg transition-all shadow-md shadow-blue-950/15"
                  title="استعراض وتثبيت مكتبات إضافية للغة البيان من المستودع المركزي"
                  id="sidebar-library-manager-btn"
                >
                  <Grid size={20} className="text-blue-400 animate-pulse" />
                  <span className="font-extrabold">مستودع المكتبات 📦</span>
                </button>

                <button 
                  onClick={() => {
                    if (onOpenEnvChecker) onOpenEnvChecker();
                    if (window.innerWidth < 1024) toggle();
                  }}
                  className="w-full flex items-center gap-2 bg-gradient-to-l from-emerald-950/40 to-teal-950/40 hover:from-emerald-900/40 hover:to-teal-900/40 text-emerald-300 border border-emerald-800/50 p-3 rounded-lg transition-all shadow-md shadow-emerald-950/15"
                  title="فحص بيئة تشغيل النظام المحلي والتحقق من جافا ونود"
                  id="sidebar-env-checker-btn"
                >
                  <Terminal size={20} className="text-emerald-400 animate-pulse" />
                  <span className="font-extrabold">فحص بيئة التشغيل 🛠️</span>
                </button>

                <button 
                  onClick={onDownloadExtension}
                  className="w-full flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-3 rounded-lg transition-all text-xs"
                  title="تحميل ملفات تعريف VS Code للغة البيان"
                >
                  <Download size={16} />
                  <span>تحميل تعريفات المحرر (.byn)</span>
                </button>
             </div>
          </div>

          {/* Examples Section */}
          <div>
            <div className="flex items-center gap-2 text-slate-200 mb-3 font-semibold">
              <Zap size={18} className="text-yellow-500" />
              <span>أمثلة جاهزة</span>
            </div>
            <div className="space-y-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                      onLoadExample(ex.code);
                      if (window.innerWidth < 1024) toggle();
                  }}
                  className="w-full text-right px-3 py-2 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm transition-colors border border-transparent hover:border-slate-700"
                >
                  {ex.title}
                </button>
              ))}
            </div>
          </div>

          {/* Syntax Dictionary */}
          <div>
            <div className="flex items-center justify-between text-slate-200 mb-3 font-semibold">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-blue-500" />
                <span>القاموس</span>
              </div>
              <button 
                onClick={handleDownloadDictionary}
                className="text-xs bg-blue-900/30 hover:bg-blue-800 text-blue-400 px-2 py-1 rounded flex items-center gap-1 border border-blue-900/50 transition-colors"
                title="تحميل القاموس كملف نصي"
              >
                <Download size={12} />
                <span>txt</span>
              </button>
            </div>
            <div className="bg-slate-800/30 rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-800 text-slate-400">
                  <tr>
                    <th className="p-2 font-normal">العربية</th>
                    <th className="p-2 font-normal text-left">Technology</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {SYNTAX_MAP.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-800/50">
                      <td className="p-2 text-emerald-400 font-mono text-xs">{item.arabic}</td>
                      <td className="p-2 text-slate-400 font-mono text-left text-xs" dir="ltr">{item.english}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-600">
            v2.2.0 | Open Source Edition
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
