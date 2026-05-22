import React from 'react';
import { Wrench, Phone, Mail, MapPin } from 'lucide-react';
import { NAV_LINKS } from '../lib/constants';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Wrench size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Ammie's <span className="text-emerald-400">Auto Repair</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Denver's trusted auto repair experts. Certified technicians, all insurance accepted, quality guaranteed.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-5">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {NAV_LINKS.map(link => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`} className="text-slate-400 hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-5">Contact</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin size={15} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>3770 Wheeling St Unit #1<br />Denver, CO 80239</span>
            </li>
            <li>
              <a href="tel:7206765646" className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone size={15} className="text-emerald-400 shrink-0" />
                (720) 676-5646
              </a>
            </li>
            <li>
              <a href="mailto:service@ammiesautorepair.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail size={15} className="text-emerald-400 shrink-0" />
                service@ammiesautorepair.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-xs">
          <p>© {CURRENT_YEAR} Ammie's Auto Repair. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
