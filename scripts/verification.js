// URL de la API en EC2 (Reemplázala con la IP correcta)
const API_BASE_URL = "http://127.0.0.1:8000/api";

async function verifyUser() {
    console.log("🔍 Iniciando verificación de usuario...");

    const studentCode = document.getElementById("studentcode").value.trim();
    const verificationCode = document.getElementById("verificationcode").value.trim();

    if (!studentCode || !verificationCode) {
        mostrarAlerta("Campos incompletos", "Por favor, ingresa tu código de estudiante y el código de verificación.", "warning");
        return;
    }

    // Crear FormData si el backend espera `Form(...)`
    const formData = new FormData();
    formData.append("student_code", studentCode);
    formData.append("code", verificationCode);

    try {
        console.log("🚀 Enviando solicitud de verificación con FormData a:", `${API_BASE_URL}/verify/`);
        const response = await fetch(`${API_BASE_URL}/verify/`, {
            method: "POST",
            body: formData
        });

        console.log("📌 Respuesta cruda del servidor:", response);

        const data = await response.json();
        console.log("✅ Respuesta del servidor (JSON):", data);

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }

        mostrarAlerta("Verificación exitosa", data.message, "success", () => {
            window.location.href = "login.html";
        });

    } catch (error) {
        console.error("❌ Error en la verificación:", error);
        mostrarAlerta("Error en el servidor", error.message || "Error desconocido", "error");
    }
}

// Función auxiliar para mostrar alertas con SweetAlert2
function mostrarAlerta(titulo, mensaje, icono, callback = null) {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
        confirmButtonText: "Entendido!",
    }).then((result) => {
        if (result.isConfirmed && callback) {
            callback();
        }
    });
}
