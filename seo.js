(() => {
  'use strict';
  const brand = 'Ayurèlle Organics';
  const descriptions = {
    '/': 'Discover Ayurèlle Organics botanical hair care, complete care sets, hair oils, conditioners and everyday accessories in Accra, Ghana.',
    '/index.html': 'Discover Ayurèlle Organics botanical hair care, complete care sets, hair oils, conditioners and everyday accessories in Accra, Ghana.',
    '/shop.html': 'Shop Ayurèlle Organics complete care sets, botanical hair oils, conditioners, scalp care, men’s care and hair accessories in Ghana.',
    '/about.html': 'Learn about Ayurèlle Organics and our thoughtful approach to botanical hair care, scalp care and everyday routines.',
    '/contact.html': 'Contact Ayurèlle Organics at Ville Afrique, North Kaneshie, Accra for product guidance, order questions, delivery details and customer support.',
    '/product.html': 'Explore product details, pack size, directions and ingredients for Ayurèlle Organics hair care, complete care sets and accessories.',
    '/cart.html': 'Review the products in your Ayurèlle Organics bag, check quantities and continue to secure checkout.',
    '/checkout.html': 'Complete your Ayurèlle Organics order by choosing delivery or pickup and providing the details needed to prepare your purchase.',
    '/confirmation.html': 'View your Ayurèlle Organics order confirmation, fulfilment schedule and receipt details.',
    '/404.html': 'The page could not be found. Return to Ayurèlle Organics to explore botanical hair care and complete care sets.'
  };
  const titles = {
    '/': `${brand} | Feed Your Scalp. Flourish Your Crown.`,
    '/index.html': `${brand} | Feed Your Scalp. Flourish Your Crown.`,
    '/shop.html': `Shop Botanical Hair Care | ${brand}`,
    '/about.html': `Our Story | ${brand}`,
    '/contact.html': `Contact | ${brand}`,
    '/product.html': `Product Details | ${brand}`,
    '/cart.html': `Your Bag | ${brand}`,
    '/checkout.html': `Checkout | ${brand}`,
    '/confirmation.html': `Order Confirmation | ${brand}`,
    '/404.html': `Page Not Found | ${brand}`
  };
  const getOrCreateMeta = (selector, create) => {
    let node = document.head.querySelector(selector);
    if (!node) { node = create(); document.head.appendChild(node); }
    return node;
  };
  const setMeta = (key, value, property = false) => {
    const attr = property ? 'property' : 'name';
    const selector = `meta[${attr}="${key}"]`;
    const node = getOrCreateMeta(selector, () => { const meta = document.createElement('meta'); meta.setAttribute(attr, key); return meta; });
    node.setAttribute('content', value);
  };
  const ensureLink = (rel) => getOrCreateMeta(`link[rel="${rel}"]`, () => { const link = document.createElement('link'); link.rel = rel; return link; });
  const path = location.pathname.replace(/\/$/, '') || '/';
  const productRoute = path.match(/^\/products\/([^/]+)$/);
  const isProductPath = path === '/product.html' || Boolean(productRoute);
  const description = (isProductPath ? descriptions['/product.html'] : descriptions[path]) || descriptions['/404.html'];
  const indexable = ['/', '/index.html', '/shop.html', '/about.html', '/contact.html'].includes(path) || isProductPath;
  const canonical = () => {
    const url = new URL(location.pathname, location.origin);
    if (path === '/product.html') {
      const slug = new URLSearchParams(location.search).get('slug') || 'full-hair-growth-set';
      url.pathname = `/products/${encodeURIComponent(slug)}`;
      url.search = '';
    }
    if (productRoute) url.search = '';
    if (path === '/index.html' || path === '/') url.pathname = '/';
    return url.href;
  };
  const applyCore = () => {
    const title = document.title || titles[path] || titles['/404.html'];
    const desc = document.querySelector('meta[name="description"]')?.content || description;
    setMeta('description', desc);
    setMeta('og:title', title, true);
    setMeta('og:description', desc, true);
    setMeta('og:site_name', brand, true);
    setMeta('og:type', isProductPath ? 'product' : 'website', true);
    setMeta('og:url', canonical(), true);
    setMeta('og:image', new URL('images/logo.jpeg', `${location.origin}/`).href, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', desc);
    if (indexable) ensureLink('canonical').href = canonical();
    else setMeta('robots', 'noindex,follow');
  };
  const setStructuredData = data => {
    let script = document.head.querySelector('script[data-seo-jsonld]');
    if (!script) { script = document.createElement('script'); script.type = 'application/ld+json'; script.dataset.seoJsonld = ''; document.head.appendChild(script); }
    script.textContent = JSON.stringify(data);
  };
  const updateProductSeo = () => {
    if (!isProductPath) return;
    let routeSlug = '';
    try { routeSlug = productRoute?.[1] ? decodeURIComponent(productRoute[1]) : ''; } catch { routeSlug = ''; }
    const slug = new URLSearchParams(location.search).get('slug') || routeSlug || 'full-hair-growth-set';
    const product = window.AYURELLE_CATALOGUE?.get?.(slug);
    if (!product) return;
    const title = `${product.name} | ${brand}`;
    const desc = String(product.description || product.short || description).replace(/\s+/g, ' ').slice(0, 300);
    document.title = title;
    setMeta('description', desc);
    setMeta('og:title', title, true);
    setMeta('og:description', desc, true);
    setMeta('og:type', 'product', true);
    const imagePath = (Array.isArray(product.images) && product.images[0]) || product.imageUrl || (window.AYURELLE_IMAGES?.products || {})[slug] || 'images/logo.jpeg';
    const image = new URL(imagePath, `${location.origin}/`).href;
    setMeta('og:image', image, true);
    setMeta('og:url', canonical(), true);
    ensureLink('canonical').href = canonical();
    const price = Number(product.price);
    const variantPrices = Array.isArray(product.variants) ? product.variants.map(variant => Number(variant?.price)).filter(value => Number.isFinite(value) && value >= 0) : [];
    const availability = product.active === false || (product.trackInventory && Number(product.stock || 0) <= 0) ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock';
    const offers = variantPrices.length ? {
      '@type': 'AggregateOffer', url: canonical(), priceCurrency: 'GHS',
      lowPrice: Math.min(...variantPrices).toFixed(2), highPrice: Math.max(...variantPrices).toFixed(2),
      offerCount: variantPrices.length, availability
    } : (Number.isFinite(price) && price >= 0 ? { '@type': 'Offer', url: canonical(), priceCurrency: 'GHS', price: price.toFixed(2), availability } : null);
    const structured = {
      '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: desc,
      sku: product.slug, category: product.category || 'Hair Care', image: [image],
      brand: { '@type': 'Brand', name: brand },
      ...(offers ? { offers } : {})
    };
    setStructuredData(structured);
  };
  const init = () => {
    document.title = titles[path] || (isProductPath ? titles['/product.html'] : document.title);
    applyCore();
    if (path === '/' || path === '/index.html') setStructuredData({ '@context': 'https://schema.org', '@type': 'Organization', name: brand, url: `${location.origin}/`, logo: new URL('images/logo.jpeg', `${location.origin}/`).href, email: 'ayurelleorganics@yahoo.com', telephone: '+233547446264', address: { '@type': 'PostalAddress', streetAddress: 'Ville Afrique, North Kaneshie', addressLocality: 'Accra', addressCountry: 'GH' } });
    updateProductSeo();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
  window.addEventListener('ayurelle:catalogue-ready', updateProductSeo);
})();
