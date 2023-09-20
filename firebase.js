/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCB-6PDw8nu7sfYkgT3-lPxdskhq1O0xT4",
    authDomain: "react-notes-8da0a.firebaseapp.com",
    projectId: "react-notes-8da0a",
    storageBucket: "react-notes-8da0a.appspot.com",
    messagingSenderId: "944133191936",
    appId: "1:944133191936:web:eebacedc12248497db5be5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// INFO: an instance of my database
const db = getFirestore(app);
// Access to the notes collection
const notesCollection = collection(db, 'notes');