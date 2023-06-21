function productoTienda(totalProducto, costo, cantidad) {
    return totalProducto + costo * cantidad;
  }
  
  const productos = [
    { nombre: "Disco Duro", precio: 300 },
    { nombre: "Memoria RAM", precio: 500 },
    { nombre: "Tarjeta Grafica", precio: 1000 },
    { nombre: "Fuente", precio: 2000 },
    { nombre: "Memoria SSD", precio: 1200 },
  ];
  
  let total = 0;
  let opcion;
  let comenzar;
  
  alert("Bienvenido a la tienda de NicSoft. Por favor elija un producto:");
  
  do {
    // Mostrar las opciones de productos
    let opciones = "";
    for (let i = 0; i < productos.length; i++) {
      opciones += `${i + 1}. ${productos[i].nombre}\n`;
    }
    opcion = parseInt(prompt(opciones));
  
    if (opcion >= 1 && opcion <= productos.length) {
      const producto = productos[opcion - 1];
      const cantidadProducto = parseInt(
        prompt(`El costo de ${producto.nombre} es de $${producto.precio}. Por favor ingrese la cantidad que desea comprar.`)
      );
      total = productoTienda(total, producto.precio, cantidadProducto);
      alert(`Ha gastado $${total} hasta ahora.`);
    } else {
      alert("Ingrese una opción válida, por favor.");
    }
  
    comenzar = prompt("¿Desea continuar? si/no");
  } while (comenzar.toLowerCase() !== "no");
  
  alert(`El total de su compra es de $${total}. Muchas gracias por su compra.`);
  
  
  
  
  
  