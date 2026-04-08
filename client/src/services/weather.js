import { api } from './api.js';

/** @param {{ city?: string; lat?: number; lng?: number }} params */
export async function fetchWeather(params) {
  const { data } = await api.get('/weather', { params });
  return data;
}
