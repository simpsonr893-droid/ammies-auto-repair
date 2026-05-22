import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const hours: { day: string; hours: string; closed?: boolean }[] = [
  { day: "Monday",    hours: "9:00 AM – 5:00 PM" },
  { day: "Tuesday",   hours: "9:00 AM – 5:00 PM" },
  { day: "Wednesday", hours: "9:00 AM – 5:00 PM" },
  { day: "Thursday",  hours: "9:00 AM – 5:00 PM" },
  { day: "Friday",    hours: "9:00 AM – 5:00 PM" },
  { day: "Saturday",  hours: "9:00 AM – 5:00 PM" },
  { day: "Sunday",    hours: "Closed", closed: true },
];

interface FormState {
  name: string;
  phone: string;
  vehicle: string;
  damage: string;
}

function EstimateForm() {
  const [form, setForm] = useState<FormState>({ name: '', phone: '', vehicle: '', damage: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Estimate Request – ${form.vehicle || 'Vehicle'}`;
    const body = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Vehicle: ${form.vehicle}`,
      ``,
      `Damage Description:`,
      form.damage,
    ].join('\n');
    window.location.href =
      `mailto:service@ammiesautorepair.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
        <CheckCircle2 size={48} className="text-emerald-500" />
        <h3 className="text-xl font-bold text-slate-900">Estimate Request Ready!</h3>
        <p className="text-slate-500 text-sm max-w-xs">
          Your email client should have opened with the details pre-filled. You can also call us directly to confirm.
        </p>
        <a href="tel:7206765646" className="mt-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all">
          Call (720) 676-5646
        </a>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', vehicle: '', damage: '' }); }}
          className="text-slate-400 text-xs hover:text-slate-600 transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Request a free estimate">
      <h3 className="text-xl font-bold text-slate-900 mb-1">Request a Free Estimate</h3>
      <p className="text-slate-500 text-sm mb-4">Fill in your details and we'll get back to you shortly.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="est-name" className="block text-xs font-semibold text-slate-600 mb-1.5">Your Name</label>
          <input
            id="est-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="est-phone" className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number</label>
          <input
            id="est-phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="(720) 000-0000"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="est-vehicle" className="block text-xs font-semibold text-slate-600 mb-1.5">Vehicle (Year, Make, Model)</label>
        <input
          id="est-vehicle"
          name="vehicle"
          type="text"
          required
          value={form.vehicle}
          onChange={handleChange}
          placeholder="e.g. 2019 Honda Civic"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="est-damage" className="block text-xs font-semibold text-slate-600 mb-1.5">Describe the Damage</label>
        <textarea
          id="est-damage"
          name="damage"
          required
          rows={4}
          value={form.damage}
          onChange={handleChange}
          placeholder="e.g. Front bumper damage, cracked headlight, paint scratches on driver side door..."
          className={cn(inputClass, "resize-none")}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
      >
        <Send size={16} /> Send Estimate Request
      </button>
      <p className="text-[11px] text-center text-slate-400">
        This will open your email app with the details pre-filled. You can also call us directly at (720) 676-5646.
      </p>
    </form>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h2 id="contact-heading" className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">Visit Our Shop</h2>
          <p className="text-slate-500">Conveniently located in Denver with easy drop-off.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: <MapPin className="text-emerald-600" />, label: "Location", value: "3770 Wheeling St Unit #1\nDenver, CO 80239" },
              { icon: <Phone className="text-emerald-600" />, label: "Phone",    value: "(720) 676-5646",               href: "tel:7206765646" },
              { icon: <Mail className="text-emerald-600" />,  label: "Email",    value: "service@ammiesautorepair.com", href: "mailto:service@ammiesautorepair.com" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-slate-600 hover:text-emerald-600 transition-colors text-sm whitespace-pre-line">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-slate-600 text-sm whitespace-pre-line">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Business hours (compact, visible on mobile alongside contact info) */}
            <div className="lg:hidden flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm mb-1">Hours</p>
                <p className="text-slate-600 text-sm">Mon–Sat: 9:00 AM – 5:00 PM</p>
                <p className="text-slate-600 text-sm">Sunday: <span className="text-red-500">Closed</span></p>
              </div>
            </div>
          </div>

          {/* Estimate form */}
          <div className="lg:col-span-2 bg-slate-50 rounded-3xl border border-slate-100 p-8">
            <EstimateForm />
          </div>
        </div>

        {/* Business hours (desktop, full table) */}
        <div className="hidden lg:block mb-8 bg-slate-50 rounded-3xl border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Business Hours</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {hours.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-0">
                <span className="font-medium text-slate-700 text-sm">{item.day}</span>
                <span className={cn("font-semibold text-sm", item.closed ? "text-red-500" : "text-slate-900")}>{item.hours}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm h-80">
          <iframe
            title="Ammie's Auto Repair location"
            src="https://maps.google.com/maps?q=3770+Wheeling+St+Unit+1+Denver+CO+80239&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </section>
  );
}
