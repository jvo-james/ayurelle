(() => {
  'use strict';
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const money = value => `GH₵${Number(value || 0).toFixed(2)}`;
  const productImage = product => {
    const images = window.AYURELLE_IMAGES || {};
    if (Array.isArray(product.images) && product.images.length && !product.useRepositoryImages) return product.images[0];
    if (product.imageUrl && !product.useRepositoryImages) return product.imageUrl;
    const variants = images.variants && images.variants[product.slug];
    const color = variants && variants.default;
    if (color && variants.colors && variants.colors[color]) return variants.colors[color].image;
    return (images.products && images.products[product.slug]) || images.detailAccent || 'images/ayurelle-mark.svg';
  };
  const productPrice = product => {
    if (Array.isArray(product.variants) && product.variants.length) return Math.min(...product.variants.map(v => Number(v.price) || 0));
    return Number(product.price) || 0;
  };

  function setupHeaderSearch(header) {
    if (!header || header.querySelector('[data-global-search]')) return;
    const toggle = header.querySelector('[data-search-toggle]');
    if (!toggle) return;
    const shell = document.createElement('div');
    shell.className = 'header-search-shell';
    shell.dataset.globalSearch = '';
    shell.innerHTML = `
      <div class="header-search-panel" role="search" aria-label="Search Ayurélle products">
        <div class="header-search-field"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input type="search" data-global-search-input placeholder="Search products, sets and essentials…" autocomplete="off" aria-label="Search products"><button type="button" class="search-close" data-search-close aria-label="Close product search"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19"/></svg></button></div>
        <div class="header-search-results" data-global-search-results><p class="search-prompt"><span class="search-prompt-mark"><i class="fa-solid fa-sparkles" aria-hidden="true"></i></span><span><strong>Find your next favourite</strong><small>Search by product name or category.</small></span></p></div>
        <div class="header-search-bottom"><span>AYURÉLLE ORGANICS</span><a href="shop.html">Browse the full collection <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
      </div>`;
    header.appendChild(shell);
    const input = shell.querySelector('[data-global-search-input]');
    const results = shell.querySelector('[data-global-search-results]');
    const close = () => {
      shell.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open product search');
      toggle.classList.remove('is-active');
    };
    const renderResults = term => {
      const list = window.AYURELLE_CATALOGUE && window.AYURELLE_CATALOGUE.list || [];
      const query = String(term || '').trim().toLowerCase();
      if (!query) {
        results.innerHTML = `<p class="search-prompt"><span class="search-prompt-mark"><i class="fa-solid fa-sparkles" aria-hidden="true"></i></span><span><strong>Find your next favourite</strong><small>Try “hair oil”, “conditioner” or “care set”.</small></span></p>`;
        return;
      }
      const found = list.filter(product => [product.name, product.category, product.short, ...(product.highlights || [])].join(' ').toLowerCase().includes(query)).slice(0, 6);
      if (!found.length) {
        results.innerHTML = `<div class="search-no-results"><span><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></span><strong>No matches just yet</strong><small>Try a different product name.</small></div>`;
        return;
      }
      results.innerHTML = `<p class="search-results-label">${found.length} ${found.length === 1 ? 'MATCH' : 'MATCHES'} FOR “${escapeHTML(term)}”</p>${found.map(product => `<a class="search-result" href="product.html?slug=${encodeURIComponent(product.slug)}"><span class="search-result-image"><img src="${escapeHTML(productImage(product))}" alt="" loading="lazy"></span><span class="search-result-copy"><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(product.short || product.category || 'Ayurélle Organics')}</small></span><span class="search-result-price">${money(productPrice(product))}<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span></a>`).join('')}`;
    };
    toggle.addEventListener('click', () => {
      const opening = !shell.classList.contains('is-open');
      document.querySelectorAll('[data-global-search].is-open').forEach(other => other.classList.remove('is-open'));
      shell.classList.toggle('is-open', opening);
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.setAttribute('aria-label', opening ? 'Close product search' : 'Open product search');
      toggle.classList.toggle('is-active', opening);
      if (opening) { input.value = ''; renderResults(''); window.setTimeout(() => input.focus(), 160); }
    });
    input.addEventListener('input', () => renderResults(input.value));
    shell.querySelector('[data-search-close]').addEventListener('click', close);
    document.addEventListener('pointerdown', event => {
      if (!shell.contains(event.target) && !toggle.contains(event.target)) close();
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    window.addEventListener('ayurelle:catalogue-ready', () => renderResults(input.value));
  }

  function setupScrollHeader(header) {
    if (!header) return;
    const isHome = document.body.dataset.page === 'home';
    header.classList.toggle('is-home-header', isHome);
    let previousY = Math.max(0, window.scrollY || 0);
    let ticking = false;
    const update = () => {
      const y = Math.max(0, window.scrollY || 0);
      const searchOpen = !!header.querySelector('[data-global-search].is-open');
      const menuOpen = !!document.querySelector('[data-mobile-nav].is-open');
      header.classList.toggle('is-transparent', isHome && y < 24);
      if (y < 20 || searchOpen || menuOpen) header.classList.remove('is-hidden');
      else if (y > previousY + 5 && y > 115) header.classList.add('is-hidden');
      else if (y < previousY - 3) header.classList.remove('is-hidden');
      if (!isHome) header.classList.remove('is-transparent');
      previousY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  function setupSummaryCollapse() {
    const toggle = document.querySelector('[data-summary-toggle]');
    const body = document.querySelector('[data-summary-body]');
    if (!toggle || !body) return;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(expanded));
      body.classList.toggle('is-collapsed', !expanded);
    });
    if (window.matchMedia('(max-width: 760px)').matches) {
      toggle.setAttribute('aria-expanded', 'false');
      body.classList.add('is-collapsed');
    }
  }

  function setupRemoteForms() {
    document.addEventListener('submit', async event => {
      const newsletter = event.target.closest('[data-newsletter-form]');
      const contact = event.target.closest('[data-contact-form]');
      if (!newsletter && !contact) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const form = event.target;
      const submit = form.querySelector('button[type="submit"]');
      const original = submit ? submit.innerHTML : '';
      const message = form.querySelector('[data-newsletter-message], [data-contact-feedback]');
      const data = new FormData(form);
      const payload = newsletter
        ? { email: form.querySelector('input[type="email"]')?.value.trim() || data.get('email') }
        : { name: data.get('name'), email: data.get('email'), topic: data.get('topic'), message: data.get('message') };
      const endpoint = newsletter ? '/.netlify/functions/newsletter' : '/.netlify/functions/contact';
      if (submit) { submit.disabled = true; submit.classList.add('is-loading'); submit.setAttribute('aria-busy', 'true'); submit.dataset.previousLabel = original; submit.innerHTML = '<span class="button-spinner" aria-hidden="true"></span><span>Sending</span>'; }
      if (message) message.textContent = 'Sending securely…';
      try {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'We could not send that just now. Please try again.');
        if (message) message.textContent = result.message || (newsletter ? 'You are on the list. Please check your inbox.' : 'Your message has been sent. We will be in touch soon.');
        form.reset();
      } catch (error) {
        if (message) message.textContent = `${error.message || 'Unable to send right now.'} You can also reach us at ayurelleorganics@yahoo.com.`;
      } finally {
        if (submit) { submit.disabled = false; submit.classList.remove('is-loading'); submit.removeAttribute('aria-busy'); submit.innerHTML = original; }
      }
    }, true);
  }

  function setupAccessibleImages() {
    document.querySelectorAll('.social-links a, .contact-socials a').forEach(anchor => {
      if (!anchor.getAttribute('aria-label')) anchor.setAttribute('aria-label', anchor.title || anchor.textContent.trim() || 'Open social link');
    });
  }

  function initialise() {
    const header = document.getElementById('siteHeader');
    setupHeaderSearch(header);
    setupScrollHeader(header);
    setupSummaryCollapse();
    setupRemoteForms();
    setupAccessibleImages();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
