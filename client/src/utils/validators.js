/**
 * @param {string} email
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

/**
 * @param {string} password
 */
export function passwordStrength(password) {
  const p = String(password || '');
  if (p.length < 8) return 'Use at least 8 characters';
  return null;
}
