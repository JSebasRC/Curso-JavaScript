class Producto {
   constructor(name, id, type, price, stock, description) {
      this.name = name;
      this.id = id;
      this.type = type;
      this.price = price;
      this.stock = stock;
      this.description = description;
   }
}

const productosBase = [
   { name: "Banano", id: "001", type: "Fruta", price: 1.200, stock: 550, description: "Banano Uraba x 500 gr" },
   { name: "Pera", id: "002", type: "Fruta", price: 6.510, stock: 380, description: "Pera packam importada x 500gr" },
   { name: "Zanahoria", id: "003", type: "Verdura", price: 1.152, stock: 1500, description: "Zanahoria x 500gr" },
   { name: "Pimenton", id: "004", type: "Verdura", price: 2.756, stock: 1800, description: "Pimentones rojos y verdes x500g" },
   { name: "Mango", id: "005", type: "Fruta", price: 2.756, stock: 800, description: "Mango Tommy x 500 gr" },
   { name: "Tomate De Arbol", id: "006", type: "Fruta", price: 3.452, stock: 2400, description: "Tomate de árbol x500g" }
]

// OR lógico para cargar local storage, se guarda los datos como cadena de texto y si no hay datos almacenados se guarda un array vacío
const productos = JSON.parse(localStorage.getItem("productos")) || []
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

const agregarProducto = ({ name, id, type, price, stock, description }) => {
   // Comprobar si el ID ingresado ya existe en el array de productos
   if (productos.some(producto => producto.id === id)) {
      // Mostrar una alerta al usuario indicando que el ID ya está en uso
      alert('El ID ingresado ya se encuentra en uso, ingrese otro ID');
   } else {
      // Si el ID no existe en el array, crear un nuevo producto con los datos proporcionados
      const productoNuevo = new Producto(name, id, type, price, stock, description);
      // Agregar el nuevo producto al array de productos
      productos.push(productoNuevo);
      // Guardar el nuevo array de productos en el localStorage
      localStorage.setItem('productos', JSON.stringify(productos));
   }
};

const productosPreexistentes = () => {
   // Verificar si el array de productos está vacío
   if (productos.length === 0) {
      // Crear un nuevo conjunto (Set) con los IDs de los productos existentes
      const productosIds = new Set(productos.map(producto => producto.id));

      // Recorrer los productos preexistentes
      productosBase.forEach(producto => {
         // Verificar si el ID del producto preexistente ya existe en el array de productos
         if (!productosIds.has(producto.id)) {
            // Si el ID no existe en el array, agregar el producto preexistente al array de productos
            agregarProducto(producto);
            // Agregar el ID del producto al conjunto (Set) para evitar duplicados
            productosIds.add(producto.id);
         }
      });
   }
};

let carritoTotal = 0; // Variable para almacenar el total del carrito

const totalCarrito = () => {
   // Calcula el total del carrito sumando los precios de los productos y sus cantidades
   carritoTotal = carrito.reduce((total, { price, quantity }) => total + (price * quantity), 0);
   return carritoTotal;
};

const agregarCarrito = (objetoCarrito) => {
   // Agrega el producto al carrito
   carrito.push(objetoCarrito);
   // Actualiza el total del carrito
   totalCarrito();
   // Muestra el total del carrito en la interfaz en tiempo real
   const carritoTotalElement = document.getElementById("carritoTotal");
   carritoTotalElement.innerHTML = `Total a pagar: $${carritoTotal.toFixed(3)}`;
   // Guardar el nuevo array de carrito en el localStorage cada vez que haya cambios
   localStorage.setItem('carrito', JSON.stringify(carrito));
};

const renderizarCarrito = () => {
   const resumenCompra = document.getElementById("resumenCompra");
   const listaCarrito = document.getElementById("listaCarrito");
   // Creamos un fragmento (fragment) para evitar múltiples actualizaciones del DOM
   const fragmento = document.createDocumentFragment();

   // Limpiamos la listaCarrito antes de renderizar nuevamente
   listaCarrito.innerHTML = "";

   carrito.forEach(({ name, price, quantity, id }) => {
      const totalPrice = price*quantity;
      const elementoLista = document.createElement("tr");
      resumenCompra.innerHTML = '<h3>Resumen de compra</h3>';
      elementoLista.classList.add("fw-light");
      elementoLista.innerHTML = `
         <th>${id}</th> 
         <th>${name}</th> 
         <th>${price.toFixed(3)}</th> 
         <th>${quantity}</th> 
         <th>${totalPrice.toFixed(3)}</th> 
      `

      fragmento.appendChild(elementoLista);
   });

   // Agregamos todos los elementos del fragmento a la listaCarrito de una sola vez
   listaCarrito.appendChild(fragmento);

   // Asignamos el evento click a todos los botones de eliminar
   const botonesBorrar = document.querySelectorAll("li button");
   botonesBorrar.forEach(boton => {
      boton.addEventListener("click", () => {
         const id = boton.getAttribute("data-id");
         // Filtramos el carrito para eliminar el producto con el id correspondiente
         carrito = carrito.filter(producto => producto.id !== id);
         // Guardamos el carrito actualizado en el localStorage
         localStorage.setItem("carrito", JSON.stringify(carrito));
         // Renderizamos nuevamente el carrito con el carrito actualizado
         renderizarCarrito();
      });
   });
};

const borrarCarrito = () => {
   carrito = []; // Vaciamos el carrito simplemente asignando un nuevo array vacío
   localStorage.removeItem("carrito"); // Removemos el carrito del localStorage
   renderizarCarrito(); // Actualizamos la interfaz de usuario con el carrito vacío
   
   // También debes eliminar el carrito del array local y guardar los cambios
   localStorage.setItem('carrito', JSON.stringify(carrito));
};

const renderizarProductos = (arrayUtilizado) => {
   const contenedorProductos = document.getElementById("contenedorProductos");
   // Utilizamos un fragmento para evitar múltiples actualizaciones del DOM
   const fragmento = document.createDocumentFragment();

   // Limpiamos el contenedorProductos antes de renderizar nuevamente
   contenedorProductos.innerHTML = "";

   arrayUtilizado.forEach(({ name, id, type, price, stock, description }) => {
      const prodCard = document.createElement("div");
      prodCard.classList.add("col-xs");
      prodCard.classList.add("card");
      prodCard.classList.add("p-3");
      prodCard.classList.add("h-auto");
      prodCard.classList.add("border");
      prodCard.classList.add("border-success");
      prodCard.classList.add("border-2");
      prodCard.style = "width: 270px; margin:3px";
      prodCard.id = id;
      prodCard.innerHTML = `
       <img src="../../../Entrega3/assets/images/${name}.jpg" alt="${name}">
       <div>
           <h4 class="text-success fw-bold">${name}</h4>
           <h6>${type}</h6>
           <p class="fw-bold">${description}</p>
           <span>Stock: <span class="text-danger fw-bold">${stock}</span></span>
           <p>Price $ <span class="text-success fw-bold">${price.toFixed(3)}</span></p>
           <form id="form${id}">
               <label for="contador${id}">Cantidad:</label>
               <input class="p-1 mt-2 w-50 border border-success border-2 rounded" type="number" placeholder="0" id="contador${id}">
               <button class="btn btn-success mt-2" data-id="${id}">Agregar</button>
           </form>
       </div>`;
      fragmento.appendChild(prodCard);
   });

   // Agregamos todos los elementos del fragmento al contenedorProductos de una sola vez
   contenedorProductos.appendChild(fragmento);

   // Asignamos el evento click a todos los botones de agregar
   const botonesAgregar = document.querySelectorAll("button[data-id]");
   botonesAgregar.forEach(boton => {
      boton.addEventListener("click", (evento) => {
         evento.preventDefault();
         const id = boton.getAttribute("data-id");
         const contadorQuantity = Number(document.getElementById(`contador${id}`).value);
         if (contadorQuantity > 0) {
            agregarCarrito({ ...arrayUtilizado.find(producto => producto.id === id), quantity: contadorQuantity });
            renderizarCarrito();
            const form = document.getElementById(`form${id}`);
            form.reset();
         }
      });
   });
};

const finalizarCompra = (event) => {
   // Como conseguir todos los datos de un form
   // Conseguimos la data del formulario
   event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
   const formData = new FormData(event.target);
   const cliente = Object.fromEntries(formData);

   // Creamos un "ticket" para el pedido
   const ticket = {
      cliente: cliente,
      total: totalCarrito(), // Utilizamos la función totalCarrito para obtener el total del carrito
      id: pedidos.length, // Podemos utilizar un ID único para el pedido, en este caso, utilizamos la longitud del array pedidos
      productos: [...carrito], // Creamos una copia del array carrito para evitar modificarlo directamente
   };

   // Cargar los pedidos almacenados en el localStorage
   let pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
   
   // Agregar el nuevo pedido al array de pedidos
   pedidosGuardados.push(ticket);

   // Guardar el array actualizado de pedidos en el localStorage
   localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));

   // Borramos el carrito y mostramos un mensaje al usuario
   borrarCarrito();

   // Mostramos un mensaje de agradecimiento al usuario
   let mensaje = document.getElementById("carritoTotal");
   mensaje.innerHTML = "Su compra fue exitosa";
};


// Evento submit para la compra final
const compraFinal = document.getElementById("formCompraFinal");
compraFinal.addEventListener("submit", (event) => {
   event.preventDefault();
   if (carrito.length > 0) {
      finalizarCompra(event);
   } else {
   }
});

// Evento onchange para el selector de tipo de producto
const selectorTipo = document.getElementById("tipoProducto");
selectorTipo.addEventListener("change", (evt) => {
   const tipoSeleccionado = evt.target.value;
   const productosFiltrados = tipoSeleccionado === "0" ? productos : productos.filter(producto => producto.type === tipoSeleccionado);
   renderizarProductos(productosFiltrados);
});

// Testing
const tienda = () => {
   productosPreexistentes()
   renderizarProductos(productos)
   renderizarCarrito()
}

// se ejecuta la aplicación
tienda()
