
// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQFlAT-blG0_tOPHBs3_cfOnX5zUIja4o",
  authDomain: "familienkalender-fa367.firebaseapp.com",
  projectId: "familienkalender-fa367",
  storageBucket: "familienkalender-fa367.firebasestorage.app",
  messagingSenderId: "808643558409",
  appId: "1:808643558409:web:d6e1afebeeebe846e94cd8",
  measurementId: "G-SWDZMFSPLM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
