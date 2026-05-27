import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import PostList from './pages/PostList';
import PostPage from './pages/PostPage';
import { BLOG_POSTS } from './content/blog';
import { ARTICLES } from './content/articles';

const CHAT_AUTOOPEN_KEY = 'chatAutoOpened';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const openChat = () => setChatOpen(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem(CHAT_AUTOOPEN_KEY) === '1') return;
    } catch {
      return;
    }
    const timer = setTimeout(() => {
      try { sessionStorage.setItem(CHAT_AUTOOPEN_KEY, '1'); } catch { /* ignore */ }
      setChatOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
        <Nav onOpenChat={openChat} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenChat={openChat} />} />
            <Route
              path="/blog"
              element={
                <PostList
                  kicker="Blog"
                  title="From the Shop Floor"
                  subtitle="Practical advice from Denver's collision-repair specialists. Written by the team at Sammie's Autobody Shop."
                  posts={BLOG_POSTS}
                  basePath="/blog"
                />
              }
            />
            <Route
              path="/blog/:slug"
              element={<PostPage posts={BLOG_POSTS} basePath="/blog" backLabel="all posts" schemaType="BlogPosting" onOpenChat={openChat} />}
            />
            <Route
              path="/articles"
              element={
                <PostList
                  kicker="Articles"
                  title="In-Depth Guides"
                  subtitle="Long-form articles on collision repair, insurance claims, and what to expect from a Denver auto body shop."
                  posts={ARTICLES}
                  basePath="/articles"
                />
              }
            />
            <Route
              path="/articles/:slug"
              element={<PostPage posts={ARTICLES} basePath="/articles" backLabel="all articles" schemaType="Article" onOpenChat={openChat} />}
            />
          </Routes>
        </main>
        <Footer />
        <ErrorBoundary fallback={<p className="sr-only">Chat assistant is currently unavailable.</p>}>
          <Chatbot isOpen={chatOpen} setIsOpen={setChatOpen} />
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}
