/*
  AYURÉLLE ORGANICS IMAGE LIBRARY
  Change images here. Product page, shop cards, set-content drawers, the round
  header logo and browser icon all read from this file.
  Replace concept photography with approved Ayurélle product photos before launch.
*/
window.AYURELLE_IMAGES = {
  logoMark: 'images/logo.jpeg', // Replace this one value to change the round header logo and browser icon.
  heroBackground: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=2400&q=90',
  brandStory: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1500&q=88',
  newsletter: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=86',
  detailAccent: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1100&q=85',
  categories: {
    sets: 'images/sets.jpg',
    hair: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=86',
    mens: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=1000&q=86',
    tools: 'images/spray-bottle.svg'
  },
  products: {
    'full-hair-growth-set': 'images/sets.jpg',
    'deluxe-set': 'images/deluxe.jpg',
    'starter-set': 'images/starter.jpg',
    'ayur-shampoo': 'images/ayur-shampoo.jpeg',
    'ayur-deep-conditioner': 'images/ayur-deep-conditioner.jpg',
    'ayur-rinse-out-conditioner': 'images/ayur-rinse-out-conditioner.jpg',
    'ayur-leave-in-conditioner': 'images/ayur-leave-in-conditioner.jpeg',
    'ayur-silk-protein-mask': 'images/ayur-silk-protein-mask.jpeg',
    'ayur-hair-growth-oil': 'images/ayur-hair-growth-oil.jpeg',
    'ayur-hair-growth-butter': 'images/ayur-hair-growth-butter.jpeg',
    'ayur-hair-tea': 'images/ayur-hair-tea.jpeg',
    'ayur-scalp-detox-mist': 'images/ayur-scalp-detox-mist.jpeg',
    'ayur-beard-serum': 'images/ayur-beard-serum.jpeg',
    'derma-roller': 'images/derma-roller.jpeg',
    'satin-bonnet': 'images/bonnet-red.jpg',
    'steaming-cap': 'images/steam-cap-pink.jpg',
    'spray-bottle': 'images/spray-bottle.jpeg'
  },
  variants: {
    'satin-bonnet': {
      default: 'red',
      colors: {
        black: { label: 'Black', swatch: '#202522', image: 'images/bonnet-black.jpg' },
        red: { label: 'Red', swatch: '#a52d32', image: 'images/bonnet-red.jpg' },
        purple: { label: 'Purple', swatch: '#76608c', image: 'images/bonnet-purple.jpg' },
        pink: { label: 'Pink', swatch: '#e8a4b8', image: 'images/bonnet-pink.jpg' }
      }
    },
    'steaming-cap': {
      default: 'pink',
      colors: {
        pink: { label: 'Pink', swatch: '#e8a4b8', image: 'images/steam-cap-pink.jpg', gallery: ['images/steam-cap-pink.jpg', 'images/steam-cap-pink-item.jpg'] },
        red: { label: 'Red', swatch: '#a52d32', image: 'images/steam-cap-red.jpg', gallery: ['images/steam-cap-red.jpg', 'images/steam-cap-red-item.jpg'] }
      }
    }
  },
  galleries: {
    'ayur-hair-growth-oil': ['images/ayur-hair-growth-oil.jpeg', 'images/ayur-hair-growth-oil-multiple.jpeg'],
    'ayur-hair-growth-butter': ['images/ayur-hair-growth-butter.jpeg', 'images/ayur-hair-growth-butter-multiple.jpeg']
  }
};
