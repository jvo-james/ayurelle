import { createHash, randomBytes } from 'node:crypto';
import { json, methodNotAllowed, readJson, safeString, verifyBearer } from './_shared.mjs';
export default async request => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'POST') return methodNotAllowed();
  try {
    await verifyBearer(request, true);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return json({ error: 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in Netlify.' }, 503);
    const input = await readJson(request);
    const baseName = safeString(input.fileName || 'ayurelle-image', 100).replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 65) || 'ayurelle-image';
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'ayurelle-organics/products';
    const params = { folder, overwrite: 'true', public_id: `${baseName}-${timestamp}-${randomBytes(3).toString('hex')}`, timestamp: String(timestamp) };
    const canonical = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    const signature = createHash('sha1').update(canonical + apiSecret).digest('hex');
    return json({ cloudName, apiKey, timestamp, folder, publicId: params.public_id, overwrite: true, signature });
  } catch (error) {
    return json({ error: error.statusCode ? error.message : 'Could not prepare a secure image upload.' }, error.statusCode || 500);
  }
};
