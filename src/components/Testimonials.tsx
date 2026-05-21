import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

const reviews = [
  {
    name: "Maria G.",
    location: "Denver, CO",
    rating: 5,
    text: "After my accident, Sammie's made the whole process completely stress-free. They handled my insurance and my car came back looking better than before the crash. Absolutely recommend.",
  },
  {
    name: "James T.",
    location: "Aurora, CO",
    rating: 5,
    text: "They worked directly with my insurance company and I didn't have to do a single thing. Incredible service, honest pricing, and the repair was done ahead of schedule.",
  },
  {
    name: "David R.",
    location: "Lakewood, CO",
    rating: 5,
    text: "Best body shop in Denver. Fast turnaround, the paint match was absolutely perfect, and the staff kept me updated the whole time. Won't go anywhere else.",
  },
  {
    name: "Keisha M.",
    location: "Denver, CO",
    rating: 5,
    text: "I was so stressed after my fender bender but Sammie's made it painless. Dropped my car off Monday, had it back Wednesday looking brand new. The team is professional and genuinely kind.",
  },
  {
    name: "Carlos V.",
    location: "Commerce City, CO",
    rating: 5,
    text: "Brought my truck in after a hit-and-run. They handled everything with my insurance and the repair is flawless — you can't tell anything happened. Highly recommend to anyone in the Denver area.",
  },
  {
    name: "Ashley W.",
    location: "Thornton, CO",
    rating: 5,
    text: "I've been to a lot of body shops over the years and Sammie's is hands down the best. Transparent pricing, great communication, and the quality of work is unmatched.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-3">Customer Reviews</p>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4">What Denver Drivers Say</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Over 15,000 satisfied customers and counting.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 grid-rows-2">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 transition-all"
            >
              <Stars count={review.rating} />
              <p className="text-slate-300 mt-4 mb-6 leading-relaxed">"{review.text}"</p>
              <div>
                <p className="text-white font-bold text-sm">{review.name}</p>
                <p className="text-slate-500 text-sm">{review.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
