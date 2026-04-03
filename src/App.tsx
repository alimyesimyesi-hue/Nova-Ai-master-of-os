import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Trash2, Shield, BookOpen, Cpu, AlertTriangle, Zap, Image as ImageIcon, Video, Music, MapPin, MessageSquare, Sprout, HardDrive, Menu, X as CloseIcon, Plus, Mic, History, Settings, Phone, Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { KnowledgeManager } from './components/KnowledgeManager';
import { OverrideModal } from './components/OverrideModal';
import { StorageManager } from './components/StorageManager';
import { SystemLogs } from './components/SystemLogs';
import { SystemControl } from './components/SystemControl';
import { PhoneInterface } from './components/PhoneInterface';
import { HomeScreen } from './components/HomeScreen';
import { MarketPreview } from './components/MarketPreview';
import { DeploymentGuide } from './components/DeploymentGuide';
import { PythonModule } from './components/PythonModule';
import { SecretVault } from './components/SecretVault';
import { streamChat, generateImage, generateVideo, generateMusic, generateSpeech, Message, ChatContext, ChatModelKey } from './lib/gemini';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isTurbo, setIsTurbo] = useState(false);
  const [mode, setMode] = useState<ChatContext['mode'] | 'storage' | 'logs' | 'docs' | 'control' | 'market' | 'python' | 'vault' | 'home' | 'phone'>('home');
  const [chatModel, setChatModel] = useState<ChatModelKey>('flash');
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true); // Assume true initially

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true); // Assume success to mitigate race condition
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [knowledge, setKnowledge] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [lastReason, setLastReason] = useState('');
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string, reason?: string) => {
    const startTime = Date.now();
    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setProcessingTime(null);
    
    if (reason) {
      setIsScanning(true);
      setLastReason(reason);
    }

    try {
      if (mode === 'video') {
        const videoUrl = await generateVideo(content);
        setMessages([...newMessages, { role: 'model', content: 'Video generated successfully.', type: 'video', mediaUrl: videoUrl }]);
      } else {
        const assistantMessage: Message = { role: 'model', content: '' };
        setMessages([...newMessages, assistantMessage]);

        let fullContent = '';
        const context: ChatContext = { 
          knowledge, 
          urls, 
          reason: reason || lastReason, 
          turbo: isTurbo, 
          mode: mode === 'storage' || mode === 'logs' || mode === 'docs' || mode === 'control' || mode === 'phone' || mode === 'home' || mode === 'market' || mode === 'python' || mode === 'vault' ? 'chat' : mode,
          model: chatModel
        };
        const stream = streamChat(newMessages, context);

        for await (const chunk of stream) {
          if (fullContent === '') {
            setProcessingTime(Date.now() - startTime);
          }
          fullContent += chunk;
          setMessages([...newMessages, { role: 'model', content: fullContent }]);
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      let errorMessage = 'SYSTEM ERROR: Connection to mainframe lost. Retrying...';
      
      if (error.message?.includes('safety')) {
        errorMessage = 'I apologize, but I cannot fulfill this request due to safety protocols. Please provide a valid reason or rephrase your inquiry.';
      } else if (error.message?.includes('quota')) {
        errorMessage = 'SYSTEM OVERLOAD: Quota exceeded. Please wait for the next cycle.';
      } else if (error.message?.includes('permission') || error.message?.includes('403')) {
        errorMessage = 'PERMISSION DENIED: This model requires a paid API key. Please click the "Select API Key" button in the sidebar to continue.';
        setHasApiKey(false);
      }

      setMessages(prev => [
        ...prev,
        { role: 'model', content: errorMessage }
      ]);
    } finally {
      setIsLoading(false);
      setIsScanning(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-white text-slate-900 light-theme">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 0 }}
        className={`relative flex flex-col bg-slate-50 border-r border-slate-200 overflow-hidden transition-all duration-300 z-30`}
      >
        <div className="flex flex-col h-full w-[260px] p-3">
          <button
            onClick={clearChat}
            className="flex items-center gap-3 w-full rounded-lg border border-slate-200 p-3 text-sm font-bold hover:bg-slate-100 transition-colors mb-4"
          >
            <Plus size={16} />
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-1">
            <div className="px-2 mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Intelligence Level</p>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { id: 'mini', label: 'Mini' },
                  { id: 'flash', label: 'Flash' },
                  { id: 'pro', label: 'Pro' },
                  { id: 'coder', label: 'Coder' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setChatModel(m.id as ChatModelKey)}
                    className={`text-[10px] font-bold py-1.5 rounded-md transition-all ${
                      chatModel === m.id 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-2">Multimodal Hub</p>
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'python', icon: Terminal, label: 'Python Mini AI' },
              { id: 'chat', icon: MessageSquare, label: 'Chat' },
              { id: 'video', icon: Video, label: 'Generate Video' },
              { id: 'maps', icon: MapPin, label: 'Maps' },
              { id: 'market', icon: ShoppingBag, label: 'Market' },
              { id: 'storage', icon: HardDrive, label: 'Storage' },
              { id: 'logs', icon: History, label: 'System Logs' },
              { id: 'docs', icon: BookOpen, label: 'Documentation' },
              { id: 'control', icon: Settings, label: 'System Control' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id as any)}
                className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-all ${
                  mode === item.id 
                    ? 'bg-slate-200 text-slate-900' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon size={16} />
                <span className="font-bold">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-1">
            <button
              onClick={() => setIsTurbo(!isTurbo)}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-all ${
                isTurbo ? 'bg-green-100 text-green-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Zap size={16} className={isTurbo ? 'animate-pulse' : ''} />
              <span className="font-bold">Turbo Mode</span>
            </button>
            <button
              onClick={() => setIsKnowledgeOpen(true)}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-all"
            >
              <Shield size={16} />
              <span className="font-bold">Target Data</span>
            </button>
            <button
              onClick={() => setIsOverrideOpen(true)}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-all"
            >
              <Terminal size={16} />
              <span className="font-bold">Override</span>
            </button>
            {!hasApiKey && (
              <button
                onClick={handleOpenKey}
                className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all mt-2"
              >
                <Shield size={16} />
                <span className="font-bold">Select API Key</span>
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative bg-slate-50">
        {/* Phone Shell Overlay (Only visible on large screens to give phone feel) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-50 border-[12px] border-slate-900 rounded-[3rem] shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset]" />
        
        {/* Header */}
        {mode !== 'home' && (
          <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              {isSidebarOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 overflow-hidden rounded-md border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=100&h=100&auto=format&fit=crop" 
                  alt="Nova AI" 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xs font-black tracking-[0.3em] uppercase leading-none">Nova AI</h1>
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Omniscient Intelligence Node // PHD.MA.BSC</p>
              </div>
            </div>
          </div>
          {processingTime !== null && (
            <p className="text-[10px] font-sans font-bold text-slate-500">
              LATENCY: {processingTime}ms
            </p>
          )}
        </header>
        )}

        {/* Chat Area */}
        <main 
          ref={scrollRef}
          className={`flex-1 overflow-y-auto ${mode === 'storage' || mode === 'logs' || mode === 'docs' || mode === 'control' || mode === 'phone' || mode === 'home' || mode === 'market' || mode === 'python' || mode === 'vault' || mode === 'math' || mode === 'poet' || mode === 'hacker' || mode === 'professor' || mode === 'bio' || mode === 'astro' ? '' : 'px-4 py-8'}`}
        >
          {mode === 'storage' ? (
            <StorageManager />
          ) : mode === 'logs' ? (
            <SystemLogs />
          ) : mode === 'control' ? (
            <SystemControl />
          ) : mode === 'phone' ? (
            <PhoneInterface />
          ) : mode === 'market' ? (
            <MarketPreview onBack={() => setMode('home')} />
          ) : mode === 'home' ? (
            <HomeScreen onNavigate={(m) => setMode(m as any)} />
          ) : mode === 'vault' ? (
            <SecretVault onNavigate={(m) => setMode(m as any)} onClose={() => setMode('home')} />
          ) : mode === 'python' ? (
            <PythonModule onSend={handleSend} messages={messages} isLoading={isLoading} />
          ) : mode === 'math' || mode === 'poet' || mode === 'hacker' || mode === 'professor' || mode === 'bio' || mode === 'astro' ? (
            <div className="flex h-full flex-col bg-slate-950 text-white overflow-hidden">
              <div className="shrink-0 p-4 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMode('vault')} className="p-2 hover:bg-white/5 rounded-full">
                    <ArrowLeft size={18} />
                  </button>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                    {mode === 'math' ? 'Math Master' : 
                     mode === 'poet' ? 'Verse Forge' : 
                     mode === 'hacker' ? 'Shadow Node' : 
                     mode === 'professor' ? 'Sage Mind' : 
                     mode === 'bio' ? 'Bio Core' : 'Astro Link'}
                  </span>
                </div>
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} content={msg.content} type={msg.type} mediaUrl={msg.mediaUrl} />
                ))}
                {isLoading && <div className="text-[10px] font-bold text-blue-400 animate-pulse uppercase tracking-widest">Processing...</div>}
              </div>
              <div className="p-4 border-t border-white/10 bg-slate-900/50">
                <ChatInput onSend={handleSend} disabled={isLoading} />
              </div>
            </div>
          ) : mode === 'docs' ? (
            <div className="flex h-full flex-col p-6 bg-white overflow-y-auto no-scrollbar">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                  <BookOpen size={24} className="text-slate-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-slate-900">AI Studio Documentation</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Imported Knowledge Base // Gemini API</p>
                </div>
              </div>
              <div className="prose prose-slate prose-sm max-w-2xl">
                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">What is Build in AI Studio?</h3>
                <p className="text-xs text-slate-500 mb-4">AI Studio Build is a platform designed to take you from a simple prompt to a production-ready, AI-powered application using Gemini. Describe what you want to build with a prompt, and Gemini will generate an app for you.</p>
                
                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">Why does Build call Gemini API from client-side code?</h3>
                <p className="text-xs text-slate-500 mb-4">Normally it is best practice to call Gemini API from the server-side, so as not to expose your API key. But AI Studio has a Gemini API proxy for client-side calls, which attaches the API key without exposing it in the code.</p>

                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">Is my API key exposed when sharing apps?</h3>
                <p className="text-xs text-slate-500 mb-4">Don't use a real API key in your app. Use a placeholder value instead. process.env.GEMINI_API_KEY is set to a placeholder value that you can use. When another user uses your app, AI Studio proxies the calls to the Gemini API, replacing the placeholder value with the user's (not your) API key.</p>

                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">Permission Denied (403) Errors</h3>
                <p className="text-xs text-slate-500 mb-8">If you encounter a 403 error, it means the model requires a paid API key. Use the "Select API Key" button in the sidebar to provide a key from a paid Google Cloud project.</p>

                <div className="border-t pt-8">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 mb-6">Mobile Deployment Protocol</h3>
                  <DeploymentGuide />
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl">
                      <img 
                        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=200&h=200&auto=format&fit=crop" 
                        alt="Nova AI" 
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h2 className="text-2xl font-bold tracking-[0.2em] uppercase text-slate-900">System Ready</h2>
                    <p className="mt-2 font-bold uppercase text-xs text-slate-400">Awaiting security audit parameters...</p>
                    
                    <div className="mt-10 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        "Scan for SQL injection vulnerabilities",
                        "Trace human evolution from Australopithecus",
                        "Analyze the T-Rex vs Spinosaurus specs",
                        "Search for Earth-like exoplanets in Kepler data",
                        "Check global criminal registry for high-risk profiles"
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSend(suggestion)}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 hover:border-slate-400 hover:text-slate-900 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
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
              </AnimatePresence>
              
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                    <Terminal size={16} className="animate-pulse" />
                  </div>
                  <div className="flex space-x-1 py-3">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]"></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]"></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300"></div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Footer / Input Area */}
        {mode !== 'storage' && mode !== 'logs' && mode !== 'docs' && mode !== 'control' && mode !== 'phone' && mode !== 'home' && mode !== 'market' && mode !== 'python' && mode !== 'vault' && mode !== 'math' && mode !== 'poet' && mode !== 'hacker' && mode !== 'professor' && mode !== 'bio' && mode !== 'astro' && (
          <footer className="shrink-0 border-t p-4 bg-white">
            <div className="mx-auto max-w-3xl">
              <ChatInput onSend={handleSend} disabled={isLoading} />
              
              <div className="flex flex-col items-center gap-2 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center text-slate-400">
                  Created by Kaloleni Junior Secondary School • Mr Wesonga & Mr Moses
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Core Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">12GB Storage Node Online</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>

      <KnowledgeManager
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
        knowledge={knowledge}
        urls={urls}
        onSave={(k, u) => {
          setKnowledge(k);
          setUrls(u);
        }}
      />

      <OverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        onExecute={(cmd, reason) => handleSend(cmd, reason)}
      />
    </div>
  );
}
