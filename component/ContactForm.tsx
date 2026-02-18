
import React from 'react';
import { Send, CheckCircle, Loader2, Search, Zap, Globe, MessageCircle, Instagram, Phone, Sparkles, User, Briefcase, Lightbulb } from 'lucide-react';
import { ContactForm as IContactForm, LeadIntelligence, PlanType } from '../types';
import { processInquiryWithAI } from '../services/gemini';
import { vault } from '../services/vault';

interface ContactProps {
  isFullPage?: boolean;
  initialIntent?: string | null;
  preSelectedPlan?: PlanType | string;
}

const ContactForm: React.FC<ContactProps> = ({ isFullPage = false, initialIntent = null, preSelectedPlan = '' }) => {
  const [formData, setFormData] = React.useState<IContactForm>({
    name: '',
    age: '',
    email: '',
    phone: '',
    businessPlans: '',
    websiteIdea: '',
    selectedPlan: preSelectedPlan
  });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [intelligence, setIntelligence] = React.useState<LeadIntelligence | null>(null);
  const [processStep, setProcessStep] = React.useState(0);

  const steps = [
    "Encrypting communication tunnel...",
    "Analyzing business trajectory...",
    "Scanning industry market data...",
    "Performing lead scoring & intent analysis...",
    "Generating bespoke digital roadmap..."
  ];

  React.useEffect(() => {
    if (preSelectedPlan) {
      setFormData(prev => ({ ...prev, selectedPlan: preSelectedPlan }));
    }
  }, [preSelectedPlan]);

  React.useEffect(() => {
    let interval: number;
    if (status === 'loading') {
      interval = window.setInterval(() => {
        setProcessStep(prev => (prev + 1) % steps.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const intel = await processInquiryWithAI(formData);
      const inquiryId = Math.random().toString(36).substring(7);
      
      const newInquiry = { 
        ...formData, 
        id: inquiryId, 
        createdAt: new Date().toISOString(), 
        intelligence: intel 
      };
      
      // Save to Neural Vault
      vault.saveInquiry(newInquiry);
      
      setIntelligence(intel);
      setStatus('success');
      setFormData({ name: '', age: '', email: '', phone: '', businessPlans: '', websiteIdea: '', selectedPlan: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className={`py-32 relative overflow-hidden ${isFullPage ? 'min-h-screen pt-48 bg-brand-gray dark:bg-brand-black' : 'bg-brand-gray dark:bg-brand-black'}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-yellow/5 blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-8 animate-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-black/10 dark:border-white/10">
            {initialIntent ? <Zap size={16} className="text-brand-gold animate-pulse" /> : <Sparkles size={16} className="text-brand-gold animate-pulse" />}
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              {initialIntent ? `Priority Protocol: ${initialIntent}` : 'Concierge Desk'}
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">
            {initialIntent ? <>Tailoring Your <br /><span className="gold-text">Experience.</span></> : <>Initiate <br /><span className="gold-text">Transformation.</span></>}
          </h1>
          <p className="text-2xl text-zinc-500 font-serif italic max-w-2xl mx-auto font-medium leading-relaxed">
            {preSelectedPlan 
              ? `You've selected the ${preSelectedPlan} tier. Let's build the architecture behind your vision.`
              : "A bespoke project begins with a high-fidelity dialogue. Tell us your vision, and we will architect your legacy."
            }
          </p>
        </div>

        <div className={`glass rounded-[4rem] p-8 md:p-20 border border-gray-200/50 dark:border-zinc-800/50 shadow-2xl backdrop-blur-3xl overflow-hidden ${isFullPage ? 'shadow-[0_0_100px_rgba(250,204,21,0.1)]' : ''}`}>
          
          {status === 'success' && intelligence ? (
            <div className="animate-in fade-in zoom-in duration-700">
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/2 space-y-8">
                  <div className="w-16 h-16 bg-brand-yellow/20 text-brand-gold rounded-2xl flex items-center justify-center"><CheckCircle size={32} /></div>
                  <div>
                    <h3 className="text-4xl font-black mb-4 tracking-tighter">Inquiry Authenticated.</h3>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium">Our intelligence engine has processed your request and established a preliminary roadmap.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-brand-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap size={16} className="text-brand-gold" />
                      <span className="text-xs font-black uppercase tracking-widest text-brand-gold">Your Digital Roadmap</span>
                    </div>
                    <ul className="space-y-4">
                      {intelligence.suggestedRoadmap.map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm font-bold text-black dark:text-white">
                          <span className="w-6 h-6 rounded-full bg-brand-black dark:bg-white text-white dark:text-brand-black flex items-center justify-center text-[10px]">{i+1}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="lg:w-1/2 space-y-6">
                   <div className="p-8 rounded-[2rem] bg-zinc-900 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${intelligence.priority === 'High' ? 'bg-red-500' : 'bg-brand-gold'}`}>{intelligence.priority} Priority</span></div>
                      <h4 className="text-lg font-black mb-4 flex items-center gap-2"><Search size={18} className="text-brand-yellow" />Industry Intelligence</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6 italic">"{intelligence.industryAnalysis}"</p>
                   </div>
                   <button onClick={() => setStatus('idle')} className="w-full py-4 rounded-2xl border border-black/10 dark:border-white/10 font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all text-black dark:text-white">Back to Form</button>
                </div>
              </div>
            </div>
          ) : status === 'loading' ? (
            <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="relative w-24 h-24 mb-10">
                <div className="absolute inset-0 border-4 border-brand-yellow/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={32} className="text-brand-yellow animate-pulse" /></div>
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">Processing Vision...</h3>
              <p className="text-brand-gold font-mono text-xs uppercase tracking-[0.3em] animate-pulse">{steps[processStep]}</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-16">
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="text-5xl font-black mb-6 tracking-tighter leading-none font-serif italic">Connect with <br /><span className="gold-text">Excellence.</span></h2>
                  <p className="text-gray-500 dark:text-zinc-400 font-medium">Whether you prefer a digital brief or a direct dialogue, we are ready to architect your legacy.</p>
                </div>
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Direct Channels</h4>
                  <div className="grid gap-4">
                    <a href="https://wa.me/91XXXXXXXXXX" target="_blank" className="flex items-center gap-6 p-6 rounded-3xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 hover:-translate-y-1 transition-all group shadow-sm">
                      <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><MessageCircle size={24} /></div>
                      <div>
                        <p className="text-sm font-black text-black dark:text-white">WhatsApp Direct</p>
                        <p className="text-xs opacity-50 font-medium">Instant Response • 24/7</p>
                      </div>
                    </a>
                    <a href="https://instagram.com/lumina_studio" target="_blank" className="flex items-center gap-6 p-6 rounded-3xl bg-pink-500/5 border border-pink-500/10 hover:bg-pink-500/10 hover:-translate-y-1 transition-all group shadow-sm">
                      <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Instagram size={24} /></div>
                      <div>
                        <p className="text-sm font-black text-black dark:text-white">Instagram DM</p>
                        <p className="text-xs opacity-50 font-medium">Portfolio & Stories</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Enhanced Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8 p-10 bg-white/30 dark:bg-zinc-900/40 rounded-[3rem] border border-black/5 dark:border-white/5 shadow-inner">
                
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={14} className="text-brand-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Identity Details</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full px-8 py-5 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-yellow font-bold text-sm transition-all text-black dark:text-white" />
                    </div>
                    <div>
                      <input required type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="Age" className="w-full px-8 py-5 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-yellow font-bold text-sm transition-all text-black dark:text-white" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Business Email" className="w-full px-8 py-5 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-yellow font-bold text-sm transition-all text-black dark:text-white" />
                    <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Contact Number" className="w-full px-8 py-5 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-yellow font-bold text-sm transition-all text-black dark:text-white" />
                  </div>
                </div>

                {/* Business Vision */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={14} className="text-brand-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Strategic Context</span>
                  </div>
                  <textarea required rows={2} value={formData.businessPlans} onChange={(e) => setFormData({...formData, businessPlans: e.target.value})} placeholder="What are your current business plans or growth goals?" className="w-full px-8 py-5 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-yellow font-bold text-sm transition-all resize-none text-black dark:text-white" />
                  
                  <div className="flex items-center gap-2 mb-2 pt-2">
                    <Lightbulb size={14} className="text-brand-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Product Concept</span>
                  </div>
                  <textarea required rows={3} value={formData.websiteIdea} onChange={(e) => setFormData({...formData, websiteIdea: e.target.value})} placeholder="Website Idea: Describe the cause or vision for your digital flagship..." className="w-full px-8 py-5 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-yellow font-bold text-sm transition-all resize-none text-black dark:text-white" />
                </div>

                {/* Selection Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={14} className="text-brand-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Purchasing Plan</span>
                  </div>
                  <select 
                    required 
                    value={formData.selectedPlan} 
                    onChange={(e) => setFormData({...formData, selectedPlan: e.target.value})}
                    className="w-full px-8 py-5 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-yellow font-bold text-sm transition-all text-black dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="dark:bg-zinc-900">Select your Investment Tier</option>
                    <option value={PlanType.REGULAR} className="dark:bg-zinc-900">{PlanType.REGULAR} - ₹3,000</option>
                    <option value={PlanType.ADVANCE} className="dark:bg-zinc-900">{PlanType.ADVANCE} - ₹5,000</option>
                    <option value={PlanType.PREMIUM} className="dark:bg-zinc-900">{PlanType.PREMIUM} - ₹8,000</option>
                  </select>
                </div>

                <button className="btn-rainbow-glow w-full py-6 bg-brand-black dark:bg-brand-yellow text-white dark:text-brand-black rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                  <Send size={20} />Submit Project Brief
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
