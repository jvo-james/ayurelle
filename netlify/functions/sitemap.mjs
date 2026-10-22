import { getAdminServices, siteUrl } from './_shared.mjs';
import { fallbackProducts } from './_catalogue.mjs';
import { loadServerCatalogue } from './_shared.mjs';
let cached = { at: 0, xml: '' };
const xmlEsc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
export default async request => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  const base = (siteUrl() || new URL(request.url).origin).replace(/\/$/, '');
  if (cached.xml && Date.now() - cached.at < 300_000) return new Response(request.method === 'HEAD' ? null : cached.xml, { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=300' } });
  let products = fallbackProducts.filter(product => product.active !== false);
  try { const { db } = getAdminServices(); const catalogue = await loadServerCatalogue(db); products = catalogue.products.filter(product => product.active !== false); } catch { /* The launch sitemap still includes fallback catalogue routes when server data is unavailable. */ }
  const urls = [
    { path: '/', priority: '1.0' }, { path: '/shop.html', priority: '0.9' },
    { path: '/about.html', priority: '0.6' }, { path: '/contact.html', priority: '0.6' },
    ...products.filter(product => product.slug).map(product => ({ path: `/products/${encodeURIComponent(product.slug)}`, priority: '0.8' }))
  ];
  const unique = [...new Map(urls.map(item => [item.path, item])).values()];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map(item => `  <url><loc>${xmlEsc(`${base}${item.path}`)}</loc><changefreq>weekly</changefreq><priority>${item.priority}</priority></url>`).join('\n')}\n</urlset>`;
  cached = { at: Date.now(), xml: body };
  return new Response(request.method === 'HEAD' ? null : body, { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=300' } });
};
