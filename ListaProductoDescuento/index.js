import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { app, db } from "./firebase.js";

const productsContainer = document.getElementById("products-list").getElementsByTagName('tbody')[0];

// Load the products that are about to expire (proximoCaducado = true)
const loadExpiringProducts = async () => {
    // Obtén todos los productos de Firestore
    const productsSnapshot = await getDocs(collection(db, "products"));
    
    // Filtra los productos donde 'proximoCaducado' es true
    const expiringProducts = productsSnapshot.docs.filter(doc => doc.data().proximoCaducado);
    
    // Limpiar el contenedor de productos antes de agregar los nuevos productos
    productsContainer.innerHTML = '';

    // Mostrar los productos filtrados
    expiringProducts.forEach(doc => {
        const product = doc.data();
        const imageUrl = product.imageURL || ''; // Obtener URL de la imagen

        // Añadir producto a la tabla
        const row = productsContainer.insertRow();
        
        const imgCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const categoryCell = row.insertCell(2);
        const statusCell = row.insertCell(3);

        imgCell.innerHTML = `<img src="${imageUrl}" alt="${product.name}" class="img-thumbnail" width="100">`;
        nameCell.textContent = product.name;
        categoryCell.textContent = product.category;
        statusCell.innerHTML = `<span class="status proximo-caducado">Próximo a caducar</span>`;
    });
};

// Ejecutar la carga de productos cuando se cargue la página
window.addEventListener("DOMContentLoaded", () => {
    loadExpiringProducts();
});
