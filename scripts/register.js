// Clase para manejar datos de usuario
class Usuario {
  constructor(correo, password, nombre, codigo) {
    this.email = correo;
    this.password = password;
    this.full_name = nombre;
    this.student_code = codigo;
  }
}

// URL de la API en EC2
const API_BASE_URL = "http://127.0.0.1:8000/api";  // Reemplaza con la IP pública de tu EC2

// Función para registrar un usuario
async function registerUser() {
  // Captura los datos del formulario
  const correo = document.getElementById("student-email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("password-confirm").value.trim();
  const nombre = document.getElementById("student-name").value.trim();
  const codigo = document.getElementById("student-code").value.trim();
  const credencial = document.getElementById("student-credential").files[0]; // Captura el archivo de la credencial

  // Expresión regular para validar el correo
  const Regex = /^[a-zA-Z]+\.[a-zA-Z]+[0-9]+@(alumnos|academicos)\.udg\.mx$/;

  // Validaciones en el cliente
  if (!Regex.test(correo)) {
    mostrarAlerta("Correo inválido", "El correo debe coincidir con el formato: example.example@alumnos/academicos.udg.mx", "error");
    return;
  }

  if (password.length < 8 || password !== confirmPassword) {
    mostrarAlerta("Contraseña inválida", "La contraseña debe tener al menos 8 caracteres y coincidir con la confirmación.", "error");
    return;
  }

  if (!nombre || !codigo || !credencial) {
    mostrarAlerta("Campos incompletos", "Por favor, completa todos los campos y sube tu credencial.", "warning");
    return;
  }

  // Crear un nuevo usuario
  const usuario = new Usuario(correo, password, nombre, codigo);

  // Crear un FormData para enviar los datos y el archivo
  const formData = new FormData();
  formData.append("email", usuario.email);
  formData.append("full_name", usuario.full_name);
  formData.append("student_code", usuario.student_code);
  formData.append("password", usuario.password);
  formData.append("confirm_password", confirmPassword);
  formData.append("file", credencial); // Agrega el archivo de la credencial

  try {
    // Enviar solicitud al backend
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: "POST",
      body: formData, // Envía el FormData directamente
    });


    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Error en el registro");
    }

    mostrarAlerta("Registro exitoso", data.message, "success", () => {
      window.location.href = "login.html"; // Redirigir al login después de registrar

    });

  } catch (error) {
    console.error("Error en POST:", error);
    mostrarAlerta("Error en el servidor", error.message, "error");
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
    if (result.isConfirmed) {
      window.location.href = "/verification.html";
    }
  });
}
