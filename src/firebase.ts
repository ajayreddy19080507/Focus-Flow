import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhk2_AtJtU3kS0Km7w9bXuqyq4wAmHY_8",
  authDomain: "focus-flow-d00ea.firebaseapp.com",
  projectId: "focus-flow-d00ea",
  storageBucket: "focus-flow-d00ea.firebasestorage.app",
  messagingSenderId: "629410492792",
  appId: "1:629410492792:web:7532cb5df3be65cb15188d",
  measurementId: "G-936PGV33QJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
