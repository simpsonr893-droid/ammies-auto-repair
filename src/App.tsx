/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';
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
  const userInteractedRef = useRef(false);

  const setIsOpen = (open: boolean) => {
    userInteractedRef.current = true;
    setChatOpen(open);
  };

  const openChat = () => setIsOpen(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userInteractedRef.current) setChatOpen(true);
    }, 3000);
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

      {/* Toggle button lives outside ErrorBoundary so a chatbot render error never hides it */}
      <button
        onClick={() => setIsOpen(!chatOpen)}
        aria-label={chatOpen ? "Close chat" : "Open chat with AI assistant"}
        aria-expanded={chatOpen}
        className="fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition-all z-50 flex items-center justify-center"
      >
        {chatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <ErrorBoundary fallback={<p className="sr-only">Chat assistant is currently unavailable.</p>}>
        <Chatbot isOpen={chatOpen} setIsOpen={setIsOpen} />
      </ErrorBoundary>
    </div>
  );
}
