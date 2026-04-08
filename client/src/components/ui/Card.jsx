/**
 * Glass surface card with optional hover lift.
 * @param {object} props
 */
export function Card({ children, className = '', hover = false, ...rest }) {
  return (
    <div
      className={`glass-card p-6 ${hover ? 'card-hover' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
