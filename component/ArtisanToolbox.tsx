
import React from 'react';
import { Cpu, Zap, Globe, Shield, Code2, Sparkles } from 'lucide-react';

const TOOLS = [
  {
    icon: <Cpu className="w-8 h-8" />,
    name: "Gemini 3 Pro",
    role: "Strategic Intelligence",
    desc: "Powering real-time lead processing and strategic vision architecture."
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    name: "Artisan React",
    role: "Hand-crafted Code",
    desc: "Zero-bloat architecture ensuring ultra-fast load times and infinite scalability."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    name: "Kinetic UI",
    role: "Motion Science",
    desc: "Physics-based animation systems that guide the user's focus naturally."
  },
  {
    icon: <Globe className="w-8 h-8" />,
    name: "Edge Delivery",
    role: "Global Speed",
    desc: "Enterprise-grade hosting providing 99.9% uptime and global low-latency."
  }
];

const ArtisanToolbox: React.FC = () => {
  return (
    <section id="toolbox" className="py-32 bg-white dark:bg-zinc-950 transition-colors duration-1000">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={14} /> The Technical Stack
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            Built with <span className="gold-text">Artisan Precision.</span>
          </h2>
          <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto">
            We don't use templates. We architect digital legacies using the world's most advanced technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TOOLS.map((tool, i) => (
            <div 
              key={i}
              className="group p-10 glass rounded-[2.5rem] border border-black/5 dark:border-white/5 hover:bg-brand-black dark:hover:bg-white transition-all duration-700 hover:-translate-y-4"
            >
              <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-gold group-hover:text-black transition-colors">
                {tool.icon}
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">{tool.role}</span>
                  <h4 className="text-2xl font-black group-hover:text-white dark:group-hover:text-black transition-colors">{tool.name}</h4>
                </div>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                  {tool.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtisanToolbox;
