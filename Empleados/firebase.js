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
 * Save a New Employee in Firestore
 * @param {string} firstName Employee's first name
 * @param {string} lastName Employee's last name
 * @param {string} secondLastName Employee's second last name
 * @param {string} phone Employee's phone number
 * @param {string} email Employee's email
 * @param {string} gender Employee's gender
 * @param {string} username Employee's username
 * @param {string} password Employee's password
 * @param {string} role Employee's role (e.g., 'administrador', 'cajero')
 */
export const saveEmployee = (firstName, lastName, secondLastName, phone, email, gender, username, password, role) =>
  addDoc(collection(db, "employees"), { firstName, lastName, secondLastName, phone, email, gender, username, password, role });

/**
 * Retrieve real-time employees from Firestore
 * @param {function} callback function to process the employees data
 */
export const onGetEmployees = (callback) =>
  onSnapshot(collection(db, "employees"), callback);

/**
 * Delete an Employee by ID from Firestore
 * @param {string} id Employee ID
 */
export const deleteEmployee = (id) => deleteDoc(doc(db, "employees", id));

/**
 * Get a specific Employee by ID from Firestore
 * @param {string} id Employee ID
 */
export const getEmployee = (id) => getDoc(doc(db, "employees", id));

/**
 * Update an Employee by ID in Firestore
 * @param {string} id Employee ID
 * @param {object} newFields Updated fields for the Employee
 */
export const updateEmployee = (id, newFields) =>
  updateDoc(doc(db, "employees", id), newFields);

/**
 * Get all Employees from Firestore (not real-time)
 */
export const getEmployees = () => getDocs(collection(db, "employees"));
