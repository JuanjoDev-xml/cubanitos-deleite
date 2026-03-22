
const boton = document.querySelector('.menu-toggle');
const menu  = document.getElementById('nav-menu');

boton.addEventListener('click', function () {
    menu.classList.toggle('open');
    const estaAbierto = menu.classList.contains('open');
    boton.setAttribute('aria-expanded', estaAbierto);
});

menu.querySelectorAll('.nav-menu__link').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
        menu.classList.remove('open');
        boton.setAttribute('aria-expanded', false);
    });
});

document.addEventListener('click', function (evento) {
    const clickDentroDelHeader = document.querySelector('.header').contains(evento.target);
    if (!clickDentroDelHeader) {
        menu.classList.remove('open');
        boton.setAttribute('aria-expanded', false);
    }
});




const carrusel = document.getElementById('carrusel');
const btnIzq   = document.querySelector('.carrusel-btn--izq');
const btnDer   = document.querySelector('.carrusel-btn--der');

const PASO = window.innerWidth > 768 ? 500 : 230;

function actualizarBotones() {
    const alInicio = carrusel.scrollLeft === 0;
    const alFinal  = Math.round(carrusel.scrollLeft + carrusel.clientWidth) >= carrusel.scrollWidth;

    btnIzq.classList.toggle('hidden', alInicio);
    btnDer.classList.toggle('hidden', alFinal);
}

btnDer.addEventListener('click', function () {
    carrusel.scrollLeft += PASO;
});

btnIzq.addEventListener('click', function () {
    carrusel.scrollLeft -= PASO;
});

carrusel.addEventListener('scroll', actualizarBotones);

// Llamada inicial para configurar el estado correcto al cargar la página
actualizarBotones();