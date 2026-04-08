import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';

/**
 * Contact page for project profile and inquiry form.
 */
export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--glass-border)] bg-[radial-gradient(circle_at_20%_20%,rgba(79,142,247,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(124,92,191,0.25),transparent_45%),linear-gradient(120deg,rgba(15,22,40,0.78),rgba(10,14,26,0.92))] p-10 sm:p-14">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent-primary)]">Contact</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)] sm:text-5xl">
            Madhav Jindal
          </h1>
          <p className="mt-4 max-w-3xl text-[var(--text-secondary)]">
            B.Tech AI student at VIT, passionate about travel tech and building smart web experiences.
          </p>
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white/20 opacity-60" />
          <div className="pointer-events-none absolute -bottom-16 left-[22%] h-56 w-56 rounded-full border border-white/10 opacity-50" />
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">Profile details</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Name</p>
                <p className="mt-1 text-base text-[var(--text-primary)]">Madhav Jindal</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Email</p>
                <a
                  href="mailto:madhav.jindal2024@vitstudent.ac.in"
                  className="mt-1 inline-block text-base text-[var(--accent-primary)] hover:underline"
                >
                  madhav.jindal2024@vitstudent.ac.in
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Registration No.</p>
                <p className="mt-1 text-base text-[var(--text-primary)]">24BAI1154</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">University</p>
                <p className="mt-1 text-base text-[var(--text-primary)]">VIT (Vellore Institute of Technology)</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">Profiles</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Connect via social profiles.</p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="GitHub profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-3.162 19.487c.5.092.683-.216.683-.48 0-.236-.009-.861-.013-1.69-2.782.604-3.369-1.34-3.369-1.34-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.528 2.34 1.086 2.91.831.091-.646.349-1.086.635-1.336-2.221-.253-4.556-1.111-4.556-4.944 0-1.092.39-1.985 1.029-2.684-.103-.253-.446-1.272.098-2.651 0 0 .84-.269 2.75 1.026A9.58 9.58 0 0 1 12 6.844a9.58 9.58 0 0 1 2.504.337c1.909-1.295 2.748-1.026 2.748-1.026.545 1.379.202 2.398.099 2.651.64.699 1.028 1.592 1.028 2.684 0 3.843-2.339 4.688-4.566 4.936.359.309.679.919.679 1.853 0 1.337-.012 2.416-.012 2.745 0 .266.18.576.688.478A10 10 0 0 0 12 2Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M20.45 20.45h-3.554v-5.568c0-1.328-.028-3.037-1.851-3.037-1.852 0-2.136 1.445-2.136 2.939v5.666H9.354V9h3.414v1.561h.049c.476-.9 1.637-1.851 3.369-1.851 3.603 0 4.268 2.371 4.268 5.455v6.285ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.45H3.556V9h3.558v11.45Z" />
                </svg>
              </a>
            </div>
          </Card>
        </section>

        <section className="mt-10">
          <Card>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">Get In Touch</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Send a quick message for project collaboration, feedback, or presentation discussion.
            </p>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
              <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                required
              />
              <label className="md:col-span-2">
                <span className="text-sm text-[var(--text-secondary)]">Message</span>
                <textarea
                  name="message"
                  className="mt-1.5 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Write your message"
                  required
                />
              </label>
              <div className="md:col-span-2 flex items-center justify-between gap-3">
                <Button type="submit">Submit</Button>
                {submitted && (
                  <p className="text-sm text-[var(--accent-primary)]">Message captured in UI. Backend integration can be added later.</p>
                )}
              </div>
            </form>
          </Card>
        </section>
      </main>
      <Footer />
    </PageWrapper>
  );
}
