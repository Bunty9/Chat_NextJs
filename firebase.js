import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCR_iuideU1FFeI04kldfTC4fV1cpsaNdI",
    authDomain: "nextchat420.firebaseapp.com",
    projectId: "nextchat420",
    storageBucket: "nextchat420.appspot.com",
    messagingSenderId: "3575740630",
    appId: "1:3575740630:web:294e74104be518ade6b177",
    measurementId: "G-MHD0S92L0E"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
  

export const db = firebase.firestore();
export const auth = firebase.auth() 
export const provider = new firebase.auth.GoogleAuthProvider()

