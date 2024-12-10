// import { Archivo, Login, Usuario } from './classes.js';
// import { enviarPOST, enviarPUT } from './requests.js';

class Login{
  constructor(correo,password){
    this.correo = correo;
    this.password = password;
  } 
}
function login() {
  let log = new Login(document.getElementById('email').value,document.getElementById('password').value);
  const Regex = new RegExp("^[a-zA-Z]+\.[a-zA-Z]+[0-9]+@(alumnos|academicos)\.udg\.mx$");
  
  if (log.password.length >= 8 && log.password != null && Regex.test(log.correo)) {
    md5_pass = hex_md5(log.password);
    log.password = btoa(md5_pass);
    console.log(log);

        return fetch('http://127.0.0.1:8000/api/login', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(log) // Convertimos el objeto a JSON y lo enviamos
      })
      .then(response => response.json()) // Analizamos la respuesta como JSON
      .then(data => {
        if(!data.success){
          Swal.fire({
            title: 'Correo o contraseña incorrecta!',
            text: 'Corrobora la información ingresada',
            icon: 'error',
            confirmButtonText: 'Entendido!'
          });
        }
        
      })
      .catch(error => {
          console.error("Error en POST:", error);
      });
  }
  else{
      if(!Regex.test(log.correo))
        Swal.fire({
          title: 'Ojo!',
          text: 'El correo debe coincidir con el formato: example.example@alumnos/academicos.udg.mx',
          icon: 'error',
          confirmButtonText: 'Entendido!'
      })
      else {
        Swal.fire({
          title: 'Ojo!',
          text: 'Corrobora la información ingresada',
          icon: 'error',
          confirmButtonText: 'Entendido!'
        })
      }
  }
}