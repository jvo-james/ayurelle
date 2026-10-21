import { getAdminServices, json, methodNotAllowed, readJson, safeString, normalEmail, adminEmail, sendEmail } from './_shared.mjs';
export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'POST') return methodNotAllowed();
  try {
    const input = await readJson(request);
    if (input.website) return json({ message: 'Thank you. Your message has been received.' }); // Honeypot
    const name = safeString(input.name, 100);
    const email = normalEmail(input.email);
    const topic = safeString(input.topic, 120);
    const message = safeString(input.message, 4000);
    if (!name || !email || !topic || message.length < 5) return json({ error: 'Please complete every field with a valid email address.' }, 400);
    if (!adminEmail()) return json({ error: 'The store notification address is not configured. Please email ayurelleorganics@yahoo.com directly.' }, 503);
    const { db, FieldValue } = getAdminServices();
    await db.collection('contact_messages').add({ name, email, topic, message, status: 'new', createdAt: FieldValue.serverTimestamp() });
    await Promise.all([
      sendEmail({ to: email, replyTo: 'ayurelleorganics@yahoo.com', type: 'contact-user', data: { name, email, topic, message } }),
      sendEmail({ to: adminEmail(), replyTo: email, type: 'contact-admin', data: { name, email, topic, message } })
    ]);
    return json({ message: 'Your message has been sent. A confirmation is on its way to your inbox.' });
  } catch (error) {
    console.error('contact:', error.message);
    return json({ error: error.message.includes('not configured') ? error.message : 'We could not send your message just now. Please email ayurelleorganics@yahoo.com.' }, error.statusCode || 500);
  }
};
