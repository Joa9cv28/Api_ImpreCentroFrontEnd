function login() {
  const email = document.querySelector('#email').value; 
  const password = document.querySelector('#password').value;
  const Regex = new RegExp("^[a-zA-Z]+\.[a-zA-Z]+[0-9]+@(alumnos|academicos)\.udg\.mx$");
  
  if (password.length >= 8 && password != null && Regex.test(email)) {
        md5_pass = hex_md5(password);
        pass64coded = btoa(md5_pass);
        console.log(pass64coded);
        

        
        return $.ajax({
              url: 'http://127.0.0.1:8000/api/archivos',
              method: 'GET'
        });
  }
  else{
      if(!Regex.test(email))
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