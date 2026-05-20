/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Nav />
      <Hero />
      <Stats />
      <Services />
      <Process />
      <Testimonials />
      <CTABand />
      <FAQ />
      <Contact />
      <Footer />
      <ErrorBoundary>
        <Chatbot />
      </ErrorBoundary>
    </div>
  );
}
