(() => {
  'use strict';
  const CART_KEY = 'ayurelle-organics-cart-v2';
  const money = value => `GH₵${Number(value || 0).toFixed(2)}`;
  const readCart = () => { try { const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(items) ? items : []; } catch { return []; } };
  const subtotalNow = () => Math.round(readCart().reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0) * 100) / 100;
  const feeFor = subtotal => Math.round(subtotal * .0295 * 100) / 100;
  function updateSummary() {
    if (!document.querySelector('[data-checkout-fee]')) return;
    const subtotal = subtotalNow();
    const fee = feeFor(subtotal);
    document.querySelector('[data-checkout-subtotal]').textContent = money(subtotal);
    document.querySelector('[data-checkout-fee]').textContent = money(fee);
    document.querySelector('[data-checkout-total]').textContent = money(subtotal + fee);
  }
  function configureDeliveryFields(form) {
    const delivery = form.querySelector('[name=delivery]');
    const address = form.querySelector('[name=address]');
    const label = address?.closest('label');
    const labelText = label?.childNodes?.[0];
    const sync = () => {
      const pickup = delivery?.value === 'pickup';
      if (address) {
        address.required = !pickup;
        address.placeholder = pickup ? 'Optional notes for your collection' : 'House number, street, area and a nearby landmark';
      }
      if (labelText && labelText.nodeType === Node.TEXT_NODE) labelText.textContent = pickup ? 'Pickup note ' : 'Street address and landmark ';
    };
    delivery?.addEventListener('change', sync);
    sync();
  }
  function busy(button, on) {
    if (!button) return;
    if (on) {
      button.dataset.originalContent = button.innerHTML;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.classList.add('is-loading');
      button.innerHTML = '<span class="button-spinner" aria-hidden="true"></span><span>Connecting to secure checkout…</span>';
    } else {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.classList.remove('is-loading');
      button.innerHTML = button.dataset.originalContent || 'Continue to secure payment';
    }
  }
  document.addEventListener('submit', async event => {
    const form = event.target.closest('[data-checkout-form]');
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const button = form.querySelector('[type="submit"]');
    const feedback = document.querySelector('[data-checkout-feedback]');
    const cart = readCart();
    if (!cart.length) {
      feedback.textContent = 'Your bag is empty. Add products before continuing.';
      return;
    }
    const formData = new FormData(form);
    const payload = {
      customer: { name: formData.get('name'), phone: formData.get('phone'), email: formData.get('email') },
      delivery: { region: formData.get('region'), city: formData.get('city'), method: formData.get('delivery'), address: formData.get('address'), notes: formData.get('notes') },
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
  }, true);
  document.querySelectorAll('[data-checkout-form]').forEach(configureDeliveryFields);
  window.addEventListener('DOMContentLoaded', updateSummary);
  window.addEventListener('ayurelle:catalogue-ready', updateSummary);
  window.addEventListener('storage', updateSummary);
  if (document.readyState !== 'loading') updateSummary();
})();
