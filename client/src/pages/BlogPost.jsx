import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { api } from '../services/api.js';

/**
 * Single blog article with simple markdown-like sections.
 */
export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const { data } = await api.get(`/blog/${slug}`);
      if (cancelled) return;
      setPost(data);
      const { data: rel } = await api.get('/blog', { params: { category: data.category } });
      if (cancelled) return;
      setRelated((rel.items || []).filter((p) => p.slug !== slug).slice(0, 3));
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!post) {
    return (
      <PageWrapper>
        <Navbar />
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="spinner" />
        </div>
      </PageWrapper>
    );
  }

  const lines = post.content.split('\n');

  return (
    <PageWrapper>
      <Navbar />
      <article className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <Link to="/blog" className="text-sm text-[var(--accent-primary)] hover:underline">
          Back to journal
        </Link>
        <p className="mt-6 text-xs uppercase tracking-wide text-[var(--accent-primary)]">{post.category}</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">{post.title}</h1>
        <p className="mt-4 text-[var(--text-secondary)]">
          {post.authorName} · {post.readMinutes} min read
        </p>
        <div
          className="mt-10 h-72 rounded-[var(--radius-xl)] bg-cover bg-center"
          style={{ backgroundImage: `url(${post.coverImage})` }}
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_220px]">
          <div className="prose prose-invert max-w-none">
            {lines.map((line, i) => {
              if (line.startsWith('## ')) {
                return (
                  <h2 key={`h-${i}`} className="mt-8 font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (!line.trim()) return <br key={`b-${i}`} />;
              return (
                <p key={`p-${i}`} className="text-[var(--text-secondary)] leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>
          <aside className="glass-card h-fit p-4 text-sm">
            <p className="font-medium text-[var(--text-primary)]">On this page</p>
            <ul className="mt-3 space-y-2 text-[var(--text-muted)]">
              {lines
                .filter((l) => l.startsWith('## '))
                .map((l) => (
                  <li key={l}>{l.replace('## ', '')}</li>
                ))}
            </ul>
          </aside>
        </div>
        <section className="mt-16">
          <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">Related</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r._id} to={`/blog/${r.slug}`} className="glass-card card-hover p-4">
                <p className="text-sm text-[var(--text-primary)]">{r.title}</p>
              </Link>
            ))}
          </div>
        </section>
      </article>
      <Footer />
    </PageWrapper>
  );
}
