import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { Post } from '../content/types';

interface Props {
  kicker: string;
  title: string;
  subtitle: string;
  posts: Post[];
  basePath: '/blog' | '/articles';
}

export default function PostList({ kicker, title, subtitle, posts, basePath }: Props) {
  return (
    <section className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">{kicker}</p>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">{title}</h1>
          <p className="text-slate-500 max-w-xl mx-auto">{subtitle}</p>
        </div>

        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.slug}>
              <Link
                to={`${basePath}/${post.slug}`}
                className="group block p-6 lg:p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all"
              >
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} />{post.readingTime}</span>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">{post.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                  Read more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
