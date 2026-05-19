/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Car, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  Wrench, 
  Paintbrush, 
  CheckCircle2,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { motion } from 'motion/react';
import Chatbot from './components/Chatbot';
import { cn } from './lib/utils';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-bottom border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Wrench size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">Sammie's <span className="text-emerald-600">Autobody</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-emerald-600 transition-colors">Services</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-emerald-600 transition-colors">Contact</a>
          </div>
          <button 
            onClick={() => document.getElementById('chat-toggle')?.click()}
            className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
          >
            Get Estimate
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-400 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-400 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Denver's #1 Collision Experts
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Expert Repairs for <span className="text-emerald-600">Wrecked Cars.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              From minor dents to major collision damage, Sammie's Autobody Shop restores your vehicle to factory perfection. Fast, reliable, and insurance-approved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('chat-toggle')?.click()}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2"
              >
                Start AI Estimate <ChevronRight size={20} />
              </button>
              <a 
                href="tel:7206765646"
                className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Phone size={20} /> (720) 676-5646
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=1000" 
                alt="Autobody workshop" 
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="font-bold text-2xl">Quality You Can Trust</p>
                  <p className="text-white/80">Certified technicians & state-of-the-art equipment.</p>
                </div>
              </div>
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">15k+</p>
                  <p className="text-sm text-slate-500">Cars Restored</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Our Specialized Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We handle everything from the initial insurance claim to the final coat of paint.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Car className="text-emerald-600" />, 
                title: "Collision Repair", 
                desc: "Full structural restoration for vehicles involved in major accidents." 
              },
              { 
                icon: <Paintbrush className="text-emerald-600" />, 
                title: "Auto Painting", 
                desc: "Precision color matching and high-gloss finishes that last a lifetime." 
              },
              { 
                icon: <ShieldCheck className="text-emerald-600" />, 
                title: "Insurance Claims", 
                desc: "We work directly with all major insurance providers to simplify your claim." 
              },
              { 
                icon: <Wrench className="text-emerald-600" />, 
                title: "Dent Removal", 
                desc: "Paintless dent repair for those annoying dings and hail damage." 
              },
              { 
                icon: <Calendar className="text-emerald-600" />, 
                title: "Quick Estimates", 
                desc: "Get an initial quote in minutes using our AI-powered receptionist." 
              },
              { 
                icon: <Clock className="text-emerald-600" />, 
                title: "Fast Turnaround", 
                desc: "We prioritize efficiency to get you back on the road as quickly as possible." 
              }
            ].map((service, i) => (
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">Everything you need to know about our shop and process.</p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: "What are your business hours?",
                a: "We are open from 9:00 AM to 5:00 PM every day except Sunday. We are closed on Sundays to give our team a well-deserved break."
              },
              {
                q: "Do you work with my insurance company?",
                a: "Yes! We work with all major insurance providers. Our team can help you navigate the claims process from start to finish."
              },
              {
                q: "How long does a typical repair take?",
                a: "Repair times vary depending on the extent of the damage and parts availability. After our initial estimate, we'll provide you with a projected timeline."
              },
              {
                q: "Can I get an estimate online?",
                a: "Absolutely. Use our AI Receptionist (the chat bubble in the corner) to provide your car details and damage description for a preliminary assessment."
              }
            ].map((faq, i) => (
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

      {/* Contact Section */}
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
                {[
                  { day: "Monday", hours: "9:00 AM - 5:00 PM" },
                  { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
                  { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
                  { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
                  { day: "Friday", hours: "9:00 AM - 5:00 PM" },
                  { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
                  { day: "Sunday", hours: "Closed", closed: true }
                ].map((item, i) => (
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

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-white/40 text-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white">
            <Wrench size={20} className="text-emerald-500" />
            <span className="font-bold text-lg tracking-tight">Sammie's Autobody</span>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
              <Instagram size={18} />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 text-center">
          <p>© {new Date().getFullYear()} Sammie's Autobody Shop. All rights reserved.</p>
        </div>
      </footer>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
}
