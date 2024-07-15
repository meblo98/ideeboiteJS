import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMMjSYbIeUcRmE4lRUr30n5k2jDbWzpx8",
  authDomain: "boite-idees-dd276.firebaseapp.com",
  databaseURL: "https://boite-idees-dd276-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "boite-idees-dd276",
  storageBucket: "boite-idees-dd276.appspot.com",
  messagingSenderId: "936408192242",
  appId: "1:936408192242:web:4302261194cd414ac46c6b",
  measurementId: "G-6KCWFQE1KS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

export { db, ref, push, onValue, update, remove };