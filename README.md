# Ayurélle Organics

A responsive botanical hair-care storefront with a product catalogue, shopping bag, secure Paystack checkout, receipt confirmation, customer email notifications and a Firebase-powered Store Studio admin console.

## Project structure

- `index.html`, `shop.html`, `product.html`, `cart.html`, `checkout.html`, `confirmation.html`, `about.html`, `contact.html`: public storefront pages.
- `admin.html`: private Store Studio interface.
- `style.css`, `admin.css`: public site design system and admin console styling.
- `script.js`, `site-enhancements.js`, `checkout-payment.js`, `confirmation.js`, `admin.js`: front-end behavior.
- `images.js`: one place to replace the brand mark, hero, product photos, galleries and colour variants.
- `firebase-config.js`: public Firebase Web App settings only.
- `firestore.rules`: baseline Firebase rules for public catalogue reads and admin-only management.
- `netlify/functions/`: server-side Firebase Admin, Cloudinary signing, Paystack payment verification, webhook processing, newsletter, contact and order status functions.
- `.env.example`: environment variable names and examples. Do not put real credentials in the repository.

## Preview and development

Use Netlify Dev to run both the website and its serverless functions locally. This project uses Node.js 20 or later.

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL shown by Netlify CLI, usually `http://localhost:8888`. Opening the HTML files directly with `file://` is suitable only for a visual preview. Firebase authentication, admin functions and payments require the local server and valid configuration.

Run available syntax checks with:

```bash
npm run check
```

## Firebase setup

1. Create a Firebase project and enable **Email/Password** under Authentication providers.
2. Register a Web App and copy its public configuration into `firebase-config.js`. These web configuration values are intended to be public. Never paste a Firebase service-account private key into this file.
3. Create a Firestore database and publish the rules in `firestore.rules`.
4. Create the first administrator using Firebase Authentication. In Firestore, add a document at `admins/{AUTH_USER_UID}` with `{ "active": true }`. The UID is the user's Firebase Authentication UID. Alternatively, assign the Firebase custom claim `admin: true` using a trusted administrative environment.
5. In Netlify environment variables, set `FIREBASE_PROJECT_ID` and `FIREBASE_SERVICE_ACCOUNT_JSON` using a service-account JSON key from Google Cloud / Firebase Admin SDK. Store the entire service account JSON as one environment variable. Never commit the key.
6. Deploy to Netlify. When the admin opens for the first time and the `products` collection is empty, Store Studio seeds the starter catalogue. Review every description, price, ingredient, direction and size before opening the shop.

The browser-side Firebase config does not grant administrator permissions by itself. The Firestore rules and server-side token checks enforce admin access. Keep the admin document protected and add administrator accounts deliberately.

## Cloudinary image uploads

Set these Netlify environment variables:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The secret is used only by `cloudinary-sign.mjs`; it is never sent to browser code. Once Firebase auth, the admin document and server-side Firebase credentials are configured, Store Studio can request a signed upload and upload images directly to Cloudinary. The image editor supports file selection, drag-and-drop and pasting clipboard images while the upload zone is focused. Uploaded HTTPS URLs are saved on the product when the product form is saved. Enable **Use repository images** to return to the images mapped in `images.js`.

Cloudinary signed uploads are restricted to logged-in authorised admins at the signing endpoint. Review Cloudinary upload presets, storage limits and account settings as part of launch.

## Paystack checkout

Set these Netlify environment variables:

- `SITE_URL`: the canonical HTTPS website URL without a trailing slash.
- `PAYSTACK_SECRET_KEY`: use a test key while testing and a live key only after verification.
- `ADMIN_NOTIFICATION_EMAIL`: email address for new-order and customer-service notifications.
- `ADMIN_EMAILS`: comma-separated admin email allowlist for privileged server functions.

The website never receives the Paystack secret key. The `paystack-initialize` function calculates prices from the server catalogue, creates a pending order and initializes a GHS transaction. The `paystack-verify` function independently verifies the provider transaction and matches reference, payment status, currency and exact amount before marking an order paid. The webhook validates Paystack's `x-paystack-signature` with HMAC SHA-512 and verifies the transaction with Paystack again. Finalisation is idempotent so a redirect and webhook retry should not send duplicate order confirmations or decrement stock twice.

In Paystack Dashboard, configure the webhook URL as:

`https://YOUR-DOMAIN/.netlify/functions/paystack-webhook`

Replace `YOUR-DOMAIN` with the deployed domain. Test with Paystack test-mode credentials and verify both successful and failed/cancelled transactions before switching to live mode. Delivery cost is deliberately not included in the online payment total; the customer is informed that it is estimated separately. The displayed checkout fee is labelled **Processing fee**.

## Resend email

Set these Netlify environment variables:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`, for example `Ayurélle Organics <orders@your-verified-domain.example>`

Verify the sending domain in Resend before production use. The email template library contains responsive HTML and plain-text content for order receipts, admin order notifications, contact-form acknowledgements, admin contact alerts, newsletter welcome messages, subscriber alerts and order status changes. `ADMIN_NOTIFICATION_EMAIL` is used as the primary store inbox. Contact and newsletter forms use Netlify Functions and display a loading state that ends on success or failure.

## Public image placeholders and previews

Edit image URLs in `images.js`. Set `logoMark` to the client's final logo URL or repo path. That value drives the rounded site logo, browser favicon, touch icon and the page's Open Graph/Twitter image meta tags when the browser loads JavaScript. Crawlers used by some social apps do not execute JavaScript, so after deployment, update the static `og:image` and `twitter:image` values in the HTML heads to an absolute HTTPS URL pointing to the final logo or approved share image. Keep the logo image at a stable URL to avoid stale browser and social preview caches.

The repository currently includes placeholder artwork plus Unsplash concept imagery. Replace those visuals with the approved product photographs before launch. The steaming-cap item images and hair growth oil/butter gallery mappings are already in `images.js`.

## Product details and inventory

The starter catalogue includes three care sets, the individual hair-care products, a beard serum and accessories. Hair growth oil and hair growth butter have separate size-priced variants. The satin bonnet starts on red, with black, purple and pink options; the steaming cap starts on pink, with red as the alternative. Its colour mapping has both storefront and item-view images.

Descriptions, sizes, ingredients, materials, directions and cautions are draft copy intended to be reviewed by the owner. Do not present sample ingredients or cosmetic claims as verified formulas. Confirm exact product labels, weights, formulations, usage instructions, warnings, pricing, inventory and delivery information before the live launch.

When inventory tracking is enabled for a product, the backend checks stock during checkout and reduces tracked stock once a payment is verified. If a payment arrives when stock has changed unexpectedly, Store Studio records an inventory adjustment issue for review instead of claiming that the payment failed.

## Admin capabilities

Store Studio provides Firebase email/password login, product create/edit/delete, the advanced product document editor, image galleries and upload controls, repository image reset, categories, stock tracking and low-stock alerts, orders and fulfilment status management, paid-sales analytics, CSV export, contact enquiries, newsletter subscribers and store preferences. It is responsive and uses realtime Firestore listeners for admin views.

## Before going live

1. Replace placeholder logo and product imagery; confirm the image file paths exist.
2. Confirm product names, prices, sizes, variants, exact ingredients and usage instructions with the owner.
3. Add real inventory counts and enable tracking where needed.
4. Configure Firebase, Firestore rules, the first admin UID and Firebase Admin service credentials.
5. Configure Cloudinary and test single image, multi-image, drag-and-drop and clipboard image uploads.
6. Verify the Resend sender domain and test emails to both customer and admin inboxes.
7. Configure Paystack test keys and the webhook URL, test payment success/cancel/failure paths and inspect stored orders. Only then switch to live keys.
8. Set a production `SITE_URL`, confirm delivery and returns policies, then test on real phones and desktop browsers.
9. Update the static social preview image URLs after the final domain is chosen. Social platforms can cache old previews, so refresh those caches when required.

**Important:** integration code is included but cannot be live-tested without the client's Firebase project, Cloudinary account, Paystack account, Resend sender domain and deployed Netlify environment. Provider-side setup and a real end-to-end test are required before accepting live payments.
