/*
  PUBLIC Firebase Web SDK settings.
  These values are not secret. Replace them with the Web App config from
  Firebase Console > Project settings > Your apps. NEVER put service-account
  credentials or private API secrets in this file.
*/
window.AYURELLE_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDPp5-AQt5XkCv2TIPwlp8IMR1JLMKzKXo',
  authDomain: 'ayurelle-organics.firebaseapp.com',
  projectId: 'ayurelle-organics',
  storageBucket: 'ayurelle-organics.firebasestorage.app',
  messagingSenderId: '16381388066',
  appId: '1:16381388066:web:e2937073527661cf10717b'
};

/* Informational admin contact list only. Actual access is controlled by the
   admins/{uid} Firestore membership document or admin custom claim and by
   the matching server-side ADMIN_EMAILS environment variable. */
window.AYURELLE_ADMIN_CONFIG = {
  adminEmails: ['ayurelleorganics@yahoo.com']
};

/* Public Cloudinary identifier only. The API secret stays in Netlify env vars. */
window.AYURELLE_CLOUDINARY_CONFIG = {
  cloudName: 'fhrdojhi'
};
