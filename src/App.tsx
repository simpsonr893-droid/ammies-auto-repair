/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import CTABand from './components/CTABand';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const openChat = () => setChatOpen(true);

  useEffect(() => {
    const timer = setTimeout(() => setChatOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Nav onOpenChat={openChat} />
      <main>
        <Hero onOpenChat={openChat} />
        <Stats />
        <Services />
        <Process />
        <Testimonials />
        <CTABand onOpenChat={openChat} />
        <FAQ />
        <Contact />
        <Footer />
      </main>
      <ErrorBoundary fallback={<p className="sr-only">Chat assistant is currently unavailable.</p>}>
        <Chatbot isOpen={chatOpen} setIsOpen={setChatOpen} />
      </ErrorBoundary>
    </div>
  );
}
