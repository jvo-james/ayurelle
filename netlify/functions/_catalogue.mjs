// Server-side fallback prices only. Once Firestore has product docs, those docs are authoritative.
export const fallbackProducts = [
  { slug: 'full-hair-growth-set', name: 'Full Hair Growth Set', category: 'sets', price: 500, size: '9-piece set' },
  { slug: 'deluxe-set', name: 'Deluxe Set', category: 'sets', price: 350, size: '6-piece set' },
  { slug: 'starter-set', name: 'Starter Set', category: 'sets', price: 200, size: '6-piece set' },
  { slug: 'ayur-shampoo', name: 'Ayur Shampoo', category: 'hair', price: 50, size: '250 ml' },
  { slug: 'ayur-deep-conditioner', name: 'Ayur Deep Conditioner', category: 'hair', price: 65, size: '250 g' },
  { slug: 'ayur-rinse-out-conditioner', name: 'Ayur Rinse-Out Conditioner', category: 'hair', price: 60, size: '250 ml' },
  { slug: 'ayur-leave-in-conditioner', name: 'Ayur Leave-In Conditioner', category: 'hair', price: 55, size: '200 ml' },
  { slug: 'ayur-silk-protein-mask', name: 'Ayur Silk Protein Mask', category: 'hair', price: 70, size: '200 g' },
  { slug: 'ayur-hair-growth-oil', name: 'Ayur Hair Growth Oil', category: 'hair', price: 75, size: '100 ml', variants: [{ id: '100ml', label: '100 ml', price: 75 }, { id: '50ml', label: '50 ml', price: 40 }] },
  { slug: 'ayur-hair-growth-butter', name: 'Ayur Hair Growth Butter', category: 'hair', price: 50, size: '200 g', variants: [{ id: '200g', label: '200 g', price: 50 }, { id: '100g', label: '100 g', price: 25 }] },
  { slug: 'ayur-hair-tea', name: 'Ayur Hair Tea', category: 'hair', price: 50, size: '100 g' },
  { slug: 'ayur-scalp-detox-mist', name: 'Ayur Scalp Detox Mist', category: 'hair', price: 25, size: '100 ml' },
  { slug: 'ayur-beard-serum', name: 'Ayur Beard Serum', category: 'mens', price: 60, size: '30 ml' },
  { slug: 'derma-roller', name: 'Derma Roller', category: 'tools', price: 70, size: '1 tool' },
  { slug: 'satin-bonnet', name: 'Satin Bonnet', category: 'tools', price: 40, size: 'One size' },
  { slug: 'steaming-cap', name: 'Steaming Cap for Deep Conditioning', category: 'tools', price: 50, size: 'One size' },
  { slug: 'spray-bottle', name: 'Spray Bottle', category: 'tools', price: 30, size: '300 ml' }
];

export const fallbackCategories = [
  { slug: 'sets', name: 'Complete Care Sets', active: true, sortOrder: 1 },
  { slug: 'hair', name: 'Hair Care Products', active: true, sortOrder: 2 },
  { slug: 'mens', name: "Men's Care", active: true, sortOrder: 3 },
  { slug: 'tools', name: 'Tools & Accessories', active: true, sortOrder: 4 }
];
