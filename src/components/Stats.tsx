import React from 'react';
import { motion } from 'motion/react';

const stats = [
  { value: "15,000+", label: "Cars Restored" },
  { value: "10+",     label: "Years in Business" },
  { value: "All",     label: "Insurance Accepted" },
  { value: "4.9",     label: "Google Rating", suffix: "★", srSuffix: " star" },
];

export default function Stats() {
  return (
    <section aria-label="Key statistics" className="bg-emerald-600 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl font-extrabold">
                <span aria-hidden="true">{stat.value}{stat.suffix}</span>
                <span className="sr-only">{stat.value}{stat.srSuffix ?? ''}</span>
              </p>
              <p className="text-emerald-100 text-sm font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
