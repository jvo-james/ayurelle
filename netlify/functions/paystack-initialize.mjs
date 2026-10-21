import { getAdminServices, json, methodNotAllowed, readJson, loadServerCatalogue, calculateItems, siteUrl, safeString, normalEmail } from './_shared.mjs';
export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'POST') return methodNotAllowed();
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) return json({ error: 'Online payment is not configured yet. Please contact Ayurélle to complete your order.' }, 503);
    const input = await readJson(request);
    const customer = { name: safeString(input.customer?.name, 100), email: normalEmail(input.customer?.email), phone: safeString(input.customer?.phone, 40) };
    const delivery = { region: safeString(input.delivery?.region, 70), city: safeString(input.delivery?.city, 80), method: input.delivery?.method === 'pickup' ? 'pickup' : 'delivery', address: safeString(input.delivery?.address, 500), notes: safeString(input.delivery?.notes, 600) };
    if (!customer.name || !customer.email || !customer.phone || !delivery.region || !delivery.city || (delivery.method !== 'pickup' && !delivery.address)) return json({ error: 'Please complete your name, email, phone and delivery details.' }, 400);
    const { db, FieldValue } = getAdminServices();
    const catalogue = await loadServerCatalogue(db);
    const priced = calculateItems(input.items, catalogue.products);
    const crypto = await import('node:crypto');
    const reference = `AYR-${Date.now()}-${crypto.randomBytes(12).toString('hex').toUpperCase()}`;
    const origin = siteUrl();
    if (!origin) return json({ error: 'SITE_URL is not configured. Add your public Netlify site URL.' }, 503);
    const order = {
      reference, customer, delivery, items: priced.items,
      subtotal: priced.subtotal, processingFee: priced.processingFee, amountDue: priced.amountDue,
      currency: 'GHS', paymentProvider: 'paystack', paymentStatus: 'pending', status: 'pending payment',
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
      emailConfirmationSent: false, adminOrderEmailSent: false
    };
    await db.collection('orders').doc(reference).set(order);
    const providerResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: customer.email, amount: Math.round(priced.amountDue * 100), currency: 'GHS', channels: ['card', 'mobile_money'], reference, callback_url: `${origin}/confirmation.html`, metadata: { order_reference: reference, customer_name: customer.name, phone: customer.phone, custom_fields: [{ display_name: 'Order reference', variable_name: 'order_reference', value: reference }] } })
    });
    const provider = await providerResponse.json().catch(() => ({}));
    if (!providerResponse.ok || !provider.status || !provider.data?.authorization_url) {
      await db.collection('orders').doc(reference).update({ paymentStatus: 'initialization failed', status: 'cancelled', updatedAt: FieldValue.serverTimestamp() });
      console.error('Paystack initialize failed:', provider.message || providerResponse.status);
      return json({ error: 'We could not start payment. Please try again or contact Ayurélle.' }, 502);
    }
    return json({ authorizationUrl: provider.data.authorization_url, reference, amountDue: priced.amountDue, currency: 'GHS' });
  } catch (error) {
    console.error('paystack initialize:', error.message);
    return json({ error: error.statusCode ? error.message : 'Checkout could not be started. Please try again.' }, error.statusCode || 500);
  }
};
