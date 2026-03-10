// Paso 1: Agarramos el botón y el menú del HTML
    // querySelector busca el PRIMER elemento que tenga esa clase
    const boton = document.querySelector('.menu-toggle');
    const menu  = document.getElementById('nav-menu');

    // Paso 2: Escuchamos el click en el botón hamburguesa
    boton.addEventListener('click', function () {

        /*
            classList.toggle('open'):
            - Si el menú NO tiene la clase "open"  →  la AGREGA  (abre el menú)
            - Si el menú SÍ tiene la clase "open"  →  la QUITA   (cierra el menú)
            Es exactamente como un interruptor de luz.
        */
        menu.classList.toggle('open');

        // Actualizamos aria-expanded (true si está abierto, false si está cerrado)
        // Esto es para accesibilidad: lectores de pantalla lo usan
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