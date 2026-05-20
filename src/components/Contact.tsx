import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { cn } from '../lib/utils';

const hours: { day: string; hours: string; closed?: boolean }[] = [
  { day: "Monday",    hours: "9:00 AM - 5:00 PM" },
  { day: "Tuesday",   hours: "9:00 AM - 5:00 PM" },
  { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
  { day: "Thursday",  hours: "9:00 AM - 5:00 PM" },
  { day: "Friday",    hours: "9:00 AM - 5:00 PM" },
  { day: "Saturday",  hours: "9:00 AM - 5:00 PM" },
  { day: "Sunday",    hours: "Closed", closed: true },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 blur-[100px] -z-0" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-8">Visit Our Shop</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">Location</p>
                  <p className="text-white/60">3770 Wheeling St Unit #1<br />Denver, CO 80239</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">Phone</p>
                  <p className="text-white/60">(720) 676-5646</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">Email</p>
                  <p className="text-white/60">service@sammiesautobody.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Our Hours</h3>
            <div className="space-y-4">
              {hours.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="font-medium">{item.day}</span>
                  <span className={cn("text-white/60", item.closed && "text-red-400 font-bold")}>{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
