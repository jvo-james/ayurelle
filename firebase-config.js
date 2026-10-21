/*
  PUBLIC Firebase Web SDK settings.
  These values are not secret. Replace them with the Web App config from
  Firebase Console > Project settings > Your apps. NEVER put service-account
  credentials or private API secrets in this file.
*/
window.AYURELLE_FIREBASE_CONFIG = {
  apiKey: 'REPLACE_WITH_FIREBASE_WEB_API_KEY',
  authDomain: 'REPLACE_WITH_PROJECT_ID.firebaseapp.com',
  projectId: 'REPLACE_WITH_PROJECT_ID',
  storageBucket: 'REPLACE_WITH_PROJECT_ID.appspot.com',
  messagingSenderId: 'REPLACE_WITH_SENDER_ID',
  appId: 'REPLACE_WITH_FIREBASE_APP_ID'
};

/* Informational admin contact list only. Actual access is controlled by the
   admins/{uid} Firestore membership document or admin custom claim, and by
   the matching server-side ADMIN_EMAILS environment variable. */
window.AYURELLE_ADMIN_CONFIG = {
  adminEmails: ['REPLACE_WITH_ADMIN_EMAIL']
};

/* Public Cloudinary identifier only. The API secret stays in Netlify env vars. */
window.AYURELLE_CLOUDINARY_CONFIG = {
  cloudName: 'REPLACE_WITH_CLOUDINARY_CLOUD_NAME'
};
