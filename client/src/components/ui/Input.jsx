/**
 * Text input styled for glass forms.
 * @param {object} props
 */
export function Input({ label, error, className = '', id, ...rest }) {
  const cid = id || rest.name;
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`} htmlFor={cid}>
      {label && <span className="text-[var(--text-secondary)]">{label}</span>}
      <input
        id={cid}
        className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
        {...rest}
      />
      {error && <span className="text-rose-400 text-xs">{error}</span>}
    </label>
  );
}
