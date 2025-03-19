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

// AES Secret Key (Deberías almacenar esta clave de forma segura, no en el código)
const AES_SECRET_KEY = 'mi-clave-secreta';

// Función para encriptar texto con AES
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, AES_SECRET_KEY).toString();
};

// Función para desencriptar texto con AES
const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, AES_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Save a New Category in Firestore
 * @param {string} name the name of the Category
 * @param {string} description the description of the Category
 */
export const saveCategory = (name, description) => {
  const encryptedName = encrypt(name); // Encriptar nombre
  const encryptedDescription = encrypt(description); // Encriptar descripción
  return addDoc(collection(db, "categories"), {
    name: encryptedName,
    description: encryptedDescription
  });
};

/**
 * Retrieve real-time categories from Firestore
 * @param {function} callback function to process the categories data
 */
export const onGetCategories = (callback) => {
  onSnapshot(collection(db, "categories"), (querySnapshot) => {
    const categories = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Desencriptar los campos
      data.name = decrypt(data.name);
      data.description = decrypt(data.description);
      categories.push({
        id: doc.id,
        ...data
      });
    });
    callback(categories);
  });
};

/**
 * Delete a Category by ID from Firestore
 * @param {string} id Category ID
 */
export const deleteCategory = (id) => deleteDoc(doc(db, "categories", id));

/**
 * Get a specific Category by ID from Firestore
 * @param {string} id Category ID
 */
export const getCategory = (id) => getDoc(doc(db, "categories", id)).then(doc => {
  const data = doc.data();
  // Desencriptar los campos
  data.name = decrypt(data.name);
  data.description = decrypt(data.description);
  return {
    id: doc.id,
    ...data
  };
});

/**
 * Update a Category by ID in Firestore
 * @param {string} id Category ID
 * @param {object} newFields Updated fields for the Category
 */
export const updateCategory = (id, newFields) => {
  // Encriptar los campos que se modifican
  if (newFields.name) newFields.name = encrypt(newFields.name);
  if (newFields.description) newFields.description = encrypt(newFields.description);
  
  return updateDoc(doc(db, "categories", id), newFields);
};

/**
 * Get all Categories from Firestore (not real-time)
 */
export const getCategories = () => getDocs(collection(db, "categories")).then(querySnapshot => {
  const categories = [];
  querySnapshot.forEach(doc => {
    const data = doc.data();
    // Desencriptar los campos
    data.name = decrypt(data.name);
    data.description = decrypt(data.description);
    categories.push({
      id: doc.id,
      ...data
    });
  });
  return categories;
});
