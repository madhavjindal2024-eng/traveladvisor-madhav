import { api } from './api.js';

/**
 * @param {string} from
 * @param {string} to
 * @param {number} amount
 */
export async function convertCurrency(from, to, amount) {
  const { data } = await api.get('/currency', { params: { from, to, amount } });
  return data;
}
