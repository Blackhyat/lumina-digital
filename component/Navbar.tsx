
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, User, ChevronDown, LogOut } from 'lucide-react';
import { ViewType } from '../App';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (view: ViewType) => void;
  onStartProject: () => void;
  currentView?: ViewType;
  userName?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, onNavigate, onStartProject, currentView = 'home', userName, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; id: ViewType }[] = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Why Us', id: 'why-us' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, id: ViewType) => {
    e.preventDefault();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled || currentView !== 'home' ? 'glass py-4 shadow-sm border-b border-black/5 dark:border-white/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={(e) => handleLinkClick(e, 'home')}
          className="flex items-center gap-5 group relative perspective-1000"
        >
          {/* LOGO CONTAINER */}
          <div className="relative">
            <div className="absolute -inset-40 bg-brand-gold/30 dark:bg-brand-gold/30 rounded-full blur-[200px] opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000 ease-out z-0 pointer-events-none"></div>
            <div className="absolute -inset-20 bg-gradient-to-r from-[#ff0000] via-[#ffff00] via-[#00ff00] via-[#00ffff] via-[#0000ff] via-[#ff00ff] to-[#ff0000] rounded-full opacity-40 group-hover:opacity-100 blur-[80px] group-hover:blur-[180px] transition-all duration-700 animate-rainbow-animate bg-[length:200%_auto] z-0"></div>
            <div className="absolute inset-0 bg-brand-yellow rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            <div className="w-12 h-12 bg-brand-black dark:bg-white rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 overflow-hidden shadow-[0_0_60px_rgba(250,204,21,0.8)] group-hover:shadow-[0_0_300px_rgba(250,204,21,1)] group-hover:scale-115 group-hover:rotate-[15deg] ring-2 ring-white/20 dark:ring-black/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-[0.8s] ease-in-out"></div>
              <div className="w-6 h-6 bg-brand-yellow dark:bg-brand-black rounded-sm transform rotate-45 relative z-20 transition-all duration-1000 group-hover:rotate-[225deg] shadow-[0_0_20px_rgba(250,204,21,1)] group-hover:scale-115"></div>
            </div>
          </div>

          <div className="flex flex-col -space-y-1 relative">
            <span className="text-3xl font-black tracking-tighter transition-all duration-500 group-hover:text-brand-gold group-hover:drop-shadow-[0_0_50px_rgba(234,179,8,1)]">
              Lumina<span className="text-brand-gold relative">.</span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 group-hover:tracking-[0.65em] transition-all duration-500 text-brand-black dark:text-white drop-shadow-sm">Studio</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.id} 
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`text-sm font-bold transition-all relative py-2 ${
                currentView === link.id 
                  ? 'opacity-100 text-brand-gold' 
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              {link.name}
              {currentView === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold animate-in zoom-in-50 duration-500 shadow-[0_0_20px_rgba(234,179,8,1)]"></span>
              )}
            </a>
          ))}
          
          <div className="flex items-center gap-4 pl-4 border-l border-black/5 dark:border-white/10">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-all hover:scale-110 active:scale-90"
            >
              {isDarkMode ? <Sun size={20} className="text-brand-yellow" /> : <Moon size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {userName ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-gold text-black flex items-center justify-center text-[8px]">{userName.charAt(0)}</div>
                  {userName}
                  <ChevronDown size={12} className={`opacity-40 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 glass rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => { onLogout?.(); setUserMenuOpen(false); }}
                      className="w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="text-sm font-bold opacity-50 hover:opacity-100 transition-all flex items-center gap-2 group"
              >
                <User size={18} className="group-hover:text-brand-gold transition-colors" />
                Portal
              </button>
            )}
            <button 
              onClick={onStartProject}
              className="btn-rainbow-glow bg-brand-black dark:bg-brand-yellow text-white dark:text-brand-black px-7 py-3 rounded-full text-sm font-extrabold shadow-xl hover:px-9 transition-all"
            >
              Start a Project
            </button>
          </div>
        </div>

        <div className="flex md:hidden items-center gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 p-8 flex flex-col gap-6 animate-in slide-in-from-top duration-500 border-b border-black/5 dark:border-white/5 shadow-2xl">
          {navLinks.map((link) => (
            <a 
              key={link.id} 
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`text-2xl font-black text-left border-b border-gray-100 dark:border-zinc-800/50 pb-4 ${currentView === link.id ? 'text-brand-gold' : ''}`}
            >
              {link.name}
            </a>
          ))}
          {userName ? (
            <button 
              onClick={() => { onLogout?.(); setMobileMenuOpen(false); }}
              className="text-2xl font-black text-left border-b border-gray-100 dark:border-zinc-800/50 pb-4 flex items-center gap-4 text-red-500"
            >
              <LogOut size={24} /> Logout ({userName})
            </button>
          ) : (
            <button 
              onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
              className="text-2xl font-black text-left border-b border-gray-100 dark:border-zinc-800/50 pb-4 flex items-center gap-4"
            >
              <User size={24} /> Client Portal
            </button>
          )}
          <button 
            onClick={() => { onStartProject(); setMobileMenuOpen(false); }}
            className="btn-rainbow-glow bg-brand-black dark:bg-brand-yellow text-white dark:text-brand-black px-6 py-5 rounded-2xl text-center font-black text-lg"
          >
            Start a Project
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
