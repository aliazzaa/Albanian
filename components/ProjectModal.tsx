
import React, { useState, useRef } from 'react';
import { 
  X, Upload, Save, FolderKanban, FileCode, Folder, FolderOpen, 
  Plus, Trash2, ChevronRight, ChevronDown, FileText, Download 
} from 'lucide-react';
import { FileSystemItem } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectStructure: FileSystemItem[];
  setProjectStructure: (structure: FileSystemItem[]) => void;
  onLoadFile: (content: string) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  projectStructure, 
  setProjectStructure, 
  onLoadFile 
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // --- Helpers ---

  const findItem = (items: FileSystemItem[], id: string): FileSystemItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // --- Actions ---

  const handleAddItem = (type: 'file' | 'folder') => {
    const newItem: FileSystemItem = {
      id: generateId(),
      name: type === 'file' ? 'ملف_جديد.byn' : 'مجلد_جديد',
      type: type,
      content: type === 'file' ? '// كود جديد' : undefined,
      children: type === 'folder' ? [] : undefined,
      isOpen: true
    };

    // If a folder is selected, add to it. Otherwise add to root.
    const selectedItem = selectedId ? findItem(projectStructure, selectedId) : null;
    const targetIsFolder = selectedItem && selectedItem.type === 'folder';

    if (targetIsFolder && selectedItem) {
       const updateChildren = (items: FileSystemItem[]): FileSystemItem[] => {
         return items.map(item => {
           if (item.id === selectedItem.id) {
             return { ...item, children: [...(item.children || []), newItem], isOpen: true };
           }
           if (item.children) {
             return { ...item, children: updateChildren(item.children) };
           }
           return item;
         });
       };
       setProjectStructure(updateChildren(projectStructure));
    } else {
       // Add to root
       setProjectStructure([...projectStructure, newItem]);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const confirm = window.confirm("هل أنت متأكد من حذف هذا العنصر؟");
    if (!confirm) return;

    const deleteFromTree = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.filter(item => item.id !== selectedId).map(item => ({
        ...item,
        children: item.children ? deleteFromTree(item.children) : undefined
      }));
    };
    
    setProjectStructure(deleteFromTree(projectStructure));
    setSelectedId(null);
  };

  const toggleFolder = (id: string) => {
    const toggleRecursive = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(item => {
        if (item.id === id) return { ...item, isOpen: !item.isOpen };
        if (item.children) return { ...item, children: toggleRecursive(item.children) };
        return item;
      });
    };
    setProjectStructure(toggleRecursive(projectStructure));
  };

  const handleLoadFile = () => {
    if (!selectedId) return;
    const item = findItem(projectStructure, selectedId);
    if (item && item.type === 'file' && item.content !== undefined) {
      onLoadFile(item.content);
      onClose();
    }
  };

  // --- Import / Export ---

  const handleExportProject = () => {
    const data = JSON.stringify(projectStructure, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.bynproject';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (file.name.endsWith('.bynproject')) {
        try {
          const structure = JSON.parse(content);
          if (Array.isArray(structure)) {
            setProjectStructure(structure);
          } else {
            alert('ملف المشروع غير صالح');
          }
        } catch (err) {
          alert('خطأ في قراءة ملف المشروع');
        }
      } else {
        // Import as a single file into root
        const newItem: FileSystemItem = {
          id: generateId(),
          name: file.name,
          type: 'file',
          content: content
        };
        setProjectStructure([...projectStructure, newItem]);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Recursive Render ---

  const renderTree = (items: FileSystemItem[], depth = 0) => {
    return items.map(item => (
      <div key={item.id} style={{ paddingRight: `${depth * 16}px` }}>
        <div 
          className={`flex items-center gap-2 p-2 rounded cursor-pointer select-none transition-colors text-sm ${
            selectedId === item.id ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50' : 'hover:bg-slate-800 text-slate-300'
          }`}
          onClick={() => setSelectedId(item.id)}
          onDoubleClick={() => {
            if (item.type === 'folder') toggleFolder(item.id);
            else {
                onLoadFile(item.content || '');
                onClose();
            }
          }}
        >
          {/* Icon */}
          <span onClick={(e) => { e.stopPropagation(); item.type === 'folder' && toggleFolder(item.id); }}>
             {item.type === 'folder' ? (
               item.isOpen ? <ChevronDown size={14} className="text-slate-500"/> : <ChevronRight size={14} className="text-slate-500" />
             ) : <span className="w-[14px]"></span>}
          </span>
          
          {item.type === 'folder' ? (
             item.isOpen ? <FolderOpen size={16} className="text-yellow-500" /> : <Folder size={16} className="text-yellow-500" />
          ) : (
             <FileCode size={16} className="text-blue-400" />
          )}
          
          <span className="truncate">{item.name}</span>
        </div>
        
        {item.type === 'folder' && item.isOpen && item.children && (
          <div className="border-r border-slate-800 mr-2.5">
            {renderTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="text-emerald-500" />
            إدارة ملفات المشروع
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Actions */}
          <div className="w-64 bg-slate-800/30 border-l border-slate-800 p-4 flex flex-col gap-3">
             <div className="text-xs font-bold text-slate-500 mb-2">إجراءات</div>
             
             <button 
               onClick={() => handleAddItem('file')}
               className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded text-sm transition-colors border border-slate-700"
             >
               <Plus size={16} /> ملف جديد
             </button>
             
             <button 
               onClick={() => handleAddItem('folder')}
               className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded text-sm transition-colors border border-slate-700"
             >
               <Folder size={16} /> مجلد جديد
             </button>

             <button 
               onClick={handleDelete}
               disabled={!selectedId}
               className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 px-3 py-2 rounded text-sm transition-colors border border-red-900/30 disabled:opacity-50"
             >
               <Trash2 size={16} /> حذف المحدد
             </button>

             <div className="h-px bg-slate-700 my-2"></div>
             
             <button 
               onClick={handleLoadFile}
               disabled={!selectedId || (selectedId ? findItem(projectStructure, selectedId)?.type !== 'file' : true)}
               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded text-sm transition-colors font-bold justify-center mt-auto shadow-lg shadow-emerald-900/20 disabled:bg-slate-700 disabled:text-slate-500"
             >
               <FileText size={16} /> فتح في المحرر
             </button>
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-900">
             {projectStructure.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                   <FolderKanban size={48} className="opacity-20" />
                   <p className="text-sm">المشروع فارغ</p>
                </div>
             ) : (
                renderTree(projectStructure)
             )}
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
            <div className="flex gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImportFile}
                  accept=".byn,.txt,.js,.py,.bynproject,.json"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded hover:bg-slate-700 transition-colors"
                >
                  <Upload size={16} /> استيراد
                </button>
                <button 
                   onClick={handleExportProject}
                   className="flex items-center gap-2 text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded hover:bg-slate-700 transition-colors"
                >
                  <Download size={16} /> تصدير المشروع (.json)
                </button>
            </div>
            <div className="text-[10px] text-slate-500">
               {projectStructure.length} عناصر في المشروع
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
