
import React, { useState, useEffect } from 'react';
import { vault } from '../services/vault';
import { Inquiry } from '../types';
import { 
  Database, 
  Clock, 
  FileText, 
  Zap, 
  ChevronRight, 
  Search, 
  LayoutDashboard, 
  History, 
  CreditCard,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Fingerprint
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [visions, setVisions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'briefs' | 'visions' | 'account'>('briefs');

  useEffect(() => {
    setInquiries(vault.getInquiries());
    setVisions(vault.getVisions());
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold text-black flex items-center justify-center font-black">
                {user.name.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Security Clearance: {user.clearance}</span>
                <h1 className="text-4xl font-black tracking-tighter">Welcome, {user.name}</h1>
              </div>
            </div>
            <p className="text-zinc-500 font-medium">Lumina Neural Vault established. Connection is encrypted.</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={onLogout}
               className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest"
             >
               Terminate Session
             </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="space-y-4">
            {[
              { id: 'briefs', label: 'Project Briefs', icon: <FileText size={18} /> },
              { id: 'visions', label: 'Brand Visions', icon: <Target size={18} /> },
              { id: 'account', label: 'Vault Access', icon: <ShieldCheck size={18} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all border ${
                  activeTab === tab.id 
                  ? 'bg-brand-gold text-black border-brand-gold' 
                  : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {tab.icon}
                  <span className="font-black text-[10px] uppercase tracking-widest">{tab.label}</span>
                </div>
                <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-20'} />
              </button>
            ))}

            <div className="mt-12 p-8 rounded-3xl bg-brand-yellow/5 border border-brand-yellow/10 space-y-4">
               <div className="flex items-center gap-2 text-brand-gold">
                  <Cpu size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Neural Status</span>
               </div>
               <p className="text-xs text-zinc-400 leading-relaxed italic">"The engine is currently optimizing your next digital roadmap based on market shifts."</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'briefs' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black tracking-tighter">Your Active Briefs</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{inquiries.length} Saved Inquiries</span>
                </div>
                
                {inquiries.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-4 opacity-40">
                    <History size={48} className="mx-auto text-zinc-700" />
                    <p className="font-serif italic text-xl">"Your vault is empty. Initiate a transformation below."</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {inquiries.map((inq, i) => (
                      <div key={inq.id} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">{inq.selectedPlan} Tier</span>
                            <h4 className="text-2xl font-bold tracking-tight">{inq.websiteIdea}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            <Clock size={12} />
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1 p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-400 italic">
                             "{inq.businessPlans}"
                          </div>
                          <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-brand-gold hover:text-black flex items-center justify-center transition-all">
                             <ArrowUpRight size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'visions' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black tracking-tighter">Generated Brand Visions</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{visions.length} Archived Concepts</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {visions.length === 0 ? (
                    <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-4 opacity-40">
                      <Target size={48} className="mx-auto text-zinc-700" />
                      <p className="font-serif italic text-xl">"No visions manifested yet."</p>
                    </div>
                  ) : (
                    visions.map((v, i) => (
                      <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                             {v.data.colorPalette.map((c: string, j: number) => (
                               <div key={j} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }}></div>
                             ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">{v.industry}</span>
                           <h4 className="text-xl font-bold">Concept: {v.keyword}</h4>
                        </div>
                        <p className="text-sm text-zinc-400 font-serif italic leading-relaxed">
                          "{v.data.vision}"
                        </p>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white transition-colors">
                          Restore Concept <ChevronRight size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                 <h3 className="text-2xl font-black tracking-tighter">Vault Configuration</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6">
                       <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                          <Fingerprint size={24} />
                       </div>
                       <div className="space-y-2">
                          <h4 className="font-bold text-lg tracking-tight">Biometric Hash</h4>
                          <p className="text-xs text-zinc-500 font-mono break-all">{user.token}</p>
                       </div>
                    </div>
                    <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6">
                       <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <CreditCard size={24} />
                       </div>
                       <div className="space-y-2">
                          <h4 className="font-bold text-lg tracking-tight">Client Tier</h4>
                          <p className="text-xs text-zinc-500 uppercase tracking-widest">Active Partner • Priority Support</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
