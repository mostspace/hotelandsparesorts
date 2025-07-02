import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Only initialize Firebase on the client (not during SSR/SSG)
let app: ReturnType<typeof initializeApp> | undefined = undefined;
let analytics: ReturnType<typeof getAnalytics> | null = null;
let auth: ReturnType<typeof getAuth> | undefined = undefined;
let db: ReturnType<typeof getFirestore> | undefined = undefined;
let storage: ReturnType<typeof getStorage> | undefined = undefined;

if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey: "AIzaSyB1MfzNodtcjzIG3ko-9iO5g6NaQZpkMco",
    authDomain: "hotel-spa-resorts.firebaseapp.com",
    projectId: "hotel-spa-resorts",
    storageBucket: "hotel-spa-resorts.firebasestorage.app",
    messagingSenderId: "466979782603",
    appId: "1:466979782603:web:4b14e0dc27b33089e2c04e",
    measurementId: "G-TWG9QN7LB6"
  };

  app = initializeApp(firebaseConfig);

  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app!);
    }
  });

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { auth, analytics, db, storage };
