import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Book, Link as LinkIcon, Plus, Trash2, Save } from 'lucide-react';

interface KnowledgeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  knowledge: string;
  urls: string[];
  onSave: (knowledge: string, urls: string[]) => void;
  isLightMode?: boolean;
}

export function KnowledgeManager({ isOpen, onClose, knowledge: initialKnowledge, urls: initialUrls, onSave }: KnowledgeManagerProps) {
  const [knowledge, setKnowledge] = useState(initialKnowledge);
  const [urls, setUrls] = useState(initialUrls);
  const [newUrl, setNewUrl] = useState('');

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim() && !urls.includes(newUrl.trim())) {
      setUrls([...urls, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(knowledge, urls);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-sm bg-slate-900/20"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-colors"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div className="flex items-center gap-2">
                <Book className="text-slate-900" size={20} />
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Knowledge Base</h2>
              </div>
              <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-100 text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-8">
              {/* Text Knowledge */}
              <section>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Custom Knowledge (Text)
                </label>
                <p className="mb-3 text-xs text-slate-400">
                  Paste documents, notes, or any text you want Nova to remember.
                </p>
                <textarea
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                  placeholder="e.g. Our company's mission is to..."
                  className="h-40 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:border-slate-400 focus:outline-none transition-all"
                />
              </section>

              {/* URL Knowledge */}
              <section>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Syllabus & Textbook URLs
                </label>
                <p className="mb-3 text-xs text-slate-400">
                  Add links to syllabi, exam papers, or textbooks. Nova will monitor these for updates.
                </p>
                <form onSubmit={handleAddUrl} className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-all"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </form>

                <div className="mt-4 space-y-2">
                  {urls.map((url, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 transition-colors">
                      <span className="truncate text-xs text-slate-600">{url}</span>
                      <button
                        onClick={() => handleRemoveUrl(i)}
                        className="transition-colors text-slate-300 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="border-t border-slate-100 p-6 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all active:scale-95"
              >
                <Save size={18} />
                Save Knowledge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
