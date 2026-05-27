import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, ArrowLeft, Phone, MessageSquare } from 'lucide-react';
import type { Post } from '../content/types';

interface Props {
  posts: Post[];
  basePath: '/blog' | '/articles';
  backLabel: string;
  schemaType: 'BlogPosting' | 'Article';
  onOpenChat: () => void;
}

const SITE_URL = 'https://www.sammiesautobody.com';
const PUBLISHER = {
  '@type': 'Organization',
  name: "Sammie's Autobody Shop",
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3770 Wheeling St Unit #1',
    addressLocality: 'Denver',
    addressRegion: 'CO',
    postalCode: '80239',
    addressCountry: 'US',
  },
  telephone: '+17206765646',
  areaServed: 'Denver, CO',
};

function injectJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function setOrCreateMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function PostPage({ posts, basePath, backLabel, schemaType, onOpenChat }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) return;
    const url = `${SITE_URL}${basePath}/${post.slug}`;
    document.title = `${post.title} — Sammie's Autobody Shop`;
    setOrCreateMeta('meta[name="description"]', 'name', 'description', post.metaDescription);
    setCanonical(url);
    setOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', post.title);
    setOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', post.metaDescription);
    setOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setOrCreateMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
    setOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', post.title);
    setOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', post.metaDescription);
    injectJsonLd('post-schema', {
      '@context': 'https://schema.org',
      '@type': schemaType,
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.date,
      dateModified: post.date,
      author: PUBLISHER,
      publisher: PUBLISHER,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      ...(schemaType === 'Article' ? { areaServed: 'Denver, CO' } : {}),
    });
    window.scrollTo({ top: 0, behavior: 'auto' });

    return () => {
      const el = document.getElementById('post-schema');
      if (el) el.remove();
    };
  }, [post, basePath, schemaType]);

  if (!post) return <Navigate to={basePath} replace />;

  return (
    <article className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <Link to={basePath} className="inline-flex items-center gap-1.5 text-sm text-emerald-700 font-semibold hover:text-emerald-800 mb-8">
          <ArrowLeft size={14} /> Back to {backLabel}
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} />{post.readingTime}</span>
          </div>
        </header>

        <div className="markdown">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-emerald-50 border border-emerald-100">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ready for a free estimate?</h3>
          <p className="text-slate-600 mb-6">Sammie's Autobody Shop · 3770 Wheeling St Unit #1, Denver, CO 80239</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenChat}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare size={18} /> Chat with our AI receptionist
            </button>
            <a
              href="tel:7206765646"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              <Phone size={18} /> (720) 676-5646
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
