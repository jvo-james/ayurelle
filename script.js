/* Ayurélle Organics storefront interactions. This is a front-end demo, not a live payment system. */
(function () {
  'use strict';

  const images = window.AYURELLE_IMAGES || {};
  const CART_KEY = 'ayurelle-organics-cart-v1';
  const WHATSAPP_NUMBER = '233547446264';

  const products = [
    {
      id: 'conditioner', name: 'Hydrating & Detangling Conditioner', shortName: 'Hydrating & Detangling Conditioner',
      category: 'cleanse', categoryLabel: 'Cleanse & condition', size: '250 ml', price: 85,
      subtitle: 'Slip, softness and lightweight moisture', image: 'productConditioner', tag: 'Brand essential',
      description: 'A rinse-out conditioning step for a smoother, more manageable wash day. Made to complement a thoughtful routine with a focus on detangling and lightweight moisture.',
      usage: 'After shampooing, apply through damp hair, concentrating on the mid-lengths and ends. Detangle gently, leave for the time stated on your final product label then rinse thoroughly. Avoid eye contact.',
      ingredients: 'Add the final verified ingredient list from the product label before launch. The flyer references Aqua, Cetyl Alcohol, Butyrospermum Parkii (Shea Butter), Cetrimonium Chloride, Cocos Nucifera (Coconut) Oil, Glycerin, aromatic herb extracts, essential oils and Sodium Benzoate. Confirm the full INCI list and spelling with the manufacturer.'
    },
    {
      id: 'botanical-oil', name: 'Botanical Scalp Oil', shortName: 'Botanical Scalp Oil',
      category: 'oil', categoryLabel: 'Scalp & hair oils', size: '100 ml', price: 95,
      subtitle: 'A considered moment for your roots', image: 'productOil', tag: 'Root ritual',
      description: 'A botanical-inspired oil step for scalp massage and hair-care rituals. Use with a gentle touch and tailor the amount to your routine and the feel of your hair.',
      usage: 'Part the hair as needed and apply a small amount to the scalp or hair as directed on your final product label. Massage gently. Patch test before first use and discontinue if irritation occurs.',
      ingredients: 'Replace this note with the complete, verified ingredient list supplied by Ayurélle Organics before launch.'
    },
    {
      id: 'whipped-butter', name: 'Whipped Shea Hair Butter', shortName: 'Whipped Shea Hair Butter',
      category: 'butter', categoryLabel: 'Butters & moisture', size: '200 g', price: 90,
      subtitle: 'Rich, comforting moisture for your lengths', image: 'productButter', tag: 'Moisture care',
      description: 'A rich butter for hair-care routines that call for a little extra softness. Smooth a small amount through the lengths as part of your styling or moisture-sealing ritual.',
      usage: 'Begin with a small amount and warm between your palms. Smooth through damp or dry hair according to your final product directions. Adjust the amount to your hair texture and preferred finish.',
      ingredients: 'Replace this note with the complete, verified ingredient list supplied by Ayurélle Organics before launch.'
    },
    {
      id: 'gentle-cleanser', name: 'Gentle Botanical Cleanser', shortName: 'Gentle Botanical Cleanser',
      category: 'cleanse', categoryLabel: 'Cleanse & condition', size: '250 ml', price: 80,
      subtitle: 'A fresh start for your wash-day ritual', image: 'productCleanser', tag: 'Wash-day essential',
      description: 'A cleansing step for a considered wash-day routine. Work slowly, rinse thoroughly and follow with the conditioning care that suits your hair.',
      usage: 'Wet hair thoroughly. Apply and massage gently into the scalp. Rinse well and repeat only if needed, following the final product label. Avoid contact with eyes.',
      ingredients: 'Replace this note with the complete, verified ingredient list supplied by Ayurélle Organics before launch.'
    },
    {
      id: 'root-ritual-oil', name: 'Root Ritual Infused Oil', shortName: 'Root Ritual Infused Oil',
      category: 'oil', categoryLabel: 'Scalp & hair oils', size: '100 ml', price: 105,
      subtitle: 'A slower, more intentional scalp ritual', image: 'productMoisture', tag: 'Ritual favourite',
      description: 'An oil step designed to make scalp care feel intentional. Add it to your routine in a way that feels comfortable for your scalp and hair.',
      usage: 'Use sparingly, following the final product directions. Massage gently without scratching. Patch test before first use and stop use if irritation occurs.',
      ingredients: 'Replace this note with the complete, verified ingredient list supplied by Ayurélle Organics before launch.'
    },
    {
      id: 'ritual-set', name: 'The Moisture Ritual Set', shortName: 'The Moisture Ritual Set',
      category: 'bundle', categoryLabel: 'Ritual sets', size: 'Curated set', price: 155,
      subtitle: 'A thoughtful pairing for your routine', image: 'productBundle', tag: 'Curated set',
      description: 'A curated pairing for a more considered wash day. The final contents should be confirmed by Ayurélle Organics before this set is offered for sale.',
      usage: 'Use each item according to its individual label and directions. Adjust the order of your routine to suit the products included in the final set.',
      ingredients: 'See the verified ingredient lists for each product included in the final set.'
    }
  ];

  const money = (amount) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', minimumFractionDigits: 2 }).format(amount).replace('GHS', 'GH₵');
  const getProduct = (id) => products.find((item) => item.id === id) || products[0];

  function getCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter((item) => getProduct(item.id) && Number(item.qty) > 0).map((item) => ({ id: item.id, qty: Math.max(1, Math.min(20, Number(item.qty) || 1)), size: item.size || getProduct(item.id).size })) : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (error) { /* Local storage may be unavailable in restricted browsers. */ }
    updateCartCount();
  }

  function cartQuantity(cart = getCart()) { return cart.reduce((sum, item) => sum + item.qty, 0); }
  function cartSubtotal(cart = getCart()) { return cart.reduce((sum, item) => sum + getProduct(item.id).price * item.qty, 0); }

  function updateCartCount() {
    const count = cartQuantity();
    document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = count > 99 ? '99+' : String(count); });
  }

  function showToast(message) {
    let toast = document.querySelector('.site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'site-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="fa-solid fa-check"></i><span></span><a href="cart.html">View bag</a>';
    toast.querySelector('span').textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove('visible'), 3500);
  }

  function addToCart(id, quantity = 1, size) {
    const product = getProduct(id);
    const cart = getCart();
    const actualSize = size || product.size;
    const existing = cart.find((item) => item.id === id && item.size === actualSize);
    if (existing) existing.qty = Math.min(20, existing.qty + quantity);
    else cart.push({ id, qty: Math.max(1, Math.min(20, quantity)), size: actualSize });
    saveCart(cart);
    showToast(product.shortName + ' added to your bag.');
  }

  function setImageSources() {
    document.querySelectorAll('[data-image]').forEach((img) => {
      const key = img.getAttribute('data-image');
      if (images[key]) img.src = images[key];
      if (!img.alt) img.alt = 'Ayurélle Organics botanical hair care';
    });
  }

  function productCard(product) {
    const badge = product.tag ? `<span class="product-tag">${product.tag}</span>` : '';
    return `<article class="product-card">
      <a class="product-card-image" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${product.name}">
        <img src="${images[product.image] || ''}" alt="${product.name}" loading="lazy">${badge}
        <span class="quick-add" role="button" tabindex="0" data-quick-add="${product.id}"><i class="fa-solid fa-plus"></i> Quick add</span>
      </a>
      <div class="product-card-info">
        <div class="product-card-meta"><span class="product-card-category">${product.categoryLabel}</span><span class="product-card-rating"><i class="fa-solid fa-leaf"></i> <span>Thoughtfully made</span></span></div>
        <h3><a href="product.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3>
        <p class="product-card-subtitle">${product.subtitle}</p>
        <div class="product-price-row"><span class="product-price">${money(product.price)}</span><span class="product-price-old">${product.size}</span></div>
      </div>
    </article>`;
  }

  function renderProductCards(target, list) {
    if (!target) return;
    target.innerHTML = list.map(productCard).join('');
  }

  function initHome() {
    renderProductCards(document.querySelector('[data-featured-products]'), products.slice(0, 4));
  }

  function initShop() {
    const grid = document.querySelector('[data-shop-products]');
    if (!grid) return;
    const search = document.querySelector('#shopSearch');
    const sort = document.querySelector('#sortProducts');
    const categoryBoxes = [...document.querySelectorAll('[data-category-filter]')];
    const stockBoxes = [...document.querySelectorAll('[data-stock-filter]')];
    const count = document.querySelector('[data-product-count]');
    const initialCategory = new URLSearchParams(window.location.search).get('category');
    if (initialCategory) {
      const matched = categoryBoxes.find((box) => box.value === initialCategory);
      if (matched) matched.checked = true;
    }

    function filterAndRender() {
      const term = (search?.value || '').trim().toLowerCase();
      const selectedCategories = categoryBoxes.filter((box) => box.checked).map((box) => box.value);
      let list = products.filter((product) => {
        const matchesSearch = !term || [product.name, product.categoryLabel, product.subtitle, product.description].join(' ').toLowerCase().includes(term);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        return matchesSearch && matchesCategory;
      });
      if (sort?.value === 'price-low') list.sort((a, b) => a.price - b.price);
      if (sort?.value === 'price-high') list.sort((a, b) => b.price - a.price);
      if (sort?.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
      count.textContent = String(list.length);
      if (!list.length) {
        grid.innerHTML = '<div class="empty-results"><i class="fa-solid fa-seedling"></i><h3>No rituals found just yet.</h3><p>Try a different search or clear your filters to see the collection.</p><button class="button button-outline" type="button" data-clear-from-empty>Clear filters</button></div>';
      } else renderProductCards(grid, list);
    }
    search?.addEventListener('input', filterAndRender);
    sort?.addEventListener('change', filterAndRender);
    [...categoryBoxes, ...stockBoxes].forEach((box) => box.addEventListener('change', filterAndRender));
    document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
      categoryBoxes.forEach((box) => { box.checked = false; }); stockBoxes.forEach((box) => { box.checked = false; });
      if (search) search.value = ''; if (sort) sort.value = 'featured'; filterAndRender();
    });
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-clear-from-empty]')) {
        categoryBoxes.forEach((box) => { box.checked = false; }); if (search) search.value = ''; filterAndRender();
      }
    });
    document.querySelectorAll('.filter-title').forEach((button) => {
      button.addEventListener('click', () => {
        const block = button.closest('.filter-block');
        const expanded = block.classList.toggle('expanded');
        button.setAttribute('aria-expanded', String(expanded));
        const icon = button.querySelector('i'); if (icon) { icon.classList.toggle('fa-plus', !expanded); icon.classList.toggle('fa-minus', expanded); }
      });
    });
    filterAndRender();
  }

  function initProduct() {
    const mainImage = document.querySelector('[data-product-main-image]');
    if (!mainImage) return;
    const params = new URLSearchParams(window.location.search);
    const product = getProduct(params.get('id'));
    document.title = product.name + ' | Ayurélle Organics';
    mainImage.src = images[product.image] || '';
    mainImage.alt = product.name + ' product photography';
    const setText = (selector, value) => { const el = document.querySelector(selector); if (el) el.textContent = value; };
    setText('[data-product-title]', product.name);
    setText('[data-product-breadcrumb]', product.shortName);
    setText('[data-product-category]', product.categoryLabel);
    setText('[data-product-price]', money(product.price));
    setText('[data-product-description]', product.description);
    setText('[data-product-size-label]', product.size);
    setText('[data-product-code]', String(products.indexOf(product) + 1).padStart(2, '0'));
    setText('[data-how-to-use]', product.usage);
    setText('[data-product-ingredients]', product.ingredients);
    const variants = document.querySelector('[data-product-variants]');
    if (variants) variants.innerHTML = `<span class="variant-pill active">${product.size}</span>`;
    const whatsapp = document.querySelector('[data-product-whatsapp]');
    if (whatsapp) whatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Ayurélle Organics, I have a question about ' + product.name + '.')}`;
    document.querySelector('[data-add-detail]')?.addEventListener('click', () => {
      const qty = Math.max(1, Math.min(20, Number(document.querySelector('[data-product-qty]')?.value) || 1));
      addToCart(product.id, qty, product.size);
    });
    document.querySelector('[data-qty-minus]')?.addEventListener('click', () => {
      const input = document.querySelector('[data-product-qty]'); input.value = Math.max(1, (Number(input.value) || 1) - 1);
    });
    document.querySelector('[data-qty-plus]')?.addEventListener('click', () => {
      const input = document.querySelector('[data-product-qty]'); input.value = Math.min(20, (Number(input.value) || 1) + 1);
    });
    renderProductCards(document.querySelector('[data-related-products]'), products.filter((item) => item.id !== product.id).slice(0, 4));
  }

  function renderEmptyCart(target) {
    target.innerHTML = `<div class="empty-cart"><i class="fa-solid fa-bag-shopping"></i><h2>Your bag is taking a breather.</h2><p>There is nothing in your bag yet. Explore the collection and find a ritual to make your own.</p><a class="button button-dark" href="shop.html">Explore the collection <i class="fa-solid fa-arrow-right"></i></a></div>`;
  }

  function cartItemMarkup(item) {
    const product = getProduct(item.id);
    return `<article class="cart-item" data-cart-item="${product.id}">
      <a href="product.html?id=${product.id}"><img class="cart-item-image" src="${images[product.image] || ''}" alt="${product.name}" loading="lazy"></a>
      <div><span class="cart-item-category">${product.categoryLabel}</span><h2 class="cart-item-title"><a href="product.html?id=${product.id}">${product.name}</a></h2><div class="cart-item-size">${item.size || product.size}</div>
      <div class="cart-item-controls"><div class="quantity-control"><button type="button" data-cart-decrease="${product.id}" aria-label="Decrease ${product.name} quantity"><i class="fa-solid fa-minus"></i></button><input type="number" min="1" max="20" value="${item.qty}" data-cart-quantity="${product.id}" aria-label="${product.name} quantity"><button type="button" data-cart-increase="${product.id}" aria-label="Increase ${product.name} quantity"><i class="fa-solid fa-plus"></i></button></div><button type="button" class="remove-item" data-cart-remove="${product.id}">Remove</button></div></div>
      <div class="cart-item-price">${money(product.price * item.qty)}</div>
    </article>`;
  }

  function summaryMarkup(withCheckout = true) {
    const subtotal = cartSubtotal();
    return `<aside class="cart-summary"><h2>Order summary</h2><div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-row"><span>Delivery</span><span>Confirmed separately</span></div><div class="summary-row summary-total"><span>Estimated total</span><strong>${money(subtotal)}</strong></div>${withCheckout ? '<a class="button button-dark" href="checkout.html">Continue to checkout <i class="fa-solid fa-arrow-right"></i></a>' : ''}<p class="summary-fineprint">Delivery charges will be confirmed before payment. This preview does not collect payment.</p><a class="text-link" style="margin-top:18px" href="shop.html">Continue shopping <i class="fa-solid fa-arrow-right"></i></a></aside>`;
  }

  function renderCart() {
    const target = document.querySelector('[data-cart-content]');
    if (!target) return;
    const cart = getCart();
    if (!cart.length) { renderEmptyCart(target); return; }
    target.innerHTML = `<div class="cart-layout"><div class="cart-items">${cart.map(cartItemMarkup).join('')}</div>${summaryMarkup(true)}</div>`;
  }

  function updateCartItem(id, nextQty) {
    let cart = getCart();
    if (nextQty <= 0) cart = cart.filter((item) => item.id !== id);
    else {
      const item = cart.find((entry) => entry.id === id);
      if (item) item.qty = Math.max(1, Math.min(20, nextQty));
    }
    saveCart(cart);
    renderCart();
  }

  function initCheckout() {
    const form = document.querySelector('[data-checkout-form]');
    if (!form) return;
    const cart = getCart();
    const itemsTarget = document.querySelector('[data-checkout-items]');
    if (itemsTarget) {
      if (!cart.length) itemsTarget.innerHTML = '<p style="font-size:11px;color:#778071">Your bag is empty. <a href="shop.html" style="text-decoration:underline">Browse the collection</a>.</p>';
      else itemsTarget.innerHTML = cart.map((item) => {
        const product = getProduct(item.id);
        return `<div class="checkout-line"><img src="${images[product.image] || ''}" alt="${product.name}"><div><strong>${product.name}</strong><span>${item.size} · Qty ${item.qty}</span></div><b>${money(product.price * item.qty)}</b></div>`;
      }).join('');
    }
    const subtotal = cartSubtotal(cart);
    const sub = document.querySelector('[data-checkout-subtotal]'); if (sub) sub.textContent = money(subtotal);
    const total = document.querySelector('[data-checkout-total]'); if (total) total.textContent = money(subtotal);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const currentCart = getCart();
      if (!currentCart.length) {
        const status = document.querySelector('[data-checkout-status]');
        status.textContent = 'Your bag is empty. Please add a product before continuing.'; status.classList.add('show'); return;
      }
      const data = new FormData(form);
      const lines = currentCart.map((item) => {
        const p = getProduct(item.id);
        return `• ${p.name} (${item.size}) x ${item.qty}: ${money(p.price * item.qty)}`;
      });
      const message = [
        'Hello Ayurélle Organics, I would like to confirm this order:', '', ...lines, '',
        `Estimated subtotal: ${money(cartSubtotal(currentCart))}`,
        'Delivery: please confirm the delivery fee and availability.', '',
        `Name: ${data.get('name')}`,
        `Phone: ${data.get('phone')}`,
        `Email: ${data.get('email') || 'Not provided'}`,
        `Delivery preference: ${data.get('delivery')}`,
        `Address or area: ${data.get('address')}`,
        `Order notes: ${data.get('notes') || 'None'}`, '',
        'I understand that the final total and payment method will be confirmed by the team.'
      ].join('\n');
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      const opened = window.open(url, '_blank');
      if (opened) opened.opener = null;
      const status = document.querySelector('[data-checkout-status]');
      status.innerHTML = opened ? 'Your order summary has been prepared for WhatsApp. Send the message there to confirm stock, delivery and payment.' : 'Your order details are ready. If WhatsApp did not open, use the WhatsApp link in the page footer and share your order details.';
      status.classList.add('show');
    });
  }

  function initNewsletter() {
    const form = document.querySelector('[data-newsletter-form]');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = document.querySelector('[data-newsletter-message]');
      message.textContent = 'Thank you for your interest. Connect an email marketing service before launch to collect subscriptions.';
      const input = form.querySelector('input'); if (input) input.value = '';
    });
  }

  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = `[Ayurélle website] ${data.get('subject') || 'Website enquiry'}`;
      const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nTopic: ${data.get('subject')}\n\n${data.get('message')}`;
      const link = `mailto:ayurelleorganics@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const status = document.querySelector('[data-contact-message]');
      status.textContent = 'Your email draft is ready. If your email app did not open, write to ayurelleorganics@yahoo.com.';
      status.classList.add('show');
      window.location.href = link;
    });
  }

  function initInteractions() {
    const menuButton = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    menuButton?.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      menuButton.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      document.body.classList.toggle('menu-open', isOpen);
    });
    window.addEventListener('scroll', () => {
      document.querySelector('#siteHeader')?.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    document.addEventListener('click', (event) => {
      const quick = event.target.closest('[data-quick-add]');
      if (quick) {
        event.preventDefault(); event.stopPropagation();
        addToCart(quick.getAttribute('data-quick-add'), 1);
        return;
      }
      const remove = event.target.closest('[data-cart-remove]');
      if (remove) { updateCartItem(remove.getAttribute('data-cart-remove'), 0); return; }
      const decrease = event.target.closest('[data-cart-decrease]');
      if (decrease) {
        const id = decrease.getAttribute('data-cart-decrease'); const item = getCart().find((entry) => entry.id === id);
        if (item) updateCartItem(id, Math.max(1, item.qty - 1)); return;
      }
      const increase = event.target.closest('[data-cart-increase]');
      if (increase) {
        const id = increase.getAttribute('data-cart-increase'); const item = getCart().find((entry) => entry.id === id);
        if (item) updateCartItem(id, item.qty + 1); return;
      }
      const accordion = event.target.closest('.accordion-trigger');
      if (accordion) {
        const isOpen = accordion.getAttribute('aria-expanded') === 'true';
        accordion.setAttribute('aria-expanded', String(!isOpen));
        const content = accordion.nextElementSibling;
        content?.classList.toggle('open', !isOpen);
      }
    });

    document.addEventListener('keydown', (event) => {
      const quick = event.target.closest('[data-quick-add]');
      if (quick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault(); addToCart(quick.getAttribute('data-quick-add'), 1);
      }
    });
  }

  function init() {
    setImageSources();
    updateCartCount();
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
    const page = document.body.getAttribute('data-page');
    initInteractions();
    if (page === 'home') { initHome(); initNewsletter(); }
    if (page === 'shop') initShop();
    if (page === 'product') initProduct();
    if (page === 'cart') renderCart();
    if (page === 'checkout') initCheckout();
    if (page === 'contact') initContactForm();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
