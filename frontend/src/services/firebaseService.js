// src/firebase.js - Firebase config & init
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA5LLGDvY7Z3fKWfwTdpoDBfZg5qZ66D3s",
  authDomain: "school-managment-a3ade.firebaseapp.com",
  projectId: "school-managment-a3ade",
  storageBucket: "school-managment-a3ade.firebasestorage.app",
  messagingSenderId: "887212254639",
  appId: "1:887212254639:web:9b9a1e5c3fbc09b755fb5a",
  measurementId: "G-7P0497S01T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;