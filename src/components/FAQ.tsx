import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const faqs = [
  {
    q: "What are your business hours?",
    a: "We are open from 9:00 AM to 5:00 PM Monday through Saturday. We are closed on Sundays.",
  },
  {
    q: "Do you work with my insurance company?",
    a: "Yes! We work with all major insurance providers. Our team handles the claims process from start to finish so you don't have to deal with the paperwork.",
  },
  {
    q: "How long does a typical repair take?",
    a: "Repair times vary depending on the extent of the damage and parts availability. After your initial estimate, we'll give you a projected completion timeline.",
  },
  {
    q: "Can I get an estimate online?",
    a: "Absolutely. Use our online estimate form in the Contact section below — fill in your vehicle details and damage description and we'll get back to you shortly.",
  },
  {
    q: "Do you offer a warranty on repairs?",
    a: "Yes — we stand behind every job. All repairs come with our quality guarantee covering workmanship and paint matching.",
  },
  {
    q: "Do I need to call ahead or can I just drop in?",
    a: "For estimates, walk-ins are welcome during business hours. For repairs, we recommend scheduling in advance so we can ensure a bay is ready and any needed parts are ordered ahead of your visit.",
  },
  {
    q: "Will my car be safe and secure while it's at your shop?",
    a: "Absolutely. Our facility is secured and monitored. Your vehicle is fully insured while in our care from drop-off to pick-up.",
  },
  {
    q: "Do you offer rental car assistance?",
    a: "Yes. We can coordinate directly with your insurance company's rental program, and we work closely with local rental agencies to help get you into a loaner while your car is being repaired.",
  },
  {
    q: "Can you repair all makes and models?",
    a: "Yes — our certified technicians are trained to work on all makes and models, domestic and foreign, including trucks and SUVs.",
  },
];

function FAQItem({ q, a, id }: { q: string; a: string; id: string }) {
  const [open, setOpen] = useState(false);
  const answerId = `faq-answer-${id}`;

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={answerId}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-bold text-slate-900 pr-4">{q}</span>
        <ChevronDown
          size={20}
          className={cn("text-emerald-600 shrink-0 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={answerId}
            role="region"
            aria-label={q}
            key="content"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-slate-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-slate-50" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">FAQ</p>
          <h2 id="faq-heading" className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500">Everything you need to know before bringing your car in.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => <FAQItem key={i} id={String(i)} {...faq} />)}
        </div>
      </div>
    </section>
  );
}
