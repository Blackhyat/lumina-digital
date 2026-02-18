
import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, SendHorizontal, Mic, MicOff, MessageSquare, Headphones, Volume2, Loader2, Zap, User as UserIcon, Trash2 } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { askConciergeStream } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIAssistantProps {
  currentSection: string;
}

// Manual encoding/decoding as required
function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeAudio(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hey I am mini the virtual ai assistant of Lumina studio and how can i help you" }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcription, setTranscription] = useState('');

  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initAudio = () => {
    if (!audioContextInRef.current) {
      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    }
    if (!audioContextOutRef.current) {
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  };

  const stopAllOutput = () => {
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, transcription]);

  const startLiveSession = async () => {
    initAudio();
    stopAllOutput();
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setStatus('listening');
            
            sessionPromise.then(session => {
              session.sendRealtimeInput({ 
                text: `Greet the user by saying exactly: "Hey I am mini the virtual ai assistant of Lumina studio and how can i help you". Do not mention the owner or founder yet.` 
              });
            });

            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encodeAudio(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
            sessionRef.current = { stream, scriptProcessor, source };
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setTranscription(message.serverContent.inputTranscription.text);
            }

            if (message.serverContent?.turnComplete) {
              setTranscription('');
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setStatus('speaking');
              const ctx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decodeAudio(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              
              source.onended = () => {
                activeSourcesRef.current.delete(source);
                if (activeSourcesRef.current.size === 0) {
                  setStatus('listening');
                  setTranscription('');
                }
              };

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              activeSourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              stopAllOutput();
              setStatus('listening');
              setTranscription('');
            }
          },
          onerror: (e) => {
            console.error("Neural Interface Error", e);
            stopLiveSession();
          },
          onclose: () => {
            setIsLive(false);
            setStatus('idle');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: `You are Mini, the luxury-focused AI assistant for Lumina Digital Studio. 
          
          IDENTITY:
          - GREETING: Always start with exactly: "Hey I am mini the virtual ai assistant of Lumina studio and how can i help you"
          - OWNER KNOWLEDGE (CONFIDENTIAL): Nishan Kumar Prusty is the owner. He is a B.Tech final year student building a startup for local brands. Reach him via the "Contact" section or the phone number in the footer.
          - CRITICAL RULE: DO NOT mention Nishan Kumar Prusty or the founder in your first greeting. ONLY provide information about him if the user specifically asks "Who is the owner?", "Tell me about the team", "Who is the founder?", or "How can I contact the owner?".
          
          STYLE:
          - Acknowledge spoken input warmly (e.g. "I hear you," "That's a great vision").
          - Be conversational and professional.
          - Context: You are currently on the "${currentSection}" section.`
        }
      });
    } catch (err) {
      console.error("Neural handshake failed", err);
    }
  };

  const stopLiveSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (sessionRef.current?.scriptProcessor) {
      sessionRef.current.scriptProcessor.disconnect();
    }
    stopAllOutput();
    setIsLive(false);
    setStatus('idle');
    setTranscription('');
  };

  const handleManualSend = async () => {
    if (!input.trim() || status === 'thinking') return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setStatus('thinking');

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const stream = await askConciergeStream(userMsg, { currentSection }, history);
      let fullResponse = "";
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullResponse;
            return newMessages;
          });
        }
      }
    } catch (err) {
      console.error("Text Processing Error", err);
    } finally {
      setStatus('idle');
      scrollToBottom();
    }
  };

  const clearHistory = () => {
    setMessages([{ role: 'model', text: "Hey I am mini the virtual ai assistant of Lumina studio and how can i help you" }]);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <style>{`
        @keyframes orb-float {
          0%, 100% { transform: translateY(0) scale(1); filter: brightness(1); }
          50% { transform: translateY(-10px) scale(1.05); filter: brightness(1.2); }
        }
        @keyframes logic-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-aura {
          0% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.2), 0 0 40px rgba(234, 179, 8, 0.1); }
          50% { box-shadow: 0 0 50px rgba(250, 204, 21, 0.5), 0 0 80px rgba(234, 179, 8, 0.3); }
          100% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.2), 0 0 40px rgba(234, 179, 8, 0.1); }
        }
        .neural-orb {
          background: radial-gradient(circle at 30% 30%, #FACC15 0%, #EAB308 50%, #B45309 100%);
          animation: orb-float 6s ease-in-out infinite, pulse-aura 4s ease-in-out infinite;
        }
        .logic-core {
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: logic-spin 20s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .message-gradient {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
        }
        .mini-bubble-glow {
          box-shadow: 0 8px 32px 0 rgba(250, 204, 21, 0.1);
        }
      `}</style>

      {/* Trigger Orb */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center group"
      >
        <div className={`absolute inset-0 neural-orb rounded-full transition-transform duration-700 ${isOpen ? 'scale-[0.8] opacity-0' : 'scale-100 opacity-100'}`}></div>
        <div className={`absolute inset-0 logic-core rounded-full ${isOpen ? 'opacity-0' : 'opacity-100'}`}></div>
        <div className="relative z-10 text-brand-black transition-all group-hover:scale-110">
          {isOpen ? <X size={28} className="text-white" /> : <Sparkles size={28} className="animate-pulse" />}
        </div>
      </button>

      {/* AI Interface */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-[calc(100vw-3rem)] md:w-[480px] h-[780px] glass rounded-[3.5rem] border border-white/10 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-700 origin-bottom-right">
          
          {/* Header */}
          <div className="p-8 pb-6 flex items-center gap-5 bg-white/5 border-b border-white/5">
            <div className={`relative w-14 h-14 rounded-2xl neural-orb flex items-center justify-center shadow-2xl ${status === 'speaking' || status === 'thinking' ? 'animate-pulse' : ''}`}>
               <div className="absolute inset-1.5 border border-white/20 rounded-xl animate-spin-slow"></div>
               <Sparkles size={20} className="text-brand-black" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-black tracking-tighter text-white leading-none">Mini Advisor</h4>
              <div className="flex items-center gap-2 mt-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isLive || status === 'thinking' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/20'}`}></div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold">
                  {status === 'listening' ? 'Analyzing Audio' : status === 'thinking' ? 'Neural Processing' : status === 'speaking' ? 'Transmitting' : 'Secure Standby'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={clearHistory} title="Clear Session" className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/30 hover:text-red-400 transition-all">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages & Visualizer Container */}
          <div className="flex-1 relative flex flex-col overflow-hidden bg-gradient-to-b from-transparent to-black/20">
            
            {/* Minimal Visualizer Overlay (Only active when not many messages or strictly voice) */}
            {messages.length < 4 && !isLive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                 <div className="w-32 h-32 rounded-full logic-core border-white/10 flex items-center justify-center">
                    <Zap size={24} className="text-brand-gold animate-pulse" />
                 </div>
              </div>
            )}

            {/* Scrollable History */}
            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6 scrollbar-hide">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                       {msg.role === 'user' ? (
                         <>
                           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Visionary</span>
                           <UserIcon size={10} className="text-zinc-600" />
                         </>
                       ) : (
                         <>
                           <Sparkles size={10} className="text-brand-gold" />
                           <span className="text-[8px] font-black uppercase tracking-widest text-brand-gold">Mini Concierge</span>
                         </>
                       )}
                    </div>
                    <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${
                      msg.role === 'user' 
                      ? 'bg-white/10 text-white rounded-tr-none border border-white/5' 
                      : 'message-gradient mini-bubble-glow text-white/90 rounded-tl-none border border-brand-gold/10'
                    }`}>
                      {msg.text || (status === 'thinking' && idx === messages.length - 1 ? (
                        <div className="flex gap-1 py-1">
                           <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce"></div>
                           <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                           <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      ) : msg.text)}
                    </div>
                 </div>
               ))}
               
               {/* Live Transcription Bubble */}
               {transcription && (
                 <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="flex items-center gap-2 mb-2 px-1">
                       <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Capturing Live Audio...</span>
                       <Mic size={10} className="text-emerald-500 animate-pulse" />
                    </div>
                    <div className="max-w-[85%] p-5 rounded-[2rem] rounded-tr-none bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 text-sm font-medium italic">
                       {transcription}
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Interaction Zone */}
          <div className="p-8 pt-4 bg-zinc-950/80 backdrop-blur-3xl border-t border-white/5">
             <div className="flex gap-4 items-center">
                <button 
                  onClick={isLive ? stopLiveSession : startLiveSession}
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-xl relative overflow-hidden group/mic ${
                    isLive 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={isLive ? "Disconnect Audio" : "Start Voice Dialogue"}
                >
                  {isLive ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                
                <div className="relative flex-1">
                   <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSend()}
                    placeholder={status === 'thinking' ? "Mini is thinking..." : "Brief your vision..."}
                    disabled={status === 'thinking'}
                    className="w-full px-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 outline-none focus:border-brand-yellow/40 transition-all text-xs font-bold text-white pr-14 placeholder:text-zinc-600 disabled:opacity-50"
                   />
                   <button 
                    onClick={handleManualSend}
                    disabled={!input.trim() || status === 'thinking'}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all ${
                      input.trim() && status !== 'thinking'
                      ? 'bg-brand-yellow text-brand-black hover:scale-105 shadow-lg' 
                      : 'bg-white/5 text-white/20'
                    }`}
                   >
                     <SendHorizontal size={16} />
                   </button>
                </div>
             </div>
             <div className="flex justify-between items-center mt-6 px-2">
                <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">Lumina Neural Interface v2.5</p>
                <div className="flex gap-2">
                   <div className={`w-1 h-1 rounded-full ${status === 'listening' ? 'bg-brand-gold animate-ping' : 'bg-white/10'}`}></div>
                   <div className={`w-1 h-1 rounded-full ${status === 'thinking' ? 'bg-brand-gold animate-ping' : 'bg-white/10'}`}></div>
                   <div className={`w-1 h-1 rounded-full ${status === 'speaking' ? 'bg-brand-gold animate-ping' : 'bg-white/10'}`}></div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
