
import React, { useEffect, useState } from 'react';
import { Quote, Sparkles } from 'lucide-react';

const FounderVision: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const section = document.getElementById('founder-vision-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="founder-vision-section" className="py-64 bg-brand-black relative overflow-hidden">
      <style>{`
        .signature-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          transition: stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .signature-path.draw {
          stroke-dashoffset: 0;
        }
        .reveal-text {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-text.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-brand-gold/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-24">
        <div className="space-y-8">
           <div className={`w-px h-24 bg-brand-gold mx-auto opacity-40 transition-all duration-1000 ${isVisible ? 'scale-y-100' : 'scale-y-0'}`}></div>
           <span className={`text-brand-gold font-black uppercase tracking-[0.8em] text-[10px] block reveal-text ${isVisible ? 'show' : ''}`}>The Digital Architect</span>
           <h2 className={`text-6xl md:text-[10rem] font-serif font-bold italic tracking-tighter leading-none text-white reveal-text transition-all duration-1000 ${isVisible ? 'show' : ''} [transition-delay:200ms]`}>
             Nishan Kumar <br /><span className="gold-text">Prusty.</span>
           </h2>
        </div>

        <div className="max-w-4xl mx-auto relative group">
          <Quote size={120} className="absolute -top-20 -left-10 text-white/5 -rotate-12 group-hover:text-brand-gold/10 transition-colors duration-1000" />
          <p className={`text-3xl md:text-5xl font-serif italic text-zinc-400 leading-tight reveal-text ${isVisible ? 'show' : ''} [transition-delay:400ms]`}>
            "We are in the era where a business's digital soul is as important as its physical foundation. I built Lumina to ensure local visionaries don't just exist online—they <span className="text-white">dominate</span> with elegance."
          </p>
        </div>

        <div className="space-y-12">
           <div className={`text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 reveal-text ${isVisible ? 'show' : ''} [transition-delay:600ms]`}>
             B.Tech Final Year | Lead Strategist | Founder
           </div>
           
           {/* Animated Digital Signature */}
           <div className="relative h-32 flex items-center justify-center">
              <svg 
                className="w-full max-w-[300px] h-full overflow-visible" 
                viewBox="0 0 400 150" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  className={`signature-path ${isVisible ? 'draw' : ''}`}
                  d="M40 90 C 60 40, 90 40, 110 90 S 140 140, 170 90 S 200 40, 230 90 S 260 140, 290 90 S 320 40, 360 90" 
                  stroke="#EAB308" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ opacity: 0.7 }}
                />
                <text 
                  x="50%" 
                  y="50%" 
                  dominantBaseline="middle" 
                  textAnchor="middle" 
                  className={`font-serif italic text-5xl fill-brand-gold transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} [transition-delay:1.5s]`}
                  style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
                >
                  Nishan K. Prusty
                </text>
              </svg>
           </div>
        </div>
      </div>
    </section>
  );
};

export default FounderVision;
