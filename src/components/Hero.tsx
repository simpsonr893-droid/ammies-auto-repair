import { ChevronRight, Phone, Star, Shield, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onOpenChat: () => void;
}

export default function Hero({ onOpenChat }: Props) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1920"
          alt=""
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
          fetchPriority="high"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Denver's #1 Collision Repair Shop
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight"
          >
            We Restore Cars.<br />
            <span className="text-emerald-400">We Handle</span> the Rest.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl"
          >
            From fender benders to full collision repairs — Sammie's Autobody delivers factory-perfect results, works directly with your insurance, and gets you back on the road fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-14"
          >
            <button
              onClick={onOpenChat}
              className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-2 group"
            >
              Get Free Estimate
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="tel:7206765646"
              className="border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Phone size={20} /> (720) 676-5646
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: <Star size={15} className="text-amber-400" aria-hidden="true" />, text: "4.9 star rating" },
              { icon: <Shield size={15} className="text-emerald-400" aria-hidden="true" />, text: "All Insurance Accepted" },
              { icon: <Clock size={15} className="text-emerald-400" aria-hidden="true" />, text: "Fast Turnaround" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                {item.icon}
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs tracking-widest uppercase">
        <span>scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
