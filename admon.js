// Variables globales
window.categorias = JSON.parse(localStorage.getItem('categorias')) || [];
window.productos = JSON.parse(localStorage.getItem('productos')) || [];
window.ventas = JSON.parse(localStorage.getItem('ventas')) || [];
window.clientes = JSON.parse(localStorage.getItem('clientes')) || [];

// Variables globales para paginación
let paginaActualClientes = 1;
let paginaActualProductos = 1;
let clientesPorPagina = 10;
let productosPorPagina = 10;
let clientesFiltrados = [];
let productosFiltrados = [];

// Inicialización
window.onload = function() {
    console.log('Inicializando admon.js...');
    console.log('Categorías:', window.categorias);
    console.log('Productos:', window.productos);
    console.log('Clientes:', window.clientes);
    
    cargarCategorias();
    cargarProductos();
    cargarClientes();
    cargarVentas();
};

// Funciones para Categorías
function agregarCategoria() {
    console.log('Intentando agregar categoría...');
    const inputCategoria = document.getElementById('nuevaCategoria');
    if (!inputCategoria) {
        console.error('No se encontró el input de categoría');
        return;
    }

    const nombre = inputCategoria.value.trim();
    if (!nombre) {
        alert('Por favor ingrese un nombre para la categoría');
        return;
    }

    if (window.categorias.includes(nombre)) {
        alert('Esta categoría ya existe');
        return;
    }

    window.categorias.push(nombre);
    localStorage.setItem('categorias', JSON.stringify(window.categorias));
    cargarCategorias();
    inputCategoria.value = '';
    console.log('Categoría agregada:', nombre);
}

function cargarCategorias() {
    console.log('Cargando categorías...');
    const listaCategorias = document.getElementById('listaCategorias');
    const selectCategoria = document.getElementById('categoriaProducto');
    
    if (!listaCategorias || !selectCategoria) {
        console.error('No se encontraron los elementos para cargar categorías');
        return;
    }

    listaCategorias.innerHTML = '';
    selectCategoria.innerHTML = '<option value="">Seleccionar categoría</option>';
    
    window.categorias.forEach(categoria => {
        // Lista de categorías
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center mb-2';
        div.innerHTML = `
            <div class="form-check me-3">
                <input class="form-check-input checkbox-alerta" type="checkbox" value="${categoria}" id="cat_${categoria}">
                <label class="form-check-label" for="cat_${categoria}">${categoria}</label>
            </div>
            <button class="btn btn-sm btn-outline-info ms-auto" onclick="modificarCategoria('${categoria}')">Modificar</button>
        `;
        listaCategorias.appendChild(div);

        // Select de categorías
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });
    console.log('Categorías cargadas:', window.categorias);
}

// Funciones para Productos
function agregarProducto() {
    console.log('Intentando agregar producto...');
    const nombre = document.getElementById('nombreProducto').value.trim();
    const precio = parseFloat(document.getElementById('precioProducto').value);
    const categoria = document.getElementById('categoriaProducto').value;

    if (!nombre || isNaN(precio) || !categoria) {
        alert('Por favor complete todos los campos');
        return;
    }

    const producto = {
        id: Date.now(),
        nombre: nombre,
        precio: precio,
        categoria: categoria
    };

    window.productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(window.productos));
    cargarProductos();
    
    // Limpiar campos
    document.getElementById('nombreProducto').value = '';
    document.getElementById('precioProducto').value = '';
    document.getElementById('categoriaProducto').value = '';
    console.log('Producto agregado:', producto);
}

function cargarProductos() {
    console.log('Cargando productos...');
    const listaProductos = document.getElementById('listaProductos');
    if (!listaProductos) {
        console.error('No se encontró el elemento para cargar productos');
        return;
    }

    // Usar productos filtrados si hay búsqueda, sino usar todos los productos
    const productosAMostrar = productosFiltrados.length > 0 ? productosFiltrados : window.productos;
    
    // Calcular paginación
    const inicio = (paginaActualProductos - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPaginados = productosAMostrar.slice(inicio, fin);

    listaProductos.innerHTML = '';

    productosPaginados.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="form-check-input checkbox-alerta" value="${producto.id}"></td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.categoria}</td>
            <td>
                <button class="btn btn-sm btn-outline-info" onclick="modificarProducto(${producto.id})">Modificar</button>
            </td>
        `;
        listaProductos.appendChild(tr);
    });

    // Generar paginación
    const totalPaginas = Math.ceil(productosAMostrar.length / productosPorPagina);
    generarPaginacion('paginacionProductos', totalPaginas, paginaActualProductos, cambiarPaginaProductos);
}

// Funciones para Clientes
function agregarCliente() {
    console.log('Intentando agregar cliente...');
    const documento = document.getElementById('documentoCliente').value.trim();
    const nombre = document.getElementById('nombreCliente').value.trim();
    const apellido = document.getElementById('apellidoCliente').value.trim();
    const telefono = document.getElementById('telefonoCliente').value.trim();
    const correo = document.getElementById('correoCliente').value.trim();

    if (!documento || !nombre || !apellido || !telefono || !correo) {
        alert('Por favor complete todos los campos');
        return;
    }

    if (window.clientes.some(c => c.documento === documento)) {
        alert('Ya existe un cliente con este documento');
        return;
    }

    const cliente = {
        id: Date.now(),
        documento: documento,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        correo: correo,
        fechaRegistro: new Date().toISOString()
    };

    window.clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(window.clientes));
    cargarClientes();

    // Limpiar campos
    document.getElementById('documentoCliente').value = '';
    document.getElementById('nombreCliente').value = '';
    document.getElementById('apellidoCliente').value = '';
    document.getElementById('telefonoCliente').value = '';
    document.getElementById('correoCliente').value = '';
    console.log('Cliente agregado:', cliente);
}

function cargarClientes() {
    console.log('Cargando clientes...');
    const listaClientes = document.getElementById('listaClientes');
    if (!listaClientes) {
        console.error('No se encontró el elemento para cargar clientes');
        return;
    }

    // Usar clientes filtrados si hay búsqueda, sino usar todos los clientes
    const clientesAMostrar = clientesFiltrados.length > 0 ? clientesFiltrados : window.clientes;
    
    // Calcular paginación
    const inicio = (paginaActualClientes - 1) * clientesPorPagina;
    const fin = inicio + clientesPorPagina;
    const clientesPaginados = clientesAMostrar.slice(inicio, fin);

    listaClientes.innerHTML = '';

    clientesPaginados.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="form-check-input checkbox-alerta" value="${cliente.id}"></td>
            <td>${cliente.documento}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.correo}</td>
            <td>
                <button class="btn btn-sm btn-outline-info" onclick="modificarCliente(${cliente.id})">Modificar</button>
            </td>
        `;
        listaClientes.appendChild(tr);
    });

    // Generar paginación
    const totalPaginas = Math.ceil(clientesAMostrar.length / clientesPorPagina);
    generarPaginacion('paginacionClientes', totalPaginas, paginaActualClientes, cambiarPaginaClientes);
}

// Funciones para Ventas
function cargarVentas() {
    console.log('Cargando ventas...');
    const tbody = document.getElementById('historialVentas');
    if (!tbody) {
        console.error('No se encontró el elemento para cargar ventas');
        return;
    }

    tbody.innerHTML = '';

    window.ventas.forEach(venta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(venta.fecha).toLocaleString()}</td>
            <td>${venta.mesa}</td>
            <td>$${venta.total}</td>
            <td>$${venta.propina}</td>
            <td>$${venta.descuento}</td>
            <td>$${venta.totalFinal}</td>
        `;
        tbody.appendChild(tr);
    });
    console.log('Ventas cargadas:', window.ventas);
}

// Funciones de eliminación
function eliminarCategoria() {
    const checkboxes = document.querySelectorAll('#listaCategorias input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('Por favor seleccione al menos una categoría para eliminar');
        return;
    }

    const categoriasAEliminar = Array.from(checkboxes).map(cb => cb.value);
    const confirmacion = confirm(`¿Está seguro que desea eliminar ${categoriasAEliminar.length} categoría(s)?`);

    if (confirmacion) {
        window.categorias = window.categorias.filter(c => !categoriasAEliminar.includes(c));
        localStorage.setItem('categorias', JSON.stringify(window.categorias));
        cargarCategorias();
    }
}

function eliminarProducto() {
    const checkboxes = document.querySelectorAll('#listaProductos input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('Por favor seleccione al menos un producto para eliminar');
        return;
    }

    const productosAEliminar = Array.from(checkboxes).map(cb => parseInt(cb.value));
    const confirmacion = confirm(`¿Está seguro que desea eliminar ${productosAEliminar.length} producto(s)?`);

    if (confirmacion) {
        window.productos = window.productos.filter(p => !productosAEliminar.includes(p.id));
        localStorage.setItem('productos', JSON.stringify(window.productos));
        cargarProductos();
    }
}

function eliminarCliente() {
    const checkboxes = document.querySelectorAll('#listaClientes input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('Por favor seleccione al menos un cliente para eliminar');
        return;
    }

    const clientesAEliminar = Array.from(checkboxes).map(cb => parseInt(cb.value));
    const confirmacion = confirm(`¿Está seguro que desea eliminar ${clientesAEliminar.length} cliente(s)?`);

    if (confirmacion) {
        window.clientes = window.clientes.filter(c => !clientesAEliminar.includes(c.id));
        localStorage.setItem('clientes', JSON.stringify(window.clientes));
        cargarClientes();
    }
}

// Funciones de modificación
function modificarCategoria(nombreActual) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre para la categoría:', nombreActual);
    if (!nuevoNombre) return;

    if (window.categorias.includes(nuevoNombre)) {
        alert('Esta categoría ya existe');
        return;
    }

    const index = window.categorias.indexOf(nombreActual);
    if (index !== -1) {
        window.categorias[index] = nuevoNombre;
        localStorage.setItem('categorias', JSON.stringify(window.categorias));
        cargarCategorias();
    }
}

function modificarProducto(id) {
    const producto = window.productos.find(p => p.id === id);
    if (!producto) return;

    const nuevoNombre = prompt('Ingrese el nuevo nombre:', producto.nombre);
    if (!nuevoNombre) return;

    const nuevoPrecio = prompt('Ingrese el nuevo precio:', producto.precio);
    if (!nuevoPrecio || isNaN(nuevoPrecio)) {
        alert('Por favor ingrese un precio válido');
        return;
    }

    const nuevaCategoria = prompt('Ingrese la nueva categoría:', producto.categoria);
    if (!nuevaCategoria || !window.categorias.includes(nuevaCategoria)) {
        alert('Por favor ingrese una categoría válida');
        return;
    }

    producto.nombre = nuevoNombre;
    producto.precio = parseFloat(nuevoPrecio);
    producto.categoria = nuevaCategoria;

    localStorage.setItem('productos', JSON.stringify(window.productos));
    cargarProductos();
}

function modificarCliente(id) {
    const cliente = window.clientes.find(c => c.id === id);
    if (!cliente) return;

    const nuevoDocumento = prompt('Ingrese el nuevo documento:', cliente.documento);
    if (!nuevoDocumento) return;

    const nuevoNombre = prompt('Ingrese el nuevo nombre:', cliente.nombre);
    if (!nuevoNombre) return;

    const nuevoApellido = prompt('Ingrese el nuevo apellido:', cliente.apellido);
    if (!nuevoApellido) return;

    const nuevoTelefono = prompt('Ingrese el nuevo teléfono:', cliente.telefono);
    if (!nuevoTelefono) return;

    const nuevoCorreo = prompt('Ingrese el nuevo correo:', cliente.correo);
    if (!nuevoCorreo) return;

    if (nuevoDocumento !== cliente.documento && 
        window.clientes.some(c => c.documento === nuevoDocumento)) {
        alert('Ya existe un cliente con este documento');
        return;
    }

    cliente.documento = nuevoDocumento;
    cliente.nombre = nuevoNombre;
    cliente.apellido = nuevoApellido;
    cliente.telefono = nuevoTelefono;
    cliente.correo = nuevoCorreo;

    localStorage.setItem('clientes', JSON.stringify(window.clientes));
    cargarClientes();
}

// Funciones para Cierre Diario
window.generarCierreDiario = function() {
    const fecha = document.getElementById('fechaCierre').value;
    if (!fecha) {
        alert('Por favor seleccione una fecha');
        return;
    }

    const ventasDia = window.ventas.filter(v => {
        const ventaFecha = new Date(v.fecha).toISOString().split('T')[0];
        return ventaFecha === fecha;
    });

    const totalDia = ventasDia.reduce((sum, v) => sum + v.total, 0);
    document.getElementById('totalDia').textContent = `$${totalDia}`;

    // Exportar cierre diario
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(ventasDia.map(v => ({
        Fecha: new Date(v.fecha).toLocaleString(),
        Mesa: v.mesa,
        Total: v.total
    })));
    XLSX.utils.book_append_sheet(wb, ws, "Cierre Diario");
    XLSX.writeFile(wb, `cierre_diario_${fecha}.xlsx`);
};

window.exportarHistorial = function() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(window.ventas.map(v => ({
        Fecha: new Date(v.fecha).toLocaleString(),
        Mesa: v.mesa,
        Total: v.total
    })));
    XLSX.utils.book_append_sheet(wb, ws, "Historial");
    XLSX.writeFile(wb, "historial_ventas.xlsx");
};

// Funciones de búsqueda y filtrado
function filtrarClientes() {
    const busqueda = document.getElementById('buscarCliente').value.toLowerCase();
    clientesFiltrados = window.clientes.filter(cliente => 
        cliente.documento.toLowerCase().includes(busqueda) ||
        cliente.nombre.toLowerCase().includes(busqueda) ||
        cliente.apellido.toLowerCase().includes(busqueda) ||
        cliente.telefono.toLowerCase().includes(busqueda) ||
        cliente.correo.toLowerCase().includes(busqueda)
    );
    paginaActualClientes = 1;
    cargarClientes();
}

function filtrarProductos() {
    const busqueda = document.getElementById('buscarProducto').value.toLowerCase();
    productosFiltrados = window.productos.filter(producto => 
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.categoria.toLowerCase().includes(busqueda) ||
        producto.precio.toString().includes(busqueda)
    );
    paginaActualProductos = 1;
    cargarProductos();
}

// Funciones de paginación
function cambiarPaginaClientes(nuevaPagina) {
    paginaActualClientes = nuevaPagina;
    cargarClientes();
}

function cambiarPaginaProductos(nuevaPagina) {
    paginaActualProductos = nuevaPagina;
    cargarProductos();
}

// Función para generar la paginación
function generarPaginacion(elementoId, totalPaginas, paginaActual, funcionCambio) {
    const paginacion = document.getElementById(elementoId);
    paginacion.innerHTML = '';

    // Botón anterior
    const liAnterior = document.createElement('li');
    liAnterior.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    liAnterior.innerHTML = `
        <a class="page-link" href="#" onclick="event.preventDefault(); ${funcionCambio.name}(${paginaActual - 1})">Anterior</a>
    `;
    paginacion.appendChild(liAnterior);

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
        li.innerHTML = `
            <a class="page-link" href="#" onclick="event.preventDefault(); ${funcionCambio.name}(${i})">${i}</a>
        `;
        paginacion.appendChild(li);
    }

    // Botón siguiente
    const liSiguiente = document.createElement('li');
    liSiguiente.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    liSiguiente.innerHTML = `
        <a class="page-link" href="#" onclick="event.preventDefault(); ${funcionCambio.name}(${paginaActual + 1})">Siguiente</a>
    `;
    paginacion.appendChild(liSiguiente);
} 