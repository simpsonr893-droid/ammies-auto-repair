import React from 'react';
import { Car, ShieldCheck, Calendar, Clock, Wrench, Paintbrush } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  { icon: <Car className="text-emerald-600" />, title: "Collision Repair", desc: "Full structural restoration for vehicles involved in major accidents." },
  { icon: <Paintbrush className="text-emerald-600" />, title: "Auto Painting", desc: "Precision color matching and high-gloss finishes that last a lifetime." },
  { icon: <ShieldCheck className="text-emerald-600" />, title: "Insurance Claims", desc: "We work directly with all major insurance providers to simplify your claim." },
  { icon: <Wrench className="text-emerald-600" />, title: "Dent Removal", desc: "Paintless dent repair for those annoying dings and hail damage." },
  { icon: <Calendar className="text-emerald-600" />, title: "Quick Estimates", desc: "Get an initial quote in minutes using our AI-powered receptionist." },
  { icon: <Clock className="text-emerald-600" />, title: "Fast Turnaround", desc: "We prioritize efficiency to get you back on the road as quickly as possible." },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Our Specialized Services</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">We handle everything from the initial insurance claim to the final coat of paint.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
