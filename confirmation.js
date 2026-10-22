(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const money = value => `GH₵${Number(value || 0).toFixed(2)}`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  let orderData = null;
  const setMessage = text => { const node = $('[data-confirmation-message]'); if (node) node.textContent = text; };
  const showError = message => {
    $('[data-confirmation-spinner]')?.setAttribute('hidden', '');
    $('[data-confirmation-error]').hidden = false;
    $('[data-confirmation-error]').textContent = message;
    $('[data-confirmation-title]').innerHTML = 'We are checking your <em>payment.</em>';
    setMessage('Keep your payment reference handy. This page does not assume that a redirect alone confirms a payment.');
  };
  async function verify() {
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference') || sessionStorage.getItem('ayurelle-pending-reference') || '';
    if (!reference) { showError('No payment reference was found. If you completed a payment, please contact Ayurèlle with the reference shown on your Paystack receipt.'); return; }
    try {
      const response = await fetch(`/.netlify/functions/paystack-verify?reference=${encodeURIComponent(reference)}`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.paid || !result.order) throw new Error(result.error || result.message || 'The payment has not been confirmed yet. Refresh this page in a little while if you have completed payment.');
      orderData = result.order;
      renderReceipt(orderData);
      $('[data-confirmation-spinner]').hidden = true;
      $('[data-confirmation-check]').hidden = false;
      $('[data-confirmation-title]').innerHTML = 'Your crown-care order is <em>confirmed.</em>';
      setMessage('Payment received. Your receipt is ready below and a copy is being sent to your email.');
      $('[data-receipt-panel]').hidden = false;
      $('[data-confirmation-next]').hidden = false;
      localStorage.removeItem('ayurelle-organics-cart-v2');
      sessionStorage.removeItem('ayurelle-pending-reference');
      document.querySelectorAll('[data-cart-count]').forEach(node => node.textContent = '0');
      const url = new URL(location.href); url.searchParams.set('reference', reference); history.replaceState({}, '', url);
      // Generate a local PDF receipt automatically. A button remains available if the browser blocks a download.
      window.setTimeout(() => downloadReceipt(), 450);
    } catch (error) {
      showError(error.message || 'We could not verify this payment right now.');
    }
  }
  function renderReceipt(order) {
    $('[data-receipt-reference]').textContent = order.orderNumber || order.reference || 'Confirmed';
    const date = order.paidAt && order.paidAt._seconds ? new Date(order.paidAt._seconds * 1000) : new Date();
    $('[data-receipt-date]').textContent = `Payment verified ${date.toLocaleString('en-GH', { dateStyle: 'medium', timeStyle: 'short' })}`;
    const customer = order.customer || {};
    const delivery = order.delivery || {};
    const scheduleRaw = delivery.scheduledDate || delivery.requestedDate || '';
    const scheduleLabel = scheduleRaw && /^\d{4}-\d{2}-\d{2}$/.test(scheduleRaw)
      ? new Intl.DateTimeFormat('en-GH', { timeZone: 'Africa/Accra', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${scheduleRaw}T12:00:00Z`))
      : (delivery.scheduledDay || delivery.requestedDay || 'To be confirmed');
    const isPickup = delivery.method === 'pickup';
    const fulfilmentAddress = isPickup ? (delivery.pickupAddress || 'Ville Afrique, North Kaneshie') : [delivery.address, [delivery.city, delivery.region].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
    $('[data-receipt-customer]').innerHTML = `<div><span>Customer</span><strong>${esc(customer.name || '')}</strong><small>${esc(customer.email || '')} · ${esc(customer.phone || '')}</small></div><div><span>${isPickup ? 'Pickup details' : 'Delivery details'}</span><strong>${esc(isPickup ? 'Pickup at Ville Afrique' : 'Home delivery')}</strong><small><b>Scheduled for:</b> ${esc(scheduleLabel)}<br><b>${isPickup ? 'Pickup address' : 'Address'}:</b> ${esc(fulfilmentAddress || 'Please contact our team to confirm')}</small>${isPickup ? `<small>${esc(delivery.pickupInstructions || 'We will contact you when your order is ready. Please wait for confirmation before travelling to collect it.')}</small>` : `<small>${esc(delivery.deliveryNote || 'Delivery charges are confirmed separately and are not included in today’s payment.')}</small>`}${delivery.notes ? `<small>Order note: ${esc(delivery.notes)}</small>` : ''}</div>`;
    const fulfilmentNote = $('[data-receipt-fulfilment-note]');
    if (fulfilmentNote) fulfilmentNote.textContent = isPickup
      ? `Pickup is scheduled for ${scheduleLabel} at ${fulfilmentAddress}. ${delivery.pickupInstructions || 'Please wait for our confirmation before travelling to collect your order.'}`
      : `Delivery is scheduled for ${scheduleLabel}. ${delivery.deliveryNote || 'Delivery charges are not included in today’s payment and will be confirmed separately.'}`;
    $('[data-receipt-items]').innerHTML = (order.items || []).map(item => `<div class="receipt-line-item"><div><strong>${esc(item.name)}</strong><small>${esc([item.size, item.colorLabel || item.color].filter(Boolean).join(' · '))} · Qty ${Number(item.qty || 1)}</small></div><b>${money(item.lineTotal ?? Number(item.price) * Number(item.qty))}</b></div>`).join('');
    $('[data-receipt-subtotal]').textContent = money(order.subtotal);
    $('[data-receipt-fee]').textContent = money(order.processingFee);
    $('[data-receipt-total]').textContent = money(order.amountDue);
  }
  function downloadReceipt() {
    if (!orderData) return;
    const button = $('[data-download-receipt]');
    if (button) { button.disabled = true; button.classList.add('is-loading'); button.setAttribute('aria-busy', 'true'); button.dataset.restore = button.innerHTML; button.innerHTML = '<span class="button-spinner" aria-hidden="true"></span><span>Preparing PDF…</span>'; }
    try {
      if (!window.jspdf?.jsPDF) { window.print(); return; }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const left = 18; let y = 20;
      doc.setFillColor(18, 55, 34); doc.rect(0, 0, 210, 43, 'F');
      doc.setTextColor(228, 203, 118); doc.setFont('times', 'bold'); doc.setFontSize(25); doc.text('Ayurèlle', left, 20);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(245, 239, 215); doc.text('ORGANICS  |  FEED YOUR SCALP. FLOURISH YOUR CROWN.', left, 29);
      doc.setFontSize(10); doc.text('PAYMENT RECEIPT', left, 37);
      y = 57; doc.setTextColor(23, 58, 37); doc.setFont('times', 'bold'); doc.setFontSize(20); doc.text('Your order is confirmed', left, y); y += 10;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('ORDER REFERENCE', left, y); doc.setFont('helvetica', 'normal'); doc.text(String(orderData.orderNumber || orderData.reference || ''), left + 35, y); y += 7;
      doc.setFontSize(8); doc.setTextColor(100, 112, 99); doc.text(`Customer: ${orderData.customer?.name || ''}`, left, y); y += 5; doc.text(`Email: ${orderData.customer?.email || ''}`, left, y); y += 5; doc.text(`Phone: ${orderData.customer?.phone || ''}`, left, y); y += 5;
      const delivery = orderData.delivery || {};
      const scheduleRaw = delivery.scheduledDate || delivery.requestedDate || '';
      const scheduleLabel = scheduleRaw && /^\d{4}-\d{2}-\d{2}$/.test(scheduleRaw) ? new Intl.DateTimeFormat('en-GH', { timeZone: 'Africa/Accra', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${scheduleRaw}T12:00:00Z`)) : (delivery.scheduledDay || delivery.requestedDay || 'To be confirmed');
      const pickup = delivery.method === 'pickup';
      const fulfilmentAddress = pickup ? (delivery.pickupAddress || 'Ville Afrique, North Kaneshie') : [delivery.address, [delivery.city, delivery.region].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
      for (const line of [`Fulfilment: ${pickup ? 'Pickup' : 'Home delivery'}`, `Scheduled for: ${scheduleLabel}`, `${pickup ? 'Pickup address' : 'Delivery address'}: ${fulfilmentAddress || 'To be confirmed'}`, ...(pickup ? [`Pickup notes: ${delivery.pickupInstructions || 'Please wait for confirmation before travelling to collect your order.'}`] : [`Delivery note: ${delivery.deliveryNote || 'Delivery charges are not included in today’s payment and will be confirmed separately.'}`]), ...(delivery.notes ? [`Order note: ${delivery.notes}`] : [])]) {
        const wrapped = doc.splitTextToSize(line, 174); if (y + wrapped.length * 4 > 265) { doc.addPage(); y = 22; }
        doc.text(wrapped, left, y); y += wrapped.length * 4 + 1;
      }
      doc.setDrawColor(223, 215, 194); doc.line(left, y + 2, 192, y + 2); y += 10;
      doc.setTextColor(23, 58, 37); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('ITEM', left, y); doc.text('QTY', 145, y, { align: 'right' }); doc.text('AMOUNT', 192, y, { align: 'right' }); y += 5;
      doc.setFont('helvetica', 'normal');
      for (const item of orderData.items || []) {
        const title = `${item.name}${item.size ? ` · ${item.size}` : ''}${item.colorLabel ? ` · ${item.colorLabel}` : ''}`;
        const lines = doc.splitTextToSize(title, 113);
        if (y + lines.length * 4 + 4 > 250) { doc.addPage(); y = 22; }
        doc.text(lines, left, y); doc.text(String(item.qty || 1), 145, y, { align: 'right' }); doc.text(money(item.lineTotal ?? Number(item.price) * Number(item.qty)), 192, y, { align: 'right' }); y += lines.length * 4 + 4;
      }
      y += 4; doc.setDrawColor(223, 215, 194); doc.line(112, y, 192, y); y += 8;
      const totals = [['Subtotal', orderData.subtotal], ['Processing fee', orderData.processingFee], ['PAID TODAY', orderData.amountDue]];
      totals.forEach(([label, amount], idx) => { doc.setFont('helvetica', idx === 2 ? 'bold' : 'normal'); doc.setTextColor(23, 58, 37); doc.text(label, 118, y); doc.text(money(amount), 192, y, { align: 'right' }); y += 7; });
      y += 5; doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(102, 112, 99);
      const note = doc.splitTextToSize(delivery.method === 'pickup' ? 'Pickup is arranged for the scheduled date above. Please wait for our confirmation before travelling to collect your order. Keep this receipt and order reference for your records.' : 'Delivery charges are not included in this receipt. Ayurèlle Organics will confirm the delivery amount after reviewing your location. Keep this receipt and order reference for your records.', 172);
      doc.text(note, left, y); y += note.length * 4 + 10;
      doc.setDrawColor(197, 161, 59); doc.line(left, y, 192, y); y += 8; doc.setFont('times', 'italic'); doc.setFontSize(11); doc.setTextColor(23, 58, 37); doc.text('Thank you for choosing Ayurèlle Organics.', left, y);
      doc.save(`Ayurelle-Receipt-${String(orderData.orderNumber || orderData.reference).replace(/[^A-Za-z0-9-]/g, '')}.pdf`);
    } catch (error) {
      console.error('Receipt PDF error:', error);
      window.print();
    } finally {
      if (button) { button.disabled = false; button.classList.remove('is-loading'); button.removeAttribute('aria-busy'); button.innerHTML = button.dataset.restore || '<i class="fa-solid fa-file-pdf" aria-hidden="true"></i> Download PDF receipt'; }
    }
  }
  $('[data-download-receipt]')?.addEventListener('click', downloadReceipt);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', verify, { once: true }); else verify();
})();
