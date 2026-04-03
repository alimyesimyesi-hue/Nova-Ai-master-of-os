import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HardDrive, File, Trash2, Upload, Search, Shield, Database, Folder, FolderPlus, ChevronRight, ArrowLeft } from 'lucide-react';
import { get, set, del, keys } from 'idb-keyval';

interface StoredFolder {
  id: string;
  name: string;
  parentId: string | null;
  lastModified: number;
}

interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  content: string | ArrayBuffer;
  parentId: string | null;
}

const TOTAL_CAPACITY = 12 * 1024 * 1024 * 1024; // 12GB in bytes

export function StorageManager() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [folders, setFolders] = useState<StoredFolder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allKeys = await keys();
      
      // Load Files
      const fileKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith('file_'));
      const loadedFiles: StoredFile[] = [];
      for (const key of fileKeys) {
        const file = await get(key);
        if (file) loadedFiles.push(file);
      }
      setFiles(loadedFiles.sort((a, b) => b.lastModified - a.lastModified));

      // Load Folders
      const folderKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith('folder_'));
      const loadedFolders: StoredFolder[] = [];
      for (const key of folderKeys) {
        const folder = await get(key);
        if (folder) loadedFolders.push(folder);
      }
      setFolders(loadedFolders.sort((a, b) => b.lastModified - a.lastModified));
    } catch (error) {
      console.error('Failed to load storage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    for (const file of Array.from(uploadedFiles)) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result;
        if (content) {
          const newFile: StoredFile = {
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: Date.now(),
            content: content,
            parentId: currentFolderId,
          };
          await set(newFile.id, newFile);
          setFiles(prev => [newFile, ...prev]);
        }
      };
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    const newFolder: StoredFolder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: folderName,
      parentId: currentFolderId,
      lastModified: Date.now(),
    };

    await set(newFolder.id, newFolder);
    setFolders(prev => [newFolder, ...prev]);
  };

  const handleDeleteFile = async (id: string) => {
    await del(id);
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDeleteFolder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this folder and all its contents?')) return;
    
    // Recursive delete would be better, but for simplicity:
    // Delete the folder itself
    await del(id);
    setFolders(prev => prev.filter(f => f.id !== id));

    // Delete files inside this folder
    const filesToDelete = files.filter(f => f.parentId === id);
    for (const file of filesToDelete) {
      await del(file.id);
    }
    setFiles(prev => prev.filter(f => f.parentId !== id));

    // Note: This doesn't handle nested folders. In a real app, you'd recurse.
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usedSpace = files.reduce((acc, file) => acc + file.size, 0);
  const usedPercentage = (usedSpace / TOTAL_CAPACITY) * 100;

  const currentFiles = files.filter(f => f.parentId === currentFolderId);
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);

  const filteredFiles = currentFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFolders = currentFolders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getBreadcrumbs = () => {
    const crumbs: StoredFolder[] = [];
    let tempId = currentFolderId;
    while (tempId) {
      const folder = folders.find(f => f.id === tempId);
      if (folder) {
        crumbs.unshift(folder);
        tempId = folder.parentId;
      } else {
        break;
      }
    }
    return crumbs;
  };

  return (
    <div className="flex h-full flex-col p-6 bg-white transition-colors">
      {/* Storage Header */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 transition-colors">
              <HardDrive size={24} className="text-slate-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-slate-900 transition-colors">Galactic Storage Node</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">12GB Quantum Capacity // Encrypted</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateFolder}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
            >
              <FolderPlus size={16} />
              New Folder
            </button>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95">
              <Upload size={16} />
              Upload Data
              <input type="file" multiple className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors">Storage Utilization</span>
            </div>
            <span className="text-[10px] font-sans font-bold text-slate-900 transition-colors">
              {formatSize(usedSpace)} / 12.00 GB ({usedPercentage.toFixed(4)}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 transition-colors">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${usedPercentage}%` }}
              className="h-full bg-slate-900 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <button 
          onClick={() => setCurrentFolderId(null)}
          className={`hover:text-slate-900 transition-colors ${!currentFolderId ? 'text-slate-900' : ''}`}
        >
          Root
        </button>
        {getBreadcrumbs().map((crumb) => (
          <div key={crumb.id} className="flex items-center gap-2">
            <ChevronRight size={12} />
            <button 
              onClick={() => setCurrentFolderId(crumb.id)}
              className={`hover:text-slate-900 transition-colors ${currentFolderId === crumb.id ? 'text-slate-900' : ''}`}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {/* File Explorer */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-colors">
        <div className="flex items-center gap-3 border-b border-slate-200 p-4 transition-colors">
          {currentFolderId && (
            <button 
              onClick={() => {
                const current = folders.find(f => f.id === currentFolderId);
                setCurrentFolderId(current?.parentId || null);
              }}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <Search size={16} className="text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search storage node..."
            className="w-full bg-transparent text-xs font-bold uppercase tracking-widest focus:outline-none text-slate-900 placeholder:text-slate-300 transition-colors"
          />
        </div>

        <div className="h-full overflow-y-auto p-4 no-scrollbar">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-slate-900" />
            </div>
          ) : filteredFiles.length === 0 && filteredFolders.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <HardDrive size={40} className="mb-4 opacity-10 text-slate-900" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                {searchQuery ? 'No matching data found' : 'This folder is empty'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {/* Folders */}
                {filteredFolders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 hover:border-slate-300 transition-all cursor-pointer"
                    onClick={() => setCurrentFolderId(folder.id)}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-400 transition-colors">
                      <Folder size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold uppercase tracking-tight text-slate-900 transition-colors">
                        {folder.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 transition-colors">
                        Folder // {new Date(folder.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="opacity-0 transition-all group-hover:opacity-100 text-slate-300 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}

                {/* Files */}
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors">
                      <File size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold uppercase tracking-tight text-slate-900 transition-colors">
                        {file.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 transition-colors">
                        {formatSize(file.size)} // {new Date(file.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteFile(file.id)}
                      className="opacity-0 transition-all group-hover:opacity-100 text-slate-300 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Security Footer */}
      <div className="mt-8 flex items-center gap-3 rounded-xl border border-dashed border-slate-200/50 p-4 transition-colors">
        <Shield size={16} className="text-slate-400" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">
          Quantum Encryption Layer Active // Data is sharded across the Galactic Core
        </p>
      </div>
    </div>
  );
}
