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

  // Product descriptions and ingredients are editable draft copy. Confirm every detail with the owner before launch.
  const PRODUCTS = [
    {
      slug: 'full-hair-growth-set', name: 'Full Hair Growth Set', category: 'sets', price: 500, size: '9-piece set', badge: 'Complete care set',
      short: 'A complete collection for cleansing, conditioning, moisture and scalp care.',
      description: 'The Full Hair Growth Set brings nine Ayurélle essentials together in one coordinated collection. It includes wash-day staples, a protein mask, oil, butter, herbal hair tea and a scalp mist, giving you a practical starting point for a consistent hair-care routine.',
      ingredients: 'This set contains nine individual products with their own ingredient lists. Review each item separately before use. The sample formulas shown on this demo site are placeholders and must be replaced with verified package ingredients.',
      directions: 'Use each included product according to its own verified label. Follow the shampoo with the conditioner or treatment best suited to your routine. Use leave-in products and styling moisturisers as directed. Introduce new products one at a time if you prefer to observe how your hair responds.',
      sizeDetail: 'Nine full-size products. Individual size information should be confirmed with the owner.',
      texture: 'A mix of cleansing, conditioning and leave-in textures', scent: 'Confirm product scents from the final labels',
      highlights: ['Nine coordinated hair-care essentials', 'Includes cleansing and conditioning steps', 'Oil and butter for moisture-focused styling', 'Includes hair tea and scalp mist'],
      caution: 'Confirm all sizes, directions and ingredients before ordering. Discontinue use if irritation occurs.',
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
      ingredients: 'This set contains six individual products with separate ingredient lists. The sample formula text on this demo storefront is illustrative only. Check the final package ingredients for each product before use.',
      directions: 'Follow the directions printed on each individual product. Begin with shampoo then select either the deep conditioner or a regular conditioning step to suit your routine. Apply leave-in products, oil and butter as indicated on their final labels.',
      sizeDetail: 'Six products. Individual product sizes should be confirmed with the owner.',
      texture: 'A mix of cleansing, conditioning and moisturising textures', scent: 'Confirm product scents from the final labels',
      highlights: ['Six products for a layered routine', 'Includes a deep conditioning step', 'Includes oil and butter for styling', 'Hair tea completes the collection'],
      caution: 'Confirm all sizes, directions and ingredients before ordering. Discontinue use if irritation occurs.',
      contains: [
        { slug: 'ayur-shampoo' }, { slug: 'ayur-deep-conditioner' }, { slug: 'ayur-leave-in-conditioner' },
        { slug: 'ayur-hair-growth-oil' }, { slug: 'ayur-hair-growth-butter' }, { slug: 'ayur-hair-tea' }
      ]
    },
    {
      slug: 'starter-set', name: 'Starter Set', category: 'sets', price: 200, size: '6-piece set', badge: 'Complete care set',
      short: 'A practical introduction to cleansing, conditioning and everyday moisture.',
      description: 'The Starter Set brings six essentials together for customers building a straightforward hair-care routine. It includes shampoo, rinse-out conditioner, leave-in conditioner, oil, butter and a hair mist for a practical collection of wash-day and styling staples.',
      ingredients: 'This set contains six individual products with separate ingredient lists. Review the confirmed packaging for the full ingredient list of each included item. Sample formulas on this site are placeholders pending owner approval.',
      directions: 'Use each item in line with its final packaging directions. Start with cleansing and conditioning, then apply leave-in products and moisturisers as directed. The item referred to as Hair Mist in this set is represented by Ayur Scalp Detox Mist in the draft catalogue and should be confirmed with the owner.',
      sizeDetail: 'Six products. Individual product sizes should be confirmed with the owner.',
      texture: 'A mix of cleansing, conditioning and lightweight leave-in products', scent: 'Confirm product scents from the final labels',
      highlights: ['Six core care products', 'Includes rinse-out and leave-in conditioner', 'Oil and butter for styling support', 'Includes a mist for use between wash days'],
      caution: 'Confirm all sizes, directions and ingredients before ordering. Discontinue use if irritation occurs.',
      contains: [
        { slug: 'ayur-shampoo' }, { slug: 'ayur-rinse-out-conditioner' }, { slug: 'ayur-leave-in-conditioner' },
        { slug: 'ayur-hair-growth-oil' }, { slug: 'ayur-hair-growth-butter' }, { slug: 'ayur-scalp-detox-mist', label: 'Hair Mist' }
      ]
    },
    {
      slug: 'ayur-shampoo', name: 'Ayur Shampoo', category: 'hair', price: 50, size: '250 ml', badge: '',
      short: 'A cleansing shampoo for a fresh-feeling scalp and clean, manageable hair.',
      description: 'A straightforward cleansing step designed to lift everyday product residue and excess oil from the scalp. The sample formula is imagined with mild cleansing agents and conditioning support, for a comfortable wash-day starting point without making medical or hair-growth promises.',
      ingredients: 'Draft example: Aqua, Decyl Glucoside, Cocamidopropyl Betaine, Aloe Barbadensis Leaf Juice, Glycerin, Panthenol, Hydrolyzed Oat Protein, Citric Acid and Sodium Benzoate.',
      directions: 'Wet hair thoroughly. Apply a small amount to the scalp and massage gently with fingertips. Rinse well and repeat if needed according to the final product label. Follow with a conditioner suited to your hair.',
      sizeDetail: '250 ml', texture: 'Liquid cleanser', scent: 'To be confirmed',
      highlights: ['Designed for scalp-first cleansing', 'A liquid texture that spreads easily', 'Pairs with conditioner after washing'],
      caution: 'Avoid contact with eyes. Rinse well if contact occurs. Confirm the final formula and directions before launch.'
    },
    {
      slug: 'ayur-deep-conditioner', name: 'Ayur Deep Conditioner', category: 'hair', price: 65, size: '250 g', badge: '',
      short: 'A richer conditioning treatment for soft feel and easier detangling.',
      description: 'A richer rinse-off treatment for days when hair needs extra conditioning. The draft positioning focuses on softness, slip and manageability, making it suitable as a deeper conditioning step within a routine.',
      ingredients: 'Draft example: Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Butyrospermum Parkii (Shea) Butter, Glycerin, Aloe Barbadensis Leaf Juice, Panthenol, Cetyl Alcohol, Preservative and Citric Acid.',
      directions: 'After shampooing, distribute through clean damp hair, concentrating on lengths and ends. Detangle gently and leave on for the time stated on the final label. Rinse thoroughly.',
      sizeDetail: '250 g', texture: 'Rich conditioning cream', scent: 'To be confirmed',
      highlights: ['Richer texture for a treatment step', 'Designed to support slip and manageability', 'Useful alongside a gentle detangling technique'],
      caution: 'For external use only. Confirm the final formula, timing and directions before launch.'
    },
    {
      slug: 'ayur-rinse-out-conditioner', name: 'Ayur Rinse-Out Conditioner', category: 'hair', price: 60, size: '250 ml', badge: '',
      short: 'A daily conditioning step for softer-feeling strands and easier detangling.',
      description: 'A rinse-out conditioner for the step after cleansing. Its sample product profile emphasises slip and everyday manageability to help make detangling feel easier when used with patience and the right technique.',
      ingredients: 'Draft example: Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Cetyl Alcohol, Butyrospermum Parkii (Shea) Butter, Glycerin, Panthenol, Citric Acid and Sodium Benzoate.',
      directions: 'After shampooing, smooth through damp hair, focusing on the lengths and ends. Gently work through tangles with fingers or a wide-tooth comb, then rinse thoroughly.',
      sizeDetail: '250 ml', texture: 'Creamy rinse-out conditioner', scent: 'To be confirmed',
      highlights: ['A simple follow-up to shampoo', 'Designed to support detangling and softness', 'Rinses out after use'],
      caution: 'Avoid contact with eyes. Do not leave in unless the final label specifically instructs you to do so.'
    },
    {
      slug: 'ayur-leave-in-conditioner', name: 'Ayur Leave-In Conditioner', category: 'hair', price: 55, size: '200 ml', badge: '',
      short: 'Lightweight leave-in conditioning for smoother-feeling hair between wash days.',
      description: 'A leave-in conditioning step intended to make hair easier to handle during styling. The draft concept combines humectant and conditioning ingredients for a smooth feel without promising repair or a guaranteed result.',
      ingredients: 'Draft example: Aqua, Aloe Barbadensis Leaf Juice, Glycerin, Cetearyl Alcohol, Behentrimonium Methosulfate, Butyrospermum Parkii (Shea) Butter, Panthenol, Argania Spinosa Kernel Oil and Preservative.',
      directions: 'Apply a small amount to clean damp hair. Spread evenly through lengths and ends, adding only what is needed for your texture. Do not rinse out. Keep away from the scalp if the final formula is designed for lengths only.',
      sizeDetail: '200 ml', texture: 'Light conditioning cream', scent: 'To be confirmed',
      highlights: ['Leave-in step for styling and upkeep', 'Use a small amount and distribute evenly', 'Can sit alongside rinse-out conditioning'],
      caution: 'Not interchangeable with a rinse-out conditioner. Confirm the final directions and ingredient list before launch.'
    },
    {
      slug: 'ayur-silk-protein-mask', name: 'Ayur Silk Protein Mask', category: 'hair', price: 70, size: '200 g', badge: '',
      short: 'A focused conditioning mask with a protein-inspired formula concept.',
      description: 'A treatment mask positioned for a more intensive conditioning step. The sample concept uses hydrolyzed silk protein alongside emollient ingredients to support a smoother feel and manageable styling. Final performance depends on the actual formula.',
      ingredients: 'Draft example: Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Hydrolyzed Silk, Glycerin, Butyrospermum Parkii (Shea) Butter, Persea Gratissima (Avocado) Oil, Panthenol, Preservative and Citric Acid.',
      directions: 'Apply after cleansing to damp hair, distributing from mid-lengths through ends. Leave on for the time printed on the verified label, then rinse thoroughly. Follow the owner-approved frequency guidance.',
      sizeDetail: '200 g', texture: 'Dense conditioning mask', scent: 'To be confirmed',
      highlights: ['A treatment step for wash day', 'Protein-inspired conditioning concept', 'Pairs with a gentle detangling routine'],
      caution: 'Confirm the final formula and use frequency before launch. Stop use if irritation occurs.'
    },
    {
      slug: 'ayur-hair-growth-oil', name: 'Ayur Hair Growth Oil', category: 'hair', price: 75, size: '100 ml', badge: '',
      short: 'A botanical oil blend for scalp massage and moisture-focused styling.',
      description: 'A lightweight-to-medium botanical oil concept for scalp massage or for smoothing the hair as part of a routine. The name follows the client’s supplied catalogue. This product description does not promise that the oil will cause hair growth.',
      ingredients: 'Draft example: Ricinus Communis (Castor) Seed Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Helianthus Annuus (Sunflower) Seed Oil, Argania Spinosa Kernel Oil, Rosmarinus Officinalis (Rosemary) Leaf Extract and Tocopherol.',
      directions: 'Dispense a small amount into the palms or fingertips and apply where needed. Massage the scalp gently if that is part of your routine, or smooth a small amount over lengths and ends. Adjust quantity to avoid a heavy finish.',
      sizeDetail: 'Available in 100 ml and 50 ml sizes', texture: 'Oil blend', scent: 'To be confirmed',
      variants: [{ id: '100ml', label: '100 ml', price: 75 }, { id: '50ml', label: '50 ml', price: 40 }],
      highlights: ['Botanical oil blend concept', 'Can be used sparingly on scalp or lengths', 'Offered in two draft size options'],
      caution: 'Ingredient examples are not verified. Confirm the formula and patch-test guidance before publishing. Avoid unsupported hair-growth claims.'
    },
    {
      slug: 'ayur-hair-growth-butter', name: 'Ayur Hair Growth Butter', category: 'hair', price: 50, size: '200 g', badge: '',
      short: 'A richer butter for moisture-focused styling and finishing.',
      description: 'A rich hair butter concept for adding a soft, coated feel to lengths and ends. It is positioned as a styling moisturiser that can be used sparingly where hair feels dry or needs a richer finish.',
      ingredients: 'Draft example: Butyrospermum Parkii (Shea) Butter, Theobroma Cacao (Cocoa) Seed Butter, Cocos Nucifera (Coconut) Oil, Ricinus Communis (Castor) Seed Oil, Helianthus Annuus (Sunflower) Seed Oil and Tocopherol.',
      directions: 'Warm a small amount between the palms and smooth through dry or slightly damp lengths and ends. Start with less product and add only as needed. Adapt use to your hair texture and the final label instructions.',
      sizeDetail: 'Available in 200 g and 100 g sizes', texture: 'Rich butter', scent: 'To be confirmed',
      variants: [{ id: '200g', label: '200 g', price: 50 }, { id: '100g', label: '100 g', price: 25 }],
      highlights: ['Rich emollient texture', 'Designed for use on lengths and ends', 'Two draft size options'],
      caution: 'Ingredient examples are placeholders. Confirm formula, storage guidance and directions before publishing.'
    },
    {
      slug: 'ayur-hair-tea', name: 'Ayur Hair Tea', category: 'hair', price: 50, size: '100 g', badge: '',
      short: 'A botanical blend designed for a hair-care rinse or infusion routine.',
      description: 'A plant-inspired hair tea concept for customers who enjoy an herbal infusion as part of wash day. The exact format, preparation method and whether the product is intended for rinse-off use must be confirmed from the final product label.',
      ingredients: 'Draft example: Hibiscus Sabdariffa Flower, Rosmarinus Officinalis (Rosemary) Leaf, Urtica Dioica (Nettle) Leaf, Mentha Piperita (Peppermint) Leaf and Cymbopogon Citratus (Lemongrass).',
      directions: 'Prepare and use only according to the verified product directions. If intended as a hair rinse, allow any infusion to cool fully before use and rinse as instructed. Do not assume this cosmetic product is for drinking.',
      sizeDetail: '100 g botanical blend', texture: 'Dried botanical blend, subject to confirmation', scent: 'Herbal, subject to confirmation',
      highlights: ['Botanical blend concept', 'Designed to complement a wash-day routine', 'Preparation instructions must be confirmed'],
      caution: 'Confirm the exact ingredients and intended use before launch. Do not consume unless it is clearly labelled and approved as a food product.'
    },
    {
      slug: 'ayur-scalp-detox-mist', name: 'Ayur Scalp Detox Mist', category: 'hair', price: 25, size: '100 ml', badge: '',
      short: 'A refreshing mist concept for a light touch between wash days.',
      description: 'A lightweight scalp-mist concept intended to refresh the feel of the scalp between wash days. The draft copy keeps the focus on feel and routine support rather than promising detoxification or treatment of a scalp condition.',
      ingredients: 'Draft example: Aqua, Aloe Barbadensis Leaf Juice, Glycerin, Camellia Sinensis (Green Tea) Leaf Extract, Panthenol, Mentha Piperita Leaf Water, Preservative and Citric Acid.',
      directions: 'Shake if directed on the final label. Spray sparingly onto the intended areas from a comfortable distance and follow with a gentle fingertip massage only if suitable. Avoid contact with eyes and stop if irritation occurs.',
      sizeDetail: '100 ml', texture: 'Fine mist', scent: 'To be confirmed',
      highlights: ['Fine-mist format', 'Designed for between-wash use', 'Can be placed in a simple daily care routine'],
      caution: 'Confirm final ingredients, preservative system, application guidance and exact product name before launch.'
    },
    {
      slug: 'ayur-beard-serum', name: 'Ayur Beard Serum', category: 'mens', price: 60, size: '30 ml', badge: '',
      short: 'A conditioning oil blend for a softer-feeling beard and neat finish.',
      description: 'A beard-care serum concept designed to help facial hair feel conditioned and easier to groom. The light oil blend is intended for a small amount applied to the beard, with the final scent and finish confirmed by the owner.',
      ingredients: 'Draft example: Simmondsia Chinensis (Jojoba) Seed Oil, Vitis Vinifera (Grape) Seed Oil, Argania Spinosa Kernel Oil, Ricinus Communis (Castor) Seed Oil and Tocopherol.',
      directions: 'Apply two or three drops to the palm, rub hands together then work through a clean, dry or slightly damp beard. Use less for shorter beards. Keep away from eyes and broken skin.',
      sizeDetail: '30 ml', texture: 'Light oil serum', scent: 'To be confirmed',
      highlights: ['Made for beard grooming', 'Apply a small amount and distribute evenly', 'A lightweight oil format'],
      caution: 'Confirm the formula and fragrance details. Patch-test before first use and avoid contact with eyes.'
    },
    {
      slug: 'derma-roller', name: 'Derma Roller', category: 'tools', price: 70, size: '1 tool', badge: '',
      short: 'A personal grooming tool with specifications to be verified before sale.',
      description: 'A personal-care tool listed in the supplied catalogue. The needle length, materials, intended use and care instructions are placeholders until the exact model is confirmed. Avoid making claims about hair growth or clinical results.',
      ingredients: 'Not applicable. Confirm the exact materials and needle specifications from the manufacturer.',
      directions: 'Follow the manufacturer’s verified instructions only. Do not share the tool. Do not use on irritated, infected or broken skin. Confirm cleaning, storage and replacement guidance before use.',
      sizeDetail: '1 tool. Exact dimensions and needle specifications to be confirmed.', texture: 'Personal-care tool', scent: 'Not applicable',
      highlights: ['Personal-use grooming accessory', 'Exact model specifications need verification', 'Care and hygiene information should accompany the product'],
      caution: 'The exact device specification and safe-use instructions must be confirmed before launch. Do not present the product as a treatment or recommend use on a scalp condition.'
    },
    {
      slug: 'satin-bonnet', name: 'Satin Bonnet', category: 'tools', price: 40, size: 'One size', badge: '',
      short: 'A satin-style hair covering for bedtime and protective styling.',
      description: 'A satin bonnet for covering and holding hair in place during rest or selected styling routines. The smooth lining and elastic edge shown here are placeholders, so verify the fabric, fit and washing instructions for the exact product supplied.',
      ingredients: 'Not applicable. Confirm the fabric composition and trim materials from the supplier.',
      directions: 'Gather hair comfortably and position the bonnet without pulling the hairline. Adjust the band for a secure but comfortable fit. Follow the verified care instructions for washing and drying.',
      sizeDetail: 'One size, subject to fit confirmation', texture: 'Satin-style fabric, composition to be confirmed', scent: 'Not applicable',
      colorOptions: true,
      highlights: ['For bedtime and selected protective styles', 'Available in black, red, purple and pink', 'Red is the initial storefront colour'],
      caution: 'Confirm fibre content, band construction and care instructions before launch.'
    },
    {
      slug: 'steaming-cap', name: 'Steaming Cap for Deep Conditioning', category: 'tools', price: 50, size: 'One size', badge: '',
      short: 'A cap accessory for a deep-conditioning step at home.',
      description: 'A steaming-cap accessory intended to accompany a deep-conditioning step. The exact cap type, heating method, electrical details and use instructions need to be confirmed for the supplied model before the product is published.',
      ingredients: 'Not applicable. Confirm fabric, inner lining and any electrical components from the supplier.',
      directions: 'Use only in line with the instructions provided with the exact product. Do not use if the product or its wiring appears damaged. Do not leave a powered device unattended and allow it to cool fully before storage if the model generates heat.',
      sizeDetail: 'One size, subject to fit confirmation', texture: 'Cap accessory, construction to be confirmed', scent: 'Not applicable',
      colorOptions: true,
      highlights: ['Accessory for a conditioning step', 'Available in pink and red', 'Pink is the initial storefront colour'],
      caution: 'Confirm product construction, electrical specifications and manufacturer safety information before sale.'
    },
    {
      slug: 'spray-bottle', name: 'Spray Bottle', category: 'tools', price: 30, size: '300 ml', badge: '',
      short: 'A refillable spray bottle for controlled water or product application.',
      description: 'A refillable spray bottle for routine prep, misting or product dilution where the product label allows it. The listed capacity is a working placeholder and must be checked against the item in stock.',
      ingredients: 'Not applicable. Confirm bottle material, nozzle material and maximum fill capacity from the supplier.',
      directions: 'Fill only with liquids suitable for the bottle and nozzle. Label contents clearly and rinse the bottle as needed. Do not mix products unless their instructions confirm they are compatible.',
      sizeDetail: '300 ml placeholder capacity', texture: 'Refillable accessory', scent: 'Not applicable',
      highlights: ['Refillable format', 'Useful for controlled misting', 'Capacity and material need confirmation'],
      caution: 'Confirm the actual capacity and material before publishing. Keep filled bottles labelled and away from young children.'
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
  const defaultSizeFor = product => product && product.variants ? product.variants[0] : null;
  const minPriceFor = product => product.variants ? Math.min(...product.variants.map(variant => variant.price)) : product.price;
  const maxPriceFor = product => product.variants ? Math.max(...product.variants.map(variant => variant.price)) : product.price;
  const cardPrice = product => product.variants ? `From ${currency(minPriceFor(product))}` : currency(product.price);
  const cardSize = product => {
    if (product.variants) return product.variants.map(variant => variant.label).reverse().join(' and ');
    if (product.colorOptions) return product.slug === 'satin-bonnet' ? 'Four colours' : 'Two colours';
    return product.size || '';
  };
  const categoryLabel = product => CATEGORY_LABELS[product.category] || 'Ayurélle Organics';
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const productHref = slug => `product.html?slug=${encodeURIComponent(slug)}`;

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
    const label = product.badge || categoryLabel(product);
    return `<article class="product-card" data-product-card data-product-slug="${escapeHtml(product.slug)}">
      <a class="product-card-media" href="${productHref(product.slug)}" aria-label="View ${escapeHtml(product.name)}">
        <img src="${escapeHtml(cardImage)}" data-card-image alt="${escapeHtml(product.name)} image placeholder" loading="lazy">
        <span class="product-card-label">${escapeHtml(label)}</span>
        <span class="product-card-open" aria-hidden="true"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
      </a>
      <div class="product-card-copy">
        <div class="product-card-topline"><span>${escapeHtml(categoryLabel(product))}</span>${product.variants ? `<span>${escapeHtml(sizeText)}</span>` : ''}</div>
        <a class="product-card-title" href="${productHref(product.slug)}">${escapeHtml(product.name)}</a>
        <p class="product-card-description">${escapeHtml(product.short)}</p>
        <div class="product-card-price-line"><span>${escapeHtml(priceText)}</span>${!product.variants && !product.colorOptions ? `<small>${escapeHtml(product.size || '')}</small>` : ''}</div>
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
    const tabs = [...document.querySelectorAll('[data-category][data-category-filters]')];

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
      if (resultsCount) resultsCount.textContent = String(items.length);
      if (empty) empty.hidden = items.length > 0;
      grid.hidden = items.length === 0;
      updateActiveFilter();
      document.querySelectorAll('[data-category-count="all"]').forEach(node => { node.textContent = String(PRODUCTS.length); });
    }

    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category');
    if (['sets', 'hair', 'mens', 'tools'].includes(initialCategory)) selectedCategory = initialCategory;
    const initialSearch = params.get('q');
    if (initialSearch) {
      searchTerm = initialSearch;
      if (search) search.value = initialSearch;
    }
    if (params.get('focus') === 'search' && search) window.setTimeout(() => search.focus(), 150);
    updateGrid();

    document.querySelectorAll('[data-category-filters] [data-category]').forEach(button => {
      button.addEventListener('click', () => {
        selectedCategory = button.dataset.category;
        const url = new URL(window.location.href);
        if (selectedCategory === 'all') url.searchParams.delete('category');
        else url.searchParams.set('category', selectedCategory);
        history.replaceState({}, '', url);
        updateGrid();
      });
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
    if (!product || !product.variants) return null;
    return product.variants.find(variant => variant.id === id) || product.variants[0];
  }

  function renderOptions(product, source = 'detail', selectedSize = null, selectedColor = null) {
    const currentSize = selectedSize || defaultSizeFor(product);
    let html = '';
    if (product.variants) {
      html += `<div class="option-block"><label class="option-heading" for="${source}SizeSelect"><span>Size</span><span>Choose a size</span></label><select id="${source}SizeSelect" class="option-select" data-${source}-size data-product-slug="${escapeHtml(product.slug)}">${product.variants.map(variant => `<option value="${escapeHtml(variant.id)}" ${currentSize && currentSize.id === variant.id ? 'selected' : ''}>${escapeHtml(variant.label)} · ${currency(variant.price)}</option>`).join('')}</select></div>`;
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

  function updateDetailPrice() {
    if (!currentProduct) return;
    const selectedVariant = chosenSize(currentProduct, currentSizeVariant);
    const price = selectedVariant ? selectedVariant.price : currentProduct.price;
    setText('[data-product-price]', currency(price));
    const image = document.querySelector('[data-detail-image]');
    if (image) {
      image.src = imageFor(currentProduct.slug, currentColor || defaultColorFor(currentProduct.slug));
      image.alt = `${currentProduct.name} image placeholder${currentColor ? `, ${currentColor}` : ''}`;
    }
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
      const size = item.variants ? item.variants.map(variant => variant.label).join(' / ') : item.size;
      return `<button type="button" class="set-item-card" data-open-product="${escapeHtml(item.slug)}" aria-label="View details for ${escapeHtml(label)}">
        <span class="set-item-image"><img src="${escapeHtml(imageFor(item.slug, defaultColorFor(item.slug)))}" alt="${escapeHtml(label)} image placeholder" loading="lazy"></span>
        <span class="set-item-copy"><span class="set-item-number">ITEM ${(index + 1).toString().padStart(2, '0')}</span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(size || categoryLabel(item))} · ${escapeHtml(cardPrice(item))}</small></span>
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
    const slug = params.get('slug') || 'full-hair-growth-set';
    currentProduct = bySlug.get(slug) || bySlug.get('full-hair-growth-set');
    currentSizeVariant = defaultSizeFor(currentProduct)?.id || null;
    currentColor = defaultColorFor(currentProduct.slug);
    currentQty = 1;

    const mainImage = document.querySelector('[data-detail-image]');
    if (mainImage) {
      mainImage.src = imageFor(currentProduct.slug, currentColor);
      mainImage.alt = `${currentProduct.name} image placeholder`;
    }
    setText('[data-product-breadcrumb]', currentProduct.name);
    setText('[data-product-category]', categoryLabel(currentProduct).toUpperCase());
    setText('[data-product-title]', currentProduct.name);
    setText('[data-product-short]', currentProduct.short);
    setText('[data-product-description]', currentProduct.description);
    setText('[data-long-description]', currentProduct.description);
    setText('[data-product-ingredients]', currentProduct.ingredients);
    setText('[data-product-directions]', currentProduct.directions);
    setText('[data-product-caution]', currentProduct.caution);
    setText('[data-product-qty]', '1');
    setText('[data-gallery-index]', currentProduct.colorOptions ? `01 / ${Object.keys((IMAGES.variants[currentProduct.slug] || {}).colors || {}).length}` : '01 / 01');
    document.title = `${currentProduct.name} | Ayurélle Organics`;
    const titleMeta = document.querySelector('meta[property="og:title"]');
    if (titleMeta) titleMeta.content = `${currentProduct.name} | Ayurélle Organics`;
    const shortMeta = document.querySelector('meta[name="description"]');
    if (shortMeta) shortMeta.content = currentProduct.short;
    const detailOptions = document.querySelector('[data-product-options]');
    if (detailOptions) detailOptions.innerHTML = renderOptions(currentProduct, 'detail', currentSizeVariant, currentColor);
    const highlights = document.querySelector('[data-product-highlights]');
    if (highlights) highlights.innerHTML = (currentProduct.highlights || []).map(item => `<div class="benefit-item"><i class="fa-solid fa-check" aria-hidden="true"></i><span>${escapeHtml(item)}</span></div>`).join('');
    const whatsapp = document.querySelector('[data-product-whatsapp]');
    if (whatsapp) {
      const message = encodeURIComponent(`Hello Ayurélle Organics, I have a question about ${currentProduct.name}.`);
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
      const image = document.querySelector('[data-detail-image]');
      if (image) image.src = imageFor(currentProduct.slug, button.dataset.detailColor);
    });
    detailOptions?.addEventListener('pointerout', event => {
      const button = event.target.closest('[data-detail-color]');
      if (!button || button.contains(event.relatedTarget) || !currentProduct) return;
      const image = document.querySelector('[data-detail-image]');
      if (image) image.src = imageFor(currentProduct.slug, currentColor || defaultColorFor(currentProduct.slug));
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
    return `<div class="drawer-product-image"><img src="${escapeHtml(imageFor(product.slug, color))}" alt="${escapeHtml(product.name)} image placeholder"></div>
      <div class="drawer-product-copy"><p class="eyebrow"><span></span>${escapeHtml(categoryLabel(product).toUpperCase())}</p><h2 id="drawerTitle">${escapeHtml(product.name)}</h2><div class="drawer-product-price" data-drawer-price>${currency(price)}</div><p>${escapeHtml(product.description)}</p>
      <div class="drawer-facts"><div class="drawer-fact"><span>Size / quantity</span><strong>${escapeHtml(sizeVariant ? sizeVariant.label : product.size || 'See product details')}</strong></div><div class="drawer-fact"><span>${product.colorOptions ? 'Selected colour' : 'Product type'}</span><strong data-drawer-color-label>${escapeHtml(selectedName || (product.texture || 'Hair care'))}</strong></div></div>
      <div class="drawer-info-block"><h3>What it is</h3><p>${escapeHtml(product.short)} ${escapeHtml(product.sizeDetail || '')}</p></div>
      <div class="drawer-info-block"><h3>Key details</h3><ul>${(product.highlights || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
      <div class="drawer-info-block"><h3>Ingredients or materials</h3><p>${escapeHtml(product.ingredients)}</p></div>
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
        <div class="cart-item-product"><a href="${productHref(item.slug)}" class="cart-item-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(item.name)} image placeholder"></a><div class="cart-item-copy"><span class="cart-item-category">${escapeHtml(categoryLabel(product || item))}</span><a class="cart-item-title" href="${productHref(item.slug)}">${escapeHtml(item.name)}</a><p class="cart-item-variant">${escapeHtml(variantText || 'Standard option')}</p><span class="cart-item-price">${currency(item.price)} each</span><button type="button" class="cart-remove" data-cart-remove="${escapeHtml(cartItemKey(item))}">Remove</button></div></div>
        <div class="cart-qty" aria-label="Quantity for ${escapeHtml(item.name)}"><button type="button" data-cart-minus="${escapeHtml(cartItemKey(item))}" aria-label="Decrease quantity">−</button><output>${Number(item.qty)}</output><button type="button" data-cart-plus="${escapeHtml(cartItemKey(item))}" aria-label="Increase quantity">+</button></div>
        <div class="cart-item-total">${currency(Number(item.price) * Number(item.qty))}</div>
      </article>`;
    }).join('');
    const subtotal = cartSubtotal(cart);
    setText('[data-cart-subtotal]', currency(subtotal));
    setText('[data-cart-total]', currency(subtotal));
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
        'Hello Ayurélle Organics, I would like to confirm this order.',
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
      const body = `Hello Ayurélle Organics, my name is ${name}.\nEmail: ${email}\nEnquiry: ${topic}\n\n${message}`;
      const feedback = document.querySelector('[data-contact-feedback]');
      if (feedback) feedback.textContent = 'Opening WhatsApp. Review your message and send it to Ayurélle.';
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

  function initialise() {
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
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();

  // Expose a small read-only catalogue helper for later customisation and debugging.
  window.AYURELLE_CATALOGUE = { list: PRODUCTS, get: slug => bySlug.get(slug) || null };
})();
