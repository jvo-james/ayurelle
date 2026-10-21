import { crypto, timingSafeHexEqual, getAdminServices, json, paystackVerify, finalizePaidOrder } from './_shared.mjs';
export default async request => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (!process.env.PAYSTACK_SECRET_KEY) return json({ error: 'Webhook secret is not configured.' }, 503);
  try {
    const raw = await request.text();
    const provided = request.headers.get('x-paystack-signature') || '';
    const expected = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(raw).digest('hex');
    if (!provided || !timingSafeHexEqual(provided, expected)) return json({ error: 'Invalid webhook signature.' }, 401);
    let event;
    try { event = JSON.parse(raw); } catch { return json({ error: 'Invalid JSON.' }, 400); }
    if (event.event === 'charge.success' && event.data?.reference) {
      const transaction = await paystackVerify(event.data.reference);
      if (transaction.status === 'success') {
        const { db } = getAdminServices();
        await finalizePaidOrder(db, event.data.reference, transaction);
      }
    }
    return json({ received: true });
  } catch (error) {
    console.error('paystack webhook:', error.message);
    return json({ error: 'Webhook handling failed. Paystack may retry this event.' }, 500);
  }
};
