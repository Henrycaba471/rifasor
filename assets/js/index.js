document.addEventListener('DOMContentLoaded', function () {
    const menuBurguer = document.querySelector('.menu-burguer');
    const navLinks = document.querySelector('.navbar .nav-links');
    const toggleMenuIcon = document.getElementById('toggle-menu');
    const description = document.querySelector('.description');
    const typeRifa = document.querySelector('.tipos-rifas');
    const btnVerRifas = document.querySelector('.btn-sorteos');
    const showRifas = document.querySelector('.ventas-rifas-disponibles');

    btnVerRifas.addEventListener('click', async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/api/rifasor/rifas-disponobles", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            // Manejo de errores como "email-already-in-use"
            const errorMessage = data.error || "No se ha podido realizar el registro. Inténtalo de nuevo.";
            return alert(`Error: ${errorMessage}`);
        }

        description.style.display = 'none';
        typeRifa.style.display = 'none';
        console.log('Respuesta exitosa del servidor:', data);

        data.forEach((rifa) => {
            console.log(rifa);
            showRifas.innerHTML += `<section class="rifa-disponibles-venta">
    <article class="card-rifa">
        <div class="card-header">
            <h3>${rifa.title}</h3>
            <span>${rifa.fachaSorteo}</span>
            <span class="proveedor-rifa">${rifa.proveedor}</span>
        </div>
        <div class="imagen-rifa">
            <img src="assets/images/rifa.jpg" alt="foto-rifa" />
        </div>
        <div class="terminos-rifa">
            <span>${rifa.terminos}</span>
        </div>
        <div class="valor-rifa">
            <p>COP$ ${rifa.valor}</p>
        </div>
        <div class="btn-action-rifa">
            <button>Ver números disponibles</button>
        </div>
    </article>
</section>`
        });
    });
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