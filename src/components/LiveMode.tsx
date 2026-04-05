import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, Terminal, Brain, Zap, MessageSquare } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

interface LiveModeProps {
  onClose: () => void;
}

export function LiveMode({ onClose }: LiveModeProps) {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
  const [selectedVoice, setSelectedVoice] = useState<'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr'>('Zephyr');
  
  const voiceLabels: Record<string, string> = {
    'Charon': 'Bass',
    'Kore': 'Soprano',
    'Zephyr': 'Utro',
    'Fenrir': 'Tenor',
    'Puck': 'Vivid'
  };
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const stopLive = () => {
    setIsActive(false);
    setStatus('idle');
    
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const startLive = async () => {
    try {
      setStatus('connecting');
      const apiKey = process.env.GEMINI_API_KEY || "";
      const ai = new GoogleGenAI({ apiKey });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      sessionRef.current = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } },
          },
          systemInstruction: "You are Nova AI in Live Mode. You are a real-time voice assistant. Keep your responses concise and conversational. You are the absolute fusion of Gemini and ChatGPT.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus('active');
            setIsActive(true);
            source.connect(processorRef.current!);
            processorRef.current!.connect(audioContextRef.current!.destination);
            
            processorRef.current!.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
              sessionRef.current?.sendRealtimeInput({
                audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
              });
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              const audioPart = message.serverContent.modelTurn.parts.find(p => p.inlineData?.data);
              if (audioPart?.inlineData?.data) {
                const base64Audio = audioPart.inlineData.data;
                const binaryAudio = atob(base64Audio);
                const bytes = new Uint8Array(binaryAudio.length);
                for (let i = 0; i < binaryAudio.length; i++) {
                  bytes[i] = binaryAudio.charCodeAt(i);
                }
                const pcmData = new Int16Array(bytes.buffer);
                const floatData = new Float32Array(pcmData.length);
                for (let i = 0; i < pcmData.length; i++) {
                  floatData[i] = pcmData[i] / 0x7FFF;
                }
                
                const buffer = audioContextRef.current!.createBuffer(1, floatData.length, 16000);
                buffer.getChannelData(0).set(floatData);
                
                const source = audioContextRef.current!.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContextRef.current!.destination);
                
                const startTime = Math.max(audioContextRef.current!.currentTime, nextStartTimeRef.current);
                source.start(startTime);
                nextStartTimeRef.current = startTime + buffer.duration;
              }
              
              const textPart = message.serverContent.modelTurn.parts.find(p => p.text);
              if (textPart?.text) {
                setTranscription(prev => [...prev.slice(-4), `AI: ${textPart.text}`]);
              }
            }
            
            if (message.serverContent?.interrupted) {
              // Handle interruption - clear queue
              nextStartTimeRef.current = audioContextRef.current?.currentTime || 0;
            }

            if (message.serverContent?.turnComplete) {
              // Turn complete
            }
          },
          onerror: (e) => {
            console.error('Live error:', e);
            setStatus('error');
            stopLive();
          },
          onclose: () => {
            stopLive();
          }
        }
      });
    } catch (error) {
      console.error('Failed to start live mode:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    return () => stopLive();
  }, []);

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white p-6 font-sans overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-900/20">
            <Mic size={20} className={isActive ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter uppercase">Nova Live Core</h2>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Real-time Neural Link // Active</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <PhoneOff size={24} className="text-slate-400 hover:text-red-500" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Visualizer Placeholder */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.div 
            animate={isActive ? {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-red-600/20 blur-3xl"
          />
          <div className="relative z-10 h-32 w-32 rounded-full border-2 border-red-500/30 flex items-center justify-center bg-slate-900 shadow-2xl">
            <Brain size={48} className={isActive ? 'text-red-500 animate-pulse' : 'text-slate-700'} />
          </div>
          
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  className="absolute h-32 w-32 rounded-full border border-red-500/50"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-2">
            {status === 'idle' ? 'Ready to Connect' : 
             status === 'connecting' ? 'Establishing Link...' : 
             status === 'active' ? 'Neural Link Established' : 'Link Error'}
          </h3>
          <p className="text-xs text-slate-400 uppercase tracking-widest max-w-xs mx-auto">
            {status === 'active' ? 'Speak naturally. Nova is listening to your voice in real-time.' : 
             'Secure end-to-end encrypted voice communication channel.'}
          </p>
        </div>

        {/* Transcription Overlay */}
        <div className="mt-8 w-full max-w-md space-y-2">
          <AnimatePresence>
            {transcription.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-mono text-slate-500 bg-white/5 p-2 rounded border border-white/5"
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-6 pb-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">Vocal Frequency Profile</p>
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {(['Charon', 'Kore', 'Zephyr', 'Fenrir', 'Puck'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVoice(v)}
                disabled={isActive}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedVoice === v 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                    : 'text-slate-500 hover:text-slate-300'
                } disabled:opacity-50`}
              >
                {voiceLabels[v]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            disabled={!isActive}
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            } disabled:opacity-50`}
          >
            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
          
          <button
            onClick={isActive ? stopLive : startLive}
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${
              isActive ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isActive ? <PhoneOff size={28} /> : <Zap size={28} />}
          </button>

          <button
            className="h-16 w-16 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:bg-white/10"
          >
            <Volume2 size={28} />
          </button>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-500 animate-ping' : 'bg-slate-600'}`} />
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
            {isActive ? 'Session Encrypted' : 'Standby Mode'}
          </span>
        </div>
      </div>
    </div>
  );
}
