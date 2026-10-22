(() => {
  'use strict';

  const IMAGES = window.AYURELLE_IMAGES || {};
  const BUSINESS_PHONE = '233547446264';
  const CART_KEY = 'ayurelle-organics-cart-v2';
  const CATEGORY_LABELS = {
    sets: 'Complete Care Sets',
    hair: 'Hair Care Products',
    mens: "Men's Care",
    tools: 'Tools and Accessories'
  };

  // Product data is kept in one editable catalogue; ingredients remain blank until entered by the store owner.
  const PRODUCTS = [
    {
      slug: 'full-hair-growth-set', name: 'Full Hair Growth Set', category: 'sets', price: 500, size: '9-piece set', badge: 'Complete care set',
      short: 'A complete collection for cleansing, conditioning, moisture and scalp care.',
      description: 'The Full Hair Growth Set brings nine Ayurèlle essentials together in one coordinated collection. It includes wash-day staples, a protein mask, oil, butter, herbal hair tea and a scalp mist, giving you a practical starting point for a consistent hair-care routine.',
      ingredients: '',
      directions: "Use each item in the set according to its own product directions. On wash day, cleanse first, then choose the conditioner or treatment best suited to your routine. Apply leave-in products and styling moisturisers in small amounts as directed.",
      sizeDetail: 'A coordinated nine-piece routine with full-size essentials.',
      texture: 'Cleansing, conditioning and leave-in essentials', scent: 'Product scent varies by item in the set',
      highlights: ['Nine coordinated hair-care essentials', 'Includes cleansing and conditioning steps', 'Oil and butter for moisture-focused styling', 'Includes hair tea and scalp mist'],
      caution: "Read the directions and cautions for every item in the set. For external use only unless a product label clearly states otherwise. Avoid eye contact and stop using any item that causes irritation.",
      contains: [
        { slug: 'ayur-shampoo' }, { slug: 'ayur-deep-conditioner' }, { slug: 'ayur-rinse-out-conditioner' },
        { slug: 'ayur-leave-in-conditioner' }, { slug: 'ayur-silk-protein-mask' }, { slug: 'ayur-hair-growth-oil' },
        { slug: 'ayur-hair-growth-butter' }, { slug: 'ayur-hair-tea' }, { slug: 'ayur-scalp-detox-mist' }
      ]
    },
    {
      slug: 'deluxe-set', name: 'Deluxe Set', category: 'sets', price: 350, size: '6-piece set', badge: 'Complete care set',
      short: 'Six core products for a more complete wash-day and between-wash routine.',
      description: 'The Deluxe Set pairs six everyday essentials across cleansing, conditioning and moisture. It is a balanced collection for customers who want a few more care steps together without choosing each product separately.',
      ingredients: '',
      directions: "Use each item according to its own product directions. Cleanse first, then use the deep conditioner or other conditioning step as directed. Finish with leave-in products in small amounts, following each label.",
      sizeDetail: 'A six-piece collection for a complete routine.',
      texture: 'Cleansing, conditioning and moisturising essentials', scent: 'Product scent varies by item in the set',
      highlights: ['Six products for a layered routine', 'Includes a deep conditioning step', 'Includes oil and butter for styling', 'Hair tea completes the collection'],
      caution: "Read the directions and cautions for every item in the set. Avoid eye contact and stop using any item that causes irritation.",
      contains: [
        { slug: 'ayur-shampoo' }, { slug: 'ayur-deep-conditioner' }, { slug: 'ayur-leave-in-conditioner' },
        { slug: 'ayur-hair-growth-oil' }, { slug: 'ayur-hair-growth-butter' }, { slug: 'ayur-hair-tea' }
      ]
    },
    {
      slug: 'starter-set', name: 'Starter Set', category: 'sets', price: 200, size: '6-piece set', badge: 'Complete care set',
      short: 'A practical introduction to cleansing, conditioning and everyday moisture.',
      description: 'The Starter Set brings six essentials together for customers building a straightforward hair-care routine. It includes shampoo, rinse-out conditioner, leave-in conditioner, oil, butter and a hair mist for a practical collection of wash-day and styling staples.',
      ingredients: '',
      directions: "Use each item according to its own product directions. Start with shampoo and rinse-out conditioner, then use leave-in products in small amounts. Follow the instructions printed on the individual labels.",
      sizeDetail: 'A six-piece collection for a complete routine.',
      texture: 'Cleansing, conditioning and lightweight leave-in essentials', scent: 'Product scent varies by item in the set',
      highlights: ['Six core care products', 'Includes rinse-out and leave-in conditioner', 'Oil and butter for styling support', 'Includes a mist for use between wash days'],
      caution: "Read the directions and cautions for every item in the set. Avoid eye contact and stop using any item that causes irritation.",
      contains: [
        { slug: 'ayur-shampoo' }, { slug: 'ayur-rinse-out-conditioner' }, { slug: 'ayur-leave-in-conditioner' },
        { slug: 'ayur-hair-growth-oil' }, { slug: 'ayur-hair-growth-butter' }, { slug: 'ayur-scalp-detox-mist', label: 'Rosemary Water Spray' }
      ]
    },
    {
      slug: 'ayur-shampoo', name: 'Ayur Shampoo', category: 'hair', price: 50, size: '250 ml', badge: '',
      short: 'A cleansing shampoo for a fresh-feeling scalp and clean, manageable hair.',
      description: 'A refreshing wash-day cleanser that helps remove everyday buildup and leaves hair feeling clean and ready for conditioning.',
      ingredients: '',
      directions: "Wet hair and scalp thoroughly. Apply a small amount and massage gently with fingertips, without scratching. Rinse completely and repeat only if needed. Follow with a rinse-out conditioner.",
      sizeDetail: '250 ml', texture: 'Liquid cleanser', scent: 'As labelled',
      highlights: ['A wash-day cleansing step', 'A liquid texture that spreads easily', 'Pairs with conditioner after washing'],
      caution: "For external use only. Avoid contact with eyes. Rinse thoroughly with clean water if contact occurs. Stop use if irritation develops.",
    },
    {
      slug: 'ayur-deep-conditioner', name: 'Ayur Deep Conditioner', category: 'hair', price: 65, size: '250 ml', badge: '',
      short: 'A richer conditioning treatment for soft feel and easier detangling.',
      description: 'A rich rinse-off treatment for wash days when hair needs an extra conditioning step. Work it through the lengths and ends for a softer, more manageable feel.',
      ingredients: '',
      directions: "After shampooing, apply to clean, damp hair, concentrating on the lengths and ends. Leave on only for the duration stated on the product label, then rinse thoroughly.",
      sizeDetail: '250 ml', texture: 'Rich conditioning cream', scent: 'As labelled',
      highlights: ['Richer texture for a treatment step', 'Designed to support slip and manageability', 'Useful alongside a gentle detangling technique'],
      caution: "For external use only. Avoid contact with eyes. Rinse thoroughly if contact occurs and stop use if irritation develops.",
    },
    {
      slug: 'ayur-rinse-out-conditioner', name: 'Ayur Rinse-Out Conditioner', category: 'hair', price: 60, size: '250 ml', badge: '',
      short: 'A daily conditioning step for softer-feeling strands and easier detangling.',
      description: 'A creamy rinse-out conditioner for the step after cleansing, helping hair feel softer and easier to detangle.',
      ingredients: '',
      directions: "After shampooing, smooth through damp hair, concentrating on the lengths and ends. Detangle gently with fingers or a wide-tooth comb, then rinse thoroughly.",
      sizeDetail: '250 ml', texture: 'Creamy rinse-out conditioner', scent: 'As labelled',
      highlights: ['A simple follow-up to shampoo', 'Designed to support detangling and softness', 'Rinses out after use'],
      caution: "For external use only. Avoid contact with eyes. This is a rinse-out product, so do not leave it in the hair unless the final label expressly says to do so.",
    },
    {
      slug: 'ayur-leave-in-conditioner', name: 'Ayur Leave-In Conditioner', category: 'hair', price: 55, size: '250 ml', badge: '',
      short: 'Lightweight leave-in conditioning for smoother-feeling hair between wash days.',
      description: 'A leave-in conditioner for the styling step after washing. Apply a small amount through clean, damp lengths and ends, then style as usual.',
      ingredients: '',
      directions: "Apply a small amount to clean, damp hair. Smooth evenly through the lengths and ends, adding more only if needed. Do not rinse out. Follow any additional directions on the product label.",
      sizeDetail: '250 ml', texture: 'Light conditioning cream', scent: 'As labelled',
      highlights: ['Leave-in step for styling and upkeep', 'Use a small amount and distribute evenly', 'Can sit alongside rinse-out conditioning'],
      caution: "For external use only. Avoid contact with eyes. Start with a small amount and stop use if irritation develops. Do not use as a skin treatment.",
    },
    {
      slug: 'ayur-silk-protein-mask', name: 'Prodiva Protein Mask', category: 'hair', price: 70, size: '250 ml', badge: '',
      short: 'A 250 ml protein mask for an intensive conditioning step on wash day.',
      description: 'A protein mask for a more intensive conditioning step in your wash-day routine. Follow the directions on the product label and rinse thoroughly.',
      ingredients: '',
      directions: "After cleansing, apply to damp hair and distribute through the lengths and ends. Leave on for the time stated on the final product label, then rinse thoroughly.",
      sizeDetail: '250 ml', texture: 'Conditioning mask', scent: 'As labelled',
      highlights: ['Protein-mask treatment for wash day', 'A conditioning step for hair lengths', 'Follow the directions on the packaging'],
      caution: "For external use only. Avoid contact with eyes. Use only as directed on the final label and stop use if irritation develops.",
    },
    {
      slug: 'ayur-hair-growth-oil', name: 'Ayur Hair Growth Oil', category: 'hair', price: 75, size: '100 ml', badge: '',
      short: 'Herbal-infused hair growth oil for scalp massage and finishing your routine.',
      description: 'Herbal-infused hair growth oil in a 100 ml bottle, made for scalp massage and finishing your hair-care routine. Apply a small amount and adjust to your hair’s needs.',
      ingredients: '',
      directions: "Apply a small amount to the scalp or hair lengths as appropriate for the product label. Massage gently if applying to the scalp and smooth sparingly over the lengths and ends. Avoid applying more than needed.",
      sizeDetail: '100 ml', texture: 'Oil blend', scent: 'As labelled',

      highlights: ['Botanical oil blend', 'Use sparingly on the scalp or hair lengths', 'Available in a 100 ml bottle'],
      caution: "For external use only. Avoid contact with eyes and do not swallow. If you have a sensitive scalp, test a small area first. Stop use if redness, itching or irritation develops. The product name is not a guarantee of hair growth.",
    },
    {
      slug: 'ayur-hair-growth-butter', name: 'Ayur Hair Growth Butter', category: 'hair', price: 50, size: '250 ml', badge: '',
      short: 'A rich 250 ml hair butter for moisture-focused styling and finishing.',
      description: 'A rich hair butter in a 250 ml jar, made for moisture-focused styling. Warm a little between your palms and smooth through lengths and ends as needed.',
      ingredients: '',
      directions: "Warm a small amount between the palms and smooth through the lengths and ends of dry or slightly damp hair. Begin with a little product and add more only if needed.",
      sizeDetail: '250 ml', texture: 'Rich butter', scent: 'As labelled',

      highlights: ['Rich emollient texture', 'Designed for use on lengths and ends', 'Available in a 250 ml jar'],
      caution: "For external use only. Avoid contact with eyes. Stop use if irritation develops and keep the container closed when not in use.",
    },
    {
      slug: 'ayur-hair-tea', name: 'Ayur Hair Tea', category: 'hair', price: 50, size: '200 g', badge: '',
      short: 'A botanical blend designed for a hair-care rinse or infusion routine.',
      description: 'A herbal hair tea for use as part of your hair-care routine. Prepare and apply only as directed on the product label; this product is not presented as a drink.',
      ingredients: '',
      directions: "Prepare the blend according to the product packaging. Allow the infusion to cool completely and strain it before applying to hair or scalp as directed. If storing a prepared infusion, follow the package storage instructions and discard it after the stated storage period or sooner if its appearance or smell changes. This is a hair-care product, not a drink.",
      sizeDetail: '200 g botanical blend', texture: 'Botanical blend', scent: 'Herbal',
      highlights: ['Botanical blend', 'Complements a wash-day routine', 'Follow the package preparation instructions'],
      caution: "For external use only. Do not consume. Allow the infusion to cool completely before application and avoid contact with eyes. Stop use if irritation develops.",
    },
    {
      slug: 'ayur-scalp-detox-mist', name: 'Rosemary Water Spray', category: 'hair', price: 25, size: '100 ml', badge: '',
      short: 'A 100 ml rosemary water spray for a light, refreshing step in your hair-care routine.',
      description: 'A fine rosemary water spray for use on hair and as part of a refreshing care routine. Apply sparingly and keep away from the eyes.',
      ingredients: '',
      directions: "Use on the intended hair or scalp area in accordance with the final product label. Apply a light amount and keep the spray away from the eyes and face.",
      sizeDetail: '100 ml', texture: 'Fine mist', scent: 'As labelled',
      highlights: ['Fine-mist format', 'Designed for between-wash use', 'Can be placed in a simple daily care routine'],
      caution: "For external use only. Avoid inhaling the mist and keep away from eyes. Stop use if irritation develops. Store closed and away from excessive heat.",
    },
    {
      slug: 'ayur-beard-serum', name: 'Ayur Beard Serum', category: 'mens', price: 60, size: '30 ml', badge: '',
      short: 'A conditioning oil blend for a softer-feeling beard and neat finish.',
      description: 'A lightweight beard serum that helps soften the feel of facial hair and makes everyday grooming simple.',
      ingredients: '',
      directions: "Place two or three drops in the palm, rub hands together and smooth through a clean, dry or slightly damp beard. Start with less for short beards. Follow the final label for frequency of use.",
      sizeDetail: '30 ml', texture: 'Light oil serum', scent: 'As labelled',
      highlights: ['Made for beard grooming', 'Apply a small amount and distribute evenly', 'A lightweight oil format'],
      caution: "For external use only. Avoid the eyes, mouth and broken skin. Test a small area first if your skin is sensitive and stop use if irritation develops.",
    },
    {
      slug: 'derma-roller', name: 'Derma Roller', category: 'tools', price: 70, size: '1 tool', badge: '',
      short: 'A personal grooming tool for a considered at-home routine.',
      description: 'A personal-care derma roller. Follow the manufacturer’s hygiene and use instructions carefully and do not use on irritated or broken skin.',
      ingredients: '',
      directions: "Use only in line with the instructions supplied for this exact tool. If clear instructions are not included, contact the seller or manufacturer before use. Do not roll over the scalp or skin unless the manufacturer confirms the intended area and method.",
      sizeDetail: '1 tool', texture: 'Personal-care tool', scent: 'Not applicable',
      highlights: ['Personal-use grooming accessory', 'Use according to the manufacturer’s instructions', 'Use according to the manufacturer’s hygiene guidance'],
      caution: "This tool is not a treatment for hair loss. Do not use on irritated, infected, inflamed or broken skin. Never share it. Do not use a damaged tool or one with bent needles. Home devices that puncture skin can cause infection or scarring; seek advice from a qualified healthcare professional before any skin-penetrating use.",
    },
    {
      slug: 'satin-bonnet', name: 'Satin Bonnet', category: 'tools', price: 40, size: 'One size', badge: '',
      short: 'A satin-style hair covering for bedtime and protective styling.',
      description: 'A satin bonnet designed to help keep hair covered and in place while you rest or style. Choose your preferred colour and follow the care guidance for the fabric.',
      ingredients: '',
      directions: "Gather hair gently and place the bonnet over it without pulling or tightening the hairline. Adjust for a comfortable fit. Clean and dry the bonnet according to the fabric care guidance supplied with the item.",
      sizeDetail: 'One size', texture: 'Satin-style fabric', scent: 'Not applicable',
      colorOptions: true,
      highlights: ['For bedtime and selected protective styles', 'Available in black, red, purple and pink', 'Red is the initial storefront colour'],
      caution: "Stop wearing it if the band causes pressure or discomfort. Keep fabric away from open flames and follow any care instructions supplied with the item.",
    },
    {
      slug: 'steaming-cap', name: 'Steaming Cap for Deep Conditioning', category: 'tools', price: 50, size: 'One size', badge: '',
      short: 'A cap accessory for a deep-conditioning step at home.',
      description: 'A reusable steaming-cap accessory to pair with a deep-conditioning routine. Use only according to the instructions supplied with the cap.',
      ingredients: '',
      directions: "Apply a hair treatment according to that treatment label. With the cap unplugged, place it over the hair and use only the settings and duration stated in the instruction leaflet supplied with this exact cap. Switch off and unplug before removing or storing it, then allow it to cool fully.",
      sizeDetail: 'One size', texture: 'Cap accessory', scent: 'Not applicable',
      colorOptions: true,
      highlights: ['Accessory for a conditioning step', 'Available in pink and red', 'Pink is the initial storefront colour'],
      caution: "Electrical heat accessory: confirm the supplied instructions, correct voltage and use duration before first use. Keep the controller, plug and cord dry. Do not use near water, while asleep or unattended. Never use if the cap, cable or plug is damaged. Stop immediately if it becomes uncomfortably hot.",
    },
    {
      slug: 'spray-bottle', name: 'Spray Bottle', category: 'tools', price: 30, size: '300 ml', badge: '',
      short: 'A refillable spray bottle for controlled water or product application.',
      description: 'A refillable spray bottle for applying water or suitable hair-care liquids during styling and wash-day preparation.',
      ingredients: '',
      directions: "Fill with water or a liquid confirmed as compatible with the bottle. Secure the nozzle, test the spray away from the face and label the contents clearly. Empty and rinse the bottle between different products.",
      sizeDetail: '300 ml', texture: 'Refillable accessory', scent: 'Not applicable',
      highlights: ['Refillable format', 'Useful for controlled misting', 'Refillable design for everyday styling'],
      caution: "Do not fill with hot liquids, solvents or incompatible chemicals. Never use an unlabelled bottle for food or drink. Keep away from children and avoid spraying toward the eyes.",
    }
  ];

  const bySlug = new Map(PRODUCTS.map(product => [product.slug, product]));
  const featuredSlugs = ['full-hair-growth-set', 'ayur-hair-growth-oil', 'ayur-shampoo', 'satin-bonnet'];
  let currentProduct = null;
  let currentQty = 1;
  let currentSizeVariant = null;
  let currentColor = null;
  let activeDrawerProduct = null;
  let drawerSelections = {};
  let selectedCategory = 'all';
  let searchTerm = '';
  let sortMode = 'featured';
  let toastTimeout = null;
  let currentGalleryIndex = 0;
  let currentGalleryImages = [];

  const currency = value => `GH₵${Number(value || 0).toFixed(2)}`;
  const imageFor = (slug, color) => {
    const variantSet = IMAGES.variants && IMAGES.variants[slug];
    if (variantSet) {
      const chosenColor = color || variantSet.default;
      if (variantSet.colors && variantSet.colors[chosenColor]) return variantSet.colors[chosenColor].image;
    }
    return (IMAGES.products && IMAGES.products[slug]) || IMAGES.detailAccent || IMAGES.brandStory || '';
  };
  const defaultColorFor = slug => (IMAGES.variants && IMAGES.variants[slug] && IMAGES.variants[slug].default) || null;
  const sizeVariantsFor = product => Array.isArray(product?.variants) ? product.variants.filter(variant => variant && String(variant.id || '').trim() && String(variant.label || '').trim() && Number.isFinite(Number(variant.price)) && Number(variant.price) >= 0) : [];
  const hasSizeVariants = product => sizeVariantsFor(product).length > 0;
  const defaultSizeFor = product => sizeVariantsFor(product)[0] || null;
  const basePriceFor = product => { const price = Number(product?.price); return Number.isFinite(price) && price >= 0 ? price : 0; };
  const minPriceFor = product => { const prices = sizeVariantsFor(product).map(variant => Number(variant.price)); return prices.length ? Math.min(...prices) : basePriceFor(product); };
  const maxPriceFor = product => { const prices = sizeVariantsFor(product).map(variant => Number(variant.price)); return prices.length ? Math.max(...prices) : basePriceFor(product); };
  const cardPrice = product => hasSizeVariants(product) ? `From ${currency(minPriceFor(product))}` : currency(basePriceFor(product));
  const cardSize = product => {
    if (hasSizeVariants(product)) return sizeVariantsFor(product).map(variant => variant.label).reverse().join(' and ');
    if (product.colorOptions) return product.slug === 'satin-bonnet' ? 'Four colours' : 'Two colours';
    return product.size || product.sizeDetail || '';
  };
  const categoryLabel = product => CATEGORY_LABELS[product.category] || 'Ayurèlle Organics';
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const productHref = slug => `/products/${encodeURIComponent(slug)}`;

  function applyBrandImages() {
    document.querySelectorAll('[data-image]').forEach(img => {
      const key = img.dataset.image;
      const url = IMAGES[key];
      if (url && img.getAttribute('src') !== url) img.setAttribute('src', url);
    });
    document.querySelectorAll('[data-background]').forEach(element => {
      const url = IMAGES[element.dataset.background];
      if (url) element.style.backgroundImage = `url("${url}")`;
    });
    document.querySelectorAll('[data-category-image]').forEach(img => {
      const url = IMAGES.categories && IMAGES.categories[img.dataset.categoryImage];
      if (url) img.src = url;
    });
    const logo = IMAGES.logoMark || 'images/ayurelle-mark.svg';
    const icon = document.querySelector('[data-brand-favicon]');
    const apple = document.querySelector('[data-brand-apple-icon]');
    const ogImage = document.querySelector('[data-brand-og-image]');
    const twitterImage = document.querySelector('[data-brand-twitter-image]');
    const absoluteLogo = /^(https?:)?\/\//i.test(logo) ? logo : new URL(logo, window.location.href).href;
    if (icon) icon.href = logo;
    if (apple) apple.href = logo;
    if (ogImage) ogImage.content = absoluteLogo;
    if (twitterImage) twitterImage.content = absoluteLogo;
  }

  function getCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (error) { /* Storage may be unavailable in private browsing. */ }
    updateCartCount();
  }

  function cartItemKey(item) { return `${item.slug}::${item.variantId || ''}::${item.color || ''}`; }
  function cartSubtotal(cart = getCart()) { return cart.reduce((total, item) => total + (Number(item.price) * Number(item.qty)), 0); }

  function updateCartCount() {
    const count = getCart().reduce((total, item) => total + Number(item.qty || 0), 0);
    document.querySelectorAll('[data-cart-count]').forEach(node => { node.textContent = count > 99 ? '99+' : String(count); });
  }

  function showToast(message) {
    const region = document.querySelector('[data-toast-region]');
    if (!region) return;
    if (toastTimeout) window.clearTimeout(toastTimeout);
    region.innerHTML = `<div class="toast-message">${escapeHtml(message)}</div>`;
    toastTimeout = window.setTimeout(() => { region.innerHTML = ''; }, 3200);
  }

  function addToCart(slug, qty = 1, variant = {}) {
    const product = bySlug.get(slug);
    if (!product) return;
    const sizeVariant = variant.sizeVariant || defaultSizeFor(product);
    const color = variant.color || defaultColorFor(slug);
    const item = {
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: sizeVariant ? sizeVariant.price : product.price,
      qty: Math.max(1, Number(qty) || 1),
      size: sizeVariant ? sizeVariant.label : product.size,
      variantId: sizeVariant ? sizeVariant.id : '',
      color: color || '',
      colorLabel: color && IMAGES.variants && IMAGES.variants[slug] && IMAGES.variants[slug].colors[color] ? IMAGES.variants[slug].colors[color].label : '',
      image: imageFor(slug, color)
    };
    const cart = getCart();
    const key = cartItemKey(item);
    const existing = cart.find(entry => cartItemKey(entry) === key);
    if (existing) existing.qty += item.qty;
    else cart.push(item);
    saveCart(cart);
    showToast(`${product.name} added to your bag.`);
  }

  function renderSwatches(product, source = 'card', selected = null) {
    const variantSet = IMAGES.variants && IMAGES.variants[product.slug];
    if (!product.colorOptions || !variantSet) return '';
    const defaultColor = selected || defaultColorFor(product.slug);
    const colors = Object.entries(variantSet.colors || {});
    const buttons = colors.map(([key, color]) => {
      const active = key === defaultColor ? ' is-selected' : '';
      if (source === 'detail' || source === 'drawer') {
        return `<button type="button" class="option-color${active}" data-${source}-color="${escapeHtml(key)}" data-product-slug="${escapeHtml(product.slug)}" aria-pressed="${key === defaultColor}" aria-label="Choose ${escapeHtml(color.label)} colour"><span class="color-swatch" style="--swatch-color:${escapeHtml(color.swatch)}"></span><span>${escapeHtml(color.label)}</span></button>`;
      }
      return `<button type="button" class="color-swatch${active}" style="--swatch-color:${escapeHtml(color.swatch)}" data-card-color="${escapeHtml(key)}" data-product-slug="${escapeHtml(product.slug)}" aria-label="View ${escapeHtml(color.label)} ${escapeHtml(product.name)}" aria-pressed="${key === defaultColor}"><span>${escapeHtml(color.label)}</span></button>`;
    }).join('');
    return source === 'card' ? `<div class="product-swatches" role="group" aria-label="Available colours">${buttons}</div>` : `<div class="option-block"><div class="option-heading"><span>Colour</span><span data-${source}-color-label>${escapeHtml((variantSet.colors[defaultColor] || {}).label || '')}</span></div><div class="option-swatch-row" role="group" aria-label="Choose a colour">${buttons}</div></div>`;
  }

  function renderProductCard(product) {
    const defaultColor = defaultColorFor(product.slug);
    const cardImage = imageFor(product.slug, defaultColor);
    const priceText = cardPrice(product);
    const sizeText = cardSize(product);
    return `<article class="product-card" data-product-card data-product-slug="${escapeHtml(product.slug)}">
      <a class="product-card-media" href="${productHref(product.slug)}" aria-label="View ${escapeHtml(product.name)}">
        <img src="${escapeHtml(cardImage)}" data-card-image alt="${escapeHtml(product.name)}" loading="lazy">
        <span class="product-card-open" aria-hidden="true"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
      </a>
      <div class="product-card-copy">
        <div class="product-card-topline">${hasSizeVariants(product) ? `<span>${escapeHtml(sizeText)}</span>` : ''}</div>
        <a class="product-card-title" href="${productHref(product.slug)}">${escapeHtml(product.name)}</a>
        <p class="product-card-description">${escapeHtml(product.short)}</p>
        <div class="product-card-price-line"><span>${escapeHtml(priceText)}</span>${!hasSizeVariants(product) && !product.colorOptions ? `<small>${escapeHtml(product.size || product.sizeDetail || '')}</small>` : ''}</div>
        <div class="product-card-bottom">${renderSwatches(product, 'card', defaultColor)}<a class="product-view-link" href="${productHref(product.slug)}">View details <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
      </div>
    </article>`;
  }

  function renderGrid(container, items) {
    if (!container) return;
    container.innerHTML = items.map(renderProductCard).join('');
  }

  function initialiseHome() {
    const featured = document.querySelector('[data-featured-products]');
    if (featured) renderGrid(featured, featuredSlugs.map(slug => bySlug.get(slug)).filter(Boolean));
    document.querySelectorAll('[data-newsletter-form]').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        const message = form.querySelector('[data-newsletter-message]');
        if (message) message.textContent = 'Thank you for your interest. Connect a mailing service before collecting live signups.';
        form.reset();
      });
    });
  }

  function initialiseShop() {
    const grid = document.querySelector('[data-shop-grid]');
    if (!grid) return;
    const search = document.querySelector('[data-shop-search]');
    const sort = document.querySelector('[data-shop-sort]');
    const resultsCount = document.querySelector('[data-results-count]');
    const empty = document.querySelector('[data-shop-empty]');
    const filterHost = document.querySelector('[data-category-filters]');

    function renderCategoryFilters() {
      if (!filterHost) return;
      filterHost.innerHTML = `<button type="button" class="filter-chip" data-category="all">All products</button>${Object.entries(CATEGORY_LABELS).map(([slug, label]) => `<button type="button" class="filter-chip" data-category="${escapeHtml(slug)}">${escapeHtml(label)}</button>`).join('')}`;
    }

    function updateActiveFilter() {
      document.querySelectorAll('[data-category-filters] [data-category]').forEach(button => {
        const active = button.dataset.category === selectedCategory;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }

    function updateGrid() {
      let items = PRODUCTS.filter(product => selectedCategory === 'all' || product.category === selectedCategory);
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        items = items.filter(product => [product.name, product.short, product.description, categoryLabel(product)].join(' ').toLowerCase().includes(term));
      }
      if (sortMode === 'price-low') items.sort((a, b) => minPriceFor(a) - minPriceFor(b));
      if (sortMode === 'price-high') items.sort((a, b) => maxPriceFor(b) - maxPriceFor(a));
      if (sortMode === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
      if (sortMode === 'featured') items.sort((a, b) => PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b));
      renderGrid(grid, items);
      if (resultsCount) resultsCount.textContent = ''; 
      if (empty) empty.hidden = items.length > 0;
      grid.hidden = items.length === 0;
      updateActiveFilter();
      document.querySelectorAll('[data-category-count="all"]').forEach(node => node.remove());
    }

    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category');
    if (initialCategory && Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, initialCategory)) selectedCategory = initialCategory;
    const initialSearch = params.get('q');
    if (initialSearch) {
      searchTerm = initialSearch;
      if (search) search.value = initialSearch;
    }
    if (params.get('focus') === 'search' && search) window.setTimeout(() => search.focus(), 150);
    renderCategoryFilters();
    updateGrid();

    filterHost?.addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      selectedCategory = button.dataset.category;
      const url = new URL(window.location.href);
      if (selectedCategory === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', selectedCategory);
      history.replaceState({}, '', url);
      updateGrid();
    });
    if (search) search.addEventListener('input', () => { searchTerm = search.value; updateGrid(); });
    if (sort) sort.addEventListener('change', () => { sortMode = sort.value; updateGrid(); });
    document.querySelectorAll('[data-clear-filters]').forEach(button => button.addEventListener('click', () => {
      selectedCategory = 'all'; searchTerm = ''; sortMode = 'featured';
      if (search) search.value = '';
      if (sort) sort.value = 'featured';
      const url = new URL(window.location.href);
      url.searchParams.delete('category'); url.searchParams.delete('q');
      history.replaceState({}, '', url);
      updateGrid();
    }));
  }

  function chosenSize(product, id) {
    const variants = sizeVariantsFor(product);
    if (!variants.length) return null;
    return variants.find(variant => variant.id === id) || variants[0];
  }

  function renderOptions(product, source = 'detail', selectedSize = null, selectedColor = null) {
    const currentSize = selectedSize || defaultSizeFor(product);
    let html = '';
    const variants = sizeVariantsFor(product);
    if (variants.length) {
      html += `<div class="option-block"><label class="option-heading" for="${source}SizeSelect"><span>Size</span><span>Choose a size</span></label><select id="${source}SizeSelect" class="option-select" data-${source}-size data-product-slug="${escapeHtml(product.slug)}">${variants.map(variant => `<option value="${escapeHtml(variant.id)}" ${currentSize && currentSize.id === variant.id ? 'selected' : ''}>${escapeHtml(variant.label)} · ${currency(variant.price)}</option>`).join('')}</select></div>`;
    } else if (!product.colorOptions && product.size) {
      html += `<div class="option-block"><div class="option-heading"><span>Size or quantity</span><span>${escapeHtml(product.size)}</span></div></div>`;
    }
    if (product.colorOptions) html += renderSwatches(product, source, selectedColor || defaultColorFor(product.slug));
    return html;
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value || '';
  }

  function galleryFor(slug, color = null) {
    const variantSet = IMAGES.variants && IMAGES.variants[slug];
    const chosenColor = color || (variantSet && variantSet.default);
    const colorEntry = variantSet && variantSet.colors && variantSet.colors[chosenColor];
    const variantGallery = colorEntry && Array.isArray(colorEntry.gallery) ? colorEntry.gallery : null;
    const gallery = variantGallery || (IMAGES.galleries && IMAGES.galleries[slug]) || [];
    const fallback = imageFor(slug, color);
    return [...new Set([...(gallery || []), fallback].filter(Boolean))];
  }

  function renderProductGallery(slug, color = null, chosenIndex = 0) {
    const mainImage = document.querySelector('[data-detail-image]');
    const thumbnails = document.querySelector('[data-product-gallery]');
    if (!mainImage) return;
    currentGalleryImages = galleryFor(slug, color);
    currentGalleryIndex = Math.min(Math.max(0, chosenIndex), Math.max(0, currentGalleryImages.length - 1));
    mainImage.src = currentGalleryImages[currentGalleryIndex] || imageFor(slug, color);
    mainImage.alt = `${currentProduct ? currentProduct.name : 'Ayurèlle product'} product view ${currentGalleryIndex + 1}`;
    setText('[data-gallery-index]', `${currentGalleryIndex + 1} / ${Math.max(1, currentGalleryImages.length)}`);
    if (thumbnails) {
      thumbnails.innerHTML = currentGalleryImages.length > 1 ? currentGalleryImages.map((src, index) => `<button type="button" class="gallery-thumb${index === currentGalleryIndex ? ' is-active' : ''}" data-gallery-index-button="${index}" aria-label="View product image ${index + 1}" aria-pressed="${index === currentGalleryIndex}"><img src="${escapeHtml(src)}" alt="" loading="lazy"></button>`).join('') : '';
    }
  }

  function updateDetailPrice() {
    if (!currentProduct) return;
    const selectedVariant = chosenSize(currentProduct, currentSizeVariant);
    const price = selectedVariant ? selectedVariant.price : currentProduct.price;
    setText('[data-product-price]', currency(price));
    renderProductGallery(currentProduct.slug, currentColor || defaultColorFor(currentProduct.slug), currentGalleryIndex);
  }

  function renderSetContents(product) {
    const section = document.querySelector('[data-set-contents-section]');
    const grid = document.querySelector('[data-set-contents]');
    if (!section || !grid) return;
    if (!product.contains || !product.contains.length) {
      section.hidden = true;
      grid.innerHTML = '';
      return;
    }
    section.hidden = false;
    const countNode = document.querySelector('[data-set-count]');
    if (countNode) countNode.textContent = `${product.contains.length} products included`;
    grid.innerHTML = product.contains.map((entry, index) => {
      const item = bySlug.get(entry.slug);
      if (!item) return '';
      const label = entry.label || item.name;
      const size = hasSizeVariants(item) ? sizeVariantsFor(item).map(variant => variant.label).join(' / ') : item.size;
      return `<button type="button" class="set-item-card" data-open-product="${escapeHtml(item.slug)}" aria-label="View details for ${escapeHtml(label)}">
        <span class="set-item-image"><img src="${escapeHtml(imageFor(item.slug, defaultColorFor(item.slug)))}" alt="${escapeHtml(label)}" loading="lazy"></span>
        <span class="set-item-copy"><span class="set-item-number">ITEM ${index + 1}</span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(size || categoryLabel(item))} · ${escapeHtml(cardPrice(item))}</small></span>
        <span class="set-item-arrow"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>
      </button>`;
    }).join('');
  }

  function renderRelatedProducts(product) {
    const container = document.querySelector('[data-related-products]');
    if (!container) return;
    let related = PRODUCTS.filter(item => item.slug !== product.slug && item.category === product.category);
    if (product.category === 'sets' || related.length < 4) {
      const fallback = PRODUCTS.filter(item => item.slug !== product.slug && item.category !== product.category && !related.some(existing => existing.slug === item.slug));
      related = [...related, ...fallback];
    }
    renderGrid(container, related.slice(0, 4));
  }

  function initialiseProduct() {
    const detail = document.querySelector('[data-product-detail]');
    if (!detail) return;
    const params = new URLSearchParams(window.location.search);
    const pathProductSlug = window.location.pathname.match(/^\/products\/([^/]+)\/?$/)?.[1];
    let decodedPathSlug = '';
    try { decodedPathSlug = pathProductSlug ? decodeURIComponent(pathProductSlug) : ''; } catch { decodedPathSlug = ''; }
    const slug = params.get('slug') || decodedPathSlug || 'full-hair-growth-set';
    currentProduct = bySlug.get(slug) || bySlug.get('full-hair-growth-set');
    const backToTopLink = document.querySelector('.back-to-top');
    if (backToTopLink) { const topUrl = new URL(window.location.href); topUrl.hash = 'siteHeader'; backToTopLink.href = `${topUrl.pathname}${topUrl.search}${topUrl.hash}`; }
    currentSizeVariant = defaultSizeFor(currentProduct)?.id || null;
    currentColor = defaultColorFor(currentProduct.slug);
    currentQty = 1;

    renderProductGallery(currentProduct.slug, currentColor, 0);
    setText('[data-product-breadcrumb]', currentProduct.name);
    setText('[data-product-category]', '');
    const ingredientSection = document.querySelector('[data-ingredients-section]');
    if (ingredientSection) ingredientSection.hidden = !String(currentProduct.ingredients || '').trim();
    setText('[data-product-title]', currentProduct.name);
    setText('[data-product-short]', currentProduct.short);
    setText('[data-product-description]', currentProduct.description);
    setText('[data-long-description]', currentProduct.description);
    setText('[data-product-ingredients]', currentProduct.ingredients || '');
    setText('[data-product-directions]', currentProduct.directions);
    setText('[data-product-caution]', currentProduct.caution);
    const directionsSection = document.querySelector('[data-directions-section]');
    const cautionSection = document.querySelector('[data-caution-section]');
    if (directionsSection) directionsSection.hidden = !String(currentProduct.directions || '').trim();
    if (cautionSection) cautionSection.hidden = !String(currentProduct.caution || '').trim();
    setText('[data-product-qty]', '1');
    setText('[data-gallery-index]', currentProduct.colorOptions ? `1 / ${Object.keys((IMAGES.variants[currentProduct.slug] || {}).colors || {}).length}` : '1 / 1');
    document.title = `${currentProduct.name} | Ayurèlle Organics`;
    const titleMeta = document.querySelector('meta[property="og:title"]');
    if (titleMeta) titleMeta.content = `${currentProduct.name} | Ayurèlle Organics`;
    const shortMeta = document.querySelector('meta[name="description"]');
    if (shortMeta) shortMeta.content = currentProduct.short;
    const detailOptions = document.querySelector('[data-product-options]');
    document.querySelector('[data-product-gallery]')?.addEventListener('click', event => {
      const thumb = event.target.closest('[data-gallery-index-button]');
      if (!thumb) return;
      renderProductGallery(currentProduct.slug, currentColor || defaultColorFor(currentProduct.slug), Number(thumb.dataset.galleryIndexButton));
    });
    if (detailOptions) detailOptions.innerHTML = renderOptions(currentProduct, 'detail', currentSizeVariant, currentColor);
    const highlights = document.querySelector('[data-product-highlights]');
    if (highlights) highlights.innerHTML = (currentProduct.highlights || []).map(item => `<div class="benefit-item"><i class="fa-solid fa-check" aria-hidden="true"></i><span>${escapeHtml(item)}</span></div>`).join('');
    const whatsapp = document.querySelector('[data-product-whatsapp]');
    if (whatsapp) {
      const message = encodeURIComponent(`Hello Ayurèlle Organics, I have a question about ${currentProduct.name}.`);
      whatsapp.href = `https://wa.me/${BUSINESS_PHONE}?text=${message}`;
    }
    updateDetailPrice();
    renderSetContents(currentProduct);
    renderRelatedProducts(currentProduct);

    document.querySelector('[data-detail-qty-minus]')?.addEventListener('click', () => {
      currentQty = Math.max(1, currentQty - 1);
      setText('[data-detail-qty]', String(currentQty));
    });
    document.querySelector('[data-detail-qty-plus]')?.addEventListener('click', () => {
      currentQty = Math.min(99, currentQty + 1);
      setText('[data-detail-qty]', String(currentQty));
    });
    document.querySelector('[data-add-detail]')?.addEventListener('click', () => {
      addToCart(currentProduct.slug, currentQty, { sizeVariant: chosenSize(currentProduct, currentSizeVariant), color: currentColor });
    });
    detailOptions?.addEventListener('change', event => {
      if (event.target.matches('[data-detail-size]')) {
        currentSizeVariant = event.target.value;
        updateDetailPrice();
      }
    });
    detailOptions?.addEventListener('pointerover', event => {
      const button = event.target.closest('[data-detail-color]');
      if (!button || !currentProduct) return;
      renderProductGallery(currentProduct.slug, button.dataset.detailColor, 0);
    });
    detailOptions?.addEventListener('pointerout', event => {
      const button = event.target.closest('[data-detail-color]');
      if (!button || button.contains(event.relatedTarget) || !currentProduct) return;
      renderProductGallery(currentProduct.slug, currentColor || defaultColorFor(currentProduct.slug), 0);
    });
    detailOptions?.addEventListener('click', event => {
      const button = event.target.closest('[data-detail-color]');
      if (!button) return;
      currentColor = button.dataset.detailColor;
      detailOptions.querySelectorAll('[data-detail-color]').forEach(swatch => {
        const active = swatch.dataset.detailColor === currentColor;
        swatch.classList.toggle('is-selected', active);
        swatch.setAttribute('aria-pressed', String(active));
      });
      const colorLabel = detailOptions.querySelector('[data-detail-color-label]');
      if (colorLabel && IMAGES.variants[currentProduct.slug].colors[currentColor]) colorLabel.textContent = IMAGES.variants[currentProduct.slug].colors[currentColor].label;
      updateDetailPrice();
      // Colour selection intentionally returns to the product image on long mobile pages.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function drawerContents(product, selection) {
    const sizeVariant = chosenSize(product, selection.sizeId);
    const color = selection.color || defaultColorFor(product.slug);
    const price = sizeVariant ? sizeVariant.price : product.price;
    const selectedName = color && IMAGES.variants && IMAGES.variants[product.slug] && IMAGES.variants[product.slug].colors[color] ? IMAGES.variants[product.slug].colors[color].label : '';
    return `<div class="drawer-product-image"><img src="${escapeHtml(imageFor(product.slug, color))}" alt="${escapeHtml(product.name)}"></div>
      <div class="drawer-product-copy"><p class="eyebrow"><span></span>${escapeHtml(categoryLabel(product).toUpperCase())}</p><h2 id="drawerTitle">${escapeHtml(product.name)}</h2><div class="drawer-product-price" data-drawer-price>${currency(price)}</div><p>${escapeHtml(product.description)}</p>
      <div class="drawer-facts"><div class="drawer-fact"><span>Size / quantity</span><strong>${escapeHtml(sizeVariant ? sizeVariant.label : product.size || 'See product details')}</strong></div><div class="drawer-fact"><span>${product.colorOptions ? 'Selected colour' : 'Product type'}</span><strong data-drawer-color-label>${escapeHtml(selectedName || (product.texture || 'Hair care'))}</strong></div></div>
      <div class="drawer-info-block"><h3>What it is</h3><p>${escapeHtml(product.short)} ${escapeHtml(product.sizeDetail || '')}</p></div>
      <div class="drawer-info-block"><h3>Key details</h3><ul>${(product.highlights || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
      ${String(product.ingredients || '').trim() ? `<div class="drawer-info-block"><h3>Ingredients</h3><p>${escapeHtml(product.ingredients)}</p></div>` : ''}
      <div class="drawer-info-block"><h3>How to use</h3><p>${escapeHtml(product.directions)}</p></div>
      <div class="drawer-info-block"><h3>Important notes</h3><p>${escapeHtml(product.caution || 'Confirm all product specifications with the owner before publishing.')}</p></div>
      <div class="drawer-options" data-drawer-options>${renderOptions(product, 'drawer', selection.sizeId, color)}</div>
      <div class="drawer-actions"><button type="button" class="button button-dark" data-drawer-add="${escapeHtml(product.slug)}"><span>Add separately</span><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i></button><a class="button button-outline" href="${productHref(product.slug)}">Full product page <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
      </div>`;
  }

  function openDrawer(slug) {
    const product = bySlug.get(slug);
    const drawer = document.querySelector('[data-product-drawer]');
    const scrim = document.querySelector('[data-drawer-scrim]');
    const content = document.querySelector('[data-drawer-content]');
    if (!product || !drawer || !scrim || !content) return;
    activeDrawerProduct = product;
    drawerSelections = { sizeId: defaultSizeFor(product)?.id || null, color: defaultColorFor(product.slug) };
    content.innerHTML = drawerContents(product, drawerSelections);
    scrim.hidden = false;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    requestAnimationFrame(() => scrim.classList.add('is-visible'));
    drawer.querySelector('[data-drawer-close]')?.focus();
  }

  function closeDrawer() {
    const drawer = document.querySelector('[data-product-drawer]');
    const scrim = document.querySelector('[data-drawer-scrim]');
    if (!drawer || !scrim) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('is-visible');
    document.body.classList.remove('drawer-open');
    window.setTimeout(() => { if (!drawer.classList.contains('is-open')) scrim.hidden = true; }, 300);
    activeDrawerProduct = null;
  }

  function refreshDrawerProduct() {
    if (!activeDrawerProduct) return;
    const content = document.querySelector('[data-drawer-content]');
    if (content) content.innerHTML = drawerContents(activeDrawerProduct, drawerSelections);
  }

  function initialiseDrawer() {
    document.addEventListener('pointerover', event => {
      const swatch = event.target.closest('[data-drawer-color]');
      if (!swatch || !activeDrawerProduct) return;
      const image = document.querySelector('[data-drawer-content] .drawer-product-image img');
      if (image) image.src = imageFor(activeDrawerProduct.slug, swatch.dataset.drawerColor);
    });
    document.addEventListener('pointerout', event => {
      const swatch = event.target.closest('[data-drawer-color]');
      if (!swatch || swatch.contains(event.relatedTarget) || !activeDrawerProduct) return;
      const image = document.querySelector('[data-drawer-content] .drawer-product-image img');
      if (image) image.src = imageFor(activeDrawerProduct.slug, drawerSelections.color || defaultColorFor(activeDrawerProduct.slug));
    });
    document.querySelector('[data-drawer-close]')?.addEventListener('click', closeDrawer);
    document.querySelector('[data-drawer-scrim]')?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.querySelector('[data-product-drawer].is-open')) closeDrawer();
    });
    document.addEventListener('click', event => {
      const setItem = event.target.closest('[data-open-product]');
      if (setItem) { event.preventDefault(); openDrawer(setItem.dataset.openProduct); return; }
      const drawerColor = event.target.closest('[data-drawer-color]');
      if (drawerColor && activeDrawerProduct) {
        drawerSelections.color = drawerColor.dataset.drawerColor;
        refreshDrawerProduct();
        return;
      }
      const addButton = event.target.closest('[data-drawer-add]');
      if (addButton && activeDrawerProduct) {
        const selectedSize = chosenSize(activeDrawerProduct, drawerSelections.sizeId);
        addToCart(activeDrawerProduct.slug, 1, { sizeVariant: selectedSize, color: drawerSelections.color });
        return;
      }
    });
    document.addEventListener('change', event => {
      if (event.target.matches('[data-drawer-size]') && activeDrawerProduct) {
        drawerSelections.sizeId = event.target.value;
        refreshDrawerProduct();
      }
    });
  }

  function renderCart() {
    const container = document.querySelector('[data-cart-items]');
    if (!container) return;
    const cart = getCart();
    const empty = document.querySelector('[data-cart-empty]');
    const listHeading = document.querySelector('.cart-list-heading');
    if (empty) empty.hidden = cart.length > 0;
    if (listHeading) listHeading.hidden = cart.length === 0;
    container.innerHTML = cart.map(item => {
      const product = bySlug.get(item.slug);
      const image = item.image || imageFor(item.slug, item.color);
      const variantText = [item.colorLabel || (item.color ? item.color : ''), item.size || ''].filter(Boolean).join(' / ');
      return `<article class="cart-item" data-cart-key="${escapeHtml(cartItemKey(item))}">
        <div class="cart-item-product"><a href="${productHref(item.slug)}" class="cart-item-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(item.name)}"></a><div class="cart-item-copy"><span class="cart-item-category">${escapeHtml(categoryLabel(product || item))}</span><a class="cart-item-title" href="${productHref(item.slug)}">${escapeHtml(item.name)}</a><p class="cart-item-variant">${escapeHtml(variantText || 'Standard option')}</p><span class="cart-item-price">${currency(item.price)} each</span><button type="button" class="cart-remove" data-cart-remove="${escapeHtml(cartItemKey(item))}">Remove</button></div></div>
        <div class="cart-qty" aria-label="Quantity for ${escapeHtml(item.name)}"><button type="button" data-cart-minus="${escapeHtml(cartItemKey(item))}" aria-label="Decrease quantity">−</button><output>${Number(item.qty)}</output><button type="button" data-cart-plus="${escapeHtml(cartItemKey(item))}" aria-label="Increase quantity">+</button></div>
        <div class="cart-item-total">${currency(Number(item.price) * Number(item.qty))}</div>
      </article>`;
    }).join('');
    const subtotal = cartSubtotal(cart);
    const processingFee = Math.round(subtotal * 0.0295 * 100) / 100;
    setText('[data-cart-subtotal]', currency(subtotal));
    setText('[data-cart-fee]', currency(processingFee));
    setText('[data-cart-total]', currency(subtotal + processingFee));
    document.querySelectorAll('[data-checkout-link]').forEach(link => { link.setAttribute('aria-disabled', String(cart.length === 0)); if (!cart.length) link.classList.add('is-disabled'); else link.classList.remove('is-disabled'); });
    container.querySelectorAll('[data-cart-minus]').forEach(button => button.addEventListener('click', () => updateCartQuantity(button.dataset.cartMinus, -1)));
    container.querySelectorAll('[data-cart-plus]').forEach(button => button.addEventListener('click', () => updateCartQuantity(button.dataset.cartPlus, 1)));
    container.querySelectorAll('[data-cart-remove]').forEach(button => button.addEventListener('click', () => {
      saveCart(getCart().filter(item => cartItemKey(item) !== button.dataset.cartRemove));
      renderCart(); showToast('Item removed from your bag.');
    }));
  }

  function updateCartQuantity(key, delta) {
    const cart = getCart();
    const item = cart.find(entry => cartItemKey(entry) === key);
    if (!item) return;
    item.qty = Math.min(99, Number(item.qty) + delta);
    const next = item.qty <= 0 ? cart.filter(entry => cartItemKey(entry) !== key) : cart;
    saveCart(next);
    renderCart();
  }

  function renderCheckout() {
    const itemsContainer = document.querySelector('[data-checkout-items]');
    if (!itemsContainer) return;
    const cart = getCart();
    itemsContainer.innerHTML = cart.map(item => {
      const text = [item.colorLabel || (item.color ? item.color : ''), item.size || ''].filter(Boolean).join(' / ');
      return `<div class="checkout-order-item"><img src="${escapeHtml(item.image || imageFor(item.slug, item.color))}" alt="" loading="lazy"><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(text || `${Number(item.qty)} item(s)`)} · Qty ${Number(item.qty)}</small></div><b>${currency(item.price * item.qty)}</b></div>`;
    }).join('') || '<p class="summary-note">Your bag is empty. Add products before preparing an order.</p>';
    const subtotal = cartSubtotal(cart);
    setText('[data-checkout-subtotal]', currency(subtotal));
    setText('[data-checkout-total]', currency(subtotal));
  }

  function initialiseCheckout() {
    const form = document.querySelector('[data-checkout-form]');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const cart = getCart();
      const feedback = document.querySelector('[data-checkout-feedback]');
      if (!cart.length) {
        if (feedback) feedback.textContent = 'Your bag is empty. Please add products before continuing.';
        return;
      }
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const delivery = String(formData.get('delivery') || '').trim();
      const address = String(formData.get('address') || '').trim();
      const notes = String(formData.get('notes') || '').trim();
      const lines = cart.map(item => {
        const options = [item.colorLabel || (item.color ? item.color : ''), item.size || ''].filter(Boolean).join(', ');
        return `- ${item.name}${options ? ` (${options})` : ''} x ${item.qty}: ${currency(item.price * item.qty)}`;
      });
      const message = [
        'Hello Ayurèlle Organics, I would like to confirm this order.',
        '', 'CUSTOMER DETAILS', `Name: ${name}`, `Phone: ${phone}`, email ? `Email: ${email}` : '',
        '', 'DELIVERY', `Preferred option: ${delivery}`, `Address or area: ${address}`, notes ? `Notes: ${notes}` : '',
        '', 'ORDER', ...lines, '', `Subtotal: ${currency(cartSubtotal(cart))}`,
        'Please confirm availability, delivery fee and payment instructions.'
      ].filter(Boolean).join('\n');
      if (feedback) feedback.textContent = 'Opening WhatsApp with your order details. Review the message and send it to confirm your request.';
      const url = `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  function initialiseContact() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const topic = String(data.get('topic') || '').trim();
      const message = String(data.get('message') || '').trim();
      const body = `Hello Ayurèlle Organics, my name is ${name}.\nEmail: ${email}\nEnquiry: ${topic}\n\n${message}`;
      const feedback = document.querySelector('[data-contact-feedback]');
      if (feedback) feedback.textContent = 'Opening WhatsApp. Review your message and send it to Ayurèlle.';
      window.open(`https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
    });
  }

  function initialiseHeader() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');
    const page = document.body.dataset.page;
    document.querySelectorAll('[data-nav]').forEach(link => {
      const key = link.dataset.nav;
      const isActive = key === page || (key === 'shop' && ['product', 'cart', 'checkout'].includes(page));
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (toggle && mobileNav) {
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
        mobileNav.classList.toggle('is-open', !isOpen);
        document.body.classList.toggle('menu-open', !isOpen);
      });
      mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
        mobileNav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      }));
      window.addEventListener('resize', () => {
        if (window.innerWidth > 760) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open navigation');
          mobileNav.classList.remove('is-open');
          document.body.classList.remove('menu-open');
        }
      });
    }
    document.querySelectorAll('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });
  }

  function initialiseCardColorInteractions() {
    document.addEventListener('pointerover', event => {
      const swatch = event.target.closest('[data-card-color]');
      if (!swatch) return;
      const card = swatch.closest('[data-product-card]');
      const product = bySlug.get(swatch.dataset.productSlug);
      const image = card && card.querySelector('[data-card-image]');
      if (product && image) image.src = imageFor(product.slug, swatch.dataset.cardColor);
    });
    document.addEventListener('pointerout', event => {
      const swatch = event.target.closest('[data-card-color]');
      if (!swatch || swatch.contains(event.relatedTarget)) return;
      const card = swatch.closest('[data-product-card]');
      const product = bySlug.get(swatch.dataset.productSlug);
      const image = card && card.querySelector('[data-card-image]');
      const chosen = card && card.querySelector('[data-card-color].is-selected');
      if (product && image) image.src = imageFor(product.slug, chosen ? chosen.dataset.cardColor : defaultColorFor(product.slug));
    });
    document.addEventListener('click', event => {
      const swatch = event.target.closest('[data-card-color]');
      if (!swatch) return;
      event.preventDefault();
      event.stopPropagation();
      const card = swatch.closest('[data-product-card]');
      const product = bySlug.get(swatch.dataset.productSlug);
      const image = card && card.querySelector('[data-card-image]');
      if (card) card.querySelectorAll('[data-card-color]').forEach(button => {
        const selected = button.dataset.cardColor === swatch.dataset.cardColor;
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      if (product && image) image.src = imageFor(product.slug, swatch.dataset.cardColor);
    });
  }

  function initialiseCartEvents() {
    document.querySelectorAll('[data-checkout-link]').forEach(link => link.addEventListener('click', event => {
      if (!getCart().length) { event.preventDefault(); showToast('Your bag is empty. Add a product before checkout.'); }
    }));
  }

  async function loadRemoteCatalogue() {
    try {
      const response = await fetch('/.netlify/functions/catalogue', { headers: { 'Accept': 'application/json' }, cache: 'default' });
      if (!response.ok) return;
      const payload = await response.json();
      if (!Array.isArray(payload.products)) return;
      const localBySlug = new Map(PRODUCTS.map(item => [item.slug, item]));
      const merged = payload.products.filter(item => item && item.slug && item.active !== false).map(remote => {
        const base = localBySlug.get(remote.slug) || {};
        const normalized = { ...base, ...remote };
        const remoteVariants = Array.isArray(normalized.variants) ? normalized.variants.filter(variant => variant && String(variant.id || '').trim() && String(variant.label || '').trim() && Number.isFinite(Number(variant.price)) && Number(variant.price) >= 0) : [];
        if (remoteVariants.length) normalized.variants = remoteVariants; else delete normalized.variants;
        normalized.price = Number.isFinite(Number(normalized.price)) && Number(normalized.price) >= 0 ? Number(normalized.price) : 0;
        normalized.size = String(normalized.size || normalized.sizeDetail || 'Standard size').trim();
        if (normalized.slug === 'ayur-hair-growth-oil') { delete normalized.variants; normalized.size = '100 ml'; normalized.sizeDetail = '100 ml'; }
        if (normalized.slug === 'ayur-hair-growth-butter') { delete normalized.variants; normalized.size = '250 ml'; normalized.sizeDetail = '250 ml'; }
        if (normalized.slug === 'ayur-silk-protein-mask') { delete normalized.variants; normalized.name = 'Prodiva Protein Mask'; normalized.size = '250 ml'; normalized.sizeDetail = '250 ml'; }
        if (normalized.slug === 'ayur-deep-conditioner') { normalized.size = '250 ml'; normalized.sizeDetail = '250 ml'; }
        if (normalized.slug === 'ayur-leave-in-conditioner') { normalized.size = '250 ml'; normalized.sizeDetail = '250 ml'; }
        if (normalized.slug === 'ayur-hair-tea') { normalized.size = '200 g'; normalized.sizeDetail = '200 g botanical blend'; }
        if (normalized.slug === 'ayur-scalp-detox-mist') normalized.name = 'Rosemary Water Spray';
                if (remote.useRepositoryImages) {
          if (base.slug && IMAGES.products && IMAGES.products[base.slug]) IMAGES.products[remote.slug] = IMAGES.products[base.slug];
        } else if (Array.isArray(remote.images) && remote.images.length) {
          IMAGES.products[remote.slug] = remote.images[0];
          IMAGES.galleries = IMAGES.galleries || {};
          IMAGES.galleries[remote.slug] = remote.images;
        } else if (remote.imageUrl) {
          IMAGES.products[remote.slug] = remote.imageUrl;
        }
        if (remote.imageVariants && remote.imageVariants.colors) {
          IMAGES.variants = IMAGES.variants || {};
          IMAGES.variants[remote.slug] = remote.imageVariants;
        }
        return normalized;
      });
      PRODUCTS.splice(0, PRODUCTS.length, ...merged);
      bySlug.clear();
      PRODUCTS.forEach(item => bySlug.set(item.slug, item));
      if (Array.isArray(payload.categories)) {
        Object.keys(CATEGORY_LABELS).forEach(slug => delete CATEGORY_LABELS[slug]);
        payload.categories.forEach(category => {
          if (category && category.slug && category.name) CATEGORY_LABELS[category.slug] = category.name;
        });
      }
    } catch (error) {
      // The local catalogue remains a fully usable fallback when Firebase is not configured.
    }
  }

  async function initialise() {
    await loadRemoteCatalogue();
    applyBrandImages();
    initialiseHeader();
    updateCartCount();
    initialiseHome();
    initialiseShop();
    initialiseProduct();
    initialiseDrawer();
    initialiseCartEvents();
    renderCart();
    renderCheckout();
    initialiseCheckout();
    initialiseContact();
    initialiseCardColorInteractions();
    window.dispatchEvent(new CustomEvent('ayurelle:catalogue-ready'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();

  // Expose a small read-only catalogue helper for later customisation and debugging.
  window.AYURELLE_CATALOGUE = { list: PRODUCTS, get: slug => bySlug.get(slug) || null, categories: CATEGORY_LABELS, currency };
})();
