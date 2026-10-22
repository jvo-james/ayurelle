import { randomUUID } from 'node:crypto';
import { getAdminServices, json, methodNotAllowed, readJson, safeString, normalEmail, verifyBearer, fromEmail, resendClient, siteUrl } from './_shared.mjs';
import { emailTemplate } from './_email-templates.mjs';

export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'POST') return methodNotAllowed();
  let sent = 0;
  try {
    await verifyBearer(request, true);
    const input = await readJson(request);
    const subject = safeString(input.subject, 150).replace(/[\r\n]+/g, ' ');
    const headline = safeString(input.headline, 100);
    const message = safeString(input.message, 8000);
    const buttonLabel = safeString(input.buttonLabel, 40);
    const buttonPath = safeString(input.buttonPath, 300);
    if (!subject || !headline || message.length < 5) return json({ error: 'Add an email subject, headline and message before sending.' }, 400);
    const base = (siteUrl() || new URL(request.url).origin).replace(/\/$/, '');
    let buttonUrl = '';
    if (buttonPath && buttonLabel) {
      let parsed;
      try { parsed = new URL(buttonPath, `${base}/`); } catch { return json({ error: 'The button link is not valid.' }, 400); }
      if (parsed.origin !== new URL(base).origin || parsed.pathname.endsWith('/admin.html')) return json({ error: 'The email button must link to a public page on this website.' }, 400);
      buttonUrl = parsed.href;
    }
    const { db } = getAdminServices();
    const snapshot = await db.collection('newsletter_subscribers').where('status', '==', 'subscribed').get();
    const recipients = [...new Set(snapshot.docs.map(doc => normalEmail(doc.data()?.email)).filter(Boolean))];
    if (!recipients.length) return json({ ok: true, sent: 0, message: 'There are no active subscribers to email yet.' });
    const rendered = emailTemplate('newsletter-campaign', { subject, headline, message, buttonLabel, buttonUrl });
    const resend = resendClient();
    const campaignId = randomUUID();
    const BATCH_SIZE = 100;
    for (let start = 0; start < recipients.length; start += BATCH_SIZE) {
      const chunk = recipients.slice(start, start + BATCH_SIZE);
      const emails = chunk.map(to => ({ from: fromEmail(), to: [to], subject: rendered.subject, html: rendered.html, text: rendered.text }));
      const { error } = await resend.batch.send(emails, { idempotencyKey: `${campaignId}-chunk-${Math.floor(start / BATCH_SIZE)}` });
      if (error) {
        console.error('Newsletter campaign batch failed:', error.message);
        return json({ error: sent ? `The campaign was partly sent to ${sent} subscribers. The remaining batch could not be sent. Please review the email service before retrying.` : 'The email service could not send this campaign. Please check the email settings and try again.', sent }, 502);
      }
      sent += chunk.length;
    }
    return json({ ok: true, sent, message: `Your email has been sent to ${sent} active subscriber${sent === 1 ? '' : 's'}. The admin inbox was not copied.` });
  } catch (error) {
    console.error('newsletter-campaign:', error.message);
    return json({ error: error.statusCode ? error.message : 'The email campaign could not be sent. Check the email settings and try again.', sent }, error.statusCode || 500);
  }
};
