import {
  onGetCategories,
  saveCategory,
  deleteCategory,
  getCategory,
  updateCategory,
  getCategories,
} from "./firebase.js";

const categoryForm = document.getElementById("category-form");
const categoriesContainer = document.getElementById("categories-container");

let editStatus = false;
let id = "";

window.addEventListener("DOMContentLoaded", () => {
  onGetCategories((categories) => {  // Cambié el nombre del parámetro para mayor claridad
    categoriesContainer.innerHTML = "";

    categories.forEach((category) => {  // Aquí ya tienes las categorías desencriptadas
      categoriesContainer.innerHTML += `
      <div class="card card-body mt-2 border-primary">
        <h3 class="h5">${category.name}</h3>  <!-- Ya está desencriptado -->
        <p>${category.description}</p>       <!-- Ya está desencriptado -->
        <div>
          <button class="btn btn-primary btn-delete" data-id="${category.id}">
            <img src="../assets/imgs/Eliminar_2.png" alt="Delete" class="icon-image">
          </button>
          <button class="btn btn-secondary btn-edit" data-id="${category.id}">
            <img src="../assets/imgs/Editar.png" alt="Edit" class="icon-image">
          </button>
        </div>
      </div>`;
    });

    // Lógica para eliminar categorías
    const btnsDelete = categoriesContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async ({ target: { dataset } }) => {
        try {
          await deleteCategory(dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    // Lógica para editar categorías
    const btnsEdit = categoriesContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getCategory(e.target.dataset.id);
          categoryForm["category-name"].value = doc.name;  // Doc ya está desencriptado
          categoryForm["category-description"].value = doc.description;  // Doc ya está desencriptado

          editStatus = true;
          id = doc.id;
          categoryForm["btn-category-form"].innerText = "Update";
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = categoryForm["category-name"].value;
  const description = categoryForm["category-description"].value;

  try {
    if (!editStatus) {
      await saveCategory(name, description);
    } else {
      await updateCategory(id, { name, description });

      editStatus = false;
      id = "";
      categoryForm["btn-category-form"].innerText = "Save";
    }

    categoryForm.reset();
  } catch (error) {
    console.log(error);
  }
});
