import { getAdminServices, json, methodNotAllowed, loadServerCatalogue } from './_shared.mjs';
export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'GET') return methodNotAllowed(['GET']);
  try {
    let db = null;
    try { db = getAdminServices().db; } catch { /* Public fallback catalog remains available until Firebase service credentials are set. */ }
    const result = await loadServerCatalogue(db);
    return json(result, 200, { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=90' });
  } catch (error) {
    console.error('catalogue:', error.message);
    return json({ error: 'The catalogue is temporarily unavailable.' }, 503);
  }
};
