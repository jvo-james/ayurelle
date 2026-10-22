import { getAdminServices, json, methodNotAllowed } from './_shared.mjs';

const DEFAULTS = {
  pickupAddress: 'Ville Afrique, North Kaneshie',
  pickupInstructions: 'Pickup is available on Wednesdays and Saturdays. We will contact you when your order is ready. Please wait for our confirmation before travelling to collect it.',
  deliveryDays: 'Wednesday, Saturday',
  pickupDays: 'Wednesday, Saturday',
  deliveryNote: 'Delivery charges are confirmed separately after your delivery location is reviewed.',
  orderNote: 'Orders are prepared for the next available Wednesday or Saturday.'
};
const PUBLIC_FIELDS = Object.keys(DEFAULTS);

export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'GET') return methodNotAllowed(['GET']);
  try {
    const { db } = getAdminServices();
    const snapshot = await db.collection('settings').doc('store').get();
    const saved = snapshot.exists ? snapshot.data() : {};
    return json({ settings: Object.fromEntries(PUBLIC_FIELDS.map(key => [key, saved?.[key] || DEFAULTS[key]])) });
  } catch (error) {
    console.warn('Public store settings unavailable; using published defaults:', error.message);
    return json({ settings: DEFAULTS, usingDefaults: true });
  }
};
