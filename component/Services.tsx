
import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Bot, 
  Server, 
  Briefcase, 
  LineChart, 
  ShieldCheck, 
  Sparkles, 
  X, 
  ArrowRight,
  Zap,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Settings,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { getServiceIntelligence, ServiceInsight } from '../services/gemini';
import { ViewType } from '../App';

interface ServicesProps {
  isFullPage?: boolean;
  isDarkMode?: boolean;
  onStartProject?: (source: string) => void;
  onNavigate?: (view: ViewType) => void;
}

const SERVICES_DATA = [
  {
    title: "Custom Website Designing",
    description: "Swiss-style precision architecture tailored to your brand's unique narrative. We hand-code every interaction to ensure perfection and performance.",
    icon: <Palette className="w-10 h-10" />,
    features: ["Bespoke Layouts", "Motion Design", "Responsive Excellence", "Pixel Perfection"],
    color: "bg-blue-600",
    gradient: "from-blue-600/20 to-indigo-600/20",
    size: "large",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1200",
    manifesto: "Design is not just what it looks like and feels like. Design is how it works."
  },
  {
    title: "Interactive AI Assistants",
    description: "Gemini-powered digital concierges that convert visitors into leads 24/7. Your site becomes a living representative.",
    icon: <Bot className="w-8 h-8" />,
    features: ["NLP Integration", "Live Lead Capture", "Knowledge Graph"],
    color: "bg-purple-600",
    gradient: "from-purple-600/20 to-pink-600/20",
    size: "wide",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    manifesto: "The future belongs to the curious. We build the intelligence to help you explore it."
  },
  {
    title: "Premium Hosting Support",
    description: "1-year complimentary enterprise-grade hosting. We ensure your flagship is always fast and secure.",
    icon: <Server className="w-8 h-8" />,
    features: ["99.9% Uptime", "Daily Backups", "SSL Security"],
    color: "bg-emerald-600",
    gradient: "from-emerald-600/20 to-teal-600/20",
    size: "small",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    manifesto: "Speed is the fundamental unit of the digital experience."
  },
  {
    title: "Portfolio Engineering",
    description: "Cinematic showcases for your work. Designed for elite creatives who demand the best.",
    icon: <Briefcase className="w-8 h-8" />,
    features: ["Case Study Frameworks", "Interactive Galleries"],
    color: "bg-orange-600",
    gradient: "from-orange-600/20 to-red-600/20",
    size: "small",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    manifesto: "Your work is your legacy. We give it the stage it deserves."
  },
  {
    title: "SEO & Performance Ops",
    description: "Lighthouse scores of 100. We optimize for dominance using technical excellence.",
    icon: <LineChart className="w-8 h-8" />,
    features: ["Core Web Vitals", "Technical SEO"],
    color: "bg-amber-500",
    gradient: "from-amber-500/20 to-yellow-500/20",
    size: "small",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200",
    manifesto: "Visibility is a byproduct of pure technical excellence."
  },
  {
    title: "Visual Brand Identity",
    description: "Complete design systems. We architect the visual soul of your company touchpoints.",
    icon: <ShieldCheck className="w-8 h-8" />,
    features: ["Logo Design", "Typography Systems"],
    color: "bg-rose-600",
    gradient: "from-rose-600/20 to-pink-600/20",
    size: "small",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200",
    manifesto: "A brand is the sum of every interaction. We make them count."
  }
];

const RoboMascot: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 50;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 50;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="col-span-1 md:col-span-2 row-span-1 group relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden flex flex-col bg-black cursor-pointer perspective-2000 shadow-2xl min-h-[400px]"
    >
      <style>{`
        @keyframes droneFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(2deg); }
        }
        @keyframes backGlowPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        .animate-drone {
          animation: droneFloat 7s ease-in-out infinite;
        }
        .animate-backglow {
          animation: backGlowPulse 5s ease-in-out infinite;
        }
        .visor-bloom {
           filter: brightness(1.2) drop-shadow(0 0 20px rgba(56, 189, 248, 0.8));
        }
        .group:hover .visor-bloom {
           filter: brightness(1.5) drop-shadow(0 0 45px rgba(56, 189, 248, 1));
        }
      `}</style>

      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out animate-backglow pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 0.5}% ${50 + mousePos.y * 0.5}%, rgba(56, 189, 248, 0.35) 0%, transparent 75%)`,
          filter: 'blur(120px)',
          opacity: isHovered ? 0.9 : 0.45
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/15 via-transparent to-purple-500/10 mix-blend-overlay"></div>

      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <div 
          className="relative w-56 h-56 md:w-[28rem] md:h-[28rem] transition-all duration-500 ease-out animate-drone flex items-center justify-center -translate-y-4 md:-translate-y-8"
          style={{ 
            transform: `rotateX(${-mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg) translateZ(120px)`,
            filter: isHovered ? 'drop-shadow(0 0 60px rgba(56, 189, 248, 0.5))' : 'none'
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
             <defs>
               <radialGradient id="bodyShade" cx="40%" cy="40%" r="60%">
                 <stop offset="0%" stopColor="#DDEEFF" />
                 <stop offset="70%" stopColor="#A8CFFF" />
                 <stop offset="100%" stopColor="#7DA6FF" />
               </radialGradient>
               <linearGradient id="metalSides" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" stopColor="#F8FAFC" />
                 <stop offset="50%" stopColor="#94A3B8" />
                 <stop offset="100%" stopColor="#475569" />
               </linearGradient>
               <filter id="bloom">
                 <feGaussianBlur stdDeviation="7" result="blur" />
                 <feMerge>
                   <feMergeNode in="blur" />
                   <feMergeNode in="SourceGraphic" />
                 </feMerge>
               </filter>
             </defs>
             <path d="M100,45 L100,28" stroke="#64748B" strokeWidth="2.5" />
             <circle cx="100" cy="24" r="5" fill="#38BDF8" filter="url(#bloom)" className="animate-pulse" />
             <circle cx="42" cy="115" r="24" fill="url(#metalSides)" stroke="#1E293B" strokeWidth="1" />
             <circle cx="158" cy="115" r="24" fill="url(#metalSides)" stroke="#1E293B" strokeWidth="1" />
             <circle cx="100" cy="115" r="78" fill="url(#bodyShade)" />
             <rect x="55" y="90" width="90" height="65" rx="18" fill="#0B0B1E" stroke="#1E1E3A" strokeWidth="2" />
             <g transform={`translate(${mousePos.x * 0.12}, ${mousePos.y * 0.12})`}>
                <circle cx="72" cy="72" r="26" fill="#111" stroke="#333" strokeWidth="2" />
                <circle cx="128" cy="72" r="26" fill="#111" stroke="#333" strokeWidth="2" />
                <circle cx="72" cy="72" r="22" fill="#222" />
                <circle cx="128" cy="72" r="22" fill="#222" />
             </g>
             <g transform={`translate(${mousePos.x * 0.25}, ${mousePos.y * 0.25})`} className="visor-bloom">
                <rect x="76" y="108" width="10" height="26" rx="5" fill="#38BDF8" />
                <rect x="114" y="108" width="10" height="26" rx="5" fill="#38BDF8" />
             </g>
          </svg>
        </div>
      </div>

      <div className="p-8 md:p-12 mt-auto flex justify-between items-end z-20">
        <div className="space-y-1 md:space-y-2 max-w-[75%]">
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">Design Mantra</span>
          <p className="text-lg md:text-3xl font-serif italic text-white group-hover:text-sky-500 transition-colors leading-tight">
            "Simplicity is the ultimate sophistication."
          </p>
        </div>
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl glass border border-white/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-xl">
           <Bot size={24} />
        </div>
      </div>
    </div>
  );
};

const Services: React.FC<ServicesProps> = ({ isFullPage = false, isDarkMode = true, onStartProject, onNavigate }) => {
  const [selectedService, setSelectedService] = useState<typeof SERVICES_DATA[0] | null>(null);
  const [aiInsight, setAiInsight] = useState<ServiceInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const handleDeepDive = async (service: typeof SERVICES_DATA[0]) => {
    setSelectedService(service);
    setLoadingInsight(true);
    const insight = await getServiceIntelligence(service.title);
    setAiInsight(insight);
    setLoadingInsight(false);
  };

  const closeModal = () => {
    setSelectedService(null);
    setAiInsight(null);
  };

  const handleInitiateRoadmap = () => {
    if (!selectedService) return;
    const serviceName = selectedService.title;
    closeModal();
    if (onStartProject) {
      onStartProject(`Service: ${serviceName}`);
    }
  };

  const handleViewDetails = () => {
    closeModal();
    if (onNavigate) {
      onNavigate('why-us');
    } else {
      // Handle in-page scroll if no router navigate
      const whyUsEl = document.getElementById('why-us');
      whyUsEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderModal = () => {
    if (!selectedService) return null;

    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-brand-black/90 md:bg-brand-black/95 backdrop-blur-3xl" onClick={closeModal}></div>
        <div className="relative w-full max-w-5xl glass rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-700 flex flex-col md:flex-row h-full max-h-[90vh]">
          <button onClick={closeModal} className="absolute top-6 right-6 md:top-8 md:right-8 z-20 p-3 md:p-4 bg-white/10 rounded-full text-white hover:rotate-90 transition-all">
            <X size={20} />
          </button>
          
          <div className={`w-full md:w-1/3 p-10 md:p-12 flex flex-col items-center justify-center text-center ${selectedService.color} text-white relative overflow-hidden shrink-0`}>
             <div className="absolute inset-0 bg-black/10"></div>
             {selectedService.image && (
                <img src={selectedService.image} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" alt="" />
             )}
            <div className="relative z-10">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 shadow-2xl mx-auto backdrop-blur-xl border border-white/20">
                {selectedService.icon}
              </div>
              <h4 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">{selectedService.title}</h4>
            </div>
          </div>

          <div className="w-full md:w-2/3 p-8 md:p-16 overflow-y-auto space-y-8 md:space-y-12 text-left bg-zinc-950/50">
            {loadingInsight ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
                <div className="relative w-12 h-12 md:w-16 md:h-16">
                  <div className="absolute inset-0 border-2 border-brand-gold/20 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-zinc-500 font-serif italic text-lg md:text-xl px-4">Consulting Strategic Backend...</p>
              </div>
            ) : aiInsight ? (
              <div className="space-y-8 md:space-y-12">
                <div className="space-y-4 md:space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <Target size={20} className="text-brand-gold" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-gold">Strategic Advisor</span>
                  </div>
                  <p className="text-xl md:text-3xl text-white font-serif italic leading-snug px-1">"{aiInsight.strategic_advice}"</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-8 animate-fade-in-up [animation-delay:200ms] opacity-0">
                  <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 space-y-3 md:space-y-4 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-2 text-brand-gold">
                      <TrendingUp size={18} />
                      <h5 className="text-[10px] md:text-xs font-black uppercase tracking-widest">ROI Impact</h5>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{aiInsight.roi_impact}</p>
                  </div>

                  <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 space-y-3 md:space-y-4 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-2 text-brand-gold">
                      <Sparkles size={18} />
                      <h5 className="text-[10px] md:text-xs font-black uppercase tracking-widest">2025 Outlook</h5>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{aiInsight.future_outlook_2025}</p>
                  </div>
                </div>

                <div className="pt-6 md:pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4 md:gap-6 animate-fade-in-up [animation-delay:400ms] opacity-0">
                  <button 
                    onClick={handleInitiateRoadmap}
                    className="w-full sm:w-auto text-center px-10 py-4 md:py-5 bg-brand-yellow text-brand-black rounded-full font-black text-sm shadow-2xl active:scale-95 btn-rainbow-glow"
                  >
                    Initiate Roadmap
                  </button>
                  <button 
                    onClick={handleViewDetails}
                    className="w-full sm:w-auto px-8 py-4 md:py-5 border border-white/10 rounded-full font-black text-sm text-white/50 hover:text-white transition-all"
                  >
                    View Manifesto
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const renderHomeGridCard = (service: typeof SERVICES_DATA[0], index: number) => {
    const isLarge = service.size === "large";
    const isWide = service.size === "wide";

    let colSpan = "col-span-1";
    let rowSpan = "row-span-1";

    if (isLarge) {
      colSpan = "md:col-span-2";
      rowSpan = "md:row-span-2";
    } else if (isWide) {
      colSpan = "md:col-span-2";
    }

    return (
      <div 
        key={index} 
        onClick={() => handleDeepDive(service)}
        className={`${colSpan} ${rowSpan} group relative glass border border-black/5 dark:border-white/5 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden cursor-pointer transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl flex flex-col min-h-[350px] md:min-h-0`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>
        {service.image && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-1000">
            <img src={service.image} className="w-full h-full object-cover scale-150 group-hover:scale-110 transition-transform duration-[3s]" alt="" />
          </div>
        )}

        <div className="p-8 md:p-12 relative z-10 flex flex-col h-full">
          <div className={`w-14 h-14 md:w-20 md:h-20 ${service.color} text-white rounded-2xl md:rounded-[2.2rem] flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 group-hover:rotate-[8deg] transition-all duration-700`}>
            {service.icon}
          </div>
          <div className="mt-auto">
            <h3 className={`${isLarge ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'} font-black tracking-tight mb-4 group-hover:text-brand-gold transition-colors duration-500 leading-tight`}>
              {service.title}
            </h3>
            <p className={`text-gray-500 dark:text-zinc-400 font-medium leading-relaxed mb-8 ${isLarge ? 'text-lg md:text-xl' : 'text-sm md:text-base'} line-clamp-3`}>
              {service.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {service.features.slice(0, 2).map((feature, fidx) => (
                <span key={fidx} className="px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60">
                  {feature}
                </span>
              ))}
            </div>
            <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <span className="font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-brand-gold opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                Explore Tech
              </span>
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-all">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isFullPage) {
    return (
      <section className="min-h-screen bg-brand-gray dark:bg-[#050505] transition-colors duration-1000">
        <header className="pt-40 md:pt-48 pb-24 md:pb-32 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-brand-gold/5 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto text-center relative z-10 px-4">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border border-black/10 dark:border-white/10 mb-8 md:mb-10">
              <div className="w-2 h-2 rounded-full bg-brand-gold animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Studio Arsenal</span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[10rem] lg:text-[11rem] font-black tracking-tighter leading-[0.9] md:leading-[0.85] mb-8 md:mb-12">
              <span className="block dark:text-gradient">Crafted</span>
              <span className="block gold-text italic font-serif">Precision.</span>
            </h1>
            <p className="max-w-2xl md:max-w-3xl mx-auto text-lg md:text-3xl font-serif italic text-zinc-500 leading-relaxed px-2">
              An uncompromising collection of digital capabilities designed to project authority and architect legacies.
            </p>
          </div>
        </header>

        <div className="relative">
           {SERVICES_DATA.map((service, idx) => (
             <section 
               key={idx} 
               className="py-24 md:py-48 px-6 overflow-hidden border-t border-black/5 dark:border-white/5 first:border-t-0"
             >
               <div className={`max-w-7xl mx-auto flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-32`}>
                 <div className="w-full md:w-1/2 space-y-8 md:space-y-10 px-4">
                   <div className="space-y-6">
                     <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-brand-black dark:bg-white text-white dark:text-brand-black rounded-[1.5rem] flex items-center justify-center shadow-xl">
                       {service.icon}
                     </div>
                     <h2 className="text-4xl md:text-8xl font-black tracking-tighter leading-none hover:text-brand-gold transition-colors">
                       {service.title.split(' ').map((word, i) => (
                         <span key={i} className="block">{word}</span>
                       ))}
                     </h2>
                   </div>
                   <p className="text-xl md:text-3xl font-serif italic text-zinc-500 leading-snug">"{service.manifesto}"</p>
                   <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 font-medium leading-relaxed">{service.description}</p>
                   <div className="pt-6 flex flex-wrap gap-4 md:gap-6">
                     <button onClick={() => handleDeepDive(service)} className="px-8 py-4 bg-brand-black dark:bg-white text-white dark:text-brand-black rounded-full font-black text-xs md:text-sm shadow-xl active:scale-95">Analyze Strategy</button>
                     <button 
                        onClick={() => onStartProject?.(`Service Landing: ${service.title}`)}
                        className="px-8 py-4 border border-black/10 dark:border-white/10 rounded-full font-black text-xs md:text-sm hover:bg-black/5 dark:hover:bg-white/5"
                     >
                        Reserve Now
                     </button>
                   </div>
                 </div>
                 <div className="w-full md:w-1/2 px-4">
                   <div className="aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl group ring-1 ring-black/5 dark:ring-white/10">
                     <img src={service.image} className="w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0 group-hover:scale-105" alt="" />
                   </div>
                 </div>
               </div>
             </section>
           ))}
        </div>

        <div className="py-32 md:py-48 bg-brand-black text-center relative overflow-hidden px-6">
           <div className="absolute inset-0 bg-brand-gold/5 blur-[150px] animate-pulse pointer-events-none"></div>
           <div className="max-w-4xl mx-auto relative z-10 space-y-12 md:space-y-16">
              <h2 className="text-5xl md:text-9xl font-black tracking-tighter text-white">Choose your <span className="gold-text">Destiny.</span></h2>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                 <button 
                    onClick={() => onStartProject?.('Service Footer CTA')}
                    className="btn-rainbow-glow px-12 md:px-16 py-6 md:py-8 bg-brand-yellow text-brand-black rounded-full font-black text-xl md:text-2xl shadow-2xl active:scale-95"
                 >
                    Connect Concierge
                 </button>
                 <button 
                    onClick={() => onNavigate?.('home')}
                    className="px-12 md:px-16 py-6 md:py-8 border border-white/20 hover:bg-white/10 rounded-full font-black text-xl md:text-2xl text-white"
                 >
                    View Case Studies
                 </button>
              </div>
           </div>
        </div>
        {renderModal()}
      </section>
    );
  }

  return (
    <section id="services" className="py-24 md:py-32 bg-brand-gray dark:bg-brand-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="h-px w-6 md:w-8 bg-brand-gold/40"></div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Digital Engineering</span>
            <div className="h-px w-6 md:w-8 bg-brand-gold/40"></div>
          </div>
          <h2 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter leading-none">The <span className="gold-text">Capabilities.</span></h2>
          <p className="text-lg md:text-2xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed px-4">Artisan design fused with high-end AI strategy. We don't just build; we architect market dominance.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {SERVICES_DATA.map((service, index) => renderHomeGridCard(service, index))}
          <RoboMascot isDarkMode={isDarkMode} />
        </div>
      </div>
      {renderModal()}
    </section>
  );
};

export default Services;
