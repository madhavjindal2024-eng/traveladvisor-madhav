import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';

const links = [
  { to: '/explore', label: 'Explore' },
  { to: '/planner', label: 'Planner' },
  { to: '/map', label: 'Map' },
  { to: '/hotels', label: 'Hotels' },
  { to: '/food', label: 'Food' },
  { to: '/blog', label: 'Blog' },
  { to: '/tools/budget', label: 'Budget' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Fixed glass navigation with scroll blur.
 */
export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 transition ${
        scrolled ? 'backdrop-blur-xl bg-[var(--bg-primary)]/70' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--text-primary)]">
          Travel Advisor
        </Link>
        <nav className="hidden flex-wrap items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? 'bg-white/10 text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="glass-card rounded-xl px-3 py-2 text-xs text-[var(--text-secondary)]"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="hidden rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-white/5 sm:inline">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-xl border border-[var(--glass-border)] px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-white/5"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
