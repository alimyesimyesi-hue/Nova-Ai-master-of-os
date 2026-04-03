import { motion } from 'motion/react';
import { 
  MessageSquare, ImageIcon, Video, Music, MapPin, Sprout, 
  Settings, Phone, History, BookOpen, HardDrive, Cpu, 
  Zap, Shield, Search, Bell, Battery, Wifi, Signal, ShoppingBag, Terminal
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface HomeScreenProps {
  onNavigate: (mode: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const apps = [
    { id: 'chat', icon: MessageSquare, label: 'Nova Chat', color: 'bg-blue-500' },
    { id: 'maps', icon: MapPin, label: 'Explorer', color: 'bg-green-500' },
    { id: 'python', icon: Terminal, label: 'Python AI', color: 'bg-blue-600' },
    { id: 'market', icon: ShoppingBag, label: 'Market', color: 'bg-orange-500' },
    { id: 'storage', icon: HardDrive, label: 'Files', color: 'bg-amber-500' },
    { id: 'logs', icon: History, label: 'Logs', color: 'bg-slate-500' },
    { id: 'docs', icon: BookOpen, label: 'Docs', color: 'bg-indigo-500' },
    { id: 'control', icon: Settings, label: 'Control', color: 'bg-slate-700' },
  ];

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white overflow-hidden relative font-sans">
      {/* Dynamic Wallpaper Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-950 to-purple-900/40" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 blur-[120px] rounded-full"
        />
      </div>

      {/* Status Bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-2 text-[10px] font-bold tracking-widest text-white/60">
        <div className="flex items-center gap-1">
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Signal size={10} />
          <Wifi size={10} />
          <Battery size={10} className="rotate-90" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Time & Date Widget */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <button 
            onDoubleClick={() => onNavigate('vault')}
            className="text-6xl font-thin tracking-tighter mb-2 hover:text-blue-400 transition-colors"
          >
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="w-full max-w-md mb-12 relative group">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-focus-within:border-blue-500/50 transition-all" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text"
            placeholder="Search Nova AI..."
            className="w-full relative z-10 bg-transparent pl-12 pr-4 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none"
          />
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-8 w-full max-w-md">
          {apps.map((app, i) => (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onNavigate(app.id)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`h-14 w-14 ${app.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/40 group-hover:scale-110 transition-transform active:scale-95`}>
                <app.icon size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-bold tracking-tight text-white/80 group-hover:text-white transition-colors">{app.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Dock */}
      <div className="relative z-10 p-4 mb-4 mx-4 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-around">
        {[
          { id: 'chat', icon: MessageSquare, color: 'bg-blue-500' },
          { id: 'control', icon: Settings, color: 'bg-slate-700' },
          { id: 'docs', icon: BookOpen, color: 'bg-indigo-500' },
          { id: 'python', icon: Terminal, color: 'bg-blue-600' },
        ].map((app) => (
          <button 
            key={app.id}
            onClick={() => onNavigate(app.id)}
            className={`h-12 w-12 ${app.color} rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95`}
          >
            <app.icon size={20} className="text-white" />
          </button>
        ))}
      </div>
    </div>
  );
}
