import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Accessible modal with glass panel.
 * @param {object} props
 */
export function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="glass-card max-h-[90vh] w-full max-w-lg overflow-auto p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          {title && <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[var(--text-muted)] hover:bg-white/10"
            aria-label="Close"
          >
            x
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
