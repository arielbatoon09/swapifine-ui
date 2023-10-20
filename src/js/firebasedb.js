import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

const firebaseConfig  = {
    apiKey: "AIzaSyC03pcH7XF97K7GJLF_vsnzegQZuMRfiqA",
    authDomain: "swapifine-realtime.firebaseapp.com",
    databaseURL: "https://swapifine-realtime-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "swapifine-realtime",
    storageBucket: "swapifine-realtime.appspot.com",
    messagingSenderId: "535691776040",
    appId: "1:535691776040:web:30d38aa38c97339fb0651d",
    measurementId: "G-N1Y0BHYM63"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export default database;