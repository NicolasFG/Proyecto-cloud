// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDJwr9me15wlcVZv00bW4D6UZ69HCacKRI",
    authDomain: "proyecto-cloud-2e0a4.firebaseapp.com",
    projectId: "proyecto-cloud-2e0a4",
    storageBucket: "proyecto-cloud-2e0a4.appspot.com",
    messagingSenderId: "286054291029",
    appId: "1:286054291029:web:13a180c8352c0d953126dc",
    measurementId: "G-RLTBPJSNN9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
