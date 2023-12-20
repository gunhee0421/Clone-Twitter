// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
    apiKey: "AIzaSyD4CzomMKFwD6r24cW3rRLr8_KyRZkCJvk",
    authDomain: "clonetwitter-2a022.firebaseapp.com",
    projectId: "clonetwitter-2a022",
    storageBucket: "clonetwitter-2a022.appspot.com",
    messagingSenderId: "717420524647",
    appId: "1:717420524647:web:9f5d5d58229a1a602ad0c2",
    measurementId: "G-GMDQY12C1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);