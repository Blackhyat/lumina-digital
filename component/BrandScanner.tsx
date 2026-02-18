
import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Target, Zap, ShieldCheck, ArrowRight, Loader2, Cpu, Globe } from 'lucide-react';
import { analyzeBrandAesthetic } from '../services/gemini';

const BrandScanner: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [progress, setProgress] = useState(0);
  const [auditData, setAuditData] = useState<{ score: number, critique: string, recommendations: string[] } | null>(null);

  useEffect(() => {
    let interval: number;
    if (status === 'scanning') {
      setProgress(0);
      interval = window.setInterval(() => {
        setProgress(prev => (prev >= 100 ? 100 : prev + Math.random() * 15));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !industry) return;
    setStatus('scanning');
    
    try {
      const result = await analyzeBrandAesthetic(businessName, industry);
      // Ensure we see at least some of the animation
      setTimeout(() => {
        setAuditData(result);
        setStatus('result');
      }, 2500);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <section id="scanner" className="py-32 bg-white dark:bg-zinc-950 relative overflow-hidden">
      <style>{`
        .hologram-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, transparent, #EAB308, transparent);
          box-shadow: 0 0 15px #EAB308;
          animation: scan-move 3s linear infinite;
          z-index: 20;
        }
        @keyframes scan-move {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .holographic-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
        }
        .holographic-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(234, 179, 8, 0.03) 3px, transparent 4px);
          pointer-events: none;
        }
      `}</style>
      
      <div className="absolute top-0 right-0 w-full h-full bg-brand-yellow/5 blur-[120px] pointer-events-none opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black uppercase tracking-widest">
              <Zap size={14} /> Neural Interface
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              Is your brand <br /><span className="gold-text">Lumina-Ready?</span>
            </h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-md">
              Enter your vision. Our neural engine will audit your trajectory and generate a premium architectural blueprint.
            </p>
            
            <form onSubmit={handleScan} className="space-y-4 max-w-md">
              <div className="grid grid-cols-1 gap-4">
                <input 
                  required
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Business Name" 
                  className="w-full px-8 py-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold text-sm"
                />
                <input 
                  required
                  type="text" 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Industry (e.g., Luxury Real Estate)" 
                  className="w-full px-8 py-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold text-sm"
                />
              </div>
              <button 
                type="submit"
                disabled={status === 'scanning'}
                className="btn-rainbow-glow w-full py-5 bg-brand-black dark:bg-brand-yellow text-white dark:text-brand-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 premium-trigger"
              >
                {status === 'scanning' ? <><Loader2 size={18} className="animate-spin" /> Deep Neural Scan...</> : <><Target size={18} /> Initiate Brand Audit</>}
              </button>
            </form>
          </div>

          <div className="relative">
            <div className="holographic-card rounded-[3rem] p-10 md:p-16 min-h-[550px] flex flex-col justify-center shadow-2xl relative overflow-hidden group">
               {status === 'scanning' && <div className="hologram-line"></div>}
               
               {status === 'idle' && (
                 <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 mx-auto bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold border border-brand-gold/20">
                       <Cpu size={48} className="animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Neural Core Ready</p>
                       <p className="text-zinc-400 font-medium italic">"Standing by for aesthetic vectors..."</p>
                    </div>
                 </div>
               )}

               {status === 'scanning' && (
                 <div className="space-y-12 animate-in fade-in duration-500">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Analyzing Brand DNA</span>
                       <span className="text-sm font-mono text-brand-gold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-brand-gold transition-all duration-300 shadow-[0_0_10px_#EAB308]" 
                         style={{ width: `${progress}%` }}
                       ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                          <Globe size={16} className="text-brand-gold animate-spin-slow" />
                          <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Market Mesh</span>
                       </div>
                       <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                          <Target size={16} className="text-brand-gold animate-pulse" />
                          <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Visual Logic</span>
                       </div>
                    </div>
                 </div>
               )}

               {status === 'result' && auditData && (
                 <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-1000">
                    <div className="flex items-end justify-between">
                       <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Aesthetic Index</span>
                          <div className="text-8xl font-black tracking-tighter gold-text leading-none">{auditData.score}<span className="text-2xl opacity-40">/100</span></div>
                       </div>
                       <div className="w-16 h-16 rounded-2xl bg-brand-gold text-black flex items-center justify-center shadow-2xl">
                          <Sparkles size={32} />
                       </div>
                    </div>
                    
                    <div className="p-8 rounded-[2rem] bg-brand-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={40} /></div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">Strategic Critique</h4>
                       <p className="text-xl font-serif italic leading-relaxed text-zinc-600 dark:text-zinc-300">"{auditData.critique}"</p>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Premium Blueprint</h4>
                       <ul className="space-y-4">
                          {auditData.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-center gap-4 text-sm font-bold group/item">
                               <div className="w-6 h-6 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold text-[10px] group-hover/item:bg-brand-gold group-hover/item:text-black transition-colors">
                                 {i + 1}
                               </div>
                               <span className="text-zinc-700 dark:text-zinc-300">{rec}</span>
                            </li>
                          ))}
                       </ul>
                    </div>

                    <button 
                      onClick={() => setStatus('idle')}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-brand-gold transition-colors flex items-center gap-3"
                    >
                      Reset Neural Core <ArrowRight size={14} />
                    </button>
                 </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandScanner;
