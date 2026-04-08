import { api } from './api.js';

/** @param {Record<string, unknown>} body */
export async function generateItinerary(body) {
  const { data } = await api.post('/planner/generate', body);
  return data;
}

/** @param {Record<string, unknown>} body */
export async function generatePackingList(body) {
  const { data } = await api.post('/planner/packing', body);
  return data;
}
