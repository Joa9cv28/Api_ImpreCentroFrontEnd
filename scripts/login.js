function login() {
  const email = document.getElementById('email').value.trim();
  const studentCode = document.getElementById('student-code').value.trim();
  const password = document.getElementById('password').value.trim();

  const correoValido = /^[a-zA-Z]+\.[a-zA-Z]+[0-9]+@(alumnos|academicos)\.udg\.mx$/;
  const codigoValido = /^\d{8,}$/;  // Mínimo 8 dígitos

  if (!correoValido.test(email)) {
    Swal.fire({
      title: 'Correo inválido',
      text: 'Debe ser un correo institucional válido',
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  if (!codigoValido.test(studentCode)) {
    Swal.fire({
      title: 'Código inválido',
      text: 'El código de estudiante debe ser numérico y tener al menos 8 dígitos',
      icon: 'warning',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  if (password.length < 8) {
    Swal.fire({
      title: 'Contraseña demasiado corta',
      text: 'La contraseña debe tener al menos 8 caracteres',
      icon: 'warning',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  // Crear FormData y enviar
  const formData = new FormData();
  formData.append("student_code", studentCode);
  formData.append("password", password);

  fetch("http://127.0.0.1:8000/api/login/", {
    method: "POST",
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.detail || "Error de autenticación");
      });
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem("access_token", data.access_token);

    Swal.fire({
      title: 'Ingreso exitoso!',
      text: 'Sesión iniciada correctamente.',
      icon: 'success',
      confirmButtonText: 'Continuar'
    }).then(() => {
      localStorage.setItem("user_email", email);
      window.location.href = "index.html";
    });
  })
  .catch(error => {
    Swal.fire({
      title: 'Error al iniciar sesión',
      text: error.message || 'Ocurrió un error inesperado',
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
  });
}
