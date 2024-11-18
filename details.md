fire base related code
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNGncAKdAIJeKzpvlLXT6gEgZC4SI4khM",
  authDomain: "lemon-1ef21.firebaseapp.com",
  projectId: "lemon-1ef21",
  storageBucket: "lemon-1ef21.appspot.com",
  messagingSenderId: "500447620617",
  appId: "1:500447620617:web:8f3b65fc2307f6c07992d8",
  measurementId: "G-2BQMCSW65Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);