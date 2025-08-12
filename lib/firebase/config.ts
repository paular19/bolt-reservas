import admin from "firebase-admin";

var serviceAccount = require("../../googlekey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    // If you have a service account JSON file, you can do:
    // credential: admin.credential.cert(require('/path/to/serviceAccountKey.json')),

    // Or if you want to initialize with default credentials (e.g., if running on GCP)
    credential: admin.credential.cert(serviceAccount),
    // Optionally specify your projectId
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export default admin;
export const db = admin.firestore();
export const auth = admin.auth();
