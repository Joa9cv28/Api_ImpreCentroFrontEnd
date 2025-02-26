// Clase para manejar datos de usuario
class Usuario {
  constructor(correo, password, nombre, codigo) {
    this.usu_correo = correo;
    this.usu_password = password;
    this.usu_nombre = nombre;
    this.usu_codigo = codigo;
  }
}

// URL base para las solicitudes al servidor
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Función para registrar un usuario
function registerUser() {
  // Captura los datos del formulario
  const correo = document.getElementById("student-email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("password-confirm").value.trim();
  const nombre = document.getElementById("student-name").value.trim();
  const codigo = document.getElementById("student-code").value.trim();

  // Expresión regular para validar el correo
  const Regex = /^[a-zA-Z]+\.[a-zA-Z]+[0-9]+@(alumnos|academicos)\.udg\.mx$/;

  // Validaciones
  if (!Regex.test(correo)) {
    Swal.fire({
      title: "Correo inválido",
      text: "El correo debe coincidir con el formato: example.example@alumnos/academicos.udg.mx",
      icon: "error",
      confirmButtonText: "Entendido!",
    });
    return;
  }

  if (password.length < 8 || password !== confirmPassword) {
    Swal.fire({
      title: "Contraseña inválida",
      text: "La contraseña debe tener al menos 8 caracteres y coincidir con la confirmación.",
      icon: "error",
      confirmButtonText: "Entendido!",
    });
    return;
  }

  if (!nombre || !codigo) {
    Swal.fire({
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos del formulario.",
      icon: "warning",
      confirmButtonText: "Entendido!",
    });
    return;
  }

  // Crear un nuevo usuario
  const md5Password = hex_md5(password);
  const encodedPassword = btoa(md5Password);
  const usuario = new Usuario(correo, encodedPassword, nombre, codigo);

  // Realizar la solicitud POST
  fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        Swal.fire({
          title: "Registro exitoso",
          text: "El usuario se registró correctamente.",
          icon: "success",
          confirmButtonText: "Entendido!",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "login.html";
          }
        });
      } else {
        Swal.fire({
          title: "Error en el registro",
          text: data.message || "No se pudo registrar el usuario.",
          icon: "error",
          confirmButtonText: "Entendido!",
        });
      }
    })
    .catch((error) => {
      console.error("Error en POST:", error);
      Swal.fire({
        title: "Error en el servidor",
        text: "Ocurrió un problema al intentar registrar el usuario.",
        icon: "error",
        confirmButtonText: "Entendido!",
      });
    });
}
