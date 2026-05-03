// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "kodaai-b6cc9.firebaseapp.com",
  projectId: "kodaai-b6cc9",
  storageBucket: "kodaai-b6cc9.firebasestorage.app",
  messagingSenderId: "525410168286",
  appId: "1:525410168286:web:d5e3133fbcafb3b106414f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)//Intializing In-built GetAuth Function for Authentication
const provider=new GoogleAuthProvider() //Using Google Authentication Provider to easy-use

export {auth,provider}