import { db, saveSale, getProducts, getClients, onGetSales, getTotalPurchases } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const saleForm = document.getElementById("sale-form");
  const productsTableBody = document.getElementById("products-table-body");
  const addProductBtn = document.getElementById("add-product-btn");
  const confirmSaleBtn = document.getElementById("confirm-sale-btn");
  const salesTableBody = document.getElementById("sales-table-body");
  const clientSelect = saleForm["client"];
  const applyDiscountBtn = document.getElementById("apply-discount-btn");
  const totalAmountElement = document.getElementById("total-amount");
  const discountAmountElement = document.getElementById("discount-amount");

  let selectedProducts = [];
  let discount = 0; // Descuento inicial (0%)

  // Cargar productos en el combobox
  const loadProducts = async () => {
    const productSelect = saleForm["product"];
    const productsSnapshot = await getProducts();

    productsSnapshot.forEach((doc) => {
      const product = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = product.name;
      productSelect.appendChild(option);
    });
  };

  // Cargar clientes en el combobox
  const loadClients = async () => {
    const clientsSnapshot = await getClients();
    clientsSnapshot.forEach((doc) => {
      const client = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = client.name;
      clientSelect.appendChild(option);
    });
  };

  await loadProducts();
  await loadClients();

  // Calcular el total de la venta
  const calculateTotal = () => {
    let total = 0;

    selectedProducts.forEach((product) => {
      const productPrice = product.price; // Precio del producto
      total += productPrice * product.quantity;
    });

    // Aplicar descuento
    const discountAmount = total * discount;
    const finalAmount = total - discountAmount;

    // Actualizar el total y el descuento en la interfaz
    totalAmountElement.textContent = finalAmount.toFixed(2);
    discountAmountElement.textContent = (discount * 100).toFixed(2);
  };

  // Agregar producto a la tabla
  addProductBtn.addEventListener("click", () => {
    const productSelect = saleForm["product"];
    const productId = productSelect.value;
    const quantity = parseInt(saleForm["quantity"].value);

    if (productId && quantity > 0) {
      const selectedProduct = {
        productId,
        quantity,
        price: 10, // Ejemplo: puedes reemplazarlo con el precio real del producto desde la base de datos
      };
      selectedProducts.push(selectedProduct);

      // Añadir producto a la tabla
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${productSelect.options[productSelect.selectedIndex].text}</td>
        <td>${quantity}</td>
        <td><button class="btn btn-danger btn-sm delete-product-btn">Eliminar</button></td>
      `;
      productsTableBody.appendChild(row);

      // Eliminar producto de la tabla
      row.querySelector(".delete-product-btn").addEventListener("click", () => {
        selectedProducts = selectedProducts.filter((p) => p.productId !== productId);
        row.remove();
        calculateTotal(); // Recalcular el total después de eliminar un producto
      });

      calculateTotal(); // Recalcular el total después de agregar un producto
    } else {
      alert("Seleccione un producto y cantidad válida.");
    }
  });

  // Aplicar descuento al cliente frecuente
  applyDiscountBtn.addEventListener("click", async () => {
    // Obtener el cliente seleccionado en el combobox
    const clientId = clientSelect.value;
    const customerName = clientSelect.options[clientSelect.selectedIndex]?.text;
  
    if (clientId && customerName) {
      try {
        // Obtener el total gastado por este cliente usando el customerName
        const totalSpent = await getTotalPurchases(customerName);
  
        console.log(`Total gastado por ${customerName}: $${totalSpent.toFixed(2)}`);
  
        if (totalSpent > 0) {
          // Calcular descuento basado en el total gastado
          if (totalSpent >= 100) {
            discount = Math.min(Math.floor(totalSpent / 100) * 0.01, 0.5); // Máximo 50%
            alert(`Descuento aplicado para ${customerName}: ${(discount * 100).toFixed(2)}%`);
          } else {
            discount = 0;
            alert(`${customerName} no tiene suficientes compras para un descuento.`);
          }
  
          calculateTotal(); // Recalcular el total después de aplicar el descuento
        } else {
          alert(`No se encontraron compras registradas para ${customerName}.`);
        }
      } catch (error) {
        console.error("Error al obtener el total gastado:", error);
      }
    } else {
      alert("Seleccione un cliente primero.");
    }
  });
  


  // Confirmar venta
  confirmSaleBtn.addEventListener("click", async () => {
    const customerName = clientSelect.options[clientSelect.selectedIndex]?.text;
    const nit = saleForm["nit"].value;
    const phone = saleForm["phone"].value;
    const description = saleForm["description"].value;
    const clientId = clientSelect.value;

    if (nit && phone && selectedProducts.length > 0 && clientId) {
      try {
        const totalAmount = parseFloat(totalAmountElement.textContent);
        await saveSale(customerName, nit, phone, description, selectedProducts, discount);
        alert("Venta registrada con éxito.");
        saleForm.reset();
        productsTableBody.innerHTML = "";
        selectedProducts = [];
        discount = 0; // Restablecer descuento
        calculateTotal(); // Recalcular el total después de confirmar la venta
      } catch (error) {
        console.error("Error al registrar la venta:", error);
        alert("Error al registrar la venta.");
      }
    } else {
      alert("Complete todos los campos y agregue al menos un producto.");
    }
  });

  // Mostrar ventas en tiempo real con detalles
  const displaySales = (salesSnapshot) => {
    salesTableBody.innerHTML = "";
    salesSnapshot.forEach((doc) => {
      const sale = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${sale.customerName}</td>
        <td>${sale.nit}</td>
        <td>${sale.phone}</td>
        <td>${sale.description}</td>
        <td>${new Date(sale.date).toLocaleDateString()}</td>
        <td>
          <ul>
            ${sale.products
              .map(
                (p) => `
              <li>${p.name} - Cantidad: ${p.quantity} - Precio: $${p.price}</li>`
              )
              .join("")}
          </ul>
        </td>
        <td>${sale.total ? `$${sale.total.toFixed(2)}` : "N/A"}</td>
      `;
      salesTableBody.appendChild(row);
    });
  };

  onGetSales(displaySales);

  // Obtener el total gastado por un cliente usando el clientId
  async function getTotalSpentByClientId(clientId) {
    const salesSnapshot = await getDocs(collection(db, "sales"));

    let totalSpent = 0;

    salesSnapshot.docs.forEach((doc) => {
      const sale = doc.data();
      // Comparar el ID del cliente
      if (sale.customerId === clientId) {
        totalSpent += sale.total || 0; // Sumar el total de cada venta
      }
    });

    return totalSpent; // Devolver el total gastado
  }
});
