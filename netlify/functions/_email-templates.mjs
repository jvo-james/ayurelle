const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const money = value => `GH₵${Number(value || 0).toFixed(2)}`;
const lineItems = order => (order.items || []).map(item => `<tr><td style="padding:12px 0;border-bottom:1px solid #e7e2d7"><strong style="color:#173a25;font-size:13px">${esc(item.name)}</strong><div style="color:#7b8376;font-size:11px;padding-top:3px">${esc([item.size, item.colorLabel || item.color].filter(Boolean).join(' · '))} · Qty ${Number(item.qty || 1)}</div></td><td align="right" style="padding:12px 0;border-bottom:1px solid #e7e2d7;color:#173a25;font-size:13px;white-space:nowrap">${money(item.lineTotal ?? item.price * item.qty)}</td></tr>`).join('');
function layout({ eyebrow = 'AYURÉLLE ORGANICS', title, subtitle, body, buttonLabel, buttonUrl, footer = 'Feed Your Scalp. Flourish Your Crown.' }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head><body style="margin:0;padding:0;background:#f5f1e7;font-family:Arial,Helvetica,sans-serif;color:#233529"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(subtitle || title)}</div><table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5f1e7;padding:28px 10px"><tr><td align="center"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:620px;background:#fffdf7;border:1px solid #e5decc"><tr><td style="background:#123722;padding:28px 34px 25px;color:#fffdf7"><div style="font-family:Georgia,serif;font-size:31px;letter-spacing:-1px;color:#e4cb76">Ayurélle</div><div style="margin-top:3px;color:#f4ead0;font-size:9px;letter-spacing:4px">ORGANICS</div></td></tr><tr><td style="padding:34px 34px 12px"><div style="font-size:9px;letter-spacing:2.5px;font-weight:bold;color:#967c2d">${esc(eyebrow)}</div><h1 style="margin:12px 0 12px;font-family:Georgia,serif;font-size:32px;line-height:1.18;font-weight:normal;letter-spacing:-.6px;color:#173a25">${title}</h1><p style="margin:0;color:#687367;font-size:14px;line-height:1.8">${subtitle || ''}</p></td></tr><tr><td style="padding:13px 34px 32px;font-size:13px;line-height:1.85;color:#4d5a4e">${body || ''}${buttonLabel && buttonUrl ? `<p style="margin:26px 0 8px"><a href="${esc(buttonUrl)}" style="display:inline-block;padding:14px 21px;background:#173a25;color:#fffdf7;font-size:11px;font-weight:bold;letter-spacing:1px;text-decoration:none">${esc(buttonLabel)} &nbsp; →</a></p>` : ''}</td></tr><tr><td style="padding:23px 34px;background:#123722;color:#e2e8db"><div style="font-family:Georgia,serif;font-size:17px;color:#e4cb76">${esc(footer)}</div><p style="margin:10px 0 0;color:#c5cebf;font-size:10px;line-height:1.7">North Kaneshie, Accra, Ghana<br><a href="mailto:ayurelleorganics@yahoo.com" style="color:#e4cb76;text-decoration:none">ayurelleorganics@yahoo.com</a> · <a href="https://wa.me/233547446264" style="color:#e4cb76;text-decoration:none">054 744 6264</a></p></td></tr></table><div style="max-width:620px;padding:14px 10px;color:#8a9184;text-align:center;font-size:10px;line-height:1.6">You are receiving this email because you interacted with Ayurélle Organics.</div></td></tr></table></body></html>`;
}
function textVersion(title, subtitle, lines = []) { return [title, '', subtitle || '', '', ...lines, '', 'Ayurélle Organics | North Kaneshie, Accra | ayurelleorganics@yahoo.com | 054 744 6264'].filter(Boolean).join('\n'); }

export function emailTemplate(type, data = {}) {
  const order = data.order || {};
  const customer = order.customer || {};
  const name = esc(data.name || customer.name || 'there');
  const ref = esc(data.reference || order.reference || 'Pending');
  const email = esc(customer.email || data.email || '');
  const subtotal = money(order.subtotal);
  const fee = money(order.processingFee);
  const total = money(order.amountDue);
  const delivery = order.delivery || {};
  const details = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;padding:0 16px;background:#faf7ef;border:1px solid #eee7d8"><tr><td style="padding:16px 0 5px;color:#8f7a34;font-size:9px;font-weight:bold;letter-spacing:1.5px">ORDER REFERENCE</td></tr><tr><td style="padding:0 0 14px;font-family:Georgia,serif;font-size:20px;color:#173a25">${ref}</td></tr>${lineItems(order)}<tr><td colspan="2" style="padding-top:14px"><table role="presentation" width="100%"><tr><td style="padding:5px 0;color:#687367">Subtotal</td><td align="right" style="color:#173a25">${subtotal}</td></tr><tr><td style="padding:5px 0;color:#687367">Processing fee</td><td align="right" style="color:#173a25">${fee}</td></tr><tr><td style="padding:10px 0;border-top:1px solid #dcd5c6;font-weight:bold;color:#173a25">Paid total</td><td align="right" style="padding:10px 0;border-top:1px solid #dcd5c6;font-weight:bold;color:#173a25">${total}</td></tr></table></td></tr></table><p style="margin:16px 0 0;font-size:12px;color:#687367"><strong>Delivery:</strong> ${esc(delivery.method === 'pickup' ? 'Pickup in North Kaneshie' : 'Home delivery')} · ${esc([delivery.city, delivery.region].filter(Boolean).join(', '))}<br><strong>Address:</strong> ${esc(delivery.address || 'To be confirmed')}<br>Delivery charges are not included in the amount paid. We will confirm them separately.</p>`;
  let subject, html, text;
  if (type === 'order-confirmation') {
    subject = `Your Ayurélle order is confirmed · ${ref}`;
    const subtitle = `Hello ${name}, your payment has been confirmed. Thank you for choosing Ayurélle. Here is your receipt and order summary.`;
    html = layout({ eyebrow: 'PAYMENT CONFIRMED', title: 'Your order is in good hands.', subtitle, body: `${details}<p style="margin-top:20px">We will contact you if we need to clarify delivery details. Keep your reference number for any follow-up.</p>`, buttonLabel: 'View your receipt', buttonUrl: data.receiptUrl });
    text = textVersion('Your Ayurélle order is confirmed', subtitle, [`Reference: ${ref}`, `Subtotal: ${subtotal}`, `Processing fee: ${fee}`, `Paid total: ${total}`, 'Delivery fee is estimated separately.']);
  } else if (type === 'order-admin') {
    subject = `New paid Ayurélle order · ${ref}`;
    const subtitle = `A customer payment has been confirmed. Review the order details and arrange fulfilment.`;
    html = layout({ eyebrow: 'NEW PAID ORDER', title: `Order received, ${name}.`, subtitle, body: `${details}<p>Customer email: <a href="mailto:${email}" style="color:#173a25">${email || 'Not provided'}</a><br>Customer phone: ${esc(customer.phone || 'Not provided')}</p>`, buttonLabel: 'Open order management', buttonUrl: `${process.env.URL || process.env.SITE_URL || ''}/admin.html` });
    text = textVersion('New paid Ayurélle order', subtitle, [`Reference: ${ref}`, `Customer: ${name}`, `Email: ${email}`, `Paid total: ${total}`]);
  } else if (type === 'contact-user') {
    subject = 'We received your message · Ayurélle Organics';
    const subtitle = `Hello ${name}, thank you for getting in touch. Your message has reached the Ayurélle team.`;
    html = layout({ eyebrow: 'MESSAGE RECEIVED', title: 'Thank you for reaching out.', subtitle, body: `<div style="padding:18px;background:#f7f3e9;border-left:2px solid #c5a13b"><div style="font-size:9px;letter-spacing:1.5px;color:#927a31;font-weight:bold">YOUR ENQUIRY</div><p style="margin:8px 0 0;color:#4d5a4e">${esc(data.topic)}</p><p style="margin:8px 0 0;white-space:pre-wrap">${esc(data.message)}</p></div><p>We will get back to you as soon as possible during our business hours.</p>`, buttonLabel: 'Chat with us on WhatsApp', buttonUrl: 'https://wa.me/233547446264' });
    text = textVersion('We received your message', subtitle, [`Topic: ${data.topic}`, `Message: ${data.message}`]);
  } else if (type === 'contact-admin') {
    subject = `New website enquiry · ${esc(data.topic || 'General')}`;
    const subtitle = 'A visitor sent a message using the Ayurélle Organics contact form.';
    html = layout({ eyebrow: 'NEW CUSTOMER MESSAGE', title: `An enquiry from ${name}.`, subtitle, body: `<p><strong>Email:</strong> <a style="color:#173a25" href="mailto:${email}">${email}</a></p><p><strong>Topic:</strong> ${esc(data.topic)}</p><div style="padding:18px;background:#f7f3e9;border-left:2px solid #c5a13b;white-space:pre-wrap">${esc(data.message)}</div>`, buttonLabel: 'Reply by email', buttonUrl: `mailto:${encodeURIComponent(data.email || '')}?subject=${encodeURIComponent('Re: Ayurélle Organics enquiry')}` });
    text = textVersion('New website enquiry', subtitle, [`Name: ${name}`, `Email: ${email}`, `Topic: ${data.topic}`, `Message: ${data.message}`]);
  } else if (type === 'newsletter-welcome') {
    subject = 'A little note from Ayurélle Organics';
    const subtitle = 'Thank you for joining our mailing list. We will share new arrivals, product updates and practical hair-care notes from time to time.';
    html = layout({ eyebrow: 'YOU ARE ON THE LIST', title: 'A note from our corner.', subtitle, body: '<p>We are glad you are here. Expect thoughtful updates, useful product information and news from Ayurélle, without the clutter.</p>', buttonLabel: 'Explore the collection', buttonUrl: `${process.env.URL || process.env.SITE_URL || ''}/shop.html` });
    text = textVersion('You are subscribed to Ayurélle', subtitle);
  } else if (type === 'newsletter-admin') {
    subject = 'New Ayurélle newsletter subscriber';
    const subtitle = 'A visitor subscribed to the Ayurélle Organics email list.';
    html = layout({ eyebrow: 'MAILING LIST UPDATE', title: 'A new subscriber joined.', subtitle, body: `<div style="padding:17px;background:#f7f3e9;color:#173a25;font-size:15px">${email}</div>` });
    text = textVersion('New newsletter subscriber', subtitle, [email]);
  } else if (type === 'order-status-user') {
    subject = `An update on your Ayurélle order · ${ref}`;
    const status = esc(data.status || 'updated');
    const subtitle = `Hello ${name}, your order status has been updated to: ${status}.`;
    html = layout({ eyebrow: 'ORDER UPDATE', title: 'A quick update for you.', subtitle, body: `${details}<p>If you have questions about delivery or your order, reply to this email or contact our team.</p>`, buttonLabel: 'View receipt and order details', buttonUrl: data.receiptUrl });
    text = textVersion('Your order has been updated', subtitle, [`Reference: ${ref}`, `Status: ${status}`]);
  } else if (type === 'order-status-admin') {
    subject = `Order status updated · ${ref}`;
    const subtitle = `Order ${ref} status has been changed to ${esc(data.status)}.`;
    html = layout({ eyebrow: 'ORDER STATUS CHANGE', title: 'Store order updated.', subtitle, body: `${details}<p>Updated by: ${esc(data.updatedBy || 'Authorised store admin')}</p>`, buttonLabel: 'Open order management', buttonUrl: `${process.env.URL || process.env.SITE_URL || ''}/admin.html` });
    text = textVersion('Order status updated', subtitle, [`Reference: ${ref}`, `Status: ${data.status}`]);
  } else {
    subject = 'Ayurélle Organics update';
    const subtitle = 'A new update from Ayurélle Organics.';
    html = layout({ title: 'A note from Ayurélle.', subtitle, body: '' });
    text = textVersion(subject, subtitle);
  }
  return { subject, html, text };
}
