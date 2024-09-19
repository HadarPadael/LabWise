import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCwQQRvuR60mB0VUUyKHuS4Z2L7IMz-lz0",
  authDomain: "labwise-349cc.firebaseapp.com",
  projectId: "labwise-349cc",
  storageBucket: "labwise-349cc.appspot.com",
  messagingSenderId: "811347020612",
  appId: "1:811347020612:web:36801c5209527e69cce511",
  measurementId: "G-F5BH15WBWT",
};

// Initialize Firebase Client SDK
const app = initializeApp(firebaseConfig);

export default app;
