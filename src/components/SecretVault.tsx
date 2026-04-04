import { motion } from 'motion/react';
import { 
  Shield, Lock, Calculator, PenTool, Terminal, 
  GraduationCap, Dna, Orbit, ArrowLeft, Search,
  Zap, Cpu, Globe
} from 'lucide-react';
import { useState } from 'react';

interface SecretVaultProps {
  onNavigate: (mode: string) => void;
  onClose: () => void;
}

export function SecretVault({ onNavigate, onClose }: SecretVaultProps) {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const secretApps = [
    { id: 'math', icon: Calculator, label: 'Math Master', color: 'bg-blue-600', desc: 'Advanced Mathematics Professor' },
    { id: 'poet', icon: PenTool, label: 'Verse Forge', color: 'bg-purple-600', desc: 'Master Poet & Writer' },
    { id: 'hacker', icon: Terminal, label: 'Shadow Node', color: 'bg-red-600', desc: 'Security & Penetration Specialist' },
    { id: 'professor', icon: GraduationCap, label: 'Sage Mind', color: 'bg-slate-700', desc: 'Distinguished Academic' },
    { id: 'bio', icon: Dna, label: 'Bio Core', color: 'bg-emerald-600', desc: 'Life Sciences Specialist' },
    { id: 'astro', icon: Orbit, label: 'Astro Link', color: 'bg-indigo-600', desc: 'Cosmology & Astrophysics' },
  ];

  const handleUnlock = () => {
    if (passcode === '2026') {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPasscode('');
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-950 text-white p-6 font-sans">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Lock size={40} className="text-red-500 animate-pulse" />
            </div>
          </div>
          <h2 className={`text-2xl font-black tracking-tighter uppercase mb-2 ${error ? 'text-red-500' : 'text-white'}`}>
            {error ? 'Access Denied' : 'Encrypted Vault'}
          </h2>
          <p className="text-xs text-slate-400 mb-8 uppercase tracking-widest">
            {error ? 'Invalid Encryption Key' : 'Unauthorized Access is Prohibited'}
          </p>
          
          <div className="space-y-4">
            <input 
              type="password"
              placeholder="Enter Access Key..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center text-xl tracking-[1em] focus:outline-none focus:border-red-500/50 transition-all"
            />
            <button 
              onClick={handleUnlock}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95"
            >
              Decrypt Access
            </button>
            <button 
              onClick={onClose}
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Return to Surface
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white overflow-hidden font-sans">
      {/* Header */}
      <div className="shrink-0 p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
            <ArrowLeft size={20} className="text-slate-400" />
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase">Specialized Nodes</h2>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em]">Deep Intelligence Layer // Unlocked</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Secure Session</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="grid grid-cols-1 gap-4">
          {secretApps.map((app, i) => (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onNavigate(app.id)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group text-left"
            >
              <div className={`h-14 w-14 ${app.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <app.icon size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-tight mb-0.5">{app.label}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{app.desc}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap size={14} className="text-white" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
          <Globe size={24} className="text-slate-600 mx-auto mb-4" />
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest">
            These nodes operate outside the standard OS kernel. All interactions are end-to-end encrypted and bypass standard logging protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
