// Import necessary Firebase functions with proper TypeScript support
import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Define the Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDU1nM0QE3T8ugK9t9W2W1xQNDWyoJ4Zlo",
  authDomain: "aitripplanner-123rs.firebaseapp.com",
  projectId: "aitripplanner-123rs",
  storageBucket: "aitripplanner-123rs.appspot.com", // ✅ Fix storageBucket URL
  messagingSenderId: "971528936155",
  appId: "1:971528936155:web:35b0428f3a9cce7f900afe",
  measurementId: "G-C9D7HNLR1D",
};

// Initialize Firebase App
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Initialize Analytics (Only in Client-Side)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Export instances for use in other files
export { app, db, analytics };
