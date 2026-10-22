import { getAdminServices, json, methodNotAllowed, readJson, loadServerCatalogue, calculateItems, siteUrl, safeString, normalEmail } from './_shared.mjs';
export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'POST') return methodNotAllowed();
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) return json({ error: 'Online payment is not configured yet. Please contact Ayurèlle to complete your order.' }, 503);
    const input = await readJson(request);
    const customer = { name: safeString(input.customer?.name, 100), email: normalEmail(input.customer?.email), phone: safeString(input.customer?.phone, 40) };
    const method = input.delivery?.method === 'pickup' ? 'pickup' : 'delivery';
    const delivery = { region: safeString(input.delivery?.region, 70), city: safeString(input.delivery?.city, 80), method, address: safeString(input.delivery?.address, 500), notes: safeString(input.delivery?.notes, 600) };
    if (!customer.name || !customer.email || !customer.phone || (method === 'delivery' && (!delivery.region || !delivery.city || !delivery.address))) return json({ error: 'Please complete your name, email, phone and the details for your chosen fulfilment method.' }, 400);
    const { db, FieldValue } = getAdminServices();
    let savedSettings = {};
    try { const settingsSnap = await db.collection('settings').doc('store').get(); if (settingsSnap.exists) savedSettings = settingsSnap.data() || {}; } catch (settingsError) { console.warn('Using default fulfilment settings:', settingsError.message); }
    const defaults = { pickupAddress: 'Ville Afrique, North Kaneshie', pickupInstructions: 'Pickup is available on Wednesdays and Saturdays. We will contact you when your order is ready. Please wait for our confirmation before travelling to collect it.', deliveryDays: 'Wednesday, Saturday', pickupDays: 'Wednesday, Saturday', deliveryNote: 'Delivery charges are confirmed separately after your delivery location is reviewed.', orderNote: 'Orders are prepared for the next available Wednesday or Saturday.' };
    const setting = key => safeString(savedSettings[key] || defaults[key], 500);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const allowedText = method === 'pickup' ? setting('pickupDays') : setting('deliveryDays');
    const allowedDays = new Set(allowedText.split(/[;,\n]/).map(value => dayNames.find(day => day.toLowerCase() === value.trim().toLowerCase())).filter(Boolean));
    if (!allowedDays.size) ['Wednesday', 'Saturday'].forEach(day => allowedDays.add(day));
    // Ghana is UTC+0. Select a strictly future fulfilment date on the server so
    // the browser cannot submit a stale or arbitrary delivery promise.
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    let scheduledDate = '', scheduledDay = '';
    for (let offset = 1; offset <= 7; offset++) {
      const candidate = new Date(start.getTime() + offset * 86400000);
      if (allowedDays.has(dayNames[candidate.getUTCDay()])) {
        scheduledDate = `${candidate.getUTCFullYear()}-${String(candidate.getUTCMonth() + 1).padStart(2, '0')}-${String(candidate.getUTCDate()).padStart(2, '0')}`;
        scheduledDay = dayNames[candidate.getUTCDay()];
        break;
      }
    }
    Object.assign(delivery, {
      scheduledDate, scheduledDay,
      availableDays: allowedText,
      deliveryNote: setting('deliveryNote'), orderNote: setting('orderNote'),
      ...(method === 'pickup' ? { pickupAddress: setting('pickupAddress'), pickupInstructions: setting('pickupInstructions') } : {})
    });
    const catalogue = await loadServerCatalogue(db);
    const priced = calculateItems(input.items, catalogue.products);
    const origin = siteUrl();
    if (!origin) return json({ error: 'SITE_URL is not configured. Add your public Netlify site URL.' }, 503);
    const counterRef = db.collection('store_metadata').doc('orderCounter');
    let reference = '';
    await db.runTransaction(async transaction => {
      const counter = await transaction.get(counterRef);
      let lastNumber = Number(counter.exists ? counter.data()?.lastNumber || 0 : 0);
      if (!counter.exists) {
        const existing = await transaction.get(db.collection('orders'));
        lastNumber = Math.max(lastNumber, existing.size);
        for (const existingOrder of existing.docs) {
          const data = existingOrder.data() || {};
          const number = Number(data.orderSequence || 0);
          const printed = String(data.orderNumber || data.reference || existingOrder.id).match(/^AYR-(\d{5,})$/);
          lastNumber = Math.max(lastNumber, number, printed ? Number(printed[1]) : 0);
        }
      }
      let nextNumber = lastNumber + 1;
      let orderRef;
      while (true) {
        reference = `AYR-${String(nextNumber).padStart(5, '0')}`;
        orderRef = db.collection('orders').doc(reference);
        const collision = await transaction.get(orderRef);
        if (!collision.exists) break;
        nextNumber++;
      }
      const order = {
        reference, orderNumber: reference, orderSequence: nextNumber, customer, delivery, items: priced.items,
        subtotal: priced.subtotal, processingFee: priced.processingFee, amountDue: priced.amountDue,
        currency: 'GHS', paymentProvider: 'paystack', paymentStatus: 'pending', status: 'pending payment',
        createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
        emailConfirmationSent: false, adminOrderEmailSent: false
      };
      transaction.set(counterRef, { lastNumber: nextNumber, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      transaction.create(orderRef, order);
    });
    const providerResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: customer.email, amount: Math.round(priced.amountDue * 100), currency: 'GHS', channels: ['card', 'mobile_money'], reference, callback_url: `${origin}/confirmation.html`, metadata: { order_reference: reference, customer_name: customer.name, phone: customer.phone, custom_fields: [{ display_name: 'Order reference', variable_name: 'order_reference', value: reference }] } })
    });
    const provider = await providerResponse.json().catch(() => ({}));
    if (!providerResponse.ok || !provider.status || !provider.data?.authorization_url) {
      await db.collection('orders').doc(reference).update({ paymentStatus: 'initialization failed', status: 'cancelled', updatedAt: FieldValue.serverTimestamp() });
      console.error('Paystack initialize failed:', provider.message || providerResponse.status);
      return json({ error: 'We could not start payment. Please try again or contact Ayurèlle.' }, 502);
    }
    return json({ authorizationUrl: provider.data.authorization_url, reference, amountDue: priced.amountDue, currency: 'GHS' });
  } catch (error) {
    console.error('paystack initialize:', error.message);
    return json({ error: error.statusCode ? error.message : 'Checkout could not be started. Please try again.' }, error.statusCode || 500);
  }
};
