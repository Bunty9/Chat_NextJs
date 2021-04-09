import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
  

export const db = firebase.firestore();
export const auth = firebase.auth() 
export const provider = new firebase.auth.GoogleAuthProvider()

