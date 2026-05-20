import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
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

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">Find Us</p>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">Visit Our Shop</h2>
          <p className="text-slate-500">Conveniently located in Denver with easy drop-off.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[
              {
                icon: <MapPin className="text-emerald-600" />,
                label: "Location",
                value: "3770 Wheeling St Unit #1\nDenver, CO 80239",
              },
              {
                icon: <Phone className="text-emerald-600" />,
                label: "Phone",
                value: "(720) 676-5646",
                href: "tel:7206765646",
              },
              {
                icon: <Mail className="text-emerald-600" />,
                label: "Email",
                value: "service@sammiesautobody.com",
                href: "mailto:service@sammiesautobody.com",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
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
          </div>

          <div className="lg:col-span-2 bg-slate-50 rounded-3xl border border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Business Hours</h3>
            </div>
            <div className="space-y-1">
              {hours.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-0">
                  <span className="font-medium text-slate-700">{item.day}</span>
                  <span className={cn("font-semibold text-sm", item.closed ? "text-red-500" : "text-slate-900")}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
