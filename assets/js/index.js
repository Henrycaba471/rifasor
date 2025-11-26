document.addEventListener('DOMContentLoaded', function () {
    const menuBurguer = document.querySelector('.menu-burguer');
    const navLinks = document.querySelector('.navbar .nav-links');
    const toggleMenuIcon = document.getElementById('toggle-menu');

    // Función para cerrar el menú y restablecer el ícono
    function closeMenu() {
        navLinks.style.display = 'none';
        toggleMenuIcon.textContent = 'menu';
    }

    // Función para abrir/cerrar el menú (se mantiene la lógica original)
    function toggleMenu() {
        if (navLinks.style.display === 'flex') {
            closeMenu();
        } else {
            navLinks.style.display = 'flex';
            toggleMenuIcon.textContent = 'close';
        }
    }

    // 1. Manejador para el botón de hamburguesa
    menuBurguer.addEventListener('click', toggleMenu);

    // 2. Cierre al hacer clic en un enlace del menú
    // Selecciona todos los enlaces dentro del contenedor navLinks
    const menuLinks = navLinks.querySelectorAll('a');

    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 3. Cierre al hacer clic fuera del menú o del botón de hamburguesa
    document.addEventListener('click', function (event) {
        // Verifica si el menú está abierto
        if (navLinks.style.display === 'flex') {
            if (!menuBurguer.contains(event.target) && !navLinks.contains(event.target)) {
                closeMenu();
            }
        }
    });
});