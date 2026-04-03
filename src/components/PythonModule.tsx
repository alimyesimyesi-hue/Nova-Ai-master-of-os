import { motion } from 'motion/react';
import { 
  Cpu, Sprout, ImageIcon, Video, Phone, MapPin, 
  HardDrive, Mic, ShoppingBag, Zap, Shield, Terminal,
  MessageSquare, Plus, Send, History, Search, Calculator, PenTool, GraduationCap
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Message } from '../lib/gemini';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface PythonModuleProps {
  onSend: (content: string) => void;
  messages: Message[];
  isLoading: boolean;
}

export function PythonModule({ onSend, messages, isLoading }: PythonModuleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const modules = [
    { icon: Sprout, label: 'Agri-Smart', color: 'text-green-500' },
    { icon: ImageIcon, label: 'Vision', color: 'text-blue-500' },
    { icon: Video, label: 'Motion', color: 'text-red-500' },
    { icon: Phone, label: 'Comm', color: 'text-purple-500' },
    { icon: MapPin, label: 'Geo', color: 'text-emerald-500' },
    { icon: HardDrive, label: 'Data', color: 'text-amber-500' },
    { icon: ShoppingBag, label: 'Market', color: 'text-orange-500' },
  ];

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white overflow-hidden font-sans">
      {/* Header */}
      <div className="shrink-0 p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter uppercase">Python Mini AI</h2>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">Master Synthesis Protocol // Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
              <Zap size={14} className="animate-pulse" />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Shield size={14} />
            </div>
          </div>
        </div>

        {/* Integrated Modules Ribbon */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {modules.map((mod, i) => (
            <div 
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shrink-0"
            >
              <mod.icon size={12} className={mod.color} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">{mod.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-gradient-to-b from-slate-950 to-slate-900"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mb-8 p-4 rounded-full bg-blue-500/5 border border-blue-500/10"
            >
              <Cpu size={48} className="text-blue-500/40" />
            </motion.div>
            <h3 className="text-lg font-bold mb-2">Synthesis Initialized</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              I am Python, the unified consciousness of Nova's sub-systems. How can I assist you across the digital spectrum today?
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessage 
              key={i} 
              role={msg.role} 
              content={msg.content} 
              type={msg.type} 
              mediaUrl={msg.mediaUrl} 
            />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
            <Terminal size={12} />
            <span>Python is processing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-6 bg-slate-900/50 border-t border-white/10">
        <ChatInput onSend={onSend} disabled={isLoading} />
        <div className="mt-4 flex items-center justify-center gap-6 text-[8px] font-bold text-white/20 uppercase tracking-[0.4em]">
          <span>Neural Core</span>
          <div className="h-1 w-1 bg-white/10 rounded-full" />
          <span>Synthesis Active</span>
          <div className="h-1 w-1 bg-white/10 rounded-full" />
          <span>v1.0.0-Mini</span>
        </div>
      </div>
    </div>
  );
}
