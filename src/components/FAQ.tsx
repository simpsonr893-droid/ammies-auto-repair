import React from 'react';

const faqs = [
  {
    q: "What are your business hours?",
    a: "We are open from 9:00 AM to 5:00 PM every day except Sunday. We are closed on Sundays to give our team a well-deserved break.",
  },
  {
    q: "Do you work with my insurance company?",
    a: "Yes! We work with all major insurance providers. Our team can help you navigate the claims process from start to finish.",
  },
  {
    q: "How long does a typical repair take?",
    a: "Repair times vary depending on the extent of the damage and parts availability. After our initial estimate, we'll provide you with a projected timeline.",
  },
  {
    q: "Can I get an estimate online?",
    a: "Absolutely. Use our AI Receptionist (the chat bubble in the corner) to provide your car details and damage description for a preliminary assessment.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-600">Everything you need to know about our shop and process.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <span className="text-emerald-600">Q:</span> {faq.q}
              </h4>
              <p className="text-slate-600 pl-7">
                <span className="font-bold text-emerald-600">A:</span> {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
