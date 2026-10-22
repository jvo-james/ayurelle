import { getAdminServices, json, methodNotAllowed, paystackVerify, finalizePaidOrder, safeString } from './_shared.mjs';
export default async request => {
  if (request.method !== 'GET' && request.method !== 'POST') return methodNotAllowed(['GET', 'POST']);
  try {
    let reference = new URL(request.url).searchParams.get('reference') || '';
    if (request.method === 'POST') { const data = await request.json().catch(() => ({})); reference = data.reference || reference; }
    reference = safeString(reference, 120);
    if (!/^AYR-[A-Za-z0-9-]+$/.test(reference)) return json({ error: 'A valid payment reference is required.' }, 400);
    const transaction = await paystackVerify(reference);
    if (transaction.status !== 'success') return json({ paid: false, status: transaction.status || 'pending', message: 'Payment has not been confirmed yet.' }, 402);
    const { db } = getAdminServices();
    const order = await finalizePaidOrder(db, reference, transaction);
    return json({ paid: true, reference, order: { reference, orderNumber: order.orderNumber || reference, status: order.status, paymentStatus: order.paymentStatus, customer: order.customer, delivery: order.delivery, items: order.items, subtotal: order.subtotal, processingFee: order.processingFee, amountDue: order.amountDue, currency: order.currency, paidAt: order.paidAt || null } });
  } catch (error) {
    console.error('paystack verify:', error.message);
    return json({ error: error.statusCode ? error.message : 'We could not verify the payment right now. Please refresh in a moment or contact Ayurèlle with your payment reference.' }, error.statusCode || 500);
  }
};
