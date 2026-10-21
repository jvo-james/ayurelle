# Ayurélle Organics storefront

A responsive static storefront prototype for Ayurélle Organics. It uses plain HTML, CSS and JavaScript so the site can be hosted on any static web host or connected to a later commerce backend.

## Files

- `index.html` is the homepage and full-screen hero.
- `shop.html` is the searchable, filterable product catalogue.
- `product.html` is a reusable product detail page driven by the `slug` query parameter.
- `cart.html` and `checkout.html` are the basket and WhatsApp order handoff.
- `about.html` and `contact.html` contain the brand and contact information.
- `style.css` contains the full responsive design system.
- `script.js` contains the catalogue data and front-end interactions.
- `images.js` centralises image URLs for the logo, hero, editorial sections, product images and colour variants.
- `images/` holds the default round logo mark and simple colour-specific placeholder artwork for the bonnet and steaming cap.

## Preview locally

For the simplest preview, open `index.html` in a browser. For more reliable local navigation and image testing, run a static server from this folder, for example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Edit imagery

Edit `images.js`. Set `logoMark` to the actual logo image path or URL when it is available. The same mapping supplies the site favicon, touch icon and visible logo mark in a normal browser. Replace the `heroBackground`, `brandStory`, category image URLs and the values in `products` with the client's approved imagery. Product image keys match the product `slug` values in `script.js`. For the bonnet and steaming cap, keep `variants` keys in place and replace each colour's image URL to preserve the colour selector functionality.

The current Unsplash imagery is visual placeholder content, not product photography. The simple SVG bonnet, cap, spray bottle and derma roller illustrations are also placeholders.

The HTML heads include placeholder Open Graph and Twitter image tags for link previews. Social preview services often read the raw HTML without running JavaScript, so after the final domain and logo are known, set `og:image` and `twitter:image` in each HTML file to the absolute public logo URL. Keeping the final logo at `images/ayurelle-mark.svg` also preserves the existing static fallback path.

## Product catalogue and draft copy

The catalogue contains the three complete care sets and the supplied hair-care products, men's beard serum and tools/accessories. The second price for hair growth oil and hair growth butter is represented as a smaller size option. The satin bonnet defaults to red and the deep-conditioning steaming cap defaults to pink.

Descriptions, dimensions, directions and ingredient lists are draft placeholders written to help the layout feel complete. Confirm all sizes, exact ingredient lists, usage instructions, warnings, product claims and packaging details with the owner before publishing. Do not publish placeholder ingredients as if they were verified formulas. The product copy avoids claims that a cosmetic product can guarantee hair growth or treat a medical condition.

## Orders and payments

The basket uses browser `localStorage`. Checkout prepares an order message that the customer can review and send through WhatsApp. **This is not a production checkout or payment integration.** It does not charge a customer, reserve stock, calculate delivery fees or send an order to a database. For live sales, connect a trusted backend and payment provider such as Paystack, implement server-side order validation, then test payment notifications, refunds, privacy and order management.

## Before launch checklist

1. Replace all sample image URLs in `images.js` with approved Ayurélle product photography and the real logo.
2. Confirm all product prices, variants, dimensions, ingredients and directions.
3. Confirm stock counts, delivery areas, delivery fees, pickup arrangements and the returns policy.
4. Confirm the correct social links and contact information.
5. Add the final domain and site URL to social metadata if needed.
6. Connect a real payment system and secure order management before accepting live online payments.
7. Test all flows on common phone sizes and desktop browsers.
