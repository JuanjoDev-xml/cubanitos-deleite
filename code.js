
const boton = document.querySelector('.menu-toggle');
const menu  = document.getElementById('nav-menu');

boton.addEventListener('click', function () {
    menu.classList.toggle('open');
    const estaAbierto = menu.classList.contains('open');
    boton.setAttribute('aria-expanded', estaAbierto);
});

    // Paso 3 (bonus): Cerramos el menú cuando el usuario toca un enlace
    // querySelectorAll devuelve TODOS los enlaces del menú
menu.querySelectorAll('.nav-menu__link').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
        menu.classList.remove('open');
        boton.setAttribute('aria-expanded', false);
    });
});

    // Paso 4 (bonus): Cerramos el menú si el usuario toca fuera de él
document.addEventListener('click', function (evento) {
        /*
            contains() pregunta: "¿el click ocurrió DENTRO del header?"
            Si la respuesta es NO (el ! lo niega), cerramos el menú.
        */
    const clickDentroDelHeader = document.querySelector('.header').contains(evento.target);
    if (!clickDentroDelHeader) {
        menu.classList.remove('open');
        boton.setAttribute('aria-expanded', false);
    }
});


    // Carousel

const carrusel = document.getElementById('carrusel');
const btnIzq   = document.querySelector('.carrusel-btn--izq');
const btnDer   = document.querySelector('.carrusel-btn--der');

    // Cuántos píxeles se desplaza cada vez que se presiona un botón.
    // 220 ≈ ancho de una card (150px imagen + 2x margen 20px) + un poco extra
const PASO = window.innerWidth > 768 ? 500 : 230;

    // ── Función que actualiza qué botones se ven ──
function actualizarBotones() {
        /*
            scrollLeft: cuántos px se ha scrolleado hacia la derecha (0 = inicio).
            scrollWidth: ancho total del contenido del carrusel (todas las cards).
            clientWidth: ancho visible del carrusel en pantalla.

            Si scrollLeft es 0, estamos al inicio → ocultamos el botón izquierdo.
            Si scrollLeft + clientWidth >= scrollWidth, llegamos al final → ocultamos el derecho.

            Math.round() evita errores de decimales que a veces dan 799.8 en vez de 800.
        */
    const alInicio = carrusel.scrollLeft === 0;
    const alFinal  = Math.round(carrusel.scrollLeft + carrusel.clientWidth) >= carrusel.scrollWidth;

    btnIzq.classList.toggle('hidden', alInicio);
    btnDer.classList.toggle('hidden', alFinal);
}

    // ── Click en botón derecha: scrollea PASO píxeles hacia la derecha ──
btnDer.addEventListener('click', function () {
    carrusel.scrollLeft += PASO;
});

    // ── Click en botón izquierda: scrollea PASO píxeles hacia la izquierda ──
btnIzq.addEventListener('click', function () {
    carrusel.scrollLeft -= PASO;
});

    /*
        Escuchamos el evento "scroll" del carrusel.
        Cada vez que el usuario scrollea (con touch, rueda del mouse, o botones),
        llamamos a actualizarBotones() para mostrar/ocultar según corresponda.
    */
carrusel.addEventListener('scroll', actualizarBotones);

    // Llamada inicial para configurar el estado correcto al cargar la página
actualizarBotones();