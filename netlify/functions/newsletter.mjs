import { createHash } from 'node:crypto';
import { getAdminServices, json, methodNotAllowed, readJson, normalEmail, adminEmail, sendEmail } from './_shared.mjs';
export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'POST') return methodNotAllowed();
  try {
    const input = await readJson(request);
    if (input.website) return json({ message: 'Thanks for subscribing.' });
    const email = normalEmail(input.email);
    if (!email) return json({ error: 'Enter a valid email address to subscribe.' }, 400);
    if (!adminEmail()) return json({ error: 'Newsletter notifications are not configured yet.' }, 503);
    const { db, FieldValue } = getAdminServices();
    const id = createHash('sha256').update(email).digest('hex');
    const ref = db.collection('newsletter_subscribers').doc(id);
    const existing = await ref.get();
    if (existing.exists && existing.data().status === 'subscribed') return json({ message: 'You are already subscribed. Thank you for staying in touch.' });
    await ref.set({ email, status: 'subscribed', source: 'website', subscribedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    await Promise.all([
      sendEmail({ to: email, type: 'newsletter-welcome', data: { email } }),
      sendEmail({ to: adminEmail(), type: 'newsletter-admin', data: { email } })
    ]);
    return json({ message: 'You are on the list. Please check your inbox for a welcome note.' });
  } catch (error) {
    console.error('newsletter:', error.message);
    return json({ error: 'Subscription could not be completed right now. Please try again later.' }, error.statusCode || 500);
  }
};
