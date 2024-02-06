// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-427d5.firebaseapp.com",
  projectId: "mern-estate-427d5",
  storageBucket: "mern-estate-427d5.appspot.com",
  messagingSenderId: "387539912250",
  appId: "1:387539912250:web:24e4bffa9fde9f6b9f1703"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);