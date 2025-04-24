// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9cJoUbut7mZGVRFqn9eO7JX3npHIr85k",
  authDomain: "mano-prod-d4698.firebaseapp.com",
  projectId: "mano-prod-d4698",
  storageBucket: "mano-prod-d4698.appspot.com",
  messagingSenderId: "803875636894",
  appId: "1:803875636894:web:e2f3a4a687b25570f95d8f",
  measurementId: "G-VERE34P82G"
};

// Always re-use existing instance in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
