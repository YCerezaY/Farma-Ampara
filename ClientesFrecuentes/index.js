import {
  onGetClients,
  saveClient,
  deleteClient,
  getClient,
  updateClient,
  getClients,
} from "./firebase.js";

const clientForm = document.getElementById("client-form");
const clientsContainer = document.getElementById("clients-container");

let editStatus = false;
let id = "";

window.addEventListener("DOMContentLoaded", () => {
  onGetClients((querySnapshot) => {
    clientsContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const client = doc.data();

      clientsContainer.innerHTML += `
      <div class="card card-body mt-2 border-primary">
        <h3 class="h5">${client.name}</h3>
        <p>CI: ${client.ci}</p>
        <p>Teléfono: ${client.phone}</p>
        <p>Dirección: ${client.address}</p>
        <div>
          <button class="btn btn-primary btn-delete" data-id="${doc.id}">
            <img src="../assets/imgs/Eliminar_2.png" alt="Delete" class="icon-image">
          </button>
          <button class="btn  btn-secondary btn-edit " data-id="${doc.id}">
            <img src="../assets/imgs/Editar.png" alt="Edit" class="icon-image">
          </button>
        </div>
      </div>`;
    });

    const btnsDelete = clientsContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async ({ target: { dataset } }) => {
        try {
          await deleteClient(dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = clientsContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getClient(e.target.dataset.id);
          const client = doc.data();
          clientForm["client-name"].value = client.name;
          clientForm["client-ci"].value = client.ci;
          clientForm["client-phone"].value = client.phone;
          clientForm["client-address"].value = client.address;

          editStatus = true;
          id = doc.id;
          clientForm["btn-client-form"].innerText = "Update";
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

clientForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = clientForm["client-name"].value;
  const ci = clientForm["client-ci"].value;
  const phone = clientForm["client-phone"].value;
  const address = clientForm["client-address"].value;

  try {
    if (!editStatus) {
      await saveClient(name, ci, phone, address);
    } else {
      await updateClient(id, { name, ci, phone, address });

      editStatus = false;
      id = "";
      clientForm["btn-client-form"].innerText = "Save";
    }

    clientForm.reset();
  } catch (error) {
    console.log(error);
  }
});
