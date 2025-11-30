import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 🚨 REEMPLAZA ESTA CONFIGURACIÓN CON LA DE TU PROYECTO 🚨
const firebaseConfig = {
    apiKey: "AIzaSyCUabTq7BNH5n3mn8YYnWJWquf9deqthzw",
    authDomain: "api-rest-rifasor.firebaseapp.com",
    projectId: "api-rest-rifasor",
    storageBucket: "api-rest-rifasor.firebasestorage.app",
    messagingSenderId: "881387875030",
    appId: "1:881387875030:web:e6d9637ca1282a6263f777",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    console.log('Register loaded');
    const registerBtn = document.querySelector(".btn-register");
    registerBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const clientRegister = {
            name: document.getElementById("name-user").value,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }

        const confirPass = document.getElementById("conf-password").value;

        if (!clientRegister.name || clientRegister.name === "" || clientRegister.name === null || clientRegister.name === undefined) {
            return alert("Los campos con * son obligatorios");
        }

        if (!clientRegister.firstname || clientRegister.firstname === "" || clientRegister.firstname === null || clientRegister.firstname === undefined) {
            return alert("Los campos con * son obligatorios");
        }

        if (!clientRegister.lastname || clientRegister.lastname === "" || clientRegister.lastname === null || clientRegister.lastname === undefined) {
            return alert("Los campos con * son obligatorios");
        }

        if (clientRegister.name.length < 3 || clientRegister.firstname.length < 3 || clientRegister.lastname.length < 3) {
            return alert("Los nombres y apellidos deben contener mínimo 3 letras cada uno")
        }

        if (clientRegister.phone.length !== 10) {
            return alert("Debes ingresar un numero de teléfono valido");
        }

        if (!clientRegister.email || clientRegister.email === "" || clientRegister.email === null || clientRegister.email === undefined) {
            return alert("No has ingresado tu correo");
        }

        if (!clientRegister.password || clientRegister.password === "" || clientRegister.password === null || clientRegister.password === undefined) {
            return alert("No has asignado una clave");
        }
        if (!confirPass || confirPass === "" || confirPass === null || confirPass === undefined) {
            return alert("Por favor confirma la clave");
        }

        if (clientRegister.password.length < 8) {
            return alert("La clave debe contener mínimo 8 caracteres");
        }

        if (clientRegister.password !== confirPass) {
            return alert("Las contraseñas no coinciden");
        }

        const response = await fetch("http://localhost:3000/api/signup", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(clientRegister)
        });

        const data = await response.json();
        if (!response.ok) {
            // Manejo de errores como "email-already-in-use"
            const errorMessage = data.error || "No se ha podido realizar el registro. Inténtalo de nuevo.";
            return alert(`Error: ${errorMessage}`);
        }

        console.log('Respuesta exitosa del servidor:', data);

        if (data.token) {
            try {
                // 1. Usar el token del servidor para iniciar sesión en Firebase Client
                const userCredential = await signInWithCustomToken(auth, data.token);
                const user = userCredential.user;

                // 2. Obtener el ID Token REAL que el Backend espera para las rutas protegidas
                const idToken = await user.getIdToken();
                localStorage.setItem('authToken', idToken);
                console.log("Sesión iniciada con éxito. UID:", user.uid);

                // 3. Opcional: Llamada al endpoint protegido (/api/home) para confirmar sesión
                const homeResponse = await fetch('http://localhost:3000/api/home', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (homeResponse.ok) {
                    console.log("Verificación de ruta protegida OK.");
                    // 4. Redirigir a la página principal (Home)
                    window.location.replace("http://127.0.0.1:5500/dashboard.html");
                } else {
                    alert("Registro exitoso, pero la verificación de sesión falló. Contacte a soporte.");
                }

            } catch (error) {
                console.error("Error al canjear el Custom Token o al llamar a /api/home:", error);
                alert("Registro exitoso, pero ocurrió un error durante el inicio de sesión automático.");
            }
        } else {
            // Si el backend no devolvió el customToken (aunque debería)
            alert("Registro exitoso, pero no se pudo iniciar sesión automáticamente. Inicie sesión manualmente.");
        }

    });
});