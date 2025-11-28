import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWilCiCK_ny-OJELSXLALg78EbverYodA",
  authDomain: "apexquestdemo-a7f2e.firebaseapp.com",
  projectId: "apexquestdemo-a7f2e",
  storageBucket: "apexquestdemo-a7f2e.firebasestorage.app",
  messagingSenderId: "668738139227",
  appId: "1:668738139227:web:0eb048bffc420ece463b7e",
  measurementId: "G-TNBE828ZB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
