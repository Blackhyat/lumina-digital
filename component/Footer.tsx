
import React from 'react';
import { ViewType } from '../App';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, view: ViewType) => {
    e.preventDefault();
    onNavigate(view);
  };

  return (
    <footer className="py-20 bg-brand-gray dark:bg-brand-black border-t border-gray-200 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <a 
              href="#" 
              onClick={(e) => handleNav(e, 'home')}
              className="text-2xl font-bold tracking-tight mb-6 inline-block"
            >
              Lumina <span className="text-brand-gold">Studio</span>
            </a>
            <p className="text-gray-500 dark:text-zinc-500 max-w-xs leading-relaxed">
              Redefining digital excellence for local businesses. High-end design with a bold vision.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-black dark:text-white">Explore</h4>
            <ul className="space-y-4 text-gray-500 dark:text-zinc-400">
              <li><button onClick={(e) => handleNav(e as any, 'services')} className="hover:text-brand-gold transition-colors">Services</button></li>
              <li><button onClick={(e) => handleNav(e as any, 'why-us')} className="hover:text-brand-gold transition-colors">The Manifesto</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-black dark:text-white">Connect</h4>
            <ul className="space-y-4 text-gray-500 dark:text-zinc-400">
              <li><a href="https://instagram.com/lumina_studio" target="_blank" className="hover:text-brand-gold transition-colors">Instagram</a></li>
              <li><a href="https://wa.me/91XXXXXXXXXX" target="_blank" className="hover:text-brand-gold transition-colors">WhatsApp</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-zinc-900 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Lumina Digital Studio. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
