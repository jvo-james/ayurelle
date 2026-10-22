import { siteUrl } from './_shared.mjs';
export default async request => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  const base = (siteUrl() || new URL(request.url).origin).replace(/\/$/, '');
  const body = `User-agent: *\nAllow: /\nDisallow: /.netlify/\nSitemap: ${base}/sitemap.xml\n`;
  return new Response(request.method === 'HEAD' ? null : body, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
};
