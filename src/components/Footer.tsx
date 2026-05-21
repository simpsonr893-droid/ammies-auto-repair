import React from 'react';
import { Wrench, Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const preventScroll = (e: React.MouseEvent) => e.preventDefault();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Wrench size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Sammie's <span className="text-emerald-400">Autobody</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Denver's trusted collision repair experts. Certified technicians, all insurance accepted, quality guaranteed.
          </p>
          <div className="flex gap-3">
            {[
              { label: "Facebook",  icon: <Facebook size={16} /> },
              { label: "Twitter",   icon: <Twitter size={16} /> },
              { label: "Instagram", icon: <Instagram size={16} /> },
            ].map(({ label, icon }) => (
              <a
                key={label}
                href="#"
                onClick={preventScroll}
                aria-label={`${label} (coming soon)`}
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-5">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {['Services', 'Process', 'Reviews', 'FAQ', 'Contact'].map(link => (
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
              <a href="mailto:service@sammiesautobody.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail size={15} className="text-emerald-400 shrink-0" />
                service@sammiesautobody.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} Sammie's Autobody Shop. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map(label => (
              <a key={label} href="#" onClick={preventScroll} className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
