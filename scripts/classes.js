// Clase Usuario
class Usuario {
  constructor(id, correo, password, nombre, codigo) {
    this.id = id;
    this.correo = correo;
    this.password = password;
    this.nombre = nombre;
    this.codigo = codigo;
  }
}

// Clase Archivo
class Archivo {
  constructor(id, nombre, ruta, tiempo, fecha, usuario) {
    this.id = id;
    this.nombre = nombre;
    this.ruta = ruta;
    this.tiempo = tiempo;
    this.fecha = fecha;
    usuario = Usuario;
  }
}

//Clase Login


// Exportamos las clases 
export { Usuario, Archivo, Login};