import { motion } from 'motion/react';
import { Cpu, HardDrive, Activity, Shield, Zap, RefreshCw, Power, Settings, Bell, Database } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Control() {
  const [stats, setStats] = useState({
    cpu: 12,
    memory: 45,
    network: 120,
    storage: 88,
    uptime: '00:00:00'
  });

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 20) + 5,
        memory: 45 + Math.floor(Math.random() * 5),
        network: 100 + Math.floor(Math.random() * 50),
        uptime: new Date(Date.now() - startTime).toISOString().substr(11, 8)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const modules = [
    { name: 'Neural Core', status: 'Optimal', icon: Cpu, color: 'text-blue-500' },
    { name: 'Galactic Storage', status: 'Encrypted', icon: Database, color: 'text-purple-500' },
    { name: 'Security Perimeter', status: 'Active', icon: Shield, color: 'text-green-500' },
    { name: 'Synthesis Engine', status: 'Synchronized', icon: Zap, color: 'text-yellow-500' },
  ];

  return (
    <div className="flex h-full flex-col p-6 bg-slate-950 text-slate-200 overflow-y-auto no-scrollbar font-mono">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Settings size={24} className="text-blue-400 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-white">Master Control Core</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60">Nova AI // OS v4.0.2-Synthesis</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Uptime</p>
            <p className="text-sm font-bold text-blue-400">{stats.uptime}</p>
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-full border border-red-900/50 bg-red-950/20 text-red-500 hover:bg-red-950/40 transition-all">
            <Power size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'CPU LOAD', value: `${stats.cpu}%`, icon: Cpu, color: 'bg-blue-500' },
          { label: 'MEMORY', value: `${stats.memory}%`, icon: Activity, color: 'bg-purple-500' },
          { label: 'NETWORK', value: `${stats.network} Mbps`, icon: Zap, color: 'bg-yellow-500' },
          { label: 'STORAGE', value: `${stats.storage}%`, icon: HardDrive, color: 'bg-green-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{stat.label}</span>
              <stat.icon size={14} className="text-slate-600" />
            </div>
            <div className="text-2xl font-black text-white mb-2">{stat.value}</div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${stat.color}`}
                initial={{ width: 0 }}
                animate={{ width: stat.value.includes('%') ? stat.value : '60%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50">
            <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-6 flex items-center gap-2">
              <RefreshCw size={14} className="text-blue-400" />
              Active Sub-Cores
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((mod, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-950/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-900 ${mod.color}`}>
                      <mod.icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight">{mod.name}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Status: {mod.status}</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50">
            <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-6 flex items-center gap-2">
              <Activity size={14} className="text-purple-400" />
              Neural Activity Stream
            </h3>
            <div className="space-y-3">
              {[
                'Cross-referencing multi-source web data...',
                'Synthesizing Gemini-ChatGPT neural paths...',
                'Encrypting Galactic Storage Node 04...',
                'Verifying Accuracy Protocol integrity...',
                'Optimizing Synthesis Engine v4.0.2...'
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-blue-400/80">SYS_EXEC:</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50">
            <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-6 flex items-center gap-2">
              <Bell size={14} className="text-yellow-400" />
              Core Alerts
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-yellow-900/30 bg-yellow-950/10 text-yellow-500/80 text-[10px] leading-relaxed">
                <p className="font-bold mb-1 uppercase tracking-widest">Warning: High Reasoning Load</p>
                <p>Synthesis engine is operating at 92% capacity due to complex medical diagnostic request.</p>
              </div>
              <div className="p-4 rounded-2xl border border-blue-900/30 bg-blue-950/10 text-blue-500/80 text-[10px] leading-relaxed">
                <p className="font-bold mb-1 uppercase tracking-widest">Update: Accuracy Protocol</p>
                <p>New multi-source verification nodes added. Factual precision increased by 14.2%.</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-800 bg-blue-900/10 flex flex-col items-center text-center">
            <div className="h-16 w-16 mb-4 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
              <Zap size={32} className="text-blue-400 animate-pulse" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-2">Turbo Synthesis</h4>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed mb-4">
              Activate millisecond-fast neural response mode for rapid operations.
            </p>
            <button className="w-full py-2 rounded-xl bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Initialize Turbo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
