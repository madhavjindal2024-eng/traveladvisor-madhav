/**
 * @param {number} n
 */
export function formatMoney(n, currency = 'USD') {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    n || 0
  );
}

/**
 * @param {string} iso
 */
export function formatDateShort(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
