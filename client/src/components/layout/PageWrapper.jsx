/**
 * Page shell with animated mesh background.
 * @param {object} props
 */
export function PageWrapper({ children, className = '' }) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      <div className="mesh-bg" aria-hidden>
        <div className="mesh-blob" />
        <div className="mesh-blob" />
        <div className="mesh-blob" />
      </div>
      {children}
    </div>
  );
}
