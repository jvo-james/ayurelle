import { getAdminServices, json, methodNotAllowed, readJson, safeString, verifyBearer, sendEmail, siteUrl } from './_shared.mjs';
const ALLOWED = new Set(['processing', 'preparing', 'ready for pickup', 'dispatched', 'delivered', 'cancelled']);
export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'POST') return methodNotAllowed();
  try {
    const admin = await verifyBearer(request, true);
    const input = await readJson(request);
    const reference = safeString(input.reference, 120);
    const status = safeString(input.status, 40).toLowerCase();
    if (!reference || !ALLOWED.has(status)) return json({ error: 'Choose a valid order status.' }, 400);
    const { db, FieldValue } = getAdminServices();
    const ref = db.collection('orders').doc(reference);
    const snap = await ref.get();
    if (!snap.exists) return json({ error: 'Order not found.' }, 404);
    const order = snap.data();
    if (order.paymentStatus !== 'paid' && !['cancelled'].includes(status)) return json({ error: 'Only paid orders can move into fulfilment statuses.' }, 409);
    if (order.status === status) return json({ ok: true, message: 'The order already has this status.' });
    await ref.update({ status, updatedAt: FieldValue.serverTimestamp(), statusUpdatedBy: admin.email || admin.uid });
    const updated = { ...order, reference, status };
    let emailFailed = false;
    // Status changes notify the customer only. Do not add the store/admin
    // notification address, CC, or BCC here. Admin order emails are reserved
    // for new paid orders in the checkout confirmation flow.
    const customerEmail = safeString(order.customer?.email, 254).toLowerCase();
    if (customerEmail) {
      try {
        await sendEmail({
          to: [customerEmail],
          type: 'order-status-user',
          data: { order: updated, name: order.customer?.name, reference, status, receiptUrl: `${siteUrl()}/confirmation.html?reference=${encodeURIComponent(reference)}` }
        });
      } catch (emailError) {
        emailFailed = true;
        console.error('Customer order-status email could not be sent:', emailError.message);
      }
    }
    return json({ ok: true, message: emailFailed ? 'Order status updated, but the customer email could not be sent.' : 'Order status updated. The customer has been notified.' });
  } catch (error) {
    console.error('order-status:', error.message);
    return json({ error: error.statusCode ? error.message : 'Could not update the order status.' }, error.statusCode || 500);
  }
};
