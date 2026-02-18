
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowLeftRight } from 'lucide-react';

const AestheticBenchmark: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <section className="py-32 bg-brand-gray dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={14} /> The Benchmarking Engine
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            Transcend the <span className="gold-text">Generic.</span>
          </h2>
          <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto">
            Drag the slider to visualize the architectural leap between a standard template and a hand-crafted Lumina experience.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative aspect-video md:aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 select-none cursor-ew-resize group"
          onMouseMove={handleMove}
          onTouchMove={handleMove}
        >
          {/* After (Lumina Grade) */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover"
              alt="Lumina Grade"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 right-10 glass p-6 md:p-8 rounded-3xl border border-white/20 animate-in slide-in-from-right duration-1000">
               <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em]">Lumina Grade</span>
               <h4 className="text-xl md:text-2xl font-black text-white mt-2">Precision Kinematics</h4>
            </div>
          </div>

          {/* Before (Standard Grade) */}
          <div 
            className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-brand-yellow/50"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="absolute inset-0 w-[100vw] h-full grayscale opacity-80 brightness-50">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover"
                alt="Standard Grade"
                style={{ width: '100vw' }}
              />
            </div>
            <div className="absolute bottom-10 left-10 p-6 md:p-8 bg-zinc-900/80 rounded-3xl border border-white/5 whitespace-nowrap">
               <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Standard Web</span>
               <h4 className="text-xl md:text-2xl font-black text-white/60 mt-2 italic">Flat & Lifeless</h4>
            </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute inset-y-0 z-20 w-1 bg-brand-yellow/50 pointer-events-none group-hover:bg-brand-yellow transition-colors"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-brand-yellow rounded-full shadow-2xl flex items-center justify-center text-brand-black">
              <ArrowLeftRight size={20} className="animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AestheticBenchmark;
