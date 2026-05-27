import { Phone, MessageSquare } from 'lucide-react';

interface Props {
  onOpenChat: () => void;
}

export default function CTABand({ onOpenChat }: Props) {
  return (
    <section className="bg-emerald-600 py-20" aria-labelledby="cta-heading">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 id="cta-heading" className="text-3xl lg:text-5xl font-extrabold text-white mb-4">
          Ready to Get Your Car Fixed?
        </h2>
        <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto">
          Get a free estimate in minutes. We'll take it from there — including the insurance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onOpenChat}
            className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <MessageSquare size={20} /> Start Free Estimate
          </button>
          <a
            href="tel:7206765646"
            className="border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Phone size={20} /> (720) 676-5646
          </a>
        </div>
      </div>
    </section>
  );
}
