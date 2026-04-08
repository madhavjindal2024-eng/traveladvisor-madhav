import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { useWishlist } from '../../hooks/useWishlist.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatMoney } from '../../utils/formatters.js';

/**
 * Destination grid card with wishlist control.
 * @param {{ destination: Record<string, unknown> }} props
 */
export function DestinationCard({ destination }) {
  const { user } = useAuth();
  const { has, toggle } = useWishlist();
  const id = destination._id;

  return (
    <article className="glass-card card-hover overflow-hidden">
      <Link to={`/destination/${id}`} className="block">
        <div
          className="h-44 bg-cover bg-center"
          style={{ backgroundImage: `url(${destination.heroImage})` }}
        />
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/destination/${id}`}>
              <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--text-primary)]">
                {destination.name}
              </h3>
            </Link>
            <p className="text-sm text-[var(--text-muted)]">{destination.country}</p>
          </div>
          <span className="text-sm text-[var(--accent-gold)]">
            {'★'.repeat(Math.min(5, Math.max(0, Math.round(destination.rating || 0))))}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">{destination.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(destination.tags || []).slice(0, 3).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-sm text-[var(--text-secondary)]">
            From {formatMoney(destination.avgCostPerDay)}/day
          </p>
          <Button
            type="button"
            variant="ghost"
            className="!px-3 !py-1.5 text-xs"
            onClick={(e) => {
              e.preventDefault();
              if (!user) {
                window.location.href = '/auth';
                return;
              }
              toggle(id);
            }}
          >
            {has(id) ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </article>
  );
}
