import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCCDArnHi9WUGdiIAMMKeC9lIKuXZRy0vg",
  authDomain: "farmacia-77662.firebaseapp.com",
  databaseURL: "https://farmacia-77662-default-rtdb.firebaseio.com",
  projectId: "farmacia-77662",
  storageBucket: "farmacia-77662.appspot.com",
  messagingSenderId: "462794672859",
  appId: "1:462794672859:web:e368c3c35bfe9445e61afe",
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Calcula el total de la venta y guarda una nueva venta en Firestore
 * @param {string} customerName Nombre del cliente
 * @param {string} nit NIT del cliente
 * @param {string} phone Teléfono del cliente
 * @param {string} description Descripción de la venta
 * @param {array} products Lista de productos con nombre, precio y cantidad
 */
export const saveSale = async (customerName, nit, phone, description, products, discount = 0) => {
  try {
    let total = 0;

    // Calcula el total iterando sobre los productos
    for (const item of products) {
      const productRef = doc(db, "products", item.productId);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        const productData = productDoc.data();
        // Se agrega el nombre y precio del producto en el objeto
        item.name = productData.name;
        item.price = productData.price;
        total += productData.price * item.quantity; // Suma el subtotal del producto
      } else {
        console.error("Producto no encontrado:", item.productId);
      }
    }

    // Aplica el descuento basado en el total gastado
    total = total - (total * discount);

    // Guarda la venta con el total calculado
    await addDoc(collection(db, "sales"), {
      customerName,
      nit,
      phone,
      description,
      products,
      total,
      date: new Date().toISOString(),
    });
    console.log("Venta registrada con éxito con total:", total);
  } catch (error) {
    console.error("Error al registrar la venta:", error);
  }
};


/**
 * Obtener ventas en tiempo real
 * @param {function} callback Función para procesar los datos de ventas
 */
export const onGetSales = (callback) =>
  onSnapshot(collection(db, "sales"), callback);

/**
 * Obtener todos los productos disponibles
 */
export const getProducts = () => getDocs(collection(db, "products"));

/**
 * Obtener todos los clientes disponibles
 */
export const getClients = () => getDocs(collection(db, "clients"));

/**
 * Obtener un cliente específico por su ID
 * @param {string} clientId ID del cliente
 */
export const getClient = (clientId) => getDoc(doc(db, "clients", clientId));

/**
 * Obtener el total de compras de un cliente específico por nombre
 * @param {string} customerName Nombre del cliente
 */
export const getTotalPurchases = async (customerName) => {
  try {
    const salesQuery = query(
      collection(db, "sales"),
      where("customerName", "==", customerName)
    );
    const salesSnapshot = await getDocs(salesQuery);

    let totalSpent = 0;

    // Iteramos sobre los documentos de la consulta
    salesSnapshot.forEach((doc) => {
      const total = doc.data().total;

      // Verificamos que el campo 'total' sea un número y lo sumamos
      if (typeof total === 'number') {
        totalSpent += total;
      } else {
        console.warn(`El campo 'total' no es un número en el documento ${doc.id}`);
      }
    });

    return totalSpent;
  } catch (error) {
    console.error("Error al obtener el total de compras:", error);
    return 0;  // Si ocurre un error, retornamos 0
  }
};


