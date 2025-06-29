import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    // databaseURL: "https://your-project-id.firebaseio.com", // if using RTDB
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
