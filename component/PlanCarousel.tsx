
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlanType } from '../types';
import { ChevronLeft, ChevronRight, Monitor, Smartphone, Tablet, Sparkles, X, CheckCircle2 } from 'lucide-react';

const CAROUSEL_ITEMS = [
  {
    type: PlanType.REGULAR,
    title: 'Minimalist Purity',
    description: 'A focus on high-readability, ultra-clean layouts, and essential conversion paths for local businesses.',
    longDescription: 'Our Minimalist Purity tier is designed for the modern local brand that values clarity above all. We strip away the digital noise to leave only what matters: your message and your customer\'s journey. Each element is placed with Swiss-style precision, ensuring a lightning-fast experience.',
    image: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=1200',
    tag: 'Essential',
    details: ['SEO optimized architecture', 'Standard responsive layouts', 'Lightning fast load times', 'Contact capture']
  },
  {
    type: PlanType.ADVANCE,
    title: 'Kinetic Excellence',
    description: 'Dynamic motion systems, interactive hover states, and layered layouts that tell a compelling story.',
    longDescription: 'Kinetic Excellence brings your digital presence to life. Using advanced physics-based motion systems, we create a tactile environment where every click and scroll feels intentional and rewarding. Perfect for businesses that want to stand out from the competition.',
    image: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&q=80&w=1200',
    tag: 'The Standard',
    details: ['Physics-based animations', 'Custom 3D components', 'Interactive storytelling', 'CMS integration']
  },
  {
    type: PlanType.PREMIUM,
    title: 'Luxury Immersive',
    description: 'The pinnacle of digital art. 3D depth effects, ultra-smooth transitions, and a bespoke cinematic feel.',
    longDescription: 'The Signature tier represents the absolute frontier of web technology. We combine WebGL depth effects, cinematic scroll-linked storytelling, and bespoke micro-interactions to create a luxury experience rivaling the world\'s most prestigious brands.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
    tag: 'Signature',
    details: ['Full 3D immersive environments', 'Cinematic scroll sequences', 'Bespoke micro-physics', 'Priority concierge']
  }
];

const AUTO_ROTATE_INTERVAL = 6000;

const PlanCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveredControls, setIsHoveredControls] = useState(false);
  const [selectedDetailIdx, setSelectedDetailIdx] = useState<number | null>(null);
  
  const sectionRef = useRef<HTMLElement>(null);
  const autoRotateRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    autoRotateRef.current = window.setInterval(() => {
      nextSlide();
    }, AUTO_ROTATE_INTERVAL);
  }, [nextSlide]);

  const resetAutoPlay = () => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      startAutoPlay();
    }
  };

  const handleNext = () => {
    resetAutoPlay();
    nextSlide();
  };

  const handlePrev = () => {
    resetAutoPlay();
    prevSlide();
  };

  const handleSelectDot = (index: number) => {
    resetAutoPlay();
    setActiveIndex(index);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x: x * 80, y: y * 80 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const shouldRotate = hoveredIdx === null && !isHoveredControls && selectedDetailIdx === null;
    if (shouldRotate) {
      startAutoPlay();
    } else {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    }
    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [hoveredIdx, isHoveredControls, selectedDetailIdx, startAutoPlay]);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 md:py-32 bg-brand-gray dark:bg-brand-black overflow-hidden relative transition-colors duration-1000"
    >
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 0.3}% ${50 + mousePos.y * 0.3}%, 
            rgba(255, 0, 0, 0.05) 0%, 
            rgba(255, 255, 0, 0.03) 30%, 
            rgba(0, 255, 255, 0.03) 60%, 
            rgba(255, 0, 255, 0.05) 100%)`,
          filter: 'blur(120px)',
          transform: `scale(1.2)`
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <div className="flex justify-center items-center gap-4 mb-8">
             <Sparkles size={20} className="text-brand-gold animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
            Digital <span className="gold-text">Architectures.</span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            Choose the foundation for your brand's next era. High-end interactivity at every tier.
          </p>
        </div>

        <div className="relative pb-16 md:pb-32">
          <div className="relative h-[450px] md:h-[600px] flex items-center justify-center perspective-2500">
            {CAROUSEL_ITEMS.map((item, index) => {
              const isCenter = index === activeIndex;
              const isLeft = index === (activeIndex - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length;
              const isRight = index === (activeIndex + 1) % CAROUSEL_ITEMS.length;

              let transform = "";
              let classes = "absolute transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden rounded-[2rem] md:rounded-[4rem] group select-none shadow-2xl";

              if (isCenter) {
                classes += " z-30 opacity-100 scale-100 translate-x-0 w-[94%] md:w-[75%] h-full ring-1 ring-white/10";
                transform = `rotateX(${mousePos.y * -0.02}deg) rotateY(${mousePos.x * 0.02}deg) translateZ(80px)`;
              } else if (isLeft) {
                classes += " z-10 opacity-20 scale-[0.8] -translate-x-[45%] md:-translate-x-[60%] blur-md w-[60%] h-[80%] md:h-[85%] cursor-pointer";
                transform = "rotateY(30deg) translateZ(-50px)";
              } else if (isRight) {
                classes += " z-10 opacity-20 scale-[0.8] translate-x-[45%] md:translate-x-[60%] blur-md w-[60%] h-[80%] md:h-[85%] cursor-pointer";
                transform = "rotateY(-30deg) translateZ(-50px)";
              } else {
                classes += " z-0 opacity-0 scale-50 pointer-events-none";
                transform = "translateZ(-400px)";
              }

              return (
                <div
                  key={item.type}
                  onClick={() => !isCenter && handleSelectDot(index)}
                  onMouseEnter={() => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`${classes} ${isCenter ? 'rainbow-glow-active' : ''}`}
                  style={{ transformStyle: 'preserve-3d', transform }}
                >
                  <div className="relative h-full w-full bg-zinc-950 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-all duration-[2s] ${
                        isCenter ? 'grayscale-0 scale-110' : 'grayscale opacity-60'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    <div className={`absolute inset-x-0 bottom-0 p-8 md:p-14 flex flex-col justify-end transition-all duration-700 ${isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                      <div className="flex items-center gap-4 mb-4 md:mb-6">
                        <span className="bg-brand-yellow text-brand-black px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">
                          {item.tag}
                        </span>
                        <div className="h-px flex-1 bg-white/20"></div>
                      </div>
                      <h3 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-none">
                        {item.title}
                      </h3>
                      <p className="text-white/70 text-sm md:text-xl max-w-2xl font-medium leading-relaxed mb-8 md:mb-10">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-4 items-center">
                        <a href="#contact" className="px-6 md:px-8 py-3 md:py-4 bg-white text-brand-black rounded-full font-black text-xs md:text-sm shadow-xl active:scale-95">
                          Select {item.type}
                        </a>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedDetailIdx(index); }}
                          className="px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-2xl text-white border border-white/20 rounded-full font-black text-xs md:text-sm shadow-xl active:scale-95"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div 
            className="flex flex-col items-center mt-12 md:mt-20 relative z-40"
            onMouseEnter={() => setIsHoveredControls(true)}
            onMouseLeave={() => setIsHoveredControls(false)}
          >
            <div className="flex justify-center items-center gap-8 md:gap-12">
              <button
                onClick={handlePrev}
                className="p-4 md:p-5 rounded-full glass border border-black/5 dark:border-white/10 hover:bg-brand-black dark:hover:bg-brand-yellow hover:text-white dark:hover:text-brand-black active:scale-75 shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex gap-4 md:gap-5 items-center">
                {CAROUSEL_ITEMS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectDot(index)}
                    className={`relative h-1 transition-all duration-700 rounded-full overflow-hidden ${
                      activeIndex === index ? 'w-16 md:w-20 bg-brand-gold' : 'w-4 bg-gray-300 dark:bg-zinc-800'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-4 md:p-5 rounded-full glass border border-black/5 dark:border-white/10 hover:bg-brand-black dark:hover:bg-brand-yellow hover:text-white dark:hover:text-brand-black active:scale-75 shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedDetailIdx !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-brand-black/95 backdrop-blur-3xl" onClick={() => setSelectedDetailIdx(null)}></div>
          <div className="relative w-full max-w-5xl glass rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-700 flex flex-col lg:flex-row h-full max-h-[85vh]">
            <button 
              onClick={() => setSelectedDetailIdx(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-20 p-3 md:p-4 bg-white/10 rounded-full text-white hover:rotate-90 transition-all"
            >
              <X size={20} />
            </button>
            <div className="w-full lg:w-1/2 h-48 lg:h-auto shrink-0">
              <img src={CAROUSEL_ITEMS[selectedDetailIdx].image} className="w-full h-full object-cover" />
            </div>
            <div className="w-full lg:w-1/2 p-8 md:p-16 overflow-y-auto space-y-8 md:space-y-12">
              <div className="space-y-4">
                <span className="text-brand-gold font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">{CAROUSEL_ITEMS[selectedDetailIdx].tag}</span>
                <h3 className="text-3xl md:text-6xl font-black tracking-tighter text-white leading-none">{CAROUSEL_ITEMS[selectedDetailIdx].title}</h3>
              </div>
              <p className="text-lg md:text-2xl text-zinc-400 font-medium leading-relaxed">{CAROUSEL_ITEMS[selectedDetailIdx].longDescription}</p>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Architecture Specs</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {CAROUSEL_ITEMS[selectedDetailIdx].details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-3 md:gap-4 text-sm md:text-lg font-bold text-white">
                      <CheckCircle2 size={20} className="text-brand-gold shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 md:pt-10 border-t border-white/10">
                <a href="#contact" onClick={() => setSelectedDetailIdx(null)} className="btn-rainbow-glow inline-block px-10 md:px-12 py-4 md:py-6 bg-brand-yellow text-brand-black rounded-full font-black text-lg md:text-xl shadow-2xl active:scale-95">
                  Deploy vision
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlanCarousel;
