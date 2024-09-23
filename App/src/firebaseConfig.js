import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  projectId: "PROJECD_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "APP_ID",
  measurementId: "MEASUREMENT_ID",
};

// Initialize Firebase Client SDK
const app = initializeApp(firebaseConfig);

export default app;
