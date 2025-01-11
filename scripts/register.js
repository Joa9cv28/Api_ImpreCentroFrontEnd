class Usuario {
  constructor(correo, password, nombre, codigo) {
    this.usu_correo = correo;
    this.usu_password = password;
    this.usu_nombre = nombre;
    this.usu_codigo = codigo;
  }
}

function registerUser() {
  const correo = document.getElementById("student-email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("password-confirm").value;
  const nombre = document.getElementById("student-name").value;
  const codigo = document.getElementById("student-code").value;

  const Regex = new RegExp("^[a-zA-Z]+\\.[a-zA-Z]+[0-9]+@(alumnos|academicos)\\.udg\\.mx$");

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

  const md5Password = hex_md5(password);
  const encodedPassword = btoa(md5Password);
  const usuario = new Usuario(correo, encodedPassword, nombre, codigo);

  fetch("http://127.0.0.1:8000/api/usuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then((response) => response.json())
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
          text: data.message,
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
