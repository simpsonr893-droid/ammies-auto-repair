import React from 'react';
import { Wrench, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 bg-slate-950 text-white/40 text-sm border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 text-white">
          <Wrench size={20} className="text-emerald-500" />
          <span className="font-bold text-lg tracking-tight">Sammie's Autobody</span>
        </div>

        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Accessibility</a>
        </div>

        <div className="flex gap-4">
          <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
            <Facebook size={18} />
          </a>
          <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
            <Twitter size={18} />
          </a>
          <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
            <Instagram size={18} />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 text-center">
        <p>© {new Date().getFullYear()} Sammie's Autobody Shop. All rights reserved.</p>
      </div>
    </footer>
  );
}
