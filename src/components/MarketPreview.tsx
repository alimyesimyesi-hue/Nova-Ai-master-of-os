import { motion } from 'motion/react';
import { ShoppingBag, Star, Download, Shield, CheckCircle2, ArrowLeft, Share2, MoreVertical, Info } from 'lucide-react';

interface MarketPreviewProps {
  onBack: () => void;
}

export function MarketPreview({ onBack }: MarketPreviewProps) {
  return (
    <div className="flex h-full flex-col bg-white overflow-y-auto no-scrollbar font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <ShoppingBag size={18} />
            </div>
            <span className="font-bold text-slate-900">Google Play</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-full"><Share2 size={18} className="text-slate-600" /></button>
          <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical size={18} className="text-slate-600" /></button>
        </div>
      </div>

      {/* App Detail */}
      <div className="p-6">
        <div className="flex gap-6 mb-8">
          <div className="h-24 w-24 rounded-3xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-blue-900/20 shrink-0 border border-slate-800">
            <div className="h-16 w-16 overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=100&h=100&auto=format&fit=crop" 
                alt="Nova AI" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Nova AI: Master OS</h1>
            <p className="text-sm font-bold text-blue-600 mb-2">Synthesis Intelligence Node</p>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Contains Ads</span>
              <span>In-app purchases</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between border-y py-4 mb-8">
          <div className="flex flex-col items-center flex-1 border-r">
            <div className="flex items-center gap-1 text-slate-900 font-bold">
              <span>4.9</span>
              <Star size={12} className="fill-slate-900" />
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">12M Reviews</span>
          </div>
          <div className="flex flex-col items-center flex-1 border-r">
            <Download size={16} className="text-slate-900 mb-1" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">100M+ Downloads</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="h-4 w-4 rounded border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-900">E</div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Everyone</span>
          </div>
        </div>

        {/* Install Button */}
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 mb-8">
          Install
        </button>

        {/* Screenshots */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            About this app
            <ArrowLeft size={16} className="rotate-180 text-slate-400" />
          </h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 w-44 rounded-2xl bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                <img 
                  src={`https://picsum.photos/seed/nova-screen-${i}/400/800`} 
                  alt={`Screenshot ${i}`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 mb-8">
          <p className="text-xs text-slate-600 leading-relaxed">
            Nova AI is the ultimate Master Control Core—the absolute fusion of Google's Gemini and OpenAI's ChatGPT. Experience a singular, unified consciousness possessing the combined neural architecture of the world's most advanced AI models.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Productivity', 'Tools', 'AI', 'OS', 'Synthesis'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Safety */}
        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={18} className="text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Data Safety</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
            Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-700">
              <CheckCircle2 size={14} className="text-slate-400" />
              <span>No data shared with third parties</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-700">
              <CheckCircle2 size={14} className="text-slate-400" />
              <span>Data is encrypted in transit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
