// backend/firebaseAdmin.js - Admin SDK init
require('dotenv').config();  // Load env vars (add if not already in your app entry)

const admin = require('firebase-admin');

// Build service account object from env vars
const serviceAccount = {
  type: process.env.SERVICE_ACCOUNT_TYPE,
  project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Unescape \n to actual newlines
  client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
};

// Validate (optional - for debugging)
if (!serviceAccount.private_key || serviceAccount.private_key.includes('undefined')) {
  throw new Error('Missing or invalid SERVICE_ACCOUNT_PRIVATE_KEY in .env');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'school-managment-a3ade'  // Fallback to your existing env
  });
}

module.exports = admin;