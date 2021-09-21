// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDw9zuDnDB83yrRk70Xc3hu3MscTZkL2b4",
  authDomain: "story-points-5bd07.firebaseapp.com",
  databaseURL: "https://story-points-5bd07-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "story-points-5bd07",
  storageBucket: "story-points-5bd07.appspot.com",
  messagingSenderId: "310334160580",
  appId: "1:310334160580:web:fd0c59859f91b4976b9391",
  measurementId: "G-6JBJGQYFQC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
