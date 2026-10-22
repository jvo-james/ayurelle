# Ayurèlle Organics

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
- `RESEND_FROM_EMAIL`, for example `Ayurèlle Organics <orders@your-verified-domain.example>`

Verify the sending domain in Resend before production use. The email template library contains responsive HTML and plain-text content for order receipts, admin order notifications, contact-form acknowledgements, admin contact alerts, newsletter welcome messages, subscriber alerts and order status changes. `ADMIN_NOTIFICATION_EMAIL` is used as the primary store inbox. Contact and newsletter forms use Netlify Functions and display a loading state that ends on success or failure.

## Storefront imagery and product details

Product photography and gallery mappings are managed in the repository assets and `images.js`. That file controls the brand mark, homepage hero, product photography, product galleries and colour variants. Social platforms do not always execute JavaScript, so after the production domain is selected, set the static `og:image` and `twitter:image` metadata in each HTML head to an absolute HTTPS share-image URL.

The catalogue copy, prices, pack sizes, directions, cautions and set contents are maintained in `script.js` and can be edited through Store Studio. Ingredient fields are intentionally blank until the owner enters the approved ingredient text; the product page hides the complete Ingredients section while that field is empty. The Ayur Hair Growth Oil is sold in one 100 ml size, the Hair Growth Butter and Prodiva Protein Mask are shown as 250 ml items, both conditioners have corrected 250 ml sizes and Ayur Hair Tea is shown as 200 g based on the package images reviewed for this update.

Before advertising a cosmetic benefit or publishing ingredient claims, use the exact current product label as the source of truth. Keep price, quantity, directions and caution information aligned with the physical packaging.

## Inventory and fulfilment

Store Studio supports product visibility, stock tracking and low-stock alerts. When tracking is enabled, the backend checks available stock during checkout and reduces tracked stock after a payment is verified. If stock changes unexpectedly before payment verification, the order records an inventory adjustment issue for review.

Checkout supports home delivery and pickup. The next available date is calculated using the configured delivery or pickup weekdays; the default schedule is Wednesday and Saturday. Store Studio can edit the weekdays, pickup address, pickup instructions, delivery note and order-preparation note. The pickup address defaults to **Ville Afrique, North Kaneshie**. Customers see their chosen fulfilment method, scheduled date and relevant instructions in the confirmation page and receipt/email.

## Admin capabilities

Store Studio provides email/password login, friendly product editing, image galleries and upload controls, curated set contents, categories, stock tracking and low-stock alerts, order detail drawers and fulfilment status updates, paid-sales analytics, CSV export, contact enquiries, newsletter subscribers, editable fulfilment settings and sign-in detail changes. It uses realtime database listeners for admin views and restores an existing sign-in session after page reload.

## Production checklist

1. Configure Firebase Authentication with Email/Password, create Firestore and publish `firestore.rules`.
2. Create the authorised admin record at `admins/{AUTH_USER_UID}` with `{ "active": true }`, or grant the equivalent trusted `admin: true` claim.
3. Add `FIREBASE_PROJECT_ID` and `FIREBASE_SERVICE_ACCOUNT_JSON` as private Netlify environment variables. Put only public Web App configuration in `firebase-config.js`.
4. Set the required Netlify variables for Paystack, Resend and the canonical `SITE_URL`. Configure a verified Resend sending domain and the Paystack webhook at `https://YOUR-DOMAIN/.netlify/functions/paystack-webhook`.
5. Configure Cloudinary credentials if the owner will upload custom product images from Store Studio.
6. Confirm the visible prices and packaging quantities with the current product labels, enter the actual opening stock figures if inventory tracking is enabled and save the approved ingredients/directions for the products that need them.
7. Test delivery and pickup on a Wednesday/Thursday/Friday/Saturday transition, successful and failed Paystack test transactions, order confirmation emails, status-change emails, newsletter/contact submissions and the admin experience on a phone and desktop. Switch to live payment credentials only after those checks pass.

**Provider setup is required before live transactions and emails can run.** The repository includes the integration code, but Firebase, Paystack, Resend and Cloudinary must be configured with the owner's production accounts and tested on the deployed Netlify site.


## Search engine setup

The public pages include page-specific descriptions, canonical URLs, social preview metadata and structured data. The product page updates its title, description and Product JSON-LD using the current catalogue, including products added through the admin dashboard. The public sitemap is served at `/sitemap.xml` and the crawler rules are served at `/robots.txt`. The sitemap includes public shop pages and active product URLs; the private admin, cart, checkout and confirmation pages are excluded.

After the site is deployed to its final HTTPS domain:

1. Set `SITE_URL` in Netlify to the exact public origin, for example `https://www.example.com`, without a trailing slash.
2. Open `https://your-domain/sitemap.xml` and confirm it returns valid XML with the final domain.
3. Open `https://your-domain/robots.txt` and confirm it points to that sitemap.
4. Add the final domain property in Google Search Console, complete Google's ownership verification and submit `/sitemap.xml`.
5. Use URL Inspection and Google's Rich Results Test to check important pages. Search appearances and indexing are decided by Google and are not guaranteed simply by adding SEO metadata.

Product structured data is generated client-side because the storefront is a static app backed by a live catalogue. Google recommends including product markup in initial HTML where feasible, so validate the deployed product pages and their price and availability data after launch. See [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [Product structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/product).
