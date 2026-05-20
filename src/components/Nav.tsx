import React, { useState, useEffect } from 'react';
import { Wrench, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-40 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Wrench size={18} />
          </div>
          <span className={cn("font-bold text-xl tracking-tight transition-colors", scrolled ? "text-slate-900" : "text-white")}>
            Sammie's <span className="text-emerald-400">Autobody</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['Services', 'Process', 'Reviews', 'FAQ', 'Contact'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={cn("transition-colors hover:text-emerald-500", scrolled ? "text-slate-600" : "text-white/80")}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => document.getElementById('chat-toggle')?.click()}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-500 transition-all shadow-lg"
          >
            Free Estimate
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn("md:hidden p-2 rounded-lg transition-colors", scrolled ? "text-slate-700" : "text-white")}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1">
          {['Services', 'Process', 'Reviews', 'FAQ', 'Contact'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 font-medium py-2.5 hover:text-emerald-600 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
