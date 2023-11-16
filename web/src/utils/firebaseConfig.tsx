import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeApp } from "firebase/app";

const firebaseConfig = { 
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ?? "",
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ?? "",
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL ?? "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID ?? "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID ?? "",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ?? ""
};

// Initialize Firebase and get the analytics instance
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const emitAnalyticsLog = (event: string) => {
    if (process.env.NODE_ENV === "production") {
        return logEvent(analytics, event);
    }
    console.log("No analytics for development env");
}

export { app, analytics, emitAnalyticsLog };
