let deferredPrompt;
const installButton = document.getElementById('installButton');

// Función para mostrar el botón
function showInstallButton() {
    if (installButton) {
        installButton.style.display = 'block';
        console.log('Botón de instalación mostrado');
    } else {
        console.log('Botón de instalación no encontrado en el DOM');
    }
}

// Función para ocultar el botón
function hideInstallButton() {
    if (installButton) {
        installButton.style.display = 'none';
        console.log('Botón de instalación ocultado');
    }
}

// Verificar si la app ya está instalada
if (window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone === true) {
    console.log('La app ya está instalada');
    hideInstallButton();
} else {
    console.log('La app no está instalada');
    showInstallButton();
}

// Escuchar el evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Evento beforeinstallprompt capturado');
    // Prevenir que Chrome muestre el mini-infobar
    e.preventDefault();
    // Guardar el evento para usarlo después
    deferredPrompt = e;
    // Mostrar el botón de instalación
    showInstallButton();
});

// Escuchar el evento appinstalled
window.addEventListener('appinstalled', (evt) => {
    console.log('App instalada exitosamente');
    hideInstallButton();
    deferredPrompt = null;
});

// Función para instalar la PWA
function installPWA() {
    console.log('Intentando instalar PWA...');
    
    // Verificar si estamos en iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Mostrar instrucciones para iOS
        alert('Para instalar en iOS:\n\n' +
              '1. Toca el botón compartir\n' +
              '2. Desplázate hacia abajo\n' +
              '3. Toca "Añadir a pantalla de inicio"');
        return;
    }

    // Verificar si estamos en Android
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isAndroid) {
        // Mostrar instrucciones para Android
        alert('Para instalar en Android:\n\n' +
              '1. Toca el menú (tres puntos)\n' +
              '2. Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"');
        return;
    }

    // Para navegadores de escritorio
    if (deferredPrompt) {
        // Mostrar el prompt de instalación
        deferredPrompt.prompt();
        // Esperar la respuesta del usuario
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó la instalación');
                alert('¡Gracias por instalar ToySoft POS!');
            } else {
                console.log('Usuario rechazó la instalación');
                // Mostrar instrucciones alternativas
                showInstallInstructions();
            }
            // Limpiar el prompt guardado
            deferredPrompt = null;
        });
    } else {
        console.log('No hay prompt de instalación disponible');
        showInstallInstructions();
    }
}

// Función para mostrar instrucciones de instalación
function showInstallInstructions() {
    const browser = getBrowser();
    let instructions = '';
    
    switch(browser) {
        case 'chrome':
            instructions = 'Para instalar en Chrome:\n\n' +
                          '1. Haz clic en el icono de instalación en la barra de direcciones\n' +
                          '2. O ve al menú (tres puntos) > Más herramientas > Instalar ToySoft POS';
            break;
        case 'brave':
            instructions = 'Para instalar en Brave:\n\n' +
                          '1. Haz clic en el menú (tres líneas)\n' +
                          '2. Ve a "Más herramientas"\n' +
                          '3. Selecciona "Instalar ToySoft POS"';
            break;
        case 'edge':
            instructions = 'Para instalar en Edge:\n\n' +
                          '1. Haz clic en el menú (tres puntos)\n' +
                          '2. Selecciona "Aplicaciones"\n' +
                          '3. Haz clic en "Instalar ToySoft POS"';
            break;
        default:
            instructions = 'Para instalar la aplicación:\n\n' +
                          '1. Abre esta página en Chrome, Brave o Edge\n' +
                          '2. Busca la opción de instalación en el menú del navegador';
    }
    
    alert(instructions);
}

// Función para detectar el navegador
function getBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        return 'chrome';
    } else if (userAgent.includes('brave')) {
        return 'brave';
    } else if (userAgent.includes('edg')) {
        return 'edge';
    }
    return 'other';
} 