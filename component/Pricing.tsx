
import React from 'react';
import { PRICING_PLANS } from '../constants';
import { Check, Star, Sparkles } from 'lucide-react';
import { PlanType } from '../types';

interface PricingProps {
  isFullPage?: boolean;
  onPlanSelect?: (plan: PlanType | string) => void;
}

const Pricing: React.FC<PricingProps> = ({ isFullPage = false, onPlanSelect }) => {
  const handleSelectPlan = (planName: string) => {
    if (onPlanSelect) {
      onPlanSelect(planName);
    } else {
      // Fallback scroll
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="pricing" className={`py-32 relative overflow-hidden ${isFullPage ? 'bg-brand-gray dark:bg-brand-black min-h-screen pt-48' : 'bg-white dark:bg-zinc-900/50'}`}>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-black/10 dark:border-white/10 mb-8">
            <Sparkles size={16} className="text-brand-gold animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Investment Architecture</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter">Choose Your <span className="gold-text italic font-serif">Level.</span></h2>
          <p className="text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Transparent pricing for uncompromising quality. Every tier is a gateway to a new digital reality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {PRICING_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative p-12 rounded-[3.5rem] transition-all duration-700 group hover:-translate-y-6 ${
                plan.isPopular 
                  ? 'bg-brand-black dark:bg-white text-white dark:text-brand-black shadow-2xl rainbow-glow-active ring-2 ring-brand-gold/20' 
                  : 'bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 via-orange-500 to-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full shadow-2xl">
                  Most Popular
                </div>
              )}
              
              <div className="mb-10 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-1 h-4 ${plan.isPopular ? 'bg-brand-yellow' : 'bg-brand-gold'}`}></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em]">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className={`text-6xl font-black tracking-[-0.05em] ${plan.isPopular ? 'text-brand-gold' : 'text-brand-black dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className="text-[9px] opacity-40 font-black uppercase tracking-[0.2em]">Investment</span>
                </div>
                <p className="text-base opacity-70 leading-relaxed font-medium">
                  {plan.description}
                </p>
              </div>

              <div className="h-px w-full bg-current opacity-10 mb-10"></div>

              <ul className="space-y-6 mb-16 relative z-10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-5 text-sm font-bold group-hover:translate-x-2 transition-transform">
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      plan.isPopular ? 'bg-brand-yellow text-brand-black' : 'bg-brand-gray dark:bg-zinc-800 text-brand-gold'
                    }`}>
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span className="tracking-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full py-6 rounded-2xl font-black transition-all relative z-10 text-xs uppercase tracking-[0.25em] shadow-xl active:scale-95 btn-rainbow-glow ${
                  plan.isPopular ? 'bg-brand-yellow text-brand-black' : 'bg-brand-black dark:bg-brand-yellow text-white dark:text-brand-black'
                }`}
              >
                Deploy {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
