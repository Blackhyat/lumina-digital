
import React, { useState } from 'react';
import { Eye, Hammer, Rocket, ArrowRight, X, Sparkles, Loader2, ArrowUpRight } from 'lucide-react';
import { getProcessPhaseDetails } from '../services/gemini';

const STEPS = [
  {
    id: '01',
    title: 'Vision',
    subtitle: 'Discovery & Blueprint',
    description: 'We dive deep into your brand DNA. Through meticulous strategy sessions, we define the aesthetic and functional architecture of your digital flagship.',
    icon: <Eye className="w-6 h-6" />
  },
  {
    id: '02',
    title: 'Craft',
    subtitle: 'Artisan Engineering',
    description: 'Our studio begins the labor-intensive process of sculpting your site. We build with pixel-perfect precision and custom motion logic.',
    icon: <Hammer className="w-6 h-6" />
  },
  {
    id: '03',
    title: 'Launch',
    subtitle: 'The Grand Unveiling',
    description: 'Deployment is just the beginning. We perform 50+ point quality checks before presenting your new legacy to the world.',
    icon: <Rocket className="w-6 h-6" />
  }
];

const Process: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<typeof STEPS[0] | null>(null);
  const [phaseDetails, setPhaseDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDetails = async (step: typeof STEPS[0]) => {
    setSelectedPhase(step);
    setIsLoading(true);
    const details = await getProcessPhaseDetails(step.title);
    setPhaseDetails(details);
    setIsLoading(false);
  };

  const closeModal = () => {
    setSelectedPhase(null);
    setPhaseDetails(null);
  };

  const handleTriggerMini = () => {
    if (selectedPhase) {
      window.dispatchEvent(new CustomEvent('mini-trigger', { 
        detail: { query: `Tell me more about the ${selectedPhase.title} phase in our project.` } 
      }));
      closeModal();
    }
  };

  return (
    <section id="process" className="py-32 bg-white dark:bg-brand-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-yellow/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <span className="text-brand-gold font-black uppercase tracking-[0.4em] text-xs mb-4 block">Our Methodology</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              The Path to <br /><span className="gold-text">Excellence.</span>
            </h2>
          </div>
          <p className="text-xl text-gray-500 dark:text-zinc-400 font-medium max-w-sm">
            A structured, uncompromising journey from abstract vision to digital inheritance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => (
            <div 
              key={step.id}
              className="group relative p-12 glass border border-black/5 dark:border-white/5 rounded-[3rem] transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl overflow-hidden"
            >
              {/* Animated Background Index */}
              <div className="absolute -top-10 -right-10 text-[12rem] font-black opacity-[0.03] dark:opacity-[0.05] italic select-none group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                {step.id}
              </div>

              <div className="mb-12 flex items-center justify-between">
                <div className="w-16 h-16 bg-brand-black dark:bg-white text-white dark:text-brand-black rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 shadow-xl">
                  {step.icon}
                </div>
                <span className="gold-text text-4xl font-black italic opacity-30 group-hover:opacity-100 transition-opacity">
                  {step.id}
                </span>
              </div>

              <div className="space-y-4 relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-gold">
                  {step.subtitle}
                </h3>
                <h4 className="text-3xl font-black tracking-tight group-hover:text-brand-gold transition-colors">
                  {step.title}
                </h4>
                <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div 
                onClick={() => handleOpenDetails(step)}
                className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center gap-2 font-black text-xs uppercase tracking-widest cursor-pointer hover:gap-4"
              >
                View Phase Details <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Detail Modal */}
      {selectedPhase && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-brand-black/95 backdrop-blur-3xl" onClick={closeModal}></div>
          <div className="relative w-full max-w-4xl glass rounded-[4rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-700 flex flex-col h-full max-h-[80vh]">
            <button onClick={closeModal} className="absolute top-10 right-10 z-20 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90">
              <X size={24} />
            </button>
            
            <div className="flex-1 overflow-y-auto p-12 md:p-20 space-y-12 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-brand-gold">
                   <Sparkles size={20} className="animate-pulse" />
                   <span className="font-black uppercase tracking-[0.5em] text-xs">Phase {selectedPhase.id} Architecture</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-black tracking-tighter text-white">{selectedPhase.title}</h3>
              </div>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 animate-pulse">
                   <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-2 border-brand-yellow/20 rounded-full"></div>
                      <div className="absolute inset-0 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                   </div>
                   <p className="text-zinc-500 font-serif italic text-2xl">Consulting Methodology Archive...</p>
                </div>
              ) : (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <p className="text-2xl md:text-3xl text-zinc-400 font-medium leading-relaxed font-serif italic">
                    "{phaseDetails}"
                  </p>
                  
                  <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row gap-6">
                    <button 
                      onClick={handleTriggerMini}
                      className="group flex items-center justify-center gap-3 px-12 py-6 bg-brand-yellow text-brand-black rounded-full font-black text-lg shadow-2xl transition-all hover:scale-105"
                    >
                      Ask Mini for More <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    <button 
                      onClick={closeModal}
                      className="px-12 py-6 border border-white/10 rounded-full font-black text-lg text-white/50 hover:text-white transition-all"
                    >
                      Close Inquiry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Process;
