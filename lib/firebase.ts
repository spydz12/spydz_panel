// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// إعدادات Firebase الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyBxioTGxWTl9LJaw2ghXlxR-iROjxi5jRM",
  authDomain: "dzspy-ai.firebaseapp.com",
  projectId: "dzspy-ai",
  storageBucket: "dzspy-ai.firebasestorage.app",
  messagingSenderId: "393539403513",
  appId: "1:393539403513:web:9aa88c384a1df59429ec28",
  measurementId: "G-VB28FQSWM0",
};

// ✅ نهيئ التطبيق مرة واحدة فقط بطريقة آمنة
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ نحصل على قاعدة البيانات
export const db = getFirestore(app);