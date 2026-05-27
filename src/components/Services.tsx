import { Car, ShieldCheck, Calendar, Clock, Wrench, Paintbrush } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  { icon: <Car size={24} />,        title: "Collision Repair",   desc: "Full structural restoration for vehicles involved in major accidents." },
  { icon: <Paintbrush size={24} />, title: "Auto Painting",      desc: "Precision color matching and high-gloss finishes that last a lifetime." },
  { icon: <ShieldCheck size={24} />,title: "Insurance Claims",   desc: "We work directly with all major providers to simplify your claim." },
  { icon: <Wrench size={24} />,     title: "Dent Removal",       desc: "Paintless dent repair for those annoying dings and hail damage." },
  { icon: <Calendar size={24} />,   title: "Quick Estimates",    desc: "Get an initial quote in minutes using our AI-powered receptionist." },
  { icon: <Clock size={24} />,      title: "Fast Turnaround",    desc: "We prioritize efficiency to get you back on the road quickly." },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">What We Do</p>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">Specialized Autobody Services</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">We handle everything from the initial insurance claim to the final coat of paint.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all"
            >
              <div className="w-14 h-14 bg-emerald-50 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-500 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
