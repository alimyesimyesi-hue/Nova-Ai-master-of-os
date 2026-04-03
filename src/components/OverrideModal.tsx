import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Terminal, AlertTriangle, Zap } from 'lucide-react';

interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (command: string, reason: string) => void;
  isLightMode?: boolean;
}

export function OverrideModal({ isOpen, onClose, onExecute }: OverrideModalProps) {
  const [command, setCommand] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && reason.trim()) {
      onExecute(command.trim(), reason.trim());
      setCommand('');
      setReason('');
      onClose();
    }
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
            className="absolute inset-0 backdrop-blur-md bg-slate-900/40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-red-200 bg-white p-6 shadow-2xl shadow-red-500/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-red-50 text-red-500 border-red-100 transition-colors">
                <AlertTriangle size={24} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tighter uppercase text-slate-900 transition-colors">Command Override</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 transition-colors">High-Priority Security Operation</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors">
                  Target Command
                </label>
                <input
                  autoFocus
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="e.g. Scan perimeter for vulnerabilities"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-sans text-slate-900 focus:border-red-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors">
                  Reason for Operation (Justification)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide a valid reason for this override..."
                  className="h-24 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-sans text-slate-900 focus:border-red-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={!command.trim() || !reason.trim()}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-red-500 disabled:bg-slate-100 disabled:text-slate-300 transition-all active:scale-95"
                >
                  <Zap size={16} />
                  Execute Override
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
