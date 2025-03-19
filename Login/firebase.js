// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCDArnHi9WUGdiIAMMKeC9lIKuXZRy0vg",
  authDomain: "farmacia-77662.firebaseapp.com",
  databaseURL: "https://farmacia-77662-default-rtdb.firebaseio.com",
  projectId: "farmacia-77662",
  storageBucket: "farmacia-77662.appspot.com",
  messagingSenderId: "462794672859",
  appId: "1:462794672859:web:e368c3c35bfe9445e61afe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add test users
const addTestUsers = async () => {
  const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user1", password: "pass123", role: "user" },
    { username: "user2", password: "pass456", role: "user" },
    { username: "user3", password: "pass789", role: "user" },
    { username: "moderator", password: "mod123", role: "moderator" }
  ];

  for (const user of users) {
    await addDoc(collection(db, "users"), user);
  }
  console.log("Test users added successfully!");
};

// Function to authenticate user
export const authenticateUser = async (username, password) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), where("password", "==", password));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

// Uncomment this line to insert test users only once
addTestUsers();