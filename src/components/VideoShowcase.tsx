import React from 'react';
import { motion } from 'motion/react';

const VIDEO_ID = 'qvnHOc35ngQ';

export default function VideoShowcase() {
  return (
    <section id="watch" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">See Us In Action</p>
          <h2 className="text-3xl lg:text-5xl font-extrabold mb-4">Watch the Transformation</h2>
          <p className="text-slate-500 max-w-xl mx-auto">From first dent to factory-fresh finish — take a look at the craftsmanship behind every Sammie's Autobody repair.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl aspect-video bg-slate-950"
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
            title="Sammie's Autobody Shop — video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </motion.div>
      </div>
    </section>
  );
}
