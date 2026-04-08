import { useEffect, useRef, useState } from 'react';

/**
 * Parallax-style hero using scroll-driven transform.
 * @param {{ image: string; title: string; subtitle?: string }} props
 */
export function DestinationHero({ image, title, subtitle }) {
  const ref = useRef(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - rect.top / (window.innerHeight * 0.9)));
      setY(p * 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} className="relative h-[min(56vh,520px)] overflow-hidden rounded-b-[var(--radius-xl)]">
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${image})`, transform: `translateY(${y}px) scale(1.05)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)] sm:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-lg text-[var(--text-secondary)]">{subtitle}</p>}
      </div>
    </div>
  );
}
