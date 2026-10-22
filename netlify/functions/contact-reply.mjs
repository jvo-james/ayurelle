import { getAdminServices, json, methodNotAllowed, readJson, safeString, normalEmail, verifyBearer, sendEmail, adminEmail } from './_shared.mjs';

export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'POST') return methodNotAllowed();
  try {
    const admin = await verifyBearer(request, true);
    const input = await readJson(request);
    const messageId = safeString(input.messageId, 180);
    const subject = safeString(input.subject, 140).replace(/[\r\n]+/g, ' ');
    const message = safeString(input.message, 5000);
    if (!messageId || !subject || message.length < 2) return json({ error: 'Add an email subject and a reply before sending.' }, 400);
    const { db, FieldValue } = getAdminServices();
    const messageRef = db.collection('contact_messages').doc(messageId);
    const snapshot = await messageRef.get();
    if (!snapshot.exists) return json({ error: 'This enquiry could not be found. Refresh the inbox and try again.' }, 404);
    const original = snapshot.data() || {};
    const to = normalEmail(original.email);
    if (!to) return json({ error: 'This enquiry does not have a valid customer email address.' }, 400);
    await sendEmail({ to, subject, type: 'contact-reply', data: { name: safeString(original.name, 100) || 'there', subject, message }, replyTo: adminEmail() || 'ayurelleorganics@yahoo.com' });
    await messageRef.update({ status: 'replied', lastReplySubject: subject, lastReplyMessage: message, lastRepliedAt: FieldValue.serverTimestamp(), lastRepliedBy: safeString(admin.email || admin.uid, 200) });
    return json({ ok: true, message: 'Your reply has been emailed to the customer.' });
  } catch (error) {
    console.error('contact-reply:', error.message);
    const message = error.statusCode ? error.message : 'The reply could not be sent. Check the email settings and try again.';
    return json({ error: message }, error.statusCode || 500);
  }
};
