// Variables globales
let productos = [];
let categorias = [];
let mesasActivas = new Map(); // Almacena las órdenes por mesa
let mesaSeleccionada = null; // Mesa actualmente seleccionada
let ordenesCocina = new Map(); // Almacena las órdenes enviadas a cocina
let clientes = []; // Almacena los clientes frecuentes
let tipoPedidoActual = null; // 'domicilio' o 'recoger'
let contadorDomicilios = 0; // Contador de pedidos a domicilio
let contadorRecoger = 0; // Contador de pedidos para recoger
let historialVentas = []; // Almacena el historial de ventas
let historialCocina = []; // Almacena el historial de órdenes de cocina

// Variable global para la ventana de impresión
let ventanaImpresion = null;

// Función para guardar productos en localStorage
function guardarProductos() {
  localStorage.setItem('productos', JSON.stringify(productos));
}

// Función para guardar clientes en localStorage
function guardarClientes() {
  localStorage.setItem('clientes', JSON.stringify(clientes));
}

// Función para guardar contadores en localStorage
function guardarContadores() {
  localStorage.setItem('contadorDomicilios', contadorDomicilios);
  localStorage.setItem('contadorRecoger', contadorRecoger);
}

// Función para guardar historial de ventas
function guardarHistorialVentas() {
  // Guardar todo el historial de ventas
  localStorage.setItem('historialVentas', JSON.stringify(historialVentas));
}

// Función para guardar historial de cocina
function guardarHistorialCocina() {
  // Guardar todo el historial de cocina
  localStorage.setItem('historialCocina', JSON.stringify(historialCocina));
}

// Función para cargar datos desde localStorage
function cargarDatos() {
  const productosGuardados = localStorage.getItem('productos');
  const categoriasGuardadas = localStorage.getItem('categorias');
  const mesasGuardadas = localStorage.getItem('mesasActivas');
  const ordenesCocinaGuardadas = localStorage.getItem('ordenesCocina');
  const clientesGuardados = localStorage.getItem('clientes');
  const contadorDomiciliosGuardado = localStorage.getItem('contadorDomicilios');
  const contadorRecogerGuardado = localStorage.getItem('contadorRecoger');
  const historialVentasGuardado = localStorage.getItem('historialVentas');
  const historialCocinaGuardado = localStorage.getItem('historialCocina');
  
  if (productosGuardados) {
    productos = JSON.parse(productosGuardados);
  }
  
  if (categoriasGuardadas) {
    categorias = JSON.parse(categoriasGuardadas);
  }

  if (mesasGuardadas) {
    mesasActivas = new Map(JSON.parse(mesasGuardadas));
  }

  if (ordenesCocinaGuardadas) {
    ordenesCocina = new Map(JSON.parse(ordenesCocinaGuardadas));
  }

  if (clientesGuardados) {
    clientes = JSON.parse(clientesGuardados);
  }

  if (contadorDomiciliosGuardado) {
    contadorDomicilios = parseInt(contadorDomiciliosGuardado);
  }

  if (contadorRecogerGuardado) {
    contadorRecoger = parseInt(contadorRecogerGuardado);
  }

  if (historialVentasGuardado) {
    historialVentas = JSON.parse(historialVentasGuardado);
  }

  if (historialCocinaGuardado) {
    historialCocina = JSON.parse(historialCocinaGuardado);
  }
  
  mostrarProductos();
  actualizarMesasActivas();
}

// Función para guardar el estado de las mesas
function guardarMesas() {
  localStorage.setItem('mesasActivas', JSON.stringify(Array.from(mesasActivas.entries())));
  localStorage.setItem('ordenesCocina', JSON.stringify(Array.from(ordenesCocina.entries())));
}

// Función para actualizar la vista de mesas activas
function actualizarMesasActivas() {
  const container = document.getElementById('mesasContainer');
  container.innerHTML = '';

  mesasActivas.forEach((orden, mesa) => {
    const boton = document.createElement('button');
    
    // Determinar el tipo de botón basado en el ID de la mesa
    if (mesa.startsWith('DOM-')) {
      const numeroDomicilio = mesa.split('-')[1];
      boton.className = `mesa-btn mesa-domicilio ${mesa === mesaSeleccionada ? 'mesa-seleccionada' : ''}`;
      boton.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <i class="fas fa-motorcycle" style="margin-top: -10px; margin-bottom: 5px;"></i>
          <span class="mesa-numero" style="font-size: 1.5rem;">D${parseInt(numeroDomicilio)}</span>
        </div>
      `;
    } else if (mesa.startsWith('REC-')) {
      const numeroRecoger = mesa.split('-')[1];
      boton.className = `mesa-btn mesa-recoger ${mesa === mesaSeleccionada ? 'mesa-seleccionada' : ''}`;
      boton.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <i class="fas fa-shopping-bag" style="margin-top: -10px; margin-bottom: 5px;"></i>
          <span class="mesa-numero" style="font-size: 1.5rem;">R${parseInt(numeroRecoger)}</span>
        </div>
      `;
    } else {
      boton.className = `mesa-btn mesa-activa ${mesa === mesaSeleccionada ? 'mesa-seleccionada' : ''}`;
      boton.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <span class="mesa-numero" style="font-size: 1.5rem;">${mesa}</span>
        </div>
      `;
    }

    boton.onclick = () => seleccionarMesa(mesa);
    container.appendChild(boton);
  });
}

// Función para seleccionar una mesa
function seleccionarMesa(mesa) {
  console.log('Seleccionando mesa:', mesa);
  mesaSeleccionada = mesa;
  document.getElementById('mesaActual').textContent = mesa;
  actualizarMesasActivas();
  actualizarVistaOrden(mesa);
}

// Función para mostrar productos en el panel
function mostrarProductos() {
  const categoriasDiv = document.getElementById('categorias');
  categoriasDiv.innerHTML = '';
  
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

// Función para formatear precio (sin decimales)
function formatearPrecio(precio) {
  const numero = Math.round(precio);
  return `$ ${numero.toLocaleString('es-CO')}`;
}

// Función para formatear precio con decimales (para recibos)
function formatearPrecioRecibo(precio) {
  const numero = Math.round(precio);
  return `$ ${numero.toLocaleString('es-CO')}`;
}

// Función para mostrar los productos filtrados
function mostrarProductosFiltrados(productosFiltrados) {
  const tablaOrden = document.getElementById('ordenCuerpo');
  tablaOrden.innerHTML = '';
  
  if (productosFiltrados.length === 0) {
    tablaOrden.innerHTML = '<tr><td colspan="3" class="text-center">No hay productos en esta categoría</td></tr>';
    return;
  }
  
  productosFiltrados.forEach(producto => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td style="width: 60%">${producto.nombre}</td>
      <td style="width: 20%"><button class='btn btn-primary btn-sm' onclick='agregarProducto(${producto.id})'>Agregar</button></td>
      <td style="width: 20%">${formatearPrecio(producto.precio)}</td>
    `;
    tablaOrden.appendChild(fila);
  });
}

// Función para agregar producto a la orden
function agregarProducto(id) {
  if (!mesaSeleccionada) {
    alert('Por favor, seleccione una mesa primero');
    return;
  }

  const producto = productos.find(p => p.id === id);
  if (!producto) {
    console.error('Producto no encontrado:', id);
    alert('Producto no encontrado');
    return;
  }

  let pedido = mesasActivas.get(mesaSeleccionada);
  if (!pedido) {
    // Si no existe el pedido, crear uno nuevo
    pedido = {
      items: [],
      estado: 'pendiente',
      fecha: new Date().toLocaleString(),
      ronda: 1 // Inicializar la ronda
    };
    mesasActivas.set(mesaSeleccionada, pedido);
  }

  if (!pedido.items) {
    pedido.items = [];
  }

  // Si hay productos en cocina, incrementar la ronda
  if (pedido.items.some(item => item.estado === 'en_cocina')) {
    pedido.ronda = (pedido.ronda || 1) + 1;
  }

  const productoExistente = pedido.items.find(p => p.id === id && p.estado !== 'en_cocina');

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    pedido.items.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      cantidad: 1,
      detalles: '',
      estado: 'pendiente',
      ronda: pedido.ronda
    });
  }

  console.log('Producto agregado:', producto);
  console.log('Orden actual:', pedido);
  
  guardarMesas();
  actualizarVistaOrden(mesaSeleccionada);
}

// Función para actualizar la vista de la orden
function actualizarVistaOrden(mesa) {
  console.log('Actualizando vista de orden para mesa:', mesa);
  const ordenCuerpo = document.getElementById('ordenCuerpo');
  ordenCuerpo.innerHTML = '';

  if (!mesasActivas.has(mesa)) {
    console.log('No hay orden para la mesa:', mesa);
    return;
  }

  const pedido = mesasActivas.get(mesa);
  console.log('Orden de la mesa:', pedido);

  // Actualizar el título de la orden con el nombre del cliente si es domicilio o recoger
  const mesaActual = document.getElementById('mesaActual');
  if (mesa.startsWith('DOM-')) {
    const cliente = pedido.cliente || 'Cliente no especificado';
    mesaActual.textContent = `Domicilio - ${cliente}`;
  } else if (mesa.startsWith('REC-')) {
    const cliente = pedido.cliente || 'Cliente no especificado';
    mesaActual.textContent = `Recoger - ${cliente}`;
  } else {
    mesaActual.textContent = mesa;
  }

  if (!pedido.items || pedido.items.length === 0) {
    ordenCuerpo.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos en la orden</td></tr>';
    return;
  }

  // Agrupar productos por ronda
  const productosPorRonda = {};
  pedido.items.forEach(item => {
    if (!productosPorRonda[item.ronda]) {
      productosPorRonda[item.ronda] = [];
    }
    productosPorRonda[item.ronda].push(item);
  });

  // Mostrar productos por ronda
  Object.entries(productosPorRonda).forEach(([ronda, items]) => {
    // Agregar encabezado de ronda
    const filaRonda = document.createElement('tr');
    filaRonda.className = 'table-secondary';
    filaRonda.innerHTML = `
      <td colspan="6" class="text-center">
        <strong>Ronda ${ronda}</strong>
        ${items.some(item => item.estado === 'en_cocina') ? 
          '<span class="badge bg-success ms-2">En Cocina</span>' : ''}
      </td>
    `;
    ordenCuerpo.appendChild(filaRonda);

    // Mostrar productos de esta ronda
    items.forEach(item => {
      const fila = document.createElement('tr');
      fila.className = item.estado === 'en_cocina' ? 'table-success' : '';
      fila.innerHTML = `
        <td style="width: 30%">${item.nombre}</td>
        <td style="width: 12%">
          <div class="input-group input-group-sm">
            <button class="btn btn-outline-light btn-sm px-1" onclick="cambiarCantidad(${item.id}, '${mesa}', -1)">-</button>
            <input type='number' class='form-control form-control-sm bg-dark text-white border-light text-center' 
                   value='${item.cantidad}' min='1'
                   style="width: 40px;"
                   onchange='actualizarCantidad(this, ${item.id}, "${mesa}")' />
            <button class="btn btn-outline-light btn-sm px-1" onclick="cambiarCantidad(${item.id}, '${mesa}', 1)">+</button>
          </div>
        </td>
        <td style="width: 12%">${formatearPrecio(item.precio)}</td>
        <td style="width: 12%">${formatearPrecio(item.precio * item.cantidad)}</td>
        <td style="width: 31%">
          <input type='text' class='form-control form-control-sm bg-dark text-white border-light' 
                 value='${item.detalles || ''}' 
                 placeholder='Ej: Sin lechuga, sin salsa...'
                 onchange='actualizarDetalles(this, ${item.id}, "${mesa}")' />
        </td>
        <td style="width: 3%">
          <button class='btn btn-danger btn-sm' onclick='eliminarProductoOrden(this, "${mesa}")'>
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      ordenCuerpo.appendChild(fila);
    });
  });

  actualizarTotal(mesa);
}

// Función para cambiar cantidad con botones + y -
function cambiarCantidad(id, mesa, cambio) {
  const pedido = mesasActivas.get(mesa);
  if (!pedido || !pedido.items) return;

  const producto = pedido.items.find(p => p.id === id);
  if (producto) {
    const nuevaCantidad = producto.cantidad + cambio;
    if (nuevaCantidad >= 1) {
      producto.cantidad = nuevaCantidad;
      guardarMesas();
      actualizarVistaOrden(mesa);
    }
  }
}

// Función para actualizar cantidad
function actualizarCantidad(input, id, mesa) {
  const cantidad = parseInt(input.value);
  if (isNaN(cantidad) || cantidad < 1) {
    input.value = 1;
    return;
  }

  const pedido = mesasActivas.get(mesa);
  if (!pedido || !pedido.items) return;

  const producto = pedido.items.find(p => p.id === id);
  if (producto) {
    producto.cantidad = cantidad;
    guardarMesas();
    actualizarVistaOrden(mesa);
  }
}

// Función para actualizar detalles del producto
function actualizarDetalles(input, id, mesa) {
  const detalles = input.value.trim();
  const pedido = mesasActivas.get(mesa);
  
  if (!pedido || !pedido.items) return;
  
  const producto = pedido.items.find(p => p.id === id);
  if (producto) {
    producto.detalles = detalles;
    guardarMesas();
  }
}

// Función para eliminar producto de la orden
function eliminarProductoOrden(boton, mesa) {
  const fila = boton.closest('tr');
  const nombreProducto = fila.cells[0].textContent;
  const pedido = mesasActivas.get(mesa);
  
  if (!pedido || !pedido.items) return;
  
  const index = pedido.items.findIndex(p => p.nombre === nombreProducto);
  if (index !== -1) {
    pedido.items.splice(index, 1);
    guardarMesas();
    actualizarVistaOrden(mesa);
  }
}

// Función para actualizar el total
function actualizarTotal(mesa) {
  if (!mesasActivas.has(mesa)) return;

  const pedido = mesasActivas.get(mesa);
  if (!pedido || !pedido.items) return;

  let subtotal = pedido.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  const propina = parseFloat(document.getElementById('propina').value) || 0;
  const descuento = parseFloat(document.getElementById('descuento').value) || 0;
  
  pedido.propina = propina;
  pedido.descuento = descuento;
  
  const propinaMonto = Math.round((subtotal * propina) / 100);
  const total = Math.round(subtotal + propinaMonto - descuento);
  
  document.getElementById('totalOrden').textContent = formatearPrecio(total);
  
  const desglose = document.getElementById('desgloseTotal');
  if (desglose) {
    desglose.innerHTML = `
      <div class="small text-muted">
        <div>Subtotal: ${formatearPrecio(subtotal)}</div>
        <div>Propina (${propina}%): ${formatearPrecio(propinaMonto)}</div>
        <div>Descuento: ${formatearPrecio(descuento)}</div>
      </div>
    `;
  }
  
  guardarMesas();
}

// Función para enviar a cocina
function enviarACocina() {
  if (!mesaSeleccionada || !mesasActivas.has(mesaSeleccionada)) {
    alert('Por favor, seleccione una mesa con productos');
    return;
  }

  const pedido = mesasActivas.get(mesaSeleccionada);
  if (!pedido || !pedido.items || pedido.items.length === 0) {
    alert('No hay productos para enviar a cocina');
    return;
  }

  // Filtrar solo los productos que no han sido enviados a cocina
  const productosNuevos = pedido.items.filter(item => item.estado !== 'en_cocina');
  
  if (productosNuevos.length === 0) {
    alert('No hay nuevos productos para enviar a cocina');
    return;
  }

  // Marcar productos nuevos como enviados a cocina
  productosNuevos.forEach(item => {
    item.estado = 'en_cocina';
  });

  // Guardar orden en cocina
  ordenesCocina.set(mesaSeleccionada, productosNuevos);
  
  // Agregar al historial de cocina
  const ordenCocina = {
    id: Date.now(),
    fecha: new Date().toLocaleString(),
    mesa: mesaSeleccionada,
    items: productosNuevos,
    cliente: pedido.cliente || null,
    telefono: pedido.telefono || null,
    direccion: pedido.direccion || null,
    horaRecoger: pedido.horaRecoger || null,
    ronda: pedido.ronda || 1
  };
  
  historialCocina.push(ordenCocina);
  guardarHistorialCocina();
  guardarMesas();

  // Imprimir ticket de cocina solo con los productos nuevos
  imprimirTicketCocina(mesaSeleccionada, productosNuevos);
}

// Función para generar ticket de cocina
function generarTicketCocina(pedido) {
  const fecha = new Date().toLocaleString();
  let ticket = `
    <div class="ticket-cocina">
      <div class="ticket-header">
        <h2>Ticket de Cocina</h2>
        <p>Fecha: ${fecha}</p>
        <p>Mesa: ${pedido.mesa}</p>
        ${pedido.cliente ? `<p>Cliente: ${pedido.cliente}</p>` : ''}
      </div>
      <div class="ticket-body">
        <table>
          <thead>
            <tr>
              <th>Cant</th>
              <th>Producto</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
  `;

  pedido.items.forEach(item => {
    ticket += `
      <tr>
        <td>${item.cantidad}</td>
        <td>${item.nombre}</td>
        <td>${item.detalles || '-'}</td>
      </tr>
    `;
  });

  ticket += `
          </tbody>
        </table>
      </div>
      <div class="ticket-footer">
        <p>Total de productos: ${pedido.items.length}</p>
      </div>
    </div>
  `;

  return ticket;
}

// Función para obtener o crear la ventana de impresión
function obtenerVentanaImpresion() {
  if (!ventanaImpresion || ventanaImpresion.closed) {
    ventanaImpresion = window.open('', 'ventanaImpresion', 'width=400,height=600');
  }
  return ventanaImpresion;
}

// Función para imprimir ticket de cocina
function imprimirTicketCocina(mesa, productos) {
  const ventana = obtenerVentanaImpresion();
  
  // Obtener el pedido completo para acceder a la información del cliente
  const pedidoCompleto = mesasActivas.get(mesa);
  let infoCliente = '';
  
  if (pedidoCompleto && pedidoCompleto.cliente) {
    infoCliente = `
      <div class="cliente-info">
        <div class="cliente-label">Cliente:</div>
        <div class="cliente-datos">
          <strong>${pedidoCompleto.cliente}</strong><br>
          Tel: ${pedidoCompleto.telefono || 'No disponible'}<br>
          ${mesa.startsWith('DOM-') ? 
            `Dir: ${pedidoCompleto.direccion || 'No disponible'}` : 
            `Hora: ${pedidoCompleto.horaRecoger || 'No disponible'}`
          }
        </div>
      </div>
    `;
  }
  
  const contenido = `
    <html>
      <head>
        <title>Ticket Cocina</title>
        <style>
          body { 
            font-family: monospace;
            font-size: 10px;
            width: 80mm;
            margin: 0;
            padding: 2mm;
          }
          .text-center { text-align: center; }
          .mb-1 { margin-bottom: 1px; }
          .mt-1 { margin-top: 1px; }
          table { 
            width: 100%;
            border-collapse: collapse;
            margin: 2px 0;
          }
          th, td { 
            padding: 1px;
            text-align: left;
            font-size: 10px;
          }
          .border-top { 
            border-top: 1px dashed #000;
            margin-top: 2px;
            padding-top: 2px;
          }
          .header {
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
            margin-bottom: 2px;
          }
          .producto {
            font-weight: bold;
            font-size: 11px;
          }
          .detalles {
            font-size: 9px;
            color: #000;
            font-style: italic;
            margin-top: 1px;
            padding-left: 2px;
          }
          .cliente-info {
            margin: 4px 0;
            padding: 2px;
            border: 1px dashed #000;
            border-radius: 2px;
            font-size: 9px;
          }
          .cliente-label {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 1px;
          }
          .cliente-datos {
            font-size: 9px;
            line-height: 1.2;
          }
          .botones-impresion {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
          }
          .botones-impresion button {
            margin-left: 5px;
            padding: 5px 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          }
          .botones-impresion button:hover {
            background: #0056b3;
          }
          @media print {
            .botones-impresion {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="botones-impresion">
          <button onclick="window.print()">Imprimir</button>
          <button onclick="window.close()">Cerrar</button>
        </div>

        <div class="header text-center">
          <h2 style="margin: 0; font-size: 14px;">COCINA</h2>
          <div class="mb-1">Mesa: ${mesa}</div>
          <div class="mb-1">${new Date().toLocaleString()}</div>
        </div>
        
        ${infoCliente}
        
        <table>
          <thead>
            <tr>
              <th style="width: 20%">Cant</th>
              <th>Producto</th>
            </tr>
          </thead>
          <tbody>
            ${productos.map(item => `
              <tr>
                <td>${item.cantidad}</td>
                <td>
                  <div class="producto">${item.nombre}</div>
                  ${item.detalles ? `
                    <div class="detalles">
                      <span class="detalle-label">Detalle:</span> ${item.detalles}
                    </div>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="text-center mt-1">
          <div class="border-top">¡Gracias!</div>
        </div>
      </body>
    </html>
  `;
  
  ventana.document.write(contenido);
  ventana.document.close();
}

// Función para mostrar el modal de pago
function mostrarModalPago() {
  if (!mesaSeleccionada || !mesasActivas.has(mesaSeleccionada)) {
    alert('Por favor, seleccione una mesa con productos');
    return;
  }

  const pedido = mesasActivas.get(mesaSeleccionada);
  if (!pedido || !pedido.items || pedido.items.length === 0) {
    alert('No hay productos para generar recibo');
    return;
  }

  // Actualizar la lista de clientes
  actualizarListaClientesPago();
  
  // Calcular totales
  const subtotal = pedido.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const propina = parseFloat(document.getElementById('propina').value) || 0;
  const descuento = parseFloat(document.getElementById('descuento').value) || 0;
  const propinaMonto = Math.round((subtotal * propina) / 100);
  const total = Math.round(subtotal + propinaMonto - descuento);
  
  // Actualizar los totales en el modal
  document.getElementById('subtotalModal').textContent = formatearPrecio(subtotal);
  document.getElementById('propinaModal').textContent = formatearPrecio(propinaMonto);
  document.getElementById('descuentoModal').textContent = formatearPrecio(descuento);
  document.getElementById('totalModal').textContent = formatearPrecio(total);
  
  // Limpiar campos del modal
  document.getElementById('montoRecibido').value = '';
  document.getElementById('cambio').textContent = formatearPrecio(0);
  document.getElementById('numeroTransferencia').value = '';
  
  // Mostrar el modal
  const modal = new bootstrap.Modal(document.getElementById('modalPago'));
  modal.show();

  // Agregar event listeners
  document.getElementById('montoRecibido').addEventListener('input', calcularCambio);
  document.getElementById('metodoPago').addEventListener('change', toggleMetodoPago);
}

// Función para actualizar la lista de clientes
function actualizarListaClientes() {
  const listaClientes = document.getElementById('listaClientes');
  listaClientes.innerHTML = '';
}

// Función para actualizar la lista de clientes en el modal de pago
function actualizarListaClientesPago() {
  const listaClientes = document.getElementById('listaClientesPago');
  listaClientes.innerHTML = '';
}

// Función para buscar clientes
function buscarClientes() {
  const busqueda = document.getElementById('buscarCliente').value.toLowerCase();
  const listaClientes = document.getElementById('listaClientes');
  listaClientes.innerHTML = '';

  if (!busqueda) {
    return;
  }

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(busqueda) || 
    cliente.telefono.includes(busqueda)
  );

  if (clientesFiltrados.length === 0) {
    listaClientes.innerHTML = '<p class="text-muted">No se encontraron clientes</p>';
    return;
  }

  clientesFiltrados.forEach(cliente => {
    const item = document.createElement('button');
    item.className = 'list-group-item list-group-item-action bg-dark text-white border-light';
    item.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-1">${cliente.nombre}</h6>
          <small>${cliente.telefono}</small>
        </div>
        <button class="btn btn-sm btn-outline-light" onclick="seleccionarCliente(${JSON.stringify(cliente).replace(/"/g, '&quot;')})">
          Seleccionar
        </button>
      </div>
    `;
    listaClientes.appendChild(item);
  });
}

// Función para buscar clientes en el modal de pago
function buscarClientesPago() {
  const busqueda = document.getElementById('buscarClientePago').value.toLowerCase();
  const listaClientes = document.getElementById('listaClientesPago');
  listaClientes.innerHTML = '';

  if (!busqueda) {
    return;
  }

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(busqueda) || 
    cliente.telefono.includes(busqueda)
  );

  if (clientesFiltrados.length === 0) {
    listaClientes.innerHTML = '<p class="text-muted">No se encontraron clientes</p>';
    return;
  }

  clientesFiltrados.forEach(cliente => {
    const item = document.createElement('button');
    item.className = 'list-group-item list-group-item-action bg-dark text-white border-light';
    item.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-1">${cliente.nombre}</h6>
          <small>${cliente.telefono}</small>
        </div>
        <button class="btn btn-sm btn-outline-light" onclick="seleccionarClientePago(${JSON.stringify(cliente).replace(/"/g, '&quot;')})">
          Seleccionar
        </button>
      </div>
    `;
    listaClientes.appendChild(item);
  });
}

// Función para seleccionar un cliente en el pago
function seleccionarClientePago(cliente) {
  const pedido = mesasActivas.get(mesaSeleccionada);
  if (pedido) {
    pedido.cliente = cliente.nombre;
    pedido.telefono = cliente.telefono;
    pedido.direccion = cliente.direccion;
    guardarMesas();
    
    // Mostrar mensaje de confirmación
    const mensaje = document.createElement('div');
    mensaje.className = 'alert alert-success mt-2';
    mensaje.textContent = `Cliente ${cliente.nombre} seleccionado`;
    document.getElementById('listaClientesPago').appendChild(mensaje);
    
    // Remover el mensaje después de 2 segundos
    setTimeout(() => {
      mensaje.remove();
    }, 2000);
  }
}

// Función para calcular el cambio
function calcularCambio() {
  const montoRecibido = parseInt(document.getElementById('montoRecibido').value) || 0;
  const totalText = document.getElementById('totalModal').textContent;
  const total = parseInt(totalText.replace(/[^0-9.-]+/g, '')) || 0;
  const cambio = montoRecibido - total;
  document.getElementById('cambio').textContent = `$ ${cambio}`;
}

// Función para alternar entre métodos de pago
function toggleMetodoPago() {
  const metodo = document.getElementById('metodoPago').value;
  const efectivoSection = document.getElementById('efectivoSection');
  const transferenciaSection = document.getElementById('transferenciaSection');
  
  if (metodo === 'efectivo') {
    efectivoSection.style.display = 'block';
    transferenciaSection.style.display = 'none';
  } else if (metodo === 'transferencia') {
    efectivoSection.style.display = 'none';
    transferenciaSection.style.display = 'block';
  } else {
    efectivoSection.style.display = 'none';
    transferenciaSection.style.display = 'none';
  }
}

// Función para mostrar el modal de cliente
function mostrarModalCliente(tipo) {
  tipoPedidoActual = tipo;
  const modal = new bootstrap.Modal(document.getElementById('modalCliente'));
  actualizarListaClientes();
  modal.show();
}

// Función para mostrar el formulario de nuevo cliente
function mostrarFormularioNuevoCliente() {
  document.getElementById('formularioNuevoCliente').style.display = 'block';
  document.getElementById('listaClientes').style.display = 'none';
}

// Función para ocultar el formulario de nuevo cliente
function ocultarFormularioNuevoCliente() {
  document.getElementById('formularioNuevoCliente').style.display = 'none';
  document.getElementById('listaClientes').style.display = 'block';
}

// Función para guardar nuevo cliente
function guardarNuevoCliente() {
  const nombre = document.getElementById('nuevoClienteNombre').value;
  const telefono = document.getElementById('nuevoClienteTelefono').value;
  const direccion = document.getElementById('nuevoClienteDireccion').value;

  if (!nombre || !telefono) {
    alert('Por favor, complete los campos requeridos');
    return;
  }

  const nuevoCliente = {
    id: Date.now(),
    documento: telefono, // Usamos el teléfono como documento
    nombre: nombre,
    apellido: 'No proporcionado',
    telefono: telefono,
    correo: 'No proporcionado',
    direccion: direccion || 'No proporcionado',
    fechaRegistro: new Date().toISOString()
  };

  // Usar window.clientes para mantener consistencia con admon.js
  if (!window.clientes) {
    window.clientes = [];
  }
  window.clientes.push(nuevoCliente);
  localStorage.setItem('clientes', JSON.stringify(window.clientes));
  
  // Limpiar formulario
  document.getElementById('nuevoClienteNombre').value = '';
  document.getElementById('nuevoClienteTelefono').value = '';
  document.getElementById('nuevoClienteDireccion').value = '';

  // Ocultar formulario y actualizar lista
  ocultarFormularioNuevoCliente();
  actualizarListaClientes();
  
  // Seleccionar el cliente recién creado
  seleccionarCliente(nuevoCliente);
}

// Función para seleccionar un cliente
function seleccionarCliente(cliente) {
  if (tipoPedidoActual === 'domicilio') {
    crearPedidoDomicilioConCliente(cliente);
  } else {
    crearPedidoRecogerConCliente(cliente);
  }
  
  // Cerrar modal
  bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
}

// Función para crear pedido de domicilio con cliente
function crearPedidoDomicilioConCliente(cliente) {
  contadorDomicilios++;
  guardarContadores();
  
  const idPedido = `DOM-${contadorDomicilios}`;
  const pedido = {
    tipo: 'domicilio',
    numero: contadorDomicilios,
    cliente: cliente.nombre,
    telefono: cliente.telefono,
    direccion: cliente.direccion,
    items: [],
    estado: 'pendiente',
    fecha: new Date().toLocaleString(),
    ronda: 1 // Inicializar la ronda
  };

  mesasActivas.set(idPedido, pedido);
  guardarMesas();
  actualizarMesasActivas();
  seleccionarMesa(idPedido);
}

// Función para crear pedido para recoger con cliente
function crearPedidoRecogerConCliente(cliente) {
  contadorRecoger++;
  guardarContadores();
  
  const horaRecoger = prompt('Ingrese la hora de recoger (ej: 14:30):');
  if (!horaRecoger) return;

  const idPedido = `REC-${contadorRecoger}`;
  const pedido = {
    tipo: 'recoger',
    numero: contadorRecoger,
    cliente: cliente.nombre,
    telefono: cliente.telefono,
    horaRecoger,
    items: [],
    estado: 'pendiente',
    fecha: new Date().toLocaleString(),
    ronda: 1 // Inicializar la ronda
  };

  mesasActivas.set(idPedido, pedido);
  guardarMesas();
  actualizarMesasActivas();
  seleccionarMesa(idPedido);
}

// Función para reiniciar contadores (puedes llamarla al inicio del día)
function reiniciarContadores() {
  contadorDomicilios = 0;
  contadorRecoger = 0;
  guardarContadores();
}

// Modificar las funciones existentes de crear pedido
function crearPedidoDomicilio() {
  mostrarModalCliente('domicilio');
}

function crearPedidoRecoger() {
  mostrarModalCliente('recoger');
}

// Función para crear nueva mesa
function crearNuevaMesa() {
  const numeroMesa = document.getElementById('nuevaMesa').value.trim();
  
  if (!numeroMesa) {
    alert('Por favor, ingrese un número de mesa');
    return;
  }

  if (mesasActivas.has(numeroMesa)) {
    alert('Esta mesa ya está activa');
    return;
  }

  // Crear nueva mesa
  mesasActivas.set(numeroMesa, []);
  guardarMesas();
  
  // Limpiar el input
  document.getElementById('nuevaMesa').value = '';
  
  // Actualizar la vista de mesas
  actualizarMesasActivas();
  
  // Seleccionar la nueva mesa
  seleccionarMesa(numeroMesa);
}

// Función para eliminar un pedido/mesa
function eliminarPedido() {
  if (!mesaSeleccionada) {
    alert('Por favor, seleccione una mesa o pedido para eliminar');
    return;
  }

  let mensaje = '';
  if (mesaSeleccionada.startsWith('DOM-')) {
    mensaje = '¿Está seguro que desea eliminar este pedido a domicilio?';
  } else if (mesaSeleccionada.startsWith('REC-')) {
    mensaje = '¿Está seguro que desea eliminar este pedido para recoger?';
  } else {
    mensaje = '¿Está seguro que desea eliminar esta mesa?';
  }

  if (confirm(mensaje)) {
    // Eliminar de mesas activas
    mesasActivas.delete(mesaSeleccionada);
    
    // Eliminar de órdenes de cocina si existe
    if (ordenesCocina.has(mesaSeleccionada)) {
      ordenesCocina.delete(mesaSeleccionada);
    }

    // Guardar cambios
    guardarMesas();

    // Limpiar la interfaz
    document.getElementById('ordenCuerpo').innerHTML = '';
    document.getElementById('propina').value = '';
    document.getElementById('descuento').value = '';
    document.getElementById('totalOrden').textContent = formatearPrecio(0);
    document.getElementById('desgloseTotal').innerHTML = '';
    document.getElementById('mesaActual').textContent = '-';
    mesaSeleccionada = null;

    // Actualizar vista de mesas
    actualizarMesasActivas();
  }
}

// Función para procesar el pago
function procesarPago() {
  const metodoPago = document.getElementById('metodoPago').value;
  const pedido = mesasActivas.get(mesaSeleccionada);
  
  if (!pedido || !pedido.items || pedido.items.length === 0) {
    alert('No hay productos en la orden');
    return;
  }

  // Calcular totales
  const subtotal = pedido.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const propina = parseFloat(document.getElementById('propina').value) || 0;
  const descuento = parseFloat(document.getElementById('descuento').value) || 0;
  const propinaMonto = Math.round((subtotal * propina) / 100);
  const total = Math.round(subtotal + propinaMonto - descuento);

  // Validar monto recibido si es efectivo
  if (metodoPago === 'efectivo') {
    const montoRecibido = parseFloat(document.getElementById('montoRecibido').value);
    if (!montoRecibido || montoRecibido < total) {
      alert('El monto recibido es insuficiente');
      return;
    }
  }

  // Validar número de transferencia si es transferencia
  if (metodoPago === 'transferencia') {
    const numeroTransferencia = document.getElementById('numeroTransferencia').value;
    if (!numeroTransferencia) {
      alert('Por favor, ingrese el número de transferencia');
      return;
    }
  }

  // Crear objeto de factura
  const factura = {
    id: Date.now(),
    fecha: new Date().toLocaleString(),
    mesa: mesaSeleccionada,
    items: pedido.items,
    subtotal: subtotal,
    propina: propina,
    propinaMonto: propinaMonto,
    descuento: descuento,
    total: total,
    metodoPago: metodoPago,
    montoRecibido: metodoPago === 'efectivo' ? parseFloat(document.getElementById('montoRecibido').value) : 0,
    cambio: metodoPago === 'efectivo' ? Math.round(parseFloat(document.getElementById('montoRecibido').value) - total) : 0,
    cliente: pedido.cliente || null,
    telefono: pedido.telefono || null,
    direccion: pedido.direccion || null,
    horaRecoger: pedido.horaRecoger || null
  };

  // Imprimir factura
  const ventana = obtenerVentanaImpresion();
  
  let tipoPedido = '';
  let infoAdicional = '';
  
  if (factura.mesa.startsWith('DOM-')) {
    tipoPedido = 'Pedido a Domicilio';
    if (factura.cliente) {
      infoAdicional = `
        <div class="border-top">
          <div class="mb-1">Cliente: ${factura.cliente}</div>
          <div class="mb-1">Dir: ${factura.direccion}</div>
          <div class="mb-1">Tel: ${factura.telefono}</div>
        </div>
      `;
    }
  } else if (factura.mesa.startsWith('REC-')) {
    tipoPedido = 'Pedido para Recoger';
    if (factura.cliente) {
      infoAdicional = `
        <div class="border-top">
          <div class="mb-1">Cliente: ${factura.cliente}</div>
          <div class="mb-1">Tel: ${factura.telefono}</div>
          <div class="mb-1">Hora: ${factura.horaRecoger}</div>
        </div>
      `;
    }
  }

  const formatearNumero = (num) => {
    const numero = Math.round(num);
    return numero.toLocaleString('es-CO');
  };
  
  const contenido = `
    <html>
      <head>
        <title>Factura</title>
        <style>
          body { 
            font-family: monospace;
            font-size: 10px;
            width: 80mm;
            margin: 0;
            padding: 2mm;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .mb-1 { margin-bottom: 1px; }
          .mt-1 { margin-top: 1px; }
          table { 
            width: 100%;
            border-collapse: collapse;
            margin: 2px 0;
          }
          th, td { 
            padding: 1px;
            text-align: left;
            font-size: 10px;
          }
          .border-top { 
            border-top: 1px dashed #000;
            margin-top: 2px;
            padding-top: 2px;
          }
          .header {
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
            margin-bottom: 2px;
          }
          .total-row {
            font-weight: bold;
          }
          .botones-impresion {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
          }
          .botones-impresion button {
            margin-left: 5px;
            padding: 5px 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          }
          .botones-impresion button:hover {
            background: #0056b3;
          }
          @media print {
            .botones-impresion {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="botones-impresion">
          <button onclick="window.print()">Imprimir</button>
          <button onclick="window.close()">Cerrar</button>
        </div>

        <div class="header text-center">
          <h2 style="margin: 0; font-size: 14px;">RESTAURANTE</h2>
          <div class="mb-1">${tipoPedido || 'Factura'}</div>
          <div class="mb-1">${factura.fecha}</div>
          ${!factura.mesa.startsWith('DOM-') && !factura.mesa.startsWith('REC-') ? 
            `<div class="mb-1">Mesa: ${factura.mesa}</div>` : ''}
        </div>
        
        ${infoAdicional}
        
        <table>
          <thead>
            <tr>
              <th style="width: 40%">Producto</th>
              <th style="width: 15%">Cant</th>
              <th style="width: 20%">Precio</th>
              <th style="width: 25%">Total</th>
            </tr>
          </thead>
          <tbody>
            ${factura.items.map(item => `
              <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$ ${formatearNumero(item.precio)}</td>
                <td>$ ${formatearNumero(item.precio * item.cantidad)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="border-top">
          <div class="mb-1">Subtotal: $ ${formatearNumero(factura.subtotal)}</div>
          <div class="mb-1">Propina (${factura.propina}%): $ ${formatearNumero(factura.propinaMonto)}</div>
          <div class="mb-1">Descuento: $ ${formatearNumero(factura.descuento)}</div>
          <div class="mb-1 total-row">Total: $ ${formatearNumero(factura.total)}</div>
        </div>
        
        <div class="border-top">
          <div class="mb-1">Pago: ${factura.metodoPago}</div>
          ${factura.metodoPago === 'efectivo' ? `
            <div class="mb-1">Recibido: $ ${formatearNumero(factura.montoRecibido)}</div>
            <div class="mb-1">Cambio: $ ${formatearNumero(factura.cambio)}</div>
          ` : ''}
        </div>
        
        <div class="text-center mt-1">
          <div class="border-top">¡Gracias por su visita!</div>
        </div>
      </body>
    </html>
  `;
  
  ventana.document.write(contenido);
  ventana.document.close();

  // Agregar al historial de ventas
  historialVentas.push(factura);
  guardarHistorialVentas();

  // Limpiar la mesa
  mesasActivas.delete(mesaSeleccionada);
  ordenesCocina.delete(mesaSeleccionada);
  guardarMesas();
  
  // Limpiar la interfaz
  document.getElementById('ordenCuerpo').innerHTML = '';
  document.getElementById('propina').value = '';
  document.getElementById('descuento').value = '';
  document.getElementById('totalOrden').textContent = formatearPrecio(0);
  document.getElementById('desgloseTotal').innerHTML = '';
  document.getElementById('mesaActual').textContent = '-';
  mesaSeleccionada = null;
  
  // Actualizar vista de mesas
  actualizarMesasActivas();
  
  // Cerrar modal
  bootstrap.Modal.getInstance(document.getElementById('modalPago')).hide();
  
  alert('Pago procesado correctamente');
}

// Función para reimprimir ticket de cocina desde el historial
function reimprimirTicketCocina(ordenId) {
  const orden = historialCocina.find(o => o.id === ordenId);
  if (orden) {
    imprimirTicketCocina(orden.mesa, orden.items);
  }
}

// Función para reimprimir factura desde el historial
function reimprimirFactura(ventaId) {
  const venta = historialVentas.find(v => v.id === ventaId);
  if (venta) {
    const ventana = obtenerVentanaImpresion();
    
    let tipoPedido = '';
    let infoAdicional = '';
    
    if (venta.mesa.startsWith('DOM-')) {
      tipoPedido = 'Pedido a Domicilio';
      if (venta.cliente) {
        infoAdicional = `
          <div class="border-top">
            <div class="mb-1">Cliente: ${venta.cliente}</div>
            <div class="mb-1">Dir: ${venta.direccion}</div>
            <div class="mb-1">Tel: ${venta.telefono}</div>
          </div>
        `;
      }
    } else if (venta.mesa.startsWith('REC-')) {
      tipoPedido = 'Pedido para Recoger';
      if (venta.cliente) {
        infoAdicional = `
          <div class="border-top">
            <div class="mb-1">Cliente: ${venta.cliente}</div>
            <div class="mb-1">Tel: ${venta.telefono}</div>
            <div class="mb-1">Hora: ${venta.horaRecoger}</div>
          </div>
        `;
      }
    }

    const contenido = `
      <html>
        <head>
          <title>Factura</title>
          <style>
            body { 
              font-family: monospace;
              font-size: 10px;
              width: 80mm;
              margin: 0;
              padding: 2mm;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .mb-1 { margin-bottom: 1px; }
            .mt-1 { margin-top: 1px; }
            table { 
              width: 100%;
              border-collapse: collapse;
              margin: 2px 0;
            }
            th, td { 
              padding: 1px;
              text-align: left;
              font-size: 10px;
            }
            .border-top { 
              border-top: 1px dashed #000;
              margin-top: 2px;
              padding-top: 2px;
            }
            .header {
              border-bottom: 1px dashed #000;
              padding-bottom: 2px;
              margin-bottom: 2px;
            }
            .total-row {
              font-weight: bold;
            }
            .botones-impresion {
              position: fixed;
              top: 10px;
              right: 10px;
              z-index: 1000;
            }
            .botones-impresion button {
              margin-left: 5px;
              padding: 5px 10px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 3px;
              cursor: pointer;
            }
            .botones-impresion button:hover {
              background: #0056b3;
            }
            @media print {
              .botones-impresion {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="botones-impresion">
            <button onclick="window.print()">Imprimir</button>
            <button onclick="window.close()">Cerrar</button>
          </div>

          <div class="header text-center">
            <h2 style="margin: 0; font-size: 14px;">RESTAURANTE</h2>
            <div class="mb-1">${tipoPedido || 'Factura'}</div>
            <div class="mb-1">${venta.fecha}</div>
            ${!venta.mesa.startsWith('DOM-') && !venta.mesa.startsWith('REC-') ? 
              `<div class="mb-1">Mesa: ${venta.mesa}</div>` : ''}
          </div>
          
          ${infoAdicional}
          
          <table>
            <thead>
              <tr>
                <th style="width: 40%">Producto</th>
                <th style="width: 15%">Cant</th>
                <th style="width: 20%">Precio</th>
                <th style="width: 25%">Total</th>
              </tr>
            </thead>
            <tbody>
              ${venta.items.map(item => `
                <tr>
                  <td>${item.nombre}</td>
                  <td>${item.cantidad}</td>
                  <td>$ ${formatearNumero(item.precio)}</td>
                  <td>$ ${formatearNumero(item.precio * item.cantidad)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="border-top">
            <div class="mb-1">Subtotal: $ ${formatearNumero(venta.subtotal)}</div>
            <div class="mb-1">Propina (${venta.propina}%): $ ${formatearNumero(venta.propinaMonto)}</div>
            <div class="mb-1">Descuento: $ ${formatearNumero(venta.descuento)}</div>
            <div class="mb-1 total-row">Total: $ ${formatearNumero(venta.total)}</div>
          </div>
          
          <div class="border-top">
            <div class="mb-1">Pago: ${venta.metodoPago}</div>
            ${venta.metodoPago === 'efectivo' ? `
              <div class="mb-1">Recibido: $ ${formatearNumero(venta.montoRecibido)}</div>
              <div class="mb-1">Cambio: $ ${formatearNumero(venta.cambio)}</div>
            ` : ''}
          </div>
          
          <div class="text-center mt-1">
            <div class="border-top">¡Gracias por su visita!</div>
          </div>
        </body>
      </html>
    `;
    
    ventana.document.write(contenido);
    ventana.document.close();
  }
}

// Función para mostrar el modal de cierre diario
function mostrarModalCierreDiario() {
  console.log('Intentando mostrar modal de cierre diario');
  const modalElement = document.getElementById('modalCierreDiario');
  console.log('Elemento modal:', modalElement);
  
  if (!modalElement) {
    console.error('No se encontró el elemento modalCierreDiario');
    return;
  }
  
  const modal = new bootstrap.Modal(modalElement);
  console.log('Modal creado:', modal);
  
  // Calcular totales del día
  const fechaHoy = new Date().toLocaleDateString();
  const ventasHoy = historialVentas.filter(venta => 
    new Date(venta.fecha).toLocaleDateString() === fechaHoy
  );
  
  const totalVentas = ventasHoy.reduce((sum, venta) => sum + venta.total, 0);
  const totalEfectivo = ventasHoy
    .filter(venta => venta.metodoPago === 'efectivo')
    .reduce((sum, venta) => sum + venta.total, 0);
  const totalTransferencia = ventasHoy
    .filter(venta => venta.metodoPago === 'transferencia')
    .reduce((sum, venta) => sum + venta.total, 0);
  
  // Obtener gastos del día desde el sistema de gastos
  const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  const gastosHoy = gastos.filter(g => 
    new Date(g.fecha).toLocaleDateString() === fechaHoy
  );
  
  const totalGastos = gastosHoy.reduce((sum, g) => sum + g.monto, 0);
  const balanceFinal = totalVentas - totalGastos;
  
  // Actualizar los totales en el modal
  document.getElementById('totalVentasHoy').textContent = formatearPrecio(totalVentas);
  document.getElementById('totalEfectivoHoy').textContent = formatearPrecio(totalEfectivo);
  document.getElementById('totalTransferenciaHoy').textContent = formatearPrecio(totalTransferencia);
  document.getElementById('totalGastos').textContent = formatearPrecio(totalGastos);
  document.getElementById('balanceFinal').textContent = formatearPrecio(balanceFinal);
  
  console.log('Mostrando modal...');
  modal.show();
}

// Función para mostrar historial de ventas
function mostrarHistorialVentas() {
  const tablaHistorial = document.getElementById('tablaHistorialVentas');
  const cuerpoTabla = tablaHistorial.querySelector('tbody');
  cuerpoTabla.innerHTML = '';

  // Obtener la fecha seleccionada del input
  const fechaSeleccionada = document.getElementById('fechaHistorialVentas').value;
  const fechaFiltro = fechaSeleccionada ? new Date(fechaSeleccionada) : new Date();

  // Filtrar ventas por fecha
  const ventasFiltradas = historialVentas.filter(venta => {
    const fechaVenta = new Date(venta.fecha);
    return fechaVenta.toDateString() === fechaFiltro.toDateString();
  });

  ventasFiltradas.forEach(venta => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${venta.fecha}</td>
      <td>${venta.tipo}</td>
      <td>${venta.cliente || '-'}</td>
      <td>${venta.total.toFixed(2)}</td>
      <td>${venta.metodoPago}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="reimprimirFactura('${venta.id}')">
          <i class="fas fa-print"></i>
        </button>
      </td>
    `;
    cuerpoTabla.appendChild(fila);
  });

  // Actualizar totales
  const totalVentas = ventasFiltradas.reduce((sum, venta) => sum + venta.total, 0);
  document.getElementById('totalVentasHistorial').textContent = totalVentas.toFixed(2);
}

// Función para mostrar historial de cocina
function mostrarHistorialCocina() {
  const tablaHistorial = document.getElementById('tablaHistorialCocina');
  const cuerpoTabla = tablaHistorial.querySelector('tbody');
  cuerpoTabla.innerHTML = '';

  // Obtener la fecha seleccionada del input
  const fechaSeleccionada = document.getElementById('fechaHistorialCocina').value;
  const fechaFiltro = fechaSeleccionada ? new Date(fechaSeleccionada) : new Date();

  // Filtrar órdenes por fecha
  const ordenesFiltradas = historialCocina.filter(orden => {
    const fechaOrden = new Date(orden.fecha);
    return fechaOrden.toDateString() === fechaFiltro.toDateString();
  });

  ordenesFiltradas.forEach(orden => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${orden.fecha}</td>
      <td>${orden.mesa || orden.tipo}</td>
      <td>${orden.cliente || '-'}</td>
      <td>${orden.items.map(item => item.nombre).join(', ')}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="reimprimirTicketCocina('${orden.id}')">
          <i class="fas fa-print"></i>
        </button>
      </td>
    `;
    cuerpoTabla.appendChild(fila);
  });
}

// Función para mostrar el modal de historial de ventas
function mostrarModalHistorialVentas() {
  const modal = new bootstrap.Modal(document.getElementById('modalHistorialVentas'));
  // Establecer la fecha actual por defecto
  document.getElementById('fechaHistorialVentas').valueAsDate = new Date();
  mostrarHistorialVentas();
  modal.show();
}

// Función para mostrar el modal de historial de cocina
function mostrarModalHistorialCocina() {
  const modal = new bootstrap.Modal(document.getElementById('modalHistorialCocina'));
  // Establecer la fecha actual por defecto
  document.getElementById('fechaHistorialCocina').valueAsDate = new Date();
  mostrarHistorialCocina();
  modal.show();
}

// Función para formatear número
function formatearNumero(num) {
  return num.toLocaleString('es-CO');
}

// Función para guardar el cierre diario
function guardarCierreDiario() {
  try {
    const fechaHoy = new Date().toLocaleDateString();
    const ventasHoy = historialVentas.filter(venta => 
      new Date(venta.fecha).toLocaleDateString() === fechaHoy
    );
    
    const totalVentas = ventasHoy.reduce((sum, venta) => sum + venta.total, 0);
    const totalEfectivo = ventasHoy
      .filter(venta => venta.metodoPago === 'efectivo')
      .reduce((sum, venta) => sum + venta.total, 0);
    const totalTransferencia = ventasHoy
      .filter(venta => venta.metodoPago === 'transferencia')
      .reduce((sum, venta) => sum + venta.total, 0);
    
    // Obtener gastos del día desde el sistema de gastos
    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    const gastosHoy = gastos.filter(g => 
      new Date(g.fecha).toLocaleDateString() === fechaHoy
    );
    
    const totalGastos = gastosHoy.reduce((sum, g) => sum + g.monto, 0);
    const balanceFinal = totalVentas - totalGastos;
    
    const cierreDiario = {
      fecha: new Date().toLocaleString(),
      ventas: {
        total: totalVentas,
        efectivo: totalEfectivo,
        transferencia: totalTransferencia
      },
      gastos: {
        total: totalGastos,
        detalles: gastosHoy
      },
      balance: balanceFinal,
      detalles: document.getElementById('detallesCierre').value
    };
    
    // Guardar en localStorage
    const cierresDiarios = JSON.parse(localStorage.getItem('cierresDiarios') || '[]');
    cierresDiarios.push(cierreDiario);
    localStorage.setItem('cierresDiarios', JSON.stringify(cierresDiarios));
    
    // Imprimir resumen
    imprimirResumenCierre(cierreDiario);

    // Verificar si XLSX está disponible
    if (typeof XLSX !== 'undefined') {
      try {
        exportarCierreDiarioExcel(cierreDiario, ventasHoy, gastosHoy);
        alert('Cierre diario guardado y exportado correctamente');
      } catch (error) {
        console.error('Error al exportar a Excel:', error);
        alert('Cierre diario guardado, pero hubo un error al exportar a Excel');
      }
    } else {
      alert('Cierre diario guardado correctamente');
    }
    
    // Cerrar modal
    const modalCierre = document.getElementById('modalCierreDiario');
    if (modalCierre) {
      const modal = bootstrap.Modal.getInstance(modalCierre);
      if (modal) {
        modal.hide();
      }
    }
  } catch (error) {
    console.error('Error al guardar cierre diario:', error);
    alert('Error al guardar el cierre diario. Por favor, intente nuevamente.');
  }
}

// Función para exportar cierre diario a Excel
function exportarCierreDiarioExcel(cierre, ventas, gastos) {
  // Crear el contenido del Excel
  let contenido = [
    // Hoja 1: Resumen del Cierre
    {
      nombre: 'Resumen Cierre',
      datos: [
        ['CIERRE DIARIO'],
        ['Fecha:', cierre.fecha],
        [''],
        ['RESUMEN DE VENTAS'],
        ['Total Ventas:', `$${cierre.ventas.total.toLocaleString()}`],
        ['- Efectivo:', `$${cierre.ventas.efectivo.toLocaleString()}`],
        ['- Transferencia:', `$${cierre.ventas.transferencia.toLocaleString()}`],
        [''],
        ['GASTOS'],
        ['Total Gastos:', `$${cierre.gastos.total.toLocaleString()}`],
        [''],
        ['BALANCE FINAL:', `$${cierre.balance.toLocaleString()}`],
        [''],
        ['Detalles:', cierre.detalles]
      ]
    },
    // Hoja 2: Detalle de Ventas
    {
      nombre: 'Detalle Ventas',
      datos: [
        ['FECHA', 'TIPO', 'CLIENTE', 'TOTAL', 'MÉTODO DE PAGO'],
        ...ventas.map(venta => [
          venta.fecha,
          venta.mesa.startsWith('DOM-') ? 'Domicilio' : 
          venta.mesa.startsWith('REC-') ? 'Recoger' : 'Mesa',
          venta.cliente || '-',
          venta.total,
          venta.metodoPago
        ]),
        ['', '', 'TOTAL VENTAS:', cierre.ventas.total, '']
      ]
    },
    // Hoja 3: Detalle de Gastos
    {
      nombre: 'Detalle Gastos',
      datos: [
        ['FECHA', 'CONCEPTO', 'MONTO', 'CATEGORÍA'],
        ...gastos.map(gasto => [
          new Date(gasto.fecha).toLocaleString(),
          gasto.descripcion,
          gasto.monto,
          gasto.categoria
        ]),
        ['', '', 'TOTAL GASTOS:', cierre.gastos.total, '']
      ]
    }
  ];

  // Crear el archivo Excel
  const wb = XLSX.utils.book_new();
  
  contenido.forEach(hoja => {
    const ws = XLSX.utils.aoa_to_sheet(hoja.datos);
    
    // Aplicar estilos a todas las hojas
    const wscols = [
      {wch: 20}, // Fecha
      {wch: 30}, // Concepto/Cliente
      {wch: 15}, // Monto
      {wch: 20}  // Categoría/Método
    ];
    ws['!cols'] = wscols;

    // Estilo para los encabezados
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center" }
    };

    // Aplicar estilo a los encabezados
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({r: 0, c: C});
      if (!ws[cellRef]) continue;
      ws[cellRef].s = headerStyle;
    }

    // Formatear números en la hoja de ventas
    if (hoja.nombre === 'Detalle Ventas') {
      for (let i = 1; i < hoja.datos.length; i++) {
        const cellRef = XLSX.utils.encode_cell({r: i, c: 3});
        if (ws[cellRef]) {
          ws[cellRef].z = '"$"#,##0';
          if (i === hoja.datos.length - 1) {
            ws[cellRef].s = { font: { bold: true } };
          }
        }
      }
    }

    // Formatear números en la hoja de gastos
    if (hoja.nombre === 'Detalle Gastos') {
      for (let i = 1; i < hoja.datos.length; i++) {
        const cellRef = XLSX.utils.encode_cell({r: i, c: 2});
        if (ws[cellRef]) {
          ws[cellRef].z = '"$"#,##0';
          if (i === hoja.datos.length - 1) {
            ws[cellRef].s = { font: { bold: true } };
          }
        }
      }
    }

    // Formatear números en la hoja de resumen
    if (hoja.nombre === 'Resumen Cierre') {
      const montos = [4, 5, 6, 9, 11]; // Índices de las filas con montos
      montos.forEach(row => {
        const cellRef = XLSX.utils.encode_cell({r: row, c: 1});
        if (ws[cellRef]) {
          ws[cellRef].z = '"$"#,##0';
          if (row === 11) { // Balance Final
            ws[cellRef].s = { font: { bold: true } };
          }
        }
      });
    }
    
    XLSX.utils.book_append_sheet(wb, ws, hoja.nombre);
  });

  // Generar el archivo y descargarlo
  const fecha = new Date().toLocaleDateString().replace(/\//g, '-');
  XLSX.writeFile(wb, `Cierre_Diario_${fecha}.xlsx`);
}

// Función para imprimir el resumen del cierre
function imprimirResumenCierre(cierre) {
  const ventana = obtenerVentanaImpresion();
  
  const contenido = `
    <html>
      <head>
        <title>Resumen Cierre Diario</title>
        <style>
          body { 
            font-family: monospace;
            font-size: 10px;
            width: 80mm;
            margin: 0;
            padding: 2mm;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .mb-1 { margin-bottom: 1px; }
          .mt-1 { margin-top: 1px; }
          .border-top { 
            border-top: 1px dashed #000;
            margin-top: 2px;
            padding-top: 2px;
          }
          .header {
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
            margin-bottom: 2px;
          }
          .total-row {
            font-weight: bold;
          }
          .botones-impresion {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
          }
          .botones-impresion button {
            margin-left: 5px;
            padding: 5px 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          }
          .botones-impresion button:hover {
            background: #0056b3;
          }
          @media print {
            .botones-impresion {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="botones-impresion">
          <button onclick="window.print()">Imprimir</button>
          <button onclick="window.close()">Cerrar</button>
        </div>

        <div class="header text-center">
          <h2 style="margin: 0; font-size: 14px;">CIERRE DIARIO</h2>
          <div class="mb-1">${cierre.fecha}</div>
        </div>
        
        <div class="border-top">
          <div class="mb-1">Ventas Totales: $ ${formatearNumero(cierre.ventas.total)}</div>
          <div class="mb-1">- Efectivo: $ ${formatearNumero(cierre.ventas.efectivo)}</div>
          <div class="mb-1">- Transferencia: $ ${formatearNumero(cierre.ventas.transferencia)}</div>
        </div>
        
        <div class="border-top">
          <div class="mb-1">Gastos Totales: $ ${formatearNumero(cierre.gastos.total)}</div>
        </div>
        
        <div class="border-top total-row">
          <div class="mb-1">Balance Final: $ ${formatearNumero(cierre.balance)}</div>
        </div>
        
        ${cierre.detalles ? `
          <div class="border-top">
            <div class="mb-1">Detalles:</div>
            <div class="mb-1">${cierre.detalles}</div>
          </div>
        ` : ''}
        
        <div class="text-center mt-1">
          <div class="border-top">¡Fin del día!</div>
        </div>
      </body>
    </html>
  `;
  
  ventana.document.write(contenido);
  ventana.document.close();
}

// Función para inicializar WhatsApp Web
function inicializarWhatsApp() {
    const container = document.getElementById('whatsappContainer');
    if (!container) return;

    // Crear el iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://web.whatsapp.com';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    // Mensaje de carga
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'whatsapp-loading';
    loadingDiv.innerHTML = `
        <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando WhatsApp Web...</p>
    `;

    container.appendChild(loadingDiv);

    // Manejar la carga del iframe
    iframe.onload = function() {
        loadingDiv.remove();
        container.appendChild(iframe);
    };

    iframe.onerror = function() {
        loadingDiv.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle"></i>
                Error al cargar WhatsApp Web
            </div>
            <button class="btn btn-primary mt-3" onclick="inicializarWhatsApp()">
                <i class="fas fa-redo"></i> Reintentar
            </button>
        `;
    };
}

// Inicializar WhatsApp cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarWhatsApp();
});

// Función para mostrar/ocultar el panel de WhatsApp
function toggleWhatsApp() {
  const panel = document.getElementById('whatsappPanel');
  const button = document.getElementById('toggleWhatsApp');
  
  if (!panel.classList.contains('active')) {
    panel.classList.add('active');
    button.innerHTML = '<i class="fas fa-times"></i>';
    
    // Inicializar WhatsApp si no se ha hecho antes
    if (!document.querySelector('#whatsappContainer iframe')) {
      inicializarWhatsApp();
    }
  } else {
    panel.classList.remove('active');
    button.innerHTML = '<i class="fab fa-whatsapp"></i>';
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  cargarDatos();
  
  // Inicializar WhatsApp Web
  inicializarWhatsApp();
  
  // Agregar evento para el botón de nueva mesa
  document.getElementById('btnNuevaMesa').addEventListener('click', crearNuevaMesa);
  
  // Agregar evento para la tecla Enter en el input de número de mesa
  document.getElementById('nuevaMesa').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      crearNuevaMesa();
    }
  });
  
  // Actualizar total cuando cambian propina o descuento
  document.getElementById('propina').addEventListener('input', () => {
    if (mesaSeleccionada) {
      actualizarTotal(mesaSeleccionada);
    }
  });
  
  document.getElementById('descuento').addEventListener('input', () => {
    if (mesaSeleccionada) {
      actualizarTotal(mesaSeleccionada);
    }
  });
});
  