
// Importar solo los módulos que necesitamos
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 2. Configuración de Firebase (REEMPLAZA ESTOS VALORES)
// ESTA CONFIGURACIÓN ES PÚBLICA y SEGURA
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

// ... (El resto del script de lógica va aquí abajo) ...
// ... (continuación del código JavaScript) ...

const loginForm = document.querySelector(".form-login-rifario");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar el envío tradicional del formulario

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // --- PASO A: Login directo con Firebase (Google) ---
        console.log(email, password);

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // --- PASO B: Obtener el ID Token (la prueba de identidad) ---
        const idToken = await userCredential.user.getIdToken();

        // --- PASO C: Llamar a TU Backend con el Token ---
        // Tu servidor escuchando en el puerto 3000
        const backendRes = await fetch("http://localhost:3000/api/home", {
            method: "GET",
            headers: {
                // Enviamos el token en el formato que espera el middleware: Bearer <token>
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
            },
        });

        const backendData = await backendRes.json();

        console.log(backendData);
        
        if (backendRes.ok) {
            localStorage.setItem('authToken', idToken);
            // La ruta protegida funcionó
            window.location.replace("http://127.0.0.1:5500/dashboard.html");
        } else {
            // El servidor (o el middleware) rechazó el token
            backendResponseDisplay.textContent =
                "❌ ERROR DE AUTORIZACIÓN: Tu backend rechazó el token. Verifica el middleware.\n\n" +
                JSON.stringify(backendData, null, 2);
        }
    } catch (error) {
        console.log("Se presento un error");
    }
});
