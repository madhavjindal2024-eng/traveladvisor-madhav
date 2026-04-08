import { Link } from 'react-router-dom';

/**
 * Site footer with secondary navigation.
 */
export function Footer() {
  return (
    <footer className="border-t border-[var(--glass-border)] bg-[var(--bg-secondary)]/40 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg text-[var(--text-primary)]">Travel Advisor</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Plan trips, explore destinations, and build itineraries with confidence.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
            <li>
              <Link to="/explore" className="hover:text-[var(--text-primary)]">
                Explore
              </Link>
            </li>
            <li>
              <Link to="/planner" className="hover:text-[var(--text-primary)]">
                AI Planner
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-[var(--text-primary)]">
                Map
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Resources</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
            <li>
              <Link to="/blog" className="hover:text-[var(--text-primary)]">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/tools/budget" className="hover:text-[var(--text-primary)]">
                Budget tools
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-[var(--text-primary)]">
                Reviews
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[var(--text-primary)]">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
            <li>
              <Link to="/auth" className="hover:text-[var(--text-primary)]">
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-[var(--text-primary)]">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-[var(--text-muted)]">
        College project demo. APIs proxied through backend; keys are not exposed to the browser.
      </p>
    </footer>
  );
}
