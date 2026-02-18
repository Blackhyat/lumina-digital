
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Github, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles, Fingerprint, Lock, Cpu, Globe, Terminal } from 'lucide-react';
import { verifyIdentity } from '../services/gemini';
import { AuthVerification } from '../types';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'external_handshake' | 'callback' | 'handshake' | 'verifying' | 'success'>('idle');
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [authData, setAuthData] = useState<AuthVerification | null>(null);
  const [logLines, setLogLines] = useState<string[]>([]);

  const addLog = (line: string) => {
    setLogLines(prev => [...prev.slice(-4), `> ${line}`]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerAuthFlow('LuminaID', email);
  };

  const handleSocialLogin = async (provider: 'Google' | 'GitHub') => {
    setActiveProvider(provider);
    setStatus('external_handshake');
    addLog(`Initiating OAuth channel via ${provider}...`);
    
    // Simulate external OAuth window wait
    await new Promise(r => setTimeout(r, 2000));
    
    setStatus('callback');
    addLog(`Receiving authentication callback from ${provider} servers...`);
    
    await new Promise(r => setTimeout(r, 1000));
    await triggerAuthFlow(provider);
  };

  const triggerAuthFlow = async (provider: string, userEmail?: string) => {
    setStatus('handshake');
    addLog("Synchronizing cryptographic identity nodes...");
    
    // Establishing Secure Tunnel simulation
    await new Promise(r => setTimeout(r, 1200));
    setStatus('verifying');
    addLog("Analyzing biometric integrity vectors...");
    
    // AI-Powered Verification Handshake
    try {
      const result = await verifyIdentity(provider, userEmail);
      addLog("Lumina Neural Engine has authenticated the identity.");
      setAuthData(result);
      
      // Delay for cryptographic simulation feel
      await new Promise(r => setTimeout(r, 1500));
      setStatus('success');
      addLog("Secure session established. Clearance Tier 1 granted.");
      
      // Notify parent app of success after showing the success state
      setTimeout(() => {
        onLoginSuccess({
          ...result.userProfile,
          token: result.securityToken
        });
      }, 3500);
    } catch (err) {
      console.error("Auth Error:", err);
      addLog("Handshake fatal error: Node synchronization failed.");
      setStatus('idle');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative bg-[#010103] selection:bg-brand-yellow/30 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#1e1e4a]/40 to-transparent pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      
      {/* Dynamic Handshake Overlay */}
      {(status === 'external_handshake' || status === 'callback') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-zinc-900 border border-white/10 p-12 rounded-[2.5rem] shadow-2xl text-center space-y-8 max-w-sm w-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-yellow/5 to-transparent"></div>
            <div className="relative w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center">
              {activeProvider === 'Google' ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              ) : (
                <Github size={32} className="text-white" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {status === 'external_handshake' ? `Authenticating via ${activeProvider}` : 'Validating Callback...'}
              </h3>
              <p className="text-zinc-500 text-sm">Synchronizing your digital footprint with Lumina servers.</p>
            </div>
            <div className="font-mono text-[10px] text-brand-gold text-left bg-black/40 p-4 rounded-xl space-y-1 h-24 overflow-hidden">
               {logLines.map((line, i) => <p key={i} className="animate-in slide-in-from-left duration-300">{line}</p>)}
            </div>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back Control */}
      {status === 'idle' && (
        <button 
          onClick={onBack}
          className="fixed top-12 left-6 md:left-12 p-3 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all group z-[60]"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {/* Main Login Card */}
      <div className="relative w-full max-w-[420px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="bg-[#0c0c0e]/40 backdrop-blur-3xl rounded-[32px] border border-[#1d1d21] p-10 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] text-left ring-1 ring-white/5 overflow-hidden">
          
          {status === 'success' && authData ? (
            <div className="py-6 text-center space-y-8 animate-in zoom-in-95 fade-in duration-700">
               <div className="relative mx-auto w-24 h-24">
                 <div className="absolute inset-0 bg-brand-yellow/20 rounded-full animate-ping opacity-20"></div>
                 <div className="relative flex items-center justify-center w-full h-full bg-brand-yellow text-black rounded-full shadow-[0_0_50px_rgba(250,204,21,0.5)] transition-transform hover:scale-110 duration-500">
                    <CheckCircle2 size={40} />
                 </div>
               </div>
               <div className="space-y-4">
                 <div className="space-y-1">
                   <h2 className="text-3xl font-bold text-white tracking-tight">Access Granted</h2>
                   <p className="text-brand-yellow font-black text-[10px] uppercase tracking-[0.3em]">{authData.userProfile.name}</p>
                 </div>
                 <p className="text-zinc-400 font-serif italic text-lg leading-relaxed px-2">
                   "{authData.welcomeMessage}"
                 </p>
               </div>
               
               <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left relative overflow-hidden group/passport">
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/5 to-transparent opacity-0 group-hover/passport:opacity-100 transition-opacity"></div>
                 <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Digital Passport</span>
                   <Cpu size={14} className="text-brand-yellow animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                      <span>Token Hash</span>
                      <span className="text-white font-mono">{authData.securityToken}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                      <span>Role</span>
                      <span className="text-white">{authData.userProfile.role}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                      <span>Authority</span>
                      <span className="text-emerald-500">{authData.userProfile.clearance} Level</span>
                    </div>
                 </div>
               </div>

               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest animate-pulse">Redirecting to Dashboard...</p>
            </div>
          ) : (status === 'handshake' || status === 'verifying') ? (
            <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="relative w-20 h-20 mb-10">
                <div className="absolute inset-0 border-2 border-brand-yellow/10 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-brand-yellow">
                  {status === 'handshake' ? <Lock size={32} className="animate-pulse" /> : <Fingerprint size={32} className="animate-bounce" />}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                {status === 'handshake' ? 'Establishing Tunnel' : 'Biometric Handshake'}
              </h3>
              <p className="text-zinc-500 font-medium text-sm animate-pulse max-w-[250px] mx-auto">
                {status === 'handshake' ? 'Securing cryptographic channel...' : 'Verifying user nodes with Lumina intelligence...'}
              </p>
              <div className="mt-8 font-mono text-[9px] text-brand-gold bg-black/40 p-4 rounded-xl w-full text-left opacity-50">
                 {logLines.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10 space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.3em]">Secure Auth Portal</span>
                </div>
                <h1 className="text-[36px] font-bold text-white tracking-tight leading-none">
                  Welcome to <br />the Studio.
                </h1>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Identity</label>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com" 
                    className="w-full px-5 py-4 rounded-xl bg-black/40 border border-[#2a2a2e] outline-none focus:border-brand-yellow/50 text-white transition-all placeholder:text-zinc-700 text-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Keycode</label>
                  <div className="relative">
                    <input 
                      required
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full px-5 py-4 rounded-xl bg-black/40 border border-[#2a2a2e] outline-none focus:border-brand-yellow/50 text-white transition-all placeholder:text-zinc-700 text-sm pr-12 font-medium"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-brand-yellow transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="relative w-full py-5 rounded-full font-black text-black text-[11px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] group/btn bg-white shadow-[0_20px_40px_rgba(250,204,21,0.2)] hover:shadow-[0_20px_60px_rgba(250,204,21,0.4)]"
                  >
                    <span className="relative z-10">Authorize Access</span>
                    <div className="absolute inset-0 opacity-100 group-hover:opacity-80 transition-opacity pointer-events-none overflow-hidden rounded-full">
                       <div className="absolute top-0 -left-full w-[200%] h-full bg-gradient-to-r from-transparent via-brand-yellow/40 to-transparent skew-x-[-25deg] animate-shine"></div>
                    </div>
                  </button>
                </div>
              </form>

              <div className="relative my-12 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <span className="relative px-6 bg-[#0c0c0e] text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">
                  Secure Hub
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95 group"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Google</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin('GitHub')}
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95 group"
                >
                  <Github size={18} className="text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">GitHub</span>
                </button>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-12 flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
           <div className="flex items-center gap-2 hover:text-zinc-400 transition-colors cursor-pointer">
              <ShieldCheck size={14} />
              <span>Secure Session</span>
           </div>
           <div className="flex items-center gap-2 hover:text-zinc-400 transition-colors cursor-pointer">
              <Lock size={14} />
              <span>Encrypted</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
