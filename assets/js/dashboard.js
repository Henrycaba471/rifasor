document.addEventListener('DOMContentLoaded', async () => {

    const userLogged = document.getElementById("user-logged");
    const userRol = document.getElementById("user-rol");

    if (localStorage.getItem('authToken')) {
        const backendRes = await fetch("http://localhost:3000/api/rifasor/home", {
            method: "GET",
            headers: {
                // Enviamos el token en el formato que espera el middleware: Bearer <token>
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                "Content-Type": "application/json",
            },
        });

        const backendData = await backendRes.json();
        if (backendData.error) {
            window.location.replace('/index.html')
        }

        const userData = backendData.clientData;
        userLogged.textContent = userData.name;
        userRol.textContent = `(${userData.rol})`
    } else {
        window.location.replace('/index.html')
    }

    const btnOptions = document.getElementById("user-profile");
    const optionsUser = document.querySelector(".options-user");
    btnOptions.addEventListener('click', (e) => {
        optionsUser.classList.toggle('menu-active');
    });

    document.addEventListener('click', (e) => {
        //console.log(e.target)
        if(e.target.closest('.cerrar-sesion')){
            localStorage.removeItem('authToken');
            location.reload();
        }
    });

});