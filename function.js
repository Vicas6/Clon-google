let input = document.querySelectorAll('.main-input-container, #searchInput');
let overlay = document.getElementById('overlay');
let main = document.querySelector('main');
let counter = 0;
let maxMessages = 9;
let preventExit = false; // Bandera para bloquear la recarga y navegación
let logoImage = document.getElementById('logoImage');
let originalLogoImageSrc = '/Asset/logo-google.png';
let timer;
const smallScreenQuery = window.matchMedia('(max-width: 425px)');

let predefinedMessages = [
    'Nos encontramos a alguien que no le gusta seguir indicaciones ¿no? no cierres el mensaje.',
    'Eres un rebelde.',
    'Te lo adverti en el principio.',
    'Solo tenías que seguir una simple instrucción.',
    'Ya no hay vuelta atrás.',
    'Aunque podrías intentar recargar, así saldrías de esto',
    'Jajaja bueno ya, me divertí mucho, este si es el ultimo',
    '¿O no? JAJAJJAJAJA',
    'Ya, ya, este si es el último, ADIÓS'
];

window.addEventListener('load', function() {
    // Verifica si la página es /index.html y si la alerta ya se mostró
    if (window.location.pathname === '/index.html' && !sessionStorage.getItem('alertShown')) {
        // Muestra la alerta
        alert('NO TE RECOMIENDO QUE USES EL BUSCADOR.');

        // Guarda en sessionStorage que la alerta ya se mostró
        sessionStorage.setItem('alertShown', 'true');
    }
});

// Función para verificar si el campo searchInput tiene texto
function inputHasText() {
    return searchInput.value.trim() !== '';
}

// Agregar evento keypress para el input searchInput
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        blockScreenAndShowMessage();
    }
});

function getRandomPosition() {
    let x = Math.random() * (window.innerWidth - 220); // Restando el ancho del cuadro de mensaje
    let y = Math.random() * (window.innerHeight - 120); // Restando el alto del cuadro de mensaje
    return { x: Math.max(0, x), y: Math.max(0, y) };
}

function centerPosition() {
    let x = (window.innerWidth - 120) / 2;
    let y = (window.innerHeight - 120) / 2;
    return { x: x, y: y };
}

// Función para cambiar la imagen del logo
function changeLogoImage() {
    logoImage.src = '/Asset/logo-google-glitch.webp'; 
    logoImage.classList.add('glitch');
}

// Función para restaurar la imagen original del logo
function restoreLogoImage() {
    logoImage.src = originalLogoImageSrc;// Restaura la URL original de la imagen
    logoImage.classList.remove('glitch');
}

function blockScreenAndShowMessage() {
    overlay.style.display = 'block';
    main.classList.add('grayscale');
    document.body.style.overflow = 'hidden'; // Deshabilitar el desplazamiento
    document.body.style.backgroundColor = 'grey';

    preventExit = true; // Bloquear la recarga y navegación

    // Crear nuevo cuadro de mensaje
    let newMessageBox = document.createElement('div');
    newMessageBox.classList.add('messageBox');
    
    let position;
    if (counter === 0) {
        position = centerPosition(); // El primer mensaje se centra
    } else {
        position = getRandomPosition(); // Los siguientes mensajes son aleatorios
    }

    newMessageBox.style.left = position.x + 'px';
    newMessageBox.style.top = position.y + 'px';

    // Generar contenido dinámico para el mensaje
    newMessageBox.innerHTML = '<p>' + predefinedMessages[counter % predefinedMessages.length] + '</p><button class="closeButton">Cerrar</button>';
    document.body.appendChild(newMessageBox);

    // Guardar estado en localStorage
    saveMessageState(counter, predefinedMessages[counter % predefinedMessages.length], position.x, position.y);

    counter++;

    // Escuchar evento click en el botón de cerrar para añadir otro cuadro de mensaje
    newMessageBox.querySelector('.closeButton').addEventListener('click', function() {
        if (counter >= maxMessages) {
            closeAllMessages();
        } else {
            blockScreenAndShowMessage();
        }
    });

    // Cambiar la imagen del logo después de mostrar el mensaje
    changeLogoImage();

    function preventUnload(event) {
        event.preventDefault();
        event.returnValue = '';  // Esto es necesario para algunos navegadores
        return '';  // Esto es necesario para otros navegadores
    }

    // Prevenir la recarga de la página mientras los cuadros de mensajes estén abiertos
    window.addEventListener('beforeunload', preventUnload);
    // Prevenir la recarga por teclas
    document.addEventListener('keydown', preventReloadKeys);
    // Prevenir clic derecho
    document.addEventListener('contextmenu', preventContextMenu);

    clearTimeout(timer);
    timer = setTimeout(closeAllMessages, 10000);

}

function saveMessageState(index, message, x, y) {
    let messagesState = JSON.parse(localStorage.getItem('messagesState')) || [];
    messagesState.push({ index: index, message: message, x: x, y: y });
    localStorage.setItem('messagesState', JSON.stringify(messagesState));
}

function restoreMessages() {

    let messagesState = JSON.parse(localStorage.getItem('messagesState'));
    if (messagesState) {
        overlay.style.display = 'block';
        main.classList.add('grayscale');
        document.body.style.backgroundColor = 'grey';
        document.body.style.overflow = 'hidden'; // Deshabilitar el desplazamiento
        preventExit = true; // Bloquear la recarga y navegación
        changeLogoImage()
        alert('ESO NO SERVIRÁ PARA HUIR JAJAJJA.')
        

        messagesState.forEach(function(messageState) {
            let newMessageBox = document.createElement('div');
            newMessageBox.classList.add('messageBox');
            newMessageBox.style.left = messageState.x + 'px';
            newMessageBox.style.top = messageState.y + 'px';
            newMessageBox.innerHTML = '<p>' + messageState.message + '</p><button class="closeButton">Cerrar</button>';
            document.body.appendChild(newMessageBox);

            newMessageBox.querySelector('.closeButton').addEventListener('click', function() {
                if (counter >= maxMessages) {
                    closeAllMessages();
                } else {
                    blockScreenAndShowMessage();
                }
            });
        });

        counter = messagesState.length;

        
        // Prevenir la recarga por teclas
        document.addEventListener('keydown', preventReloadKeys);
        // Prevenir clic derecho
        document.addEventListener('contextmenu', preventContextMenu);
    }

}

function preventReloadKeys(event) {
    if ((event.key === 'F5') || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        alert('JAJAJAJA NO, NO PUEDES HUIR TAN FÁCIL.');
    }
}

function preventContextMenu(event) {
    if (preventExit) {
        event.preventDefault();
        alert('Con que quieres curiosear, pues eso esta prohibido, al menos en este estado JAJAJAJA.');
    }
}

function closeAllMessages() {
    let messages = document.querySelectorAll('.messageBox');
    messages.forEach(function(message) {
        message.remove();
    });
    overlay.style.display = 'none';
    main.classList.remove('grayscale');
    document.body.style.overflow = 'auto'; // Restaurar el desplazamiento
    document.body.style.backgroundColor = 'white';
    counter = 0; // Reiniciar el contador
    preventExit = false; // Permitir la recarga y navegación

    // Limpiar localStorage
    localStorage.removeItem('messagesState');

    // Restaurar la imagen original del logo
    restoreLogoImage();

    // Permitir la recarga de la página
    document.removeEventListener('keydown', preventReloadKeys);
    document.removeEventListener('contextmenu', preventContextMenu);
    // Temporizador para cerrar automáticamente el cuadro de mensaje después de 10 segundos (10000 milisegundos)
    clearTimeout(timer);
}


// Restaurar mensajes al cargar la página
restoreMessages();

// Media query para detectar pantallas móviles
const mobileQuery = window.matchMedia('(max-width: 425px)');

function handleMobileChange(e) {
    if (e.matches) {
        // Aquí puedes agregar el código que deseas ejecutar específicamente en pantallas móviles
        // Por ejemplo, ajustar el tamaño de los cuadros de mensaje o cambiar el comportamiento de la página
        // Ajustar el tamaño de los cuadros de mensaje
        let messageBoxes = document.querySelectorAll('.messageBox');
        messageBoxes.forEach(function(messageBox) {
            messageBox.style.width = '100%';
            messageBox.style.height = 'auto';
            messageBox.style.left = '0';
            messageBox.style.top = '0';
        });
        // Otros ajustes específicos para móviles
        console.log('Pantalla móvil detectada');
    } else {
        // Revertir cambios si es necesario cuando la pantalla ya no es móvil
        let messageBoxes = document.querySelectorAll('.messageBox');
        messageBoxes.forEach(function(messageBox) {
            messageBox.style.width = ''; // Revertir al estilo original
            messageBox.style.height = ''; // Revertir al estilo original
            messageBox.style.left = ''; // Revertir al estilo original
            messageBox.style.top = ''; // Revertir al estilo original
        });
        console.log('Pantalla móvil ya no está activa');
    }
}

// Agregar un listener para cambios en el media query usando addEventListener
mobileQuery.addEventListener('change', handleMobileChange);

// Ejecutar la función para aplicar cambios de inmediato si la pantalla ya es móvil
handleMobileChange(mobileQuery);
