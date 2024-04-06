
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCKC4bpRXssRVzAr4oAu4rXWsr4qn4c7xY",
  authDomain: "chatter-5221b.firebaseapp.com",
  projectId: "chatter-5221b",
  storageBucket: "chatter-5221b.appspot.com",
  messagingSenderId: "541269506094",
  appId: "1:541269506094:web:d2eee18e1f90849d9647bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebaseConfig