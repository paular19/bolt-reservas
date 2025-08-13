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

  if (process.env.NODE_ENV === "development") {
    const firestore = admin.firestore();

    //enable storage y auth cuando habilitemos eso
    //const auth = admin.auth();
    //const storage = admin.storage();
    // Connect to Firestore Emulator

    firestore.settings({
      host: "localhost",
      port: 8080,
      ssl: false, // Change this depending on your emulator setup
    });
    // Connect to Auth Emulator
    //auth.useEmulator("http://localhost:9099");
    // ✅ Connect to Auth Emulator via env var
    //process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    // Connect to Storage Emulator
    //storage.useEmulator("localhost", 9199);
    //process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";
  }
}

export default admin;
export const db = admin.firestore();
export const auth = admin.auth();
