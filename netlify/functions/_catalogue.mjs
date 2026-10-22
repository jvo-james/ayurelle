
export const fallbackProductGuidance = {
  "full-hair-growth-set": {
    "directions": "Use each item in the set according to its own product directions. On wash day, cleanse first, then choose the conditioner or treatment best suited to your routine. Apply leave-in products and styling moisturisers in small amounts as directed.",
    "caution": "Read the directions and cautions for every item in the set. For external use only unless a product label clearly states otherwise. Avoid eye contact and stop using any item that causes irritation."
  },
  "deluxe-set": {
    "directions": "Use each item according to its own product directions. Cleanse first, then use the deep conditioner or other conditioning step as directed. Finish with leave-in products in small amounts, following each label.",
    "caution": "Read the directions and cautions for every item in the set. Avoid eye contact and stop using any item that causes irritation."
  },
  "starter-set": {
    "directions": "Use each item according to its own product directions. Start with shampoo and rinse-out conditioner, then use leave-in products in small amounts. Follow the instructions printed on the individual labels.",
    "caution": "Read the directions and cautions for every item in the set. Avoid eye contact and stop using any item that causes irritation."
  },
  "ayur-shampoo": {
    "directions": "Wet hair and scalp thoroughly. Apply a small amount and massage gently with fingertips, without scratching. Rinse completely and repeat only if needed. Follow with a rinse-out conditioner.",
    "caution": "For external use only. Avoid contact with eyes. Rinse thoroughly with clean water if contact occurs. Stop use if irritation develops."
  },
  "ayur-deep-conditioner": {
    "directions": "After shampooing, apply to clean, damp hair, concentrating on the lengths and ends. Leave on only for the duration stated on the product label, then rinse thoroughly.",
    "caution": "For external use only. Avoid contact with eyes. Rinse thoroughly if contact occurs and stop use if irritation develops."
  },
  "ayur-rinse-out-conditioner": {
    "directions": "After shampooing, smooth through damp hair, concentrating on the lengths and ends. Detangle gently with fingers or a wide-tooth comb, then rinse thoroughly.",
    "caution": "For external use only. Avoid contact with eyes. This is a rinse-out product, so do not leave it in the hair unless the final label expressly says to do so."
  },
  "ayur-leave-in-conditioner": {
    "directions": "Apply a small amount to clean, damp hair. Smooth evenly through the lengths and ends, adding more only if needed. Do not rinse out. Follow any additional directions on the product label.",
    "caution": "For external use only. Avoid contact with eyes. Start with a small amount and stop use if irritation develops. Do not use as a skin treatment."
  },
  "ayur-silk-protein-mask": {
    "directions": "After cleansing, apply to damp hair and distribute through the lengths and ends. Leave on for the time stated on the final product label, then rinse thoroughly.",
    "caution": "For external use only. Avoid contact with eyes. Use only as directed on the final label and stop use if irritation develops."
  },
  "ayur-hair-growth-oil": {
    "directions": "Apply a small amount to the scalp or hair lengths as appropriate for the product label. Massage gently if applying to the scalp and smooth sparingly over the lengths and ends. Avoid applying more than needed.",
    "caution": "For external use only. Avoid contact with eyes and do not swallow. If you have a sensitive scalp, test a small area first. Stop use if redness, itching or irritation develops. The product name is not a guarantee of hair growth."
  },
  "ayur-hair-growth-butter": {
    "directions": "Warm a small amount between the palms and smooth through the lengths and ends of dry or slightly damp hair. Begin with a little product and add more only if needed.",
    "caution": "For external use only. Avoid contact with eyes. Stop use if irritation develops and keep the container closed when not in use."
  },
  "ayur-hair-tea": {
    "directions": "Prepare the blend according to the product packaging. Allow the infusion to cool completely and strain it before applying to hair or scalp as directed. If storing a prepared infusion, follow the package storage instructions and discard it after the stated storage period or sooner if its appearance or smell changes. This is a hair-care product, not a drink.",
    "caution": "For external use only. Do not consume. Allow the infusion to cool completely before application and avoid contact with eyes. Stop use if irritation develops."
  },
  "ayur-scalp-detox-mist": {
    "directions": "Use on the intended hair or scalp area in accordance with the final product label. Apply a light amount and keep the spray away from the eyes and face.",
    "caution": "For external use only. Avoid inhaling the mist and keep away from eyes. Stop use if irritation develops. Store closed and away from excessive heat."
  },
  "ayur-beard-serum": {
    "directions": "Place two or three drops in the palm, rub hands together and smooth through a clean, dry or slightly damp beard. Start with less for short beards. Follow the final label for frequency of use.",
    "caution": "For external use only. Avoid the eyes, mouth and broken skin. Test a small area first if your skin is sensitive and stop use if irritation develops."
  },
  "derma-roller": {
    "directions": "Use only in line with the instructions supplied for this exact tool. If clear instructions are not included, contact the seller or manufacturer before use. Do not roll over the scalp or skin unless the manufacturer confirms the intended area and method.",
    "caution": "This tool is not a treatment for hair loss. Do not use on irritated, infected, inflamed or broken skin. Never share it. Do not use a damaged tool or one with bent needles. Home devices that puncture skin can cause infection or scarring; seek advice from a qualified healthcare professional before any skin-penetrating use."
  },
  "satin-bonnet": {
    "directions": "Gather hair gently and place the bonnet over it without pulling or tightening the hairline. Adjust for a comfortable fit. Clean and dry the bonnet according to the fabric care guidance supplied with the item.",
    "caution": "Stop wearing it if the band causes pressure or discomfort. Keep fabric away from open flames and follow any care instructions supplied with the item."
  },
  "steaming-cap": {
    "directions": "Apply a hair treatment according to that treatment label. With the cap unplugged, place it over the hair and use only the settings and duration stated in the instruction leaflet supplied with this exact cap. Switch off and unplug before removing or storing it, then allow it to cool fully.",
    "caution": "Electrical heat accessory: confirm the supplied instructions, correct voltage and use duration before first use. Keep the controller, plug and cord dry. Do not use near water, while asleep or unattended. Never use if the cap, cable or plug is damaged. Stop immediately if it becomes uncomfortably hot."
  },
  "spray-bottle": {
    "directions": "Fill with water or a liquid confirmed as compatible with the bottle. Secure the nozzle, test the spray away from the face and label the contents clearly. Empty and rinse the bottle between different products.",
    "caution": "Do not fill with hot liquids, solvents or incompatible chemicals. Never use an unlabelled bottle for food or drink. Keep away from children and avoid spraying toward the eyes."
  }
};

// Server-side fallback prices only. Once Firestore has product docs, those docs are authoritative.
export const fallbackProducts = [
  { slug: 'full-hair-growth-set', name: 'Full Hair Growth Set', category: 'sets', price: 500, size: '9-piece set' },
  { slug: 'deluxe-set', name: 'Deluxe Set', category: 'sets', price: 350, size: '6-piece set' },
  { slug: 'starter-set', name: 'Starter Set', category: 'sets', price: 200, size: '6-piece set' },
  { slug: 'ayur-shampoo', name: 'Ayur Shampoo', category: 'hair', price: 50, size: '250 ml' },
  { slug: 'ayur-deep-conditioner', name: 'Ayur Deep Conditioner', category: 'hair', price: 65, size: '250 ml' },
  { slug: 'ayur-rinse-out-conditioner', name: 'Ayur Rinse-Out Conditioner', category: 'hair', price: 60, size: '250 ml' },
  { slug: 'ayur-leave-in-conditioner', name: 'Ayur Leave-In Conditioner', category: 'hair', price: 55, size: '250 ml' },
  { slug: 'ayur-silk-protein-mask', name: 'Prodiva Protein Mask', category: 'hair', price: 70, size: '250 ml' },
  { slug: 'ayur-hair-growth-oil', name: 'Ayur Hair Growth Oil', category: 'hair', price: 75, size: '100 ml' },
  { slug: 'ayur-hair-growth-butter', name: 'Ayur Hair Growth Butter', category: 'hair', price: 50, size: '250 ml' },
  { slug: 'ayur-hair-tea', name: 'Ayur Hair Tea', category: 'hair', price: 50, size: '200 g' },
  { slug: 'ayur-scalp-detox-mist', name: 'Rosemary Water Spray', category: 'hair', price: 25, size: '100 ml' },
  { slug: 'ayur-beard-serum', name: 'Ayur Beard Serum', category: 'mens', price: 60, size: '30 ml' },
  { slug: 'derma-roller', name: 'Derma Roller', category: 'tools', price: 70, size: '1 tool' },
  { slug: 'satin-bonnet', name: 'Satin Bonnet', category: 'tools', price: 40, size: 'One size' },
  { slug: 'steaming-cap', name: 'Steaming Cap for Deep Conditioning', category: 'tools', price: 50, size: 'One size' },
  { slug: 'spray-bottle', name: 'Spray Bottle', category: 'tools', price: 30, size: '300 ml' }
];

fallbackProducts.forEach(product => Object.assign(product, fallbackProductGuidance[product.slug] || {}));

export const fallbackCategories = [
  { slug: 'sets', name: 'Complete Care Sets', active: true, sortOrder: 1 },
  { slug: 'hair', name: 'Hair Care Products', active: true, sortOrder: 2 },
  { slug: 'mens', name: "Men's Care", active: true, sortOrder: 3 },
  { slug: 'tools', name: 'Tools & Accessories', active: true, sortOrder: 4 }
];
