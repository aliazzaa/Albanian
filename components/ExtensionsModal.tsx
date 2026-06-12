
import React, { useState } from 'react';
import { X, Puzzle, Check, DownloadCloud, Trash2, Search } from 'lucide-react';

interface ExtensionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  installed: boolean;
  enabled: boolean;
  author: string;
}

const INITIAL_EXTENSIONS: Extension[] = [
  { 
      id: '1', 
      name: 'مقتطفات البيان (Snippets)', 
      description: 'مجموعة اختصارات برمجية لتسريع كتابة الأوامر الشائعة مثل الحلقات والشروط.', 
      version: '1.2.0', 
      installed: true, 
      enabled: true,
      author: 'Al-Bayan Team'
  },
  { 
      id: '2', 
      name: 'سمة الظلام الحالك (Deep Dark)', 
      description: 'سمة داكنة عالية التباين مريحة للعين أثناء البرمجة الليلية.', 
      version: '1.0.1', 
      installed: false, 
      enabled: false,
      author: 'Community'
  },
  { 
      id: '3', 
      name: 'مدقق لغوي (Linter)', 
      description: 'تحليل الكود واكتشاف الأخطاء اللغوية والنحوية في المتغيرات العربية.', 
      version: '0.9.5', 
      installed: false, 
      enabled: false,
      author: 'Ahmed Dev'
  },
  { 
      id: '4', 
      name: 'Git Lens Arabi', 
      description: 'تكامل مع نظام Git لإظهار تاريخ التعديلات على الأسطر.', 
      version: '2.1.0', 
      installed: false, 
      enabled: false,
      author: 'Open Source'
  },
  {
      id: '5',
      name: 'React Native Bridge',
      description: 'أدوات تجريبية لتصدير كود البيان إلى React Native.',
      version: '0.1.0-alpha',
      installed: false,
      enabled: false,
      author: 'Al-Bayan Labs'
  }
];

const ExtensionsModal: React.FC<ExtensionsModalProps> = ({ isOpen, onClose }) => {
  const [extensions, setExtensions] = useState(INITIAL_EXTENSIONS);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const toggleInstall = (id: string) => {
    setExtensions(prev => prev.map(ext => {
      if (ext.id === id) {
        const isInstalling = !ext.installed;
        return { ...ext, installed: isInstalling, enabled: isInstalling };
      }
      return ext;
    }));
  };

  const toggleEnable = (id: string) => {
     setExtensions(prev => prev.map(ext => {
      if (ext.id === id && ext.installed) {
        return { ...ext, enabled: !ext.enabled };
      }
      return ext;
    }));
  };

  const filtered = extensions.filter(e => e.name.includes(search) || e.description.includes(search));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-2xl h-full sm:h-[85vh] rounded-none sm:rounded-2xl border-0 sm:border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Puzzle className="text-purple-500" />
            سوق الإضافات (Extensions Marketplace)
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/30">
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="ابحث عن إضافات..." 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pr-10 pl-4 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-all"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
           {filtered.map(ext => (
             <div key={ext.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-slate-600 transition-colors gap-4">
                <div className="flex items-start gap-4">
                   <div className={`w-12 h-12 rounded-lg flex items-center justify-center border shrink-0 ${ext.enabled ? 'bg-purple-900/20 border-purple-500/30' : 'bg-slate-800 border-slate-700'}`}>
                      <Puzzle size={24} className={ext.enabled ? "text-purple-400" : "text-slate-600"} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-200 text-base">{ext.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ext.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-mono">
                         <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">v{ext.version}</span>
                         <span>by {ext.author}</span>
                         {ext.installed && <span className="text-emerald-500 flex items-center gap-1"><Check size={10} /> مثبت</span>}
                      </div>
                   </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                   {!ext.installed ? (
                      <button 
                        onClick={() => toggleInstall(ext.id)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                      >
                         <DownloadCloud size={14} /> تثبيت
                      </button>
                   ) : (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button 
                            onClick={() => toggleEnable(ext.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors border flex-1 sm:flex-initial ${
                                ext.enabled 
                                ? 'bg-purple-600/20 border-purple-500/50 text-purple-400 hover:bg-purple-600/30' 
                                : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                            }`}
                        >
                            {ext.enabled ? 'مفعل' : 'تعطيل'}
                        </button>
                        <button 
                            onClick={() => toggleInstall(ext.id)}
                            className="bg-red-900/10 hover:bg-red-900/30 text-red-400 border border-red-900/20 px-3 py-2 rounded-lg text-xs flex items-center justify-center transition-colors"
                            title="إزالة الإضافة"
                        >
                            <Trash2 size={14} />
                        </button>
                      </div>
                   )}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ExtensionsModal;
