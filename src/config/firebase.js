// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTCQK8LNt4yLZY97CwkE4ckGgbbRwOmEE",
  authDomain: "eggornot.firebaseapp.com",
  projectId: "eggornot",
  storageBucket: "eggornot.appspot.com",
  messagingSenderId: "709092761468",
  appId: "1:709092761468:web:d4740053e9b942c6fccef9",
  measurementId: "G-9KJNMCMBRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);