import {
    onGetEmployees,
    saveEmployee,
    deleteEmployee,
    getEmployee,
    updateEmployee,
    getEmployees,
  } from "./firebase.js";
  
  const employeeForm = document.getElementById("user-form");
  const employeesContainer = document.getElementById("users-container");
  
  let editStatus = false;
  let id = "";
  
  // Mostrar empleados en tiempo real
  window.addEventListener("DOMContentLoaded", () => {
    onGetEmployees((querySnapshot) => {
      employeesContainer.innerHTML = "";
  
      querySnapshot.forEach((doc) => {
        const employee = doc.data();
  
        employeesContainer.innerHTML += `
        <div class="card card-body mt-2 border-primary">
          <h3 class="h5">${employee.firstName} ${employee.lastName} ${employee.secondLastName}</h3>
          <p>Teléfono: ${employee.phone}</p>
          <p>Correo Electrónico: ${employee.email}</p>
          <p>Género: ${employee.gender}</p>
          <p>Rol: ${employee.role}</p>
          <p>Usuario: ${employee.username}</p>
          <div>
            <button class="btn btn-primary btn-delete" data-id="${doc.id}">
              <img src="../assets/imgs/Eliminar_2.png" alt="Delete" class="icon-image">
            </button>
            <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
              <img src="../assets/imgs/Editar.png" alt="Delete" class="icon-image">
            </button>
          </div>
        </div>`;
    });
  
      // Eliminar empleado
      const btnsDelete = employeesContainer.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) =>
        btn.addEventListener("click", async ({ target: { dataset } }) => {
          try {
            await deleteEmployee(dataset.id);
          } catch (error) {
            console.log(error);
          }
        })
      );
  
      // Editar empleado
      const btnsEdit = employeesContainer.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          try {
            const doc = await getEmployee(e.target.dataset.id);
            const employee = doc.data();
  
            // Llenar formulario con datos de empleado para editar
            employeeForm["first-name"].value = employee.firstName;
            employeeForm["last-name"].value = employee.lastName;
            employeeForm["middle-name"].value = employee.secondLastName;
            employeeForm["phone"].value = employee.phone;
            employeeForm["email"].value = employee.email;
            employeeForm["gender"].value = employee.gender;
            employeeForm["username"].value = employee.username;
            employeeForm["password"].value = employee.password;
            employeeForm["role"].value = employee.role;
  
            editStatus = true;
            id = doc.id;
            employeeForm["btn-user-form"].innerText = "Actualizar";
          } catch (error) {
            console.log(error);
          }
        });
      });
    });
  });
  
  // Guardar nuevo empleado o actualizar existente
  employeeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const firstName = employeeForm["first-name"].value;
    const lastName = employeeForm["last-name"].value;
    const secondLastName = employeeForm["middle-name"].value;
    const phone = employeeForm["phone"].value;
    const email = employeeForm["email"].value;
    const gender = employeeForm["gender"].value;
    const username = employeeForm["username"].value;
    const password = employeeForm["password"].value;
    const role = employeeForm["role"].value;
  
    try {
      if (!editStatus) {
        await saveEmployee(firstName, lastName, secondLastName, phone, email, gender, username, password, role);
      } else {
        await updateEmployee(id, { firstName, lastName, secondLastName, phone, email, gender, username, password, role });
  
        editStatus = false;
        id = "";
        employeeForm["btn-user-form"].innerText = "Registrar";
      }
  
      employeeForm.reset();
    } catch (error) {
      console.log(error);
    }
  });
  