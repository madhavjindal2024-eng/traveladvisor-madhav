import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { api } from '../services/api.js';

/**
 * Magazine-style blog index.
 */
export function Blog() {
  const [q, setQ] = useState('');
  const debounced = useDebounce(q, 300);
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/blog', { params: { q: debounced || undefined } }).then((res) => setItems(res.data.items || []));
  }, [debounced]);

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">Travel Journal</h1>
        <div className="mt-6 max-w-md">
          <Input placeholder="Search posts" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post, i) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className={`glass-card card-hover overflow-hidden ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <div
                className={`bg-cover bg-center ${i === 0 ? 'h-64' : 'h-40'}`}
                style={{ backgroundImage: `url(${post.coverImage})` }}
              />
              <div className="p-6">
                <p className="text-xs uppercase tracking-wide text-[var(--accent-primary)]">{post.category}</p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">{post.excerpt}</p>
                <p className="mt-4 text-xs text-[var(--text-muted)]">{post.readMinutes} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </PageWrapper>
  );
}
