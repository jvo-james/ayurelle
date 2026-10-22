(() => {
  'use strict';
  const CART_KEY = 'ayurelle-organics-cart-v2';
  const DEFAULT_SETTINGS = {
    pickupAddress: 'Ville Afrique, North Kaneshie',
    pickupInstructions: 'Pickup is available on Wednesdays and Saturdays. We’ll contact you when your order is ready before you travel to collect it.',
    deliveryDays: 'Wednesday, Saturday',
    pickupDays: 'Wednesday, Saturday',
    deliveryNote: 'Delivery charges are confirmed separately after your delivery location is reviewed.',
    orderNote: 'Orders are prepared for the next available Wednesday or Saturday.'
  };
  let storeSettings = { ...DEFAULT_SETTINGS };
  const money = value => `GH₵${Number(value || 0).toFixed(2)}`;
  const readCart = () => { try { const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(items) ? items : []; } catch { return []; } };
  const subtotalNow = () => Math.round(readCart().reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0) * 100) / 100;
  const feeFor = subtotal => Math.round(subtotal * .0295 * 100) / 100;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function ghanaDateParts() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const data = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return { year: Number(data.year), month: Number(data.month), day: Number(data.day) };
  }
  function parseDays(value) {
    const values = Array.isArray(value) ? value : String(value || '').split(/[;,\n]/);
    const valid = values.map(item => String(item).trim()).filter(item => dayNames.some(day => day.toLowerCase() === item.toLowerCase()));
    return valid.length ? valid.map(item => dayNames.find(day => day.toLowerCase() === item.toLowerCase())) : ['Wednesday', 'Saturday'];
  }
  function nextSlot(daysSetting) {
    const allowed = new Set(parseDays(daysSetting));
    const today = ghanaDateParts();
    // Start at tomorrow: orders use the next scheduled slot rather than promising same-day fulfilment.
    for (let offset = 1; offset <= 7; offset++) {
      const date = new Date(Date.UTC(today.year, today.month - 1, today.day + offset));
      const weekday = dayNames[date.getUTCDay()];
      if (allowed.has(weekday)) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return { iso: `${year}-${month}-${day}`, label: new Intl.DateTimeFormat('en-GH', { timeZone: 'Africa/Accra', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date), weekday };
      }
    }
    return null;
  }
  function updateSummary() {
    if (!document.querySelector('[data-checkout-fee]')) return;
    const subtotal = subtotalNow();
    const fee = feeFor(subtotal);
    const total = Math.round((subtotal + fee) * 100) / 100;
    const nodes = {
      '[data-checkout-subtotal]': subtotal,
      '[data-checkout-fee]': fee,
      '[data-checkout-total]': total,
      '[data-checkout-button-total]': total,
      '[data-cart-subtotal]': subtotal,
      '[data-cart-fee]': fee,
      '[data-cart-total]': total
    };
    Object.entries(nodes).forEach(([selector, value]) => document.querySelectorAll(selector).forEach(node => { node.textContent = money(value); }));
  }
  function showDeliveryMethod(form) {
    const method = form.querySelector('[name=delivery]')?.value || '';
    const deliveryFields = form.querySelector('[data-delivery-fields]');
    const pickupInfo = form.querySelector('[data-pickup-info]');
    const schedule = form.querySelector('[data-fulfilment-schedule]');
    const region = form.querySelector('[name=region]');
    const city = form.querySelector('[name=city]');
    const address = form.querySelector('[name=address]');
    const pickup = method === 'pickup';
    if (deliveryFields) deliveryFields.hidden = method !== 'delivery';
    if (pickupInfo) pickupInfo.hidden = !pickup;
    if (schedule) schedule.hidden = !method;
    [region, city, address].forEach(field => { if (field) field.required = method === 'delivery'; });
    if (region) region.disabled = method !== 'delivery';
    if (city) city.disabled = method !== 'delivery';
    if (address) address.disabled = method !== 'delivery';
    const deliveryNote = form.querySelector('[data-delivery-note]');
    if (deliveryNote) deliveryNote.textContent = storeSettings.deliveryNote || DEFAULT_SETTINGS.deliveryNote;
    const orderNote = form.querySelector('[data-order-note]');
    if (orderNote) orderNote.textContent = storeSettings.orderNote || DEFAULT_SETTINGS.orderNote;
    const scheduleSettings = pickup ? storeSettings.pickupDays : storeSettings.deliveryDays;
    const slot = method ? nextSlot(scheduleSettings) : null;
    const dateText = slot?.label || 'Please contact us to arrange a date';
    const dateNode = form.querySelector('[data-fulfilment-date]');
    const pickupDate = form.querySelector('[data-pickup-date]');
    const daysNode = form.querySelector('[data-fulfilment-days]');
    if (dateNode) dateNode.textContent = `${pickup ? 'Next pickup' : 'Next delivery'}: ${dateText}`;
    if (pickupDate) pickupDate.textContent = dateText;
    if (daysNode) daysNode.textContent = displayDays(scheduleSettings);
    return { slot, pickup };
  }
  function displayDays(value) {
    const days = parseDays(value);
    return days.length === 1 ? days[0] : `${days.slice(0, -1).join(', ')} and ${days[days.length - 1]}`;
  }
  function applySettings(form) {
    const pickupAddress = form.querySelector('[data-pickup-address]');
    const pickupInstructions = form.querySelector('[data-pickup-instructions]');
    if (pickupAddress) pickupAddress.textContent = storeSettings.pickupAddress || DEFAULT_SETTINGS.pickupAddress;
    if (pickupInstructions) pickupInstructions.textContent = storeSettings.pickupInstructions || DEFAULT_SETTINGS.pickupInstructions;
    showDeliveryMethod(form);
  }
  async function loadStoreSettings(form) {
    try {
      const response = await fetch('/.netlify/functions/store-settings', { headers: { Accept: 'application/json' }, cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        storeSettings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
      }
    } catch { /* Keep the published fallback instructions if the connection is unavailable. */ }
    applySettings(form);
  }
  function busy(button, on) {
    if (!button) return;
    if (on) {
      button.dataset.originalContent = button.innerHTML;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.classList.add('is-loading');
      button.innerHTML = '<span class="button-spinner" aria-hidden="true"></span><span>Opening secure payment…</span>';
    } else {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.classList.remove('is-loading');
      button.innerHTML = button.dataset.originalContent || '<span>Continue to secure payment</span>';
    }
  }
  async function submitCheckout(form) {
    const button = form.querySelector('[type="submit"]');
    const feedback = document.querySelector('[data-checkout-feedback]');
    const cart = readCart();
    if (!cart.length) { feedback.textContent = 'Your bag is empty. Add products before continuing.'; return; }
    const formData = new FormData(form);
    const method = String(formData.get('delivery') || '');
    if (!['delivery', 'pickup'].includes(method)) { feedback.textContent = 'Choose home delivery or pickup to continue.'; return; }
    if (method === 'delivery' && (!String(formData.get('region') || '').trim() || !String(formData.get('city') || '').trim() || !String(formData.get('address') || '').trim())) {
      feedback.textContent = 'Please complete your region, town and delivery address.'; return;
    }
    const slot = nextSlot(method === 'pickup' ? storeSettings.pickupDays : storeSettings.deliveryDays);
    const payload = {
      customer: { name: formData.get('name'), phone: formData.get('phone'), email: formData.get('email') },
      delivery: {
        region: method === 'delivery' ? formData.get('region') : '',
        city: method === 'delivery' ? formData.get('city') : '',
        method,
        address: method === 'delivery' ? formData.get('address') : '',
        notes: formData.get('notes'),
        requestedDate: slot?.iso || '',
        requestedDay: slot?.weekday || '',
        pickupAddress: method === 'pickup' ? storeSettings.pickupAddress : '',
        pickupInstructions: method === 'pickup' ? storeSettings.pickupInstructions : '',
        deliveryNote: storeSettings.deliveryNote,
        orderNote: storeSettings.orderNote
      },
      items: cart.map(item => ({ slug: item.slug, qty: item.qty, variantId: item.variantId || '', color: item.color || '', colorLabel: item.colorLabel || '' }))
    };
    busy(button, true);
    feedback.textContent = 'Preparing your secure payment session. Your card details stay with Paystack.';
    try {
      const response = await fetch('/.netlify/functions/paystack-initialize', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.authorizationUrl) throw new Error(result.error || 'Payment could not be started. Please try again.');
      sessionStorage.setItem('ayurelle-pending-reference', result.reference);
      window.location.assign(result.authorizationUrl);
    } catch (error) {
      feedback.textContent = error.message || 'We could not connect to payment. Please try again.';
      busy(button, false);
    }
  }
  function configure(form) {
    form.querySelector('[name=delivery]')?.addEventListener('change', () => showDeliveryMethod(form));
    // Submit in capture phase so the older optional WhatsApp checkout handler cannot override secure Paystack checkout.
    form.addEventListener('submit', event => { event.preventDefault(); event.stopImmediatePropagation(); submitCheckout(form); }, true);
    loadStoreSettings(form);
  }
  document.querySelectorAll('[data-checkout-form]').forEach(configure);
  document.querySelectorAll('[data-summary-toggle]').forEach(toggle => {
    const summary = document.querySelector('[data-summary-body]');
    if (summary && window.matchMedia('(max-width: 760px)').matches) {
      toggle.setAttribute('aria-expanded', 'false');
      summary.classList.add('is-collapsed');
    }
  });
  window.addEventListener('DOMContentLoaded', updateSummary);
  window.addEventListener('ayurelle:catalogue-ready', updateSummary);
  window.addEventListener('storage', updateSummary);
  if (document.readyState !== 'loading') updateSummary();
})();
