
import React, { useState, useEffect, useMemo } from 'react';
import { ViewType } from '../App';

interface HeroProps {
  onNavigate: (view: ViewType) => void;
  onStartProject: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, onStartProject }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const proximityIntensity = useMemo(() => {
    const dist = Math.sqrt(Math.pow(mousePos.x - 0.7, 2) + Math.pow(mousePos.y + 0.5, 2));
    return Math.max(0, 1 - dist * 1.2);
  }, [mousePos]);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden hero-bg-animate transition-all duration-[2s]">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100%] bg-gradient-to-br from-red-500/5 via-brand-yellow/5 to-blue-500/5 blur-[150px] animate-rainbow-animate bg-[length:200%_200%] pointer-events-none z-0"
        style={{ 
          transform: `translate(calc(-50% + ${mousePos.x * 10}px), calc(-50% + ${mousePos.y * 10}px))`,
          opacity: 0.1 + proximityIntensity * 0.2
        }}
      ></div>

      <div 
        className="absolute top-1/4 -right-32 w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full z-0 hidden lg:block transition-all duration-1000 ease-out animate-float perspective-2000 group/sphere opacity-40 dark:opacity-20 hover:opacity-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          pointerEvents: 'auto',
          cursor: 'crosshair',
          transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px) rotateX(${mousePos.y * 20}deg) rotateY(${mousePos.x * -20}deg)`,
          background: isHovered 
            ? 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.3), rgba(250, 204, 21, 0.15) 40%, rgba(0, 0, 0, 0.5))'
            : 'radial-gradient(circle at 35% 35%, rgba(250, 204, 21, 0.1), rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0.3))',
          boxShadow: isHovered
            ? `inset -20px -20px 60px rgba(0,0,0,0.5), 0 80px 120px rgba(250,204,21,0.2)`
            : `inset -10px -10px 40px rgba(0,0,0,0.3), 0 40px 80px rgba(0,0,0,0.1)`,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div 
          className="absolute -inset-6 rounded-full bg-gradient-to-r from-red-500/40 via-yellow-400/40 via-green-400/40 via-blue-500/40 via-purple-500/40 to-red-500/40 blur-3xl transition-opacity duration-1000 animate-rainbow-animate bg-[length:200%_auto]"
          style={{ 
            opacity: isHovered ? 0.4 : proximityIntensity * 0.15,
            filter: `hue-rotate(${mousePos.x * 30}deg) blur(${isHovered ? '40px' : '80px'})`
          }}
        ></div>
        <div 
          className="absolute w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none opacity-0 group-hover/sphere:opacity-100 transition-opacity duration-700"
          style={{
            top: `${40 + mousePos.y * 8}%`,
            left: `${40 + mousePos.x * 8}%`,
          }}
        ></div>
        <div className="absolute inset-0 rounded-full opacity-0 group-hover/sphere:opacity-60 transition-opacity duration-1000 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-35deg] group-hover/sphere:left-[200%] transition-all duration-[2.5s] ease-in-out"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="rainbow-glow-active inline-block px-5 py-2 mb-8 md:mb-12 rounded-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 text-brand-gold dark:text-brand-yellow text-[10px] md:text-xs font-black uppercase tracking-[0.3em] cursor-default">
          Digital Craftsmanship for Local Brands
        </div>
        
        <div className="overflow-hidden mb-6 md:mb-8">
           <h1 
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 leading-[1] md:leading-[0.95] perspective-1000"
            style={{ 
              transform: `rotateX(${mousePos.y * -5}deg) rotateY(${mousePos.x * 5}deg)`,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <span className="block dark:text-gradient light:text-gradient-dark">Premium Web</span>
            <span className="block gold-text">Experiences.</span>
          </h1>
        </div>

        <p className="max-w-2xl md:max-w-3xl mx-auto text-lg md:text-2xl text-gray-500 dark:text-zinc-400 font-medium mb-12 md:mb-16 leading-relaxed px-4">
          We combine Swiss-style precision with Silicon Valley tech to build your brand's digital flagship. Uncompromising luxury for the local market.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-16 md:mb-24 px-4">
          <button 
            onClick={onStartProject}
            className="btn-rainbow-glow group w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 bg-brand-black dark:bg-brand-yellow text-white dark:text-brand-black rounded-full text-base md:text-lg font-black shadow-2xl active:scale-95"
          >
            Start Your Project
          </button>
          <button 
            onClick={() => onNavigate('why-us')}
            className="w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-full text-base md:text-lg font-black hover:bg-white/40 dark:hover:bg-zinc-800/40 active:scale-95 shadow-lg"
          >
            View Manifesto
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
