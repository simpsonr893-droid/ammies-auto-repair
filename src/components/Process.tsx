import { MessageSquare, FileCheck, Wrench, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const steps = [
  {
    icon: <MessageSquare size={28} />,
    step: "01",
    title: "Get Your Estimate",
    desc: "Chat with our AI receptionist or call us. We'll collect your vehicle details and schedule an in-shop assessment.",
  },
  {
    icon: <FileCheck size={28} />,
    step: "02",
    title: "We Handle Insurance",
    desc: "We work directly with all major providers to process your claim — no paperwork headaches for you.",
  },
  {
    icon: <Wrench size={28} />,
    step: "03",
    title: "Expert Repairs",
    desc: "Our certified technicians restore your vehicle to factory spec using precision tools and exact color matching.",
  },
  {
    icon: <CheckCircle2 size={28} />,
    step: "04",
    title: "Drive Away Happy",
    desc: "Pick up your car looking brand new. Every repair is backed by our quality guarantee.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4">Simple from Start to Finish</h2>
          <p className="text-slate-400 max-w-xl mx-auto">We've streamlined every step so your only job is dropping off the keys.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="text-5xl font-black text-white/5 select-none">{step.step}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-3 w-6 h-px bg-emerald-500/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
