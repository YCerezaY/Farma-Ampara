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
 * Save a New Product in Firestore (with image)
 * @param {string} name the name of the product
 * @param {string} category the category of the product
 * @param {number} price the price of the product
 * @param {string} expiryDate the expiry date of the product
 * @param {string} imageURL URL of the product image
 */
// Save a New Product in Firestore (with image and proximoCaducado)
export const saveProduct = async (name, category, price, expiryDate, imageURL) => {
  try {
    // Calcular si el producto está a un mes de caducar
    const today = new Date();
    const expiry = new Date(expiryDate);
    const oneMonthAhead = new Date(today);
    oneMonthAhead.setMonth(today.getMonth() + 1);

    // Determinar si el producto está a un mes de caducar
    const proximoCaducado = expiry <= oneMonthAhead && expiry > today;

    // Agregar producto a Firestore
    await addDoc(collection(db, "products"), {
      name,
      category,
      price,
      expiryDate,
      imageURL, // Incluir URL de la imagen
      proximoCaducado, // Nuevo campo
    });

    console.log("Product added successfully!");
  } catch (error) {
    console.error("Error adding product: ", error);
  }
};


/**
 * Retrieve real-time products from Firestore
 * @param {function} callback function to process the products data
 */
export const onGetProducts = (callback) =>
  onSnapshot(collection(db, "products"), callback);

/**
 * Delete a Product by ID from Firestore
 * @param {string} id Product ID
 */
export const deleteProduct = (id) => deleteDoc(doc(db, "products", id));

/**
 * Get a specific Product by ID from Firestore
 * @param {string} id Product ID
 */
export const getProduct = (id) => getDoc(doc(db, "products", id));

/**
 * Update a Product by ID in Firestore
 * @param {string} id Product ID
 * @param {object} newFields Updated fields for the Product
 */
export const updateProduct = (id, newFields) =>
  updateDoc(doc(db, "products", id), newFields);

/**
 * Get all Categories from Firestore (not real-time)
 */
export const getCategories = () => getDocs(collection(db, "categories"));


