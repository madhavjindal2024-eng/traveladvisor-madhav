/**
 * Primary glass-friendly button.
 * @param {object} props
 */
export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-50';
  const variants = {
    primary: 'bg-[var(--accent-primary)] text-white hover:brightness-110',
    ghost: 'glass-card text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40',
    outline: 'border border-[var(--glass-border)] bg-transparent text-[var(--text-primary)] hover:bg-white/5',
  };
  return (
    <button type={type} disabled={disabled} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
