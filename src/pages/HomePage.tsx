import { useEffect } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import CTABand from '../components/CTABand';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

interface Props {
  onOpenChat: () => void;
}

export default function HomePage({ onOpenChat }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <Hero onOpenChat={onOpenChat} />
      <Stats />
      <Services />
      <Process />
      <Testimonials />
      <CTABand onOpenChat={onOpenChat} />
      <FAQ />
      <Contact />
    </>
  );
}
