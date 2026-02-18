
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import PlanCarousel from './components/PlanCarousel';
import Process from './components/Process';
import Services from './components/Services';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import BrandScanner from './components/BrandScanner';
import FounderVision from './components/FounderVision';
import AestheticBenchmark from './components/AestheticBenchmark';
import VisionGenerator from './components/VisionGenerator';
import ArtisanToolbox from './components/ArtisanToolbox';
import { vault } from './services/vault';
import { PlanType } from './types';

export type ViewType = 'home' | 'services' | 'why-us' | 'contact' | 'login' | 'dashboard';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [user, setUser] = useState<any | null>(null);
  const [isInitiatingProject, setIsInitiatingProject] = useState(false);
  const [projectIntent, setProjectIntent] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | string>('');
  const [activeSection, setActiveSection] = useState<string>('Home');

  // Hydrate session from vault on mount
  useEffect(() => {
    const savedUser = vault.getSession();
    if (savedUser) {
      setUser(savedUser);
      // If user is logged in and tries to go to login, send to dashboard
      if (currentView === 'login') setCurrentView('dashboard');
    }
  }, []);

  // Section Observer for AI Context
  useEffect(() => {
    const sections = ['home', 'services', 'process', 'why-us', 'plans', 'contact', 'vision', 'scanner', 'benchmark', 'vision-generator', 'toolbox'];
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentView]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleNavigate = (view: ViewType) => {
    // Redirect logic for logged in users
    if (view === 'login' && user) {
      setCurrentView('dashboard');
      return;
    }
    setCurrentView(view);
    setProjectIntent(null);
  };

  const handleStartProject = (source: string) => {
    setIsInitiatingProject(true);
    setProjectIntent(source);
    
    setTimeout(() => {
      setCurrentView('home');
      setIsInitiatingProject(false);
      setTimeout(() => {
        const contactEl = document.getElementById('contact');
        contactEl?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1000);
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    vault.setSession(userData);
    setTimeout(() => {
      setCurrentView('dashboard');
    }, 2000);
  };

  const handleLogout = () => {
    setUser(null);
    vault.clearSession();
    setCurrentView('home');
  };

  if (currentView === 'login') {
    return (
      <LoginPage 
        onBack={() => setCurrentView('home')} 
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentView === 'dashboard' && user) {
    return (
      <div className="relative selection:bg-brand-yellow/30 selection:text-brand-black">
        <Navbar 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onNavigate={handleNavigate}
          onStartProject={() => handleStartProject('Navbar CTA')}
          currentView={currentView}
          userName={user?.name}
          onLogout={handleLogout}
        />
        <Dashboard user={user} onLogout={handleLogout} />
        <Footer onNavigate={handleNavigate} />
        <AIAssistant currentSection="Dashboard" />
      </div>
    );
  }

  return (
    <div className="relative selection:bg-brand-yellow/30 selection:text-brand-black">
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        onNavigate={handleNavigate}
        onStartProject={() => handleStartProject('Navbar CTA')}
        currentView={currentView}
        userName={user?.name}
        onLogout={handleLogout}
      />
      
      <main className="transition-all duration-700">
        {currentView === 'home' && (
          <>
            <div id="home"><Hero onNavigate={handleNavigate} onStartProject={() => handleStartProject('Hero CTA')} /></div>
            <div id="services"><Services isDarkMode={isDarkMode} onStartProject={handleStartProject} onNavigate={handleNavigate} /></div>
            <div id="process"><Process /></div>
            <div id="benchmark"><AestheticBenchmark /></div>
            <div id="plans"><PlanCarousel /></div>
            <div id="vision-generator"><VisionGenerator /></div>
            <div id="toolbox"><ArtisanToolbox /></div>
            <div id="scanner"><BrandScanner /></div>
            <div id="why-us"><WhyUs onNavigate={handleNavigate} onStartProject={handleStartProject} /></div>
            <div id="vision"><FounderVision /></div>
            <div id="contact"><ContactForm initialIntent={projectIntent} preSelectedPlan={selectedPlan} /></div>
          </>
        )}

        {currentView === 'services' && <Services isFullPage onStartProject={handleStartProject} onNavigate={handleNavigate} />}
        {currentView === 'why-us' && <WhyUs isFullPage onNavigate={handleNavigate} onStartProject={handleStartProject} />}
        {currentView === 'contact' && <ContactForm isFullPage preSelectedPlan={selectedPlan} />}
      </main>

      <Footer onNavigate={handleNavigate} />
      <AIAssistant currentSection={activeSection} />

      {/* Initiation Overlay */}
      {isInitiatingProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-black pointer-events-none animate-in fade-in duration-500">
          <div className="text-center space-y-8">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-2 border-brand-yellow/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Initializing Project Engine</h2>
              <p className="text-brand-gold text-xs font-black uppercase tracking-[0.4em] animate-pulse">Allocating Neural Resources...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
