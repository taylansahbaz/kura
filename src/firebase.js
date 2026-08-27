import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC_kK4-7Q8XbfxBnawFuWaR_a6OWMGWWRw",
  authDomain: "kura-75bdc.firebaseapp.com",
  projectId: "kura-75bdc",
  storageBucket: "kura-75bdc.firebasestorage.app",
  messagingSenderId: "982885804193",
  appId: "1:982885804193:web:fa53121759b4c16f99a8e0",
  measurementId: "G-5Z58GPLY6D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
