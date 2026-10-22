import crypto from 'node:crypto';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import { fallbackProducts, fallbackCategories, fallbackProductGuidance } from './_catalogue.mjs';
import { emailTemplate } from './_email-templates.mjs';

export const adminEmails = () => (process.env.ADMIN_EMAILS || process.env.ADMIN_NOTIFICATION_EMAIL || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
export const adminEmail = () => process.env.ADMIN_NOTIFICATION_EMAIL || adminEmails()[0] || '';
export const siteUrl = () => (process.env.SITE_URL || process.env.URL || '').replace(/\/$/, '');
export const fromEmail = () => process.env.RESEND_FROM_EMAIL || 'Ayurèlle Organics <onboarding@resend.dev>';

export function json(data, status = 200, headers = {}) {
  const body = status === 204 || status === 304 ? null : JSON.stringify(data);
  return new Response(body, { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...corsHeaders(), ...headers } });
}
export function corsHeaders() {
  const configured = [siteUrl(), process.env.DEPLOY_PRIME_URL, 'http://localhost:8888', 'http://127.0.0.1:8888'].filter(Boolean);
  const origin = configured.includes(process.env.URL) ? process.env.URL : '';
  return { 'Vary': 'Origin', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}) };
}
export function methodNotAllowed(methods = ['POST']) {
  return json({ error: `Method not allowed. Use ${methods.join(' or ')}.` }, 405, { Allow: methods.join(', ') });
}
export async function readJson(request) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 100_000) throw Object.assign(new Error('Request is too large.'), { statusCode: 413 });
  try { return await request.json(); } catch { throw Object.assign(new Error('Please send valid JSON.'), { statusCode: 400 }); }
}

let firebaseApp;
export function getAdminServices() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) throw new Error('Firebase server credentials are not configured. Add FIREBASE_SERVICE_ACCOUNT_JSON in Netlify environment variables.');
  if (!firebaseApp) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    let serviceAccount;
    try { serviceAccount = JSON.parse(raw); } catch { throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must be valid JSON.'); }
    if (typeof serviceAccount.private_key === 'string') serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    firebaseApp = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount), projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id });
  }
  return { auth: getAuth(firebaseApp), db: getFirestore(firebaseApp), FieldValue };
}

export async function verifyBearer(request, requireAdmin = true) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw Object.assign(new Error('Please sign in to continue.'), { statusCode: 401 });
  const services = getAdminServices();
  let decoded;
  try { decoded = await services.auth.verifyIdToken(token, true); } catch { throw Object.assign(new Error('Your session has expired. Please sign in again.'), { statusCode: 401 }); }
  if (requireAdmin) {
    const isAllowlisted = adminEmails().includes(String(decoded.email || '').toLowerCase());
    let adminDocument = false;
    if (!decoded.admin && !isAllowlisted) {
      try { const snapshot = await services.db.collection('admins').doc(decoded.uid).get(); adminDocument = snapshot.exists && snapshot.data()?.active === true; } catch { adminDocument = false; }
    }
    if (!decoded.admin && !isAllowlisted && !adminDocument) throw Object.assign(new Error('This account is not authorised to manage the store.'), { statusCode: 403 });
  }
  return decoded;
}

export function resendClient() {
  if (!process.env.RESEND_API_KEY) throw new Error('Email delivery is not configured. Add RESEND_API_KEY in Netlify environment variables.');
  return new Resend(process.env.RESEND_API_KEY);
}
export async function sendEmail({ to, subject, type, data, replyTo }) {
  if (!to) return { skipped: true };
  const resend = resendClient();
  const rendered = emailTemplate(type, data || {});
  const result = await resend.emails.send({ from: fromEmail(), to: Array.isArray(to) ? to : [to], subject: subject || rendered.subject, html: rendered.html, text: rendered.text, ...(replyTo ? { replyTo } : {}) });
  if (result.error) throw new Error(result.error.message || 'Resend could not send the email.');
  return result.data;
}
export async function safeSendEmail(args) {
  try { return await sendEmail(args); } catch (error) { console.error('Email delivery failed:', error.message); return { error: error.message }; }
}

export async function loadServerCatalogue(db) {
  if (!db) return { products: fallbackProducts, categories: fallbackCategories };
  const [productSnap, categorySnap] = await Promise.all([db.collection('products').get(), db.collection('categories').get()]);
  const products = productSnap.docs.map(doc => {
    const product = { ...doc.data(), id: doc.id, slug: doc.data().slug || doc.id };
    if (Number(product.contentReviewVersion || 0) < 3 && fallbackProductGuidance[product.slug]) Object.assign(product, fallbackProductGuidance[product.slug]);
    // These three items are sold in a single label-confirmed size. Ignore old
    // variant records so a previous configuration cannot block checkout.
    if (product.slug === 'ayur-hair-growth-oil') { delete product.variants; product.size = product.sizeDetail = '100 ml'; }
    if (product.slug === 'ayur-hair-growth-butter') { delete product.variants; product.size = product.sizeDetail = '250 ml'; }
    if (product.slug === 'ayur-silk-protein-mask') { delete product.variants; product.name = 'Prodiva Protein Mask'; product.size = product.sizeDetail = '250 ml'; }
    if (product.slug === 'ayur-deep-conditioner') product.size = product.sizeDetail = '250 ml';
    if (product.slug === 'ayur-leave-in-conditioner') product.size = product.sizeDetail = '250 ml';
    if (product.slug === 'ayur-hair-tea') product.size = product.sizeDetail = '200 g';
    if (product.slug === 'ayur-scalp-detox-mist') product.name = 'Rosemary Water Spray';
    return product;
  }).filter(p => p.active !== false);
  const categories = categorySnap.docs.map(doc => ({ ...doc.data(), id: doc.id, slug: doc.data().slug || doc.id })).filter(c => c.active !== false);
  // An existing collection is authoritative even when all its documents are
  // hidden. Falling back in that case would accidentally republish products.
  return { products: productSnap.empty ? fallbackProducts : products, categories: categorySnap.empty ? fallbackCategories : categories };
}

export function calculateItems(cart, products) {
  if (!Array.isArray(cart) || !cart.length || cart.length > 80) throw Object.assign(new Error('Your bag is empty or contains too many separate items.'), { statusCode: 400 });
  const bySlug = new Map(products.map(p => [p.slug, p]));
  const items = [];
  let subtotal = 0;
  for (const raw of cart) {
    const slug = String(raw.slug || '');
    const product = bySlug.get(slug);
    const qty = Math.floor(Number(raw.qty));
    if (!product || product.active === false) throw Object.assign(new Error(`One of the products is no longer available: ${slug}`), { statusCode: 400 });
    if (product.outOfStock === true) throw Object.assign(new Error(`${product.name || slug} is currently sold out. Please remove it from your bag and choose another product.`), { statusCode: 409 });
    if (!Number.isFinite(qty) || qty < 1 || qty > 50) throw Object.assign(new Error('Please check the quantities in your bag.'), { statusCode: 400 });
    if (product.trackInventory && Number(product.stock || 0) < qty) throw Object.assign(new Error(`${product.name} has fewer units in stock than requested. Please update your bag.`), { statusCode: 409 });
    let option = null;
    if (Array.isArray(product.variants) && product.variants.length) {
      option = product.variants.find(v => String(v.id) === String(raw.variantId));
      if (!option) throw Object.assign(new Error(`Please choose an available size for ${product.name}.`), { statusCode: 400 });
    }
    const price = Number(option ? option.price : product.price);
    if (!Number.isFinite(price) || price < 0) throw Object.assign(new Error('A product price needs store review.'), { statusCode: 400 });
    const image = (Array.isArray(product.images) && product.images[0]) || product.imageUrl || raw.image || '';
    const line = { slug, name: String(product.name || slug), category: String(product.category || ''), qty, price, lineTotal: Math.round(price * qty * 100) / 100, size: String(option ? option.label : product.size || ''), variantId: option ? option.id : '', color: String(raw.color || ''), colorLabel: String(raw.colorLabel || ''), image };
    items.push(line);
    subtotal += line.lineTotal;
  }
  subtotal = Math.round(subtotal * 100) / 100;
  const processingFee = Math.round(subtotal * 0.0295 * 100) / 100;
  const amountDue = Math.round((subtotal + processingFee) * 100) / 100;
  return { items, subtotal, processingFee, amountDue };
}

export async function paystackVerify(reference) {
  if (!process.env.PAYSTACK_SECRET_KEY) throw new Error('Paystack is not configured. Add PAYSTACK_SECRET_KEY in Netlify environment variables.');
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, Accept: 'application/json' } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.status || !payload.data) throw Object.assign(new Error(payload.message || 'We could not verify the payment with Paystack.'), { statusCode: 402 });
  return payload.data;
}

export async function finalizePaidOrder(db, reference, transaction) {
  const ref = String(reference || '');
  const orderRef = db.collection('orders').doc(ref);
  const result = await db.runTransaction(async tx => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) throw Object.assign(new Error('We could not find the order attached to this payment.'), { statusCode: 404 });
    const order = snap.data();
    const expectedKobo = Math.round(Number(order.amountDue) * 100);
    if (String(transaction.reference) !== ref || transaction.status !== 'success' || String(transaction.currency || '').toUpperCase() !== 'GHS' || Number(transaction.amount) !== expectedKobo) {
      throw Object.assign(new Error('The payment could not be matched to this order.'), { statusCode: 400 });
    }
    if (order.paymentStatus === 'paid') return { order: { ...order, reference: ref }, newlyPaid: false };

    // All stock reads happen before any transaction writes. This keeps finalisation
    // idempotent when Paystack retries a webhook or the customer returns to the page.
    const quantities = new Map();
    for (const item of order.items || []) quantities.set(item.slug, (quantities.get(item.slug) || 0) + Math.max(0, Math.floor(Number(item.qty) || 0)));
    const productSnapshots = new Map();
    for (const slug of quantities.keys()) productSnapshots.set(slug, await tx.get(db.collection('products').doc(slug)));
    const stockIssues = [];
    for (const [slug, quantity] of quantities) {
      const productSnap = productSnapshots.get(slug);
      if (!productSnap?.exists) continue;
      const product = productSnap.data();
      if (!product.trackInventory) continue;
      const currentStock = Math.max(0, Math.floor(Number(product.stock) || 0));
      if (currentStock < quantity) stockIssues.push({ slug, name: product.name || slug, requested: quantity, available: currentStock });
      tx.update(productSnap.ref, { stock: Math.max(0, currentStock - quantity), updatedAt: FieldValue.serverTimestamp() });
    }
    const paidAt = FieldValue.serverTimestamp();
    const nextStatus = order.status === 'pending payment' ? 'processing' : (order.status || 'processing');
    tx.update(orderRef, {
      paymentStatus: 'paid', status: nextStatus, paidAt,
      paystackTransactionId: String(transaction.id),
      ...(stockIssues.length ? { inventoryAdjustmentIssues: stockIssues } : {}),
      updatedAt: FieldValue.serverTimestamp()
    });
    return { order: { ...order, paymentStatus: 'paid', status: nextStatus, paidAt: new Date(), reference: ref, ...(stockIssues.length ? { inventoryAdjustmentIssues: stockIssues } : {}) }, newlyPaid: true };
  });
  if (result.newlyPaid) {
    const customer = result.order.customer || {};
    const [customerMail, adminMailResult] = await Promise.all([
      safeSendEmail({ to: customer.email, type: 'order-confirmation', data: { order: result.order, name: customer.name, reference: ref, receiptUrl: `${siteUrl()}/confirmation.html?reference=${encodeURIComponent(ref)}` } }),
      safeSendEmail({ to: adminEmail(), type: 'order-admin', data: { order: result.order, name: customer.name, reference: ref } })
    ]);
    if (!customerMail.error || !adminMailResult.error) {
      await orderRef.update({ emailConfirmationSent: !customerMail.error, adminOrderEmailSent: !adminMailResult.error, emailUpdatedAt: FieldValue.serverTimestamp() });
    }
  }
  return result.order;
}

export function safeString(value, max = 500) { return String(value ?? '').trim().slice(0, max); }
export function normalEmail(value) { const email = safeString(value, 254).toLowerCase(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : ''; }
export function timingSafeHexEqual(a, b) {
  try { const one = Buffer.from(String(a), 'hex'); const two = Buffer.from(String(b), 'hex'); return one.length === two.length && crypto.timingSafeEqual(one, two); } catch { return false; }
}
export { crypto };
