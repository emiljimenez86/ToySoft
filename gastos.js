// Variables globales
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

// Función para mostrar/ocultar el formulario de gastos
function agregarGasto() {
    const formGasto = document.getElementById('formGasto');
    formGasto.style.display = formGasto.style.display === 'none' ? 'block' : 'none';
}

// Función para guardar un nuevo gasto
function guardarGasto() {
    const descripcion = document.getElementById('descripcionGasto').value.trim();
    const monto = parseFloat(document.getElementById('montoGasto').value);
    const categoria = document.getElementById('categoriaGasto').value;

    if (!descripcion || isNaN(monto) || !categoria) {
        alert('Por favor complete todos los campos');
        return;
    }

    const gasto = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        descripcion,
        monto,
        categoria
    };

    gastos.push(gasto);
    localStorage.setItem('gastos', JSON.stringify(gastos));
    
    // Limpiar formulario y ocultarlo
    document.getElementById('descripcionGasto').value = '';
    document.getElementById('montoGasto').value = '';
    document.getElementById('categoriaGasto').value = '';
    document.getElementById('formGasto').style.display = 'none';
    
    // Actualizar la vista
    cargarGastos();
}

// Función para cargar y mostrar los gastos
function cargarGastos() {
    const hoy = new Date().toISOString().split('T')[0];
    const gastosHoy = gastos.filter(g => g.fecha.split('T')[0] === hoy);
    
    // Calcular total de gastos del día
    const totalGastos = gastosHoy.reduce((sum, g) => sum + g.monto, 0);
    document.getElementById('totalGastosHoy').textContent = `$${totalGastos.toFixed(2)}`;
    
    // Calcular gastos por categoría
    const gastosPorCategoria = {};
    gastosHoy.forEach(g => {
        gastosPorCategoria[g.categoria] = (gastosPorCategoria[g.categoria] || 0) + g.monto;
    });
    
    // Mostrar gastos por categoría
    const categoriaDiv = document.getElementById('gastosPorCategoria');
    categoriaDiv.innerHTML = '';
    Object.entries(gastosPorCategoria).forEach(([cat, monto]) => {
        const p = document.createElement('p');
        p.className = 'mb-1';
        p.textContent = `${cat}: $${monto.toFixed(2)}`;
        categoriaDiv.appendChild(p);
    });
    
    // Mostrar lista de gastos
    const listaGastos = document.getElementById('listaGastos');
    listaGastos.innerHTML = '';
    
    gastosHoy.forEach(gasto => {
        const div = document.createElement('div');
        div.className = 'gasto-item';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${gasto.descripcion}</h6>
                    <small class="text-muted">${gasto.categoria}</small>
                </div>
                <div class="text-end">
                    <h5 class="mb-0 text-warning">$${gasto.monto.toFixed(2)}</h5>
                    <small class="text-muted">${new Date(gasto.fecha).toLocaleTimeString()}</small>
                </div>
            </div>
        `;
        listaGastos.appendChild(div);
    });
}

// Función para exportar gastos a Excel
function exportarGastos() {
    const hoy = new Date().toISOString().split('T')[0];
    const gastosHoy = gastos.filter(g => g.fecha.split('T')[0] === hoy);
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(gastosHoy.map(g => ({
        Fecha: new Date(g.fecha).toLocaleString(),
        Descripción: g.descripcion,
        Categoría: g.categoria,
        Monto: g.monto
    })));
    
    XLSX.utils.book_append_sheet(wb, ws, "Gastos");
    XLSX.writeFile(wb, `gastos_${hoy}.xlsx`);
} 