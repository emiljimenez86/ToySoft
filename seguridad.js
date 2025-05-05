// Configuración de credenciales
const credenciales = {
    usuario: 'admin',
    clave: '1234'
};

// Verificar si hay una sesión activa
function verificarSesion() {
    const sesionActiva = localStorage.getItem('sesionActiva') === 'true';
    console.log('Verificando sesión:', sesionActiva);
    return sesionActiva;
}

// Redirigir al login si no hay sesión
function verificarAcceso() {
    if (!verificarSesion()) {
        console.log('Redirigiendo al login...');
        window.location.href = 'index.html';
    }
}

// Iniciar sesión
function iniciarSesion() {
    const usuario = document.getElementById('usuario').value;
    const clave = document.getElementById('clave').value;

    console.log('Intento de login:', usuario, clave);

    if (usuario === credenciales.usuario && clave === credenciales.clave) {
        console.log('Login exitoso');
        localStorage.setItem('sesionActiva', 'true');
        mostrarApp();
    } else {
        console.log('Login fallido');
        alert('Credenciales incorrectas');
    }
}

// Mostrar la aplicación
function mostrarApp() {
    const loginSection = document.getElementById('loginSection');
    const appSection = document.getElementById('appSection');
    
    console.log('Mostrando aplicación...');
    
    if (loginSection && appSection) {
        // Ocultar login con fade out
        loginSection.style.opacity = '0';
        loginSection.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            loginSection.style.display = 'none';
            appSection.style.display = 'block';
            // Mostrar app con fade in
            setTimeout(() => {
                appSection.style.opacity = '1';
            }, 50);
        }, 300);
    } else {
        console.error('No se encontraron las secciones necesarias');
    }
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    window.location.href = 'index.html';
}

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const loginSection = document.getElementById('loginSection');
    const appSection = document.getElementById('appSection');
    
    if (localStorage.getItem('sesionActiva') === 'true') {
        loginSection.style.display = 'none';
        appSection.style.display = 'block';
        appSection.style.opacity = '1';
    } else {
        loginSection.style.opacity = '1';
    }
}); 