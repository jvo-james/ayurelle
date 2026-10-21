import { getAdminServices, json, methodNotAllowed, readJson, safeString, verifyBearer, sendEmail, adminEmail, siteUrl } from './_shared.mjs';
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
    const result = await Promise.allSettled([
      order.customer?.email ? sendEmail({ to: order.customer.email, type: 'order-status-user', data: { order: updated, name: order.customer.name, reference, status, receiptUrl: `${siteUrl()}/confirmation.html?reference=${encodeURIComponent(reference)}` } }) : Promise.resolve(),
      adminEmail() ? sendEmail({ to: adminEmail(), type: 'order-status-admin', data: { order: updated, reference, status, updatedBy: admin.email || admin.uid } }) : Promise.resolve()
    ]);
    const emailFailures = result.filter(item => item.status === 'rejected').length;
    return json({ ok: true, message: emailFailures ? 'Order status updated, but one or more emails could not be sent.' : 'Order status updated and email notifications sent.' });
  } catch (error) {
    console.error('order-status:', error.message);
    return json({ error: error.statusCode ? error.message : 'Could not update the order status.' }, error.statusCode || 500);
  }
};
