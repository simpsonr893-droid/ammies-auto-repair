import React from 'react';
import { Wrench } from 'lucide-react';

export default function Nav() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
            <Wrench size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight">Sammie's <span className="text-emerald-600">Autobody</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#services" className="hover:text-emerald-600 transition-colors">Services</a>
          <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-emerald-600 transition-colors">Contact</a>
        </div>
        <button
          onClick={() => document.getElementById('chat-toggle')?.click()}
          className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
        >
          Get Estimate
        </button>
      </div>
    </nav>
  );
}
