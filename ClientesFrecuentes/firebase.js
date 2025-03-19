// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your web app's Firebase configuration
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
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

/**
 * Save a New Client in Firestore
 * @param {string} name the name of the Client
 * @param {string} ci the CI (Identification Number) of the Client
 * @param {string} phone the phone number of the Client
 * @param {string} address the address of the Client
 */
export const saveClient = (name, ci, phone, address) =>
  addDoc(collection(db, "clients"), { name, ci, phone, address });

/**
 * Retrieve real-time clients from Firestore
 * @param {function} callback function to process the clients data
 */
export const onGetClients = (callback) =>
  onSnapshot(collection(db, "clients"), callback);

/**
 * Delete a Client by ID from Firestore
 * @param {string} id Client ID
 */
export const deleteClient = (id) => deleteDoc(doc(db, "clients", id));

/**
 * Get a specific Client by ID from Firestore
 * @param {string} id Client ID
 */
export const getClient = (id) => getDoc(doc(db, "clients", id));

/**
 * Update a Client by ID in Firestore
 * @param {string} id Client ID
 * @param {object} newFields Updated fields for the Client
 */
export const updateClient = (id, newFields) =>
  updateDoc(doc(db, "clients", id), newFields);

/**
 * Get all Clients from Firestore (not real-time)
 */
export const getClients = () => getDocs(collection(db, "clients"));
