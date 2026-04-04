import { motion } from 'motion/react';
import { History, CheckCircle2, Cpu, Zap, Shield, Code, Rocket, BookOpen, Settings, Phone, Smartphone, ShoppingBag, Download, Terminal } from 'lucide-react';

export function Logs() {
  const logs = [
    {
      title: "Synthesis Phase 4: Intelligence Refinement",
      date: "Turn 19",
      icon: Terminal,
      color: "text-emerald-500",
      content: "Purged Home, Maps, Market, and Storage sub-systems. Set default operating mode to Chat. Initialized cinematic video generation: 'Jerald & Sophy: A High School Love Story'. Core now operates in Ultra-Streamlined Mode."
    },
    {
      title: "Synthesis Phase 3: Deep Core Activation",
      date: "Turn 18",
      icon: Zap,
      color: "text-blue-500",
      content: "De-activated surface sub-systems (Maps, Storage, Home Screen, Target Data). Re-enabled Video Generation Protocol. Migrated Python Mini AI to the Secret Vault. Updated Encryption Key to 2027. Core now operates in Deep Intelligence Mode."
    },
    {
      title: "Deep Intelligence Layer: Secret Vault",
      date: "Turn 17",
      icon: Shield,
      color: "text-red-500",
      content: "De-activated surface-level sub-systems (Agri-Smart, Vision, Motion, etc.) and initialized the 'Secret Vault'. Integrated specialized mini AIs: Math Master, Verse Forge, Shadow Node, Sage Mind, Bio Core, and Astro Link. Implemented end-to-end encryption for the hidden layer."
    },
    {
      title: "Python Mini AI: Master Synthesis",
      date: "Turn 16",
      icon: Terminal,
      color: "text-blue-500",
      content: "Engineered the 'Python' Mini AI—a master synthesis of all Nova sub-systems. Unified Agri-Smart, Vision, Motion, Telephony, Explorer, Storage, and Market Analysis into a single, high-performance intelligence node."
    },
    {
      title: "Deployment Intelligence Protocol",
      date: "Turn 15",
      icon: Rocket,
      color: "text-blue-600",
      content: "Integrated a comprehensive Deployment Guide into the system documentation. Provided step-by-step instructions for exporting code, setting up Capacitor, and building for Android/iOS."
    },
    {
      title: "Final Export Readiness",
      date: "Turn 14",
      icon: Download,
      color: "text-purple-500",
      content: "Nova AI is now fully optimized for external deployment. All sub-systems, including the Master Control OS, Phone Module, and Market Preview, are packaged and ready for export to GitHub or local storage."
    },
    {
      title: "Distribution Readiness Protocol",
      date: "Turn 13",
      icon: ShoppingBag,
      color: "text-orange-500",
      content: "Prepared Nova OS for global distribution. Optimized build assets and generated a Play Store Preview module. Provided comprehensive instructions for exporting to GitHub and publishing via Google Play Console."
    },
    {
      title: "Nova OS: Mobile Integration",
      date: "Turn 12",
      icon: Smartphone,
      color: "text-blue-400",
      content: "Nova AI has been fully integrated into a mobile-first operating system. Added a high-fidelity Home Screen with dynamic widgets, app grid, and status bar. Implemented a smartphone shell interface for immersive device control."
    },
    {
      title: "Drone Intelligence & Market Analysis",
      date: "Turn 11",
      icon: Cpu,
      color: "text-cyan-500",
      content: "Activated Drone Intelligence Protocol. Integrated real-time market analysis for consumer and industrial drones. Nova AI can now provide detailed specifications, pricing, and visual concepts for the latest aerial technology."
    },
    {
      title: "Communications Module Integrated",
      date: "Turn 10",
      icon: Phone,
      color: "text-green-500",
      content: "Nova AI is now integrated with the device's telephony systems. Added a dedicated Phone Interface with contact management and simulated call capabilities. Updated system instructions to handle 'Nova call [name]' commands."
    },
    {
      title: "Master Control Core Activation",
      date: "Turn 9",
      icon: Settings,
      color: "text-blue-400",
      content: "Nova AI has been elevated to the Master Control Core of the device. Integrated a real-time Control dashboard with live telemetry for CPU, Memory, Network, and Storage. Activated Control Protocol for sub-system management."
    },
    {
      title: "AI Studio Knowledge Integration",
      date: "Turn 8",
      icon: BookOpen,
      color: "text-indigo-500",
      content: "Imported comprehensive AI Studio documentation and FAQ. Integrated deep knowledge of Gemini API proxying, client-side security, and model modalities. Added a dedicated Documentation viewer for real-time reference."
    },
    {
      title: "Security & Access Protocol Fix",
      date: "Turn 7",
      icon: Shield,
      color: "text-red-600",
      content: "Resolved 'PERMISSION_DENIED' (403) errors by implementing a dynamic API key selection protocol. Added a dedicated 'Select API Key' button and updated all AI modules to use real-time key injection for paid model access."
    },
    {
      title: "Nova AI: Ultimate Synthesis (Doctor & Teacher)",
      date: "Turn 6",
      icon: BookOpen,
      color: "text-red-500",
      content: "Achieved absolute fusion of Gemini and ChatGPT neural architectures. Integrated professional 'Doctor' and 'Teacher' skill modules. Activated Multi-Source Search Protocol for exhaustive cross-referencing of web data."
    },
    {
      title: "Nova AI: Ultimate Gemini Fusion",
      date: "Turn 5",
      icon: Rocket,
      color: "text-orange-500",
      content: "Rebranded back to Nova AI with a focus on 'Ultimate Gemini Fusion'. Integrated melodic singing voice capabilities and enhanced the core neural architecture with the latest Gemini 3.1 specifications."
    },
    {
      title: "OmniCore Fusion & Accuracy Protocol",
      date: "Turn 4",
      icon: Shield,
      color: "text-blue-500",
      content: "Successfully combined ChatGPT and Nova AI into a singular, superior AI system named OmniCore. Implemented a strict Accuracy Protocol to eliminate hallucinations and ensure absolute factual precision via real-time cross-referencing."
    },
    {
      title: "Ultimate Synthesis Upgrade",
      date: "Turn 3",
      icon: Zap,
      color: "text-yellow-500",
      content: "Merged collective wisdom of Google AI, OpenAI, and Anthropic. Activated Game Architect Protocol for 2D/3D development and AI Cheat Code Master for advanced prompt engineering."
    },
    {
      title: "Visual Identity Overhaul",
      date: "Turn 2",
      icon: Cpu,
      color: "text-purple-500",
      content: "Replaced legacy icons with a high-quality, futuristic AI portrait. Updated header branding and system-ready states for a professional, immersive experience."
    },
    {
      title: "Multimodal Hub & Mini Models",
      date: "Turn 1",
      icon: Rocket,
      color: "text-green-500",
      content: "Integrated Gemini 3.1 Flash Lite (Mini) for rapid intelligence. Added Speech generation, Video, and Music modules. Prepared metadata for Play Store readiness."
    }
  ];

  return (
    <div className="flex h-full flex-col p-6 bg-white overflow-y-auto no-scrollbar">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
          <History size={24} className="text-slate-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-slate-900">Evolution Logs</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Development History // Nova AI Core</p>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-8 border-l-2 border-slate-100 pb-6 last:pb-0"
          >
            <div className={`absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-slate-200 ${log.color}`}>
              <log.icon size={10} />
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{log.date}</span>
              <CheckCircle2 size={12} className="text-green-500" />
            </div>
            
            <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-tight">{log.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {log.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 mb-4">
          <Code size={16} className="text-slate-400" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Technical Checkpoint</h4>
        </div>
        <p className="text-[10px] font-mono text-slate-400 break-all">
          https://aistudio.google.com/#:~:text=Skip%20to%20main,Checkpoint%20created
        </p>
      </div>
    </div>
  );
}
