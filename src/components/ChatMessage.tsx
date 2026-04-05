import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { User, Bot, Volume2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { generateSpeech } from '../lib/gemini';

interface ChatMessageProps {
  role: 'user' | 'model';
  content: string;
  type?: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  voiceName?: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
}

export function ChatMessage({ role, content, type, mediaUrl, voiceName = 'Zephyr' }: ChatMessageProps) {
  const isUser = role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleReadAloud = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioUrl = await generateSpeech(content, voiceName);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 10 : -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex w-full gap-4 p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border transition-all overflow-hidden ${
        isUser 
          ? 'bg-slate-100 text-slate-600 border-slate-200' 
          : 'bg-slate-900 text-white border-slate-800 shadow-sm'
      }`}>
        {isUser ? <User size={16} /> : (
          <img 
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=100&h=100&auto=format&fit=crop" 
            alt="Nova AI" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
      <div className={`flex max-w-[80%] flex-col gap-2 rounded-xl px-4 py-2 border transition-all relative group ${
        isUser 
          ? 'bg-slate-50 text-slate-700 border-slate-200 rounded-tr-none' 
          : 'bg-white text-slate-900 border-slate-200 rounded-tl-none shadow-sm'
      }`}>
        <div className="prose prose-sm max-w-none break-words">
          {content && <ReactMarkdown>{content}</ReactMarkdown>}
          
          {type === 'image' && mediaUrl && (
            <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
              <img src={mediaUrl} alt="Generated" className="w-full" referrerPolicy="no-referrer" />
            </div>
          )}
          
          {type === 'video' && mediaUrl && (
            <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
              <video src={mediaUrl} controls className="w-full" />
            </div>
          )}
          
          {type === 'audio' && mediaUrl && (
            <div className="mt-2">
              <audio src={mediaUrl} controls className="w-full h-8" />
            </div>
          )}
        </div>

        {!isUser && content && (
          <button
            onClick={handleReadAloud}
            className={`absolute -right-10 top-0 p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all opacity-0 group-hover:opacity-100 ${isSpeaking ? 'opacity-100 text-blue-600' : ''}`}
          >
            {isSpeaking ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
