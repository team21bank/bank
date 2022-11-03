/*// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import {getAuth, updateProfile, onAuthStateChanged} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAA0b6LN-jkBbviEcl6GeKAFDPJQ169lcM",
  authDomain: "banking-application-abbda.firebaseapp.com",
  databaseURL: "https://banking-application-abbda-default-rtdb.firebaseio.com",
  projectId: "banking-application-abbda",
  storageBucket: "banking-application-abbda.appspot.com",
  messagingSenderId: "616492109802",
  appId: "1:616492109802:web:7d02eb116a01291807ac93",
  measurementId: "G-EWWD2G1WP9"
};*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDtSZmVoz555aVQAwcMIpqswkVMlk_CkfA",
  authDomain: "banking-app-69227.firebaseapp.com",
  databaseURL: "https://banking-app-69227-default-rtdb.firebaseio.com",
  projectId: "banking-app-69227",
  storageBucket: "banking-app-69227.appspot.com",
  messagingSenderId: "151738051001",
  appId: "1:151738051001:web:66b14a4f7fb74e357dae68",
  measurementId: "G-YDVST35J84"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth=getAuth(app)

