
const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;


// MENÚ

const header = document.querySelector('.header');
const boton  = document.querySelector('.menu-toggle');
const menu   = document.getElementById('nav-menu');

function cerrarMenu() {
    menu.classList.remove('open');
    boton.setAttribute('aria-expanded', false);
    boton.setAttribute('aria-label', 'Abrir menú');
}

boton.addEventListener('click', function () {
    menu.classList.toggle('open');
    const estaAbierto = menu.classList.contains('open');
    boton.setAttribute('aria-expanded', estaAbierto);
    boton.setAttribute('aria-label', estaAbierto ? 'Cerrar menú' : 'Abrir menú');
});

menu.querySelectorAll('a').forEach(function (enlace) {
    enlace.addEventListener('click', cerrarMenu);
});

document.addEventListener('click', function (evento) {
    const clickDentroDelHeader = header.contains(evento.target);
    if (!clickDentroDelHeader) {
        cerrarMenu();
    }
});

document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && menu.classList.contains('open')) {
        cerrarMenu();
        boton.focus();
    }
});


// HEADER Y BARRA DE PROGRESO

const igFlotante = document.querySelector('.ig-float');
const llamado    = document.querySelector('.llamado');
let scrollPendiente = false;

function actualizarScroll() {
    scrollPendiente = false;

    const recorrido = document.documentElement.scrollHeight - window.innerHeight;
    const progreso  = recorrido > 0 ? window.scrollY / recorrido : 0;

    header.classList.toggle('header--scroll', window.scrollY > 10);
    header.style.setProperty('--progreso', progreso.toFixed(4));

    // El botón flotante se esconde cuando ya se ve la sección de contacto
    const llamadoVisible = llamado.getBoundingClientRect().top < window.innerHeight - 80;
    igFlotante.classList.toggle('ig-float--oculto', llamadoVisible);
}

window.addEventListener('scroll', function () {
    if (!scrollPendiente) {
        scrollPendiente = true;
        requestAnimationFrame(actualizarScroll);
    }
}, { passive: true });

window.addEventListener('resize', actualizarScroll);

actualizarScroll();


// ENLACE ACTIVO DEL MENÚ

const enlacesMenu = Array.from(menu.querySelectorAll('.nav-menu__link'));
const destinos = enlacesMenu
    .map(function (enlace) { return document.querySelector(enlace.getAttribute('href')); })
    .filter(Boolean);

if ('IntersectionObserver' in window) {
    const observadorMenu = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (!entrada.isIntersecting) return;
            enlacesMenu.forEach(function (enlace) {
                enlace.classList.toggle('activo', enlace.getAttribute('href') === '#' + entrada.target.id);
            });
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    destinos.forEach(function (destino) {
        observadorMenu.observe(destino);
    });
}


// CARRUSEL

const carrusel = document.getElementById('carrusel');
const btnIzq   = document.querySelector('.carrusel-btn--izq');
const btnDer   = document.querySelector('.carrusel-btn--der');

function pasoCarrusel() {
    return carrusel.clientWidth * 0.8;
}

function actualizarBotones() {
    const alInicio = carrusel.scrollLeft <= 2;
    const alFinal  = Math.round(carrusel.scrollLeft + carrusel.clientWidth) >= carrusel.scrollWidth - 2;

    btnIzq.classList.toggle('hidden', alInicio);
    btnDer.classList.toggle('hidden', alFinal);
}

btnDer.addEventListener('click', function () {
    carrusel.scrollLeft += pasoCarrusel();
});

btnIzq.addEventListener('click', function () {
    carrusel.scrollLeft -= pasoCarrusel();
});

carrusel.addEventListener('scroll', actualizarBotones, { passive: true });
window.addEventListener('resize', actualizarBotones);

// Llamada inicial para configurar el estado correcto al cargar la página
actualizarBotones();


// VISOR DE PRODUCTOS

const visor         = document.getElementById('visor');
const visorImg      = visor.querySelector('.visor__img');
const visorTitulo   = visor.querySelector('.visor__titulo');
const visorContador = visor.querySelector('.visor__contador');
const tarjetas      = Array.from(document.querySelectorAll('.product-card'));
let productoActual  = 0;

function mostrarProducto(indice) {
    productoActual = (indice + tarjetas.length) % tarjetas.length;

    const tarjeta = tarjetas[productoActual];
    const imagen  = tarjeta.querySelector('.product-card__img');

    visorImg.src = imagen.currentSrc || imagen.src;
    visorImg.alt = imagen.alt;
    visorTitulo.textContent   = imagen.alt;
    visorContador.textContent = (productoActual + 1) + ' / ' + tarjetas.length;

    // Reinicia la animación de la foto
    visorImg.classList.remove('visor__img--cambia');
    void visorImg.offsetWidth;
    visorImg.classList.add('visor__img--cambia');
}

if (typeof visor.showModal === 'function') {
    tarjetas.forEach(function (tarjeta, indice) {
        tarjeta.addEventListener('click', function () {
            mostrarProducto(indice);
            visor.showModal();
        });
    });

    visor.querySelector('.visor__cerrar').addEventListener('click', function () {
        visor.close();
    });

    visor.querySelector('.visor__nav--izq').addEventListener('click', function () {
        mostrarProducto(productoActual - 1);
    });

    visor.querySelector('.visor__nav--der').addEventListener('click', function () {
        mostrarProducto(productoActual + 1);
    });

    // Click en el fondo oscuro
    visor.addEventListener('click', function (evento) {
        if (evento.target === visor) {
            visor.close();
        }
    });

    visor.addEventListener('keydown', function (evento) {
        if (evento.key === 'ArrowLeft')  mostrarProducto(productoActual - 1);
        if (evento.key === 'ArrowRight') mostrarProducto(productoActual + 1);
    });

    // Al cerrar, el foco vuelve a la tarjeta que se estaba viendo
    visor.addEventListener('close', function () {
        tarjetas[productoActual].focus({ preventScroll: true });
    });
}


// APARICIÓN AL HACER SCROLL

const porRevelar = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && !movimientoReducido) {
    // Los elementos hermanos aparecen escalonados
    porRevelar.forEach(function (elemento) {
        const hermanos = Array.from(elemento.parentElement.children).filter(function (hijo) {
            return hijo.hasAttribute('data-reveal');
        });
        const posicion = Math.min(hermanos.indexOf(elemento), 5);
        elemento.style.setProperty('--retraso', (posicion * 80) + 'ms');
    });

    const observadorReveal = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observadorReveal.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    porRevelar.forEach(function (elemento) {
        observadorReveal.observe(elemento);
    });
} else {
    porRevelar.forEach(function (elemento) {
        elemento.classList.add('visible');
    });
}


// EFECTOS CON EL MOUSE

if (punteroFino && !movimientoReducido) {

    // Las granas del hero acompañan al puntero
    const hero = document.querySelector('.hero');
    let heroPendiente = false;

    hero.addEventListener('pointermove', function (evento) {
        if (heroPendiente) return;
        heroPendiente = true;

        requestAnimationFrame(function () {
            const caja = hero.getBoundingClientRect();
            hero.style.setProperty('--mx', ((evento.clientX - caja.left) / caja.width - 0.5).toFixed(3));
            hero.style.setProperty('--my', ((evento.clientY - caja.top) / caja.height - 0.5).toFixed(3));
            heroPendiente = false;
        });
    });

    // Las tarjetas de encargos se inclinan hacia el puntero
    document.querySelectorAll('[data-tilt]').forEach(function (tarjeta) {
        tarjeta.addEventListener('pointermove', function (evento) {
            const caja = tarjeta.getBoundingClientRect();
            const x = (evento.clientX - caja.left) / caja.width - 0.5;
            const y = (evento.clientY - caja.top) / caja.height - 0.5;

            tarjeta.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
            tarjeta.style.setProperty('--rx', (y * -8).toFixed(2) + 'deg');
        });

        tarjeta.addEventListener('pointerleave', function () {
            tarjeta.style.setProperty('--ry', '0deg');
            tarjeta.style.setProperty('--rx', '0deg');
        });
    });
}


// DÍA ACTUAL Y AÑO

const hoy = document.querySelector('.semana__dia[data-dia="' + new Date().getDay() + '"]');
if (hoy) {
    hoy.classList.add('semana__dia--hoy');
}

document.getElementById('anio').textContent = new Date().getFullYear();
