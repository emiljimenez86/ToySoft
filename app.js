// Variables globales
let productos = [];
let categorias = [];
let ordenActual = [];

// Función para guardar productos en localStorage
function guardarProductos() {
  localStorage.setItem('productos', JSON.stringify(productos));
}

// Función para cargar productos y categorías desde localStorage
function cargarDatos() {
  const productosGuardados = localStorage.getItem('productos');
  const categoriasGuardadas = localStorage.getItem('categorias');
  
  if (productosGuardados) {
    productos = JSON.parse(productosGuardados);
  }
  
  if (categoriasGuardadas) {
    categorias = JSON.parse(categoriasGuardadas);
  }
  
  mostrarProductos();
}

// Función para mostrar productos en el panel
function mostrarProductos() {
  const categoriasDiv = document.getElementById('categorias');
  categoriasDiv.innerHTML = '';
  
  // Si no hay categorías, mostrar un mensaje
  if (categorias.length === 0) {
    categoriasDiv.innerHTML = '<p class="text-muted">No hay categorías disponibles</p>';
    return;
  }
  
  categorias.forEach(categoria => {
    const botonCategoria = document.createElement('button');
    botonCategoria.classList.add('btn', 'btn-info', 'mb-2', 'w-100');
    botonCategoria.textContent = categoria;
    botonCategoria.onclick = () => filtrarProductosPorCategoria(categoria);
    categoriasDiv.appendChild(botonCategoria);
  });
}

// Función para filtrar productos por categoría
function filtrarProductosPorCategoria(categoria) {
  const productosFiltrados = productos.filter(p => p.categoria === categoria);
  mostrarProductosFiltrados(productosFiltrados);
}

// Función para mostrar los productos filtrados
function mostrarProductosFiltrados(productosFiltrados) {
  const tablaOrden = document.getElementById('ordenCuerpo');
  tablaOrden.innerHTML = '';
  
  // Si no hay productos en la categoría, mostrar un mensaje
  if (productosFiltrados.length === 0) {
    tablaOrden.innerHTML = '<tr><td colspan="3" class="text-center">No hay productos en esta categoría</td></tr>';
    return;
  }
  
  productosFiltrados.forEach(producto => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td><button class='btn btn-primary' onclick='agregarProducto(${producto.id})'>Agregar</button></td>
      <td>$${producto.precio}</td>
    `;
    tablaOrden.appendChild(fila);
  });
}

// Función para agregar producto a la orden
function agregarProducto(id) {
  const producto = productos.find(p => p.id === id);
  const ordenCuerpo = document.getElementById('ordenCuerpo');
  const filaOrden = document.createElement('tr');
  filaOrden.innerHTML = `
    <td>${producto.nombre}</td>
    <td><input type='number' value='1' min='1' onchange='actualizarCantidad(this, ${producto.id})' /></td>
    <td>$${producto.precio}</td>
    <td>$${producto.precio}</td>
    <td><button class='btn btn-danger' onclick='eliminarProductoOrden(this)'>Eliminar</button></td>
  `;
  ordenCuerpo.appendChild(filaOrden);
  actualizarTotal();
}

// Función para actualizar cantidad y total
function actualizarCantidad(input, id) {
  const cantidad = input.value;
  const producto = productos.find(p => p.id === id);
  const total = cantidad * producto.precio;
  const fila = input.closest('tr');
  fila.children[3].textContent = `$${total.toFixed(2)}`;
  actualizarTotal();
}

// Función para eliminar producto de la orden
function eliminarProductoOrden(boton) {
  const fila = boton.closest('tr');
  fila.remove();
  actualizarTotal();
}

// Función para actualizar el total de la orden
function actualizarTotal() {
  const filas = document.querySelectorAll('#ordenCuerpo tr');
  let total = 0;
  filas.forEach(fila => {
    const totalCelda = fila.children[3].textContent.replace('$', '');
    total += parseFloat(totalCelda);
  });
  document.getElementById('totalOrden').textContent = `$${total.toFixed(2)}`;
}

// Función para exportar productos a archivo JSON
function exportarProductos() {
  const blob = new Blob([JSON.stringify(productos, null, 2)], { type: 'application/json' });
  saveAs(blob, 'productos.json');
}

// Función para importar productos desde un archivo JSON
function importarProductos(event) {
  const archivo = event.target.files[0];
  const lector = new FileReader();
  lector.onload = function(e) {
    const datos = JSON.parse(e.target.result);
    productos = datos;
    guardarProductos();
    mostrarProductos();
  };
  lector.readAsText(archivo);
}

// Inicialización de la app
document.addEventListener('DOMContentLoaded', () => {
  cargarDatos();
  document.getElementById('importarProductos').addEventListener('change', importarProductos);
  // Agregar listener para cambios en localStorage
  window.addEventListener('storage', (e) => {
    if (e.key === 'productos' || e.key === 'categorias') {
      cargarDatos();
    }
  });
});
  