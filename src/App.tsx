/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Services from './components/Services';
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
      <Services />
      <FAQ />
      <Contact />
      <Footer />
      <ErrorBoundary>
        <Chatbot />
      </ErrorBoundary>
    </div>
  );
}
