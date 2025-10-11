// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyBxioTGxWTl9LJaw2ghXlxR-iROjxi5jRM",
  authDomain: "dzspy-ai.firebaseapp.com",
  projectId: "dzspy-ai",
  storageBucket: "dzspy-ai.firebasestorage.app",
  messagingSenderId: "393539403513",
  appId: "1:393539403513:web:9aa88c384a1df59429ec28",
  measurementId: "G-VB28FQSWM0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);