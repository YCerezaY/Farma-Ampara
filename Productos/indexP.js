import {
  onGetProducts,
  saveProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  getCategories,
} from "./firebaseP.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const productForm = document.getElementById("product-form");
const productsContainer = document.getElementById("products-list");
const categorySelect = document.getElementById("product-category");
const productImageInput = document.getElementById("product-image");

let editStatus = false;
let id = "";

// Initialize Firebase Storage
const storage = getStorage();

// Load categories into the select dropdown
const loadCategories = async () => {
  const categoriesSnapshot = await getCategories();
  categoriesSnapshot.forEach((category) => { // Aquí ya trabajas con 'category' directamente
    const option = document.createElement("option");
    option.value = category.name;  // Usas el nombre desencriptado
    option.text = category.name;   // Muestras el nombre desencriptado
    categorySelect.appendChild(option);
  });
};


window.addEventListener("DOMContentLoaded", async () => {
  loadCategories();

  onGetProducts((querySnapshot) => {
    productsContainer.innerHTML = "";

    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1); // Un mes después de hoy

    querySnapshot.forEach(async (doc) => {
      const product = doc.data();
      const expiryDate = new Date(product.expiryDate);
      const isExpired = expiryDate < today;
      const isNextMonth = expiryDate <= nextMonth && expiryDate > today;
      const imageUrl = product.imageURL || ''; // Obtener URL de la imagen

      let statusClass = '';
      let statusText = '';

      if (isExpired) {
        statusClass = 'expired';
        statusText = 'Caducado';
      } else if (isNextMonth) {
        statusClass = 'proximo-caducado';
        statusText = 'Próximo a caducar';
      } else {
        statusClass = 'valid';
        statusText = 'Válido';
      }

      productsContainer.innerHTML += `
        <tr class="${statusClass}">
          <td><img src="${imageUrl}" alt="${product.name}" class="img-thumbnail" width="100"></td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>$${product.price}</td>
          <td>${product.expiryDate}</td>
          <td>
            <span class="status ${statusClass}">${statusText}</span>
          </td>
          <td>
            <button class="btn btn-primary btn-delete" data-id="${doc.id}">
              <img src="../assets/imgs/Eliminar.png" alt="Delete" class="icon-image">
            </button>
            <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
              <img src="../assets/imgs/Editar.png" alt="Delete" class="icon-image">
            </button>
          </td>
        </tr>`;
    });

    // Delete product
    const btnsDelete = productsContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", ({ target: { dataset } }) => {
        deleteProduct(dataset.id);
      })
    );

    // Edit product
    const btnsEdit = productsContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) =>
      btn.addEventListener("click", async ({ target: { dataset } }) => {
        const doc = await getProduct(dataset.id);
        const product = doc.data();

        productForm["product-name"].value = product.name;
        productForm["product-category"].value = product.category;
        productForm["product-price"].value = product.price;
        productForm["product-expiry"].value = product.expiryDate;

        editStatus = true;
        id = doc.id;
        productForm["btn-product-form"].innerText = "Actualizar";
      })
    );
  });
});


// Save or Update product
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = productForm["product-name"].value;
  const category = productForm["product-category"].value;
  const price = productForm["product-price"].value;
  const expiryDate = productForm["product-expiry"].value;
  const file = productImageInput.files[0];

  let imageURL = '';

  if (file) {

    const imageRef = ref(storage, `products/${file.name}`);
    await uploadBytes(imageRef, file);
    imageURL = await getDownloadURL(imageRef);
  }

  if (!editStatus) {

    await saveProduct(name, category, price, expiryDate, imageURL);
  } else {

    await updateProduct(id, {
      name,
      category,
      price,
      expiryDate,
      imageURL,
    });

    editStatus = false;
    id = "";
    productForm["btn-product-form"].innerText = "Guardar";
  }

  productForm.reset();
  productImageInput.value = '';
});