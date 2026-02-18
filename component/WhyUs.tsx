
import React, { useState } from 'react';
import { FEATURES } from '../constants';
import { ShieldCheck, Award, Zap, Globe, ArrowRight, Loader2, Download, CheckCircle, FileText, X } from 'lucide-react';
import { ViewType } from '../App';
import { generateBrandThesis } from '../services/gemini';

interface WhyUsProps {
  isFullPage?: boolean;
  onNavigate?: (view: ViewType) => void;
  onStartProject?: (source: string) => void;
}

const WhyUs: React.FC<WhyUsProps> = ({ isFullPage = false, onNavigate, onStartProject }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStep, setDownloadStep] = useState(0);
  const [thesisContent, setThesisContent] = useState<string | null>(null);

  const steps = [
    "Establishing encrypted connection...",
    "Retrieving Lumina Digital Manifesto...",
    "Synthesizing strategic philosophies...",
    "Authenticating architectural blueprints...",
    "Finalizing document export..."
  ];

  const handleDownloadThesis = async () => {
    setIsDownloading(true);
    setDownloadStep(0);
    
    const interval = setInterval(() => {
      setDownloadStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const content = await generateBrandThesis();
      setThesisContent(content);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setDownloadStep(steps.length - 1);
      // Wait a bit to show final step
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    }
  };

  const handleConnectConcierge = () => {
    if (onStartProject) {
      onStartProject("Manifesto Page Link");
    } else if (onNavigate) {
      onNavigate('contact');
    } else {
      const contactEl = document.getElementById('contact');
      contactEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isFullPage) {
    return (
      <section className="min-h-screen pt-40 pb-32 bg-brand-black text-white relative overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="space-y-32">
            {/* The Hook */}
            <div className="space-y-12 animate-in slide-in-from-bottom duration-1000">
              <span className="text-brand-gold font-black uppercase tracking-[0.5em] text-sm">Chapter One</span>
              <h1 className="text-7xl md:text-[10rem] font-serif font-bold italic tracking-tighter leading-none gold-text">The Manifesto.</h1>
              <p className="text-4xl md:text-6xl font-serif italic text-zinc-400 leading-tight">
                "We do not build websites. We architect <span className="text-white">digital legacies</span> that stand the test of time."
              </p>
            </div>

            {/* The Context */}
            <div className="grid md:grid-cols-2 gap-24 items-center">
              <div className="space-y-10">
                <div className="h-px w-24 bg-brand-gold"></div>
                <h2 className="text-5xl font-serif font-bold italic">The Problem with 'Now'.</h2>
                <p className="text-xl text-zinc-400 font-serif leading-relaxed italic">
                  In a world of fast-food digital agencies, the soul is lost. Companies trade longevity for speed, and character for convenience. They use templates that look like everyone else's. They deliver products that feel 'adequate' rather than 'extraordinary'.
                </p>
              </div>
              <div className="rounded-[4rem] overflow-hidden aspect-square shadow-2xl ring-1 ring-white/20">
                <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* The Philosophy */}
            <div className="space-y-16 py-24 border-y border-white/10 text-center">
              <h3 className="text-3xl font-black uppercase tracking-[0.3em] opacity-40">Our Uncompromising Code</h3>
              <div className="grid md:grid-cols-3 gap-16">
                {[
                  { title: "Artisan Logic", desc: "Every line of code is handwritten. No builders. No bloat. Pure efficiency." },
                  { title: "Kinetic Soul", desc: "Design is not static. We use motion to guide the human heart." },
                  { title: "Global Intel", desc: "Gemini AI is woven into the fabric of our sites, providing 24/7 strategic power." }
                ].map((item, i) => (
                  <div key={i} className="space-y-6 group">
                    <div className="text-6xl font-serif font-bold italic text-brand-gold opacity-40 group-hover:opacity-100 transition-opacity">0{i+1}</div>
                    <h4 className="text-2xl font-bold tracking-tight">{item.title}</h4>
                    <p className="text-zinc-400 font-serif italic leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The Conclusion */}
            <div className="text-center space-y-16 pb-32">
              <h2 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter italic">Ready to transcend?</h2>
              <div className="flex flex-col md:flex-row justify-center gap-8">
                <button 
                  onClick={handleConnectConcierge}
                  className="btn-rainbow-glow px-16 py-8 bg-brand-yellow text-brand-black rounded-full font-black text-2xl shadow-2xl"
                >
                  Connect Concierge
                </button>
                <button 
                  onClick={handleDownloadThesis}
                  className="px-16 py-8 border border-white/20 hover:bg-white/10 rounded-full font-black text-2xl transition-all flex items-center justify-center gap-4"
                >
                  <Download size={28} /> Download Thesis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Download / Thesis View Modal */}
        {(isDownloading || thesisContent) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-brand-black/95 backdrop-blur-3xl" onClick={() => !isDownloading && setThesisContent(null)}></div>
            <div className="relative w-full max-w-4xl glass rounded-[4rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-700">
              
              {isDownloading ? (
                <div className="p-20 text-center space-y-12">
                   <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 border-4 border-brand-yellow/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-brand-gold">
                         <Zap size={32} className="animate-pulse" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase tracking-tighter">Compiling Thesis</h3>
                      <p className="text-brand-gold font-mono text-xs uppercase tracking-[0.4em] animate-pulse">
                        {steps[downloadStep]}
                      </p>
                   </div>
                </div>
              ) : (
                <div className="p-12 md:p-20 space-y-12 text-left relative max-h-[85vh] overflow-y-auto">
                  <button 
                    onClick={() => setThesisContent(null)}
                    className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all"
                  >
                    <X size={24} />
                  </button>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-brand-gold">
                       <FileText size={20} />
                       <span className="font-black uppercase tracking-[0.5em] text-xs">Lumina Digital Strategic Document</span>
                    </div>
                    <h3 className="text-5xl font-black tracking-tighter text-white">The Digital Thesis.</h3>
                  </div>
                  <div className="prose prose-invert prose-xl max-w-none">
                     <p className="text-2xl font-serif italic text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {thesisContent}
                     </p>
                  </div>
                  <div className="pt-12 border-t border-white/10 flex justify-between items-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Property of Lumina Digital Studio • © 2025
                    </div>
                    <button 
                      onClick={() => {
                        const blob = new Blob([thesisContent || ""], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Lumina-Digital-Thesis.txt';
                        a.click();
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-yellow text-brand-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                    >
                      <Download size={16} /> Export as TXT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }

  // Standard Landing View
  return (
    <section id="why-us" className="py-24 md:py-32 overflow-hidden relative bg-white dark:bg-brand-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="w-full lg:w-1/2 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1]">Redefining the <br /><span className="gold-text">Local Digital Frontier.</span></h2>
              <p className="text-xl text-gray-500 dark:text-zinc-400 font-medium">We believe local businesses deserve world-class digital identities. No compromises, just pure excellence.</p>
            </div>
            <div className="grid gap-10">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="flex gap-8 group">
                  <div className="rainbow-glow-active flex-shrink-0 w-20 h-20 rounded-3xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-brand-gold group-hover:bg-brand-black dark:group-hover:bg-white transition-all shadow-lg">
                    <span className="z-10">{feature.icon}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-brand-gold transition-colors">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative perspective-1000">
            <div className="rainbow-glow-active relative rounded-[4rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-zinc-900 aspect-square group transition-all duration-1000 hover:scale-[1.02]">
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800" alt="Studio" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[3s]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 p-10 glass rounded-[3rem] border border-white/30 backdrop-blur-3xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-gold mb-3">Our Mantra</p>
                <p className="text-2xl font-bold tracking-tight leading-tight">"We don't just build websites; we architect digital legacies."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
