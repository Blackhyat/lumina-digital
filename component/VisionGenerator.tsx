
import React, { useState } from 'react';
import { Terminal, Sparkles, Wand2, ArrowRight, Loader2, Palette, Zap } from 'lucide-react';
import { generateDigitalVision } from '../services/gemini';
import { vault } from '../services/vault';

const VisionGenerator: React.FC = () => {
  const [industry, setIndustry] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'idle' | 'architecting' | 'visionary'>('idle');
  const [visionData, setVisionData] = useState<{ vision: string, keyFeatures: string[], colorPalette: string[] } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !keyword) return;
    setStatus('architecting');
    
    try {
      const data = await generateDigitalVision(industry, keyword);
      setVisionData(data);
      
      // Save to Neural Vault for future access
      vault.saveVision({
        id: Math.random().toString(36).substring(7),
        industry,
        keyword,
        data
      });
      
      setStatus('visionary');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <section id="vision-generator" className="py-32 bg-zinc-950 text-white relative overflow-hidden">
      {/* Dynamic Aura Background */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-1000"
        style={{
          background: status === 'visionary' && visionData 
            ? `radial-gradient(circle at 50% 50%, ${visionData.colorPalette[1]}20 0%, transparent 70%)`
            : `radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.1) 0%, transparent 70%)`
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-gold text-[10px] font-black uppercase tracking-widest">
            <Wand2 size={14} /> Future Flagship Architect
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            Manifest your <br /><span className="gold-text italic font-serif">Digital Legacy.</span>
          </h2>
          <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto">
            Answer two prompts. Our neural engine will architect a cinematic vision of your brand's future presence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          <div className="glass rounded-[3rem] border border-white/5 p-10 md:p-16 space-y-10 flex flex-col justify-center">
            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">The Industry</label>
                <input 
                  required
                  type="text" 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Luxury Hospitality, Tech SaaS" 
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold text-sm"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Aesthetic Keyword</label>
                <input 
                  required
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Minimalist, Kinetic, Bold" 
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-brand-gold transition-all font-bold text-sm"
                />
              </div>
              <button 
                type="submit"
                disabled={status === 'architecting'}
                className="btn-rainbow-glow w-full py-6 bg-brand-yellow text-brand-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3"
              >
                {status === 'architecting' ? <><Loader2 size={18} className="animate-spin" /> Architecting...</> : <><Sparkles size={18} /> Generate Vision</>}
              </button>
            </form>
          </div>

          <div className="glass rounded-[3rem] border border-white/5 p-10 md:p-16 flex flex-col relative overflow-hidden">
             {status === 'idle' && (
               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                  <Terminal size={48} className="text-zinc-700" />
                  <p className="text-zinc-500 font-medium italic">"Waiting for architectural parameters..."</p>
               </div>
             )}

             {status === 'architecting' && (
               <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                  <div className="relative w-24 h-24">
                     <div className="absolute inset-0 border-4 border-brand-gold/10 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-brand-gold">
                        <Zap size={32} className="animate-pulse" />
                     </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-gold">Neural Processing</p>
                    <p className="text-zinc-500 text-sm">Synthesizing visual logic and UX strategy...</p>
                  </div>
               </div>
             )}

             {status === 'visionary' && visionData && (
               <div className="flex-1 space-y-10 animate-in slide-in-from-bottom-6 duration-1000">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">The Flagship Vision</span>
                    <p className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed">
                      "{visionData.vision}"
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30">Key Architectural Features</h4>
                    <div className="grid gap-4">
                      {visionData.keyFeatures.map((feat, i) => (
                        <div key={i} className="flex items-center gap-4 text-sm font-bold p-4 bg-white/5 rounded-xl border border-white/5">
                          <Zap size={14} className="text-brand-gold" />
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                    <div className="flex gap-2">
                       {visionData.colorPalette.map((col, i) => (
                         <div key={i} className="w-8 h-8 rounded-full border border-white/20" style={{ backgroundColor: col }} title={col}></div>
                       ))}
                    </div>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
                    >
                      New Vision <ArrowRight size={14} />
                    </button>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionGenerator;
