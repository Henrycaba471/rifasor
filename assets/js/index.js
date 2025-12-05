document.addEventListener('DOMContentLoaded', function () {
    const menuBurguer = document.querySelector('.menu-burguer');
    const navLinks = document.querySelector('.navbar .nav-links');
    const toggleMenuIcon = document.getElementById('toggle-menu');
    const description = document.querySelector('.description');
    const typeRifa = document.querySelector('.tipos-rifas');
    const btnVerRifas = document.querySelector('.btn-sorteos');
    const showRifas = document.querySelector('.ventas-rifas-disponibles');
    const modalDetalles = document.querySelector('.modal-content');
    const modalRifaHtml = document.querySelector('.inner-detail-rifa');
    const btnCerrar = document.querySelector('.close-btn');

    btnVerRifas.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/rifasor/rifas-disponibles", {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });

            const data = await response.json();
            //console.log(data);

            if (!response.ok) {
                const errorMessage = data.error || "No se ha encontrado rifas. Inténtalo de nuevo.";
                return alert(`Error: ${errorMessage}`);
            }

            description.style.display = 'none';
            typeRifa.style.display = 'none';
            console.log('Respuesta exitosa del servidor:', data);

            showRifas.innerHTML = "";
            showRifas.innerHTML += `<section class="title-section-disponibles">
                    <h3>Rifas disponibles</h3>
                </section>`;

            data.forEach((rifa) => {
                //console.log(rifa);
                showRifas.innerHTML += `<section class="rifa-disponibles-venta" data-id-rifa="${rifa.id}" id="data-rifa">
                <article class="card-rifa">
                    <div class="card-header">
                        <h3>${rifa.title}</h3>
                        <span>${rifa.fachaSorteo}</span>
                        <span class="proveedor-rifa">Vendedor: ${rifa.proveedor}</span>
                    </div>
                    <div class="imagen-rifa">
                        <img src="assets/images/rifa.png" alt="foto-rifa" />
                    </div>
                    <div class="valor-rifa">
                        <p>COP$ ${rifa.valor}</p>
                    </div>
                    <div class="btn-action-rifa">
                        <button>Comprar</button>
                        <button class="ver-detalles-rifa" data-id-rifa="${rifa.id}">Ver Detalles</button>
                    </div>
                </article>
                </section>`
            });
        } catch (error) {
            // Puedes verificar el tipo de error para dar un mensaje específico:
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                alert("❌ Error de conexión: El servidor no está respondiendo.");
            } else {
                // Manejar otros errores (ej. token expirado, etc.)
                alert("Hubo un error inesperado. Inténtalo de nuevo.");
            }

            console.error("Detalles del error capturado:", error.message);
        }
    });

    //Detalles de boleta
    document.addEventListener('click', async (e) => {
        if (e.target.matches('.ver-detalles-rifa')) {
            const idRifa = e.target.getAttribute('data-id-rifa');
            try {

                const response = await fetch(`http://localhost:3000/api/rifasor/ver-rifa/${idRifa}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                });

                const data = await response.json();
                //console.log(data);

                if (!response.ok) {
                    const errorMessage = data.error || "No se ha encontrado rifa. Inténtalo de nuevo.";
                    return alert(`Error: ${errorMessage}`);
                }

                console.log(data)
                modalRifaHtml.innerHTML = ''
                modalRifaHtml.innerHTML += `<section class="rifa-disponible-venta">
                                                <article class="card-rifa-modal">
                                                    <di class="modal-header-rifa">
                                                        <div class="card-header-modal">
                                                            <h3>${data.title}</h3>
                                                            <span>${data.fachaSorteo}</span>
                                                            <span class="proveedor-rifa-modal">${data.proveedor}</span>
                                                        </div>
                                                        <div class="imagen-rifa-modal">
                                                            <img src="assets/images/rifa.png" width="300" />
                                                        </div>
                                                    </di>
                                                    <div class="terminos-rifa-modal">
                                                        <span>Términos y condiciones: ${data.terminos}</span>
                                                    </div>
                                                    <div class="btn-action-modal">
                                                        <div class="valor-rifa-modal">
                                                            <p>COP$ ${data.valor}</p>
                                                        </div>
                                                        <div class="btn-action-rifa-modal">
                                                            <button>Compar</button>
                                                        </div>
                                                    </div>
                                                </article>
                                            </section>`
                modalDetalles.style.display = 'block'
            } catch (error) {

            }
        }

        btnCerrar.addEventListener('click', () => {
            // Usamos 'none' para ocultarlo
            modalDetalles.style.display = 'none';
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