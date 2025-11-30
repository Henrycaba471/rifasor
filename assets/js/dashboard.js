document.addEventListener('DOMContentLoaded', async () => {

    const userLogged = document.getElementById("user-logged");
    const userRol = document.getElementById("user-rol");

    if (localStorage.getItem('authToken')) {
        const backendRes = await fetch("http://localhost:3000/api/home", {
            method: "GET",
            headers: {
                // Enviamos el token en el formato que espera el middleware: Bearer <token>
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                "Content-Type": "application/json",
            },
        });

        const backendData = await backendRes.json();
        console.log(backendData);
        if (backendData.error) {
            window.location.replace('/index.html')
        }

        const userData = backendData.clientData;
        userLogged.textContent = userData.name;
        userRol.textContent = userData.rol

        return console.log('El token si esta');
    } else {
        window.location.replace('/index.html')
    }
});