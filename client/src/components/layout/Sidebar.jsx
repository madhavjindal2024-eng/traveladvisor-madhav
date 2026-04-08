import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/trips', label: 'Saved Trips' },
  { to: '/dashboard/wishlist', label: 'Wishlists' },
  { to: '/dashboard/itineraries', label: 'Itineraries' },
  { to: '/dashboard/reviews', label: 'My Reviews' },
  { to: '/dashboard/settings', label: 'Settings' },
];

/**
 * Dashboard sidebar navigation.
 */
export function Sidebar() {
  return (
    <aside className="glass-card w-full shrink-0 p-4 lg:w-56">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Dashboard</p>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${
                isActive ? 'bg-[var(--accent-primary)]/20 text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-white/5'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
