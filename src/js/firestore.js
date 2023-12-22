import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTroJaNxEpneXVljhnambFcWyxA3HncM8",
  authDomain: "swapifine-service.firebaseapp.com",
  projectId: "swapifine-service",
  storageBucket: "swapifine-service.appspot.com",
  messagingSenderId: "955013285269",
  appId: "1:955013285269:web:3ce913d141475e0fb8e29c"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;